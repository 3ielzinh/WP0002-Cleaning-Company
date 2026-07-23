import { validateLeadSubmission } from "@/lib/lead-contract";
import { getRuntimeEnvironment, runtimeString } from "@/lib/server/cloudflare";
import {
  findReceipt,
  hashIp,
  LeadRateLimitError,
  persistLead,
  successResponse,
} from "@/lib/server/lead-service";
import { deliverNotification } from "@/lib/server/notifications";

export const dynamic = "force-dynamic";

const maximumBodyBytes = 32_768;

function json(body: unknown, status = 200, requestId?: string) {
  return Response.json(body, {
    status,
    headers: {
      "cache-control": "no-store",
      ...(requestId ? { "x-request-id": requestId } : {}),
    },
  });
}

async function readJsonBody(request: Request) {
  const announcedSize = Number(request.headers.get("content-length") ?? "0");
  if (announcedSize > maximumBodyBytes) throw new RangeError("payload");
  const raw = await request.text();
  if (new TextEncoder().encode(raw).byteLength > maximumBodyBytes) throw new RangeError("payload");
  return JSON.parse(raw) as unknown;
}

async function verifyTurnstile(
  input: unknown,
  secret: string | null,
  remoteIp: string | null,
  requestId: string,
) {
  if (!secret) return true;
  const token = input && typeof input === "object" && !Array.isArray(input)
    ? (input as Record<string, unknown>).turnstileToken
    : null;
  if (typeof token !== "string" || !token) return false;

  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        secret,
        response: token,
        remoteip: remoteIp,
        idempotency_key: requestId,
      }),
      signal: AbortSignal.timeout(5_000),
    });
    const result = await response.json() as { success?: boolean };
    return response.ok && result.success === true;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  const requestId = crypto.randomUUID();
  const environment = await getRuntimeEnvironment();
  const db = environment.DB;
  if (!db) {
    return json({ ok: false, error: "Lead storage is temporarily unavailable. Please call (916) 546-0021." }, 503, requestId);
  }

  if (!request.headers.get("content-type")?.toLowerCase().includes("application/json")) {
    return json({ ok: false, error: "This endpoint accepts JSON requests only." }, 415, requestId);
  }

  let input: unknown;
  try {
    input = await readJsonBody(request);
  } catch (error) {
    const message = error instanceof RangeError ? "The request is too large." : "The request body is invalid.";
    return json({ ok: false, error: message }, error instanceof RangeError ? 413 : 400, requestId);
  }

  const validation = validateLeadSubmission(input);
  if (!validation.ok) {
    return json({ ok: false, error: validation.error, field: validation.field }, 422, requestId);
  }
  const lead = validation.data;
  if (lead.source === "phone_call") {
    return json({ ok: false, error: "This request source is not available on the website endpoint." }, 403, requestId);
  }

  try {
    const existingReceipt = await findReceipt(db, lead.idempotencyKey);
    if (existingReceipt) return json(successResponse(existingReceipt), 200, requestId);

    const connectingIp = request.headers.get("cf-connecting-ip")?.trim() || null;
    const turnstileValid = await verifyTurnstile(
      input,
      runtimeString(environment, "TURNSTILE_SECRET_KEY"),
      connectingIp,
      requestId,
    );
    if (!turnstileValid) {
      return json({ ok: false, error: "Please complete the security check and try again." }, 403, requestId);
    }

    const persisted = await persistLead(db, lead, {
      ipHash: connectingIp ? await hashIp(connectingIp) : null,
    });
    const notification = persisted.outboxId
      ? await deliverNotification(db, persisted.outboxId, environment)
      : persisted.response.notification;
    return json(
      { ...persisted.response, notification },
      persisted.response.disposition === "created" ? 201 : 200,
      requestId,
    );
  } catch (error) {
    if (error instanceof LeadRateLimitError) {
      return json({ ok: false, error: error.message }, 429, requestId);
    }
    const receipt = await findReceipt(db, lead.idempotencyKey).catch(() => null);
    if (receipt) return json(successResponse(receipt), 200, requestId);
    console.error("Lead persistence failed", {
      requestId,
      error: error instanceof Error ? error.name : "UnknownError",
    });
    return json({ ok: false, error: "We could not save your request right now. Please try again or call (916) 546-0021." }, 500, requestId);
  }
}
