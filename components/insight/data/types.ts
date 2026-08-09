export type KnowledgeCategory =
  | "all"
  | "insights"
  | "shorts"
  | "calculators"
  | "calendar"
  | "updates"
  | "utilities"
  | "links"
  | "acts"
  | "forms";

export type ContentCategory = Exclude<KnowledgeCategory, "all">;

export type ArticleBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string; id: string }
  | { type: "list"; ordered?: boolean; items: string[] }
  | { type: "callout"; title: string; text: string }
  | { type: "table"; head: string[]; rows: string[][] }
  | { type: "quote"; text: string; attribution: string };

export type Article = {
  slug: string;
  title: string;
  summary: string;
  topic: string;
  author: string;
  authorRole: string;
  publishedOn: string;
  publishedLabel: string;
  readingMinutes: number;
  views: string;
  tags: string[];
  featured?: boolean;
  keyTakeaways: string[];
  body: ArticleBlock[];
};

export type Short = {
  id: string;
  title: string;
  preview: string;
  detail: string;
  topic: string;
  source: string;
};

export type CalculatorField = {
  name: string;
  label: string;
  hint?: string;
  kind: "number" | "currency" | "percent" | "select" | "toggle";
  defaultValue: number | string | boolean;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
  options?: { label: string; value: string }[];
};

export type CalculatorResultLine = {
  label: string;
  value: string;
  emphasis?: boolean;
  hint?: string;
};

export type CalculatorOutput = {
  headline: { label: string; value: string; caption?: string };
  lines: CalculatorResultLine[];
  breakdown?: { label: string; value: number }[];
  note?: string;
};

export type Calculator = {
  slug: string;
  title: string;
  description: string;
  icon: string;
  group: string;
  basis: string;
  fields: CalculatorField[];
  compute: (values: Record<string, string>) => CalculatorOutput;
};

export type DueDate = {
  id: string;
  date: string;
  dateLabel: string;
  month: string;
  authority: string;
  form: string;
  title: string;
  applicableTo: string;
  penalty: string;
};

export type Update = {
  id: string;
  date: string;
  dateLabel: string;
  authority: string;
  reference: string;
  title: string;
  summary: string;
  impact: "Action required" | "Plan ahead" | "For information";
  detail: string[];
  actions: string[];
  source?: string;
};

export type UtilityKey =
  | "pdf-merge"
  | "pdf-split"
  | "image-compress"
  | "qr-generator"
  | "uuid"
  | "json-format"
  | "base64"
  | "password"
  | "slug"
  | "timestamp"
  | "color"
  | "regex"
  | "pan-validator"
  | "gstin-validator"
  | "ifsc-format"
  | "word-count"
  | "case-convert"
  | "number-to-words";

export type Utility = {
  key: UtilityKey;
  title: string;
  description: string;
  icon: string;
  group: string;
};

export type ExternalLink = {
  id: string;
  title: string;
  description: string;
  group: string;
  href: string;
  icon: string;
};

export type ActSection = { heading: string; text: string };

export type Act = {
  slug: string;
  title: string;
  shortName: string;
  summary: string;
  status: "In force" | "Amended" | "Draft";
  authority: string;
  lastUpdated: string;
  appliesTo: string;
  keySections: ActSection[];
  penalties: string;
  source: string;
};

export type StatutoryForm = {
  slug: string;
  title: string;
  code: string;
  description: string;
  group: string;
  authority: string;
  icon: string;
  fee: string;
  timeline: string;
  purpose: string;
  eligibility: string[];
  documents: string[];
  process: string[];
  notes: string[];
};

export type SearchRecord = {
  id: string;
  title: string;
  description: string;
  category: ContentCategory;
  keywords: string;
  action:
    | { type: "link"; href: string; external?: boolean }
    | { type: "calculator"; slug: string }
    | { type: "utility"; key: UtilityKey }
    | { type: "act"; slug: string }
    | { type: "form"; slug: string }
    | { type: "update"; id: string };
};
