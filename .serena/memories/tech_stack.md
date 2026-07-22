# Tech Stack
- TypeScript 5.9, strict mode, ESM package, React 19.2, Next.js 16.2 App Router semantics.
- Production/dev pipeline is vinext 0.0.50 + Vite 8 + Cloudflare Vite plugin/Wrangler 4; Node >=22.13 and npm/package-lock.
- Styling: one custom global CSS file plus Tailwind/PostCSS packages; current UI does not use a Tailwind utility architecture.
- Cloudflare Worker entry: `worker/index.ts`; optional D1 through Drizzle ORM 0.45 / drizzle-kit 0.31; schema is empty.
- Deployment supports OpenAI Sites/Cloudflare artifact and a Vercel fallback: `scripts/build-entry.mjs` selects Next build only when `VERCEL=1`.
- Tests use Node's built-in `node:test`, asserting rendered production HTML and source/CSS invariants.