import { getRuntimeEnvironment, runtimeString } from "@/lib/server/cloudflare";
import { deliverPendingNotifications } from "@/lib/server/notifications";

export const dynamic = "force-dynamic";

function constantTimeEqual(left: string, right: string) {
  const encoder = new TextEncoder();
  const a = encoder.encode(left);
  const b = encoder.encode(right);
  if (a.length !== b.length) return false;
  let difference = 0;
  for (let index = 0; index < a.length; index += 1) difference |= a[index] ^ b[index];
  return difference === 0;
}

export async function POST(request: Request) {
  const environment = await getRuntimeEnvironment();
  const secret = runtimeString(environment, "AUTOMATION_SECRET");
  const authorization = request.headers.get("authorization");
  if (!secret) return Response.json({ ok: false, error: "Automation is not configured." }, { status: 503 });
  if (!authorization?.startsWith("Bearer ") || !constantTimeEqual(authorization.slice(7), secret)) {
    return Response.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }
  if (!environment.DB) return Response.json({ ok: false, error: "Database unavailable." }, { status: 503 });

  const results = await deliverPendingNotifications(environment.DB, environment);
  return Response.json({
    ok: true,
    processed: results.length,
    delivered: results.filter(result => result.status === "delivered").length,
    pending: results.filter(result => result.status !== "delivered").length,
  });
}
