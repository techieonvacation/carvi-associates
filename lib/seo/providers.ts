import type { SeoIntegrationItem, SeoScriptPlacement } from "@/lib/seo/types";

export type RenderedTag = {
  key: string;
  placement: SeoScriptPlacement;
  src?: string;
  inline?: string;
  strategy: "beforeInteractive" | "afterInteractive" | "lazyOnload" | "worker";
  isAsync?: boolean;
  isDefer?: boolean;
  noscript?: string;
};

function configString(integration: SeoIntegrationItem, key: string, fallback = ""): string {
  const value = integration.config[key];
  return typeof value === "string" && value.trim().length ? value.trim() : fallback;
}

function configBoolean(integration: SeoIntegrationItem, key: string, fallback = false): boolean {
  const value = integration.config[key];
  return typeof value === "boolean" ? value : fallback;
}

export function renderIntegration(integration: SeoIntegrationItem): RenderedTag[] {
  const id = integration.trackingId.trim();
  const secondary = integration.secondaryId.trim();
  if (!id && integration.provider !== "CUSTOM") return [];

  const key = `seo-integration-${integration.id}`;

  switch (integration.provider) {
    case "GOOGLE_ANALYTICS": {
      const anonymizeIp = configBoolean(integration, "anonymizeIp", true);
      const debugMode = configBoolean(integration, "debugMode", false);
      return [
        {
          key: `${key}-src`,
          placement: "HEAD",
          src: `https://www.googletagmanager.com/gtag/js?id=${id}`,
          strategy: "afterInteractive",
          isAsync: true,
        },
        {
          key: `${key}-init`,
          placement: "HEAD",
          strategy: "afterInteractive",
          inline: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${id}',{anonymize_ip:${anonymizeIp},debug_mode:${debugMode}});`,
        },
      ];
    }

    case "GOOGLE_TAG_MANAGER": {
      const env = secondary ? `+'&gtm_auth=${secondary}'` : "";
      return [
        {
          key: `${key}-init`,
          placement: "HEAD",
          strategy: "afterInteractive",
          inline: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl${env};f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${id}');`,
          noscript: `<iframe src="https://www.googletagmanager.com/ns.html?id=${id}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
        },
      ];
    }

    case "GOOGLE_ADS": {
      return [
        {
          key: `${key}-src`,
          placement: "HEAD",
          src: `https://www.googletagmanager.com/gtag/js?id=${id}`,
          strategy: "afterInteractive",
          isAsync: true,
        },
        {
          key: `${key}-init`,
          placement: "HEAD",
          strategy: "afterInteractive",
          inline: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${id}');`,
        },
      ];
    }

    case "GOOGLE_OPTIMIZE": {
      return [
        {
          key: `${key}-src`,
          placement: "HEAD",
          src: `https://www.googleoptimize.com/optimize.js?id=${id}`,
          strategy: "beforeInteractive",
        },
      ];
    }

    case "BING_UET": {
      return [
        {
          key: `${key}-init`,
          placement: "HEAD",
          strategy: "afterInteractive",
          inline: `(function(w,d,t,r,u){var f,n,i;w[u]=w[u]||[],f=function(){var o={ti:'${id}'};o.q=w[u],w[u]=new UET(o),w[u].push('pageLoad')},n=d.createElement(t),n.src=r,n.async=1,n.onload=n.onreadystatechange=function(){var s=this.readyState;s&&s!=='loaded'&&s!=='complete'||(f(),n.onload=n.onreadystatechange=null)},i=d.getElementsByTagName(t)[0],i.parentNode.insertBefore(n,i)})(window,document,'script','//bat.bing.com/bat.js','uetq');`,
        },
      ];
    }

    case "META_PIXEL": {
      return [
        {
          key: `${key}-init`,
          placement: "HEAD",
          strategy: "afterInteractive",
          inline: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${id}');fbq('track','PageView');`,
          noscript: `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${id}&ev=PageView&noscript=1" alt="" />`,
        },
      ];
    }

    case "LINKEDIN_INSIGHT": {
      return [
        {
          key: `${key}-init`,
          placement: "HEAD",
          strategy: "afterInteractive",
          inline: `_linkedin_partner_id='${id}';window._linkedin_data_partner_ids=window._linkedin_data_partner_ids||[];window._linkedin_data_partner_ids.push(_linkedin_partner_id);(function(l){if(!l){window.lintrk=function(a,b){window.lintrk.q.push([a,b])};window.lintrk.q=[]}var s=document.getElementsByTagName('script')[0];var b=document.createElement('script');b.type='text/javascript';b.async=true;b.src='https://snap.licdn.com/li.lms-analytics/insight.min.js';s.parentNode.insertBefore(b,s)})(window.lintrk);`,
          noscript: `<img height="1" width="1" style="display:none" alt="" src="https://px.ads.linkedin.com/collect/?pid=${id}&fmt=gif" />`,
        },
      ];
    }

    case "TIKTOK_PIXEL": {
      return [
        {
          key: `${key}-init`,
          placement: "HEAD",
          strategy: "afterInteractive",
          inline: `!function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=['page','track','identify','instances','debug','on','off','once','ready','alias','group','enableCookie','disableCookie'];ttq.setAndDefer=function(e,n){e[n]=function(){e.push([n].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.load=function(e,n){var r='https://analytics.tiktok.com/i18n/pixel/events.js';ttq._i=ttq._i||{};ttq._i[e]=[];ttq._i[e]._u=r;ttq._t=ttq._t||{};ttq._t[e]=+new Date;ttq._o=ttq._o||{};ttq._o[e]=n||{};var o=d.createElement('script');o.type='text/javascript';o.async=!0;o.src=r+'?sdkid='+e+'&lib='+t;var a=d.getElementsByTagName('script')[0];a.parentNode.insertBefore(o,a)};ttq.load('${id}');ttq.page();}(window,document,'ttq');`,
        },
      ];
    }

    case "PINTEREST_TAG": {
      return [
        {
          key: `${key}-init`,
          placement: "HEAD",
          strategy: "afterInteractive",
          inline: `!function(e){if(!window.pintrk){window.pintrk=function(){window.pintrk.queue.push(Array.prototype.slice.call(arguments))};var n=window.pintrk;n.queue=[],n.version='3.0';var t=document.createElement('script');t.async=!0,t.src=e;var r=document.getElementsByTagName('script')[0];r.parentNode.insertBefore(t,r)}}('https://s.pinimg.com/ct/core.js');pintrk('load','${id}');pintrk('page');`,
          noscript: `<img height="1" width="1" style="display:none" alt="" src="https://ct.pinterest.com/v3/?event=init&tid=${id}&noscript=1" />`,
        },
      ];
    }

    case "X_PIXEL": {
      return [
        {
          key: `${key}-init`,
          placement: "HEAD",
          strategy: "afterInteractive",
          inline: `!function(e,t,n,s,u,a){e.twq||(s=e.twq=function(){s.exe?s.exe.apply(s,arguments):s.queue.push(arguments)},s.version='1.1',s.queue=[],u=t.createElement(n),u.async=!0,u.src='https://static.ads-twitter.com/uwt.js',a=t.getElementsByTagName(n)[0],a.parentNode.insertBefore(u,a))}(window,document,'script');twq('config','${id}');`,
        },
      ];
    }

    case "HOTJAR": {
      const version = configString(integration, "version", "6");
      return [
        {
          key: `${key}-init`,
          placement: "HEAD",
          strategy: "lazyOnload",
          inline: `(function(h,o,t,j,a,r){h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};h._hjSettings={hjid:${JSON.stringify(id)},hjsv:${JSON.stringify(version)}};a=o.getElementsByTagName('head')[0];r=o.createElement('script');r.async=1;r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;a.appendChild(r)})(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');`,
        },
      ];
    }

    case "MICROSOFT_CLARITY": {
      return [
        {
          key: `${key}-init`,
          placement: "HEAD",
          strategy: "lazyOnload",
          inline: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src='https://www.clarity.ms/tag/'+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y)})(window,document,'clarity','script','${id}');`,
        },
      ];
    }

    case "PLAUSIBLE": {
      const host = secondary || "https://plausible.io";
      return [
        {
          key: `${key}-src`,
          placement: "HEAD",
          src: `${host.replace(/\/$/, "")}/js/script.js`,
          strategy: "afterInteractive",
          isDefer: true,
        },
      ];
    }

    case "FATHOM": {
      return [
        {
          key: `${key}-src`,
          placement: "HEAD",
          src: "https://cdn.usefathom.com/script.js",
          strategy: "afterInteractive",
          isDefer: true,
        },
      ];
    }

    case "MATOMO": {
      const host = (secondary || "").replace(/\/$/, "");
      if (!host) return [];
      return [
        {
          key: `${key}-init`,
          placement: "HEAD",
          strategy: "afterInteractive",
          inline: `var _paq=window._paq=window._paq||[];_paq.push(['trackPageView']);_paq.push(['enableLinkTracking']);(function(){var u='${host}/';_paq.push(['setTrackerUrl',u+'matomo.php']);_paq.push(['setSiteId','${id}']);var d=document,g=d.createElement('script'),s=d.getElementsByTagName('script')[0];g.async=true;g.src=u+'matomo.js';s.parentNode.insertBefore(g,s)})();`,
        },
      ];
    }

    case "POSTHOG": {
      const host = secondary || "https://us.i.posthog.com";
      return [
        {
          key: `${key}-init`,
          placement: "HEAD",
          strategy: "afterInteractive",
          inline: `!function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split('.');2==o.length&&(t=t[o[0]],e=o[1]);t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement('script')).type='text/javascript',p.async=!0,p.src=s.api_host+'/static/array.js',(r=t.getElementsByTagName('script')[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a='posthog',u.people=u.people||[],u.toString=function(t){var e='posthog';return'posthog'!==a&&(e+='.'+a),t||(e+=' (stub)'),e},u.people.toString=function(){return u.toString(1)+'.people (stub)'},o='capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag'.split(' '),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);posthog.init('${id}',{api_host:'${host}'});`,
        },
      ];
    }

    case "YANDEX_METRICA": {
      const webvisor = configBoolean(integration, "webvisor", true);
      return [
        {
          key: `${key}-init`,
          placement: "HEAD",
          strategy: "afterInteractive",
          inline: `(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window,document,'script','https://mc.yandex.ru/metrika/tag.js','ym');ym(${JSON.stringify(id)},'init',{clickmap:true,trackLinks:true,accurateTrackBounce:true,webvisor:${webvisor}});`,
          noscript: `<div><img src="https://mc.yandex.ru/watch/${id}" style="position:absolute;left:-9999px" alt="" /></div>`,
        },
      ];
    }

    case "CRISP_CHAT": {
      return [
        {
          key: `${key}-init`,
          placement: "BODY_END",
          strategy: "lazyOnload",
          inline: `window.$crisp=[];window.CRISP_WEBSITE_ID='${id}';(function(){var d=document,s=d.createElement('script');s.src='https://client.crisp.chat/l.js';s.async=1;d.getElementsByTagName('head')[0].appendChild(s)})();`,
        },
      ];
    }

    case "TAWK_TO": {
      const widget = secondary || "default";
      return [
        {
          key: `${key}-init`,
          placement: "BODY_END",
          strategy: "lazyOnload",
          inline: `var Tawk_API=Tawk_API||{},Tawk_LoadStart=new Date();(function(){var s1=document.createElement('script'),s0=document.getElementsByTagName('script')[0];s1.async=true;s1.src='https://embed.tawk.to/${id}/${widget}';s1.charset='UTF-8';s1.setAttribute('crossorigin','*');s0.parentNode.insertBefore(s1,s0)})();`,
        },
      ];
    }

    case "INTERCOM": {
      return [
        {
          key: `${key}-init`,
          placement: "BODY_END",
          strategy: "lazyOnload",
          inline: `window.intercomSettings={app_id:'${id}'};(function(){var w=window;var ic=w.Intercom;if(typeof ic==='function'){ic('reattach_activator');ic('update',w.intercomSettings)}else{var d=document;var i=function(){i.c(arguments)};i.q=[];i.c=function(args){i.q.push(args)};w.Intercom=i;var l=function(){var s=d.createElement('script');s.type='text/javascript';s.async=true;s.src='https://widget.intercom.io/widget/${id}';var x=d.getElementsByTagName('script')[0];x.parentNode.insertBefore(s,x)};if(document.readyState==='complete'){l()}else{w.addEventListener('load',l,false)}}})();`,
        },
      ];
    }

    default:
      return [];
  }
}

export function integrationMetaTags(
  integrations: SeoIntegrationItem[],
): Array<{ name: string; content: string }> {
  const tags: Array<{ name: string; content: string }> = [];
  for (const integration of integrations) {
    if (!integration.isActive || !integration.trackingId.trim()) continue;
    if (integration.provider === "GOOGLE_SEARCH_CONSOLE") {
      tags.push({ name: "google-site-verification", content: integration.trackingId.trim() });
    }
    if (integration.provider === "BING_WEBMASTER") {
      tags.push({ name: "msvalidate.01", content: integration.trackingId.trim() });
    }
  }
  return tags;
}

export function providerScriptDomains(integrations: SeoIntegrationItem[]): string[] {
  const domains = new Set<string>();
  for (const integration of integrations) {
    if (!integration.isActive) continue;
    switch (integration.provider) {
      case "GOOGLE_ANALYTICS":
      case "GOOGLE_TAG_MANAGER":
      case "GOOGLE_ADS":
        domains.add("https://www.googletagmanager.com");
        break;
      case "META_PIXEL":
        domains.add("https://connect.facebook.net");
        break;
      case "MICROSOFT_CLARITY":
        domains.add("https://www.clarity.ms");
        break;
      case "HOTJAR":
        domains.add("https://static.hotjar.com");
        break;
      default:
        break;
    }
  }
  return [...domains];
}
