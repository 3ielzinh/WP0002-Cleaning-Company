import { getRuntimeEnvironment, runtimeString } from "@/lib/server/cloudflare";

export const dynamic = "force-dynamic";

export async function GET() {
  const environment = await getRuntimeEnvironment();
  return Response.json({
    turnstileSiteKey: runtimeString(environment, "TURNSTILE_SITE_KEY"),
    googleAnalyticsId: runtimeString(environment, "GOOGLE_ANALYTICS_ID"),
  }, {
    headers: {
      "cache-control": "public, max-age=300, stale-while-revalidate=3600",
    },
  });
}
