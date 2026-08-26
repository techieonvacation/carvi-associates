"use server";

import { headers } from "next/headers";
import { sendEnquiry } from "@/lib/enquiry/send";
import {
  enquirySchema,
  type EnquiryState,
} from "@/lib/enquiry/schema";
import { rateLimit } from "@/lib/rate-limit";

const SUCCESS_COPY: Record<string, string> = {
  contact: "Thank you — your enquiry is with our team. We reply within one business day.",
  appointment:
    "Your consultation request is booked. We will confirm the slot by email shortly.",
  callback: "Thanks — we will call you back during business hours.",
  newsletter: "You are subscribed. Watch your inbox for the next compliance digest.",
  quote: "Thanks — your quote request is with our team. We reply within one business day.",
  resource: "Request received. We will email the resource within one business day.",
  "tool-result": "Sent — check your inbox for the result summary.",
};

function toPlainObject(formData: FormData) {
  const entries: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value === "string" && !key.startsWith("$ACTION")) {
      entries[key] = value;
    }
  }
  return entries;
}

async function requestMeta() {
  const headerList = await headers();
  const forwarded = headerList.get("x-forwarded-for");
  return {
    ip: forwarded?.split(",")[0]?.trim() || headerList.get("x-real-ip") || "unknown",
    userAgent: headerList.get("user-agent") ?? undefined,
    referer: headerList.get("referer") ?? undefined,
  };
}

export async function submitEnquiry(
  _prevState: EnquiryState,
  formData: FormData,
): Promise<EnquiryState> {
  const raw = toPlainObject(formData);

  if (raw.company_website) {
    return { status: "success", message: SUCCESS_COPY[raw.kind] ?? "Thank you." };
  }

  const parsed = enquirySchema.safeParse(raw);

  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0];
      if (typeof field === "string" && !errors[field]) errors[field] = issue.message;
    }
    return {
      status: "error",
      message: "Please check the highlighted fields and try again.",
      errors,
    };
  }

  const meta = await requestMeta();
  const limit = rateLimit(`enquiry:${meta.ip}:${parsed.data.kind}`, {
    limit: parsed.data.kind === "newsletter" ? 3 : 5,
    windowMs: 10 * 60 * 1000,
  });

  if (!limit.allowed) {
    return {
      status: "error",
      message: `Too many submissions from this device. Try again in ${Math.ceil(limit.retryAfterSeconds / 60)} minute(s), or email us directly.`,
    };
  }

  try {
    const result = await sendEnquiry(parsed.data, meta);

    if (!result.delivered) {
      if (process.env.NODE_ENV === "production") {
        return {
          status: "error",
          message:
            "We could not send your message right now. Please email info@carviassociates.com or call us directly.",
        };
      }
      return {
        status: "success",
        message: `${SUCCESS_COPY[parsed.data.kind] ?? "Thank you."} (SMTP is not configured — the message was logged to the server console.)`,
        reference: result.reference,
      };
    }

    return {
      status: "success",
      message: SUCCESS_COPY[parsed.data.kind] ?? "Thank you — we have your message.",
      reference: result.reference,
    };
  } catch (error) {
    console.error("[enquiry] delivery failed", error);
    return {
      status: "error",
      message:
        "Something went wrong while sending your message. Please email info@carviassociates.com or try again in a moment.",
    };
  }
}
