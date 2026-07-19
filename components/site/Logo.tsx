import Link from "next/link";
import { cn } from "@/lib/utils";

type LogoProps = {
  /** "light" for the white header bar, "dark" for the near-black mobile drawer. */
  tone?: "light" | "dark";
  onClick?: () => void;
  className?: string;
};

export function Logo({ tone = "light", onClick, className }: LogoProps) {
  return (
    <Link
      href="/"
      aria-label="Carvi Associates — home"
      onClick={onClick}
      className={cn("site-logo", `site-logo--${tone}`, className)}
    >
      <span className="site-logo__mark" aria-hidden="true">
        C
      </span>
      <span className="site-logo__type">
        <span className="site-logo__primary">Carvi</span>
        <span className="site-logo__secondary">Associates</span>
      </span>
    </Link>
  );
}
