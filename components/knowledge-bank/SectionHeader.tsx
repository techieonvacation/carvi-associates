import { SectionHeading } from "@/components/site/SectionHeading";
import { cn } from "@/lib/utils";

export function SectionHeader({
  tagline,
  title,
  description,
  align = "left",
  className,
}: {
  tagline: string;
  title: string | string[];
  description?: string;
  align?: "left" | "center";
  className?: string;
}) {
  const lines = Array.isArray(title) ? title : [title];

  return (
    <div className={cn("mb-10 md:mb-12", className)}>
      <SectionHeading
        tagline={tagline}
        lines={lines}
        align={align}
        taglineBg="var(--secondary)"
      />
      {description ? (
        <p
          className={cn(
            "mt-4 max-w-2xl text-base text-muted-foreground md:text-lg",
            align === "center" && "mx-auto text-center",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
