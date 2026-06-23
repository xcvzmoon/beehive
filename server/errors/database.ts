// oxlint-disable unicorn/throw-new-error

import { TaggedError } from 'effect/Data';

export class DBError extends TaggedError('DBError')<{
  table: string;
  callback: string;
  message: string;
}> {}
