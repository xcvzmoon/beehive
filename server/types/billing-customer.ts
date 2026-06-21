import type { z } from 'zod';
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-orm/zod';
import { billingCustomers } from '~/server/database/schema.ts';

export const selectBillingCustomerSchema = createSelectSchema(billingCustomers);
export const insertBillingCustomerSchema = createInsertSchema(billingCustomers);
export const updateBillingCustomerSchema = createUpdateSchema(billingCustomers);

export type BillingCustomer = z.infer<typeof selectBillingCustomerSchema>;
export type InsertBillingCustomerInput = z.infer<typeof insertBillingCustomerSchema>;
export type UpdateBillingCustomerInput = z.infer<typeof updateBillingCustomerSchema>;
