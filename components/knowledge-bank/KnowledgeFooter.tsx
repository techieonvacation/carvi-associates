import { Dot } from "./insight-ui";
import { LAST_UPDATED, TOTAL_RESOURCES } from "./data";

export function KnowledgeFooter() {
  return (
    <p className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-border/60 pt-6 text-[13px] text-muted-foreground">
      <span>
        <span className="font-medium text-foreground tabular-nums">
          {TOTAL_RESOURCES.toLocaleString("en-IN")}
        </span>{" "}
        entries in the library
      </span>
      <Dot />
      <span>
        last updated{" "}
        <span className="font-medium text-foreground">{LAST_UPDATED}</span>
      </span>
      <Dot />
      <span>Reference material only — not a substitute for formal advice.</span>
    </p>
  );
}
