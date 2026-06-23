import type { InsertAiChatInput } from '~/server/types/ai-chat.ts';
import type { InsertAiMessageInput } from '~/server/types/ai-message.ts';
import type { InsertAiUsageEventInput } from '~/server/types/ai-usage-event.ts';
import { db } from '~/server/database/index.ts';
import { aiChats, aiMessages, aiUsageEvents } from '~/server/database/schema.ts';
import { databaseEffect } from '~/server/utils/effects.ts';
import { logger } from '~/server/utils/logger.ts';

export function insertAiChatWithMessagesAndUsage(
  chatInput: InsertAiChatInput,
  messagesInput: Omit<InsertAiMessageInput, 'chatId'>[],
  usageEventInput: Omit<InsertAiUsageEventInput, 'chatId'>,
) {
  return databaseEffect({
    table: 'ai-chats',
    callback: 'insertAiChatWithMessagesAndUsage',
    execute: async () => {
      await db.transaction(async (tx) => {
        const inserted = await tx.insert(aiChats).values(chatInput).returning({ id: aiChats.id });
        const chatId = inserted.at(0)?.id;

        if (!chatId) {
          logger.error(`Failed to insert new AI chat`);
          throw new Error('Insert returned no id');
        }

        logger.success(`Inserted new AI chat -> ${chatId}`);

        const [{ id: aiMessagesId }] = await tx
          .insert(aiMessages)
          .values(messagesInput.map((message) => ({ ...message, chatId })))
          .returning({ id: aiMessages.id });

        logger.success(`Inserted new AI message -> ${aiMessagesId}`);

        const [{ id: aiUsageEventsId }] = await tx
          .insert(aiUsageEvents)
          .values({ ...usageEventInput, chatId })
          .returning({ id: aiUsageEvents.id });

        logger.success(`Inserted new AI usage event -> ${aiUsageEventsId}`);
      });
    },
  });
}
