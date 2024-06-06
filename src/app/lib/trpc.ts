import { ValidationError } from '@/app/lib/error';
import { pathLocator } from '@/app/lib/path-locator';
import type { AppRouter } from '@/server/trpc/routers';
import { trpcTransformer } from '@/server/trpc/transformer';
import { QueryClient } from '@tanstack/react-query';
import {
  TRPCClientError,
  createTRPCQueryUtils,
  createTRPCReact,
  httpBatchLink,
} from '@trpc/react-query';
import { ZodError } from 'zod';

export const trpc = createTRPCReact<AppRouter>();

export const trpcQueryClient = new QueryClient();

export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: pathLocator.api.trpcServer,
      transformer: trpcTransformer,
      fetch(url, options) {
        const headers = new Headers(options?.headers);
        // const accessToken = getAccessToken();
        // if (accessToken) {
        //   headers.set('authorization', `Bearer ${accessToken.raw}`);
        // }
        return fetch(url, {
          ...options,
          credentials: 'include',
          headers,
        });
      },
    }),
  ],
});

export const trpcUtils = createTRPCQueryUtils<AppRouter>({
  queryClient: trpcQueryClient,
  client: trpcClient,
});

export function mapTRPCError(error: Error): Error {
  if (error instanceof TRPCClientError && error.data) {
    if (error.data.code === 'BAD_REQUEST') {
      if ('issues' in error.data && error.data.issues.length > 0) {
        return new ValidationError(new ZodError(error.data.issues));
      }
    }
  }
  return error;
}
