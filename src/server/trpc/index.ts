import type { Context } from '@/server/trpc/context';
import { trpcTransformer } from '@/server/trpc/transformer';
import { initTRPC } from '@trpc/server';
import type { DefaultErrorShape } from '@trpc/server/unstable-core-do-not-import';
import { ZodError, type typeToFlattenedError } from 'zod';

export const t = initTRPC.context<Context>().create({
  transformer: trpcTransformer,
  errorFormatter({ error, shape }) {
    const data: DefaultErrorShape['data'] & {
      formErrorData?: typeToFlattenedError<unknown, string>;
    } = shape.data;

    if (error.code === 'BAD_REQUEST') {
      if (error.cause instanceof ZodError) {
        data.formErrorData = error.cause.flatten();
      }
    }

    return {
      ...shape,
      data,
    };
  },
});

// const createCaller = t.createCallerFactory(rpcRouter);
// export const rpcCaller = createCaller({});
