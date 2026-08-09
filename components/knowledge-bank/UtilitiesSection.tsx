import Link from "next/link";
import { KnowledgeIcon } from "./icons";
import { SectionShell } from "./insight-ui";
import { UTILITIES } from "./data";

/**
 * Utilities — many small single-purpose tools, so density is the right answer.
 * Compact tiles with the icon inline against the label; three or four per row
 * so the whole set is visible without scrolling past it.
 */
export function UtilitiesSection({ index }: { index: number }) {
  return (
    <SectionShell
      id="utilities"
      index={index}
      title="Utilities"
      lede="Small tools for documents, data, and formatting — no sign-in, nothing stored."
      count={`${UTILITIES.length} tools`}
    >
      <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {UTILITIES.map((item) => (
          <li key={item.id}>
            <Link
              href={item.href}
              className="group flex h-full items-start gap-3 rounded-lg border border-border/70 bg-card px-3.5 py-3 transition-colors hover:border-accent/45 hover:bg-secondary/30 focus-visible:ring-[3px] focus-visible:ring-ring/35 focus-visible:outline-none"
            >
              <KnowledgeIcon
                name={item.icon}
                className="mt-0.5 size-4 shrink-0 text-accent"
              />
              <span className="min-w-0">
                <span className="block font-heading text-sm font-bold text-foreground group-hover:text-accent">
                  {item.title}
                </span>
                <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">
                  {item.description}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}
