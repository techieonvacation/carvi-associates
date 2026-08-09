import type { Metadata } from "next";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import {
  InsightPage,
  parseInsightFilter,
  categoryLabel,
} from "@/components/knowledge-bank";
import { getSiteContent } from "@/lib/cms/queries";

export const dynamic = "force-dynamic";

type InsightRouteProps = {
  searchParams: Promise<{ filter?: string }>;
};

export async function generateMetadata({
  searchParams,
}: InsightRouteProps): Promise<Metadata> {
  const params = await searchParams;
  const filter = parseInsightFilter(params.filter);
  const label = categoryLabel(filter);

  return {
    title: `${label} | Knowledge Bank | Carvi Associates`,
    description:
      "Browse insights, shorts, calculators, updates, utilities, links, acts, and forms from Carvi Associates.",
  };
}

export default async function InsightRoute({ searchParams }: InsightRouteProps) {
  const [content, params] = await Promise.all([
    getSiteContent(),
    searchParams,
  ]);
  const filter = parseInsightFilter(params.filter);

  return (
    /*
     * `findox-scope` wraps only the marketing header and footer. The Knowledge
     * Bank itself is built on the shadcn tokens, and findox.css declares
     * `.findox-scope a { color }` unlayered — which outranks every layered
     * Tailwind text colour and would repaint the whole library olive.
     */
    <div className="page-wrapper">
      <div className="findox-scope findox-header-inflow">
        <Header
          navItems={content.navItems}
          socialLinks={content.socialLinks}
          topbar={content.topbar}
          header={content.header}
        />
      </div>
      <main>
        <InsightPage initialFilter={filter} />
      </main>
      <div className="findox-scope">
        <Footer footer={content.footer} />
      </div>
    </div>
  );
}
