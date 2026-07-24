import {
  CLEANING_SERVICES,
  SPARCLEAN_CONSENT_VERSION,
  normalizePhone,
  validateLeadSubmission,
  type CleaningService,
  type LeadTranscriptMessage,
} from "@/lib/lead-contract";
import { getRuntimeEnvironment, runtimeString } from "@/lib/server/cloudflare";
import { persistLead } from "@/lib/server/lead-service";
import { deliverNotification } from "@/lib/server/notifications";
import {
  twimlGather,
  twimlResponse,
  twimlSay,
  validateTwilioRequest,
} from "@/lib/server/twilio";

export const dynamic = "force-dynamic";

type VoiceStep = "service" | "address" | "propertySize" | "fullName" | "phone" | "email" | "consent" | "complete";
type VoiceData = {
  services?: CleaningService[];
  address?: string;
  propertySize?: number;
  fullName?: string;
  phone?: string;
  email?: string;
};
type VoiceSession = {
  callSid: string;
  fromNumber: string;
  step: VoiceStep;
  data: string;
  transcript: string;
};

const prompts: Record<Exclude<VoiceStep, "complete">, string> = {
  service: "Thank you for calling SparClean. I can prepare your free estimate now. Say or press 1 for office cleaning, 2 for recurring cleaning, 3 for deep cleaning, 4 for move in, 5 for move out, 6 for post construction, or 7 for Airbnb turnover.",
  address: "What is the full street address, including city and ZIP code, where you need cleaning?",
  propertySize: "Approximately how many square feet is the property? You may say the number or enter the digits followed by the pound key.",
  fullName: "What is your full name?",
  phone: "What is the best phone number for our team to reach you? Enter the digits followed by the pound key.",
  email: "What email address should we use for your estimate? Please say it slowly, for example, name at example dot com.",
  consent: "To complete your request, please review the Terms of Service and Company Policies on our website. Say yes or press 1 if you agree to both and authorize SparClean to follow up about this estimate.",
};

function actionUrl(request: Request, configuredBase: string | null) {
  return configuredBase
    ? `${configuredBase.replace(/\/+$/, "")}/api/twilio/voice`
    : `${new URL(request.url).origin}/api/twilio/voice`;
}

function transcriptFrom(value: string): LeadTranscriptMessage[] {
  try {
    const parsed = JSON.parse(value) as LeadTranscriptMessage[];
    return Array.isArray(parsed) ? parsed.slice(0, 28) : [];
  } catch {
    return [];
  }
}

