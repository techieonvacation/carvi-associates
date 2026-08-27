import type { Metadata } from "next";
import { Container } from "@/components/site/Container";
import { PageJsonLd } from "@/components/seo/site-json-ld";
import { buildMetadata } from "@/lib/seo/metadata";
import {
  ActsSection,
  CalculatorsSection,
  CTASection,
  FeaturedKnowledge,
  FormsSection,
  InsightBanner,
  InsightExplorer,
  InsightSidebar,
  InsightStats,
  InsightsSection,
  LinksSection,
  ShortsSection,
  UpdatesSection,
  UtilitiesSection,
  categoryLabel,
  parseInsightFilter,
  type KnowledgeCategory,
} from "@/components/knowledge-bank";

type InsightRouteProps = {
  searchParams: Promise<{ filter?: string }>;
};

const INTROS: Record<KnowledgeCategory, string> = {
  all: "Reference material for founders, finance teams, and compliance staff — articles, calculators, statutory forms, acts, and the portals you file on.",
  insights: "Long-form analysis on funding, market structure, operations, and the technology reshaping finance teams.",
  shorts: "Single takeaways from our advisory desk, written to be read between meetings.",
  calculators: "Working models for the tax, payroll, and financing questions that come up every day.",
  updates: "Statutory and regulatory movement, summarised with the action it implies for your business.",
  utilities: "Document, data, and formatting tools — no sign-in required and nothing is stored.",
  links: "Official filing portals and primary sources, grouped by the authority that owns them.",
  acts: "Legislation and guidelines cited across our advisory, audit, and compliance work.",
  forms: "Registration and compliance packs with the checklists our team uses on every engagement.",
};

export async function generateMetadata({
  searchParams,
}: InsightRouteProps): Promise<Metadata> {
  const params = await searchParams;
  const filter = parseInsightFilter(params.filter);
  const label = categoryLabel(filter);
  const isRoot = filter === "all";

  return buildMetadata({
    path: "/insight",
    fallbackTitle: isRoot ? "Knowledge Bank" : `${label} | Knowledge Bank`,
    fallbackDescription: INTROS[filter],
    entity: {
      description: INTROS[filter],
      canonicalUrl: undefined,
      noIndex: !isRoot,
    },
  });
}

function sectionsFor(filter: KnowledgeCategory) {
  const showAll = filter === "all";

  return [
    showAll ? <FeaturedKnowledge key="featured" /> : null,
    showAll || filter === "insights" ? <InsightsSection key="insights" /> : null,
    showAll || filter === "shorts" ? <ShortsSection key="shorts" /> : null,
    showAll || filter === "calculators" ? <CalculatorsSection key="calculators" /> : null,
    showAll || filter === "updates" ? <UpdatesSection key="updates" /> : null,
    showAll || filter === "utilities" ? <UtilitiesSection key="utilities" /> : null,
    showAll || filter === "links" ? <LinksSection key="links" /> : null,
    showAll || filter === "acts" ? <ActsSection key="acts" /> : null,
    showAll || filter === "forms" ? <FormsSection key="forms" /> : null,
  ].filter(Boolean);
}

export default async function InsightRoute({ searchParams }: InsightRouteProps) {
  const params = await searchParams;
  const filter = parseInsightFilter(params.filter);
  const label = categoryLabel(filter);

  return (
    <>
      <PageJsonLd
        path="/insight"
        title={filter === "all" ? "Knowledge Bank" : label}
        description={INTROS[filter]}
        pageType="CollectionPage"
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Knowledge Bank", path: "/insight" },
        ]}
      />

      <InsightBanner
        tagline="Knowledge Bank"
        title={filter === "all" ? "Knowledge Bank" : label}
        intro={INTROS[filter]}
        crumbs={[
          { label: "Home", href: "/" },
          ...(filter === "all"
            ? [{ label: "Knowledge Bank" }]
            : [{ label: "Knowledge Bank", href: "/insight" }, { label }]),
        ]}
      />

      <InsightStats />

      <section className="py-30 max-md:py-25 max-sm:py-20">
        <Container>
          <InsightExplorer filter={filter} sidebar={<InsightSidebar filter={filter} />}>
            {sectionsFor(filter)}
            <CTASection />
          </InsightExplorer>
        </Container>
      </section>
    </>
  );
}
