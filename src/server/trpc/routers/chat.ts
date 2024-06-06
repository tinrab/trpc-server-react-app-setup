import type { ChatMessage } from '@/lib/types';
import { t } from '@/server/trpc';
import { authenticatedProcedure } from '@/server/trpc/procedure';
import { z } from 'zod';

const memoryMessages: ChatMessage[] = [];

export const chatRouter = t.router({
  listMessages: authenticatedProcedure
    .input(z.object({ roomId: z.string() }))
    .query<ChatMessage[]>(async ({ input: _input }) => {
      return memoryMessages;
    }),
  postMessage: authenticatedProcedure
    .input(z.object({ roomId: z.string(), message: z.string() }))
    .mutation<ChatMessage>(async ({ input }) => {
      const message = { roomId: input.roomId, message: input.message };
      memoryMessages.push(message);
      return message;
    }),
});
