import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "RB Consultancy | VIP Toilet Trailer Hire",
    short_name: "RB Consultancy",
    description: "VIP toilet trailer and mobile ablution hire for events in Botswana.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#f6f5f8",
    theme_color: "#5d3b80",
    orientation: "portrait-primary",
    lang: "en",
    categories: ["business", "events"],
    prefer_related_applications: false,
    icons: [
      { src: "/rb-consult-icon-192.svg", sizes: "192x192", type: "image/svg+xml", purpose: "any" },
      { src: "/rb-consult-icon-512.svg", sizes: "512x512", type: "image/svg+xml", purpose: "any" },
      { src: "/rb-consult-apple-icon.svg", sizes: "180x180", type: "image/svg+xml", purpose: "any" }
    ]
  };
}
