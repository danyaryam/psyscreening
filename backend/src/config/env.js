import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(5000),
  DATABASE_URL: z
    .string()
    .default("postgresql://postgres:postgres@localhost:5432/psyscreening?schema=public"),
  JWT_SECRET: z.string().min(8).default("change_this_super_secret_key"),
  JWT_EXPIRES_IN: z.string().default("7d"),
  REQUIRE_EMAIL_VERIFICATION: z
    .enum(["true", "false"])
    .default("true")
    .transform((value) => value === "true"),
  CORS_ORIGIN: z.string().default("http://localhost:5173"),
  FRONTEND_URL: z.string().url().default("http://localhost:5173"),
  MAILTRAP_HOST: z.string().default("sandbox.smtp.mailtrap.io"),
  MAILTRAP_PORT: z.coerce.number().default(2525),
  MAILTRAP_USER: z.string().optional(),
  MAILTRAP_PASS: z.string().optional(),
  EMAIL_PROVIDER: z.enum(["smtp", "resend"]).optional(),
  RESEND_API_KEY: z.string().optional(),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_SECURE: z
    .enum(["true", "false"])
    .optional()
    .transform((value) => value === "true"),
  MAIL_FROM: z.string().default("PsyScreening <no-reply@psyscreening.local>"),
  GOOGLE_CLIENT_ID: z.string().optional(),
  ML_PROVIDER: z.enum(["mock", "remote"]).default("mock"),
  ML_SERVICE_URL: z.string().optional(),
  AI_ML_API_BASE_URL: z
    .string()
    .url()
    .default("https://fastapi-psyscreening-production.up.railway.app"),
});

export const env = envSchema.parse(process.env);
