export type RuntimeEnvironment = {
  DB?: D1Database;
  [key: string]: unknown;
};

export async function getRuntimeEnvironment(): Promise<RuntimeEnvironment> {
  const runtime = await import("cloudflare:workers");
  return runtime.env as RuntimeEnvironment;
}

export async function getD1(): Promise<D1Database | null> {
  return (await getRuntimeEnvironment()).DB ?? null;
}

export function runtimeString(environment: RuntimeEnvironment, key: string) {
  const value = environment[key];
  return typeof value === "string" && value.trim() ? value.trim() : null;
}
