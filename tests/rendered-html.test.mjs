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
  assert.match(html, /sparclean-logo-hq\.png/i);
  assert.match(html, /favicon-32x32\.png/i);
  assert.match(html, /apple-touch-icon\.png/i);
  assert.doesNotMatch(html, /sparclean-icon\.jpg/i);
  assert.match(html, /aria-roledescription=["']carousel["']/i);
  assert.match(html, /Commercial cleaning is our specialty/i);
  assert.match(html, /hero-commercial-man-4\.webp/i);
  assert.match(html, /hero-commercial-man-cart-tan-gloves\.webp/i);
  assert.match(html, /hero-residential-woman-action-tan-gloves\.webp/i);
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
  assert.match(styles, /--brand-gold:\s*#d1b02b/i);
  assert.match(styles, /\.announcement\s*\{[^}]*background:\s*var\(--brand-gold\)/is);
  assert.match(styles, /\.footer\s*\{[^}]*var\(--brand-gold\)/is);
  assert.match(
    styles,
    /\.compare-image\.before\s*\{[^}]*clip-path:\s*inset\(0 calc\(100% - var\(--compare-position\)\) 0 0\)/is,
  );
});
