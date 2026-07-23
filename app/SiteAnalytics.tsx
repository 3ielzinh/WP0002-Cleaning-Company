"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...arguments_: unknown[]) => void;
  }
}

export default function SiteAnalytics() {
  useEffect(() => {
    let active = true;
    fetch("/api/public-config")
      .then(response => response.json())
      .then((config: { googleAnalyticsId?: string | null }) => {
        const id = config.googleAnalyticsId;
        if (!active || !id || !/^G-[A-Z0-9]+$/i.test(id)) return;
        if (document.querySelector(`script[data-ga-id="${id}"]`)) return;
        const script = document.createElement("script");
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
        script.dataset.gaId = id;
        document.head.appendChild(script);
        window.dataLayer = window.dataLayer ?? [];
        window.gtag = (...arguments_: unknown[]) => { window.dataLayer?.push(arguments_); };
        window.gtag("js", new Date());
        window.gtag("config", id, { anonymize_ip: true });
      })
      .catch(() => {});
    return () => { active = false; };
  }, []);
  return null;
}
