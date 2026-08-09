import nodemailer, { type Transporter } from "nodemailer";
import { readSmtpConfig, type SmtpConfig } from "./config";

type TransportBundle = { transporter: Transporter; config: SmtpConfig };

const globalForMail = globalThis as unknown as {
  carviMailTransport?: TransportBundle | null;
};

export function getTransport(): TransportBundle | null {
  if (globalForMail.carviMailTransport !== undefined) {
    return globalForMail.carviMailTransport;
  }

  const config = readSmtpConfig();
  if (!config) {
    globalForMail.carviMailTransport = null;
    return null;
  }

  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: { user: config.user, pass: config.password },
    pool: true,
    maxConnections: 3,
    maxMessages: 50,
    connectionTimeout: 15_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
  });

  globalForMail.carviMailTransport = { transporter, config };
  return globalForMail.carviMailTransport;
}

export type MailPayload = {
  to: string;
  bcc?: string;
  replyTo?: string;
  subject: string;
  html: string;
  text: string;
};

export type MailResult = { delivered: boolean; reason?: string };

export async function deliver(payload: MailPayload): Promise<MailResult> {
  const bundle = getTransport();

  if (!bundle) {
    console.warn(
      `[mail] SMTP is not configured — email not sent.\nTo: ${payload.to}\nSubject: ${payload.subject}\n\n${payload.text}`,
    );
    return { delivered: false, reason: "smtp-not-configured" };
  }

  await bundle.transporter.sendMail({
    from: bundle.config.from,
    to: payload.to,
    bcc: payload.bcc,
    replyTo: payload.replyTo,
    subject: payload.subject,
    html: payload.html,
    text: payload.text,
  });

  return { delivered: true };
}
