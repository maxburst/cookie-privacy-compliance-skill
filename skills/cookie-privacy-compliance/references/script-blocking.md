# Blocking techniques and platform specifics

How to actually stop a tag before consent, and where each technique leaks. WordPress, Shopify, Next.js and single-page-app notes are at the end.

**Last verified: 2026-11-11.** Confidence markers: **[V]** verified that day against the primary source or a live test; **[3P]** third-party or vendor write-ups only; **[M]** from prior knowledge, confirm on the target site; **[?]** uncertain or sources conflict. Technical reference, not legal advice. Prices and plan limits change often: re-check before quoting them.

Section numbers are shared across the technical references: 1.x is consent-signals.md, 2.x consent-tools.md, 3.x script-blocking.md, 4.x and 5 testing-tools.md, 6 failure-patterns.md.

## 3. Script blocking techniques and pitfalls

### 3.1 `type="text/plain"` plus category attributes

```html
<script type="text/plain" data-category="analytics" data-src="https://www.googletagmanager.com/gtag/js?id=G-XXXX"></script>
<script type="text/plain" data-category="marketing">fbq('init','123'); fbq('track','PageView');</script>
```

The CMP re-creates the node with an executable type after consent. Pitfalls:

- Use `data-src`, not `src`: some browsers' preload scanners and many optimisation plugins still fetch or rewrite `src` on a `text/plain` script [M].
- A script can be enabled only once; revocation cannot "un-run" it. On withdrawal: delete cookies, call the vendor's revoke API, and reload the page.
- Does nothing for `<img>`, `<iframe>`, `<link>`, CSS `url()`, `fetch`/`sendBeacon` from first-party bundles, or pixels in `<noscript>`.
- Inline scripts that depend on a blocked library (`gtag()`, `fbq()` calls in theme code) throw unless stubbed. Keep the stub (`window.dataLayer`, `fbq` queue) unblocked and block only the loader.
- CSP nonces and SRI hashes do not survive re-creation unless the CMP copies them.

### 3.2 Tag manager consent triggers

- Preferred: load GTM always, set consent defaults before the container snippet, and gate each tag with built-in or additional consent checks. Non-Google tags (Meta, TikTok, LinkedIn, Hotjar, Clarity) need **additional consent** set explicitly, or an exception trigger keyed to a consent variable.
- CMP → GTM bridge: either the CMP's community template (uses `setDefaultConsentState` / `updateConsentState`) or a dataLayer event (e.g. `cookie_consent_update`, `cmplz_event_marketing`, `OneTrustGroupsUpdated`) used as trigger.
- Tags that fired on "All Pages" before the update do not re-fire automatically; use the consent-update event as an extra trigger, or rely on consent-aware Google tags, which queue and re-send.
- Strict interpretation: `googletagmanager.com/gtm.js` is itself a third-party request before consent. Mitigations are first-party serving (Google tag gateway, server-side GTM custom domain) or blocking GTM until consent (basic mode); with the latter make sure the default is still set first.

### 3.3 Server-side GTM and Conversions APIs

Consent applies to the **processing**, not the transport. Moving a pixel server-side (sGTM, Meta CAPI, TikTok Events API, LinkedIn CAPI, GA4 Measurement Protocol, Shopify/Woo server events) hides it from browser scanners but not from the law.

