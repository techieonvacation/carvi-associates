export type KnowledgeCategory =
  | "all"
  | "insights"
  | "shorts"
  | "calculators"
  | "updates"
  | "utilities"
  | "links"
  | "acts"
  | "forms";

export type FilterChip = {
  id: KnowledgeCategory;
  label: string;
};

export type SidebarItem = {
  id: string;
  label: string;
  href: string;
};

export type StatItem = {
  id: string;
  label: string;
  value: number;
  suffix: string;
};

export type QuickAccessItem = {
  id: string;
  title: string;
  description: string;
  href: string;
  count: number;
  icon: string;
};

export type FeaturedItem = {
  id: string;
  category: string;
  categoryKey: Exclude<KnowledgeCategory, "all">;
  title: string;
  description: string;
  meta: string;
  href: string;
  accent: "primary" | "accent" | "secondary";
};

export type InsightItem = {
  id: string;
  title: string;
  summary: string;
  category: string;
  readingTime: string;
  views: string;
  cover: string;
  href: string;
};

export type ShortItem = {
  id: string;
  title: string;
  preview: string;
  category: string;
  href: string;
};

export type CalculatorItem = {
  id: string;
  title: string;
  description: string;
  icon: string;
  href: string;
  comingSoon?: boolean;
};

export type UpdateItem = {
  id: string;
  date: string;
  badge: string;
  title: string;
  summary: string;
};

export type UtilityItem = {
  id: string;
  title: string;
  description: string;
  icon: string;
  href: string;
};

export type LinkItem = {
  id: string;
  title: string;
  description: string;
  category: string;
  href: string;
  icon: string;
};

export type ActItem = {
  id: string;
  title: string;
  summary: string;
  status: "In Force" | "Amended" | "Draft";
  lastUpdated: string;
  href: string;
};

export type FormItem = {
  id: string;
  title: string;
  description: string;
  icon: string;
  href: string;
};

export type SearchableItem = {
  id: string;
  title: string;
  description: string;
  category: Exclude<KnowledgeCategory, "all">;
  href: string;
};

export const FILTER_CHIPS: FilterChip[] = [
  { id: "all", label: "All" },
  { id: "insights", label: "Insights" },
  { id: "shorts", label: "Shorts" },
  { id: "calculators", label: "Calculators" },
  { id: "updates", label: "Updates" },
  { id: "utilities", label: "Utilities" },
  { id: "links", label: "Links" },
  { id: "acts", label: "Acts" },
  { id: "forms", label: "Forms" },
];

const FILTER_ALIASES: Record<string, KnowledgeCategory> = {
  all: "all",
  insight: "insights",
  insights: "insights",
  shot: "shorts",
  short: "shorts",
  shorts: "shorts",
  calculator: "calculators",
  calculators: "calculators",
  update: "updates",
  updates: "updates",
  utility: "utilities",
  utilities: "utilities",
  link: "links",
  links: "links",
  act: "acts",
  acts: "acts",
  rules: "acts",
  "acts-rules": "acts",
  form: "forms",
  forms: "forms",
};

export function parseInsightFilter(
  value: string | null | undefined,
): KnowledgeCategory {
  if (!value) return "all";
  return FILTER_ALIASES[value.trim().toLowerCase()] ?? "all";
}

export function insightHref(filter: KnowledgeCategory = "all"): string {
  if (filter === "all") return "/insight";
  return `/insight?filter=${filter}`;
}

export function categoryLabel(filter: KnowledgeCategory): string {
  if (filter === "all") return "Insights";
  return FILTER_CHIPS.find((chip) => chip.id === filter)?.label ?? "Insights";
}

export const SIDEBAR_ITEMS: SidebarItem[] = [
  { id: "all", label: "All Categories", href: "/insight" },
  { id: "insights", label: "Insights", href: "/insight?filter=insights" },
  { id: "shorts", label: "Shorts", href: "/insight?filter=shorts" },
  { id: "calculators", label: "Calculators", href: "/insight?filter=calculators" },
  { id: "updates", label: "Updates", href: "/insight?filter=updates" },
  { id: "utilities", label: "Utilities", href: "/insight?filter=utilities" },
  { id: "links", label: "Links", href: "/insight?filter=links" },
  { id: "acts", label: "Acts & Rules", href: "/insight?filter=acts" },
  { id: "forms", label: "Forms", href: "/insight?filter=forms" },
];

