import Link from "next/link";
import { KnowledgeIcon } from "./icons";
import { IconBadge, SectionShell, insightCard } from "./insight-ui";
import { UTILITIES } from "./data";
import { cn } from "@/lib/utils";

export function UtilitiesSection() {
  return (
    <SectionShell
      id="utilities"
      tagline="Utilities"
      title="Small tools that save an hour"
      lede="Document, data, and formatting helpers — no sign-in required and nothing is stored."
      count={`${UTILITIES.length} tools`}
    >
      <ul className="m-0 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2">
        {UTILITIES.map((item) => (
          <li key={item.id}>
            <Link
              href={item.href}
              className={cn(
                insightCard,
                "group flex h-full items-start gap-4 p-5 max-sm:p-4.5",
              )}
            >
              <IconBadge className="size-11">
                <KnowledgeIcon name={item.icon} className="size-5" />
              </IconBadge>
              <span className="min-w-0">
                <span className="block font-heading text-[17px] leading-snug font-bold text-foreground transition-colors duration-500 group-hover:text-accent">
                  {item.title}
                </span>
                <span className="mt-1.5 block text-sm leading-[1.6] text-muted-foreground">
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
