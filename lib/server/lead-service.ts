import type {
  LeadSubmission,
  LeadSubmissionResponse,
} from "@/lib/lead-contract";

const dedupeWindowMs = 30 * 24 * 60 * 60 * 1000;
const rateLimitWindowMs = 15 * 60 * 1000;
const rateLimitMaximum = 8;

type PersistableLead = LeadSubmission & {
  normalizedEmail: string;
  normalizedPhone: string;
};

type ReceiptRow = {
  leadId: string;
  disposition: "created" | "updated";
};

type LeadRow = {
  id: string;
};

type RateLimitRow = {
  windowStartedAt: number;
  requestCount: number;
};

export type PersistLeadResult = {
  response: LeadSubmissionResponse;
  outboxId: string | null;
  replayed: boolean;
};

export class LeadRateLimitError extends Error {
  constructor() {
    super("Too many requests were sent. Please wait a few minutes and try again.");
    this.name = "LeadRateLimitError";
  }
}

export function leadReference(leadId: string) {
  return `SC-${leadId.replace(/-/g, "").slice(0, 8).toUpperCase()}`;
}

export async function hashIp(value: string) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, "0")).join("").slice(0, 32);
}

export async function findReceipt(db: D1Database, idempotencyKey: string) {
  return db.prepare(
    `SELECT lead_id AS leadId, disposition
     FROM submission_receipts
     WHERE idempotency_key = ?
     LIMIT 1`,
  ).bind(idempotencyKey).first<ReceiptRow>();
}

export function successResponse(
  receipt: ReceiptRow,
  notification: LeadSubmissionResponse["notification"] = "pending",
): LeadSubmissionResponse {
  return {
    ok: true,
    leadId: receipt.leadId,
    reference: leadReference(receipt.leadId),
    disposition: receipt.disposition,
    notification,
  };
}