export const STATS: StatItem[] = [
  { id: "articles", label: "Knowledge Articles", value: 250, suffix: "+" },
  { id: "calculators", label: "Calculators", value: 20, suffix: "+" },
  { id: "utilities", label: "Utilities", value: 45, suffix: "+" },
  { id: "forms", label: "Forms", value: 150, suffix: "+" },
  { id: "acts", label: "Rules & Acts", value: 80, suffix: "+" },
  { id: "updated", label: "Updated This Month", value: 34, suffix: "" },
];

export const QUICK_ACCESS: QuickAccessItem[] = [
  {
    id: "insights",
    title: "Insights",
    description:
      "Business insights, market research, AI trends and strategic articles.",
    href: "/insight?filter=insights",
    count: 128,
    icon: "lightbulb",
  },
  {
    id: "shorts",
    title: "Shorts",
    description: "Bite-sized learnings you can absorb in under a minute.",
    href: "/insight?filter=shorts",
    count: 64,
    icon: "zap",
  },
  {
    id: "calculators",
    title: "Calculators",
    description: "Financial and compliance calculators for everyday decisions.",
    href: "/insight?filter=calculators",
    count: 22,
    icon: "calculator",
  },
  {
    id: "updates",
    title: "Updates",
    description: "Government, business, startup, and tax updates — curated.",
    href: "/insight?filter=updates",
    count: 86,
    icon: "bell",
  },
  {
    id: "utilities",
    title: "Utilities",
    description: "Useful online tools for documents, data, and workflows.",
    href: "/insight?filter=utilities",
    count: 45,
    icon: "wrench",
  },
  {
    id: "links",
    title: "Links",
    description: "Important government and business portals in one place.",
    href: "/insight?filter=links",
    count: 52,
    icon: "link",
  },
  {
    id: "acts",
    title: "Acts & Rules",
    description: "Legal resources, statutes, and regulatory guidelines.",
    href: "/insight?filter=acts",
    count: 80,
    icon: "scale",
  },
  {
    id: "forms",
    title: "Forms",
    description: "Downloadable registration and compliance forms.",
    href: "/insight?filter=forms",
    count: 150,
    icon: "file",
  },
];

export const FEATURED: FeaturedItem[] = [
  {
    id: "feat-1",
    category: "Latest Insight",
    categoryKey: "insights",
    title: "How Indian startups are structuring for Series A in 2026",
    description:
      "Cap tables, ESOP pools, and compliance checkpoints founders should lock before diligence begins.",
    meta: "12 min read · Strategy",
    href: "/insight?filter=insights",
    accent: "accent",
  },
  {
    id: "feat-2",
    category: "Trending Calculator",
    categoryKey: "calculators",
    title: "GST Payment Calculator",
    description:
      "Estimate outward liability, input credit, and net payable across CGST, SGST, and IGST.",
    meta: "Most used this week",
    href: "/insight?filter=calculators",
    accent: "primary",
  },
  {
    id: "feat-3",
    category: "Recently Updated Rule",
    categoryKey: "acts",
    title: "Companies Act — Related Party Transactions",
    description:
      "Updated thresholds and board approval pathways for mid-market private companies.",
    meta: "Updated 4 days ago",
    href: "/insight?filter=acts",
    accent: "secondary",
  },
  {
    id: "feat-4",
    category: "Most Used Utility",
    categoryKey: "utilities",
    title: "PDF Merger",
    description:
      "Combine filings, invoices, and annexures into a single share-ready document in seconds.",
    meta: "45k+ uses",
    href: "/insight?filter=utilities",
    accent: "accent",
  },
];

