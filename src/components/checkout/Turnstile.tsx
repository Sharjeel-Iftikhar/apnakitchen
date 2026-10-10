"use client";

import Script from "next/script";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      reset: (id: string) => void;
      remove: (id: string) => void;
    };
  }
}

export const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export type TurnstileHandle = { reset: () => void };

/** Cloudflare Turnstile widget (free bot check). Renders nothing until the site key is set. */
export const Turnstile = forwardRef<TurnstileHandle, { onToken: (token: string | undefined) => void }>(
  function Turnstile({ onToken }, ref) {
    const el = useRef<HTMLDivElement>(null);
    const widgetId = useRef<string>(undefined);
    const [ready, setReady] = useState(() => typeof window !== "undefined" && !!window.turnstile);

    useImperativeHandle(ref, () => ({
      reset: () => {
        if (widgetId.current) window.turnstile?.reset(widgetId.current);
        onToken(undefined);
      },
    }));

    const render = useCallback(() => {
      if (!turnstileSiteKey || !el.current || !window.turnstile || widgetId.current) return;
      widgetId.current = window.turnstile.render(el.current, {
        sitekey: turnstileSiteKey,
        theme: "light",
        callback: (token: string) => onToken(token),
        "expired-callback": () => onToken(undefined),
        "error-callback": () => onToken(undefined),
      });
    }, [onToken]);

    useEffect(() => {
      if (ready) render();
      return () => {
        if (widgetId.current) window.turnstile?.remove(widgetId.current);
        widgetId.current = undefined;
      };
    }, [ready, render]);

    if (!turnstileSiteKey) return null;
    return (
      <>
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          strategy="afterInteractive"
          onReady={() => setReady(true)}
        />
        <div ref={el} className="min-h-[65px]" />
      </>
    );
  },
);
