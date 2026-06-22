import type { InsertAiChatInput } from '~/server/types/ai-chat.ts';
import type { InsertAiMessageInput } from '~/server/types/ai-message.ts';
import type { InsertAiUsageEventInput } from '~/server/types/ai-usage-event.ts';
import { db } from '~/server/database/index.ts';
import { aiChats, aiMessages, aiUsageEvents } from '~/server/database/schema.ts';

export async function createAiChatWithMessagesAndUsage(
  chat: InsertAiChatInput,
  messages: Omit<InsertAiMessageInput, 'chatId'>[],
  usageEvent: Omit<InsertAiUsageEventInput, 'chatId'>,
) {
  await db.transaction(async (tx) => {
    const [createdChat] = await tx.insert(aiChats).values(chat).returning({ id: aiChats.id });
    await tx
      .insert(aiMessages)
      .values(messages.map((message) => ({ ...message, chatId: createdChat.id })));
    await tx.insert(aiUsageEvents).values({ ...usageEvent, chatId: createdChat.id });
  });
}
