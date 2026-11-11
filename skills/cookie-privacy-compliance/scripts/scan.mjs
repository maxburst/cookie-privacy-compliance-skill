#!/usr/bin/env node
// Consent scanner: loads a site in a clean headless browser under several
// consent scenarios and records what is stored and which third parties are
// contacted in each phase. It reports facts; whether a fact is a violation
// depends on the legal regime, which the skill decides.
//
// Usage:
//   node scan.mjs <url> [options]
//
// Options:
//   --out <dir>            Output directory (default ./consent-scan-<host>-<timestamp>)
//   --scenarios <list>     Comma list of: baseline,reject,accept,gpc,withdraw (default baseline,reject,accept,gpc)
//   --pages <n>            Pages to visit per scenario incl. the start URL (default 3)
//   --coverage <mode>      sample (default): start URL plus a few varied internal links
//                          types: read the sitemap, group URLs by page type, visit some of each type in every scenario
//                          all: visit every sitemap URL in the baseline scenario; other scenarios use the per-type sample
//   --sitemap <url>        Sitemap to use (default: discovered from robots.txt and common locations;
//                          if none exists the site is crawled by following internal links)
//   --per-type <n>         Pages per type in the per-type sample (default 1)
//   --max-pages <n>        Cap on pages per scenario for types/all (default 40 for types, 300 for all)
//   --all-scenarios        With --coverage all, visit every page in every scenario, not only baseline
//   --extra-url <url>      Additional page to visit in every scenario (repeatable)
//   --wait <ms>            Settle time after each load/click (default 6000)
//   --idle <ms>            Extra no-input wait on first load of the baseline scenario (default 14000), to catch
//                          tags released by an idle timer. Use 0 to skip.
//   --locale <tag>         Browser locale, e.g. de-DE (default en-US)
//   --timezone <tz>        Browser timezone, e.g. Europe/Berlin
//   --proxy <url>          Proxy server, e.g. http://user:pass@host:port, to scan from another country
//   --mobile               Use a phone viewport and user agent
//   --headful              Show the browser window
//   --cookie-db <csv>      Path to Open Cookie Database CSV for wider cookie classification
//   --no-ipcheck           Skip the lookup of which country the scan runs from
//
// Output: results.json (everything), summary.md (readable digest), screenshots/*.png

import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { classifyRequest, classifyCookie, siteOf, NEEDS_CONSENT, decodeGcs, decodeGcd } from './classify.mjs';

let chromium, devices;
try {
  ({ chromium, devices } = await import('playwright'));
} catch {
  console.error('Playwright is not installed for this script. Run once:\n  npm install --prefix "' + path.dirname(new URL(import.meta.url).pathname) + '" && npx --prefix "' + path.dirname(new URL(import.meta.url).pathname) + '" playwright install chromium');
  process.exit(2);
}

