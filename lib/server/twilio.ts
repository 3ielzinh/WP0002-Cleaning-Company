import { runtimeString, type RuntimeEnvironment } from "./cloudflare.ts";

function constantTimeEqual(left: string, right: string) {
  const a = new TextEncoder().encode(left);
  const b = new TextEncoder().encode(right);
  if (a.length !== b.length) return false;
  let difference = 0;
  for (let index = 0; index < a.length; index += 1) difference |= a[index] ^ b[index];
  return difference === 0;
}

function base64(bytes: ArrayBuffer) {
  let binary = "";
  for (const byte of new Uint8Array(bytes)) binary += String.fromCharCode(byte);
  return btoa(binary);
}

export async function validateTwilioRequest(
  request: Request,
  parameters: URLSearchParams,
  environment: RuntimeEnvironment,
) {
  const authToken = runtimeString(environment, "TWILIO_AUTH_TOKEN");
  const signature = request.headers.get("x-twilio-signature");
  if (!authToken || !signature) return false;

  const configuredBase = runtimeString(environment, "TWILIO_PUBLIC_BASE_URL");
  const requestUrl = configuredBase
    ? `${configuredBase.replace(/\/+$/, "")}${new URL(request.url).pathname}${new URL(request.url).search}`
    : request.url;
  let signedValue = requestUrl;
  for (const key of [...new Set(parameters.keys())].sort()) {
    const values = parameters.getAll(key).sort();
    for (const value of values) signedValue += `${key}${value}`;
  }

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(authToken),
    { name: "HMAC", hash: "SHA-1" },
    false,
    ["sign"],
  );
  const digest = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(signedValue));
  return constantTimeEqual(base64(digest), signature);
}

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&apos;");
}

export function twimlSay(message: string, hangup = false) {
  return `<?xml version="1.0" encoding="UTF-8"?><Response><Say voice="Polly.Joanna" language="en-US">${escapeXml(message)}</Say>${hangup ? "<Hangup/>" : ""}</Response>`;
}

export function twimlGather(message: string, action: string, hints?: string) {
  const hintAttribute = hints ? ` hints="${escapeXml(hints)}"` : "";
  return `<?xml version="1.0" encoding="UTF-8"?><Response><Gather input="speech dtmf" action="${escapeXml(action)}" method="POST" speechTimeout="auto" timeout="6" finishOnKey="#"${hintAttribute}><Say voice="Polly.Joanna" language="en-US">${escapeXml(message)}</Say></Gather><Redirect method="POST">${escapeXml(action)}</Redirect></Response>`;
}

export function twimlResponse(xml: string, status = 200) {
  return new Response(xml, {
    status,
    headers: {
      "content-type": "application/xml; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}
