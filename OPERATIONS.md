# SparClean lead operations

## Administrative ledger

The protected lead ledger is available at `/admin`. Authentication is handled by
ChatGPT sign-in and authorization is enforced server-side with the comma-separated
`ADMIN_EMAILS` runtime variable.

Lead stages are:

- `new`
- `contacted`
- `qualified`
- `scheduled`
- `won`
- `lost`

## n8n delivery

When a lead is created or updated, the request is committed to D1 before any
external call is attempted. A durable `notification_outbox` item is then delivered
to `N8N_LEAD_WEBHOOK_URL`.

The webhook receives:

- `event`: `lead.ready_for_follow_up`
- `eventId`: stable delivery identifier
- `lead`: contact, service, source, status, and reference data
- `x-sparclean-event-id`: the same stable identifier
- `x-sparclean-signature`: HMAC-SHA256 of the exact JSON body using
  `N8N_WEBHOOK_SECRET`

n8n should deduplicate on `eventId`. Failed deliveries remain in the outbox and
can be retried from the administrative ledger. A scheduled n8n workflow can also
POST to `/api/integrations/n8n/retry` with `Authorization: Bearer
<AUTOMATION_SECRET>`.

## Twilio incoming calls

Configure the Twilio phone number's incoming Voice webhook as:

`POST https://<public-site-origin>/api/twilio/voice`

Set `TWILIO_PUBLIC_BASE_URL` to that exact public origin and
`TWILIO_AUTH_TOKEN` to the Twilio Auth Token. Every request is checked against
`X-Twilio-Signature` before call data is read or stored.

The voice flow collects the same estimate fields as the website:

1. Cleaning service
2. Service address
3. Property size
4. Full name
5. Caller phone number, using the incoming number when available
6. Email
7. Terms and company-policy consent

Completed calls use the same deduplication, consent, lead status, outbox, and
notification paths as the form and chat.

## Launch integrations

Turnstile is activated only when both `TURNSTILE_SITE_KEY` and
`TURNSTILE_SECRET_KEY` exist. Google Analytics is activated only when
`GOOGLE_ANALYTICS_ID` is a valid `G-...` identifier. Search Console verification
is emitted at build time through `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`.
