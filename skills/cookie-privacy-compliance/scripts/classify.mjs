// Classification tables for the consent scanner.
// Deliberately compact: covers the vendors that show up on most sites. Anything
// not matched is reported as "unclassified" so a human/agent looks at it, which
// is safer than guessing.
//
// Categories:
//   necessary    - needed to deliver the service the visitor asked for
//   cmp          - the consent tool itself
//   functional   - preferences, chat, captcha, embeds the visitor may or may not have asked for
//   analytics    - audience measurement
//   advertising  - ad delivery, retargeting, conversion tracking, social pixels
//   replay       - session recording / heatmaps (analytics, but high litigation risk in the US)
//   tagmanager   - loads other tags; harmless alone, but a common leak path
//   infra        - CDNs, fonts, static hosting (IP disclosure only)

export const TRACKER_HOSTS = [
  // [host suffix, vendor, category]
  ['google-analytics.com', 'Google Analytics', 'analytics'],
  ['analytics.google.com', 'Google Analytics', 'analytics'],
  ['googletagmanager.com', 'Google Tag Manager', 'tagmanager'],
  ['doubleclick.net', 'Google Ads / DoubleClick', 'advertising'],
  ['googleadservices.com', 'Google Ads', 'advertising'],
  ['googlesyndication.com', 'Google AdSense', 'advertising'],
  ['adservice.google.com', 'Google Ads', 'advertising'],
  ['google.com/pagead', 'Google Ads', 'advertising'],
  ['google.com/ccm', 'Google Ads', 'advertising'],
  ['connect.facebook.net', 'Meta Pixel', 'advertising'],
  ['facebook.com/tr', 'Meta Pixel', 'advertising'],
  ['facebook.com/plugins', 'Meta social plugin', 'advertising'],
  ['analytics.tiktok.com', 'TikTok Pixel', 'advertising'],
  ['ads.tiktok.com', 'TikTok Pixel', 'advertising'],
  ['snap.licdn.com', 'LinkedIn Insight', 'advertising'],
  ['px.ads.linkedin.com', 'LinkedIn Insight', 'advertising'],
  ['ads.linkedin.com', 'LinkedIn Insight', 'advertising'],
  ['bat.bing.com', 'Microsoft Ads UET', 'advertising'],
  ['bat.bing.net', 'Microsoft Ads UET', 'advertising'],
  ['clarity.ms', 'Microsoft Clarity', 'replay'],
  ['ct.pinterest.com', 'Pinterest Tag', 'advertising'],
  ['pinimg.com/ct', 'Pinterest Tag', 'advertising'],
  ['static.ads-twitter.com', 'X/Twitter Pixel', 'advertising'],
  ['analytics.twitter.com', 'X/Twitter Pixel', 'advertising'],
  ['t.co/i/adsct', 'X/Twitter Pixel', 'advertising'],
  ['sc-static.net', 'Snap Pixel', 'advertising'],
  ['tr.snapchat.com', 'Snap Pixel', 'advertising'],
  ['redditstatic.com/ads', 'Reddit Pixel', 'advertising'],
  ['alb.reddit.com', 'Reddit Pixel', 'advertising'],
  ['amazon-adsystem.com', 'Amazon Ads', 'advertising'],
  ['criteo.com', 'Criteo', 'advertising'],
  ['criteo.net', 'Criteo', 'advertising'],
  ['taboola.com', 'Taboola', 'advertising'],
  ['outbrain.com', 'Outbrain', 'advertising'],
  ['adnxs.com', 'Xandr', 'advertising'],
  ['rubiconproject.com', 'Magnite', 'advertising'],
  ['pubmatic.com', 'PubMatic', 'advertising'],
  ['adsrvr.org', 'The Trade Desk', 'advertising'],
  ['quantserve.com', 'Quantcast', 'advertising'],
  ['scorecardresearch.com', 'Comscore', 'analytics'],
  ['klaviyo.com', 'Klaviyo', 'advertising'],
  ['hs-analytics.net', 'HubSpot', 'analytics'],
  ['hs-scripts.com', 'HubSpot', 'analytics'],
  ['hsadspixel.net', 'HubSpot Ads', 'advertising'],
  ['hs-banner.com', 'HubSpot cookie banner', 'cmp'],
  ['hubspot.com', 'HubSpot', 'analytics'],
  ['hsforms.net', 'HubSpot Forms', 'functional'],
  ['hsforms.com', 'HubSpot Forms', 'functional'],
  ['hotjar.com', 'Hotjar', 'replay'],
  ['hotjar.io', 'Hotjar', 'replay'],
  ['fullstory.com', 'FullStory', 'replay'],
  ['mouseflow.com', 'Mouseflow', 'replay'],
  ['luckyorange.com', 'Lucky Orange', 'replay'],
  ['smartlook.com', 'Smartlook', 'replay'],
  ['logrocket.io', 'LogRocket', 'replay'],
  ['lr-ingest.io', 'LogRocket', 'replay'],
  ['inspectlet.com', 'Inspectlet', 'replay'],
  ['crazyegg.com', 'Crazy Egg', 'replay'],
  ['mixpanel.com', 'Mixpanel', 'analytics'],
  ['segment.com', 'Segment', 'analytics'],
  ['segment.io', 'Segment', 'analytics'],
  ['amplitude.com', 'Amplitude', 'analytics'],
  ['heap.io', 'Heap', 'analytics'],
  ['heapanalytics.com', 'Heap', 'analytics'],
  ['posthog.com', 'PostHog', 'analytics'],
  ['plausible.io', 'Plausible (cookieless)', 'analytics'],
  ['usefathom.com', 'Fathom (cookieless)', 'analytics'],
  ['simpleanalyticscdn.com', 'Simple Analytics (cookieless)', 'analytics'],
  ['cloudflareinsights.com', 'Cloudflare Web Analytics (cookieless)', 'analytics'],
  ['matomo.cloud', 'Matomo', 'analytics'],
  ['stats.wp.com', 'Jetpack Stats', 'analytics'],
  ['pixel.wp.com', 'Jetpack Stats', 'analytics'],
  ['mc.yandex.ru', 'Yandex Metrica', 'analytics'],
  ['mc.yandex.com', 'Yandex Metrica', 'analytics'],
  ['statcounter.com', 'StatCounter', 'analytics'],
  ['newrelic.com', 'New Relic', 'analytics'],
  ['nr-data.net', 'New Relic', 'analytics'],
  ['sentry.io', 'Sentry', 'functional'],
  ['optimizely.com', 'Optimizely', 'analytics'],
  ['vwo.com', 'VWO', 'analytics'],
  ['visualwebsiteoptimizer.com', 'VWO', 'analytics'],
  ['addthis.com', 'AddThis', 'advertising'],
  ['sharethis.com', 'ShareThis', 'advertising'],
  ['disqus.com', 'Disqus', 'advertising'],
  ['mailchimp.com', 'Mailchimp', 'advertising'],
  ['list-manage.com', 'Mailchimp', 'functional'],
  ['chimpstatic.com', 'Mailchimp', 'advertising'],
  ['omnisend.com', 'Omnisend', 'advertising'],
  ['activecampaign.com', 'ActiveCampaign', 'advertising'],
  ['trackcmp.net', 'ActiveCampaign', 'advertising'],
  ['intercom.io', 'Intercom', 'functional'],
  ['intercomcdn.com', 'Intercom', 'functional'],
  ['drift.com', 'Drift', 'functional'],
  ['tawk.to', 'Tawk.to chat', 'functional'],
  ['crisp.chat', 'Crisp chat', 'functional'],
  ['zdassets.com', 'Zendesk', 'functional'],
  ['zopim.com', 'Zendesk chat', 'functional'],
  ['livechatinc.com', 'LiveChat', 'functional'],
  ['tidio.co', 'Tidio chat', 'functional'],
  ['youtube.com', 'YouTube embed', 'advertising'],
  ['youtube-nocookie.com', 'YouTube embed (privacy-enhanced)', 'functional'],
  ['ytimg.com', 'YouTube embed', 'functional'],
  ['vimeo.com', 'Vimeo embed', 'functional'],
  ['vimeocdn.com', 'Vimeo embed', 'functional'],
  ['maps.googleapis.com', 'Google Maps', 'functional'],
  ['maps.gstatic.com', 'Google Maps', 'functional'],
  ['google.com/maps', 'Google Maps', 'functional'],
  ['google.com/recaptcha', 'Google reCAPTCHA', 'functional'],
  ['gstatic.com/recaptcha', 'Google reCAPTCHA', 'functional'],
  ['recaptcha.net', 'Google reCAPTCHA', 'functional'],
  ['hcaptcha.com', 'hCaptcha', 'functional'],
  ['challenges.cloudflare.com', 'Cloudflare Turnstile', 'necessary'],
  ['instagram.com', 'Instagram embed', 'advertising'],
  ['cdninstagram.com', 'Instagram embed', 'advertising'],
  ['platform.twitter.com', 'X/Twitter embed', 'advertising'],
  ['syndication.twitter.com', 'X/Twitter embed', 'advertising'],
  ['tiktok.com', 'TikTok embed', 'advertising'],
  ['spotify.com', 'Spotify embed', 'functional'],
  ['soundcloud.com', 'SoundCloud embed', 'functional'],
  ['calendly.com', 'Calendly', 'functional'],
  ['typeform.com', 'Typeform', 'functional'],
  ['trustpilot.com', 'Trustpilot widget', 'functional'],
  ['gravatar.com', 'Gravatar', 'infra'],
  ['fonts.googleapis.com', 'Google Fonts', 'infra'],
  ['fonts.gstatic.com', 'Google Fonts', 'infra'],
  ['use.typekit.net', 'Adobe Fonts', 'infra'],
  ['use.fontawesome.com', 'Font Awesome CDN', 'infra'],
  ['kit.fontawesome.com', 'Font Awesome CDN', 'infra'],
  ['cdnjs.cloudflare.com', 'cdnjs', 'infra'],
  ['cdn.jsdelivr.net', 'jsDelivr', 'infra'],
  ['unpkg.com', 'unpkg', 'infra'],
  ['ajax.googleapis.com', 'Google Hosted Libraries', 'infra'],
  ['s.w.org', 'WordPress.org emoji CDN', 'infra'],
  ['stripe.com', 'Stripe', 'necessary'],
  ['stripe.network', 'Stripe', 'necessary'],
  ['paypal.com', 'PayPal', 'necessary'],
  ['paypalobjects.com', 'PayPal', 'necessary'],
  ['shopifycloud.com', 'Shopify', 'necessary'],
  ['cdn.shopify.com', 'Shopify', 'necessary'],
  ['monorail-edge.shopifysvc.com', 'Shopify analytics', 'analytics'],
  // lead capture, email attribution, translation
  ['omappapi.com', 'OptinMonster', 'advertising'],
  ['optinmonster.com', 'OptinMonster', 'advertising'],
  ['lndrsapi.com', 'Lindris', 'advertising'],
  ['lindrisapi.com', 'Lindris', 'advertising'],
  ['universally.com', 'Universally (translation)', 'functional'],
  ['typekit.net', 'Adobe Fonts', 'infra'],
  ['sail-horizon.com', 'Sailthru', 'advertising'],
  ['sailthru.com', 'Sailthru', 'advertising'],
  ['bounceexchange.com', 'Wunderkind', 'advertising'],
  ['wknd.ai', 'Wunderkind', 'advertising'],
  ['parsely.com', 'Parse.ly', 'analytics'],
  ['parse.ly', 'Parse.ly', 'analytics'],
  ['chartbeat.com', 'Chartbeat', 'analytics'],
  ['chartbeat.net', 'Chartbeat', 'analytics'],
  // identity graphs and audience platforms (the part of an ad stack opt-outs most often miss)
  ['rlcdn.com', 'LiveRamp (identity)', 'advertising'],
  ['pippio.com', 'LiveRamp (identity)', 'advertising'],
  ['liadm.com', 'LiveIntent (identity)', 'advertising'],
  ['liveintent.com', 'LiveIntent (identity)', 'advertising'],
  ['id5-sync.com', 'ID5 (identity)', 'advertising'],
  ['33across.com', '33Across (identity)', 'advertising'],
  ['tapad.com', 'Tapad (identity)', 'advertising'],
  ['crwdcntrl.net', 'Lotame (identity)', 'advertising'],
  ['permutive.com', 'Permutive (audience)', 'advertising'],
  ['permutive.app', 'Permutive (audience)', 'advertising'],
  ['optable.co', 'Optable (identity)', 'advertising'],
  ['demdex.net', 'Adobe Audience Manager', 'advertising'],
  ['agkn.com', 'Neustar (identity)', 'advertising'],
  ['adroll.com', 'AdRoll', 'advertising'],
  ['audigent.com', 'Audigent (identity)', 'advertising'],
  ['hadronid.net', 'Audigent Hadron (identity)', 'advertising'],
  ['uidapi.com', 'Unified ID 2.0', 'advertising'],
  // programmatic exchanges and bidders
  ['openx.net', 'OpenX', 'advertising'],
  ['casalemedia.com', 'Index Exchange', 'advertising'],
  ['indexww.com', 'Index Exchange', 'advertising'],
  ['3lift.com', 'TripleLift', 'advertising'],
  ['sharethrough.com', 'Sharethrough', 'advertising'],
  ['smartadserver.com', 'Equativ', 'advertising'],
  ['bidswitch.net', 'BidSwitch', 'advertising'],
  ['media.net', 'Media.net', 'advertising'],
  ['lijit.com', 'Sovrn', 'advertising'],
  ['sovrn.com', 'Sovrn', 'advertising'],
  ['teads.tv', 'Teads', 'advertising'],
  ['gumgum.com', 'GumGum', 'advertising'],
  ['onetag-sys.com', 'OneTag', 'advertising'],
  ['inmobi.com', 'InMobi', 'advertising'],
  ['1rx.io', 'Unruly', 'advertising'],
  ['yieldmo.com', 'Yieldmo', 'advertising'],
  ['kargo.com', 'Kargo', 'advertising'],
  ['connatix.com', 'Connatix', 'advertising'],
  ['ads.yahoo.com', 'Yahoo Ads', 'advertising'],
  ['analytics.yahoo.com', 'Yahoo Ads', 'advertising'],
  ['yahoo.com/sync', 'Yahoo Ads', 'advertising'],
  ['doubleverify.com', 'DoubleVerify (ad verification)', 'advertising'],
  ['adsafeprotected.com', 'IAS (ad verification)', 'advertising'],
  ['moatads.com', 'Moat (ad verification)', 'advertising'],
  ['confiant-integrations.net', 'Confiant (ad verification)', 'advertising'],
  // consent tools
  ['cookiebot.com', 'Cookiebot', 'cmp'],
  ['cookielaw.org', 'OneTrust', 'cmp'],
  ['onetrust.com', 'OneTrust', 'cmp'],
  ['cookieyes.com', 'CookieYes', 'cmp'],
  ['cookie-script.com', 'CookieScript', 'cmp'],
  ['usercentrics.eu', 'Usercentrics', 'cmp'],
  ['iubenda.com', 'iubenda', 'cmp'],
  ['termly.io', 'Termly', 'cmp'],
  ['osano.com', 'Osano', 'cmp'],
  ['didomi.io', 'Didomi', 'cmp'],
  ['privacy-mgmt.com', 'Sourcepoint', 'cmp'],
  ['trustarc.com', 'TrustArc', 'cmp'],
  ['truste.com', 'TrustArc', 'cmp'],
  ['axept.io', 'Axeptio', 'cmp'],
  ['consentmanager.net', 'consentmanager', 'cmp'],
  ['quantcast.mgr.consensu.org', 'Quantcast Choice', 'cmp'],
  ['fundingchoicesmessages.google.com', 'Google Funding Choices CMP', 'cmp'],
  ['transcend.io', 'Transcend', 'cmp'],
  ['ketchcdn.com', 'Ketch', 'cmp'],
  ['cookiefirst.com', 'CookieFirst', 'cmp'],
  ['cookiehub.net', 'CookieHub', 'cmp'],
  ['civiccomputing.com', 'Civic Cookie Control', 'cmp'],
];

