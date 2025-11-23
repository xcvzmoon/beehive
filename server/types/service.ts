import { z } from 'zod';
import { createSelectSchema } from 'drizzle-zod';
import { servicesTable } from '../database/schemas/public/services';

export const serviceSchema = createSelectSchema(servicesTable);

export type Service = z.infer<typeof serviceSchema>;
