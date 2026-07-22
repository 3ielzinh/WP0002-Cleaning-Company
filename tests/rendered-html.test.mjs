import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("renders production SEO metadata and accessible image descriptions", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  const response = await worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );

  assert.equal(response.status, 200);
  assert.match(
    response.headers.get("content-type") ?? "",
    /^text\/html\b/i,
  );
  const html = await response.text();
  assert.match(html, /<title>SparClean \| Sacramento Cleaning Services<\/title>/i);
  assert.match(html, /<meta(?=[^>]*name=["']description["'])(?=[^>]*Premium commercial and residential cleaning in Sacramento)/i);
  assert.match(html, /<link(?=[^>]*rel=["']canonical["'])(?=[^>]*href=["']https:\/\/sparcleanbr\.com\/?["'])/i);
  assert.match(html, /<meta(?=[^>]*name=["']robots["'])(?=[^>]*content=["'][^"']*index[^"']*follow)/i);
  assert.match(html, /<meta(?=[^>]*name=["']googlebot["'])(?=[^>]*max-image-preview:large)/i);
  assert.doesNotMatch(html, /\[object%20Object\]/i);
  assert.match(html, /<meta(?=[^>]*property=["']og:image["'])(?=[^>]*sparclean-social-card\.jpg)/i);
  assert.match(html, /application\/ld\+json/i);
  assert.match(html, /"@type":"Organization"/i);
  assert.match(html, /"@type":"FAQPage"/i);
  assert.doesNotMatch(html, /codex-preview/i);
  const imageTags = [...html.matchAll(/<img\b[^>]*>/gi)].map((match) => match[0]);
  assert.ok(imageTags.length > 0, "the page should render meaningful images");
  for (const imageTag of imageTags) {
    assert.match(imageTag, /\balt=["'][^"']+["']/i, `missing descriptive alt text: ${imageTag}`);
    assert.match(imageTag, /\bwidth=["']\d+["']/i, `missing image width: ${imageTag}`);
    assert.match(imageTag, /\bheight=["']\d+["']/i, `missing image height: ${imageTag}`);
  }
  assert.equal((html.match(/<h1\b/gi) ?? []).length, 1, "the page should have exactly one H1");
  assert.match(html, /class=["']form-step-count["']/i);
  assert.match(html, /What would you like us to clean\?/i);
  assert.match(html, /English-speaking team/i);
  assert.match(html, /Pet-friendly care/i);
  assert.match(html, /Child-friendly cleaning/i);
  assert.match(html, /Client reviews/i);
  assert.match(html, /Every transformation/i);
  assert.match(html, /Client before and after cleaning gallery/i);
  assert.match(html, /Original condition/i);
  assert.match(html, /SparClean finish/i);
  assert.match(html, /results\/stovetop-before\.jpeg/i);
  assert.match(html, /results\/stovetop-after\.jpeg/i);
  assert.match(html, /Stovetop restoration/i);
  assert.match(html, /care-english-speaking\.webp/i);
  assert.match(html, /care-pet-friendly\.webp/i);
  assert.match(html, /care-child-friendly\.webp/i);
  assert.match(html, /role=["']tablist["']/i);
  assert.match(html, /sparclean-logo-hq\.png/i);
  assert.match(html, /favicon-32x32\.png/i);
  assert.match(html, /apple-touch-icon\.png/i);
  assert.doesNotMatch(html, /sparclean-icon\.jpg/i);
  assert.match(html, /aria-roledescription=["']carousel["']/i);
  assert.match(html, /Commercial cleaning is our specialty/i);
  assert.match(html, /hero-commercial-man-5\.webp/i);
  assert.match(html, /hero-commercial-man-cart-tan-gloves\.webp/i);
  assert.match(html, /hero-residential-woman-3\.webp/i);
  assert.match(html, /kitchen-before-matched\.webp/i);
  assert.match(html, /Residential care/i);
  assert.match(html, /Luxury is having one less thing to worry about\./i);
  assert.match(html, /Thank you for considering SparClean Cleaning Services LLC\./i);
  assert.match(html, /proudly serving Sacramento and surrounding areas/i);
  assert.match(html, /\(916\) 546-0021/i);
  assert.match(html, /background-checked, carefully selected, and extensively trained/i);
  assert.match(html, /limited number of recurring clients/i);
  assert.match(html, /enjoy the moments that matter most/i);
  assert.match(html, /id=["']about["']/i);
  assert.ok(
    html.indexOf('id="estimate"') < html.indexOf('id="services"'),
    "the estimate form should render before the services section",
  );
});

test("before-and-after comparison reveals one full-size continuous scene", async () => {
  const [pageSource, styles] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);

  assert.doesNotMatch(pageSource, /className="compare-image before"\s+style=\{\{\s*width:/i);
  assert.match(pageSource, /--compare-position/i);
  assert.doesNotMatch(pageSource, /scheduled service value|additional cost/i);
  assert.match(pageSource, /scheduled service estimate/i);
  assert.match(pageSource, /without increasing the original estimate/i);
  assert.doesNotMatch(
    pageSource,
    /(?:private|tailored|free|thoughtful|your|service|detailed)\s+quote|quote request|a quote/i,
  );
  assert.match(pageSource, /Request a tailored estimate/i);
  assert.match(pageSource, /Estimate request ready/i);
  assert.doesNotMatch(pageSource, /98%|Thoughtfully matched team/i);
  assert.match(pageSource, /Thoughtful around our pets/i);
  assert.match(pageSource, /Post-construction cleaning/i);
  assert.match(pageSource, /clientReviews\.length/i);
  assert.match(pageSource, /transformationCases\.length/i);
  assert.match(pageSource, /results\/stovetop-before\.jpeg/i);
  assert.match(pageSource, /results\/stovetop-after\.jpeg/i);
  assert.doesNotMatch(pageSource, /before-after\/WhatsApp Image/i);
  assert.doesNotMatch(pageSource, /transformation-gallery-tabs/i);
  assert.doesNotMatch(pageSource, /Layout preview · Actual client photos/i);
  assert.match(styles, /\.transformation-photo-media\s*\{[^}]*aspect-ratio:\s*4\s*\/\s*5/is);
  assert.match(styles, /\.transformation-photo-media:before\s*\{[^}]*background-image:\s*var\(--photo-image\)[^}]*blur\(22px\)/is);
  assert.match(styles, /\.transformation-photo-media img\s*\{[^}]*object-fit:\s*contain/is);
  assert.match(styles, /--brand-gold:\s*#d4af37/i);
  assert.match(styles, /\.announcement\s*\{[^}]*background:\s*var\(--gold-panel\)/is);
  assert.match(styles, /\.button:hover\s*\{[^}]*background:\s*var\(--gold-sheen\)/is);
  assert.match(
    styles,
    /\.client-care-panel\s*\{[^}]*clip-path:\s*polygon\(0 0, calc\(100% - 42px\) 0, 100% 100%, 42px 100%\)/is,
  );
  assert.match(styles, /\.footer\s*\{[^}]*var\(--brand-gold\)/is);
  assert.match(
    styles,
    /\.compare-image\.before\s*\{[^}]*clip-path:\s*inset\(0 calc\(100% - var\(--compare-position\)\) 0 0\)/is,
  );
});

test("serves robots, image sitemap, and web app manifest", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("seo-test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  const env = {
    ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
  };
  const ctx = { waitUntil() {}, passThroughOnException() {} };

  const robotsResponse = await worker.fetch(new Request("https://sparcleanbr.com/robots.txt"), env, ctx);
  assert.equal(robotsResponse.status, 200);
  assert.match(robotsResponse.headers.get("content-type") ?? "", /^text\/plain/i);
  const robots = await robotsResponse.text();
  assert.match(robots, /User-Agent: \*/i);
  assert.match(robots, /Allow: \//i);
  assert.match(robots, /Sitemap: https:\/\/sparcleanbr\.com\/sitemap\.xml/i);

  const sitemapResponse = await worker.fetch(new Request("https://sparcleanbr.com/sitemap.xml"), env, ctx);
  assert.equal(sitemapResponse.status, 200);
  assert.match(sitemapResponse.headers.get("content-type") ?? "", /application\/xml/i);
  const sitemap = await sitemapResponse.text();
  assert.match(sitemap, /<loc>https:\/\/sparcleanbr\.com<\/loc>/i);
  assert.match(sitemap, /xmlns:image=/i);
  assert.match(sitemap, /results\/stovetop-before\.jpeg/i);
  assert.match(sitemap, /sparclean-social-card\.jpg/i);

  const manifestResponse = await worker.fetch(new Request("https://sparcleanbr.com/manifest.webmanifest"), env, ctx);
  assert.equal(manifestResponse.status, 200);
  assert.match(manifestResponse.headers.get("content-type") ?? "", /application\/manifest\+json/i);
  const manifest = await manifestResponse.json();
  assert.equal(manifest.name, "SparClean Cleaning Services");
  assert.equal(manifest.theme_color, "#d4af37");
});
