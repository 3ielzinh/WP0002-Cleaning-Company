export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://sparcleanbr.com").replace(/\/$/, "");

export const siteConfig = {
  name: "SparClean",
  legalName: "SparClean Cleaning Services LLC",
  title: "SparClean | Sacramento Cleaning Services",
  description:
    "Premium commercial and residential cleaning in Sacramento, CA, including recurring, deep, move-in, move-out, office, and post-construction cleaning.",
  url: siteUrl,
  locale: "en_US",
  language: "en-US",
  phoneDisplay: "(916) 546-0021",
  phoneE164: "+19165460021",
  serviceArea: "Sacramento and surrounding areas, California",
  socialImage: "/sparclean-social-card.jpg",
} as const;

export const resultImagePaths = [
  "/results/stovetop-before.jpeg",
  "/results/stovetop-after.jpeg",
  "/results/shower-niche-before.jpeg",
  "/results/shower-niche-after.jpeg",
  "/results/laundry-appliance-area-before.jpeg",
  "/results/laundry-appliance-area-after.jpeg",
  "/results/outdoor-grill-side-before.jpeg",
  "/results/outdoor-grill-side-after.jpeg",
  "/results/outdoor-grill-front-before.jpeg",
  "/results/outdoor-grill-front-after.jpeg",
  "/results/cabinet-interior-before.jpeg",
  "/results/cabinet-interior-after.jpeg",
  "/results/shower-base-before.jpeg",
  "/results/shower-base-after.jpeg",
  "/results/oven-glass-before.jpeg",
  "/results/oven-glass-after.jpeg",
  "/results/oven-interior-before.jpeg",
  "/results/oven-interior-after.jpeg",
  "/results/freezer-before.jpeg",
  "/results/freezer-after.jpeg",
  "/results/refrigerator-drawers-before.jpeg",
  "/results/refrigerator-drawers-after.jpeg",
  "/results/bathroom-glass-before.jpeg",
  "/results/bathroom-glass-after.jpeg",
  "/results/stainless-sink-before.jpeg",
  "/results/stainless-sink-after.jpeg",
  "/results/appliance-floor-before.jpeg",
  "/results/appliance-floor-after.jpeg",
  "/results/toilet-detail-before.jpeg",
  "/results/toilet-detail-after.jpeg",
  "/results/living-space-detail-before.jpeg",
  "/results/living-space-detail-after.jpeg",
] as const;

export function absoluteUrl(path: string) {
  return new URL(path, `${siteUrl}/`).toString();
}
