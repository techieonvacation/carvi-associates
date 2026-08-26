import { FIRM, readSmtpConfig } from "@/lib/mail/config";
import { deliver } from "@/lib/mail/transport";
import {
  buildAcknowledgementEmail,
  buildInternalEmail,
  buildReference,
  type MailRow,
} from "@/lib/mail/templates";
import type { Enquiry } from "./schema";

type EnquiryMeta = {
  ip?: string;
  userAgent?: string;
  referer?: string;
};

type Composed = {
  prefix: string;
  subject: string;
  heading: string;
  intro: string;
  rows: MailRow[];
  replyTo?: string;
  recipientName?: string;
  recipientEmail?: string;
  ackHeading: string;
  ackBody: string;
  ackRows: MailRow[];
  note?: string;
};

function compose(enquiry: Enquiry): Composed {
  switch (enquiry.kind) {
    case "contact":
      return {
        prefix: "CA-ENQ",
        subject: `New enquiry — ${enquiry.service ?? "General"} — ${enquiry.name}`,
        heading: "New website enquiry",
        intro: `${enquiry.name} submitted the contact form and is expecting a reply.`,
        rows: [
          { label: "Name", value: enquiry.name },
          { label: "Email", value: enquiry.email },
          { label: "Phone", value: enquiry.phone },
          { label: "Company", value: enquiry.company ?? "" },
          { label: "Service", value: enquiry.service ?? "" },
          { label: "Indicative budget", value: enquiry.budget ?? "" },
          { label: "Preferred contact", value: enquiry.preferredContact ?? "" },
          { label: "Subject", value: enquiry.subject ?? "" },
          { label: "Message", value: enquiry.message },
        ],
        replyTo: enquiry.email,
        recipientName: enquiry.name,
        recipientEmail: enquiry.email,
        ackHeading: "We have your enquiry",
        ackBody:
          "Thank you for writing to Carvi Associates. A senior member of our team is reviewing your message and will respond within one business day. If the matter is urgent, call us and quote the reference below.",
        ackRows: [
          { label: "Service", value: enquiry.service ?? "General enquiry" },
          { label: "Your message", value: enquiry.message },
        ],
      };

    case "appointment":
      return {
        prefix: "CA-APT",
        subject: `Consultation request — ${enquiry.name} — ${enquiry.preferredDate ?? "date flexible"}`,
        heading: "Consultation booking request",
        intro: `${enquiry.name} requested a consultation. Confirm the slot or propose an alternative.`,
        rows: [
          { label: "Name", value: enquiry.name },
          { label: "Email", value: enquiry.email },
          { label: "Phone", value: enquiry.phone },
          { label: "Company", value: enquiry.company ?? "" },
          { label: "Service", value: enquiry.service ?? "" },
          { label: "Meeting mode", value: enquiry.meetingMode ?? "" },
          { label: "Preferred date", value: enquiry.preferredDate ?? "" },
          { label: "Preferred slot", value: enquiry.preferredSlot ?? "" },
          { label: "Notes", value: enquiry.message ?? "" },
        ],
        replyTo: enquiry.email,
        recipientName: enquiry.name,
        recipientEmail: enquiry.email,
        ackHeading: "Your consultation request is in",
        ackBody:
          "Thank you for booking time with Carvi Associates. We will confirm your slot by email or phone within one business day, along with the joining details or office directions.",
        ackRows: [
          { label: "Preferred date", value: enquiry.preferredDate ?? "Flexible" },
          { label: "Preferred slot", value: enquiry.preferredSlot ?? "Flexible" },
          { label: "Meeting mode", value: enquiry.meetingMode ?? "To be confirmed" },
        ],
      };

    case "callback":
      return {
        prefix: "CA-CBK",
        subject: `Callback request — ${enquiry.name} — ${enquiry.phone}`,
        heading: "Callback requested",
        intro: `${enquiry.name} asked to be called back as soon as possible.`,
        rows: [
          { label: "Name", value: enquiry.name },
          { label: "Phone", value: enquiry.phone },
          { label: "Email", value: enquiry.email ?? "" },
          { label: "Topic", value: enquiry.topic ?? "" },
        ],
        replyTo: enquiry.email,
        recipientName: enquiry.name,
        recipientEmail: enquiry.email,
        ackHeading: "We will call you shortly",
        ackBody:
          "Thanks for the callback request. Our team calls back within business hours, Monday to Saturday, 10:00 AM to 7:00 PM IST.",
        ackRows: [{ label: "Topic", value: enquiry.topic ?? "General" }],
      };

    case "newsletter":
      return {
        prefix: "CA-SUB",
        subject: `Knowledge Bank subscription — ${enquiry.email}`,
        heading: "New Knowledge Bank subscriber",
        intro: "Somebody subscribed to the compliance digest from the website.",
        rows: [
          { label: "Email", value: enquiry.email },
          { label: "Name", value: enquiry.name ?? "" },
          { label: "Interests", value: enquiry.interests ?? "" },
        ],
        replyTo: enquiry.email,
        recipientName: enquiry.name ?? "there",
        recipientEmail: enquiry.email,
        ackHeading: "You are subscribed",
        ackBody:
          "You will now receive the Carvi Associates compliance digest — statutory due dates, notifications that matter, and the occasional deep dive. No more than two emails a month, and you can unsubscribe from any of them.",
        ackRows: [{ label: "Interests", value: enquiry.interests ?? "All updates" }],
      };

    case "quote":
      return {
        prefix: "CA-QTE",
        subject: `Quote request — ${enquiry.name}${enquiry.company ? ` · ${enquiry.company}` : ""}`,
        heading: "New quote request",
        intro: `${enquiry.name} requested a free quote from the homepage contact form.`,
        rows: [
          { label: "Name", value: enquiry.name },
          { label: "Company", value: enquiry.company ?? "" },
          { label: "Email", value: enquiry.email },
          { label: "Mobile", value: enquiry.phone },
          { label: "Location", value: enquiry.location },
          { label: "Message", value: enquiry.message ?? "" },
        ],
        replyTo: enquiry.email,
        recipientName: enquiry.name,
        recipientEmail: enquiry.email,
        ackHeading: "We have your quote request",
        ackBody:
          "Thank you for reaching out to Carvi Associates. Our team is preparing a response and will contact you within one business day with next steps and an indicative scope.",
        ackRows: [
          { label: "Company", value: enquiry.company ?? "" },
          { label: "Location", value: enquiry.location },
          { label: "Your message", value: enquiry.message ?? "" },
        ],
      };

    case "resource":
      return {
        prefix: "CA-RES",
        subject: `Resource request — ${enquiry.resourceTitle} — ${enquiry.name}`,
        heading: "Resource request",
        intro: `${enquiry.name} asked for help with a Knowledge Bank resource.`,
        rows: [
          { label: "Resource", value: enquiry.resourceTitle },
          { label: "Type", value: enquiry.resourceType ?? "" },
          { label: "Name", value: enquiry.name },
          { label: "Email", value: enquiry.email },
          { label: "Phone", value: enquiry.phone ?? "" },
          { label: "Company", value: enquiry.company ?? "" },
          { label: "Message", value: enquiry.message ?? "" },
        ],
        replyTo: enquiry.email,
        recipientName: enquiry.name,
        recipientEmail: enquiry.email,
        ackHeading: "Request received",
        ackBody: `We have your request for "${enquiry.resourceTitle}". Our team will email the prepared pack or the guidance you asked for within one business day.`,
        ackRows: [{ label: "Resource", value: enquiry.resourceTitle }],
      };

    case "tool-result":
      return {
        prefix: "CA-TOL",
        subject: `${enquiry.toolName} result — ${enquiry.name}`,
        heading: `${enquiry.toolName} — result sent to a visitor`,
        intro: `${enquiry.name} emailed themselves a ${enquiry.toolName} result and may want a review.`,
        rows: [
          { label: "Name", value: enquiry.name },
          { label: "Email", value: enquiry.email },
          { label: "Phone", value: enquiry.phone ?? "" },
          { label: "Tool", value: enquiry.toolName },
          { label: "Result", value: enquiry.summary },
          { label: "Message", value: enquiry.message ?? "" },
        ],
        replyTo: enquiry.email,
        recipientName: enquiry.name,
        recipientEmail: enquiry.email,
        ackHeading: `Your ${enquiry.toolName} result`,
        ackBody:
          "Here is the calculation you ran on our Knowledge Bank. These figures are indicative and based on the inputs you provided — reply to this email if you would like a chartered accountant to review them against your books.",
        ackRows: [{ label: "Result", value: enquiry.summary }],
        note: "Indicative figures generated by a website tool. Not formal advice.",
      };
  }
}

