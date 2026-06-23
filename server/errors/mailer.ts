// oxlint-disable unicorn/throw-new-error max-classes-per-file

import { TaggedError } from 'effect/Data';

export class MailerError extends TaggedError('MailerError')<{
  operation: string;
  message: string;
}> {}

export class EmailTemplateError extends TaggedError('EmailTemplateError')<{
  template: string;
  message: string;
}> {}