export const COOKIE_PATTERNS = [
  // [regex on cookie name, vendor, category]
  [/^(_ga|_ga_.+|_gid|_gat.*|__utm[a-z]|_gac_.+)$/, 'Google Analytics', 'analytics'],
  [/^(_gcl_.+|_gac_gb_.+|FPGCLAW|FPGCLDC)$/, 'Google Ads conversion linker', 'advertising'],
  [/^(IDE|DSID|test_cookie|__gads|__gpi|__eoi|NID|ANID|AID|FLC|RUL|1P_JAR|APISID|SAPISID|HSID|SSID|SID|SIDCC|__Secure-[13]P.+)$/, 'Google advertising / account', 'advertising'],
  [/^(FPID|FPLC|FPAU)$/, 'Google server-side tagging', 'analytics'],
  [/^(_fbp|_fbc|fr|datr|sb|wd|c_user|xs)$/, 'Meta', 'advertising'],
  [/^(_ttp|_tt_enable_cookie|ttwid|tt_.+)$/, 'TikTok', 'advertising'],
  [/^(li_sugr|bcookie|bscookie|lidc|UserMatchHistory|AnalyticsSyncHistory|li_gc|lms_ads|lms_analytics|ln_or|li_fat_id)$/, 'LinkedIn', 'advertising'],
  [/^(_uetsid|_uetvid|_uetmsclkid|MUID|MR|SRM_B|ANONCHK|SM)$/, 'Microsoft Ads / Bing', 'advertising'],
  [/^(_clck|_clsk|CLID|MUID)$/, 'Microsoft Clarity', 'replay'],
  [/^(_pin_unauth|_pinterest_ct_ua|_pinterest_sess|_derived_epik|_epik)$/, 'Pinterest', 'advertising'],
  [/^(_scid|_sctr|sc_at|_scid_r)$/, 'Snap', 'advertising'],
  [/^(_rdt_uuid|_rdt_cid)$/, 'Reddit', 'advertising'],
  [/^(muc_ads|personalization_id|guest_id.*|twclid|_twclid)$/, 'X/Twitter', 'advertising'],
  [/^(_hj.+|hj.+)$/, 'Hotjar', 'replay'],
  [/^(fs_uid|fs_lua|_fs_.+)$/, 'FullStory', 'replay'],
  [/^(mf_.+)$/, 'Mouseflow', 'replay'],
  [/^(_lo_.+|__lotl|_lorid)$/, 'Lucky Orange', 'replay'],
  [/^(__hstc|hubspotutk|__hssc|__hssrc|messagesUtk)$/, 'HubSpot', 'analytics'],
  [/^(__hs_.+)$/, 'HubSpot consent', 'cmp'],
  [/^(_pk_.+|MATOMO_SESSID|mtm_.+|matomo_.+)$/, 'Matomo', 'analytics'],
  [/^(mp_.+_mixpanel|mp_.+)$/, 'Mixpanel', 'analytics'],
  [/^(ajs_.+)$/, 'Segment', 'analytics'],
  [/^(amplitude_.+|AMP_.+|amp_.+)$/, 'Amplitude', 'analytics'],
  [/^(ph_.+_posthog)$/, 'PostHog', 'analytics'],
  [/^(_hp2_.+)$/, 'Heap', 'analytics'],
  [/^(_omappv[ps]|omSeen-.+|om-.+)$/, 'OptinMonster', 'advertising'],
  [/^(lindris_.+)$/, 'Lindris', 'advertising'],
  [/^(_wpfuuid)$/, 'WPForms user journey', 'analytics'],
  [/^(_lr_.+|pbjs_identitylink|_li_.+|_lc2_.+|id5id.*|panoramaId.*|_cc_id|_pubcid|pbjs-unifiedid|connectId|permutive-id|_au_1d|33acrossId.*|tapad_.+)$/, 'Identity / audience vendor', 'advertising'],
  [/^(__kla_id|_kla_.+)$/, 'Klaviyo', 'advertising'],
  [/^(_mcid|_mc_.+|mailchimp_.+)$/, 'Mailchimp', 'advertising'],
  [/^(_ym_.+|yandexuid|ymex|yabs-sid|yuidss|i)$/, 'Yandex', 'analytics'],
  [/^(tk_ai|tk_qs|tk_lr|tk_or|tk_r3d|tk_tc)$/, 'Jetpack / WooCommerce tracking', 'analytics'],
  [/^(sbjs_.+)$/, 'WooCommerce order attribution (Sourcebuster)', 'analytics'],
  [/^(_vwo_.+|_vis_opt_.+)$/, 'VWO', 'analytics'],
  [/^(optimizely.+)$/, 'Optimizely', 'analytics'],
  [/^(cto_.+|criteo.+)$/, 'Criteo', 'advertising'],
  [/^(__qca|mc)$/, 'Quantcast', 'advertising'],
  [/^(_shopify_y|_shopify_s|_shopify_sa_.+|_y|_s|_landing_page|_orig_referrer|_shopify_d|_shopify_m|_shopify_tm|_shopify_tw|_shopify_fs)$/, 'Shopify analytics', 'analytics'],
  [/^(VISITOR_INFO1_LIVE|VISITOR_PRIVACY_METADATA|YSC|PREF|GPS|LOGIN_INFO|__Secure-YEC|__Secure-ROLLOUT_TOKEN)$/, 'YouTube', 'advertising'],
  [/^(vuid|player)$/, 'Vimeo', 'analytics'],
  [/^(intercom-.+)$/, 'Intercom', 'functional'],
  [/^(crisp-client.+)$/, 'Crisp', 'functional'],
  [/^(__zlcmid|_zendesk.+|ZD-.+)$/, 'Zendesk', 'functional'],
  [/^(__tawkuuid|TawkConnectionTime|twk_.+)$/, 'Tawk.to', 'functional'],
  [/^(_GRECAPTCHA|rc::.+)$/, 'Google reCAPTCHA', 'functional'],
  [/^(pll_language|wp-wpml_current_language|_icl_.+|wp_lang|googtrans|lang|locale|currency|woocommerce_recently_viewed|wp-settings-.+|wp-settings-time-.+|comment_author.*)$/, 'Site preference', 'functional'],
  // consent records
  [/^(CookieConsent|CookieConsentBulkTicket|OptanonConsent|OptanonAlertBoxClosed|eupubconsent.*|euconsent(-v2)?|usprivacy|cookieyes-consent|cky-.+|cmplz_.+|complianz_.+|borlabs-cookie|BorlabsCookie|klaro|cc_cookie|cookie_notice_accepted|cookielawinfo-.+|viewed_cookie_policy|CookieLawInfoConsent|_iub_cs-.+|usnatUUID|didomi_token|osano_consentmanager.*|termly.+|TERMLY_API_CACHE|cookieconsent_status|moove_gdpr_popup|real_cookie_banner.*|rcb-.+|axeptio_.+|CookieScriptConsent|uc_.+|ucString|notice_gdpr_prefs|notice_preferences|notice_behavior|cmapi_.+|TAconsentID|_tracking_consent|_cmp_a|wpconsent_.+|wp_consent_.+|wpl_user_preference|cookiefirst-consent|cookiehub|CookieControl|FCCDCF|FCNEC|__gpp|__gpp_sid|__tcfapi|gdpr|consentUUID|consentDate|sp_.+|_sp_.+|ketch_.+|_swb.*|tcm|airgap.+)$/i, 'Consent record', 'cmp'],
  // strictly necessary
  [/^(PHPSESSID|JSESSIONID|ASP\.NET_SessionId|connect\.sid|laravel_session|XSRF-TOKEN|csrftoken|_csrf.*|csrf_.+|__Host-.+|__Secure-next-auth.+|next-auth.+|sessionid|session|sid|sess.+)$/i, 'Session / CSRF', 'necessary'],
  [/^(wordpress_.+|wp-postpass_.+|wordpress_logged_in_.+|wordpress_sec_.+|wordpress_test_cookie|wp_woocommerce_session_.+|woocommerce_cart_hash|woocommerce_items_in_cart|wc_cart_hash_.+|wc_fragments_.+|store_notice.+|edd_.+|wfwaf-authcookie-.+|wf_loginalerted_.+|wfCBLBypass|wordfence_verifiedHuman|wfvt_.+)$/, 'WordPress / WooCommerce / Wordfence', 'necessary'],
  [/^(cart|cart_sig|cart_ts|cart_currency|secure_customer_sig|localization|keep_alive|checkout|checkout_token|_secure_session_id|storefront_digest|shopify_pay_redirect|customer_account_locale|_shopify_essential|_ab|master_device_id|_cmp_a)$/, 'Shopify core', 'necessary'],
  [/^(__cf_bm|cf_clearance|_cfuvid|__cfruid|__cflb|cf_chl_.+|__cfseq|AWSALB.*|AWSELB.*|ARRAffinity.*|incap_ses_.+|visid_incap_.+|nlbi_.+|ak_bmsc|bm_sv|bm_sz|_abck|datadome|sucuri_cloudproxy_.+|SERVERID|BIGipServer.+|TS[0-9a-f]{6,})$/, 'CDN / load balancer / bot protection', 'necessary'],
  [/^(__stripe_mid|__stripe_sid|m|ts|ts_c|tsrce|x-pp-s|l7_az|enforce_policy|nsid|LANG)$/, 'Payment provider fraud prevention', 'necessary'],
];

