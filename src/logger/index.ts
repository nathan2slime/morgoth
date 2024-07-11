import { createLogger, format, transports } from 'winston';
import { join } from 'node:path';

export const logger = createLogger({
  format: format.json(),
  transports: [
    new transports.Console(),
    new transports.File({
      level: 'error',
      filename: join(__dirname, 'logs', 'error.log'),
    }),
    new transports.File({ filename: join(__dirname, 'logs', 'debug.log') }),
  ],
});