export async function persistLead(
  db: D1Database,
  lead: PersistableLead,
  options: { ipHash?: string | null } = {},
): Promise<PersistLeadResult> {
  const existingReceipt = await findReceipt(db, lead.idempotencyKey);
  if (existingReceipt) {
    return {
      response: successResponse(existingReceipt),
      outboxId: null,
      replayed: true,
    };
  }

  const now = Date.now();
  let rateLimitStatement: D1PreparedStatement | null = null;
  if (options.ipHash) {
    const rateLimit = await db.prepare(
      `SELECT window_started_at AS windowStartedAt, request_count AS requestCount
       FROM lead_rate_limits WHERE ip_hash = ? LIMIT 1`,
    ).bind(options.ipHash).first<RateLimitRow>();
    if (rateLimit && now - rateLimit.windowStartedAt < rateLimitWindowMs && rateLimit.requestCount >= rateLimitMaximum) {
      throw new LeadRateLimitError();
    }
    rateLimitStatement = db.prepare(
      `INSERT INTO lead_rate_limits (ip_hash, window_started_at, request_count, updated_at)
       VALUES (?, ?, 1, ?)
       ON CONFLICT(ip_hash) DO UPDATE SET
         window_started_at = CASE
           WHEN excluded.updated_at - lead_rate_limits.window_started_at >= ? THEN excluded.window_started_at
           ELSE lead_rate_limits.window_started_at
         END,
         request_count = CASE
           WHEN excluded.updated_at - lead_rate_limits.window_started_at >= ? THEN 1
           ELSE lead_rate_limits.request_count + 1
         END,
         updated_at = excluded.updated_at`,
    ).bind(options.ipHash, now, now, rateLimitWindowMs, rateLimitWindowMs);
  }

  const existingLead = await db.prepare(
    `SELECT id FROM leads
     WHERE updated_at >= ? AND (normalized_phone = ? OR normalized_email = ?)
     ORDER BY updated_at DESC LIMIT 1`,
  ).bind(now - dedupeWindowMs, lead.normalizedPhone, lead.normalizedEmail).first<LeadRow>();

  const leadId = existingLead?.id ?? crypto.randomUUID();
  const disposition: ReceiptRow["disposition"] = existingLead ? "updated" : "created";
  const statements: D1PreparedStatement[] = [];

  if (existingLead) {
    statements.push(db.prepare(
      `UPDATE leads SET
         full_name = ?, email = ?, normalized_email = ?, phone = ?, normalized_phone = ?,
         address = ?, property_size = ?, latest_source = ?, terms_accepted = 1,
         policy_accepted = 1, consent_version = ?, consented_at = ?, updated_at = ?
       WHERE id = ?`,
    ).bind(
      lead.fullName, lead.email, lead.normalizedEmail, lead.phone, lead.normalizedPhone,
      lead.address, lead.propertySize, lead.source, lead.consentVersion, now, now, leadId,
    ));
  } else {
    statements.push(db.prepare(
      `INSERT INTO leads (
         id, full_name, email, normalized_email, phone, normalized_phone, address,
         property_size, status, first_source, latest_source, terms_accepted,
         policy_accepted, consent_version, consented_at, created_at, updated_at
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'new', ?, ?, 1, 1, ?, ?, ?, ?)`,
    ).bind(
      leadId, lead.fullName, lead.email, lead.normalizedEmail, lead.phone, lead.normalizedPhone,
      lead.address, lead.propertySize, lead.source, lead.source, lead.consentVersion, now, now, now,
    ));
  }

  statements.push(db.prepare("DELETE FROM lead_services WHERE lead_id = ?").bind(leadId));
  for (const service of lead.services) {
    statements.push(db.prepare(
      "INSERT INTO lead_services (lead_id, service, created_at) VALUES (?, ?, ?)",
    ).bind(leadId, service, now));
  }

  if (lead.transcript.length) {
    const conversationId = crypto.randomUUID();
    statements.push(db.prepare(
      `INSERT INTO conversations (
         id, lead_id, session_id, channel, summary, message_count, started_at, completed_at
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(channel, session_id) DO UPDATE SET
         lead_id = excluded.lead_id, summary = excluded.summary,
         message_count = excluded.message_count, completed_at = excluded.completed_at`,
    ).bind(
      conversationId,
      leadId,
      lead.sessionId,
      lead.source,
      JSON.stringify({ services: lead.services, propertySize: lead.propertySize }),
      lead.transcript.length,
      now,
      now,
    ));
    statements.push(db.prepare(
      `DELETE FROM conversation_messages
       WHERE conversation_id = (
         SELECT id FROM conversations WHERE channel = ? AND session_id = ?
       )`,
    ).bind(lead.source, lead.sessionId));
    lead.transcript.forEach((message, index) => {
      statements.push(db.prepare(
        `INSERT INTO conversation_messages (id, conversation_id, sender, message, sequence, created_at)
         SELECT ?, id, ?, ?, ?, ? FROM conversations WHERE channel = ? AND session_id = ?`,
      ).bind(
        crypto.randomUUID(), message.sender, message.text, index, now, lead.source, lead.sessionId,
      ));
    });
  }

  const outboxId = crypto.randomUUID();
  statements.push(
    db.prepare(
      "INSERT INTO lead_events (id, lead_id, event_type, source, payload, created_at) VALUES (?, ?, ?, ?, ?, ?)",
    ).bind(
      crypto.randomUUID(),
      leadId,
      disposition === "created" ? "lead_created" : "lead_updated",
      lead.source,
      JSON.stringify({ servicesCount: lead.services.length, consentVersion: lead.consentVersion }),
      now,
    ),
    db.prepare(
      `INSERT INTO notification_outbox (
         id, lead_id, status, attempts, next_attempt_at, created_at, updated_at
       ) VALUES (?, ?, 'pending', 0, ?, ?, ?)`,
    ).bind(outboxId, leadId, now, now, now),
    db.prepare(
      "INSERT INTO lead_events (id, lead_id, event_type, source, payload, created_at) VALUES (?, ?, 'notification_pending', ?, '{}', ?)",
    ).bind(crypto.randomUUID(), leadId, lead.source, now),
    db.prepare(
      "INSERT INTO submission_receipts (idempotency_key, lead_id, disposition, created_at) VALUES (?, ?, ?, ?)",
    ).bind(lead.idempotencyKey, leadId, disposition, now),
  );
  if (rateLimitStatement) statements.push(rateLimitStatement);

  await db.batch(statements);
  return {
    response: successResponse({ leadId, disposition }),
    outboxId,
    replayed: false,
  };
}
