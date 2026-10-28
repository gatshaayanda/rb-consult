import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "RB Consultancy",
    short_name: "RB Consultancy",
    description: "VIP toilet trailer and mobile ablution hire for events in Botswana.",
    start_url: "/",
    display: "standalone",
    background_color: "#0e6655",
    theme_color: "#6d28d9",
    orientation: "portrait-primary",
    lang: "en",
    categories: ["business", "events"],
    icons: [
      { src: "/rb-consult-icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/rb-consult-icon.svg", sizes: "any", type: "image/svg+xml", purpose: "maskable" }
    ]
  };
}
