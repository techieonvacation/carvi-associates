import { FIRM } from "./config";

export type MailRow = { label: string; value: string };

const PALETTE = {
  page: "#faf5e9",
  card: "#fffdf8",
  ink: "#3a3020",
  muted: "#6b5b40",
  line: "#cdae7c",
  accent: "#5c6b45",
  sand: "#e3c9a0",
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function nl2br(value: string) {
  return escapeHtml(value).replace(/\r?\n/g, "<br />");
}

export function formatTimestamp(date = new Date()) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(date);
}

export function buildReference(prefix: string) {
  const stamp = Date.now().toString(36).toUpperCase();
  const noise = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${prefix}-${stamp}${noise}`;
}

function rowsHtml(rows: MailRow[]) {
  return rows
    .filter((row) => row.value && row.value.trim().length > 0)
    .map(
      (row) => `
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid ${PALETTE.line};vertical-align:top;width:38%;font-family:Helvetica,Arial,sans-serif;font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:${PALETTE.muted};">${escapeHtml(row.label)}</td>
          <td style="padding:12px 0;border-bottom:1px solid ${PALETTE.line};vertical-align:top;font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.55;color:${PALETTE.ink};font-weight:500;">${nl2br(row.value)}</td>
        </tr>`,
    )
    .join("");
}

export function buildInternalEmail({
  heading,
  intro,
  reference,
  rows,
  note,
  replyTo,
}: {
  heading: string;
  intro: string;
  reference: string;
  rows: MailRow[];
  note?: string;
  replyTo?: string;
}) {
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>${escapeHtml(heading)}</title>
</head>
<body style="margin:0;padding:0;background:${PALETTE.page};">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(intro)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${PALETTE.page};padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;background:${PALETTE.card};border:1px solid ${PALETTE.line};border-radius:14px;overflow:hidden;">
          <tr>
            <td style="background:${PALETTE.accent};padding:22px 28px;">
              <p style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:rgba(255,253,248,.72);">${escapeHtml(FIRM.name)}</p>
              <p style="margin:6px 0 0;font-family:Georgia,'Times New Roman',serif;font-size:22px;line-height:1.3;color:${PALETTE.card};font-weight:700;">${escapeHtml(heading)}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:26px 28px 8px;">
              <p style="margin:0 0 18px;font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.6;color:${PALETTE.muted};">${escapeHtml(intro)}</p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rowsHtml(rows)}</table>
            </td>
          </tr>
          ${
            note
              ? `<tr><td style="padding:18px 28px 0;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${PALETTE.page};border-radius:10px;">
                    <tr><td style="padding:14px 16px;font-family:Helvetica,Arial,sans-serif;font-size:13px;line-height:1.6;color:${PALETTE.muted};">${nl2br(note)}</td></tr>
                  </table>
                </td></tr>`
              : ""
          }
          ${
            replyTo
              ? `<tr><td style="padding:20px 28px 0;">
                  <a href="mailto:${escapeHtml(replyTo)}" style="display:inline-block;background:${PALETTE.accent};color:${PALETTE.card};font-family:Helvetica,Arial,sans-serif;font-size:14px;font-weight:700;text-decoration:none;padding:12px 22px;border-radius:999px;">Reply to sender</a>
                </td></tr>`
              : ""
          }
          <tr>
            <td style="padding:24px 28px 26px;">
              <p style="margin:18px 0 0;padding-top:16px;border-top:1px solid ${PALETTE.line};font-family:Helvetica,Arial,sans-serif;font-size:12px;line-height:1.7;color:${PALETTE.muted};">
                Reference <strong style="color:${PALETTE.ink};">${escapeHtml(reference)}</strong><br />
                Received ${escapeHtml(formatTimestamp())} (IST)<br />
                Sent automatically from ${escapeHtml(FIRM.site)}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = [
    heading,
    "",
    intro,
    "",
    ...rows
      .filter((row) => row.value?.trim())
      .map((row) => `${row.label}: ${row.value}`),
    "",
    note ?? "",
    `Reference: ${reference}`,
    `Received: ${formatTimestamp()} (IST)`,
  ]
    .filter(Boolean)
    .join("\n");

  return { html, text };
}

export function buildAcknowledgementEmail({
  name,
  heading,
  body,
  rows,
  reference,
}: {
  name: string;
  heading: string;
  body: string;
  rows: MailRow[];
  reference: string;
}) {
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>${escapeHtml(heading)}</title>
</head>
<body style="margin:0;padding:0;background:${PALETTE.page};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${PALETTE.page};padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:${PALETTE.card};border:1px solid ${PALETTE.line};border-radius:14px;overflow:hidden;">
          <tr>
            <td style="padding:28px 28px 0;">
              <p style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:${PALETTE.accent};">${escapeHtml(FIRM.name)}</p>
              <h1 style="margin:10px 0 0;font-family:Georgia,'Times New Roman',serif;font-size:24px;line-height:1.3;color:${PALETTE.ink};">${escapeHtml(heading)}</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 28px 0;">
              <p style="margin:0 0 14px;font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.65;color:${PALETTE.ink};">Hello ${escapeHtml(name)},</p>
              <p style="margin:0 0 18px;font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.65;color:${PALETTE.muted};">${nl2br(body)}</p>
            </td>
          </tr>
          ${
            rows.length
              ? `<tr><td style="padding:0 28px;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${PALETTE.page};border-radius:10px;">
                    <tr><td style="padding:6px 18px 14px;">
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rowsHtml(rows)}</table>
                    </td></tr>
                  </table>
                </td></tr>`
              : ""
          }
          <tr>
            <td style="padding:22px 28px 28px;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding-right:10px;">
                    <a href="tel:${escapeHtml(FIRM.phone.replace(/\s/g, ""))}" style="display:inline-block;background:${PALETTE.accent};color:${PALETTE.card};font-family:Helvetica,Arial,sans-serif;font-size:14px;font-weight:700;text-decoration:none;padding:11px 20px;border-radius:999px;">Call the team</a>
                  </td>
                  <td>
                    <a href="${escapeHtml(FIRM.site)}" style="display:inline-block;background:${PALETTE.sand};color:${PALETTE.ink};font-family:Helvetica,Arial,sans-serif;font-size:14px;font-weight:700;text-decoration:none;padding:11px 20px;border-radius:999px;">Visit website</a>
                  </td>
                </tr>
              </table>
              <p style="margin:22px 0 0;padding-top:16px;border-top:1px solid ${PALETTE.line};font-family:Helvetica,Arial,sans-serif;font-size:12px;line-height:1.7;color:${PALETTE.muted};">
                ${escapeHtml(FIRM.name)} · ${escapeHtml(FIRM.tagline)}<br />
                ${escapeHtml(FIRM.address)}<br />
                ${escapeHtml(FIRM.hours)}<br />
                Reference <strong style="color:${PALETTE.ink};">${escapeHtml(reference)}</strong>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = [
    `Hello ${name},`,
    "",
    body,
    "",
    ...rows.filter((row) => row.value?.trim()).map((row) => `${row.label}: ${row.value}`),
    "",
    `${FIRM.name} — ${FIRM.tagline}`,
    FIRM.address,
    FIRM.hours,
    `Reference: ${reference}`,
  ]
    .filter(Boolean)
    .join("\n");

  return { html, text };
}
