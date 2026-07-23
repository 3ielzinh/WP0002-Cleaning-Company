import { getAdminUser } from "@/lib/server/admin-auth";
import { getRuntimeEnvironment } from "@/lib/server/cloudflare";
import { deliverPendingNotifications } from "@/lib/server/notifications";

export const dynamic = "force-dynamic";

export async function POST() {
  const admin = await getAdminUser();
  if (!admin.user) return Response.json({ ok: false, error: "Sign in required." }, { status: 401 });
  if (!admin.authorized) return Response.json({ ok: false, error: "This account is not authorized." }, { status: 403 });
  const environment = await getRuntimeEnvironment();
  if (!environment.DB) return Response.json({ ok: false, error: "Database unavailable." }, { status: 503 });

  const results = await deliverPendingNotifications(environment.DB, environment);
  return Response.json({
    ok: true,
    processed: results.length,
    delivered: results.filter(result => result.status === "delivered").length,
  });
}
