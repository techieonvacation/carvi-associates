import Link from "next/link";
import { FindoxButton } from "@/components/site/FindoxButton";
import { KnowledgeIcon } from "./icons";
import {
  LAST_UPDATED,
  QUICK_ACCESS,
  TOTAL_RESOURCES,
  UPDATES,
  insightHref,
  type KnowledgeCategory,
} from "./data";
import { cn } from "@/lib/utils";

function Widget({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[20px] border border-border bg-white p-7.5 max-sm:p-5">
      <h3 className="insight-widget__title relative mb-6.5 pb-4 font-heading text-[22px] leading-tight font-bold text-foreground">
        {title}
      </h3>
      {children}
    </section>
  );
}

export function InsightSidebar({ filter }: { filter: KnowledgeCategory }) {
  return (
    <aside className="flex flex-col gap-7.5" aria-label="Knowledge Bank sidebar">
      <Widget title="Browse the library">
        <ul className="m-0 flex list-none flex-col gap-1 p-0">
          <li>
            <Link
              href={insightHref("all")}
              scroll={false}
              aria-current={filter === "all" ? "page" : undefined}
              className={cn(
                "flex items-center justify-between gap-3 rounded-[10px] px-4.5 py-3 text-base font-medium transition-all duration-500",
                filter === "all"
                  ? "bg-accent text-white"
                  : "bg-secondary/40 text-muted-foreground hover:bg-accent hover:text-white",
              )}
            >
              <span className="truncate">All resources</span>
              <span className="shrink-0 text-sm opacity-70 tabular-nums">
                {TOTAL_RESOURCES}
              </span>
            </Link>
          </li>
          {QUICK_ACCESS.map((item) => {
            const active = filter === item.id;
            return (
              <li key={item.id}>
                <Link
                  href={item.href}
                  scroll={false}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center justify-between gap-3 rounded-[10px] px-4.5 py-3 text-base font-medium transition-all duration-500",
                    active
                      ? "bg-accent text-white"
                      : "bg-secondary/40 text-muted-foreground hover:bg-accent hover:text-white",
                  )}
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <KnowledgeIcon name={item.icon} className="size-4.5 shrink-0" />
                    <span className="truncate">{item.title}</span>
                  </span>
                  <span className="shrink-0 text-sm opacity-70 tabular-nums">
                    {item.count}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </Widget>

      <Widget title="Latest updates">
        <ul className="m-0 flex list-none flex-col gap-5.5 p-0">
          {UPDATES.slice(0, 4).map((item) => (
            <li key={item.id}>
              <p className="mb-1.5 flex items-center gap-2 text-sm text-muted-foreground">
                <i className="icon-calendar text-xs text-accent" aria-hidden="true" />
                <time dateTime={item.date}>{item.date}</time>
              </p>
              <h4 className="text-base leading-[1.45] font-bold text-foreground">
                <Link
                  href={insightHref("updates")}
                  scroll={false}
                  className="transition-colors duration-500 hover:text-accent"
                >
                  {item.title}
                </Link>
              </h4>
            </li>
          ))}
        </ul>
        <p className="mt-6.5 border-t border-border/60 pt-5 text-sm text-muted-foreground">
          Library last updated{" "}
          <span className="font-medium text-foreground">{LAST_UPDATED}</span>
        </p>
      </Widget>

      <section className="insight-widget-cta relative overflow-hidden rounded-[20px] bg-accent px-7.5 py-10 text-center max-sm:px-5">
        <div className="relative z-1">
          <span className="mb-5 inline-flex size-15 items-center justify-center rounded-full bg-primary text-[26px] text-accent">
            <i className="icon-phone-call" aria-hidden="true" />
          </span>
          <h3 className="mb-3 font-heading text-[24px] leading-[1.3] font-bold text-white">
            Can&apos;t find what you need?
          </h3>
          <p className="mb-6.5 text-base leading-relaxed text-white/80">
            Tell us what you are looking for and our team will prepare it for you.
          </p>
          <FindoxButton href="/#contact" text="Ask our team" />
        </div>
      </section>
    </aside>
  );
}
