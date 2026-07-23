import {
  SPARCLEAN_CONSENT_VERSION,
  type CleaningService,
  type LeadSource,
  type LeadSubmissionResponse,
  type LeadTranscriptMessage,
} from "./lead-contract";

type SubmitLeadInput = {
  source: LeadSource;
  idempotencyKey: string;
  fullName: string;
  address: string;
  propertySize: number;
  phone: string;
  email: string;
  services: string[];
  termsAccepted: boolean;
  policyAccepted: boolean;
  transcript?: LeadTranscriptMessage[];
  turnstileToken?: string;
};

const sessionStorageKey = "sparclean_lead_session";

export function createLeadRequestId() {
  return crypto.randomUUID();
}

function getLeadSessionId() {
  const sessionId = createLeadRequestId();
  try {
    const existing = window.sessionStorage.getItem(sessionStorageKey);
    if (existing) return existing;
    window.sessionStorage.setItem(sessionStorageKey, sessionId);
  } catch {
    // Some privacy modes disable sessionStorage. The request still remains safe
    // because a short-lived in-memory identifier is sufficient for this submit.
  }
  return sessionId;
}

export async function submitLead(input: SubmitLeadInput): Promise<LeadSubmissionResponse> {
  const response = await fetch("/api/leads", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-requested-with": "SparCleanWebsite",
    },
    body: JSON.stringify({
      ...input,
      services: input.services as CleaningService[],
      sessionId: getLeadSessionId(),
      consentVersion: SPARCLEAN_CONSENT_VERSION,
      transcript: input.transcript ?? [],
      website: "",
    }),
  });

  const result = await response.json().catch(() => null) as (
    LeadSubmissionResponse | { ok?: false; error?: string }
  ) | null;

  if (!response.ok || !result?.ok) {
    throw new Error(result && "error" in result && result.error
      ? result.error
      : "We could not send your request right now. Please try again.");
  }

  return result;
}
