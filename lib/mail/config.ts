export const FIRM = {
  name: "Carvi Associates",
  tagline: "Chartered Accountants · Audit, Tax & Advisory",
  inbox: process.env.CONTACT_INBOX?.trim() || "info@carviassociates.com",
  phone: process.env.NEXT_PUBLIC_FIRM_PHONE?.trim() || "+91 98765 43210",
  whatsapp:
    process.env.NEXT_PUBLIC_FIRM_WHATSAPP?.trim() || "https://wa.me/919876543210",
  address:
    process.env.NEXT_PUBLIC_FIRM_ADDRESS?.trim() ||
    "2nd Floor, Bhandari Business Centre, Sector 62, Noida, Uttar Pradesh 201309",
  hours: "Monday – Saturday · 10:00 AM to 7:00 PM IST",
  site: process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://carviassociates.com",
} as const;

export type SmtpConfig = {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  password: string;
  from: string;
  to: string;
  bcc?: string;
};

function toPort(value: string | undefined, fallback: number) {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export function readSmtpConfig(): SmtpConfig | null {
  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const password = process.env.SMTP_PASSWORD?.trim() ?? process.env.SMTP_PASS?.trim();

  if (!host || !user || !password) return null;

  const port = toPort(process.env.SMTP_PORT, 465);
  const secureEnv = process.env.SMTP_SECURE?.trim().toLowerCase();
  const secure = secureEnv ? secureEnv === "true" || secureEnv === "1" : port === 465;

  return {
    host,
    port,
    secure,
    user,
    password,
    from: process.env.MAIL_FROM?.trim() || `${FIRM.name} <${user}>`,
    to: process.env.CONTACT_INBOX?.trim() || FIRM.inbox,
    bcc: process.env.CONTACT_BCC?.trim() || undefined,
  };
}

export const isProduction = process.env.NODE_ENV === "production";
