import type { MetadataRoute } from "next";
import { absoluteUrl, resultImagePaths, siteUrl } from "./site-config";

const pageImagePaths = [
  "/sparclean-social-card.jpg",
  "/sparclean-logo-hq.png",
  "/hero-commercial-man-5.webp",
  "/hero-commercial-man-cart-tan-gloves.webp",
  "/hero-residential-woman-3.webp",
  "/care-english-speaking.webp",
  "/care-pet-friendly.webp",
  "/care-child-friendly.webp",
  "/care-senior-friendly.jpg",
  "/kitchen-before-matched.webp",
  "/kitchen-after.webp",
  ...resultImagePaths,
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [{
    url: siteUrl,
    lastModified: new Date("2026-07-22T00:00:00.000Z"),
    changeFrequency: "weekly",
    priority: 1,
    images: pageImagePaths.map(absoluteUrl),
  }];
}