export const INSIGHTS: InsightItem[] = [
  {
    id: "ins-1",
    title: "Market Research Playbook for Mid-Market Firms",
    summary:
      "A practical framework to size markets, validate demand, and brief stakeholders without agency overhead.",
    category: "Market Research",
    readingTime: "8 min",
    views: "4.2k",
    cover: "research",
    href: "#",
  },
  {
    id: "ins-2",
    title: "Startup Guides: From Idea to Incorporation",
    summary:
      "Entity choice, DPIIT recognition, banking, and the first 90 days of compliance hygiene.",
    category: "Startup Guides",
    readingTime: "11 min",
    views: "6.8k",
    cover: "startup",
    href: "#",
  },
  {
    id: "ins-3",
    title: "AI Trends Reshaping Finance Teams",
    summary:
      "Where automation creates leverage in close, audit prep, and management reporting — and where it does not.",
    category: "AI Trends",
    readingTime: "9 min",
    views: "5.1k",
    cover: "ai",
    href: "#",
  },
  {
    id: "ins-4",
    title: "Funding Narratives That Survive Diligence",
    summary:
      "How to present unit economics, cohort retention, and runway so investors trust the model.",
    category: "Funding",
    readingTime: "10 min",
    views: "3.9k",
    cover: "funding",
    href: "#",
  },
  {
    id: "ins-5",
    title: "Business Strategy for Multi-Entity Groups",
    summary:
      "Holding structures, shared services, and transfer pricing considerations for growing groups.",
    category: "Business Strategy",
    readingTime: "12 min",
    views: "2.7k",
    cover: "strategy",
    href: "#",
  },
  {
    id: "ins-6",
    title: "Growth Levers Without Burning Cash",
    summary:
      "Channel mix, pricing experiments, and operating cadence that protect margins while scaling.",
    category: "Growth",
    readingTime: "7 min",
    views: "4.5k",
    cover: "growth",
    href: "#",
  },
  {
    id: "ins-7",
    title: "Operations Excellence for Compliance-Heavy Teams",
    summary:
      "SOPs, ownership maps, and calendar systems that keep filings on time every quarter.",
    category: "Operations",
    readingTime: "8 min",
    views: "3.1k",
    cover: "ops",
    href: "#",
  },
  {
    id: "ins-8",
    title: "Technology Stack for Modern CA Practices",
    summary:
      "Tools that reduce rework across GST, audit workpapers, and client collaboration.",
    category: "Technology",
    readingTime: "6 min",
    views: "2.4k",
    cover: "tech",
    href: "#",
  },
];

export const SHORTS: ShortItem[] = [
  {
    id: "short-1",
    title: "ITC mismatch? Check GSTR-2B first",
    preview:
      "Before raising a vendor dispute, reconcile the invoice in GSTR-2B for the return period.",
    category: "GST",
    href: "#",
  },
  {
    id: "short-2",
    title: "DIN KYC due dates never sleep",
    preview:
      "Missed DIN eKYC can freeze director actions — set calendar reminders 30 days ahead.",
    category: "MCA",
    href: "#",
  },
  {
    id: "short-3",
    title: "TDS credit missing in Form 26AS",
    preview:
      "Ask the deductor for the challan details and map them against your PAN in TRACES.",
    category: "Income Tax",
    href: "#",
  },
  {
    id: "short-4",
    title: "ESOP pool before term sheet",
    preview:
      "Investors expect a refreshed option pool — negotiate it before valuation is locked.",
    category: "Startup",
    href: "#",
  },
  {
    id: "short-5",
    title: "MSME classification in 30 seconds",
    preview:
      "Investment and turnover thresholds decide micro, small, or medium — verify both.",
    category: "MSME",
    href: "#",
  },
  {
    id: "short-6",
    title: "PF wage ceiling still matters",
    preview:
      "Basic + DA structure affects statutory contributions even when CTC looks generous.",
    category: "Payroll",
    href: "#",
  },
];

