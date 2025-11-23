import { cachedFunction } from 'nitropack/runtime';
import { db } from '../database';
import { servicesTable } from '../database/schemas/public/services';
import { serviceSchema } from '../types/service';

export async function getCachedServices() {
  return cachedFunction(
    async () => {
      const rows = await db.select().from(servicesTable);
      return serviceSchema.array().parse(rows);
    },
    {
      maxAge: 60 * 60,
      name: 'services',
    },
  )();
}
