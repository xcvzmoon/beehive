# Mailer Service

## Configuration

The mailer uses SMTP. Configure these environment variables:

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_SECURE`
- `SMTP_USER`
- `SMTP_PASSWORD`
- `SMTP_EMAIL`

`SMTP_EMAIL` is the default sender address. Configuration is validated at application startup; invalid or missing values prevent the service from starting.

## Delivery Pipeline

`server/mailer/index.ts` creates the mail service with the SMTP driver and applies these middleware layers:

- Content-hash deduplication for 60 seconds
- Retry with full-jitter backoff, up to three retries
- Circuit breaker after five failures, with a 30-second cooldown
- Rendered-email logging with recipient local parts redacted

## Rendering

The mailer renders Handlebars templates through `unemail`. Template files live in `server/templates/` and are registered as Nitro server assets under `assets:templates`.

Use `sendEmail()` for application delivery. It applies `SMTP_EMAIL` as the sender unless a message provides its own `from` address.

## Authentication Emails

Authentication uses the mailer for OTP verification and password-reset messages. See [Authentication email templates](../authentication/email-templates.md) for available templates and their rendering variables.
