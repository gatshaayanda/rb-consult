"use client";

import { useEffect, useState } from "react";

type InstallPrompt = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};
type InstallEnvironment = { standalone: boolean; ios: boolean; android: boolean; embedded: boolean };

function environment(): InstallEnvironment {
  if (typeof window === "undefined") return { standalone: true, ios: false, android: false, embedded: false };
  const nav = navigator as Navigator & { standalone?: boolean };
  const ua = nav.userAgent || "";
  const ios = /iPad|iPhone|iPod/i.test(ua) || (nav.platform === "MacIntel" && nav.maxTouchPoints > 1);
  const android = /Android/i.test(ua);
  const standalone = window.matchMedia("(display-mode: standalone)").matches || nav.standalone === true;
  const embedded = /WhatsApp|Instagram|FBAN|FBAV|Messenger|Line\/|Twitter|TikTok|Snapchat/i.test(ua) ||
    (android && /; wv\)/i.test(ua));
  return { standalone, ios, android, embedded };
}

function isIosSafari() {
  const env = environment();
  return env.ios && /Safari/i.test(navigator.userAgent) && !/CriOS|FxiOS|EdgiOS|OPiOS|DuckDuckGo/i.test(navigator.userAgent);
}

export default function PwaRegister({ initialEmbedded = false, initialAndroid = false }: { initialEmbedded?: boolean; initialAndroid?: boolean }) {
  const [offline, setOffline] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<InstallPrompt | null>(null);
  const [installCardDismissed, setInstallCardDismissed] = useState(false);
  const [iosHelpOpen, setIosHelpOpen] = useState(false);
  const [embedded, setEmbedded] = useState(initialEmbedded);
  const [androidEmbedded, setAndroidEmbedded] = useState(initialAndroid && initialEmbedded);

  useEffect(() => {
    setOffline(!navigator.onLine);
    const env = environment();
    const inEmbedded = initialEmbedded || env.embedded;
    setEmbedded(inEmbedded);
    setAndroidEmbedded((initialEmbedded && initialAndroid) || (env.embedded && env.android));

    const online = () => setOffline(false);
    const offlineNow = () => setOffline(true);
    const onInstallPrompt = (event: Event) => {
      if (environment().standalone) return;
      event.preventDefault();
      setInstallPrompt(event as InstallPrompt);
      setInstallCardDismissed(false);
    };

    // Adopt a prompt captured before React hydration, then listen for future events.
    const earlyWindow = window as Window & { __rbConsultInstallPrompt?: Event; __rbConsultPwaListenerReady?: boolean };
    earlyWindow.__rbConsultPwaListenerReady = true;
    if (earlyWindow.__rbConsultInstallPrompt) {
      const earlyPrompt = earlyWindow.__rbConsultInstallPrompt;
      delete earlyWindow.__rbConsultInstallPrompt;
      onInstallPrompt(earlyPrompt);
    }
    window.addEventListener("online", online);
    window.addEventListener("offline", offlineNow);
    window.addEventListener("beforeinstallprompt", onInstallPrompt);
    if ("serviceWorker" in navigator) void navigator.serviceWorker.register("/sw.js").catch(() => undefined);

    const installed = () => {
      setInstallPrompt(null);
      setIosHelpOpen(false);
      setInstallCardDismissed(true);
    };
    window.addEventListener("appinstalled", installed);
    return () => {
      window.removeEventListener("online", online);
      window.removeEventListener("offline", offlineNow);
      window.removeEventListener("beforeinstallprompt", onInstallPrompt);
      window.removeEventListener("appinstalled", installed);
    };
  }, [initialEmbedded, initialAndroid]);

  async function install() {
    if (!installPrompt) {
      if (isIosSafari()) setIosHelpOpen(true);
      return;
    }
    const prompt = installPrompt;
    // The browser-owned prompt is invoked directly from this user click.
    try {
      await prompt.prompt();
      await prompt.userChoice;
    } catch {
      // Browser eligibility and prompt outcome remain browser-controlled.
    } finally {
      setInstallPrompt(null);
    }
  }

  function openBrowser() {
    const url = window.location.href;
    const env = environment();
    if (env.android) {
      window.location.href = "intent://" + url.replace(/^https?:\\/\\//, "") + "#Intent;scheme=https;package=com.android.chrome;end";
      return;
    }
    window.open(url, "_blank", "noopener,noreferrer");
  }

  const showInstallCard = !environment().standalone && !embedded && !installCardDismissed &&
    (Boolean(installPrompt) || isIosSafari());

  return <>
    {offline && <div className="offlineBanner" role="status" aria-live="polite">Offline mode · previously visited pages may remain available. New enquiries need a connection to be confirmed.</div>}
    {showInstallCard && <aside className="af-install-card" aria-label="Install RB Consultancy">
      <div className="af-install-brand">
        <span className="af-install-mark" aria-hidden="true">RB<span>✦</span></span>
        <span><strong>RB CONSULTANCY</strong><small>VIP TOILET HIRE</small></span>
      </div>
      <button className="af-install-close" type="button" aria-label="Dismiss install prompt" onClick={() => setInstallCardDismissed(true)}>×</button>
      <button className="af-install-action" type="button" onClick={() => { if (installPrompt) void install(); else if (isIosSafari()) setIosHelpOpen(true); }}>
        {installPrompt ? "Install RB Consultancy" : "Add to Home Screen"} <span aria-hidden="true">↗</span>
      </button>
    </aside>}
    {iosHelpOpen && <div className="rb-install-overlay" role="presentation">
      <section className="rb-install-dialog" role="dialog" aria-modal="true" aria-labelledby="rb-ios-install-title">
        <button className="af-install-close" type="button" aria-label="Close install guidance" onClick={() => setIosHelpOpen(false)}>×</button>
        <p className="rb-install-kicker">IPHONE & IPAD · SAFARI</p>
        <h2 id="rb-ios-install-title">Add RB Consultancy to your Home Screen.</h2>
        <p>In Safari, tap <strong>Share</strong>, choose <strong>Add to Home Screen</strong>, then tap <strong>Add</strong>. Open the new Home Screen icon to launch RB Consultancy.</p>
        <button className="af-install-action" type="button" onClick={() => setIosHelpOpen(false)}>Continue on the website</button>
      </section>
    </div>}
    {embedded && <div className="rb-embedded-overlay" role="alertdialog" aria-modal="true" aria-labelledby="rb-embedded-title" aria-describedby="rb-embedded-message">
      <section className="rb-embedded-dialog">
        <span className="af-install-mark" aria-hidden="true">RB<span>✦</span></span>
        <p className="rb-install-kicker">RB CONSULTANCY · SECURE BROWSER SUPPORT</p>
        <h2 id="rb-embedded-title">Open RB Consultancy in your browser.</h2>
        <p id="rb-embedded-message">{androidEmbedded ? "This in-app browser may limit installation and enquiry features. Open this page in Chrome to continue." : "This page opened inside another app. Open it in your browser for the best experience."}</p>
        <button className="af-install-action" type="button" onClick={openBrowser}>{androidEmbedded ? "Open in Chrome" : "Open in browser"} ↗</button>
      </section>
    </div>}
  </>;
}