// ---------- args ----------
const argv = process.argv.slice(2);
const opts = { scenarios: 'baseline,reject,accept,gpc', pages: 3, wait: 6000, idle: 14000, locale: 'en-US', extra: [], coverage: 'sample', perType: 1 };
let startUrl = null;
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  const next = () => argv[++i];
  if (a === '--out') opts.out = next();
  else if (a === '--scenarios') opts.scenarios = next();
  else if (a === '--pages') opts.pages = parseInt(next(), 10);
  else if (a === '--coverage') opts.coverage = next();
  else if (a === '--sitemap') opts.sitemap = next();
  else if (a === '--per-type') opts.perType = parseInt(next(), 10);
  else if (a === '--max-pages') opts.maxPages = parseInt(next(), 10);
  else if (a === '--all-scenarios') opts.allScenarios = true;
  else if (a === '--extra-url') opts.extra.push(next());
  else if (a === '--wait') opts.wait = parseInt(next(), 10);
  else if (a === '--idle') opts.idle = parseInt(next(), 10);
  else if (a === '--locale') opts.locale = next();
  else if (a === '--timezone') opts.timezone = next();
  else if (a === '--proxy') opts.proxy = next();
  else if (a === '--mobile') opts.mobile = true;
  else if (a === '--headful') opts.headful = true;
  else if (a === '--cookie-db') opts.cookieDb = next();
  else if (a === '--no-ipcheck') opts.noIpcheck = true;
  else if (a === '-h' || a === '--help') { console.log(fs.readFileSync(new URL(import.meta.url), 'utf8').split('\n').filter((l) => l.startsWith('//')).map((l) => l.slice(3)).join('\n')); process.exit(0); }
  else if (!a.startsWith('--')) startUrl = a;
  else { console.error('Unknown option ' + a); process.exit(2); }
}
if (!['sample', 'types', 'all'].includes(opts.coverage)) { console.error('--coverage must be sample, types or all'); process.exit(2); }
if (!startUrl) { console.error('Usage: node scan.mjs <url> [options]   (--help for options)'); process.exit(2); }
if (!/^https?:\/\//.test(startUrl)) startUrl = 'https://' + startUrl;
const startHost = new URL(startUrl).hostname;
const firstPartySite = siteOf(startHost);
const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const outDir = path.resolve(opts.out || `consent-scan-${startHost}-${stamp}`);
fs.mkdirSync(path.join(outDir, 'screenshots'), { recursive: true });

// ---------- optional Open Cookie Database ----------
let cookieDb = null;
if (opts.cookieDb) {
  const catMap = { Functional: 'functional', Analytics: 'analytics', Marketing: 'advertising', Security: 'necessary', Personalization: 'functional' };
  cookieDb = { exact: new Map(), wild: [] };
  const lines = fs.readFileSync(opts.cookieDb, 'utf8').split(/\r?\n/).slice(1);
  for (const line of lines) {
    // ID,Platform,Category,Cookie / Data Key name,Domain,Description,Retention period,Data Controller,User Privacy & GDPR Rights Portals,Wildcard match
    const cols = line.match(/("([^"]|"")*"|[^,]*)(,|$)/g)?.map((c) => c.replace(/,$/, '').replace(/^"|"$/g, '').replace(/""/g, '"')) || [];
    if (cols.length < 5 || !cols[3]) continue;
    const entry = { vendor: cols[1] || 'Unknown', category: catMap[cols[2]] || 'unclassified' };
    if (cols[9] === '1') cookieDb.wild.push({ prefix: cols[3], ...entry }); else cookieDb.exact.set(cols[3], entry);
  }
}

// ---------- consent tool knowledge ----------
const CMP_SELECTORS = [
  // name, banner container, accept, reject, settings
  ['OneTrust', '#onetrust-banner-sdk', '#onetrust-accept-btn-handler', '#onetrust-reject-all-handler', '#onetrust-pc-btn-handler'],
  ['Cookiebot', '#CybotCookiebotDialog', '#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll, #CybotCookiebotDialogBodyButtonAccept', '#CybotCookiebotDialogBodyButtonDecline', '#CybotCookiebotDialogBodyLevelButtonCustomize'],
  ['CookieYes', '.cky-consent-container', '.cky-btn-accept', '.cky-btn-reject', '.cky-btn-customize'],
  ['Complianz', '.cmplz-cookiebanner', '.cmplz-cookiebanner .cmplz-accept', '.cmplz-cookiebanner .cmplz-deny', '.cmplz-cookiebanner .cmplz-view-preferences'],
  ['Usercentrics', '#usercentrics-root, #usercentrics-cmp-ui', '[data-testid="uc-accept-all-button"], #accept', '[data-testid="uc-deny-all-button"], #deny', '[data-testid="uc-more-button"], #more'],
  ['Didomi', '#didomi-notice, #didomi-popup', '#didomi-notice-agree-button', '#didomi-notice-disagree-button, .didomi-continue-without-agreeing', '#didomi-notice-learn-more-button'],
  ['Klaro', '.klaro .cookie-notice, .klaro .cookie-modal', '.klaro .cm-btn-success', '.klaro .cn-decline, .klaro .cm-btn-decline', '.klaro .cm-link.cn-learn-more'],
  ['Borlabs Cookie', '#BorlabsCookieBox, .brlbs-cmpnt-container', '[data-cookie-accept-all], .brlbs-btn-accept-all', '[data-cookie-refuse], .brlbs-btn-accept-only-essential', '[data-cookie-individual], .brlbs-cmpnt-btn-preferences'],
  ['iubenda', '#iubenda-cs-banner', '.iubenda-cs-accept-btn', '.iubenda-cs-reject-btn', '.iubenda-cs-customize-btn'],
  ['Termly', '#termly-code-snippet-support [role="alertdialog"], [aria-label="Cookie Consent Banner"]', '[data-tid="banner-accept"]', '[data-tid="banner-decline"]', '[data-tid="banner-preferences"]'],
  ['Osano', '.osano-cm-window', '.osano-cm-accept-all', '.osano-cm-denyAll, .osano-cm-deny', '.osano-cm-manage'],
  ['Cookie Notice (Hu-manity)', '#cookie-notice', '#cn-accept-cookie', '#cn-refuse-cookie', null],
  ['GDPR Cookie Consent (legacy CookieYes/WebToffee)', '#cookie-law-info-bar', '#cookie_action_close_header, .cli_action_button[data-cli_action="accept_all"], #wt-cli-accept-all-btn', '#cookie_action_close_header_reject, .cli_action_button[data-cli_action="reject"]', '.cli_settings_button'],
  ['GDPR Cookie Compliance (Moove)', '#moove_gdpr_cookie_info_bar', '.moove-gdpr-infobar-allow-all', '.moove-gdpr-infobar-reject-btn', '.moove-gdpr-infobar-settings-btn'],
  ['Axeptio', '#axeptio_overlay', '#axeptio_btn_acceptAll', '#axeptio_btn_dismiss', '#axeptio_btn_configure'],
  ['CookieScript', '#cookiescript_injected', '#cookiescript_accept', '#cookiescript_reject', '#cookiescript_manage'],
  ['Shopify privacy banner', '#shopify-pc__banner', '#shopify-pc__banner__btn-accept', '#shopify-pc__banner__btn-decline', '#shopify-pc__banner__btn-manage-prefs'],
  ['vanilla-cookieconsent', '#cc-main .cm, #cc--main', '#cc-main [data-role="all"], #c-bns #c-p-bn', '#cc-main [data-role="necessary"], #c-bns #c-s-bn', '#cc-main [data-role="show"]'],
  ['TrustArc', '#truste-consent-track, #consent_blackbar', '#truste-consent-button', '#truste-consent-required', '#truste-show-consent'],
  ['Real Cookie Banner', '[id^="a"][consent-skip-blocker], div[class*="rcb-"], #rcb-banner', null, null, null],
  ['WPConsent', '#wpconsent-root, .wpconsent-banner-holder', '#wpconsent-accept-all, .wpconsent-accept-all', '#wpconsent-cancel-all, .wpconsent-cancel-cookies', '#wpconsent-preferences-all, .wpconsent-preferences-cookies'],
  ['HubSpot banner', '#hs-eu-cookie-confirmation, #hs-banner-parent', '#hs-eu-confirmation-button', '#hs-eu-decline-button', '#hs-eu-cookie-settings-button'],
  ['CookieFirst', '.cookiefirst-root', '[data-cookiefirst-action="accept"]', '[data-cookiefirst-action="reject"]', '[data-cookiefirst-action="adjust"]'],
  ['Civic Cookie Control', '#ccc', '#ccc-notify-accept, #ccc-recommended-settings', '#ccc-notify-reject, #ccc-reject-settings', '.ccc-notify-link'],
  ['consentmanager', '#cmpbox', '.cmpboxbtnyes', '.cmpboxbtnno', '.cmpboxbtncustom'],
  ['Quantcast Choice', '.qc-cmp2-container', '.qc-cmp2-summary-buttons button[mode="primary"]', '.qc-cmp2-summary-buttons button[mode="secondary"]:not(:has-text("OPTIONS")):not(:has-text("PARTNERS"))', null],
  ['Sourcepoint', 'iframe[id^="sp_message_iframe"]', null, null, null],
  ['Google Funding Choices', '.fc-consent-root', '.fc-cta-consent', '.fc-cta-do-not-consent', '.fc-cta-manage-options'],
];

const RX = {
  accept: /^(yes,?\s*)?(accept|allow|agree|consent)(\s+(to\s+)?(all|everything))?(\s+(cookies?|tracking))?(\s*(&|and)\s*(close|continue))?!?$|^(i\s+)?(agree|accept|understand)$|^(got it|ok|okay|yes|fine by me|that'?s ok|enable all|allow all cookies|accept all cookies|accept & close|accept and continue)!?$|^(alle\s+(cookies\s+)?(akzeptieren|zulassen|annehmen|erlauben)|akzeptieren|zustimmen|einverstanden|ich stimme zu|verstanden|tout accepter|accepter(\s+et\s+(fermer|continuer))?|j'accepte|ok pour moi|aceptar(\s+(todo|todas|todas las cookies))?|acepto|de acuerdo|accetta(\s+(tutto|tutti|e chiudi))?|accetto|aceitar(\s+(tudo|todos))?|concordo|alles accepteren|accepteren|akkoord|alle cookies toestaan|godkänn alla|acceptera(\s+alla)?|jag godkänner|tillad alle|accepter alle|godta alle|godkjenn alle|hyväksy(\s+kaikki)?|zaakceptuj(\s+wszystk\w*)?|akceptuję|zgadzam się|přijmout(\s+vše)?|souhlasím|elfogadom|összes elfogadása|accept toate|принять(\s+все)?|согласен|принимаю|同意|接受|全部接受|すべて同意(する)?|同意する|모두 동의|동의)$/i,
  reject: /^(reject|decline|deny|refuse|disable|disallow)(\s+(all|everything|non-?essential|optional))?(\s+(cookies?|tracking))?$|^(i\s+)?(disagree|decline|do not (accept|agree|consent)|don'?t (accept|agree))$|^(no,?\s*thanks?|no thank you|no|opt out|only (necessary|essential|required|strictly necessary)(\s+cookies)?|(necessary|essential|required)(\s+cookies)?\s+only|use (necessary|essential) cookies only|accept (only\s+)?(necessary|essential|required)(\s+only)?(\s+cookies)?|allow (only\s+)?(necessary|essential)(\s+only)?(\s+cookies)?|continue without (accepting|agreeing|consent)|reject all cookies|reject additional cookies|reject optional cookies)$|^(alle\s+)?ablehnen$|^(alle ablehnen|nur (notwendige|essenzielle|erforderliche|technisch notwendige)(\s+cookies)?(\s+(akzeptieren|zulassen|erlauben))?|ohne (einwilligung|zustimmung) fortfahren|verweigern|tout refuser|refuser(\s+tout)?|je refuse|continuer sans accepter|rechazar(\s+(todo|todas|todas las cookies))?|denegar|solo (las\s+)?necesarias|rifiuta(\s+(tutto|tutti))?|rifiuto|solo necessari|continua senza accettare|rejeitar(\s+(tudo|todos))?|recusar(\s+(tudo|todos))?|apenas necessários|weigeren|alles weigeren|afwijzen|alles afwijzen|alleen noodzakelijk(e)?(\s+cookies)?|avvisa(\s+alla)?|neka(\s+alla)?|endast nödvändiga|afvis(\s+alle)?|kun nødvendige|avvis alle|bare nødvendige|hylkää(\s+kaikki)?|vain välttämättömät|odrzuć(\s+wszystk\w*)?|odmawiam|tylko niezbędne|odmítnout(\s+vše)?|pouze nezbytné|elutasít(om)?|refuz|отклонить(\s+все)?|отказаться|только необходимые|拒绝|全部拒绝|拒否(する)?|すべて拒否|거부|모두 거부)$/i,
  settings: /(settings|preferences|customi[sz]e|manage|options|choices|more info|learn more|let me choose|configure|einstellungen|anpassen|optionen|individuelle|paramétrer|personnaliser|gérer|configurar|personalizar|preferencias|preferenze|personalizza|gestisci|instellingen|voorkeuren|inställningar|indstillinger|innstillinger|asetukset|ustawienia|dostosuj|nastavení|beállítások|настро)/i,
  save: /^(save|confirm|submit|apply)(\s+(and|&)\s+(close|exit|continue))?(\s+(my|your|current))?(\s+(choices?|preferences|settings|selection))?$|^(auswahl (speichern|bestätigen)|speichern(\s+(und|&)\s+schließen)?|enregistrer(\s+(mes choix|et fermer))?|valider mes choix|guardar(\s+(preferencias|configuración|selección))?|salva(\s+(preferenze|e chiudi))?|conferma(\s+le mie scelte)?|opslaan|voorkeuren opslaan|spara(\s+inställningar)?|gem(\s+indstillinger)?|lagre|tallenna|zapisz(\s+ustawienia)?|uložit(\s+nastavení)?|mentés|сохранить)$/i,
  bannerWords: /cookie|consent|privacy|tracking|gdpr|datenschutz|einwilligung|confidentialité|traceur|privacidad|consentimiento|riservatezza|consenso|privacidade|toestemming|samtycke|samtykke|evästeet|ciastecz|prywatno|soukromí|sütik|конфиденциальн|куки|クッキー|쿠키|隐私/i,
};

// Runs in the page. Walks the DOM including open shadow roots.
function pageProbe({ bannerWords }) {
  const rxBanner = new RegExp(bannerWords, 'i');
  const all = [];
  const walk = (root) => {
    for (const el of root.querySelectorAll('*')) {
      all.push(el);
      if (el.shadowRoot) walk(el.shadowRoot);
    }
  };
  walk(document);
  const visible = (el) => {
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return false;
    const s = getComputedStyle(el);
    return s.visibility !== 'hidden' && s.display !== 'none' && parseFloat(s.opacity || '1') > 0.05;
  };
  const textOf = (el) => (el.innerText || el.value || el.getAttribute('aria-label') || el.textContent || '').replace(/\s+/g, ' ').trim();

  // --- banner candidates: fixed/sticky/dialog elements mentioning cookies ---
  let banner = null;
  let bestScore = 0;
  for (const el of all) {
    const s = getComputedStyle(el);
    const isOverlay = s.position === 'fixed' || s.position === 'sticky' || el.getAttribute('role') === 'dialog' || el.getAttribute('role') === 'alertdialog' || el.tagName === 'DIALOG';
    if (!isOverlay || !visible(el)) continue;
    const t = textOf(el);
    if (t.length < 20 || t.length > 6000 || !rxBanner.test(t)) continue;
    const btns = el.querySelectorAll('button, a, [role="button"], input[type="button"], input[type="submit"]').length;
    if (!btns) continue;
    const score = 10 + Math.min(btns, 6) - Math.min(t.length / 1500, 4);
    if (score > bestScore) { bestScore = score; banner = el; }
  }

  // --- clickable controls, tagged so the scanner can click them by attribute ---
  let n = 0;
  const controls = [];
  for (const el of all) {
    const tag = el.tagName;
    const clickable = tag === 'BUTTON' || tag === 'A' || el.getAttribute('role') === 'button' || (tag === 'INPUT' && /^(button|submit)$/.test(el.type)) || (tag === 'SPAN' && el.getAttribute('tabindex') !== null) || (tag === 'DIV' && el.getAttribute('tabindex') !== null && el.onclick !== undefined && (el.className || '').toString().match(/btn|button/i));
    if (!clickable || !visible(el)) continue;
    const text = textOf(el);
    if (!text || text.length > 70) continue;
    const id = String(n++);
    el.setAttribute('data-pcscan', id);
    const r = el.getBoundingClientRect();
    const s = getComputedStyle(el);
    controls.push({
      id, text, tag,
      inBanner: !!(banner && (banner.contains(el) || (el.getRootNode().host && banner.contains(el.getRootNode().host)))),
      w: Math.round(r.width), h: Math.round(r.height), x: Math.round(r.x), y: Math.round(r.y),
      bg: s.backgroundColor, color: s.color, fontSize: s.fontSize, fontWeight: s.fontWeight, border: s.borderTopWidth + ' ' + s.borderTopColor, underline: s.textDecorationLine,
    });
  }

  // --- consent tool fingerprints ---
  const w = window;
  const cmp = [];
  const has = (name, test) => { try { if (test()) cmp.push(name); } catch {} };
  has('OneTrust', () => w.OneTrust || w.OptanonActiveGroups !== undefined);
  has('Cookiebot', () => w.Cookiebot || w.CookieConsent?.consent);
  has('CookieYes', () => w.getCkyConsent || w.cookieyes || document.querySelector('.cky-consent-container'));
  has('Complianz', () => w.complianz || w.cmplz_categories || document.querySelector('.cmplz-cookiebanner'));
  has('Usercentrics', () => w.UC_UI || w.usercentrics || w.__ucCmp);
  has('Didomi', () => w.Didomi || w.didomiOnReady);
  has('Klaro', () => w.klaro || w.klaroConfig);
  has('Borlabs Cookie', () => w.BorlabsCookie || w.borlabsCookieConfig);
  has('iubenda', () => w._iub);
  has('Termly', () => w.Termly || document.querySelector('script[src*="termly.io"]'));
  has('Osano', () => w.Osano);
  has('Axeptio', () => w.axeptioSDK || w._axcb);
  has('CookieScript', () => w.CookieScript);
  has('Shopify Customer Privacy', () => w.Shopify?.customerPrivacy);
  has('TrustArc', () => w.truste);
  has('Sourcepoint', () => w._sp_);
  has('consentmanager', () => w.cmp_id || w.__cmp);
  has('Real Cookie Banner', () => w.consentApi || document.querySelector('script[id^="real-cookie-banner"]'));
  has('WPConsent', () => w.WPConsent || w.wpconsent);
  has('Cookie Notice (Hu-manity)', () => w.cnArgs || w.huOptions);
  has('GDPR Cookie Consent (legacy CookieYes/WebToffee)', () => w.Cli_Data || w.CLI);
  has('GDPR Cookie Compliance (Moove)', () => w.moove_frontend_gdpr_scripts);
  has('vanilla-cookieconsent', () => w.CookieConsent?.acceptCategory || w.initCookieConsent);
  has('HubSpot banner', () => w._hsp && document.querySelector('#hs-eu-cookie-confirmation'));
  has('Google Funding Choices', () => w.googlefc);
  has('Ketch', () => w.ketch || w.semaphore);
  has('Transcend', () => w.transcend || w.airgap);
  has('Civic Cookie Control', () => w.CookieControl);
  has('CookieFirst', () => w.CookieFirst);
  has('CookieHub', () => w.cookiehub);
  has('Cookie Information', () => w.CookieInformation);
  has('WP Consent API', () => typeof w.wp_has_consent === 'function');

  // --- Google consent mode commands in dataLayer, in order ---
  const dl = [];
  try {
    (w.dataLayer || []).forEach((e, i) => {
      if (!e) return;
      if (e[0] === 'consent') dl.push({ i, cmd: 'consent ' + e[1], value: JSON.parse(JSON.stringify(e[2] || {})) });
      else if (e[0] === 'config') dl.push({ i, cmd: 'config', value: String(e[1]) });
      else if (e[0] === 'js') dl.push({ i, cmd: 'js' });
      else if (e.event === 'gtm.js') dl.push({ i, cmd: 'gtm.js' });
      else if (typeof e.event === 'string' && /consent|cookie|cmplz|cky|onetrust|optanon/i.test(e.event)) dl.push({ i, cmd: 'event ' + e.event });
    });
  } catch {}

  // --- page facts ---
  const linkFacts = {};
  const linkRx = {
    privacyPolicy: /privacy (policy|notice|statement)|^privacy$|datenschutz|politique de confidentialité|confidentialité|política de privacidad|privacidad|informativa (sulla )?privacy|privacybeleid|privacyverklaring|integritetspolicy|política de privacidade|polityka prywatności/i,
    cookiePolicy: /cookie (policy|notice|statement|declaration)|^cookies$|cookie-richtlinie|politique (de|relative aux) cookies|política de cookies|cookiebeleid/i,
    cookieSettings: /cookie (settings|preferences)|manage (cookies|consent|preferences)|consent preferences|privacy settings|cookie-einstellungen|gérer (les|mes) cookies|configuración de cookies|preferenze cookie/i,
    doNotSell: /do not sell|don'?t sell|do not share|your privacy choices|your california privacy|opt[- ]out (of|preferences)|limit the use of my sensitive/i,
    healthPrivacy: /consumer health (data )?privacy/i,
    imprint: /impressum|imprint|legal notice|mentions légales|aviso legal|note legali/i,
    terms: /terms( of (service|use)| (and|&) conditions)?$|^agb$|conditions générales/i,
    accessibility: /accessibility/i,
  };
  for (const a of document.querySelectorAll('a[href], button')) {
    const t = textOf(a);
    if (!t || t.length > 80) continue;
    for (const [k, rx] of Object.entries(linkRx)) {
      if (!linkFacts[k] && rx.test(t)) linkFacts[k] = { text: t, href: a.href || null };
    }
  }
  const iframes = [...document.querySelectorAll('iframe')].map((f) => f.src || f.getAttribute('data-src') || '').filter(Boolean).slice(0, 40);
  const forms = [...document.querySelectorAll('form')].map((f) => ({
    action: (f.getAttribute('action') || '').slice(0, 120),
    fields: [...f.querySelectorAll('input, textarea, select')].map((i) => i.type === 'hidden' ? null : (i.type || i.tagName.toLowerCase()) + (i.name ? ':' + i.name : '')).filter(Boolean).slice(0, 15),
    hasEmail: !!f.querySelector('input[type="email"], input[name*="email" i]'),
    hasConsentCheckbox: !!f.querySelector('input[type="checkbox"]'),
    checkboxPrechecked: !!f.querySelector('input[type="checkbox"][checked]'),
    mentionsPrivacy: /privacy|datenschutz|confidentialité|privacidad/i.test(f.innerText || ''),
  })).slice(0, 15);
  const blockedScripts = document.querySelectorAll('script[type="text/plain"], script[type="javascript/blocked"], script[data-cookieconsent], script[data-category], script[data-cmplz-src], script[data-borlabs-cookie-script-blocker-id]').length;
  const delayedScripts = document.querySelectorAll('script[type="rocketlazyloadscript"], script[type="pmdelayedscript"], script[type="litespeed/javascript"], script[data-flying-scripts], script[type$="-text/javascript"]').length;
  const generator = document.querySelector('meta[name="generator"]')?.content || null;
  const hints = [];
  const html = document.documentElement.outerHTML.slice(0, 400000);
  if (/wp-content|wp-includes/.test(html)) hints.push('WordPress');
  if (/wp-content\/plugins\/woocommerce\//.test(html) || document.body.classList.contains('woocommerce')) hints.push('WooCommerce');
  if (w.Shopify) hints.push('Shopify');
  if (w.__NEXT_DATA__ || document.querySelector('#__next') || /_next\/static/.test(html)) hints.push('Next.js');
  if (w.__NUXT__) hints.push('Nuxt');
  if (/static\.wixstatic\.com/.test(html)) hints.push('Wix');
  if (w.Static?.SQUARESPACE_CONTEXT || /static1\.squarespace\.com/.test(html)) hints.push('Squarespace');
  if (document.documentElement.hasAttribute('data-wf-site')) hints.push('Webflow');
  if (/elementor/i.test(html)) hints.push('Elementor');

  return {
    banner: banner ? { text: textOf(banner).slice(0, 1500), tag: banner.tagName, id: banner.id || null, cls: (banner.className || '').toString().slice(0, 120), rect: (({ x, y, width, height }) => ({ x: Math.round(x), y: Math.round(y), w: Math.round(width), h: Math.round(height) }))(banner.getBoundingClientRect()), viewport: { w: innerWidth, h: innerHeight } } : null,
    controls, cmp, dataLayerConsent: dl.slice(0, 60),
    apis: { tcf: typeof w.__tcfapi === 'function', gpp: typeof w.__gpp === 'function', uspapi: typeof w.__uspapi === 'function', gpcSeenByPage: navigator.globalPrivacyControl === true, wpConsentApi: typeof w.wp_has_consent === 'function', gtag: typeof w.gtag === 'function', gtm: !!w.google_tag_manager, fbq: typeof w.fbq === 'function' },
    links: linkFacts, iframes, forms, blockedScripts, delayedScripts, generator, platformHints: hints, lang: document.documentElement.lang || null, title: document.title,
  };
}

// Consent state as the page itself reports it: GPP and US Privacy strings, TCF, and the common
// consent tools' own view of which categories are on. Needed for opt-out sites, where the
// question is not "is there a banner" but "did the opt-out reach the ad stack".
async function signalProbe() {
  const w = window; const out = {};
  const withTimeout = (fn) => new Promise((res) => { const t = setTimeout(() => res(null), 1500); try { fn((v) => { clearTimeout(t); res(v); }); } catch { clearTimeout(t); res(null); } });
  if (typeof w.__gpp === 'function') { const d = await withTimeout((cb) => w.__gpp('ping', (data) => cb(data))); if (d) out.gpp = { gppString: d.gppString || null, applicableSections: d.applicableSections || null, signalStatus: d.signalStatus || null }; }
  if (typeof w.__uspapi === 'function') { const d = await withTimeout((cb) => w.__uspapi('getUSPData', 1, (data) => cb(data))); if (d) out.usprivacy = d.uspString || null; }
  if (typeof w.__tcfapi === 'function') { const d = await withTimeout((cb) => w.__tcfapi('getTCData', 2, (data) => cb(data))); if (d) out.tcf = { gdprApplies: d.gdprApplies, tcStringPresent: !!d.tcString, purposeConsents: d.purpose?.consents || null }; }
  try { if (w.OnetrustActiveGroups !== undefined) out.oneTrust = { activeGroups: w.OnetrustActiveGroups, geo: w.OneTrust?.getGeolocationData?.() || null, ruleName: w.OneTrust?.GetDomainData?.()?.GeoRuleName || null }; } catch {}
  try { if (w.Cookiebot?.consent) out.cookiebot = { ...w.Cookiebot.consent }; } catch {}
  try { if (typeof w.getCkyConsent === 'function') out.cookieYes = w.getCkyConsent()?.categories || null; } catch {}
  try { if (w.cmplz_has_consent) out.complianz = { statistics: w.cmplz_has_consent('statistics'), marketing: w.cmplz_has_consent('marketing') }; } catch {}
  try { if (w.Shopify?.customerPrivacy?.currentVisitorConsent) out.shopify = w.Shopify.customerPrivacy.currentVisitorConsent(); } catch {}
  try { if (w.google_tag_data?.ics?.entries) out.googleConsentState = Object.fromEntries(Object.entries(w.google_tag_data.ics.entries).map(([k, v]) => [k, { default: v.default, update: v.update }])); } catch {}
  out.gpcSeenByPage = navigator.globalPrivacyControl === true;
  return out;
}

function storageProbe() {
  const dump = (s) => { const o = {}; try { for (let i = 0; i < s.length; i++) { const k = s.key(i); o[k] = (s.getItem(k) || '').slice(0, 120); } } catch {} return o; };
  return { origin: location.origin, local: dump(localStorage), session: dump(sessionStorage) };
}

// ---------- scanning ----------
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const log = (...a) => console.error('[scan]', ...a);

async function vantage(browser) {
  if (opts.noIpcheck) return null;
  try {
    const ctx = await browser.newContext();
    const res = await ctx.request.get('https://www.cloudflare.com/cdn-cgi/trace', { timeout: 8000 });
    const txt = await res.text();
    await ctx.close();
    const v = { country: /loc=(\w+)/.exec(txt)?.[1] || null, colo: /colo=(\w+)/.exec(txt)?.[1] || null };
    // Region matters in the US and Canada, where rules are per state or province. Best effort.
    try { const c2 = await browser.newContext(); const r = await c2.request.get('https://ipinfo.io/json', { timeout: 6000 }); const j = await r.json(); v.region = j.region || null; await c2.close(); } catch {}
    return v;
  } catch { return null; }
}

// The page probe can mistake a "cookie settings" tab or a cookie-themed page section for a banner,
// so "still visible" means the same element as the first-layer banner, at a comparable size.
function sameBanner(a, b) {
  if (!a || !b) return false;
  const sig = (x) => `${x.tag}#${x.id || ''}.${x.cls || ''}`;
  return sig(a) === sig(b) && b.rect.w * b.rect.h >= 0.5 * a.rect.w * a.rect.h;
}

async function settle(page) {
  try { await page.waitForLoadState('networkidle', { timeout: 15000 }); } catch {}
  await sleep(opts.wait);
}

async function probeAllFrames(page) {
  const main = await page.evaluate(pageProbe, { bannerWords: RX.bannerWords.source }).catch((e) => ({ error: String(e), controls: [], cmp: [], apis: {}, links: {}, iframes: [], forms: [], dataLayerConsent: [] }));
  main.frameUrl = page.url();
  // Consent UIs that live in an iframe (Sourcepoint, TrustArc, some Usercentrics setups)
  const frameControls = [];
  for (const f of page.frames()) {
    if (f === page.mainFrame()) continue;
    const u = f.url();
    if (!/consent|cmp|privacy|cookie|sp_message|trustarc|truste|sourcepoint|privacy-mgmt|usercentrics|onetrust|didomi/i.test(u + ' ' + (f.name() || ''))) continue;
    const r = await f.evaluate(pageProbe, { bannerWords: RX.bannerWords.source }).catch(() => null);
    if (r && r.controls.length) frameControls.push({ frame: f, url: u, controls: r.controls.map((c) => ({ ...c, inBanner: true })), text: r.banner?.text || '' });
  }
  return { main, frameControls };
}

function pickControl(controls, rx, { bannerOnly }) {
  const pool = controls.filter((c) => rx.test(c.text.replace(/[›»→✓✔×✕]/g, '').trim()) && (!bannerOnly || c.inBanner));
  pool.sort((a, b) => (b.inBanner - a.inBanner) || (a.text.length - b.text.length));
  return pool[0] || null;
}

async function clickControl(scope, ctrl) {
  const loc = scope.locator(`[data-pcscan="${ctrl.id}"]`).first();
  try { await loc.click({ timeout: 4000 }); return true; } catch {}
  try { await loc.click({ timeout: 2000, force: true }); return true; } catch {}
  try { await loc.evaluate((el) => el.click()); return true; } catch {}
  return false;
}

// Try to perform "accept" or "reject". Returns a description of what happened.
async function consentAction(page, kind) {
  const steps = [];
  const { main, frameControls } = await probeAllFrames(page);
  const firstLayer = { hasBanner: !!main.banner || frameControls.length > 0, controls: [...main.controls.filter((c) => c.inBanner), ...frameControls.flatMap((f) => f.controls)].map(({ id, ...c }) => c) };

  // 1. Known consent-tool selectors
  for (const [name, container, acceptSel, rejectSel, settingsSel] of CMP_SELECTORS) {
    const sel = kind === 'accept' ? acceptSel : rejectSel;
    if (!sel) continue;
    const loc = page.locator(sel).first();
    if (await loc.isVisible().catch(() => false)) {
      const text = (await loc.innerText().catch(() => '')).trim().slice(0, 60);
      try { await loc.click({ timeout: 4000 }); } catch { await loc.evaluate((el) => el.click()).catch(() => {}); }
      steps.push({ via: 'selector', tool: name, clicked: text || sel });
      return { done: true, layer: 1, steps, firstLayer };
    }
  }
  // 2. Text heuristics, first layer (main document, then consent iframes)
  const scopes = [{ scope: page, controls: main.controls, where: 'page' }, ...frameControls.map((f) => ({ scope: f.frame, controls: f.controls, where: 'iframe ' + f.url.slice(0, 80) }))];
  for (const s of scopes) {
    const c = pickControl(s.controls, RX[kind], { bannerOnly: s.where === 'page' && !!main.banner });
    if (c && await clickControl(s.scope, c)) {
      steps.push({ via: 'text', where: s.where, clicked: c.text });
      return { done: true, layer: 1, steps, firstLayer };
    }
  }
  if (kind === 'accept') return { done: false, layer: 0, steps, firstLayer, note: 'No accept control found' };

  // 3. Reject is not on the first layer: open settings and look again.
  for (const [name, container, acceptSel, rejectSel, settingsSel] of CMP_SELECTORS) {
    if (!settingsSel) continue;
    const loc = page.locator(settingsSel).first();
    if (await loc.isVisible().catch(() => false)) {
      await loc.click({ timeout: 4000 }).catch(() => {});
      steps.push({ via: 'selector', tool: name, clicked: 'settings' });
      break;
    }
  }
  if (!steps.length) {
    for (const s of scopes) {
      const c = pickControl(s.controls, RX.settings, { bannerOnly: true });
      if (c && await clickControl(s.scope, c)) { steps.push({ via: 'text', where: s.where, clicked: c.text }); break; }
    }
  }
  if (!steps.length) return { done: false, layer: 0, steps, firstLayer, note: 'No reject control and no settings control found' };
  await sleep(1500);
  const second = await probeAllFrames(page);
  const scopes2 = [{ scope: page, controls: second.main.controls, where: 'page' }, ...second.frameControls.map((f) => ({ scope: f.frame, controls: f.controls, where: 'iframe' }))];
  for (const s of scopes2) {
    const c = pickControl(s.controls, RX.reject, { bannerOnly: false });
    if (c && await clickControl(s.scope, c)) { steps.push({ via: 'text', where: s.where, clicked: c.text }); return { done: true, layer: 2, steps, firstLayer }; }
  }
  // Last resort: saving the settings panel as-is. Only equals "reject" if toggles default to off,
  // which is itself something the report should state.
  for (const s of scopes2) {
    const c = pickControl(s.controls, RX.save, { bannerOnly: false });
    if (c && await clickControl(s.scope, c)) { steps.push({ via: 'text', where: s.where, clicked: c.text, caveat: 'Saved the default selection; equals reject only if optional toggles default to off' }); return { done: true, layer: 2, steps, firstLayer, savedDefaults: true }; }
  }
  return { done: false, layer: 2, steps, firstLayer, note: 'Opened settings but found no reject/save control' };
}

// Withdraw consent via the consent tool's own JS API where one exists.
async function withdrawViaApi(page) {
  return page.evaluate(() => {
    const w = window; const tried = [];
    const attempt = (name, fn) => { try { if (fn()) { tried.push(name); return true; } } catch (e) { tried.push(name + ' (error: ' + e.message + ')'); } return false; };
    attempt('Cookiebot.withdraw', () => w.Cookiebot?.withdraw && (w.Cookiebot.withdraw(), true)) ||
    attempt('OneTrust.RejectAll', () => w.OneTrust?.RejectAll && (w.OneTrust.RejectAll(), true)) ||
    attempt('cmplz_deny_all', () => typeof w.cmplz_deny_all === 'function' && (w.cmplz_deny_all(), true)) ||
    attempt('Didomi.setUserDisagreeToAll', () => w.Didomi?.setUserDisagreeToAll && (w.Didomi.setUserDisagreeToAll(), true)) ||
    attempt('UC_UI.denyAllConsents', () => w.UC_UI?.denyAllConsents && (w.UC_UI.denyAllConsents(), true)) ||
    attempt('klaro.getManager().changeAll(false)', () => w.klaro?.getManager && (w.klaro.getManager().changeAll(false), w.klaro.getManager().saveAndApplyConsents(), true)) ||
    attempt('CookieConsent.acceptCategory([])', () => w.CookieConsent?.acceptCategory && (w.CookieConsent.acceptCategory([]), true)) ||
    attempt('Osano.cm (not scriptable)', () => false) ||
    attempt('_iub.cs.api.rejectAll', () => w._iub?.cs?.api?.rejectAll && (w._iub.cs.api.rejectAll(), true)) ||
    attempt('Shopify.customerPrivacy.setTrackingConsent(false)', () => w.Shopify?.customerPrivacy?.setTrackingConsent && (w.Shopify.customerPrivacy.setTrackingConsent({ analytics: false, marketing: false, preferences: false, sale_of_data: false }, () => {}), true)) ||
    attempt('BorlabsCookie.Consents (not scriptable)', () => false);
    return tried;
  }).catch(() => []);
}

async function snapshot(context, page) {
  const cookies = (await context.cookies()).map((c) => {
    const cls = classifyCookie(c.name, cookieDb);
    const days = c.expires > 0 ? Math.round((c.expires - Date.now() / 1000) / 86400) : null;
    return { name: c.name, domain: c.domain, thirdParty: siteOf(c.domain) !== firstPartySite, session: c.expires <= 0, lifetimeDays: days, secure: c.secure, httpOnly: c.httpOnly, sameSite: c.sameSite, valuePreview: (c.value || '').slice(0, 40), ...cls };
  });
  const storage = [];
  for (const f of page.frames()) {
    const s = await f.evaluate(storageProbe).catch(() => null);
    if (s && (Object.keys(s.local).length || Object.keys(s.session).length) && !storage.find((x) => x.origin === s.origin)) storage.push(s);
  }
  const signals = await page.evaluate(signalProbe).catch(() => null);
  return { cookies, storage, signals };
}

async function pickPages(page) {
  const links = await page.evaluate(() => [...document.querySelectorAll('a[href]')].map((a) => ({ href: a.href, text: (a.innerText || '').trim().slice(0, 60) }))).catch(() => []);
  const seen = new Set([page.url().split('#')[0]]);
  const scored = [];
  for (const l of links) {
    let u; try { u = new URL(l.href); } catch { continue; }
    if (!/^https?:$/.test(u.protocol) || siteOf(u.hostname) !== firstPartySite) continue;
    if (/\.(pdf|jpg|jpeg|png|gif|webp|zip|mp4|mp3|svg)$/i.test(u.pathname) || /logout|wp-login|wp-admin|add-to-cart|\/feed\/?$/.test(u.href)) continue;
    const clean = u.href.split('#')[0];
    if (seen.has(clean) || u.pathname === '/' ) continue;
    seen.add(clean);
    const s = /contact|kontakt/i.test(clean) ? 5 : /product|shop|store|produkt/i.test(clean) ? 4 : /blog|news|article|post|\/20\d\d\//i.test(clean) ? 3 : /about|pricing|services/i.test(clean) ? 2 : /privacy|cookie|terms|legal|impressum|datenschutz/i.test(clean) ? 0 : 1;
    scored.push({ url: clean, s });
  }
  scored.sort((a, b) => b.s - a.s);
  // one page per score bucket first, so the sample is varied
  const out = []; const used = new Set();
  for (const x of scored) { if (!used.has(x.s)) { out.push(x.url); used.add(x.s); } }
  for (const x of scored) { if (!out.includes(x.url)) out.push(x.url); }
  return out;
}

// ---------- page planning from the sitemap ----------
const ASSET_RX = /\.(pdf|jpe?g|png|gif|webp|avif|svg|zip|gz|mp4|mp3|mov|css|js|xml|json|ico|woff2?|ttf|docx?|xlsx?|pptx?)(\?|$)/i;
// Matched against the last path segment of short URLs only, so an article called "how to build a contact form" stays an article.
const SPECIAL = [['cart', /^(cart|basket|warenkorb|panier)$/i], ['checkout', /^(checkout|kasse|commande)$/i], ['account', /^(my-account|account|login|signin|register)$/i], ['contact', /^(contact(-us)?|kontakt)$/i], ['legal', /^(privacy(-policy|-notice)?|cookie(s|-policy)?|terms(-of-(use|service))?|legal|impressum|datenschutz(erklaerung)?|agb|imprint|disclaimer|do-not-(sell|track).*)$/i], ['search', /^search$/i]];

async function fetchText(ctx, url) {
  const r = await ctx.request.get(url, { timeout: 20000, maxRedirects: 5 });
  if (r.status() !== 200) return null;
  let buf = await r.body();
  if (buf[0] === 0x1f && buf[1] === 0x8b) { try { buf = zlib.gunzipSync(buf); } catch { return null; } }
  return buf.toString('utf8');
}

async function readSitemaps(ctx) {
  const origin = new URL(startUrl).origin;
  let roots = [];
  if (opts.sitemap) roots = [opts.sitemap];
  else {
    const robots = await fetchText(ctx, origin + '/robots.txt').catch(() => null);
    if (robots) roots = [...robots.matchAll(/^\s*sitemap:\s*(\S+)/gim)].map((m) => m[1]);
    if (!roots.length) roots = ['/sitemap.xml', '/sitemap_index.xml', '/wp-sitemap.xml', '/sitemap-index.xml', '/sitemap/sitemap.xml'].map((x) => origin + x);
  }
  const urls = []; const seenMaps = new Set(); const queue = roots.map((u) => ({ u, depth: 0 })); const used = [];
  while (queue.length && seenMaps.size < 80) {
    const { u, depth } = queue.shift();
    if (seenMaps.has(u)) continue; seenMaps.add(u);
    const xml = await fetchText(ctx, u).catch(() => null);
    if (!xml || !/<(urlset|sitemapindex)/i.test(xml)) continue;
    used.push(u);
    const locs = [...xml.matchAll(/<loc>\s*(?:<!\[CDATA\[)?\s*([^<\]\s]+)\s*(?:\]\]>)?\s*<\/loc>/gi)].map((m) => m[1].replace(/&amp;/g, '&'));
    if (/<sitemapindex/i.test(xml)) { if (depth < 3) for (const l of locs) queue.push({ u: l, depth: depth + 1 }); }
    else {
      // Type hint from the sitemap file name: post-sitemap2.xml -> post, wp-sitemap-posts-product-1.xml -> product
      let hint = (new URL(u).pathname.split('/').pop() || '').replace(/\.xml(\.gz)?$/i, '').replace(/^wp-sitemap-(posts|taxonomies|users)-?/, '').replace(/[-_]?sitemap[-_]?/i, '').replace(/[-_]?\d+$/, '').replace(/^[-_]+|[-_]+$/g, '');
      for (const l of locs) urls.push({ url: l, hint: hint || null });
    }
    if (urls.length > 50000) break;
  }
  return { urls, used };
}

async function crawlLinks(ctx, limit) {
  const seen = new Set([startUrl.split('#')[0]]); const queue = [startUrl]; const out = [];
  let fetched = 0;
  while (queue.length && out.length < limit && fetched < limit * 2) {
    const u = queue.shift(); fetched++;
    const html = await fetchText(ctx, u).catch(() => null);
    if (!html) continue;
    out.push({ url: u, hint: null });
    for (const m of html.matchAll(/<a\s[^>]*href=["']([^"'#]+)["']/gi)) {
      let abs; try { abs = new URL(m[1], u); } catch { continue; }
      if (!/^https?:$/.test(abs.protocol) || siteOf(abs.hostname) !== firstPartySite || ASSET_RX.test(abs.pathname)) continue;
      if (/logout|wp-login|wp-admin|add-to-cart|\/feed\/?$|replytocom/.test(abs.href)) continue;
      const clean = abs.href.split('#')[0];
      if (!seen.has(clean)) { seen.add(clean); queue.push(clean); }
    }
  }
  return out;
}

async function planPages(browser) {
  if (opts.coverage === 'sample') return null;
  const ctx = await browser.newContext({ ignoreHTTPSErrors: true });
  let { urls, used } = await readSitemaps(ctx);
  let source = used.length ? 'sitemap' : 'crawl';
  const capAll = opts.maxPages || 300;
  if (!urls.length) { log('no sitemap found; crawling internal links'); urls = await crawlLinks(ctx, opts.coverage === 'all' ? capAll : 150); }
  await ctx.close();
  // normalise, same site only, no assets
  const seen = new Set(); const list = [];
  for (const x of urls) {
    let u; try { u = new URL(x.url); } catch { continue; }
    if (siteOf(u.hostname) !== firstPartySite || ASSET_RX.test(u.pathname)) continue;
    const clean = u.href.split('#')[0]; if (seen.has(clean)) continue; seen.add(clean);
    list.push({ url: clean, hint: x.hint, path: u.pathname, search: u.search });
  }
  // Page type: a recognisable special page, else the sitemap's own grouping, else the URL shape.
  const hints = new Set(list.map((x) => x.hint).filter(Boolean));
  const firstSeg = {}; for (const x of list) { const seg = x.path.split('/').filter(Boolean)[0] || ''; firstSeg[seg] = (firstSeg[seg] || 0) + 1; }
  for (const x of list) {
    const segs = x.path.split('/').filter(Boolean);
    const special = segs.length <= 2 ? SPECIAL.find(([, rx]) => rx.test(segs[segs.length - 1] || '')) : null;
    const langPrefix = /^[a-z]{2}(-[a-z]{2})?$/i.test(segs[0] || '') ? segs[0].toLowerCase() : null;
    let type;
    if (!segs.length || (langPrefix && segs.length === 1)) type = 'home';
    else if (special) type = special[0];
    else if (hints.size > 1 && x.hint) type = x.hint;
    else { const seg = segs[langPrefix ? 1 : 0]; type = firstSeg[segs[0]] >= 3 || langPrefix ? `/${seg}/…` + (segs.length - (langPrefix ? 1 : 0) > 1 ? '' : ' (top level)') : 'top-level page'; if (segs.length === 1) type = 'top-level page'; }
    x.type = langPrefix ? `${type} [${langPrefix}]` : type;
  }
  const byType = new Map(); for (const x of list) { if (!byType.has(x.type)) byType.set(x.type, []); byType.get(x.type).push(x.url); }
  // Per-type sample: spread picks across each type (first, middle, last) so they are not all the newest posts.
  const capTypes = opts.maxPages || 40;
  const order = [...byType.entries()].sort((a, b) => b[1].length - a[1].length);
  const sample = [];
  for (const [, arr] of order) { const n = Math.min(opts.perType, arr.length); // one pick: the middle of the list (the first entry is often an archive or the newest post); several: spread evenly
    for (let i = 0; i < n; i++) sample.push(n === 1 ? arr[Math.floor(arr.length / 2)] : arr[Math.round((i * (arr.length - 1)) / (n - 1))]); }
  // Full-site order: round-robin across types, so a cap still leaves every type represented.
  const allOrdered = []; for (let i = 0; allOrdered.length < list.length; i++) for (const [, arr] of order) if (i < arr.length) allOrdered.push(arr[i]);
  const typeOf = new Map(list.map((x) => [x.url, x.type]));
  const plan = { source, sitemaps: used, totalUrls: list.length, types: order.map(([t, arr]) => ({ type: t, urls: arr.length })), sample: [...new Set(sample)].slice(0, capTypes), all: allOrdered.slice(0, capAll), typeOf, truncatedAll: list.length > capAll, truncatedTypes: sample.length > capTypes };
  log(`page plan: ${plan.totalUrls} URLs from ${source}, ${plan.types.length} types; sample ${plan.sample.length}, all ${plan.all.length}`);
  return plan;
}
let pagePlan = null;

async function runScenario(browser, name) {
  log(`scenario: ${name}`);
  const device = opts.mobile ? devices['iPhone 14'] : { viewport: { width: 1366, height: 900 } };
  const ua = (opts.mobile ? device.userAgent : (await browser.version()).replace(/^/, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/') + ' Safari/537.36');
  const context = await browser.newContext({
    ...device, userAgent: ua, locale: opts.locale, ignoreHTTPSErrors: true,
    ...(opts.timezone ? { timezoneId: opts.timezone } : {}),
    ...(name === 'gpc' ? { extraHTTPHeaders: { 'Sec-GPC': '1' } } : {}),
  });
  if (name === 'gpc') await context.addInitScript(() => { try { Object.defineProperty(Navigator.prototype, 'globalPrivacyControl', { get: () => true, configurable: true }); } catch {} });
  await context.addInitScript(() => { try { Object.defineProperty(Navigator.prototype, 'webdriver', { get: () => false }); } catch {} });

  const result = { name, phases: [], requests: [], googleConsentSignals: [], privacyStrings: [], pageProbes: [], errors: [] };
  let phase = 'load';
  let currentPage = startUrl;
  context.on('request', (req) => {
    const url = req.url();
    const c = classifyRequest(url, firstPartySite);
    if (!c) return;
    result.requests.push({ phase, page: currentPage, url: url.slice(0, 400), type: req.resourceType(), method: req.method(), ...c });
    const usp = /[?&]us_privacy=([^&]+)/.exec(url)?.[1]; const gppQ = /[?&]gpp=([^&]+)/.exec(url)?.[1];
    if (usp || gppQ) result.privacyStrings.push({ phase, host: c.host, us_privacy: usp ? decodeURIComponent(usp).slice(0, 8) : undefined, gpp: gppQ ? decodeURIComponent(gppQ).slice(0, 60) : undefined });
    if (/[?&](gcs|gcd)=/.test(url) || (req.method() === 'POST' && /google|doubleclick|\/g\/collect/.test(url))) {
      let q = url; try { const body = req.postData(); if (body && body.length < 20000) q += '&' + body; } catch {}
      const gcs = /[?&\n]gcs=([^&\s]+)/.exec(q)?.[1]; const gcd = /[?&\n]gcd=([^&\s]+)/.exec(q)?.[1];
      if (gcs || gcd) result.googleConsentSignals.push({ phase, host: c.host, endpoint: new URL(url).pathname.slice(0, 60), gcs, gcd, gcsDecoded: decodeGcs(gcs), gcdDecoded: decodeGcd(gcd), npa: /[?&]npa=1/.test(q) || undefined, dma: /[?&]dma=([01])/.exec(q)?.[1] });
    }
  });

  const page = await context.newPage();
  const endPhase = async (label, extra = {}) => {
    const snap = await snapshot(context, page);
    result.phases.push({ phase: label, url: page.url(), ...snap, ...extra });
  };
  const shot = async (label) => { try { await page.screenshot({ path: path.join(outDir, 'screenshots', `${name}-${label}.png`) }); } catch {} };

  try {
    const resp = await page.goto(startUrl, { waitUntil: 'domcontentloaded', timeout: 45000 });
    result.httpStatus = resp?.status();
    result.responseHeaders = Object.fromEntries(Object.entries(resp ? await resp.allHeaders() : {}).filter(([k]) => /^(server|x-powered-by|cache-control|x-cache|cf-cache-status|x-litespeed-cache|x-wp-.*|content-security-policy|permissions-policy|referrer-policy|link|via|x-shopify-stage|x-vercel-.*|set-cookie|vary|age)$/i.test(k)).map(([k, v]) => [k, String(v).slice(0, 300)]));
    await settle(page);
    const probe = await probeAllFrames(page);
    result.probe = probe.main;
    result.consentIframes = probe.frameControls.map((f) => ({ url: f.url.slice(0, 200), controls: f.controls.map(({ id, ...c }) => c), text: f.text.slice(0, 600) }));
    if (name === 'baseline' && opts.idle > 0) { log(`  idle wait ${opts.idle} ms with no input`); await sleep(opts.idle); }
    await shot('1-load');
    await endPhase('load');

    // Scroll: catches lazy-loaded trackers and banners that treat scrolling as consent.
    phase = 'scroll';
    // Real mouse and wheel input, because "delay JavaScript" optimisers (WP Rocket, LiteSpeed,
    // Perfmatters, Flying Scripts) hold every script until the first user input. Without this a
    // headless scan sees no trackers and gives a false pass.
    try {
      await page.mouse.move(300, 300); await page.mouse.move(420, 380, { steps: 5 });
      for (let i = 0; i < 12; i++) { await page.mouse.wheel(0, 700); await sleep(150); }
      await page.evaluate(() => window.scrollTo(0, 0));
    } catch {}
    await sleep(Math.min(opts.wait, 3000));
    // Probe again: on sites that hold scripts until first input, the banner and the consent tool
    // only exist now. Keep the fuller picture.
    const probe2 = await probeAllFrames(page);
    if (!result.probe?.banner && probe2.main.banner) { result.bannerAppearedOnlyAfterInput = true; result.probe = { ...probe2.main, platformHints: result.probe?.platformHints || probe2.main.platformHints, delayedScripts: Math.max(result.probe?.delayedScripts || 0, probe2.main.delayedScripts || 0) }; await shot('1b-after-input'); }
    else if (result.probe) { result.probe.cmp = [...new Set([...(result.probe.cmp || []), ...(probe2.main.cmp || [])])]; result.probe.apis = { ...(result.probe.apis || {}), ...Object.fromEntries(Object.entries(probe2.main.apis || {}).filter(([, v]) => v)) }; result.probe.blockedScripts = Math.max(result.probe.blockedScripts || 0, probe2.main.blockedScripts || 0); result.probe.delayedScripts = Math.max(result.probe.delayedScripts || 0, probe2.main.delayedScripts || 0); }
    if (!result.consentIframes?.length && probe2.frameControls.length) result.consentIframes = probe2.frameControls.map((f) => ({ url: f.url.slice(0, 200), controls: f.controls.map(({ id, ...c }) => c), text: f.text.slice(0, 600) }));
    await endPhase('scroll');

    if (name === 'reject' || name === 'accept' || name === 'withdraw') {
      phase = 'post-' + (name === 'withdraw' ? 'accept' : name);
      const action = await consentAction(page, name === 'withdraw' ? 'accept' : name);
      result.action = action;
      await settle(page);
      await shot('2-after-click');
      const after = await page.evaluate(pageProbe, { bannerWords: RX.bannerWords.source }).catch(() => null);
      await endPhase(phase, { bannerStillVisible: sameBanner(result.probe?.banner, after?.banner), dataLayerConsent: after?.dataLayerConsent, cookieSettingsLink: after?.links?.cookieSettings || null });
    }

    // Browse further pages
    phase = 'browse';
    let more;
    if (pagePlan) {
      const planned = opts.coverage === 'all' && (name === 'baseline' || opts.allScenarios) ? pagePlan.all : pagePlan.sample;
      const startClean = startUrl.split('#')[0].replace(/\/$/, '');
      more = [...new Set([...opts.extra, ...planned])].filter((u) => u.replace(/\/$/, '') !== startClean);
    } else more = [...opts.extra, ...(opts.pages > 1 ? (await pickPages(page)) : [])].slice(0, Math.max(0, opts.pages - 1) + opts.extra.length);
    result.pagesVisited = [startUrl];
    for (const u of more) {
      currentPage = u;
      try { log(`  page ${u}`); await page.goto(u, { waitUntil: 'domcontentloaded', timeout: 45000 }); await page.mouse.move(250, 250).catch(() => {}); await page.mouse.move(400, 360, { steps: 4 }).catch(() => {}); await page.mouse.wheel(0, 900).catch(() => {}); await settle(page); result.pagesVisited.push(u);
        const pp = await page.evaluate(pageProbe, { bannerWords: RX.bannerWords.source }).catch(() => null);
        if (pp) result.pageProbes.push({ url: u, title: pp.title, iframes: pp.iframes, forms: pp.forms, bannerVisible: !!pp.banner }); } catch (e) { result.errors.push(`visit ${u}: ${String(e).slice(0, 120)}`); }
    }
    if (more.length) {
      const p = await page.evaluate(pageProbe, { bannerWords: RX.bannerWords.source }).catch(() => null);
      await endPhase('browse', { bannerVisibleOnLastPage: result.probe?.banner ? sameBanner(result.probe.banner, p?.banner) : !!p?.banner, lastPageForms: p?.forms, lastPageIframes: p?.iframes });
    }

    if (name === 'withdraw') {
      phase = 'post-withdraw';
      const tried = await withdrawViaApi(page);
      result.withdraw = { api: tried };
      if (!tried.length) {
        // No scriptable API: look for a visible re-open control and then reject.
        const p = await probeAllFrames(page);
        const reopen = pickControl(p.main.controls, /cookie (settings|preferences)|manage (cookies|consent|preferences)|consent preferences|privacy settings|your privacy choices|cookie-einstellungen|gérer (les|mes) cookies|revisit consent|change consent/i, { bannerOnly: false });
        if (reopen && await clickControl(page, reopen)) { await sleep(1500); result.withdraw.reopen = reopen.text; result.withdraw.action = await consentAction(page, 'reject'); }
        else result.withdraw.note = 'No scriptable withdraw API and no visible control to reopen consent settings was found';
      }
      await settle(page);
      await page.reload({ waitUntil: 'domcontentloaded' }).catch(() => {});
      await settle(page);
      await shot('3-after-withdraw');
      await endPhase('post-withdraw');
    }
  } catch (e) {
    result.errors.push(String(e).slice(0, 300));
  }
  await context.close();
  return result;
}

// ---------- summarising ----------
function summarise(sc) {
  const byPhase = {};
  for (const r of sc.requests) {
    const p = (byPhase[r.phase] ||= {});
    if (r.category === 'firstparty') continue;
    const key = r.vendor + '|' + r.category;
    const v = (p[key] ||= { vendor: r.vendor, category: r.category, hosts: new Set(), count: 0 });
    v.hosts.add(r.host); v.count++;
  }
  const out = {};
  for (const [ph, m] of Object.entries(byPhase)) out[ph] = Object.values(m).map((v) => ({ ...v, hosts: [...v.hosts] })).sort((a, b) => a.category.localeCompare(b.category));
  return out;
}

const needs = (c) => NEEDS_CONSENT.has(c);
function facts(results) {
  const f = [];
  const get = (n) => results.find((r) => r.name === n);
  const base = get('baseline');
  const preCookies = (sc) => (sc?.phases.find((p) => p.phase === 'scroll') || sc?.phases.find((p) => p.phase === 'load'))?.cookies || [];
  const reqs = (sc, phases, test) => { const s = summarise(sc); return phases.flatMap((p) => s[p] || []).filter((v) => test(v.category)); };
  const names = (arr) => [...new Set(arr.map((v) => v.vendor))].join(', ');
  if (base) {
    const p = base.probe || {};
    f.push({ id: 'banner-present', value: !!p.banner || (base.consentIframes || []).length > 0, detail: p.banner ? `Banner detected (${p.banner.tag}${p.banner.id ? '#' + p.banner.id : ''})` : (base.consentIframes?.length ? 'Consent UI inside an iframe' : 'No consent banner detected from this vantage point') });
    if (base.bannerAppearedOnlyAfterInput) f.push({ id: 'banner-appears-only-after-input', value: true, detail: `The banner did not exist until the first mouse or scroll input (${p.delayedScripts || 0} scripts held by a delay-JavaScript optimiser). If trackers are released by the same input, visitors never get a choice before tracking starts.` });
    const loadOnly = reqs(base, ['load'], needs);
    f.push({ id: 'tracker-requests-with-no-input-at-all', value: loadOnly.length, detail: (names(loadOnly) || 'none') + ` (page load plus ${Math.round((opts.wait + opts.idle) / 1000)} s idle, before any mouse or scroll)` });
    f.push({ id: 'consent-tool', value: p.cmp || [], detail: (p.cmp || []).join(', ') || 'none recognised' });
    const pc = preCookies(base).filter((c) => needs(c.category));
    f.push({ id: 'pre-consent-nonessential-cookies', value: pc.length, detail: pc.map((c) => `${c.name} (${c.vendor}, ${c.category}${c.lifetimeDays ? ', ' + c.lifetimeDays + 'd' : ''})`).join('; ') || 'none' });
    const pr = reqs(base, ['load', 'scroll'], needs);
    f.push({ id: 'pre-consent-tracker-requests', value: pr.length, detail: pr.map((v) => `${v.vendor} [${v.category}] x${v.count}`).join('; ') || 'none' });
    const tm = reqs(base, ['load', 'scroll'], (c) => c === 'tagmanager');
    if (tm.length) f.push({ id: 'pre-consent-tag-manager', value: true, detail: names(tm) + ' loads before consent. Fine only if every tag inside it is consent-gated.' });
    const fn = reqs(base, ['load', 'scroll'], (c) => c === 'functional');
    if (fn.length) f.push({ id: 'pre-consent-functional-third-parties', value: fn.length, detail: names(fn) + ' (embeds, chat, captcha: need consent or a click-to-load placeholder in opt-in regimes unless the visitor asked for them)' });
    const inf = reqs(base, ['load', 'scroll'], (c) => c === 'infra');
    if (inf.length) f.push({ id: 'third-party-infrastructure', value: inf.length, detail: names(inf) + ' (visitor IP disclosed; remote Google Fonts has drawn claims in Germany)' });
    const sig = base.googleConsentSignals.filter((s) => s.phase === 'load' || s.phase === 'scroll');
    if (sig.length) f.push({ id: 'google-consent-signals-pre-consent', value: sig.length, detail: [...new Set(sig.map((s) => `${s.endpoint} gcs=${s.gcs || '-'} gcd=${s.gcd || '-'}`))].slice(0, 6).join('; ') });
    else if (pr.some((v) => /Google/.test(v.vendor))) f.push({ id: 'google-consent-signals-pre-consent', value: 0, detail: 'Google tags fired before consent with no gcs/gcd parameter: Consent Mode is not active' });
  }
  const rej = get('reject');
  if (rej) {
    f.push({ id: 'reject-available', value: !!rej.action?.done, detail: rej.action?.done ? `Rejected via ${rej.action.steps.map((s) => '"' + s.clicked + '"').join(' -> ')} (layer ${rej.action.layer}${rej.action.savedDefaults ? ', saved defaults' : ''})` : (rej.action?.note || 'reject not performed') });
    if (rej.action?.done) f.push({ id: 'reject-on-first-layer', value: rej.action.layer === 1, detail: rej.action.layer === 1 ? 'yes' : 'no, needed a second layer' });
    const last = rej.phases[rej.phases.length - 1];
    const rc = (last?.cookies || []).filter((c) => needs(c.category));
    f.push({ id: 'after-reject-nonessential-cookies', value: rc.length, detail: rc.map((c) => `${c.name} (${c.vendor})`).join('; ') || 'none' });
    const rr = reqs(rej, ['post-reject', 'browse'], needs);
    f.push({ id: 'after-reject-tracker-requests', value: rr.length, detail: rr.map((v) => `${v.vendor} [${v.category}] x${v.count}`).join('; ') || 'none' });
    const before = new Set((rej.phases.find((p) => p.phase === 'scroll')?.cookies || []).map((c) => c.name + '@' + c.domain));
    const fresh = (last?.cookies || []).filter((c) => needs(c.category) && !before.has(c.name + '@' + c.domain));
    f.push({ id: 'cookies-newly-set-after-reject', value: fresh.length, detail: fresh.map((c) => `${c.name} @${c.domain} (${c.vendor})`).join('; ') || 'none' });
    const kept = rc.length - fresh.length;
    if (kept > 0) f.push({ id: 'pre-reject-tracker-cookies-not-cleared', value: kept, detail: 'Tracker cookies set before the refusal are still present afterwards (no clean-up on reject or opt-out)' });
    const st = last?.signals;
    if (st && (st.gpp || st.usprivacy || st.oneTrust || st.googleConsentState)) f.push({ id: 'consent-state-after-reject', value: true, detail: JSON.stringify({ gpp: st.gpp?.gppString, usprivacy: st.usprivacy, oneTrust: st.oneTrust?.activeGroups, cookieYes: st.cookieYes, complianz: st.complianz, google: st.googleConsentState }).slice(0, 400) });
    const ps = rej.privacyStrings.filter((x) => x.phase !== 'load' && x.phase !== 'scroll' && x.us_privacy);
    if (ps.length) { const tally = {}; for (const x of ps) tally[x.us_privacy] = (tally[x.us_privacy] || 0) + 1; f.push({ id: 'us-privacy-strings-sent-after-reject', value: ps.length, detail: Object.entries(tally).map(([k, v]) => `${k} x${v}`).join(', ') + '. Third character Y means opted out of sale; N means not opted out.' }); }
    const sig = rej.googleConsentSignals.filter((s) => s.phase !== 'load' && s.phase !== 'scroll');
    if (sig.length) f.push({ id: 'google-consent-signals-after-reject', value: sig.length, detail: [...new Set(sig.map((s) => `gcs=${s.gcs || '-'} gcd=${s.gcd || '-'}`))].slice(0, 6).join('; ') });
    const post = rej.phases.find((p) => p.phase === 'post-reject');
    if (post) f.push({ id: 'banner-dismissed-after-reject', value: !post.bannerStillVisible, detail: post.bannerStillVisible ? 'A banner-like element is still visible after rejecting' : 'yes' });
    const br = rej.phases.find((p) => p.phase === 'browse');
    if (br) f.push({ id: 'reject-remembered-on-next-page', value: !br.bannerVisibleOnLastPage, detail: br.bannerVisibleOnLastPage ? 'Banner reappeared on a later page: the choice may not be stored' : 'yes' });
  }
  const acc = get('accept');
  if (acc) {
    f.push({ id: 'accept-available', value: !!acc.action?.done, detail: acc.action?.done ? `Accepted via "${acc.action.steps.at(-1)?.clicked}"` : (acc.action?.note || 'accept not performed') });
    const ar = reqs(acc, ['post-accept', 'browse'], needs);
    f.push({ id: 'after-accept-tracker-requests', value: ar.length, detail: [...new Set(ar.map((v) => `${v.vendor} [${v.category}]`))].join('; ') || 'none (site may have no optional trackers, or the banner is cosmetic)' });
    const last = acc.phases[acc.phases.length - 1];
    const long = (last?.cookies || []).filter((c) => needs(c.category) && c.lifetimeDays > 396);
    if (long.length) f.push({ id: 'cookies-longer-than-13-months', value: long.length, detail: long.map((c) => `${c.name} ${c.lifetimeDays}d`).join('; ') });
    const consentRec = (last?.cookies || []).filter((c) => c.category === 'cmp');
    f.push({ id: 'consent-record-cookie', value: consentRec.length, detail: consentRec.map((c) => `${c.name} ${c.session ? 'session' : c.lifetimeDays + 'd'}`).join('; ') || 'none found in cookies (may be in localStorage)' });
    const sig = acc.googleConsentSignals.filter((s) => s.phase !== 'load' && s.phase !== 'scroll');
    if (sig.length) f.push({ id: 'google-consent-signals-after-accept', value: sig.length, detail: [...new Set(sig.map((s) => `gcs=${s.gcs || '-'} gcd=${s.gcd || '-'}`))].slice(0, 6).join('; ') });
  }
  const gpc = get('gpc');
  if (gpc && base) {
    const all = ['load', 'scroll', 'browse'];
    const vset = (sc) => new Set(reqs(sc, all, needs).map((v) => v.vendor).filter((v) => v !== 'Unclassified third party'));
    const bv = vset(base), gv = vset(gpc);
    const stopped = [...bv].filter((v) => !gv.has(v)), still = [...gv];
    f.push({ id: 'gpc-vendors-still-contacted', value: still.length, detail: `Still contacted with GPC on: ${still.join(', ') || 'none'}. Stopped compared with baseline: ${stopped.join(', ') || 'none'}. A vendor that stops may be reacting to the signal by itself; the site honours GPC only if its sale/share/targeted-advertising vendors all stop or switch to a restricted mode.` });
    const bc = preCookies(base).filter((c) => needs(c.category)).length; const gc = preCookies(gpc).filter((c) => needs(c.category)).length;
    f.push({ id: 'gpc-nonessential-cookies', value: gc, detail: `baseline ${bc}, with GPC ${gc}` });
    const sg = gpc.phases.at(-1)?.signals;
    if (sg && (sg.gpp || sg.usprivacy || sg.oneTrust)) f.push({ id: 'gpc-consent-state', value: true, detail: JSON.stringify({ gpp: sg.gpp?.gppString, usprivacy: sg.usprivacy, oneTrust: sg.oneTrust?.activeGroups }).slice(0, 300) });
    const txt = (gpc.probe?.banner?.text || '') + ' ' + (gpc.probe?.controls || []).map((c) => c.text).join(' ');
    f.push({ id: 'gpc-acknowledged-in-ui', value: /global privacy control|gpc|opt-out (preference )?signal|opt(ed)?[- ]out.*honou?red/i.test(txt), detail: 'Whether visible text mentions the opt-out signal being honoured (California expects a visible confirmation)' });
  }
  const wd = get('withdraw');
  if (wd) {
    const last = wd.phases.find((p) => p.phase === 'post-withdraw');
    const wc = (last?.cookies || []).filter((c) => needs(c.category));
    const wr = reqs(wd, ['post-withdraw'], needs);
    f.push({ id: 'withdraw-performed', value: !!(wd.withdraw?.api?.length || wd.withdraw?.action?.done), detail: wd.withdraw?.api?.join(', ') || wd.withdraw?.reopen || wd.withdraw?.note || '' });
    if (wd.withdraw?.api?.length || wd.withdraw?.action?.done) f.push({ id: 'after-withdraw-nonessential-cookies', value: wc.length, detail: wc.map((c) => `${c.name} (${c.vendor})`).join('; ') || 'none' });
    if (wd.withdraw?.api?.length || wd.withdraw?.action?.done) f.push({ id: 'after-withdraw-tracker-requests', value: wr.length, detail: wr.map((v) => `${v.vendor} [${v.category}]`).join('; ') || 'none' });
  }
  for (const x of f) if (typeof x.detail === 'string' && x.detail.length > 700) x.detail = x.detail.slice(0, 700) + ' ... (truncated, full lists in results.json)';
  return f;
}

function mdTable(rows, cols) {
  if (!rows.length) return '_none_\n';
  return `| ${cols.join(' | ')} |\n| ${cols.map(() => '---').join(' | ')} |\n` + rows.map((r) => `| ${cols.map((c) => String(r[c] ?? '').replace(/\|/g, '\\|')).join(' | ')} |`).join('\n') + '\n';
}

function writeSummary(meta, results, factList) {
  const L = [];
  L.push(`# Consent scan: ${startUrl}`, '');
  L.push(`- Scanned: ${meta.when}`, `- Vantage point: ${meta.vantage ? meta.vantage.country + (meta.vantage.region ? ' / ' + meta.vantage.region : '') + ' (Cloudflare colo ' + meta.vantage.colo + ')' : 'unknown'}${opts.proxy ? ' via proxy' : ''}. Banners are often geo-targeted, so results describe what visitors from this country get.`, `- Locale ${opts.locale}${opts.timezone ? ', timezone ' + opts.timezone : ''}, ${opts.mobile ? 'mobile' : 'desktop'} viewport`, `- Scenarios: ${results.map((r) => r.name).join(', ')}`, '');
  const base = results[0];
  const p = base.probe || {};
  L.push('## Site', '', `- Title: ${p.title || ''}`, `- Platform hints: ${(p.platformHints || []).join(', ') || 'none'}${p.generator ? ' (generator: ' + p.generator + ')' : ''}`, `- Consent tools recognised: ${(p.cmp || []).join(', ') || 'none'}`, `- APIs present: ${Object.entries(p.apis || {}).filter(([, v]) => v).map(([k]) => k).join(', ') || 'none'}`, `- Scripts marked as consent-blocked in the HTML: ${p.blockedScripts ?? 0}`, `- Scripts held by a delay-JavaScript optimiser: ${p.delayedScripts ?? 0}`, `- Footer/legal links found: ${Object.entries(p.links || {}).map(([k, v]) => `${k} ("${v.text}")`).join(', ') || 'none'}`, `- Links not found: ${['privacyPolicy', 'cookiePolicy', 'cookieSettings', 'doNotSell', 'imprint'].filter((k) => !(p.links || {})[k]).join(', ') || 'none'}`, `- GPC support file /.well-known/gpc.json: ${meta.gpcJson}`, `- Cache-related response headers: ${Object.entries(base.responseHeaders || {}).filter(([k]) => /cache|age|vary|server|via/i.test(k)).map(([k, v]) => `${k}: ${v}`).join('; ') || 'none'}`, '');
  if (p.banner) {
    L.push('## Banner (first layer)', '', '> ' + p.banner.text.slice(0, 700).replace(/\n/g, ' '), '', `Position ${JSON.stringify(p.banner.rect)} in viewport ${JSON.stringify(p.banner.viewport)}`, '');
    L.push(mdTable((p.controls || []).filter((c) => c.inBanner).map((c) => ({ control: c.text, tag: c.tag, size: `${c.w}x${c.h}`, background: c.bg, text: c.color, font: `${c.fontSize}/${c.fontWeight}`, border: c.border })), ['control', 'tag', 'size', 'background', 'text', 'font', 'border']));
    L.push('Compare accept and reject controls above for equal prominence (size, colour contrast, button vs. link). See also screenshots/baseline-1-load.png.', '');
  } else if (base.consentIframes?.length) {
    L.push('## Banner (inside iframe)', '', ...base.consentIframes.map((f) => `- ${f.url}: controls ${f.controls.map((c) => '"' + c.text + '"').join(', ')}`), '');
  }
  L.push('## Facts', '', mdTable(factList.map((f) => ({ check: f.id, value: Array.isArray(f.value) ? f.value.length : f.value, detail: f.detail })), ['check', 'value', 'detail']));
  L.push('How to read these: under opt-in regimes (EU/EEA, UK, Switzerland, Brazil, Quebec and similar) pre-consent and after-reject counts should be zero. Under US-style opt-out regimes pre-consent tracking is not unlawful by itself, but GPC and "Do Not Sell or Share" must work, and pixels, session replay and chat widgets firing before consent carry wiretap-litigation risk. "unclassified" entries need a human look.', '');
  for (const sc of results) {
    L.push(`## Scenario: ${sc.name}`, '');
    if (sc.errors.length) L.push('Errors: ' + sc.errors.join(' | '), '');
    if (sc.action) L.push(`Action: ${sc.action.done ? 'done' : 'NOT done'} ${JSON.stringify(sc.action.steps)}${sc.action.note ? ' — ' + sc.action.note : ''}`, '');
    L.push(`Pages: ${(sc.pagesVisited || []).join(', ')}`, '');
    const s = summarise(sc);
    for (const ph of Object.keys(s)) {
      const rows = s[ph].map((v) => v.vendor === 'Unclassified third party' ? { category: v.category, vendor: `${v.vendor} (${v.hosts.length} hosts)`, hosts: v.hosts.slice(0, 12).join(', ') + (v.hosts.length > 12 ? ` ... +${v.hosts.length - 12} more in results.json` : ''), requests: v.count } : { category: v.category, vendor: v.vendor, hosts: v.hosts.slice(0, 4).join(', '), requests: v.count });
      L.push(`### Third-party requests during "${ph}"`, '', mdTable(rows, ['category', 'vendor', 'hosts', 'requests']));
    }
    for (const ph of sc.phases) {
      // Keep the digest readable on ad-heavy sites: list first-party and classified cookies, count the rest.
      const shown = ph.cookies.filter((c) => !c.thirdParty || c.category !== 'unclassified');
      const hiddenN = ph.cookies.length - shown.length;
      const capped = shown.slice(0, 80);
      L.push(`### Cookies at end of "${ph.phase}" (${ph.cookies.length})`, '', mdTable(capped.map((c) => ({ name: c.name, domain: c.domain, category: c.category, vendor: c.vendor, lifetime: c.session ? 'session' : c.lifetimeDays + 'd', party: c.thirdParty ? '3rd' : '1st' })), ['name', 'domain', 'category', 'vendor', 'lifetime', 'party']));
      if (hiddenN || shown.length > 80) L.push(`Not listed here: ${hiddenN} unclassified third-party cookies on ${new Set(ph.cookies.filter((c) => c.thirdParty && c.category === 'unclassified').map((c) => c.domain)).size} domains${shown.length > 80 ? ` and ${shown.length - 80} further rows` : ''}. Full list in results.json.`, '');
      if (ph.signals && (ph.signals.gpp || ph.signals.usprivacy || ph.signals.oneTrust || ph.signals.googleConsentState || ph.signals.cookieYes || ph.signals.complianz || ph.signals.cookiebot)) L.push('Consent state reported by the page: `' + JSON.stringify(ph.signals).slice(0, 600) + '`', '');
      const st = ph.storage.flatMap((o) => [...Object.keys(o.local).map((k) => `${o.origin} local:${k}`), ...Object.keys(o.session).map((k) => `${o.origin} session:${k}`)]);
      if (st.length) L.push(`Web storage keys (${st.length}): ${st.slice(0, 40).join(', ')}${st.length > 40 ? ' ...' : ''}`, '');
    }
    if (sc.googleConsentSignals.length) {
      const uniq = [...new Map(sc.googleConsentSignals.map((g) => [g.phase + g.host + g.gcs + g.gcd, g])).values()].slice(0, 12);
      L.push('### Google consent signals on outgoing hits', '', mdTable(uniq.map((g) => ({ phase: g.phase, host: g.host, gcs: g.gcs || '', gcd: g.gcd || '', meaning: g.gcdDecoded ? Object.entries(g.gcdDecoded).map(([k, v]) => `${k}: ${v}`).join('; ') : (g.gcsDecoded ? JSON.stringify(g.gcsDecoded) : '') })), ['phase', 'host', 'gcs', 'gcd', 'meaning']));
    }
    const dl = sc.phases.at(-1)?.dataLayerConsent || sc.probe?.dataLayerConsent || [];
    if (dl.length) L.push('### dataLayer consent commands (in order)', '', '```', ...dl.slice(0, 25).map((d) => `${d.i}: ${d.cmd} ${d.value ? JSON.stringify(d.value) : ''}`), '```', '');
  }
  if (pagePlan) {
    const scanned = {}; for (const u of base.pagesVisited || []) { const t = pagePlan.typeOf.get(u); if (t) scanned[t] = (scanned[t] || 0) + 1; }
    L.push('## Page coverage', '', `Source: ${pagePlan.source}${pagePlan.sitemaps.length ? ' (' + pagePlan.sitemaps.slice(0, 4).join(', ') + (pagePlan.sitemaps.length > 4 ? ` and ${pagePlan.sitemaps.length - 4} more` : '') + ')' : ''}. ${pagePlan.totalUrls} URLs in ${pagePlan.types.length} page types. Coverage mode: ${opts.coverage}${opts.coverage === 'all' && !opts.allScenarios ? ' (every page in the baseline scenario; other scenarios use the per-type sample)' : ''}.${pagePlan.truncatedAll && opts.coverage === 'all' ? ` Capped at ${pagePlan.all.length} pages by --max-pages.` : ''}${pagePlan.truncatedTypes ? ' Per-type sample capped by --max-pages.' : ''}`, '',
      mdTable(pagePlan.types.slice(0, 60).map((t) => ({ type: t.type, 'URLs on site': t.urls, 'scanned (baseline)': scanned[t.type] || 0 })), ['type', 'URLs on site', 'scanned (baseline)']),
      'Types come from the sitemap grouping or the URL shape; check that they match the site\'s real templates. Pages that are not in the sitemap (cart, checkout, thank-you, account, search results, landing pages excluded from indexing) are not covered unless added with --extra-url.', '');
  }
  // Per-page view of the baseline scenario: which pages leak what. Templates differ (an article
  // embeds video, a product page loads reviews, a contact page loads a captcha).
  {
    const rowsP = [];
    const pages = base.pagesVisited || [];
    for (const u of pages) {
      const rq = base.requests.filter((r) => r.page === u && r.category !== 'firstparty');
      const v = (test) => [...new Set(rq.filter((r) => test(r.category)).map((r) => r.vendor))].filter((x) => x !== 'Unclassified third party');
      const uncl = new Set(rq.filter((r) => r.category === 'unclassified').map((r) => r.host)).size;
      const pr = u === startUrl ? { iframes: p.iframes || [], forms: p.forms || [] } : (base.pageProbes || []).find((x) => x.url === u) || { iframes: [], forms: [] };
      const ifr = [...new Set(pr.iframes.map((x) => { try { return new URL(x).hostname; } catch { return null; } }).filter(Boolean))];
      rowsP.push({ type: pagePlan?.typeOf.get(u) || (u === startUrl ? 'start' : ''), page: u.replace(/^https?:\/\/[^/]+/, '') || '/', 'trackers without a choice': (v(needs).join(', ') || 'none') + (uncl ? ` (+${uncl} unclassified hosts)` : ''), 'embeds and functional': v((c) => c === 'functional').join(', ') || 'none', 'iframe hosts': ifr.slice(0, 6).join(', ') || 'none', forms: pr.forms.length });
    }
    if (rowsP.length > 1) L.push('## Per page (baseline scenario, no choice made)', '', mdTable(rowsP, [...(pagePlan ? ['type'] : []), 'page', 'trackers without a choice', 'embeds and functional', 'iframe hosts', 'forms']), 'The start page row includes the idle wait; later pages get mouse and scroll input and the normal settle time.', '');
  }
  if (p.iframes?.length) L.push('## Iframes on the start page', '', ...p.iframes.map((u) => '- ' + u.slice(0, 160)), '');
  if (p.forms?.length) L.push('## Forms on the start page', '', mdTable(p.forms.map((f) => ({ action: f.action, fields: f.fields.join(', '), email: f.hasEmail, checkbox: f.hasConsentCheckbox, prechecked: f.checkboxPrechecked, mentionsPrivacy: f.mentionsPrivacy })), ['action', 'fields', 'email', 'checkbox', 'prechecked', 'mentionsPrivacy']));
  fs.writeFileSync(path.join(outDir, 'summary.md'), L.join('\n'));
}

// ---------- main ----------
const browser = await chromium.launch({ headless: !opts.headful, ...(opts.proxy ? { proxy: (() => { const u = new URL(opts.proxy); return { server: `${u.protocol}//${u.host}`, username: decodeURIComponent(u.username) || undefined, password: decodeURIComponent(u.password) || undefined }; })() } : {}) });
const meta = { url: startUrl, when: new Date().toISOString(), options: { ...opts, proxy: opts.proxy ? '(set)' : undefined }, vantage: await vantage(browser) };
try {
  const ctx = await browser.newContext({ ignoreHTTPSErrors: true });
  const r = await ctx.request.get(new URL('/.well-known/gpc.json', startUrl).href, { timeout: 10000 });
  const body = (await r.text()).slice(0, 200);
  meta.gpcJson = r.status() === 200 && /"gpc"\s*:/.test(body) ? 'present: ' + body.replace(/\s+/g, ' ') : `absent (HTTP ${r.status()})`;
  await ctx.close();
} catch { meta.gpcJson = 'could not be fetched'; }

pagePlan = await planPages(browser);
if (pagePlan) meta.pagePlan = { ...pagePlan, typeOf: undefined, all: undefined, allCount: pagePlan.all.length };
const results = [];
for (const name of opts.scenarios.split(',').map((s) => s.trim()).filter(Boolean)) {
  if (!['baseline', 'reject', 'accept', 'gpc', 'withdraw'].includes(name)) { log('skipping unknown scenario ' + name); continue; }
  results.push(await runScenario(browser, name));
}
await browser.close();

const factList = facts(results);
fs.writeFileSync(path.join(outDir, 'results.json'), JSON.stringify({ meta, facts: factList, scenarios: results.map((r) => ({ ...r, requestSummary: summarise(r) })) }, null, 1));
writeSummary(meta, results, factList);
console.log(JSON.stringify({ outDir, summary: path.join(outDir, 'summary.md'), results: path.join(outDir, 'results.json'), vantage: meta.vantage, facts: factList }, null, 1));
