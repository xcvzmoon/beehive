import { Effect } from 'effect';
import { useStorage } from 'nitro/storage';
import { EmailTemplateError } from '~/server/errors/mailer.ts';

export function loadEmailTemplate(name: string) {
  return Effect.tryPromise({
    try: async () => {
      const template = await useStorage<string>('assets:templates').getItem(name);

      if (template === null) {
        throw new EmailTemplateError({
          template: name,
          message: `Email template not found: ${name}`,
        });
      }

      return template;
    },
    catch: (error) =>
      error instanceof EmailTemplateError
        ? error
        : new EmailTemplateError({
            template: name,
            message: error instanceof Error ? error.message : `Failed to load email template`,
          }),
  });
}
