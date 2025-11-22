import pino from 'pino-http';

import { eventHandler } from 'h3';

export default eventHandler((event) => {
  const logger = pino({
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
      },
    },
  });

  logger(event.node.req, event.node.res);
});
