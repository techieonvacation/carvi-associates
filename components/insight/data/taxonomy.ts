import type { ContentCategory, KnowledgeCategory } from "./types";

export type CategoryMeta = {
  id: KnowledgeCategory;
  label: string;
  shortLabel: string;
  icon: string;
  blurb: string;
  sectionId: string;
};

export const CATEGORIES: CategoryMeta[] = [
  {
    id: "all",
    label: "Everything",
    shortLabel: "All",
    icon: "library",
    blurb:
      "The complete Carvi Associates reference library — analysis, working tools, statutory dates, and the paperwork behind them.",
    sectionId: "featured",
  },
  {
    id: "insights",
    label: "Insights",
    shortLabel: "Insights",
    icon: "lightbulb",
    blurb:
      "Long-form analysis on tax positions, funding, audit readiness, and how finance teams actually operate.",
    sectionId: "insights",
  },
  {
    id: "shorts",
    label: "Shorts",
    shortLabel: "Shorts",
    icon: "zap",
    blurb: "One practical takeaway each, written to be read between meetings.",
    sectionId: "shorts",
  },
  {
    id: "calculators",
    label: "Calculators",
    shortLabel: "Calculators",
    icon: "calculator",
    blurb:
      "Working models for tax, payroll, valuation, and lending questions — every one computes live in your browser.",
    sectionId: "calculators",
  },
  {
    id: "calendar",
    label: "Compliance calendar",
    shortLabel: "Calendar",
    icon: "calendar",
    blurb:
      "Statutory due dates by month, with the form, who it applies to, and what late filing costs.",
    sectionId: "calendar",
  },
  {
    id: "updates",
    label: "Updates",
    shortLabel: "Updates",
    icon: "bell",
    blurb:
      "Notifications, circulars, and rule changes summarised with the action each one implies.",
    sectionId: "updates",
  },
  {
    id: "utilities",
    label: "Utilities",
    shortLabel: "Utilities",
    icon: "wrench",
    blurb:
      "Small document and data tools that run entirely on your device — nothing is uploaded or stored.",
    sectionId: "utilities",
  },
  {
    id: "links",
    label: "Important links",
    shortLabel: "Links",
    icon: "link",
    blurb: "Filing portals and official sources, grouped by the authority behind them.",
    sectionId: "links",
  },
  {
    id: "acts",
    label: "Acts & rules",
    shortLabel: "Acts",
    icon: "scale",
    blurb: "Statutes we cite across advisory and audit work, with the sections that matter.",
    sectionId: "acts",
  },
  {
    id: "forms",
    label: "Forms",
    shortLabel: "Forms",
    icon: "file",
    blurb:
      "Registration and compliance packs with document checklists you can download as a PDF.",
    sectionId: "forms",
  },
];

const ALIASES: Record<string, KnowledgeCategory> = {
  all: "all",
  everything: "all",
  insight: "insights",
  insights: "insights",
  article: "insights",
  articles: "insights",
  short: "shorts",
  shorts: "shorts",
  calculator: "calculators",
  calculators: "calculators",
  calendar: "calendar",
  "due-dates": "calendar",
  compliance: "calendar",
  update: "updates",
  updates: "updates",
  utility: "utilities",
  utilities: "utilities",
  tools: "utilities",
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
  return ALIASES[value.trim().toLowerCase()] ?? "all";
}

export function insightHref(filter: KnowledgeCategory = "all"): string {
  return filter === "all" ? "/insight" : `/insight?filter=${filter}`;
}

export function categoryMeta(filter: KnowledgeCategory): CategoryMeta {
  return CATEGORIES.find((entry) => entry.id === filter) ?? CATEGORIES[0];
}

export function categoryLabel(filter: KnowledgeCategory): string {
  return categoryMeta(filter).label;
}

export function contentCategoryLabel(category: ContentCategory): string {
  return categoryMeta(category).shortLabel;
}
