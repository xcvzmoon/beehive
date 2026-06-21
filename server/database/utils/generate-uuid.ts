import { uuid } from 'drizzle-orm/pg-core';
import { v7 as uuidV7 } from 'uuid';

/**
 * Adds a primary key UUID column with a UUID v7 default value.
 *
 * @example
 * ```ts
 * export const users = pgTable('users', {
 *   ...generateUUID(),
 * });
 * ```
 */
export function generateUUID() {
  return {
    id: uuid('id')
      .$defaultFn(() => uuidV7())
      .primaryKey(),
  };
}
