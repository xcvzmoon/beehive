import { Effect } from 'effect';
import { defineHandler } from 'nitro';

export default defineHandler(async () => {
  return Effect.runPromise(Effect.succeed({ message: 'Hello from Beehive API!' }));
});
