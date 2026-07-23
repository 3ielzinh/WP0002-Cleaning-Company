import assert from "node:assert/strict";
import test from "node:test";
import { twimlGather, twimlSay, validateTwilioRequest } from "../lib/server/twilio.ts";

async function twilioSignature(url: string, parameters: URLSearchParams, token: string) {
  let value = url;
  for (const key of [...new Set(parameters.keys())].sort()) {
    for (const item of parameters.getAll(key).sort()) value += `${key}${item}`;
  }
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(token),
    { name: "HMAC", hash: "SHA-1" },
    false,
    ["sign"],
  );
  const digest = await crypto.subtle.sign("HMAC", cryptoKey, new TextEncoder().encode(value));
  return Buffer.from(digest).toString("base64");
}

test("generates escaped TwiML for speech and keypad gathering", () => {
  const xml = twimlGather("Name & address <required>", "https://example.com/api/twilio/voice");
  assert.match(xml, /^<\?xml version="1\.0"/);
  assert.match(xml, /input="speech dtmf"/);
  assert.match(xml, /speechTimeout="auto"/);
  assert.match(xml, /Name &amp; address &lt;required&gt;/);
  assert.match(xml, /<Redirect method="POST">/);
});

test("generates a final TwiML response with hangup", () => {
  const xml = twimlSay("Thank you, Jane.", true);
  assert.match(xml, /Polly\.Joanna/);
  assert.match(xml, /<Hangup\/>/);
});

test("validates an authentic Twilio signature and rejects a modified one", async () => {
  const url = "https://sparclean.example/api/twilio/voice";
  const token = "test_auth_token";
  const parameters = new URLSearchParams({
    CallSid: "CA12345678901234567890123456789012",
    From: "+19165550182",
    SpeechResult: "Deep cleaning",
  });
  const signature = await twilioSignature(url, parameters, token);
  const environment = {
    TWILIO_AUTH_TOKEN: token,
    TWILIO_PUBLIC_BASE_URL: "https://sparclean.example",
  };

  const authentic = new Request(url, { headers: { "x-twilio-signature": signature } });
  assert.equal(await validateTwilioRequest(authentic, parameters, environment), true);

  const modified = new URLSearchParams(parameters);
  modified.set("SpeechResult", "Move out cleaning");
  assert.equal(await validateTwilioRequest(authentic, modified, environment), false);
});
