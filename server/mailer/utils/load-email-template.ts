import { useStorage } from 'nitro/storage';

export async function loadEmailTemplate(name: string) {
  const template = await useStorage<string>('assets:templates').getItem(name);

  if (template === null) {
    throw new Error(`Email template not found: ${name}`);
  }

  return template;
}
