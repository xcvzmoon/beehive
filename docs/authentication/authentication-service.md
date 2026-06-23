# Authentication Service

## Endpoint

Better Auth is mounted at `/api/v1/auth/*` through `server/api/v1/auth/[...all].ts`.

## Enabled Flows

- Email and password authentication
- Email verification, required before sign-in
- Email OTP verification
- Password reset

New users are not signed in automatically. Password resets revoke existing sessions.

## Sessions and Rate Limits

Sessions use a five-minute cookie cache. Authentication storage and rate-limit state use the Nitro `auth` Redis mount, configured with `REDIS_URL`.

## Required Environment Variables

- `BETTER_AUTH_SECRET`
- `BETTER_AUTH_URL`
- `REDIS_URL`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_SECURE`
- `SMTP_USER`
- `SMTP_PASSWORD`
- `SMTP_EMAIL`
- `API_KEY_PEPPER`: server-side HMAC secret for hashing Beehive API keys; use at least 32 characters.
- `API_KEY_ENVIRONMENT`: API key environment marker, either `live` or `test`.

See [`.env.example`](../../.env.example) for the complete environment template.

## Operational Notes

OTP codes expire after five minutes. Password reset links expire after one hour. OTPs are stored hashed and resend attempts rotate the existing code.

Beehive API keys use the format `bh_<live|test>_v1_<publicId>_<secret>`. Only the prefix and an HMAC-SHA256 hash of the full key are stored. Successful API-key authentication updates `lastUsedAt`; creation and revocation are written to audit logs.
