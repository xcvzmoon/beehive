import type { InsertAuditLogInput } from '~/server/types/audit-log.ts';
import { db } from '~/server/database/index.ts';
import { auditLogs } from '~/server/database/schema.ts';
import { databaseEffect } from '~/server/utils/effects.ts';
import { logger } from '~/server/utils/logger.ts';

export function insertAuditLog(input: InsertAuditLogInput) {
  return databaseEffect({
    table: 'audit-logs',
    callback: 'insertAuditLog',
    execute: async () => {
      const result = await db.insert(auditLogs).values(input).returning({ id: auditLogs.id });
      const auditLog = result.at(0);

      logger.success(`Inserted audit log -> ${auditLog?.id}`);

      return auditLog;
    },
  });
}
