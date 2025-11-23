import { sql } from 'drizzle-orm';
import { boolean, integer, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';

export const servicesTable = pgTable('Services', {
  id: integer('_id')
    .default(sql`nextval('"Services__id_seq"'::regclass)`)
    .primaryKey()
    .notNull(),
  url: varchar(),
  target: varchar(),
  rateLimitWindow: integer().default(15),
  rateLimitMax: integer().default(100),
  active: boolean().default(true),
  createdById: integer(),
  modifiedById: integer(),
  createdAt: timestamp({
    withTimezone: true,
    mode: 'string',
  }).notNull(),
  updatedAt: timestamp({
    withTimezone: true,
    mode: 'string',
  }).notNull(),
  name: varchar(),
  hasWs: boolean(),
  encryptionCode: varchar(),
});
