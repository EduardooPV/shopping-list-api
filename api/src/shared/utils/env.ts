import { z } from 'zod';

const duration = z.string().regex(/^\d+(ms|s|m|h|d)$/i, 'Use formatos como 15m, 7d, 30s');

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  SECRET_JWT: z.string().min(25, 'SECRET_JWT deve ter pelo menos 25 chars'),
  REFRESH_SECRET_JWT: z.string().min(25, 'REFRESH_SECRET_JWT deve ter pelo menos 25 chars'),
  REFRESH_TOKEN_EXPIRATION: duration.default('7d'),
  ACCESS_TOKEN_EXPIRATION: duration.default('15m'),
  ALLOWED_ORIGINS: z.string().default('http://localhost:3000'),
});

const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
  if (process.env.NODE_ENV !== 'test') {
    console.error('Invalid environment variables:', parsed.error.flatten().fieldErrors);
    process.exit(1);
  }
}

const env = Object.freeze({
  nodeEnv: parsed.success ? parsed.data.NODE_ENV : 'test',
  port: parsed.success ? parsed.data.PORT : 3000,
  secretJwt: parsed.success ? parsed.data.SECRET_JWT : 'test_secret_jwt_123456789012345',
  accessTokenExpiration: parsed.success ? parsed.data.ACCESS_TOKEN_EXPIRATION : '15m',
  refreshSecretJwt: parsed.success
    ? parsed.data.REFRESH_SECRET_JWT
    : 'test_refresh_secret_jwt_123456789012345',
  refreshTokenExpiration: parsed.success ? parsed.data.REFRESH_TOKEN_EXPIRATION : '7d',
  allowedOrigins: parsed.success ? parsed.data.ALLOWED_ORIGINS : 'http://localhost:3000',
});

export { env };