export type EnquiryDelivery = {
  reference: string;
  delivered: boolean;
  reason?: string;
};

export async function sendEnquiry(
  enquiry: Enquiry,
  meta: EnquiryMeta = {},
): Promise<EnquiryDelivery> {
  const composed = compose(enquiry);
  const reference = buildReference(composed.prefix);
  const smtp = readSmtpConfig();
  const inbox = smtp?.to ?? FIRM.inbox;

  const contextRows: MailRow[] = [
    { label: "Page", value: enquiry.sourcePath ?? meta.referer ?? "" },
    { label: "IP address", value: meta.ip ?? "" },
    { label: "Browser", value: meta.userAgent ?? "" },
  ];

  const internal = buildInternalEmail({
    heading: composed.heading,
    intro: composed.intro,
    reference,
    rows: [...composed.rows, ...contextRows],
    note: composed.note,
    replyTo: composed.replyTo,
  });

  const result = await deliver({
    to: inbox,
    bcc: smtp?.bcc,
    replyTo: composed.replyTo,
    subject: composed.subject,
    html: internal.html,
    text: internal.text,
  });

  if (result.delivered && composed.recipientEmail) {
    const ack = buildAcknowledgementEmail({
      name: composed.recipientName ?? "there",
      heading: composed.ackHeading,
      body: composed.ackBody,
      rows: composed.ackRows,
      reference,
    });

    try {
      await deliver({
        to: composed.recipientEmail,
        replyTo: inbox,
        subject: `${composed.ackHeading} · ${FIRM.name} (${reference})`,
        html: ack.html,
        text: ack.text,
      });
    } catch (error) {
      console.error("[mail] acknowledgement failed", error);
    }
  }

  return { reference, delivered: result.delivered, reason: result.reason };
}
