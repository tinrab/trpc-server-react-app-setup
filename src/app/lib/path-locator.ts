import { config } from '@/app/config';

export const pathLocator = {
  api: {
    trpcServer: `${config.app.url}/api/trpc`,
    // token: `${config.app.url}/api/token`,
  },
};
