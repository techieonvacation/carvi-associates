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
  const items = socials.filter((social) => BRAND_ICONS[social.icon]);

  if (!items.length) return null;

  return (
    <div className={cn("social-links", className)}>
      {items.map((social) => (
        <a
          key={`${social.icon}-${social.href}`}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={social.label}
        >
          <span className="social-links__icon">{BRAND_ICONS[social.icon]}</span>
        </a>
      ))}
    </div>
  );
}
