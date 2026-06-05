import nodemailer from "nodemailer";
import axios from "axios";
import { env } from "../config/env.js";
import { AppError } from "../utils/AppError.js";

function getEmailConfig() {
  const smtpConfigured = Boolean(env.SMTP_USER || env.SMTP_PASS || env.SMTP_HOST);
  const provider = env.EMAIL_PROVIDER || (env.RESEND_API_KEY ? "resend" : "smtp");

  return {
    provider,
    resendApiKey: env.RESEND_API_KEY,
    host: smtpConfigured ? env.SMTP_HOST : env.MAILTRAP_HOST,
    port: smtpConfigured ? env.SMTP_PORT : env.MAILTRAP_PORT,
    secure: smtpConfigured ? (env.SMTP_SECURE ?? false) : false,
    user: smtpConfigured ? env.SMTP_USER : env.MAILTRAP_USER,
    pass: smtpConfigured ? env.SMTP_PASS : env.MAILTRAP_PASS,
  };
}

function assertEmailConfigured() {
  const config = getEmailConfig();

  if (config.provider === "resend") {
    if (!config.resendApiKey || !env.MAIL_FROM) {
      throw new AppError(
        "Layanan email Resend belum lengkap. Lengkapi RESEND_API_KEY dan MAIL_FROM.",
        503,
      );
    }

    return;
  }

  if (!config.host || !config.user || !config.pass) {
    throw new AppError(
      config.provider === "smtp"
        ? "Layanan email Gmail belum lengkap. Lengkapi SMTP_HOST, SMTP_USER, dan SMTP_PASS."
        : "Layanan email belum dikonfigurasi. Lengkapi SMTP_USER dan SMTP_PASS.",
      503,
    );
  }
}

export function ensureEmailServiceReady() {
  assertEmailConfigured();
}

function createTransporter() {
  assertEmailConfigured();
  const config = getEmailConfig();

  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    requireTLS: config.port === 587,
    family: 4,
    connectionTimeout: 20000,
    greetingTimeout: 20000,
    socketTimeout: 30000,
    tls: {
      servername: config.host,
    },
    auth: {
      user: config.user,
      pass: config.pass,
    },
  });
}

function buildVerificationUrl(token) {
  const url = new URL("/verify-email", env.FRONTEND_URL);
  url.searchParams.set("token", token);
  return url.toString();
}

export async function sendVerificationEmail(userEmail, token) {
  const verificationUrl = buildVerificationUrl(token);
  const text = [
    "Halo,",
    "",
    "Terima kasih sudah mendaftar di PsyScreening.",
    "Klik link berikut untuk memverifikasi email Anda:",
    verificationUrl,
    "",
    "Link ini berlaku sementara. Jika Anda tidak merasa mendaftar, abaikan email ini.",
    "",
    "Catatan: PsyScreening adalah alat screening awal dan bukan pengganti diagnosis medis atau psikologis profesional.",
  ].join("\n");
  const html = `
    <div style="font-family: Arial, sans-serif; color: #0f172a; line-height: 1.7;">
      <h2 style="margin-bottom: 8px;">Verifikasi akun PsyScreening</h2>
      <p>Terima kasih sudah mendaftar di PsyScreening.</p>
      <p>Klik tombol berikut untuk memverifikasi email Anda dan mengaktifkan akun.</p>
      <p>
        <a href="${verificationUrl}" style="display: inline-block; background: #2563eb; color: #ffffff; padding: 12px 18px; border-radius: 12px; text-decoration: none; font-weight: 700;">
          Verifikasi Email
        </a>
      </p>
      <p style="font-size: 14px; color: #475569;">Link ini berlaku sementara. Jika Anda tidak merasa mendaftar, abaikan email ini.</p>
      <p style="font-size: 13px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 12px;">
        PsyScreening adalah alat screening awal dan bukan pengganti diagnosis medis atau psikologis profesional.
      </p>
    </div>
  `;
  const config = getEmailConfig();

  if (config.provider === "resend") {
    await axios.post(
      "https://api.resend.com/emails",
      {
        from: env.MAIL_FROM,
        to: userEmail,
        subject: "Verifikasi akun PsyScreening",
        text,
        html,
      },
      {
        timeout: 20000,
        headers: {
          Authorization: `Bearer ${config.resendApiKey}`,
          "Content-Type": "application/json",
        },
      },
    );

    return;
  }

  const transporter = createTransporter();

  await transporter.sendMail({
    from: env.MAIL_FROM,
    to: userEmail,
    subject: "Verifikasi akun PsyScreening",
    text,
    html,
  });
}
