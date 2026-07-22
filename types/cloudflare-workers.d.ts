interface Fetcher {
  fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response>;
}

type D1Database = object;

declare module "cloudflare:workers" {
  // Minimal ambient typing so non-Cloudflare type-checks (e.g. Vercel) can pass.
  export const env: {
    DB?: D1Database;
    [key: string]: unknown;
  };
}