export const CALCULATORS: CalculatorItem[] = [
  {
    id: "calc-1",
    title: "GST Payment Calculator",
    description: "Compute net GST payable after input tax credit.",
    icon: "receipt",
    href: "#",
  },
  {
    id: "calc-2",
    title: "Income Tax Calculator",
    description: "Estimate liability under old and new tax regimes.",
    icon: "landmark",
    href: "#",
  },
  {
    id: "calc-3",
    title: "Startup Cost Estimator",
    description: "Model incorporation, runway, and early operating costs.",
    icon: "rocket",
    href: "#",
  },
  {
    id: "calc-4",
    title: "MCA Fee Calculator",
    description: "Project company and LLP filing fees with urgency.",
    icon: "building",
    href: "#",
  },
  {
    id: "calc-5",
    title: "EMI Calculator",
    description: "Break down monthly EMIs across tenure and rate.",
    icon: "percent",
    href: "#",
  },
  {
    id: "calc-6",
    title: "Loan Calculator",
    description: "Compare principal, interest, and total repayment.",
    icon: "wallet",
    href: "#",
  },
  {
    id: "calc-7",
    title: "Salary Calculator",
    description: "Convert CTC to in-hand with statutory deductions.",
    icon: "banknote",
    href: "#",
  },
  {
    id: "calc-8",
    title: "ROI Calculator",
    description: "Measure return on investment across scenarios.",
    icon: "trending",
    href: "#",
  },
  {
    id: "calc-9",
    title: "Company Valuation Calculator",
    description: "Quick multiples-based valuation for planning rounds.",
    icon: "chart",
    href: "#",
    comingSoon: true,
  },
  {
    id: "calc-10",
    title: "Payroll Calculator",
    description: "Estimate payroll cost including PF, ESI, and PT.",
    icon: "users",
    href: "#",
    comingSoon: true,
  },
];

export const UPDATES: UpdateItem[] = [
  {
    id: "upd-1",
    date: "22 Jul 2026",
    badge: "Income Tax",
    title: "Income Tax Update — AIS reconciliation window extended",
    summary:
      "Taxpayers get additional time to respond to AIS mismatches before assessment notices are issued.",
  },
  {
    id: "upd-2",
    date: "18 Jul 2026",
    badge: "GST",
    title: "GST Notification — e-invoice threshold clarification",
    summary:
      "CBIC clarifies aggregation rules for multi-branch entities crossing the e-invoice turnover limit.",
  },
  {
    id: "upd-3",
    date: "14 Jul 2026",
    badge: "MCA",
    title: "MCA Circular — beneficial ownership disclosures",
    summary:
      "Companies must refresh SBO registers with updated verification trails for FY filings.",
  },
  {
    id: "upd-4",
    date: "09 Jul 2026",
    badge: "SEBI",
    title: "SEBI Update — related party disclosure formats",
    summary:
      "Listed entities receive revised annexures for quarterly related-party transaction reporting.",
  },
  {
    id: "upd-5",
    date: "05 Jul 2026",
    badge: "Startup India",
    title: "Startup India — recognition certificate workflow refresh",
    summary:
      "DPIIT portal updates document checklist and turnaround guidance for new applications.",
  },
  {
    id: "upd-6",
    date: "01 Jul 2026",
    badge: "DPIIT",
    title: "DPIIT — FDI reporting reminder for Q1",
    summary:
      "Companies with foreign investment reminded to complete FC-GPR / LLPs filings on time.",
  },
  {
    id: "upd-7",
    date: "28 Jun 2026",
    badge: "AI Regulation",
    title: "AI Regulation — draft compliance note for advisors",
    summary:
      "MeitY consultative paper outlines documentation expectations for AI-enabled financial tools.",
  },
];

