import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import PwaRegister from "@/app/pwa-register";
import AfrichikoGuide from "@/components/AfrichikoGuide";
import "./globals.css";
import "./pwa.css";
import "./africhiko-experience.css";
import "./pwa-brand.css";

const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://rb-consult.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "RB Consultancy | VIP Toilet Trailer Hire", template: "%s | RB Consultancy" },
  description: "RB Consultancy provides premium VIP toilet trailer and mobile ablution hire for events in Botswana. Enquire for your event and receive a private quotation.",
  applicationName: "RB Consultancy",
  keywords: ["RB Consultancy", "Botswana VIP toilet hire", "VIP toilet trailers", "event sanitation", "handwashing"],
  alternates: { canonical: "/" },
  openGraph: { type: "website", url: siteUrl, siteName: "RB Consultancy", title: "RB Consultancy | VIP Toilet Trailer Hire", description: "VIP toilet trailer hire in Botswana. Tell us about your event and request a private quotation." },
  twitter: { card: "summary", title: "RB Consultancy | VIP Toilet Trailer Hire", description: "VIP toilet trailer hire in Botswana. Tell us about your event and request a private quotation." },
  icons: { icon: "/icon.svg", apple: "/icon.svg" },
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "RB Consultancy", statusBarStyle: "default" },
};

export const viewport: Viewport = { themeColor: "#0e6655", colorScheme: "light" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><PwaRegister />{children}<AfrichikoGuide /><Analytics /><SpeedInsights /></body></html>;
}
