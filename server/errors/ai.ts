// oxlint-disable unicorn/throw-new-error max-classes-per-file

import { TaggedError } from 'effect/Data';

export class AiConfigurationError extends TaggedError('AiConfigurationError')<{
  message: string;
}> {}

export class AiProviderError extends TaggedError('AiProviderError')<{
  provider: string;
  operation: string;
  message: string;
  status?: number;
  data?: unknown;
}> {}