export const UTILITIES: UtilityItem[] = [
  {
    id: "util-1",
    title: "PDF Merger",
    description: "Combine multiple PDFs into one clean file.",
    icon: "merge",
    href: "#",
  },
  {
    id: "util-2",
    title: "PDF Splitter",
    description: "Extract pages or split large filings quickly.",
    icon: "split",
    href: "#",
  },
  {
    id: "util-3",
    title: "Image Compressor",
    description: "Reduce image size while keeping clarity.",
    icon: "image",
    href: "#",
  },
  {
    id: "util-4",
    title: "QR Generator",
    description: "Create QR codes for links, UPI, and docs.",
    icon: "qr",
    href: "#",
  },
  {
    id: "util-5",
    title: "UUID Generator",
    description: "Generate unique IDs for systems and tests.",
    icon: "hash",
    href: "#",
  },
  {
    id: "util-6",
    title: "JSON Formatter",
    description: "Pretty-print and validate JSON payloads.",
    icon: "braces",
    href: "#",
  },
  {
    id: "util-7",
    title: "Base64 Encoder",
    description: "Encode or decode Base64 strings safely.",
    icon: "binary",
    href: "#",
  },
  {
    id: "util-8",
    title: "Password Generator",
    description: "Create strong passwords with clear entropy.",
    icon: "key",
    href: "#",
  },
  {
    id: "util-9",
    title: "Slug Generator",
    description: "Turn titles into URL-safe slugs instantly.",
    icon: "text",
    href: "#",
  },
  {
    id: "util-10",
    title: "Timestamp Converter",
    description: "Convert Unix time to readable dates.",
    icon: "clock",
    href: "#",
  },
  {
    id: "util-11",
    title: "Color Converter",
    description: "Switch between HEX, RGB, and HSL values.",
    icon: "palette",
    href: "#",
  },
  {
    id: "util-12",
    title: "Regex Tester",
    description: "Test patterns against sample strings live.",
    icon: "regex",
    href: "#",
  },
];

export const LINKS: LinkItem[] = [
  {
    id: "link-1",
    title: "Income Tax e-Filing",
    description: "File returns, respond to notices, and view AIS.",
    category: "Government",
    href: "https://www.incometax.gov.in",
    icon: "landmark",
  },
  {
    id: "link-2",
    title: "GST Portal",
    description: "Returns, e-way bills, and registration services.",
    category: "Tax",
    href: "https://www.gst.gov.in",
    icon: "receipt",
  },
  {
    id: "link-3",
    title: "MCA21",
    description: "Company filings, DIN services, and public search.",
    category: "Legal",
    href: "https://www.mca.gov.in",
    icon: "building",
  },
  {
    id: "link-4",
    title: "Startup India",
    description: "Recognition, schemes, and founder resources.",
    category: "Startup",
    href: "https://www.startupindia.gov.in",
    icon: "rocket",
  },
  {
    id: "link-5",
    title: "RBI",
    description: "Circulars, FDI norms, and financial regulations.",
    category: "Finance",
    href: "https://www.rbi.org.in",
    icon: "wallet",
  },
  {
    id: "link-6",
    title: "MeitY",
    description: "Digital policy, AI guidance, and IT frameworks.",
    category: "Technology",
    href: "https://www.meity.gov.in",
    icon: "cpu",
  },
  {
    id: "link-7",
    title: "EPFO",
    description: "Provident fund compliance and member services.",
    category: "Government",
    href: "https://www.epfindia.gov.in",
    icon: "users",
  },
  {
    id: "link-8",
    title: "SEBI",
    description: "Capital markets regulations and circulars.",
    category: "Finance",
    href: "https://www.sebi.gov.in",
    icon: "chart",
  },
];

export const ACTS: ActItem[] = [
  {
    id: "act-1",
    title: "Companies Act",
    summary:
      "Core statute governing incorporation, governance, and filings for companies in India.",
    status: "In Force",
    lastUpdated: "12 Jun 2026",
    href: "#",
  },
  {
    id: "act-2",
    title: "Income Tax Act",
    summary:
      "Direct tax framework covering assessment, deductions, TDS, and dispute resolution.",
    status: "Amended",
    lastUpdated: "01 Apr 2026",
    href: "#",
  },
  {
    id: "act-3",
    title: "GST Act",
    summary:
      "Indirect tax law for supply of goods and services across CGST, SGST, and IGST.",
    status: "Amended",
    lastUpdated: "18 Jul 2026",
    href: "#",
  },
  {
    id: "act-4",
    title: "Labour Code",
    summary:
      "Consolidated labour reforms spanning wages, social security, and industrial relations.",
    status: "Draft",
    lastUpdated: "20 May 2026",
    href: "#",
  },
  {
    id: "act-5",
    title: "Startup India Guidelines",
    summary:
      "Eligibility, recognition benefits, and compliance expectations for DPIIT startups.",
    status: "In Force",
    lastUpdated: "05 Jul 2026",
    href: "#",
  },
  {
    id: "act-6",
    title: "DPDP Act",
    summary:
      "Data protection obligations for organizations processing personal digital data.",
    status: "In Force",
    lastUpdated: "11 Mar 2026",
    href: "#",
  },
  {
    id: "act-7",
    title: "MSME Act",
    summary:
      "Classification, delayed payment protections, and facilitation for micro & small enterprises.",
    status: "In Force",
    lastUpdated: "09 Feb 2026",
    href: "#",
  },
  {
    id: "act-8",
    title: "IT Act",
    summary:
      "Legal framework for electronic commerce, cyber offences, and intermediary duties.",
    status: "Amended",
    lastUpdated: "30 Jan 2026",
    href: "#",
  },
  {
    id: "act-9",
    title: "Data Protection Rules",
    summary:
      "Operational rules supporting consent, retention, and cross-border transfer controls.",
    status: "Draft",
    lastUpdated: "28 Jun 2026",
    href: "#",
  },
];

