import { t } from '@/server/trpc';

export const procedure = t.procedure;

export const authenticatedProcedure = t.procedure.use(async ({ next, ctx }) => {
  // if (!ctx.accessToken) {
  //   throw new TRPCError({ code: 'UNAUTHORIZED' });
  // }
  return next({
    ctx: {
      // accessToken: ctx.accessToken,
    },
  });
});
