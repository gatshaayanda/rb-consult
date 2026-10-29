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
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }
    ]
  };
}
