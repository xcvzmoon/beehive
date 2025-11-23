import { sql } from 'drizzle-orm';
import { boolean, integer, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';

export const applicationsTable = pgTable('Applications', {
  id: integer('_id')
    .default(sql`nextval('"Applications__id_seq"'::regclass)`)
    .primaryKey()
    .notNull(),
  name: varchar(),
  description: varchar(),
  icon: varchar(),
  clientSecretKey: varchar(),
  applicationURL: varchar(),
  successRedirectURL: varchar(),
  failureRedirectURL: varchar(),
  active: boolean().default(true),
  createdById: integer(),
  modifiedById: integer(),
  createdAt: timestamp({
    withTimezone: true,
    mode: 'string',
  }),
  updatedAt: timestamp({
    withTimezone: true,
    mode: 'string',
  }),
  shortName: varchar(),
  environment: varchar(),
  clientUsername: varchar(),
});
