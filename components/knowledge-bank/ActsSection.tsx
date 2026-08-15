import Link from "next/link";
import { SectionShell, Tag, insightCard } from "./insight-ui";
import { ACTS, type ActItem } from "./data";
import { cn } from "@/lib/utils";

function statusTone(status: ActItem["status"]) {
  if (status === "In Force") return "accent" as const;
  if (status === "Amended") return "primary" as const;
  return "muted" as const;
}

export function ActsSection() {
  return (
    <SectionShell
      id="acts"
      tagline="Acts & rules"
      title="The statutes we work from"
      lede="Legislation and guidelines cited across our advisory, audit, and compliance work."
      count={`${ACTS.length} entries`}
    >
      <div className="hidden overflow-hidden rounded-[20px] border border-border bg-white md:block">
        <table className="w-full border-collapse text-left">
          <caption className="sr-only">
            Acts and rules with current status and last revision date
          </caption>
          <thead>
            <tr className="bg-accent text-white">
              <th scope="col" className="px-7.5 py-4 font-heading text-[15px] font-semibold">
                Act or rule
              </th>
              <th scope="col" className="w-36 px-5 py-4 font-heading text-[15px] font-semibold">
                Status
              </th>
              <th scope="col" className="w-40 px-5 py-4 font-heading text-[15px] font-semibold">
                Updated
              </th>
            </tr>
          </thead>
          <tbody>
            {ACTS.map((item) => (
              <tr
                key={item.id}
                className="insight-row group border-t border-border/60 align-top hover:bg-secondary/30"
              >
                <th scope="row" className="px-7.5 py-5.5 font-normal">
                  <Link
                    href={item.href}
                    className="font-heading text-[17px] font-bold text-foreground transition-colors duration-500 group-hover:text-accent"
                  >
                    {item.title}
                  </Link>
                  <span className="mt-2 block max-w-xl text-[15px] leading-[1.7] text-muted-foreground">
                    {item.summary}
                  </span>
                </th>
                <td className="px-5 py-5.5">
                  <Tag tone={statusTone(item.status)}>{item.status}</Tag>
                </td>
                <td className="px-5 py-5.5 text-[15px] text-muted-foreground tabular-nums">
                  {item.lastUpdated}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="m-0 grid list-none gap-5 p-0 md:hidden">
        {ACTS.map((item) => (
          <li key={item.id}>
            <article className={cn(insightCard, "p-6 max-sm:p-5")}>
              <div className="flex flex-wrap items-center gap-3">
                <Tag tone={statusTone(item.status)}>{item.status}</Tag>
                <span className="text-sm text-muted-foreground tabular-nums">
                  Updated {item.lastUpdated}
                </span>
              </div>
              <h3 className="mt-4 font-heading text-[19px] leading-[1.35] font-bold text-foreground">
                <Link href={item.href} className="transition-colors duration-500 hover:text-accent">
                  {item.title}
                </Link>
              </h3>
              <p className="mt-2.5 text-[15px] leading-[1.7] text-muted-foreground">
                {item.summary}
              </p>
            </article>
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}
