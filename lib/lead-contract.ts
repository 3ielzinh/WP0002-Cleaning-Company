export const LEAD_SOURCES = ["website_form", "website_chat", "phone_call"] as const;
export const SPARCLEAN_CONSENT_VERSION = "2026-07-23";

export const CLEANING_SERVICES = [
  "Office Cleaning",
  "Recurring Cleaning",
  "Deep Cleaning",
  "Move-In Cleaning",
  "Move-Out Cleaning",
  "Post-Construction Cleaning",
  "Airbnb Turnover",
] as const;

export type LeadSource = typeof LEAD_SOURCES[number];
export type CleaningService = typeof CLEANING_SERVICES[number];
export type LeadTranscriptMessage = {
  sender: "ai" | "user";
  text: string;
};

export type LeadSubmission = {
  source: LeadSource;
  idempotencyKey: string;
  sessionId: string;
  fullName: string;
  address: string;
  propertySize: number;
  phone: string;
  email: string;
  services: CleaningService[];
  termsAccepted: true;
  policyAccepted: true;
  consentVersion: string;
  transcript: LeadTranscriptMessage[];
};

export type LeadSubmissionResponse = {
  ok: true;
  leadId: string;
  reference: string;
  disposition: "created" | "updated";
  notification: "delivered" | "pending" | "awaiting_configuration";
};

type ValidationSuccess = {
  ok: true;
  data: LeadSubmission & {
    normalizedEmail: string;
    normalizedPhone: string;
  };
};

type ValidationFailure = {
  ok: false;
  error: string;
  field?: string;
};

const allowedSources = new Set<string>(LEAD_SOURCES);
const allowedServices = new Set<string>(CLEANING_SERVICES);
const idPattern = /^[a-zA-Z0-9_-]{16,128}$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function textValue(value: unknown, maximum: number) {
  return typeof value === "string" ? value.trim().slice(0, maximum) : "";
}

export function normalizePhone(value: string) {
  return value.replace(/\D/g, "");
}

export function validateLeadSubmission(input: unknown): ValidationSuccess | ValidationFailure {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { ok: false, error: "The request body is invalid." };
  }

  const candidate = input as Record<string, unknown>;
  if (textValue(candidate.website, 200)) {
    return { ok: false, error: "The request could not be accepted." };
  }

  const source = textValue(candidate.source, 30);
  if (!allowedSources.has(source)) {
    return { ok: false, error: "The request source is invalid.", field: "source" };
  }

  const idempotencyKey = textValue(candidate.idempotencyKey, 128);
  const sessionId = textValue(candidate.sessionId, 128);
  if (!idPattern.test(idempotencyKey)) {
    return { ok: false, error: "The request identifier is invalid.", field: "idempotencyKey" };
  }
  if (!idPattern.test(sessionId)) {
    return { ok: false, error: "The session identifier is invalid.", field: "sessionId" };
  }

  const fullName = textValue(candidate.fullName, 120);
  if (fullName.length < 2) {
    return { ok: false, error: "Please enter your full name.", field: "fullName" };
  }

  const address = textValue(candidate.address, 240);
  if (address.length < 5) {
    return { ok: false, error: "Please enter the complete service address.", field: "address" };
  }

  const propertySize = Number(candidate.propertySize);
  if (!Number.isInteger(propertySize) || propertySize < 1 || propertySize > 100_000) {
    return { ok: false, error: "Please enter a valid property size.", field: "propertySize" };
  }

  const phone = textValue(candidate.phone, 40);
  const normalizedPhone = normalizePhone(phone);
  if (normalizedPhone.length < 10 || normalizedPhone.length > 15) {
    return { ok: false, error: "Please enter a valid phone number.", field: "phone" };
  }

  const email = textValue(candidate.email, 160).toLowerCase();
  if (!emailPattern.test(email)) {
    return { ok: false, error: "Please enter a valid email address.", field: "email" };
  }

  if (!Array.isArray(candidate.services)) {
    return { ok: false, error: "Please choose at least one cleaning service.", field: "services" };
  }
  const services = [...new Set(candidate.services.filter((service): service is CleaningService => (
    typeof service === "string" && allowedServices.has(service)
  )))];
  if (services.length === 0 || services.length !== candidate.services.length) {
    return { ok: false, error: "One or more cleaning services are invalid.", field: "services" };
  }

  if (candidate.termsAccepted !== true || candidate.policyAccepted !== true) {
    return { ok: false, error: "Both confirmations are required.", field: "consent" };
  }

  const consentVersion = textValue(candidate.consentVersion, 40);
  if (consentVersion !== SPARCLEAN_CONSENT_VERSION) {
    return { ok: false, error: "The consent version is invalid.", field: "consentVersion" };
  }

  const transcript = Array.isArray(candidate.transcript)
    ? candidate.transcript.slice(0, 30).flatMap((message): LeadTranscriptMessage[] => {
        if (!message || typeof message !== "object" || Array.isArray(message)) return [];
        const sender = (message as Record<string, unknown>).sender;
        const text = textValue((message as Record<string, unknown>).text, 500);
        if ((sender !== "ai" && sender !== "user") || !text) return [];
        return [{ sender, text }];
      })
    : [];

  return {
    ok: true,
    data: {
      source: source as LeadSource,
      idempotencyKey,
      sessionId,
      fullName,
      address,
      propertySize,
      phone,
      normalizedPhone,
      email,
      normalizedEmail: email,
      services,
      termsAccepted: true,
      policyAccepted: true,
      consentVersion,
      transcript,
    },
  };
}
