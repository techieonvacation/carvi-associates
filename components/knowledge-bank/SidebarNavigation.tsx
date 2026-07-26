"use client";

import Link from "next/link";
import { SIDEBAR_ITEMS, type KnowledgeCategory } from "./data";
import { cn } from "@/lib/utils";

export function SidebarNavigation({
  activeFilter,
}: {
  activeFilter: KnowledgeCategory;
}) {
  return (
    <nav
      aria-label="Insight categories"
      className="sticky top-28 hidden w-52 shrink-0 xl:block"
    >
      <div className="rounded-2xl border border-border/80 bg-card/90 p-3 shadow-[0_20px_50px_-36px_rgba(58,48,32,0.55)] backdrop-blur-sm">
        <p className="px-3 pt-1 pb-2 font-heading text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
          Categories
        </p>
        <ul className="space-y-1">
          {SIDEBAR_ITEMS.map((item) => {
            const isActive = activeFilter === item.id;
            return (
              <li key={item.id}>
                <Link
                  href={item.href}
                  scroll={false}
                  className={cn(
                    "relative flex items-center rounded-xl px-3 py-2 text-sm transition-colors",
                    isActive
                      ? "bg-accent/10 font-medium text-accent"
                      : "text-muted-foreground hover:bg-secondary/80 hover:text-foreground",
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  {isActive ? (
                    <span
                      className="absolute top-1/2 left-0 h-5 w-0.5 -translate-y-1/2 rounded-full bg-accent"
                      aria-hidden="true"
                    />
                  ) : null}
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
