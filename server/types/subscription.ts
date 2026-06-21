import type { z } from 'zod';
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-orm/zod';
import { subscriptions } from '~/server/database/schema.ts';

export const selectSubscriptionSchema = createSelectSchema(subscriptions);
export const insertSubscriptionSchema = createInsertSchema(subscriptions);
export const updateSubscriptionSchema = createUpdateSchema(subscriptions);

export type Subscription = z.infer<typeof selectSubscriptionSchema>;
export type InsertSubscriptionInput = z.infer<typeof insertSubscriptionSchema>;
export type UpdateSubscriptionInput = z.infer<typeof updateSubscriptionSchema>;