export const FORMS: FormItem[] = [
  {
    id: "form-1",
    title: "GST Registration",
    description: "Application pack for new GST registration.",
    icon: "file",
    href: "#",
  },
  {
    id: "form-2",
    title: "PAN Application",
    description: "Individual and entity PAN request checklist.",
    icon: "id",
    href: "#",
  },
  {
    id: "form-3",
    title: "TAN Application",
    description: "Tax deduction account number filing pack.",
    icon: "id",
    href: "#",
  },
  {
    id: "form-4",
    title: "DIN",
    description: "Director Identification Number forms & KYC.",
    icon: "user",
    href: "#",
  },
  {
    id: "form-5",
    title: "LLP Registration",
    description: "Incorporation documents for limited liability partnerships.",
    icon: "building",
    href: "#",
  },
  {
    id: "form-6",
    title: "MSME",
    description: "Udyam registration support documents.",
    icon: "briefcase",
    href: "#",
  },
  {
    id: "form-7",
    title: "Startup India",
    description: "DPIIT recognition application templates.",
    icon: "rocket",
    href: "#",
  },
  {
    id: "form-8",
    title: "Import Export Code",
    description: "IEC application and amendment forms.",
    icon: "globe",
    href: "#",
  },
  {
    id: "form-9",
    title: "EPFO",
    description: "PF registration and ECR-related templates.",
    icon: "users",
    href: "#",
  },
  {
    id: "form-10",
    title: "ESIC",
    description: "Employee state insurance registration pack.",
    icon: "heart",
    href: "#",
  },
];

export const LINK_CATEGORIES = [
  "Government",
  "Startup",
  "Legal",
  "Finance",
  "Tax",
  "Technology",
] as const;

export const SEARCH_INDEX: SearchableItem[] = [
  ...INSIGHTS.map((item) => ({
    id: item.id,
    title: item.title,
    description: item.summary,
    category: "insights" as const,
    href: item.href,
  })),
  ...SHORTS.map((item) => ({
    id: item.id,
    title: item.title,
    description: item.preview,
    category: "shorts" as const,
    href: item.href,
  })),
  ...CALCULATORS.map((item) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    category: "calculators" as const,
    href: item.href,
  })),
  ...UPDATES.map((item) => ({
    id: item.id,
    title: item.title,
    description: item.summary,
    category: "updates" as const,
    href: `#updates`,
  })),
  ...UTILITIES.map((item) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    category: "utilities" as const,
    href: item.href,
  })),
  ...LINKS.map((item) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    category: "links" as const,
    href: item.href,
  })),
  ...ACTS.map((item) => ({
    id: item.id,
    title: item.title,
    description: item.summary,
    category: "acts" as const,
    href: item.href,
  })),
  ...FORMS.map((item) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    category: "forms" as const,
    href: item.href,
  })),
];

export const TOTAL_RESOURCES =
  INSIGHTS.length +
  SHORTS.length +
  CALCULATORS.length +
  UPDATES.length +
  UTILITIES.length +
  LINKS.length +
  ACTS.length +
  FORMS.length;

export const LAST_UPDATED = "26 July 2026";
