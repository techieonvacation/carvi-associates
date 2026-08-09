import { Download } from "lucide-react";
import { KnowledgeIcon } from "./icons";
import { IconFrame, SectionShell } from "./insight-ui";
import { FORMS } from "./data";

/**
 * Forms — a download list. The action sits on the right of every row at the
 * same position, so a visitor who wants three forms clicks the same spot three
 * times instead of hunting a differently-placed button in each card.
 */
export function FormsSection({ index }: { index: number }) {
  return (
    <SectionShell
      id="forms"
      index={index}
      title="Forms"
      lede="Statutory and registration packs, ready to fill and file."
      count={`${FORMS.length} downloads`}
    >
      <ul className="divide-y divide-border/60 overflow-hidden rounded-xl border border-border/70">
        {FORMS.map((item) => (
          <li
            key={item.id}
            className="flex flex-col gap-3 bg-card px-4 py-4 transition-colors hover:bg-secondary/25 sm:flex-row sm:items-center sm:gap-4 sm:px-5"
          >
            <IconFrame>
              <KnowledgeIcon name={item.icon} className="size-4.5" />
            </IconFrame>
            <div className="min-w-0 flex-1">
              <h3 className="font-heading text-[0.9375rem] font-bold text-foreground">
                {item.title}
              </h3>
              <p className="mt-0.5 text-[13px] leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </div>
            <a
              href={item.href}
              download
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-border/70 bg-secondary/60 px-3.5 py-2 text-[13px] font-semibold text-foreground transition-colors hover:border-accent hover:bg-accent hover:text-accent-foreground focus-visible:ring-[3px] focus-visible:ring-ring/35 focus-visible:outline-none"
            >
              <Download className="size-3.5" aria-hidden="true" />
              Download
              <span className="sr-only">{item.title}</span>
            </a>
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}
