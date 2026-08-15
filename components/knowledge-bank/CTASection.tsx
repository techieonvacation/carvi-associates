import { FindoxButton } from "@/components/site/FindoxButton";
import { Dot } from "./insight-ui";
import { LAST_UPDATED, TOTAL_RESOURCES } from "./data";

export function CTASection() {
  return (
    <>
      <aside
        aria-labelledby="insight-help-title"
        className="mt-15 rounded-[20px] border border-border bg-secondary/40 p-10 max-md:mt-12.5 max-sm:p-6"
      >
        <div className="flex flex-wrap items-center justify-between gap-x-10 gap-y-6">
          <div className="min-w-0 max-w-xl">
            <h2
              id="insight-help-title"
              className="font-heading text-[24px] leading-[1.3] font-bold text-foreground max-sm:text-[21px]"
            >
              Looking for something that isn&apos;t here?
            </h2>
            <p className="mt-3 text-base leading-[1.75] text-muted-foreground">
              Tell us what you need and we&apos;ll point you to the right resource — or
              prepare it for you.
            </p>
          </div>
          <FindoxButton href="/#contact" text="Talk to our team" variant="base" />
        </div>
      </aside>

      <p className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm text-muted-foreground">
        <span>
          <span className="font-medium text-foreground tabular-nums">
            {TOTAL_RESOURCES.toLocaleString("en-IN")}
          </span>{" "}
          entries in the library
        </span>
        <Dot />
        <span>
          last updated <span className="font-medium text-foreground">{LAST_UPDATED}</span>
        </span>
        <Dot />
        <span>Reference material only — not a substitute for formal advice.</span>
      </p>
    </>
  );
}
