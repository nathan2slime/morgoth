import { parseEnv } from 'znv';
import { z } from 'zod';
import { config } from 'dotenv';

config();

export const env = parseEnv(process.env, {
  DATABASE_URL: z.string().url(),
  PORT: z.string().min(1),
});
