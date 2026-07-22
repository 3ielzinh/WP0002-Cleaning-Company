# Conventions
- Use double quotes, semicolons, two-space indentation, React function components, explicit `type`/interface declarations, and immutable functional state updates.
- `app/page.tsx` is intentionally a monolithic client page: static content collections live above `Home`; SVG icons are centralized in the local `Icon` component; interactive state/handlers remain inside `Home`.
- CSS is semantic/BEM-like custom class naming, driven by CSS variables and media queries in `app/globals.css`; preserve the established gold/black/ivory luxury visual language.
- Accessibility is a deliberate invariant: carousel labels/controls/live announcements, progressbar and grouped form steps, focus transfer between steps, reduced-motion handling, keyboard/native controls, descriptive image alt text.
- Hero carousel pauses for user pause, hover, focus, out-of-view, hidden-page, and reduced-motion states; preserve all pause conditions when changing it.
- Estimate form has four locally managed steps and validates only client-side. Do not imply data persistence/integration unless implementing a real endpoint.
- Generated output/state directories (`dist`, `.wrangler`, `.vinext`, `.next`) are not source and should not be hand-edited.