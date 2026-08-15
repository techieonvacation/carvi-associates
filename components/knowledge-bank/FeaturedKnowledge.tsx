import Link from "next/link";
import { KnowledgeIcon } from "./icons";
import { ArrowButton, IconBadge, SectionShell, Tag, insightCard } from "./insight-ui";
import { FEATURED, QUICK_ACCESS } from "./data";
import { cn } from "@/lib/utils";

const ICON_BY_CATEGORY = Object.fromEntries(
  QUICK_ACCESS.map((item) => [item.id, item.icon]),
);

export function FeaturedKnowledge() {
  const [lead, ...rest] = FEATURED;
  if (!lead) return null;

  return (
    <SectionShell
      id="featured"
      tagline="Featured"
      title="Most opened this week"
      lede="The resources clients returned to most across the library over the last seven days."
    >
      <Link
        href={lead.href}
        scroll={false}
        className="insight-card group relative flex flex-col overflow-hidden rounded-[20px] bg-accent p-10 text-white max-md:p-7.5 max-sm:p-6"
      >
        <div
          className="insight-widget-cta absolute inset-0"
          aria-hidden="true"
        />
        <div className="relative z-1 flex flex-wrap items-start justify-between gap-6">
          <div className="max-w-2xl">
            <span className="inline-flex items-center rounded-full border border-white/30 bg-white/10 px-3.5 py-1 text-[13px] font-medium text-white">
              {lead.category}
            </span>
            <h3 className="mt-5 font-heading text-[28px] leading-[1.28] font-bold text-white max-md:text-[24px] max-sm:text-[21px]">
              {lead.title}
            </h3>
            <p className="mt-4 text-base leading-[1.75] text-white/80">
              {lead.description}
            </p>
            <p className="mt-6 font-heading text-[15px] font-medium text-primary">
              {lead.meta}
            </p>
          </div>
          <span
            className="inline-flex size-14 shrink-0 items-center justify-center rounded-full bg-primary text-accent transition-transform duration-500 group-hover:-translate-y-1"
            aria-hidden="true"
          >
            <i className="icon-arrow-right-up text-sm" />
          </span>
        </div>
      </Link>

      <ul className="m-0 mt-5 grid list-none gap-5 p-0 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((item) => (
          <li key={item.id}>
            <Link
              href={item.href}
              scroll={false}
              className={cn(insightCard, "group flex h-full flex-col p-6 max-sm:p-5")}
            >
              <div className="flex items-start justify-between gap-3">
                <IconBadge>
                  <KnowledgeIcon
                    name={ICON_BY_CATEGORY[item.categoryKey] ?? "file"}
                    className="size-5"
                  />
                </IconBadge>
                <ArrowButton className="size-9" />
              </div>
              <div className="mt-5">
                <Tag>{item.category}</Tag>
              </div>
              <h3 className="mt-3.5 font-heading text-[19px] leading-[1.35] font-bold text-foreground transition-colors duration-500 group-hover:text-accent">
                {item.title}
              </h3>
              <p className="mt-2.5 text-[15px] leading-[1.7] text-muted-foreground">
                {item.description}
              </p>
              <p className="mt-auto pt-5 text-sm font-medium text-accent">{item.meta}</p>
            </Link>
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}
