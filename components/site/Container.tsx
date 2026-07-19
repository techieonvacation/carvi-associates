import { cn } from "@/lib/utils";

/** Shared page gutter/max-width — matches the 1200px findox-container used by the header/hero. */
export function Container({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-[1200px] px-4 sm:px-6", className)}>
      {children}
    </div>
  );
}
