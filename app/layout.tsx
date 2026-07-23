import type { Metadata } from "next";
import "./globals.css";
import { serviceAreas } from "./service-areas";
import { absoluteUrl, siteConfig, siteUrl } from "./site-config";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteConfig.title,
    template: "%s | SparClean",
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.legalName, url: siteUrl }],
  creator: siteConfig.legalName,
  publisher: siteConfig.legalName,
  category: "Cleaning services",
  alternates: { canonical: "/" },
  referrer: "origin-when-cross-origin",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    locale: siteConfig.locale,
    images: [{
      url: siteConfig.socialImage,
      width: 1200,
      height: 630,
      alt: "SparClean professional cleaning a refined Sacramento interior",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [{
      url: siteConfig.socialImage,
      width: 1200,
      height: 630,
      alt: "SparClean professional cleaning a refined Sacramento interior",
    }],
  },
  formatDetection: { telephone: false, address: false, email: false },
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: siteConfig.legalName,
      alternateName: siteConfig.name,
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/sparclean-logo-hq.png"),
      },
      image: absoluteUrl(siteConfig.socialImage),
      telephone: siteConfig.phoneE164,
      areaServed: serviceAreas.map(area => ({
        "@type": "Place",
        name: area.name,
      })),
      contactPoint: {
        "@type": "ContactPoint",
        telephone: siteConfig.phoneE164,
        contactType: "customer service",
        areaServed: "US-CA",
        availableLanguage: ["English"],
      },
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: siteConfig.name,
      description: siteConfig.description,
      publisher: { "@id": `${siteUrl}/#organization` },
      inLanguage: siteConfig.language,
    },
    {
      "@type": "WebPage",
      "@id": `${siteUrl}/#webpage`,
      url: siteUrl,
      name: siteConfig.title,
      description: siteConfig.description,
      isPartOf: { "@id": `${siteUrl}/#website` },
      about: { "@id": `${siteUrl}/#organization` },
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: absoluteUrl(siteConfig.socialImage),
        width: 1200,
        height: 630,
      },
      inLanguage: siteConfig.language,
    },
    {
      "@type": "Service",
      "@id": `${siteUrl}/#cleaning-services`,
      name: "Commercial and residential cleaning services",
      serviceType: "Professional cleaning",
      description: siteConfig.description,
      provider: { "@id": `${siteUrl}/#organization` },
      areaServed: serviceAreas.map(area => ({
        "@type": "Place",
        name: area.name,
      })),
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Cleaning services",
        itemListElement: [
          "Commercial cleaning",
          "Residential cleaning",
          "Deep cleaning",
          "Move-in cleaning",
          "Move-out cleaning",
          "Post-construction cleaning",
          "Airbnb turnover cleaning",
        ].map((name) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name },
        })),
      },
    },
    {
      "@type": "FAQPage",
      "@id": `${siteUrl}/#faq-schema`,
      mainEntity: [
        [
          "Do I need to be home during the cleaning?",
          "Not at all. Many clients provide secure access instructions, and our insured team handles the rest. We confirm arrival and completion so you always know what is happening.",
        ],
        [
          "Do you bring your own supplies?",
          "Yes. We arrive fully equipped with professional supplies and tools. If you prefer specific products or eco-friendly options, simply mention that in your estimate request.",
        ],
        [
          "Can I customize my cleaning plan?",
          "Absolutely. Every home and business works differently. We tailor the checklist, frequency, priority areas, and access instructions around your needs.",
        ],
        [
          "What happens if I need to reschedule?",
          "Just let us know as early as possible. Your final booking policy will clearly explain the rescheduling window and available options.",
        ],
      ].map(([name, text]) => ({
        "@type": "Question",
        name,
        acceptedAnswer: { "@type": "Answer", text },
      })),
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico?v=sparclean-2" sizes="any"/>
        <link rel="icon" href="/favicon-32x32.png?v=sparclean-2" sizes="32x32" type="image/png"/>
        <link rel="icon" href="/favicon-16x16.png?v=sparclean-2" sizes="16x16" type="image/png"/>
        <link rel="apple-touch-icon" href="/apple-touch-icon.png?v=sparclean-2" sizes="180x180"/>
        <link rel="manifest" href="/manifest.webmanifest"/>
        <meta name="theme-color" content="#d4af37"/>
      </head>
      <body>
        <a className="skip-link" href="#main-content">Skip to main content</a>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
          }}
        />
      </body>
    </html>
  );
}
