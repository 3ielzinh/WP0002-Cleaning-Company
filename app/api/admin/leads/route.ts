import { getAdminUser } from "@/lib/server/admin-auth";
import { getD1 } from "@/lib/server/cloudflare";

export const dynamic = "force-dynamic";

const leadStatuses = ["new", "contacted", "qualified", "scheduled", "won", "lost"] as const;
type LeadStatus = typeof leadStatuses[number];

function isLeadStatus(value: unknown): value is LeadStatus {
  return typeof value === "string" && leadStatuses.includes(value as LeadStatus);
}

async function authorize() {
  const admin = await getAdminUser();
  if (!admin.user) return { response: Response.json({ ok: false, error: "Sign in required." }, { status: 401 }) };
  if (!admin.authorized) return { response: Response.json({ ok: false, error: "This account is not authorized." }, { status: 403 }) };
  const db = await getD1();
  if (!db) return { response: Response.json({ ok: false, error: "Database unavailable." }, { status: 503 }) };
  return { db, user: admin.user };
}

export async function GET(request: Request) {
  const authorization = await authorize();
  if ("response" in authorization) return authorization.response;
  const { db } = authorization;
  const url = new URL(request.url);
  const requestedStatus = url.searchParams.get("status") ?? "";
  const status = isLeadStatus(requestedStatus) ? requestedStatus : "";
  const search = (url.searchParams.get("search") ?? "").trim().slice(0, 100);
  const searchPattern = `%${search}%`;

  const [leadResult, statusResult, notificationResult] = await Promise.all([
    db.prepare(
      `SELECT
         l.id, l.full_name AS fullName, l.email, l.phone, l.address,
         l.property_size AS propertySize, l.status, l.first_source AS firstSource,
         l.latest_source AS latestSource, l.created_at AS createdAt,
         l.updated_at AS updatedAt, GROUP_CONCAT(s.service, '|') AS services
       FROM leads l
       LEFT JOIN lead_services s ON s.lead_id = l.id
       WHERE (? = '' OR l.status = ?)
         AND (? = '' OR l.full_name LIKE ? OR l.email LIKE ? OR l.phone LIKE ? OR l.address LIKE ?)
       GROUP BY l.id
       ORDER BY CASE l.status WHEN 'new' THEN 0 WHEN 'contacted' THEN 1 ELSE 2 END, l.updated_at DESC
       LIMIT 100`,
    ).bind(status, status, search, searchPattern, searchPattern, searchPattern, searchPattern).all(),
    db.prepare("SELECT status, COUNT(*) AS count FROM leads GROUP BY status").all<{ status: string; count: number }>(),
    db.prepare(
      `SELECT
         SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END) AS delivered,
         SUM(CASE WHEN status != 'delivered' THEN 1 ELSE 0 END) AS pending
       FROM notification_outbox`,
    ).first<{ delivered: number | null; pending: number | null }>(),
  ]);

  const counts = Object.fromEntries(leadStatuses.map(item => [item, 0])) as Record<LeadStatus, number>;
  for (const row of statusResult.results ?? []) {
    if (isLeadStatus(row.status)) counts[row.status] = Number(row.count);
  }

  return Response.json({
    ok: true,
    leads: (leadResult.results ?? []).map(row => ({
      ...row,
      services: typeof (row as { services?: unknown }).services === "string"
        ? ((row as { services: string }).services.split("|"))
        : [],
    })),
    counts,
    notifications: {
      delivered: Number(notificationResult?.delivered ?? 0),
      pending: Number(notificationResult?.pending ?? 0),
    },
  }, { headers: { "cache-control": "no-store" } });
}

export async function PATCH(request: Request) {
  const authorization = await authorize();
  if ("response" in authorization) return authorization.response;
  const { db, user } = authorization;
  const input = await request.json().catch(() => null) as { leadId?: unknown; status?: unknown } | null;
  const leadId = typeof input?.leadId === "string" ? input.leadId : "";
  if (!/^[a-zA-Z0-9_-]{16,128}$/.test(leadId) || !isLeadStatus(input?.status)) {
    return Response.json({ ok: false, error: "Invalid lead update." }, { status: 422 });
  }

  const now = Date.now();
  const result = await db.prepare(
    "UPDATE leads SET status = ?, updated_at = ? WHERE id = ?",
  ).bind(input.status, now, leadId).run();
  if ((result.meta?.changes as number | undefined) === 0) {
    return Response.json({ ok: false, error: "Lead not found." }, { status: 404 });
  }
  await db.prepare(
    `INSERT INTO lead_events (id, lead_id, event_type, source, payload, created_at)
     VALUES (?, ?, 'status_changed', 'admin', ?, ?)`,
  ).bind(
    crypto.randomUUID(),
    leadId,
    JSON.stringify({ status: input.status, changedBy: user.email }),
    now,
  ).run();
  return Response.json({ ok: true, status: input.status });
}
