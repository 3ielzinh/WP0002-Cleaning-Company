declare module "cloudflare:workers" {
  // Minimal ambient typing so non-Cloudflare type-checks (e.g. Vercel) can pass.
  export const env: {
    DB?: unknown;
    [key: string]: unknown;
  };
}
