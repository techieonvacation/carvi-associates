import Link from "next/link";
import { SectionShell, Tag } from "./insight-ui";
import { ACTS, type ActItem } from "./data";

function statusTone(status: ActItem["status"]) {
  if (status === "In Force") return "accent" as const;
  if (status === "Amended") return "primary" as const;
  return "muted" as const;
}

/**
 * Acts & Rules — reference data with three consistent attributes per row, so
 * it is a table on desktop where the columns let you compare status and
 * currency at a glance, and stacked cards below `md` where a table would
 * either overflow or shrink the text past legibility.
 */
export function ActsSection({ index }: { index: number }) {
  return (
    <SectionShell
      id="acts"
      index={index}
      title="Acts & rules"
      lede="Statutes and guidelines cited across our advisory and audit work."
      count={`${ACTS.length} entries`}
    >
      <div className="hidden overflow-hidden rounded-xl border border-border/70 md:block">
        <table className="w-full border-collapse text-left">
          <caption className="sr-only">
            Acts and rules with current status and last revision date
          </caption>
          <thead>
            <tr className="border-b border-border/60 bg-secondary/40">
              <th scope="col" className="px-5 py-3">
                <span className="font-heading text-[11px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                  Act or rule
                </span>
              </th>
              <th scope="col" className="w-32 px-5 py-3">
                <span className="font-heading text-[11px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                  Status
                </span>
              </th>
              <th scope="col" className="w-36 px-5 py-3">
                <span className="font-heading text-[11px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                  Updated
                </span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {ACTS.map((item) => (
              <tr key={item.id} className="group align-top transition-colors hover:bg-secondary/25">
                <th scope="row" className="px-5 py-4 font-normal">
                  <Link
                    href={item.href}
                    className="font-heading text-[0.9375rem] font-bold text-foreground group-hover:text-accent"
                  >
                    {item.title}
                  </Link>
                  <span className="mt-1.5 block max-w-xl text-[13px] leading-relaxed text-muted-foreground">
                    {item.summary}
                  </span>
                </th>
                <td className="px-5 py-4">
                  <Tag tone={statusTone(item.status)}>{item.status}</Tag>
                </td>
                <td className="px-5 py-4 text-[13px] text-muted-foreground tabular-nums">
                  {item.lastUpdated}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="grid gap-3 md:hidden">
        {ACTS.map((item) => (
          <li key={item.id} className="rounded-xl border border-border/70 bg-card px-4 py-4">
            <div className="flex flex-wrap items-center gap-2">
              <Tag tone={statusTone(item.status)}>{item.status}</Tag>
              <span className="text-xs text-muted-foreground tabular-nums">
                Updated {item.lastUpdated}
              </span>
            </div>
            <h3 className="mt-2.5 font-heading text-[0.9375rem] leading-snug font-bold text-foreground">
              <Link href={item.href}>{item.title}</Link>
            </h3>
            <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
              {item.summary}
            </p>
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}
