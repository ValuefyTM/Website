# VALUEFY — website

Next.js implementation of the `Valuefy Website v4` design (hero variant "Luminos", Verdana font, navy + gold theme).

## Development

```bash
npm install
cp .env.example .env.local   # fill in the keys
npm run dev                  # http://localhost:3000
```

## Configuration (`.env.local` or the hosting provider's environment variables)

| Variable | Purpose |
|---|---|
| `ANTHROPIC_API_KEY` | AI assistant (free-text answers) and the internal request summary |
| `ASSISTANT_MODEL` | Model used, default `claude-haiku-4-5` |
| `RESEND_API_KEY`, `LEAD_EMAIL_FROM`, `LEAD_EMAIL_TO` | Sending requests by email (Resend). The sender domain must be verified in Resend |
| `NEXT_PUBLIC_PHONE`, `NEXT_PUBLIC_EMAIL` | Contact details shown on the site |
| `NEXT_PUBLIC_ANEVAR_NO` | ANEVAR authorization number; hidden while empty |
| `NEXT_PUBLIC_PORTAL_URL` | Client portal link (default `/client`, a placeholder page) |

Without `ANTHROPIC_API_KEY` the assistant still works through the guided steps; free text gets a fallback reply.
Without email configured, requests are only logged in development; in production the submission returns an error so no request is silently lost.

## How a request flows

1. The visitor picks a type, purpose or service → the assistant opens pre-filled (`src/components/Assistant.tsx`).
2. Free-text messages go to `POST /api/assistant`, where Claude extracts fields (`set_lead_fields`) and replies briefly.
3. After "Trimite solicitarea", `POST /api/leads` builds the CRM record (`lead_id`, `source: WEBSITE_AI`, `lead_status: NEW`, internal priority NORMAL/PRIORITY/URGENT, AI summary) and emails it with the JSON and the attached documents (max 4 MB total).

## Deploy

Vercel: import the repo and add the environment variables.

The original Claude Design files (prototype HTML + chat transcript) are in `design/` for reference.
