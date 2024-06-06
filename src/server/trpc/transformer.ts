import { uneval } from 'devalue';
import superjson from 'superjson';

export const trpcTransformer = {
  input: superjson,
  output: {
    serialize: (object: unknown) => uneval(object),
    // biome-ignore lint/security/noGlobalEval: only happens on the client
    deserialize: (object: unknown) => eval(`(${object})`),
  },
};
