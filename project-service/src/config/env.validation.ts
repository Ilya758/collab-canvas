import { z } from 'zod';

const envSchema = z.object({
  CORS_ALLOWED_HEADERS: z.string().optional(),
  CORS_CREDENTIALS: z
    .string()
    .optional()
    .transform((v) => v === 'true'),
  CORS_EXPOSED_HEADERS: z.string().optional(),
  CORS_METHODS: z.string().optional(),
  CORS_ORIGIN: z.string().optional(),
  DATABASE_URL: z.string().url().optional(),
  ENABLE_SWAGGER: z.string().optional(),
  NODE_ENV: z.enum(['development', 'production']).default('development'),
  PORT: z
    .string()
    .regex(/^\d+$/)
    .transform((v) => Number(v))
    .default('3000'),
});

export type Env = z.infer<typeof envSchema>;

export function validateEnv(config: Record<string, unknown>): Env {
  const parsed = envSchema.safeParse(config);

  if (!parsed.success) {
    const message = parsed.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
    throw new Error(`Invalid environment variables: ${message}`);
  }

  return parsed.data;
}
