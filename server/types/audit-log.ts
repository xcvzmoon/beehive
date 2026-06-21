import type { z } from 'zod';
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-orm/zod';
import { auditLogs } from '~/server/database/schema.ts';

export const selectAuditLogSchema = createSelectSchema(auditLogs);
export const insertAuditLogSchema = createInsertSchema(auditLogs);
export const updateAuditLogSchema = createUpdateSchema(auditLogs);

export type AuditLog = z.infer<typeof selectAuditLogSchema>;
export type InsertAuditLogInput = z.infer<typeof insertAuditLogSchema>;
export type UpdateAuditLogInput = z.infer<typeof updateAuditLogSchema>;
