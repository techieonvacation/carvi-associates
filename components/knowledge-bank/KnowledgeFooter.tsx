import { LAST_UPDATED, TOTAL_RESOURCES } from "./data";

export function KnowledgeFooter() {
  return (
    <footer className="mt-8 border-t border-border/70 py-8">
      <div className="flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p className="font-heading text-base font-semibold text-foreground">
          Insights · Knowledge Bank
        </p>
        <p>
          Last Updated{" "}
          <span className="font-medium text-foreground">{LAST_UPDATED}</span>
        </p>
        <p>
          Total Resources{" "}
          <span className="font-medium text-foreground">{TOTAL_RESOURCES}</span>
        </p>
      </div>
    </footer>
  );
}
