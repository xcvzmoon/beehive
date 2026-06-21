import { timestamp, uuid, type AnyPgColumn, type UpdateDeleteAction } from 'drizzle-orm/pg-core';

type TimestampsOptions = {
  userId?: () => AnyPgColumn;
  createdByOnDelete?: UpdateDeleteAction;
  updatedByOnDelete?: UpdateDeleteAction;
  deletedByOnDelete?: UpdateDeleteAction;
};

const TIMESTAMP_CONFIG = {
  mode: 'date',
  precision: 3,
  withTimezone: true,
} as const;

/**
 * Adds timestamp columns for rows that track creation, updates, and soft deletion.
 *
 * `updatedAt` is refreshed automatically when a row is updated.
 *
 * @example
 * ```ts
 * export const users = pgTable('users', {
 *   ...generateUUID(),
 *   ...generateTimestamps(),
 * });
 * ```
 */
export function generateTimestamps() {
  return {
    createdAt: timestamp('created_at', TIMESTAMP_CONFIG).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', TIMESTAMP_CONFIG)
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
    deletedAt: timestamp('deleted_at', TIMESTAMP_CONFIG),
  };
}

/**
 * Adds timestamp columns for rows that track the user responsible for
 * creation, updates, and soft deletion.
 *
 * Pass `userId` to attach foreign keys to the user table. Without `userId`,
 * the UUID columns are created without references.
 *
 * @example
 * ```ts
 * export const users = pgTable('users', {
 *   ...generateUUID(),
 *   ...generateWithUserTimestamps(),
 * });
 * ```
 *
 * @example
 * ```ts
 * export const sessions = pgTable('sessions', {
 *   ...generateUUID(),
 *   ...generateWithUserTimestamps({ userId: () => users.id }),
 * });
 * ```
 *
 * @example
 * ```ts
 * export const accounts = pgTable('accounts', {
 *   ...generateUUID(),
 *   ...generateWithUserTimestamps({
 *     userId: () => users.id,
 *     createdByOnDelete: 'cascade',
 *     updatedByOnDelete: 'set null',
 *     deletedByOnDelete: 'set null',
 *   }),
 * });
 * ```
 *
 * @defaultValue
 * `createdBy` uses `onDelete: 'restrict'`. `updatedBy` and `deletedBy` use `onDelete: 'set null'`.
 */
export function generateWithUserTimestamps(options: TimestampsOptions = {}) {
  const createdByOnDelete = options.createdByOnDelete ?? 'restrict';
  const updatedByOnDelete = options.updatedByOnDelete ?? 'set null';
  const deletedByOnDelete = options.deletedByOnDelete ?? 'set null';

  return {
    createdBy: options.userId
      ? uuid('created_by').notNull().references(options.userId, { onDelete: createdByOnDelete })
      : uuid('created_by').notNull(),
    createdAt: timestamp('created_at', TIMESTAMP_CONFIG).notNull().defaultNow(),
    updatedBy: options.userId
      ? uuid('updated_by').references(options.userId, { onDelete: updatedByOnDelete })
      : uuid('updated_by'),
    updatedAt: timestamp('updated_at', TIMESTAMP_CONFIG)
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
    deletedBy: options.userId
      ? uuid('deleted_by').references(options.userId, { onDelete: deletedByOnDelete })
      : uuid('deleted_by'),
    deletedAt: timestamp('deleted_at', TIMESTAMP_CONFIG),
  };
}
