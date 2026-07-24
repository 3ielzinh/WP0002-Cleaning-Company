export type SparCleanBrowserSettings = {
  assetBase?: string;
  leadEndpoint?: string;
  publicConfigEndpoint?: string;
  restNonce?: string;
};

declare global {
  interface Window {
    sparcleanSettings?: SparCleanBrowserSettings;
  }
}

export function getBrowserSettings(): SparCleanBrowserSettings {
  if (typeof window === "undefined") return {};
  return window.sparcleanSettings ?? {};
}

export function assetPath(path: string): string {
  if (!path.startsWith("/")) return path;

  const base = getBrowserSettings().assetBase;
  if (!base) return path;

  return `${base.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;
}
