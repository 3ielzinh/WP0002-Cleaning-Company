import assert from "node:assert/strict";
import test from "node:test";
import {
  SPARCLEAN_CONSENT_VERSION,
  normalizePhone,
  validateLeadSubmission,
} from "../lib/lead-contract.ts";

const validLead = {
  source: "website_form",
  idempotencyKey: "2bd73b1b-89dd-4f02-b915-98d944b9ca50",
  sessionId: "9650fd30-bca9-4436-9ea7-b06052c757fc",
  fullName: "  Jane Customer  ",
  address: "  101 Main Street, Sacramento, CA  ",
  propertySize: 1800,
  phone: "(916) 555-0182",
  email: " JANE@EXAMPLE.COM ",
  services: ["Recurring Cleaning"],
  termsAccepted: true,
  policyAccepted: true,
  consentVersion: SPARCLEAN_CONSENT_VERSION,
  transcript: [],
};

test("normalizes and validates a complete lead", () => {
  const result = validateLeadSubmission(validLead);
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.equal(result.data.fullName, "Jane Customer");
  assert.equal(result.data.normalizedPhone, "9165550182");
  assert.equal(result.data.normalizedEmail, "jane@example.com");
});

test("rejects invalid services and missing consent", () => {
  const invalidService = validateLeadSubmission({
    ...validLead,
    services: ["Unlisted Service"],
  });
  assert.deepEqual(invalidService, {
    ok: false,
    error: "One or more cleaning services are invalid.",
    field: "services",
  });

  const missingConsent = validateLeadSubmission({
    ...validLead,
    termsAccepted: false,
  });
  assert.equal(missingConsent.ok, false);
  if (!missingConsent.ok) assert.equal(missingConsent.field, "consent");
});

test("rejects bot honeypot submissions and unsafe identifiers", () => {
  const bot = validateLeadSubmission({ ...validLead, website: "https://spam.example" });
  assert.equal(bot.ok, false);

  const unsafeId = validateLeadSubmission({ ...validLead, idempotencyKey: "short" });
  assert.equal(unsafeId.ok, false);
  if (!unsafeId.ok) assert.equal(unsafeId.field, "idempotencyKey");
});

test("keeps only a bounded, valid concierge transcript", () => {
  const transcript = Array.from({ length: 35 }, (_, index) => ({
    sender: index % 2 ? "user" : "ai",
    text: `Message ${index}`,
  }));
  transcript[2] = { sender: "system", text: "not allowed" };
  const result = validateLeadSubmission({
    ...validLead,
    source: "website_chat",
    transcript,
  });
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.equal(result.data.transcript.length, 29);
  assert.ok(result.data.transcript.every(message => message.sender === "ai" || message.sender === "user"));
});

test("normalizes formatted phone numbers deterministically", () => {
  assert.equal(normalizePhone("+1 (916) 555-0182"), "19165550182");
});

test("accepts the protected phone concierge as a lead source", () => {
  const result = validateLeadSubmission({
    ...validLead,
    source: "phone_call",
    idempotencyKey: "twilio_CA12345678901234567890123456789012",
  });
  assert.equal(result.ok, true);
});
