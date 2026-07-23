"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    turnstile?: {
      render(container: HTMLElement, options: Record<string, unknown>): string;
      remove(widgetId: string): void;
    };
  }
}

let turnstileScript: Promise<void> | null = null;

function loadTurnstile() {
  if (window.turnstile) return Promise.resolve();
  if (turnstileScript) return turnstileScript;
  turnstileScript = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>("script[data-sparclean-turnstile]");
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Turnstile failed to load.")), { once: true });
      return;
    }
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.defer = true;
    script.dataset.sparcleanTurnstile = "true";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Turnstile failed to load."));
    document.head.appendChild(script);
  });
  return turnstileScript;
}

export default function Turnstile({
  action,
  onToken,
}: {
  action: "estimate_form" | "concierge_chat";
  onToken(token: string): void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const onTokenRef = useRef(onToken);
  const [siteKey, setSiteKey] = useState<string | null>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    onTokenRef.current = onToken;
  }, [onToken]);

  useEffect(() => {
    let active = true;
    fetch("/api/public-config")
      .then(response => response.json())
      .then((config: { turnstileSiteKey?: string | null }) => {
        if (!active || !config.turnstileSiteKey) return;
        setSiteKey(config.turnstileSiteKey);
        setEnabled(true);
      })
      .catch(() => {});
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!enabled || !siteKey || !containerRef.current) return;
    let widgetId: string | null = null;
    let active = true;
    loadTurnstile().then(() => {
      if (!active || !window.turnstile || !containerRef.current) return;
      widgetId = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        action,
        theme: "light",
        size: "flexible",
        callback: (token: string) => onTokenRef.current(token),
        "expired-callback": () => onTokenRef.current(""),
        "error-callback": () => onTokenRef.current(""),
      });
    }).catch(() => onTokenRef.current(""));
    return () => {
      active = false;
      if (widgetId && window.turnstile) window.turnstile.remove(widgetId);
    };
  }, [action, enabled, siteKey]);

  if (!enabled) return null;
  return <div className="turnstile-check" ref={containerRef} aria-label="Security verification"/>;
}
