import type { MetadataRoute } from "next";
import { siteConfig } from "./site-config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteConfig.name} Cleaning Services`,
    short_name: siteConfig.name,
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#fbf7ee",
    theme_color: "#d4af37",
    icons: [
      { src: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { src: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
