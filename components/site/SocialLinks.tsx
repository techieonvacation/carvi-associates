import { cn } from "@/lib/utils";
import { BRAND_ICONS } from "./brand-icons";

type Social = { label: string; href: string; icon: string };

export function SocialLinks({
  socials,
  className,
}: {
  socials: Social[];
  className?: string;
}) {
  return (
    <div className={cn("social-links", className)}>
      {socials.map((s) => (
        <a
          key={s.label}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={s.label}
        >
          <span className="social-links__icon">{BRAND_ICONS[s.icon]}</span>
        </a>
      ))}
    </div>
  );
}