const MULTI_SUFFIX = new Set(['co.uk', 'org.uk', 'ac.uk', 'gov.uk', 'com.au', 'net.au', 'org.au', 'co.nz', 'co.jp', 'ne.jp', 'or.jp', 'com.br', 'com.mx', 'com.ar', 'com.co', 'co.za', 'co.in', 'co.kr', 'com.sg', 'com.hk', 'com.tr', 'com.tw', 'com.cn', 'co.il', 'com.ua', 'co.id', 'com.my', 'com.ph', 'co.th', 'com.vn', 'com.pl', 'com.es', 'com.pt', 'com.ng', 'co.ke', 'com.eg', 'com.sa', 'com.pe', 'com.uy', 'com.cl']);

export function siteOf(host) {
  if (!host) return '';
  const parts = host.toLowerCase().replace(/^\./, '').split('.');
  if (parts.length <= 2) return parts.join('.');
  const last2 = parts.slice(-2).join('.');
  return MULTI_SUFFIX.has(last2) ? parts.slice(-3).join('.') : last2;
}

export function classifyRequest(url, firstPartySite) {
  let u;
  try { u = new URL(url); } catch { return null; }
  if (!/^https?:$/.test(u.protocol)) return null;
  const host = u.hostname.toLowerCase();
  const hostPath = host + u.pathname;
  let best = null;
  for (const [pat, vendor, category] of TRACKER_HOSTS) {
    const hit = pat.includes('/')
      ? (hostPath.startsWith(pat) || hostPath.includes('.' + pat) || hostPath.startsWith('www.' + pat))
      : (host === pat || host.endsWith('.' + pat));
    if (hit && (!best || pat.length > best.pat.length)) best = { pat, vendor, category };
  }
  const thirdParty = siteOf(host) !== firstPartySite;
  // First-party paths that are really trackers (server-side tagging, self-hosted Matomo, proxies)
  if (!best && /\/(g\/collect|j\/collect|matomo\.php|piwik\.php|gtm\.js|gtag\/js)(\?|$)/.test(u.pathname + (u.search ? '?' : ''))) {
    best = { vendor: 'First-party hosted analytics/tagging endpoint', category: u.pathname.includes('gtm.js') || u.pathname.includes('gtag/js') ? 'tagmanager' : 'analytics' };
  }
  return {
    host, thirdParty,
    vendor: best ? best.vendor : (thirdParty ? 'Unclassified third party' : 'First party'),
    category: best ? best.category : (thirdParty ? 'unclassified' : 'firstparty'),
  };
}

