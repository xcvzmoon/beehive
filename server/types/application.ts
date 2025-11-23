import { z } from 'zod';
import { createSelectSchema } from 'drizzle-zod';
import { applicationsTable } from '../database/schemas/public/applications';

export const applicationSchema = createSelectSchema(applicationsTable);

export type Application = z.infer<typeof applicationSchema>;
