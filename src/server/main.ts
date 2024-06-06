import { config } from '@/server/config';
import { createContext } from '@/server/trpc/context';
import { appRouter, type AppRouter } from '@/server/trpc/routers';
import fastifyCookie from '@fastify/cookie';
import fastifyCors from '@fastify/cors';
import fastifyExpress from '@fastify/express';
import { TRPCError } from '@trpc/server';
import {
  fastifyTRPCPlugin,
  type FastifyTRPCPluginOptions,
} from '@trpc/server/adapters/fastify';
import Fastify from 'fastify';
import { ZodError } from 'zod';

async function main() {
  const app = Fastify({
    logger:
      process.env.LOGGER === 'true' || process.env.NODE_ENV !== 'production',
    disableRequestLogging: true,
    maxParamLength: 2048,
  });

  app
    .register(fastifyCors, {
      origin: [config.app.url],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
      exposedHeaders: [],
      methods: ['GET', 'POST'],
      // Let browsers cache CORS information to reduce the number of
      // preflight requests. Modern Chrome caps the value at 2h.
      maxAge: 2 * 60 * 60,
    })
    .register(fastifyExpress)
    .register(fastifyCookie, {
      secret: config.cookieSecret,
      // parseOptions: {},
    });

  await app.register(fastifyTRPCPlugin, {
    prefix: '/trpc',
    trpcOptions: {
      router: appRouter,
      createContext: createContext,
      onError({ path, error }) {
        if (
          error instanceof TRPCError &&
          (error.code === 'UNAUTHORIZED' || error.cause instanceof ZodError)
        ) {
          return;
        }
        console.error(`Error in tRPC handler on path '${path}':`, error);
      },
    },
  } satisfies FastifyTRPCPluginOptions<AppRouter>);

  // registerRestRoutes(app);
  app.get('/api/test', async (_request, reply) => {
    return reply.send({ hello: 'world' });
  });

  app.setNotFoundHandler(async (_request, reply) => {
    return reply.status(404).send();
  });

  app.setErrorHandler((error, request, reply) => {
    if (error instanceof ZodError) {
      return reply.status(400).send({
        error: 'Bad Request',
        issues: error.issues,
      });
    }
    return reply.status(500).send({
      error: 'Internal Server Error',
    });
  });

  try {
    await app.listen({ port: config.server.port });
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
}

main();
