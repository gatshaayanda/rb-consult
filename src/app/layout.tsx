import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Script from "next/script";
import PwaRegister from "@/app/pwa-register";
import AfrichikoGuide from "@/components/AfrichikoGuide";
import "./globals.css";
import "./pwa.css";
import "./africhiko-experience.css";
import "./pwa-brand.css";

const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://rb-consult.vercel.app";
const EMBEDDED_BROWSER_PATTERN = /WhatsApp|Instagram|FBAN|FBAV|Messenger|Line[/]|Twitter|TikTok|Snapchat/i;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "RB Consultancy | VIP Toilet Trailer Hire", template: "%s | RB Consultancy" },
  description: "RB Consultancy provides premium VIP toilet trailer and mobile ablution hire for events in Botswana. Enquire for your event and receive a private quotation.",
  applicationName: "RB Consultancy",
  keywords: ["RB Consultancy", "Botswana VIP toilet hire", "VIP toilet trailers", "event sanitation", "handwashing"],
  alternates: { canonical: "/" },
  openGraph: { type: "website", url: siteUrl, siteName: "RB Consultancy", title: "RB Consultancy | VIP Toilet Trailer Hire", description: "VIP toilet trailer hire in Botswana. Tell us about your event and request a private quotation." },
  twitter: { card: "summary", title: "RB Consultancy | VIP Toilet Trailer Hire", description: "VIP toilet trailer hire in Botswana. Tell us about your event and request a private quotation." },
  icons: { icon: [{ url: "/icon.svg", type: "image/svg+xml" }], apple: [{ url: "/icon.svg", type: "image/svg+xml" }] },
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "RB Consultancy", statusBarStyle: "default" },
};

export const viewport: Viewport = { themeColor: "#5d3b80", colorScheme: "light" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><Script id="rb-early-install-capture" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: '(function(){window.addEventListener("beforeinstallprompt",function(event){var standalone=window.matchMedia("(display-mode: standalone)").matches||navigator.standalone===true;if(standalone||window.__rbConsultPwaListenerReady===true)return;event.preventDefault();window.__rbConsultInstallPrompt=event;});})();' }} /><PwaRegister />{children}<AfrichikoGuide /><Analytics /><SpeedInsights /></body></html>;
}
