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
    <div className="findox-scope page-wrapper">
      <Header
        navItems={content.navItems}
        socialLinks={content.socialLinks}
        topbar={content.topbar}
        header={content.header}
      />
      <main>
        <InsightPage initialFilter={filter} />
      </main>
      <Footer footer={content.footer} />
    </div>
  );
}
