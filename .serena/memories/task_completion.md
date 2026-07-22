# Completion Checks
- Production artifact: `& 'C:\Program Files\Git\bin\bash.exe' scripts/build-verified.sh`.
- Tests against built artifact: `node --test tests/rendered-html.test.mjs`.
- Typecheck without generating `tsconfig.tsbuildinfo`: `npx.cmd --no-install tsc --noEmit --incremental false`.
- Lint: `npx.cmd --no-install eslint . --ignore-pattern dist --ignore-pattern .next --ignore-pattern .wrangler --ignore-pattern .vinext --ignore-pattern .serena`.
- For layout/interaction changes, visually verify desktop and a ~390px mobile viewport; check no horizontal overflow, menu toggle, carousel controls, estimate step progression, image loading, and browser console.
- Baseline as of 2026-07-22: verified vinext build passes; 2 Node tests pass; TypeScript passes; browser console clean. ESLint has one error in `types/cloudflare-workers.d.ts` (empty `Fetcher` interface) and five `@next/next/no-img-element` warnings in `app/page.tsx`.