function dataFrom(value: string): VoiceData {
  try {
    const parsed = JSON.parse(value) as VoiceData;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function parseService(input: string): CleaningService | null {
  const normalized = input.toLowerCase().replace(/[^a-z0-9 ]/g, " ");
  const digit = normalized.match(/\b[1-7]\b/)?.[0];
  if (digit) return CLEANING_SERVICES[Number(digit) - 1] ?? null;
  if (normalized.includes("office") || normalized.includes("commercial")) return "Office Cleaning";
  if (normalized.includes("recurring") || normalized.includes("weekly") || normalized.includes("regular")) return "Recurring Cleaning";
  if (normalized.includes("deep")) return "Deep Cleaning";
  if (normalized.includes("move in") || normalized.includes("moving in")) return "Move-In Cleaning";
  if (normalized.includes("move out") || normalized.includes("moving out")) return "Move-Out Cleaning";
  if (normalized.includes("construction")) return "Post-Construction Cleaning";
  if (normalized.includes("airbnb") || normalized.includes("turnover")) return "Airbnb Turnover";
  return null;
}

function parsePropertySize(input: string) {
  const digits = input.replace(/\D/g, "");
  if (!digits) return null;
  const value = Number(digits);
  return Number.isInteger(value) && value >= 1 && value <= 100_000 ? value : null;
}

function parseVoiceEmail(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/\s+(at|at sign)\s+/g, "@")
    .replace(/\s+dot\s+/g, ".")
    .replace(/\s+/g, "")
    .replace(/,$/, "");
}

function acceptedConsent(input: string) {
  return input.trim() === "1" || /\b(yes|agree|accept|authorized|authorize)\b/i.test(input);
}

async function saveSession(
  db: D1Database,
  callSid: string,
  fromNumber: string,
  step: VoiceStep,
  data: VoiceData,
  transcript: LeadTranscriptMessage[],
) {
  const now = Date.now();
  await db.prepare(
    `INSERT INTO voice_sessions (call_sid, from_number, step, data, transcript, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(call_sid) DO UPDATE SET
       from_number = excluded.from_number, step = excluded.step, data = excluded.data,
       transcript = excluded.transcript, updated_at = excluded.updated_at`,
  ).bind(callSid, fromNumber, step, JSON.stringify(data), JSON.stringify(transcript), now, now).run();
}

function gather(
  request: Request,
  base: string | null,
  prompt: string,
) {
  return twimlResponse(twimlGather(prompt, actionUrl(request, base)));
}

export async function POST(request: Request) {
  const environment = await getRuntimeEnvironment();
  if (!runtimeString(environment, "TWILIO_AUTH_TOKEN")) {
    return twimlResponse(twimlSay("The phone concierge is not configured yet. Please call again later.", true), 503);
  }
  const raw = await request.text();
  const parameters = new URLSearchParams(raw);
  if (!(await validateTwilioRequest(request, parameters, environment))) {
    return new Response("Unauthorized", { status: 401 });
  }
  const db = environment.DB;
  if (!db) return twimlResponse(twimlSay("Our estimate system is temporarily unavailable. Please try again later.", true), 503);

  const callSid = parameters.get("CallSid")?.trim() ?? "";
  const fromNumber = parameters.get("From")?.trim() ?? "";
  if (!/^CA[a-zA-Z0-9]{20,64}$/.test(callSid)) return new Response("Invalid call", { status: 422 });
  const input = (parameters.get("Digits") || parameters.get("SpeechResult") || "").trim();
  const configuredBase = runtimeString(environment, "TWILIO_PUBLIC_BASE_URL");
  const existing = await db.prepare(
    "SELECT call_sid AS callSid, from_number AS fromNumber, step, data, transcript FROM voice_sessions WHERE call_sid = ? LIMIT 1",
  ).bind(callSid).first<VoiceSession>();

  if (!existing) {
    const transcript: LeadTranscriptMessage[] = [{ sender: "ai", text: prompts.service }];
    await saveSession(db, callSid, fromNumber, "service", {}, transcript);
    return gather(request, configuredBase, prompts.service);
  }
  if (existing.step === "complete") {
    return twimlResponse(twimlSay("Your estimate request is already safely with SparClean. Thank you for calling.", true));
  }

  const data = dataFrom(existing.data);
  const transcript = transcriptFrom(existing.transcript);
  if (input) transcript.push({ sender: "user", text: input });
  let nextStep: VoiceStep = existing.step;
  let repeatPrompt = prompts[existing.step];

  if (existing.step === "service") {
    const service = parseService(input);
    if (service) {
      data.services = [service];
      nextStep = "address";
    } else {
      repeatPrompt = `I did not recognize that service. ${prompts.service}`;
    }
  } else if (existing.step === "address") {
    if (input.length >= 5) {
      data.address = input.slice(0, 240);
      nextStep = "propertySize";
    } else repeatPrompt = `I need the complete service address. ${prompts.address}`;
  } else if (existing.step === "propertySize") {
    const propertySize = parsePropertySize(input);
    if (propertySize) {
      data.propertySize = propertySize;
      nextStep = "fullName";
    } else repeatPrompt = `I did not catch the property size. ${prompts.propertySize}`;
  } else if (existing.step === "fullName") {
    if (input.length >= 2) {
      data.fullName = input.slice(0, 120);
      const callerPhone = normalizePhone(fromNumber);
      if (callerPhone.length >= 10 && callerPhone.length <= 15) {
        data.phone = fromNumber;
        nextStep = "email";
      } else nextStep = "phone";
    } else repeatPrompt = `I did not catch your name. ${prompts.fullName}`;
  } else if (existing.step === "phone") {
    const phone = normalizePhone(input);
    if (phone.length >= 10 && phone.length <= 15) {
      data.phone = phone;
      nextStep = "email";
    } else repeatPrompt = `That phone number was incomplete. ${prompts.phone}`;
  } else if (existing.step === "email") {
    const email = parseVoiceEmail(input);
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      data.email = email;
      nextStep = "consent";
    } else repeatPrompt = `I could not confirm that email address. ${prompts.email}`;
  } else if (existing.step === "consent") {
    if (!acceptedConsent(input)) {
      repeatPrompt = `Your agreement is required before we save the request. ${prompts.consent}`;
    } else {
      const validation = validateLeadSubmission({
        source: "phone_call",
        idempotencyKey: `twilio_${callSid}`,
        sessionId: callSid,
        fullName: data.fullName,
        address: data.address,
        propertySize: data.propertySize,
        phone: data.phone,
        email: data.email,
        services: data.services,
        termsAccepted: true,
        policyAccepted: true,
        consentVersion: SPARCLEAN_CONSENT_VERSION,
        transcript,
      });
      if (!validation.ok) {
        console.error("Voice lead validation failed", { callSid, field: validation.field });
        return twimlResponse(twimlSay("I could not complete the request. Please use the estimate form on our website.", true));
      }
      const persisted = await persistLead(db, validation.data);
      if (persisted.outboxId) await deliverNotification(db, persisted.outboxId, environment);
      transcript.push({ sender: "ai", text: `Estimate request received. Reference ${persisted.response.reference}.` });
      await saveSession(db, callSid, fromNumber, "complete", data, transcript);
      return twimlResponse(twimlSay(`Perfect. Your estimate request is safely with SparClean. Your reference is ${persisted.response.reference}. Our team will follow up soon. Thank you for calling.`, true));
    }
  }

  const prompt = nextStep === existing.step ? repeatPrompt : prompts[nextStep as Exclude<VoiceStep, "complete">];
  transcript.push({ sender: "ai", text: prompt });
  await saveSession(db, callSid, fromNumber, nextStep, data, transcript);
  return gather(request, configuredBase, prompt);
}