- Forward the consent state with every event: GA4 hits carry `gcs`/`gcd` to sGTM; read them in server tags (e.g. Stape's Consent Parser variable) and block non-consented vendor tags.
- For CAPI plugins (PixelYourSite, Pixel Manager, Meta for WooCommerce, CTX Feed etc.) check that they consult `wp_has_consent('marketing')` or the CMP cookie before sending. Many send the Purchase event from the server unconditionally.
- Server-set first-party cookies (`FPID`, `_fbp`/`_fbc` set via `Set-Cookie`) need the same consent as their JS equivalents.
- A browser-only audit cannot see server-to-vendor calls. Inspect server code/config (plugin settings, sGTM container, webhook list) and ask for the sGTM container export.

### 3.4 Iframes and embeds (two-click placeholders)

Replace the iframe with a static placeholder; load it only after a click (per-embed consent) or category consent.

```html
<div class="embed-placeholder" data-src="https://www.youtube-nocookie.com/embed/VIDEO_ID" data-category="marketing">
  <img src="/local-thumbs/VIDEO_ID.jpg" alt="Video title">
  <p>Playing this video loads content from YouTube (Google) and may set cookies.</p>
  <button type="button">Load video</button>
</div>
<script>
document.addEventListener('click', (e) => {
  const b = e.target.closest('.embed-placeholder button'); if (!b) return;
  const box = b.parentElement, f = document.createElement('iframe');
  f.src = box.dataset.src + '?autoplay=1'; f.allow = 'autoplay; encrypted-media; picture-in-picture';
  f.allowFullscreen = true; f.title = box.querySelector('img').alt;
  box.replaceWith(f);
});
</script>
```

| Embed | Facts | Fix |
|---|---|---|
| YouTube | `youtube-nocookie.com` avoids cookies until play but still contacts Google, loads scripts and writes localStorage (`yt-remote-device-id` etc.) [M] | Placeholder with a locally stored thumbnail (`i.ytimg.com` is also a Google request) |
| Vimeo | `?dnt=1` disables tracking/cookies in the player; request still goes to Vimeo [M] | `dnt=1` plus placeholder for strict setups |
| Google Maps | Embed and JS API both hit `maps.googleapis.com` / `maps.gstatic.com`, load Google Fonts, set `NID` on some flows [M] | Static image linking to Maps, or placeholder; OpenStreetMap tiles are also third-party requests |
| reCAPTCHA | Loads on every page where the script is enqueued (Contact Form 7 does this site-wide), sets `_GRECAPTCHA`, sends data to Google [M] | Load only on form pages and on focus; or switch to Turnstile / Friendly Captcha / honeypot |
| Cloudflare Turnstile | Cloudflare states no tracking cookies; still a third-party request to `challenges.cloudflare.com` [M] | Usually classed as security/necessary; disclose in policy |
| hCaptcha | Third-party request; cookie behaviour varies by plan [?] | Same as Turnstile; verify with a capture |
| Social embeds (X, Instagram, Facebook, TikTok) | Load vendor JS with full tracking | Placeholder, or static links / server-side oEmbed cached HTML without the script |
| Spotify, SoundCloud, Calendly, Typeform, HubSpot forms/meetings | All set cookies or fingerprint | Placeholder |

WordPress specifics: core oEmbed auto-embeds bare URLs; filter `embed_oembed_html` to rewrite to placeholders, or let the CMP's content blocker do it (Complianz, Real Cookie Banner and Borlabs all do). In Next.js, `@next/third-parties` `YouTubeEmbed` uses lite-youtube-embed, which still loads the thumbnail from `i.ytimg.com`.

### 3.5 Fonts, avatars, emoji, CDNs (IP leakage)

Every third-party request discloses the visitor's IP and user agent. LG München I (20 Jan 2022, 3 O 17493/20) awarded damages for remotely loaded Google Fonts and triggered mass warning letters in DE/AT [M].

| Leak | Detect | Fix |
|---|---|---|
| Google Fonts | requests to `fonts.googleapis.com` / `fonts.gstatic.com` | Self-host (google-webfonts-helper, `@fontsource/*`, `next/font/google` downloads at build time and self-hosts). WP: OMGF or Local Google Fonts plugin; Elementor/Divi/Astra have a "load fonts locally" setting; `add_filter('elementor/frontend/print_google_fonts','__return_false')` |
| Adobe Fonts, Font Awesome kits | `use.typekit.net`, `kit.fontawesome.com` | Self-host files |
| Gravatar | `secure.gravatar.com/avatar/{hash}` (hash of commenter email) | Settings → Discussion → disable avatars, or a local-avatar/proxy plugin |
| WP emoji | Inline detection script; loads Twemoji from `s.w.org` only when the browser lacks support | `remove_action('wp_head','print_emoji_detection_script',7); remove_action('wp_print_styles','print_emoji_styles');` |
| `dns-prefetch` / `preconnect` hints | `<link rel=...>` in head to tracker domains | Remove via `wp_resource_hints` filter; they connect before consent |
| JS CDNs | `cdnjs`, `jsdelivr`, `unpkg`, `code.jquery.com`, `ajax.googleapis.com` | Bundle locally |
| Jetpack | `stats.wp.com`, `pixel.wp.com`, `i0.wp.com` (image CDN), `c0.wp.com` | Disable Stats / Site Accelerator or gate behind consent |
| Performance/RUM beacons | Cloudflare Web Analytics (`static.cloudflareinsights.com`), Vercel Speed Insights, New Relic, Sentry | Decide necessity; disclose or gate |

### 3.6 WordPress specifics

**Core cookies [M]:**

| Cookie | When | Class |
|---|---|---|
| `wordpress_logged_in_{hash}`, `wordpress_sec_{hash}`, `wordpress_{hash}` | login | strictly necessary |
| `wordpress_test_cookie` | login page | necessary |
| `wp-settings-{uid}`, `wp-settings-time-{uid}` | logged-in users, admin UI prefs | functional (logged-in only) |
| `comment_author_{hash}`, `comment_author_email_{hash}`, `comment_author_url_{hash}` | only if the commenter ticks the opt-in checkbox (since WP 4.9.6) | consented preference |
| `wp-postpass_{hash}` | password-protected posts | necessary |
| `wp_lang` | login language switcher | functional |

**WooCommerce cookies [M]:**

| Cookie | Purpose | Class |
|---|---|---|
| `woocommerce_cart_hash`, `woocommerce_items_in_cart` | cart state / cache busting | strictly necessary (set on add-to-cart) |
| `wp_woocommerce_session_{hash}` | session key, 2 days | strictly necessary |
| `woocommerce_recently_viewed` | Recently Viewed widget | functional/preferences: needs consent in strict regimes if the widget is used |
| `store_notice{hash}`, `woocommerce_dismissed_suggestions__*`, `woocommerce_snooze_suggestions__*` | notice dismissal / admin | functional |
| `sbjs_*` | order attribution (section 1.10) | **marketing/analytics: needs consent** |
| `tk_ai`, `tk_qs` | Jetpack/Woo usage tracking (mostly admin) | analytics |
| Geolocation (MaxMind lookup, "Geolocate with page caching" adds `?v=` hash) | tax/shipping | necessary; note the AJAX geolocation interaction with caches |

Payment and anti-fraud scripts (Stripe `m.stripe.com` sets `__stripe_mid`/`__stripe_sid`, PayPal, Klarna) are generally treated as necessary **on checkout**, but many plugins load them site-wide; restrict to cart/checkout.

**Plugin-injected trackers to grep for:** MonsterInsights/ExactMetrics/Analytify, Site Kit, PixelYourSite, Pixel Manager for WooCommerce, Meta for WooCommerce, Jetpack Stats, WooCommerce Google Analytics, Google Listings & Ads, HubSpot, Mailchimp for WooCommerce (`mc.js`), Klaviyo, Hotjar/Clarity plugins, AddToAny / ShareThis, Smash Balloon feeds, Elementor/Divi "custom code" areas, theme options "header scripts", WPCode / Insert Headers and Footers snippets, RankMath/Yoast analytics modules.

```bash
# Where is a tracker coming from? (run in the WP root)
wp db search 'googletagmanager.com|fbevents.js|clarity.ms|hotjar.com' --regex --all-tables --table_column_once
grep -rIl --include='*.php' --include='*.js' -E 'gtag\(|fbq\(|GTM-[A-Z0-9]+|G-[A-Z0-9]{8,}' wp-content/themes wp-content/mu-plugins
wp option list --search='*head*' --fields=option_name,size_bytes     # header-script options
wp plugin list --status=active --field=name
```

**Caching and optimisation interactions:**

- Full-page cache/CDN: cached HTML is identical for all visitors, so consent-dependent markup must be decided in JS. Never render "consented" script tags from PHP into a cacheable page. After changing CMP settings, purge page cache, CDN, and any minify/combine bundles.
- **WP Rocket Delay JavaScript Execution** [V, <https://docs.wp-rocket.me/article/1349-delay-javascript-execution>]: rewrites scripts to `type="rocketlazyloadscript"` (original type in `data-rocket-type`, `src` in `data-rocket-src`) and runs them on first interaction (`keydown`, `mousemove`, `touchstart`, `wheel`, `click`...). Effects: (a) the banner may not appear until the user moves; (b) consent defaults can execute after tags or in a different order; (c) the CMP no longer recognises its own `text/plain` scripts; (d) a headless audit with no input sees zero trackers and gives a **false pass**. Exclude the CMP and consent-default scripts (`nowprocket` attribute or the exclusions list / one-click exclusions), and in tests always simulate a mouse move + scroll before the "pre-consent" snapshot.
- Same class of problem: LiteSpeed "JS Delay/Defer", Perfmatters delay JS, Flying Scripts, Autoptimize aggregate, SiteGround Optimizer combine, NitroPack, Cloudflare Rocket Loader (rewrites `type` to `{hash}-text/javascript`). Combining can merge a blocked script into an unblocked bundle; deferring can push the consent default after `gtm.js`.
- Cloudflare Zaraz, Cloudflare "Google tag gateway", and host-level analytics (e.g. Kinsta/WP Engine APM, Cloudflare Web Analytics auto-injection) inject scripts at the edge that never appear in WordPress code. Compare origin HTML with edge HTML.

### 3.7 Shopify specifics

- Native banner and Customer Privacy API govern Shopify's own cookies and **Web Pixels** (app pixels and custom pixels run in a sandbox and receive events only when the pixel's declared purposes are consented) [V, <https://help.shopify.com/en/manual/privacy-and-security/privacy/customer-privacy-settings/privacy-settings>].
- **Not governed**: scripts hard-coded in `theme.liquid`, app embeds/ScriptTags that load their own JS, and legacy "Additional scripts" on order status pages. Shopify: third-party pixels added manually or through apps "may need a third-party banner or custom logic". Gate them with `customerPrivacy.marketingAllowed()` and the `visitorConsentCollected` event.
- Banner regions: by default UK + EEA when those are active markets; a third-party CMP must be mapped to the same regions and must call `setTrackingConsent`, otherwise Shopify's own analytics run unconsented or stay blocked.
- Checkout: on non-Plus plans the checkout cannot run arbitrary scripts; tracking goes through Web Pixels. Legacy `checkout.liquid` / additional scripts are being retired (deadlines in 2025–2026 depending on plan) [?].
- Google & YouTube app and the Meta/TikTok channel apps read Customer Privacy consent; verify with a capture rather than trusting it [M].

### 3.8 Next.js / React specifics

- `@next/third-parties` (v16.4.6, still marked **experimental**) [V, <https://nextjs.org/docs/app/guides/third-party-libraries>]: `<GoogleTagManager gtmId>` and `<GoogleAnalytics gaId>` inject after hydration and have **no consent prop**. They load unconditionally. Either render them conditionally from consent state (basic mode) or set a consent default earlier (advanced mode).

```tsx
// app/layout.tsx — default must precede GTM in document order
import Script from 'next/script';
import { GoogleTagManager } from '@next/third-parties/google';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <Script id="consent-default" strategy="beforeInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',
            ad_personalization:'denied',analytics_storage:'denied',wait_for_update:500});
        `}</Script>
      </head>
      <body>{children}<ConsentGate /></body>
    </html>
  );
}

