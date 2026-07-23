import { leadReference } from "./lead-service";
import { runtimeString, type RuntimeEnvironment } from "./cloudflare";

type OutboxLeadRow = {
  outboxId: string;
  leadId: string;
  status: string;
  attempts: number;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  propertySize: number;
  leadStatus: string;
  source: string;
  createdAt: number;
  services: string | null;
};

export type NotificationDeliveryStatus = "delivered" | "pending" | "awaiting_configuration";

async function hmacHex(secret: string, value: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  return Array.from(new Uint8Array(signature), byte => byte.toString(16).padStart(2, "0")).join("");
}

async function getOutboxLead(db: D1Database, outboxId: string) {
  return db.prepare(
    `SELECT
       o.id AS outboxId, o.lead_id AS leadId, o.status, o.attempts,
       l.full_name AS fullName, l.email, l.phone, l.address,
       l.property_size AS propertySize, l.status AS leadStatus,
       l.latest_source AS source, l.created_at AS createdAt,
       GROUP_CONCAT(s.service, '|') AS services
     FROM notification_outbox o
     JOIN leads l ON l.id = o.lead_id
     LEFT JOIN lead_services s ON s.lead_id = l.id
     WHERE o.id = ?
     GROUP BY o.id, l.id
     LIMIT 1`,
  ).bind(outboxId).first<OutboxLeadRow>();
}

export async function deliverNotification(
  db: D1Database,
  outboxId: string,
  environment: RuntimeEnvironment,
): Promise<NotificationDeliveryStatus> {
  const webhookUrl = runtimeString(environment, "N8N_LEAD_WEBHOOK_URL");
  const webhookSecret = runtimeString(environment, "N8N_WEBHOOK_SECRET");
  const now = Date.now();

  if (!webhookUrl || !webhookSecret) {
    await db.prepare(
      `UPDATE notification_outbox
       SET status = 'awaiting_configuration', updated_at = ?
       WHERE id = ? AND status != 'delivered'`,
    ).bind(now, outboxId).run();
    return "awaiting_configuration";
  }

  const row = await getOutboxLead(db, outboxId);
  if (!row || row.status === "delivered") return row ? "delivered" : "pending";
  const body = JSON.stringify({
    event: "lead.ready_for_follow_up",
    eventId: row.outboxId,
    lead: {
      id: row.leadId,
      reference: leadReference(row.leadId),
      fullName: row.fullName,
      email: row.email,
      phone: row.phone,
      address: row.address,
      propertySize: row.propertySize,
      status: row.leadStatus,
      source: row.source,
      services: row.services ? row.services.split("|") : [],
      createdAt: new Date(row.createdAt).toISOString(),
    },
  });

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-sparclean-event-id": row.outboxId,
        "x-sparclean-signature": await hmacHex(webhookSecret, body),
      },
      body,
      signal: AbortSignal.timeout(6_000),
    });
    if (!response.ok) throw new Error(`HTTP_${response.status}`);

    await db.batch([
      db.prepare(
        `UPDATE notification_outbox
         SET status = 'delivered', attempts = attempts + 1, sent_at = ?,
             last_error = NULL, updated_at = ? WHERE id = ?`,
      ).bind(now, now, outboxId),
      db.prepare(
        `INSERT INTO lead_events (id, lead_id, event_type, source, payload, created_at)
         VALUES (?, ?, 'notification_delivered', 'n8n', ?, ?)`,
      ).bind(crypto.randomUUID(), row.leadId, JSON.stringify({ outboxId }), now),
    ]);
    return "delivered";
  } catch (error) {
    const attempt = row.attempts + 1;
    const retryDelay = Math.min(60 * 60 * 1000, 30_000 * (2 ** Math.min(attempt - 1, 7)));
    const errorCode = error instanceof Error ? error.message.slice(0, 80) : "DELIVERY_ERROR";
    await db.prepare(
      `UPDATE notification_outbox
       SET status = 'retry', attempts = ?, next_attempt_at = ?,
           last_error = ?, updated_at = ? WHERE id = ?`,
    ).bind(attempt, now + retryDelay, errorCode, now, outboxId).run();
    return "pending";
  }
}

export async function deliverPendingNotifications(
  db: D1Database,
  environment: RuntimeEnvironment,
  limit = 20,
) {
  const due = await db.prepare(
    `SELECT id FROM notification_outbox
     WHERE status IN ('pending', 'retry', 'awaiting_configuration')
       AND next_attempt_at <= ?
     ORDER BY created_at ASC LIMIT ?`,
  ).bind(Date.now(), Math.max(1, Math.min(limit, 50))).all<{ id: string }>();

  const results = [];
  for (const row of due.results ?? []) {
    results.push({ id: row.id, status: await deliverNotification(db, row.id, environment) });
  }
  return results;
}
