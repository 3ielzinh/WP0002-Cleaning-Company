import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const developmentPreviewMeta =
  /<meta(?=[^>]*\bname=["']codex-preview["'])(?=[^>]*\bcontent=["']development["'])[^>]*>/i;

test("renders development preview metadata", async () => {
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
  assert.match(html, developmentPreviewMeta);
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
  assert.match(html, /22\.09\.13\.jpeg/i);
  assert.match(html, /22\.09\.13 \(1\)\.jpeg/i);
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
  assert.match(pageSource, /before-after\/1\.jpeg/i);
  assert.match(pageSource, /before-after\/WhatsApp Image 2026-07-21 at 22\.31\.04\.jpeg/i);
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
