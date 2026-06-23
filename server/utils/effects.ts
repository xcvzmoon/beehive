import type { H3Event } from 'nitro';
import { Effect, Schema } from 'effect';
import { HTTPError } from 'nitro';
import { readBody, readValidatedBody } from 'nitro/h3';
import { DBError } from '~/server/errors/database.ts';
import { logger } from '~/server/utils/logger.ts';

export type HttpErrorOptions = {
  status: number;
  statusText: string;
  message: string;
  data?: unknown;
};

export function failHttp(options: HttpErrorOptions) {
  return Effect.fail(new HTTPError(options));
}

export function readJsonBody(event: H3Event) {
  return Effect.tryPromise({
    try: async () => readBody(event),
    catch: (error) =>
      error instanceof HTTPError
        ? error
        : new HTTPError({
            status: 400,
            statusText: 'Bad Request',
            message: 'The request body must be valid JSON',
            data: error,
          }),
  });
}

export function parseJsonBodyWithSchema<A, I>(event: H3Event, schema: Schema.Schema<A, I>) {
  const standardSchema = Schema.standardSchemaV1(schema);

  return Effect.tryPromise({
    try: async () => readValidatedBody(event, standardSchema),
    catch: (error) =>
      error instanceof HTTPError
        ? error
        : new HTTPError({
            status: 400,
            statusText: 'Bad Request',
            message: 'The request body is invalid',
            data: error,
          }),
  });
}

export function databaseEffect<T>(options: {
  table: string;
  callback: string;
  execute: () => Promise<T>;
}) {
  return Effect.tryPromise({
    try: options.execute,
    catch: (error) => {
      const message = error instanceof Error ? error.message : `Database operation failed`;

      logger.error(message);

      return new DBError({
        table: options.table,
        callback: options.callback,
        message,
      });
    },
  });
}
