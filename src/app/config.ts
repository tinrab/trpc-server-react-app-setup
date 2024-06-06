import * as z from 'zod';

const configSchema = z.object({
  app: z.object({
    url: z.string(),
  }),
});

export const config = configSchema.parse({
  app: {
    url: import.meta.env.VITE_APP_URL,
  },
});
