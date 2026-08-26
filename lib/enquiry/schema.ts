import { z } from "zod";

export const ENQUIRY_KINDS = [
  "contact",
  "appointment",
  "callback",
  "newsletter",
  "quote",
  "resource",
  "tool-result",
] as const;

export type EnquiryKind = (typeof ENQUIRY_KINDS)[number];

export const SERVICE_OPTIONS = [
  "Audit & Assurance",
  "Direct Taxation",
  "GST & Indirect Tax",
  "Company & LLP Incorporation",
  "Startup Advisory & Funding",
  "Accounting & Bookkeeping",
  "Payroll & Labour Compliance",
  "Virtual CFO",
  "Business Valuation",
  "FEMA & International Tax",
  "Other",
] as const;

export const BUDGET_OPTIONS = [
  "Under ₹25,000",
  "₹25,000 – ₹1,00,000",
  "₹1,00,000 – ₹5,00,000",
  "Above ₹5,00,000",
  "Not sure yet",
] as const;

export const CONTACT_MODE_OPTIONS = [
  "Email",
  "Phone call",
  "WhatsApp",
  "Video meeting",
] as const;

export const MEETING_MODE_OPTIONS = [
  "Video call",
  "Phone call",
  "Office visit",
] as const;

export const TIME_SLOT_OPTIONS = [
  "10:00 AM – 11:00 AM",
  "11:00 AM – 12:00 PM",
  "12:00 PM – 01:00 PM",
  "02:00 PM – 03:00 PM",
  "03:00 PM – 04:00 PM",
  "04:00 PM – 05:00 PM",
  "05:00 PM – 06:00 PM",
] as const;

const name = z
  .string()
  .trim()
  .min(2, "Enter your full name")
  .max(80, "Name is too long");

const email = z
  .string()
  .trim()
  .min(1, "Enter your email address")
  .max(160, "Email is too long")
  .pipe(z.email("Enter a valid email address"))
  .transform((value) => value.toLowerCase());

const phone = z
  .string()
  .trim()
  .min(8, "Enter a valid phone number")
  .max(20, "Phone number is too long")
  .regex(/^[+()\d\s-]+$/, "Phone can contain digits, spaces, + ( ) and -");

const optionalPhone = z
  .union([phone, z.literal("")])
  .optional()
  .transform((value) => (value ? value : undefined));

const optionalText = (max: number) =>
  z
    .union([z.string().trim().max(max, "This field is too long"), z.literal("")])
    .optional()
    .transform((value) => (value ? value : undefined));

const message = z
  .string()
  .trim()
  .min(10, "Tell us a little more — at least 10 characters")
  .max(4000, "Message is too long (4000 characters max)");

const consent = z
  .union([z.literal("on"), z.literal("true"), z.boolean()])
  .transform(() => true);

const antiSpam = {
  company_website: z.string().max(0, "Submission rejected").optional(),
  renderedAt: z.coerce.number().optional(),
};

export const contactEnquirySchema = z.object({
  kind: z.literal("contact"),
  name,
  email,
  phone,
  company: optionalText(120),
  service: optionalText(80),
  budget: optionalText(60),
  preferredContact: optionalText(40),
  subject: optionalText(160),
  message,
  consent,
  sourcePath: optionalText(200),
  ...antiSpam,
});

export const appointmentEnquirySchema = z.object({
  kind: z.literal("appointment"),
  name,
  email,
  phone,
  company: optionalText(120),
  service: optionalText(80),
  meetingMode: optionalText(40),
  preferredDate: optionalText(40),
  preferredSlot: optionalText(40),
  message: z
    .union([z.string().trim().max(4000), z.literal("")])
    .optional()
    .transform((value) => (value ? value : undefined)),
  consent,
  sourcePath: optionalText(200),
  ...antiSpam,
});

export const callbackEnquirySchema = z.object({
  kind: z.literal("callback"),
  name,
  phone,
  email: z
    .union([email, z.literal("")])
    .optional()
    .transform((value) => (value ? value : undefined)),
  topic: optionalText(120),
  sourcePath: optionalText(200),
  ...antiSpam,
});

export const newsletterEnquirySchema = z.object({
  kind: z.literal("newsletter"),
  email,
  name: z
    .union([name, z.literal("")])
    .optional()
    .transform((value) => (value ? value : undefined)),
  interests: optionalText(300),
  sourcePath: optionalText(200),
  ...antiSpam,
});

export const quoteEnquirySchema = z.object({
  kind: z.literal("quote"),
  name,
  company: optionalText(120),
  email,
  phone,
  location: z.string().trim().min(2, "Enter your city or location").max(120, "Location is too long"),
  sourcePath: optionalText(200),
  ...antiSpam,
});

export const resourceEnquirySchema = z.object({
  kind: z.literal("resource"),
  name,
  email,
  phone: optionalPhone,
  company: optionalText(120),
  resourceTitle: z.string().trim().min(1).max(160),
  resourceType: optionalText(60),
  message: z
    .union([z.string().trim().max(2000), z.literal("")])
    .optional()
    .transform((value) => (value ? value : undefined)),
  sourcePath: optionalText(200),
  ...antiSpam,
});

export const toolResultEnquirySchema = z.object({
  kind: z.literal("tool-result"),
  name,
  email,
  phone: optionalPhone,
  toolName: z.string().trim().min(1).max(120),
  summary: z.string().trim().min(1).max(6000),
  message: z
    .union([z.string().trim().max(2000), z.literal("")])
    .optional()
    .transform((value) => (value ? value : undefined)),
  sourcePath: optionalText(200),
  ...antiSpam,
});

export const enquirySchema = z.discriminatedUnion("kind", [
  contactEnquirySchema,
  appointmentEnquirySchema,
  callbackEnquirySchema,
  newsletterEnquirySchema,
  quoteEnquirySchema,
  resourceEnquirySchema,
  toolResultEnquirySchema,
]);

export type ContactEnquiry = z.infer<typeof contactEnquirySchema>;
export type AppointmentEnquiry = z.infer<typeof appointmentEnquirySchema>;
export type CallbackEnquiry = z.infer<typeof callbackEnquirySchema>;
export type NewsletterEnquiry = z.infer<typeof newsletterEnquirySchema>;
export type QuoteEnquiry = z.infer<typeof quoteEnquirySchema>;
export type ResourceEnquiry = z.infer<typeof resourceEnquirySchema>;
export type ToolResultEnquiry = z.infer<typeof toolResultEnquirySchema>;
export type Enquiry = z.infer<typeof enquirySchema>;

export type EnquiryState = {
  status: "idle" | "success" | "error";
  message: string;
  reference?: string;
  errors?: Record<string, string>;
};

export const IDLE_ENQUIRY_STATE: EnquiryState = { status: "idle", message: "" };
