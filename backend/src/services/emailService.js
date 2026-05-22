import nodemailer from "nodemailer";
import { env } from "../config/env.js";
import { AppError } from "../utils/AppError.js";

function assertMailtrapConfigured() {
  if (!env.MAILTRAP_USER || !env.MAILTRAP_PASS) {
    throw new AppError(
      "Layanan email belum dikonfigurasi. Lengkapi MAILTRAP_USER dan MAILTRAP_PASS.",
      503,
    );
  }
}

export function ensureEmailServiceReady() {
  assertMailtrapConfigured();
}

function createTransporter() {
  assertMailtrapConfigured();

  return nodemailer.createTransport({
    host: env.MAILTRAP_HOST,
    port: env.MAILTRAP_PORT,
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
    auth: {
      user: env.MAILTRAP_USER,
      pass: env.MAILTRAP_PASS,
    },
  });
}

function buildVerificationUrl(token) {
  const url = new URL("/verify-email", env.FRONTEND_URL);
  url.searchParams.set("token", token);
  return url.toString();
}

export async function sendVerificationEmail(userEmail, token) {
  const transporter = createTransporter();
  const verificationUrl = buildVerificationUrl(token);

  await transporter.sendMail({
    from: env.MAIL_FROM,
    to: userEmail,
    subject: "Verifikasi akun PsyScreening",
    text: [
      "Halo,",
      "",
      "Terima kasih sudah mendaftar di PsyScreening.",
      "Klik link berikut untuk memverifikasi email Anda:",
      verificationUrl,
      "",
      "Link ini berlaku sementara. Jika Anda tidak merasa mendaftar, abaikan email ini.",
      "",
      "Catatan: PsyScreening adalah alat screening awal dan bukan pengganti diagnosis medis atau psikologis profesional.",
    ].join("\n"),
    html: `
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
    `,
  });
}
