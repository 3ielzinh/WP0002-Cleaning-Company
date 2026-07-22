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
  assert.match(html, /hero-commercial-man-action\.webp/i);
  assert.match(html, /hero-commercial-man-cart\.webp/i);
  assert.match(html, /hero-residential-woman-action\.webp/i);
  assert.match(html, /kitchen-before-matched\.webp/i);
  assert.match(html, /Residential care/i);
  assert.ok(
    html.indexOf('id="quote"') < html.indexOf('id="services"'),
    "the quote form should render before the services section",
  );
});

test("before-and-after comparison reveals one full-size continuous scene", async () => {
  const [pageSource, styles] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);

  assert.doesNotMatch(pageSource, /className="compare-image before"\s+style=\{\{\s*width:/i);
  assert.match(pageSource, /--compare-position/i);
  assert.match(
    styles,
    /\.compare-image\.before\s*\{[^}]*clip-path:\s*inset\(0 calc\(100% - var\(--compare-position\)\) 0 0\)/is,
  );
});
