import * as z from 'zod';

const configSchema = z.object({
  server: z.object({
    port: z.number().int().positive(),
  }),

  app: z.object({
    url: z.string(),
  }),

  cronSecret: z.string(),
  cookieSecret: z.string(),
});

export const config = configSchema.parse({
  server: {
    port: Number(process.env.SERVER_PORT),
  },

  app: {
    url: process.env.VITE_APP_URL,
  },

  cronSecret: process.env.CRON_SECRET,
  cookieSecret: process.env.COOKIE_SECRET,
});