export function classifyCookie(name, extraDb) {
  for (const [re, vendor, category] of COOKIE_PATTERNS) {
    if (re.test(name)) return { vendor, category };
  }
  if (extraDb) {
    const hit = extraDb.exact.get(name) || extraDb.wild.find((w) => name.startsWith(w.prefix));
    if (hit) return { vendor: hit.vendor, category: hit.category, source: 'open-cookie-database' };
  }
  return { vendor: 'Unknown', category: 'unclassified' };
}

// Categories that need prior consent under opt-in regimes (EU/UK-style).
export const NEEDS_CONSENT = new Set(['analytics', 'advertising', 'replay', 'unclassified']);
// "functional" is context dependent: a chat widget or embed the visitor did not
// ask for needs consent in the EU, a language cookie does not. Reported separately.

// Decode Google Consent Mode parameters seen on outgoing Google hits.
export function decodeGcs(gcs) {
  const m = /^G1([01-])([01-])/.exec(gcs || '');
  if (!m) return null;
  const v = (c) => (c === '1' ? 'granted' : c === '0' ? 'denied' : 'unset');
  return { ad_storage: v(m[1]), analytics_storage: v(m[2]) };
}

const GCD_LETTERS = {
  l: 'not set',
  p: 'denied by default, no update',
  q: 'denied by default, denied after update',
  r: 'denied by default, granted after update',
  t: 'granted by default, no update',
  u: 'granted by default, denied after update',
  v: 'granted by default, granted after update',
  m: 'no default, denied after update',
  n: 'no default, granted after update',
};

export function decodeGcd(gcd) {
  // Format: 1<n><ad_storage><n><analytics_storage><n><ad_user_data><n><ad_personalization><n>
  const m = /^1\d([a-z])\d([a-z])\d([a-z])\d([a-z])/.exec(gcd || '');
  if (!m) return null;
  const d = (c) => GCD_LETTERS[c] || `unknown (${c})`;
  return { ad_storage: d(m[1]), analytics_storage: d(m[2]), ad_user_data: d(m[3]), ad_personalization: d(m[4]) };
}
