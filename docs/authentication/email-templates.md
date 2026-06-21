# Authentication Email Templates

Authentication email templates are Handlebars files in `server/templates/`.

## Templates

- `otp.hbs` — email verification, sign-in, password-reset, and email-change OTP messages
- `reset-password.hbs` — password reset link messages

## Nitro Asset Configuration

`nitro.config.ts` copies `server/templates/**/*.hbs` into the `assets:templates` storage mount. Email code loads templates by file name, for example:

```ts
await useStorage<string>('assets:templates').getItem('otp.hbs');
```

Keep template file names and the names passed to `loadEmailTemplate()` aligned. Restart the development server after changing `nitro.config.ts` or adding templates.

## Rendering Variables

`otp.hbs` receives `otp`, `recipientEmail`, `expirationLabel`, and `purpose`.

`reset-password.hbs` receives `url`, `recipientName`, and `expirationLabel`.
