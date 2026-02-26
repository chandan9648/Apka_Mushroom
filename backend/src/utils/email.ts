import nodemailer from "nodemailer";

export type OtpEmailPurpose = "verify_email" | "reset_password";

function smtpEnabled() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

function smtpPort(): number {
  const raw = process.env.SMTP_PORT;
  if (!raw) return 587;
  const n = Number(raw);
  return Number.isFinite(n) ? n : 587;
}

function smtpSecure(): boolean {
  const raw = (process.env.SMTP_SECURE || "").toLowerCase();
  if (raw === "true" || raw === "1" || raw === "yes") return true;
  if (raw === "false" || raw === "0" || raw === "no") return false;
  // default: true only for 465
  return smtpPort() === 465;
}

function fromAddress(): string {
  return process.env.EMAIL_FROM || process.env.SMTP_USER || "no-reply@localhost";
}

export async function sendOtpEmail(opts: {
  to: string;
  code: string;
  purpose: OtpEmailPurpose;
  ttlMinutes: number;
  appName?: string;
}) {
  if (!smtpEnabled()) {
    // No SMTP configured: keep dev workflow usable.
    // OTP is already logged by issueOtp().
    return;
  }

  const appName = opts.appName || process.env.APP_NAME || "Apka Mushroom";
  const subject =
    opts.purpose === "reset_password"
      ? `${appName} password reset OTP`
      : `${appName} email verification OTP`;

  const text =
    `Your OTP code is: ${opts.code}\n\n` +
    `It expires in ${opts.ttlMinutes} minutes.\n\n` +
    `If you did not request this, you can ignore this email.`;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: smtpPort(),
    secure: smtpSecure(),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: fromAddress(),
    to: opts.to,
    subject,
    text,
  });
}
