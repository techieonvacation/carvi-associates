import { KnowledgeIcon } from "./icons";
import { IconBadge, SectionShell } from "./insight-ui";
import { FORMS } from "./data";

export function FormsSection() {
  return (
    <SectionShell
      id="forms"
      tagline="Forms"
      title="Filled, checked, ready to file"
      lede="Registration and compliance packs with the checklists our team uses on every engagement."
      count={`${FORMS.length} downloads`}
    >
      <ul className="m-0 list-none overflow-hidden rounded-[20px] border border-border bg-white p-0">
        {FORMS.map((item) => (
          <li
            key={item.id}
            className="insight-row group flex flex-col gap-4 border-b border-border/60 p-6 last:border-b-0 hover:bg-secondary/30 sm:flex-row sm:items-center sm:gap-5 sm:px-7.5 max-sm:p-5"
          >
            <IconBadge>
              <KnowledgeIcon name={item.icon} className="size-5.5" />
            </IconBadge>
            <div className="min-w-0 flex-1">
              <h3 className="font-heading text-[17px] leading-snug font-bold text-foreground">
                {item.title}
              </h3>
              <p className="mt-1.5 text-[15px] leading-[1.6] text-muted-foreground">
                {item.description}
              </p>
            </div>
            <a
              href={item.href}
              download
              className="inline-flex shrink-0 items-center justify-center gap-2.5 border border-border px-5 py-[11px] font-heading text-[15px] font-semibold text-foreground transition-all duration-500 hover:border-accent hover:bg-accent hover:text-white max-sm:self-start"
            >
              <i className="icon-arrow-bottom text-[11px]" aria-hidden="true" />
              Download
              <span className="sr-only">{item.title}</span>
            </a>
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}
