"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { anchorHref, resolveAnchorId } from "@/lib/site-anchors";

const FALLBACK_OFFSET = 92;

export function scrollToAnchor(id: string): boolean {
  const target = document.getElementById(id);
  if (!target) return false;

  const sticky = document.querySelector(".sticky-header--clone");
  const offset =
    sticky instanceof HTMLElement && sticky.offsetHeight
      ? sticky.offsetHeight + 12
      : FALLBACK_OFFSET;
  const top = target.getBoundingClientRect().top + window.scrollY - offset;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  window.scrollTo({
    top: Math.max(0, top),
    behavior: reduceMotion ? "auto" : "smooth",
  });

  return true;
}

type SmartLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  external?: boolean;
  "aria-label"?: string;
};

export function SmartLink({
  href,
  children,
  className,
  onClick,
  external,
  ...rest
}: SmartLinkProps) {
  const pathname = usePathname();
  const anchorId = resolveAnchorId(href);
  const isHome = pathname === "/";

  function handleClick(event: React.MouseEvent<HTMLAnchorElement>) {
    if (anchorId && isHome) {
      if (scrollToAnchor(anchorId)) {
        event.preventDefault();
        window.history.replaceState(null, "", `#${anchorId}`);
      }
    }
    onClick?.();
  }

  return (
    <Link
      href={anchorId ? anchorHref(href) : href}
      className={className}
      onClick={handleClick}
      scroll={!anchorId}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...rest}
    >
      {children}
    </Link>
  );
}