// components/ConsentGate.tsx
'use client';
export function ConsentGate() {
  const consent = useConsent();              // your store: reads the cookie in an effect, not during render
  if (!consent.analytics) return null;       // basic mode: no GTM until consent
  return <GoogleTagManager gtmId="GTM-XXXX" />;
}
```

- `next/script` strategies: `beforeInteractive` (injected in initial HTML, root layout only), `afterInteractive` (default), `lazyOnload`, `worker` (Partytown, experimental; consent APIs running in a worker cannot see main-thread updates reliably) [M].
- Hydration: do not read `document.cookie`/`localStorage` during render to decide whether to show the banner; it causes hydration mismatches and banner flash. Read the consent cookie on the server (`cookies()`) or in `useEffect`. Reading cookies in a layout makes the route dynamic; with static/ISR pages keep the decision client-side.
- Vercel Analytics / Speed Insights, Sentry, PostHog, Segment and Intercom are usually imported as npm packages: they are invisible to script-tag blockers and need explicit gating in code.
- Middleware can set a geo cookie from `x-vercel-ip-country` / `cf-ipcountry` to pick opt-in vs opt-out without a geo API.
- c15t and vanilla-cookieconsent both have React/Next recipes; c15t can server-render the banner decision.

### 3.9 Single-page apps

- Consent default is set once at first load; route changes must not reset it. Store state in memory plus a cookie.
- GA4 enhanced measurement sends `page_view` on History API changes automatically; a manual `page_view` on route change double counts. After consent is granted mid-session, consent-aware Google tags resend; non-Google pixels need an explicit `PageView` fired on grant and on each subsequent route change.
- Embeds mounted on later routes must pass through the same placeholder logic (do not only scan the DOM at `DOMContentLoaded`). Use a `MutationObserver` or component-level gating.
- On withdrawal in an SPA, already-loaded vendor scripts keep running; do a full reload after revoking.
- Tests: navigate client-side (click links) as well as with `page.goto`, and assert no new third-party hosts appear on later routes.
