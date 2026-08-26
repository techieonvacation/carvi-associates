import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { SiteLogo } from "@/lib/cms/types";

type LogoProps = {
  logo: SiteLogo;
  tone?: "light" | "dark";
  onClick?: () => void;
  className?: string;
};

export function Logo({ logo, tone = "light", onClick, className }: LogoProps) {
  const imageSrc =
    tone === "dark" ? logo.darkImageUrl || logo.imageUrl : logo.imageUrl;
  const showImage = logo.variant === "image" && Boolean(imageSrc);
  const primaryText = logo.primaryText.trim();
  const secondaryText = logo.secondaryText.trim();
  const hasText = Boolean(primaryText || secondaryText);

  const type = hasText ? (
    <span className="site-logo__type">
      {primaryText ? <span className="site-logo__primary">{primaryText}</span> : null}
      {secondaryText ? (
        <span className="site-logo__secondary">{secondaryText}</span>
      ) : null}
    </span>
  ) : null;

  return (
    <Link
      href={logo.href || "/"}
      aria-label={logo.alt}
      onClick={onClick}
      className={cn(
        "site-logo",
        `site-logo--${tone}`,
        showImage && "site-logo--image",
        className,
      )}
      style={
        {
          "--site-logo-desktop": `${logo.heightDesktop}px`,
          "--site-logo-mobile": `${logo.heightMobile}px`,
          "--site-logo-text": `${logo.textSizePx}px`,
        } as React.CSSProperties
      }
    >
      {showImage ? (
        <Image
          src={imageSrc}
          alt={logo.alt}
          width={480}
          height={160}
          priority
          className="site-logo__image"
        />
      ) : logo.showMark ? (
        <span className="site-logo__mark" aria-hidden="true">
          {logo.markText}
        </span>
      ) : null}
      {type}
    </Link>
  );
}
