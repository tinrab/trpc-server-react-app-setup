import { t } from '@/server/trpc';
import { procedure } from '@/server/trpc/procedure';
import { chatRouter } from '@/server/trpc/routers/chat';

export const appRouter = t.router({
  getVersion: procedure.query(async () => {
    return '0.0.0';
  }),
  chat: chatRouter,
});

export type AppRouter = typeof appRouter;
