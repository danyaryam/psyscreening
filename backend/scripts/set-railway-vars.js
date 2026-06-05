import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const serviceName = "psyscreening-api";
const projectId = "512429de-0833-4789-a818-64d15b636957";
const environmentId = "f28aaf5d-9401-4877-8a5c-e8e1acc10b98";
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const backendDir = path.resolve(scriptDir, "..");
const envPath = path.resolve(backendDir, ".env");

function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return {};
  }

  return fs
    .readFileSync(filePath, "utf8")
    .split(/\r?\n/)
    .reduce((acc, line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) {
        return acc;
      }

      const separatorIndex = trimmed.indexOf("=");
      if (separatorIndex === -1) {
        return acc;
      }

      const key = trimmed.slice(0, separatorIndex).trim();
      let value = trimmed.slice(separatorIndex + 1).trim();

      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }

      acc[key] = value;
      return acc;
    }, {});
}

const localEnv = parseEnvFile(envPath);
const readEnv = (key, fallback = "") => localEnv[key] || fallback;

const variables = {
  NODE_ENV: "production",
  DATABASE_URL: "$" + "{{Postgres.DATABASE_URL}}",
  CORS_ORIGIN: "https://psyscreening.vercel.app",
  FRONTEND_URL: "https://psyscreening.vercel.app",
  JWT_SECRET: readEnv("JWT_SECRET"),
  JWT_EXPIRES_IN: readEnv("JWT_EXPIRES_IN", "7d"),
  MAILTRAP_HOST: readEnv("MAILTRAP_HOST", "sandbox.smtp.mailtrap.io"),
  MAILTRAP_PORT: readEnv("MAILTRAP_PORT", "2525"),
  MAILTRAP_USER: readEnv("MAILTRAP_USER"),
  MAILTRAP_PASS: readEnv("MAILTRAP_PASS"),
  SMTP_HOST: readEnv("SMTP_HOST"),
  SMTP_PORT: readEnv("SMTP_PORT"),
  SMTP_SECURE: readEnv("SMTP_SECURE"),
  SMTP_USER: readEnv("SMTP_USER"),
  SMTP_PASS: readEnv("SMTP_PASS"),
  MAIL_FROM: readEnv("MAIL_FROM", "PsyScreening <no-reply@psyscreening.local>"),
  GOOGLE_CLIENT_ID: readEnv("GOOGLE_CLIENT_ID"),
  ML_PROVIDER: "remote",
  AI_ML_API_BASE_URL: "https://fastapi-psyscreening-production.up.railway.app",
  ADMIN_EMAIL: readEnv("ADMIN_EMAIL", "adminganteng@gmail.com"),
  ADMIN_PASSWORD: readEnv("ADMIN_PASSWORD", "Adminganjil13579"),
};

const missing = [];

for (const [key, value] of Object.entries(variables)) {
  if (!value) {
    missing.push(key);
    continue;
  }

  const result = spawnSync(
    "npx.cmd",
    [
      "@railway/cli",
      "variable",
      "set",
      key,
      "--stdin",
      "--service",
      serviceName,
      "--project",
      projectId,
      "--environment",
      environmentId,
      "--skip-deploys",
    ],
    {
      cwd: backendDir,
      encoding: "utf8",
      input: value,
      shell: false,
    },
  );

  if (result.status !== 0) {
    console.error(`Gagal memasang variable ${key}.`);
    console.error(result.stderr || result.stdout);
    process.exit(result.status || 1);
  }

  console.log(`Variable ${key} sudah dipasang.`);
}

if (missing.length > 0) {
  console.warn(`Variable kosong dan dilewati: ${missing.join(", ")}`);
}
