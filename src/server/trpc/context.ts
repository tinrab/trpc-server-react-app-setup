import type { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify';
import type { FastifyReply, FastifyRequest } from 'fastify';

export async function createContext({ req, res }: CreateFastifyContextOptions) {
  // const accessToken = await validateAccessToken(
  //   req.headers.authorization || '',
  // );
  // if (!accessToken) {
  //   throw new TRPCError({ code: 'UNAUTHORIZED' });
  // }

  return {
    req,
    res,
    // accessToken,
  };
}

export type Context = Awaited<{
  req: FastifyRequest;
  res: FastifyReply;
  // accessToken?: AccessTokenData;
}>;
