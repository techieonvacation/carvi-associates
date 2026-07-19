"use client";

import { useState } from "react";
import Link from "next/link";
import { MENU, CONTACT, SOCIALS, type NavLink } from "./nav-data";
import { SocialLinks } from "./SocialLinks";
import { Logo } from "./Logo";

function MobileNavItem({ item }: { item: NavLink }) {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = !!item.children?.length;

  return (
    <li>
      {hasChildren ? (
        <div className="mobile-nav__row">
          <Link href={item.href}>{item.label}</Link>
          <button
            type="button"
            className={`mobile-nav__expander${expanded ? " expanded" : ""}`}
            aria-label={`Toggle ${item.label} submenu`}
            aria-expanded={expanded}
            onClick={() => setExpanded((v) => !v)}
          >
            <i className="icon-arrow-right" aria-hidden="true" />
          </button>
        </div>
      ) : (
        <Link href={item.href}>{item.label}</Link>
      )}

      {hasChildren && (
        <ul className={expanded ? "expanded" : undefined}>
          {item.children!.map((child) => (
            <MobileNavItem key={child.label} item={child} />
          ))}
        </ul>
      )}
    </li>
  );
}

export function MobileMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <div className={`mobile-nav__wrapper${open ? " expanded" : ""}`}>
      <button
        type="button"
        className="mobile-nav__overlay"
        aria-label="Close menu"
        tabIndex={open ? 0 : -1}
        onClick={onClose}
      />
      <div className="mobile-nav__content">
        <button
          type="button"
          className="mobile-nav__close"
          aria-label="Close menu"
          onClick={onClose}
        >
          <i className="icon-close" aria-hidden="true" />
        </button>

        <div className="logo-box">
          <Logo tone="dark" onClick={onClose} />
        </div>

        <div className="mobile-nav__container">
          <ul className="main-menu__list">
            {MENU.map((item) => (
              <MobileNavItem key={item.label} item={item} />
            ))}
          </ul>
        </div>

        <ul className="mobile-nav__contact">
          <li>
            <span className="mobile-nav__contact__icon">
              <i className="icon-email" aria-hidden="true" />
            </span>
            <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
          </li>
          <li>
            <span className="mobile-nav__contact__icon">
              <i className="icon-location" aria-hidden="true" />
            </span>
            <a href={CONTACT.phoneHref}>{CONTACT.phone}</a>
          </li>
        </ul>

        <SocialLinks socials={SOCIALS} />
      </div>
    </div>
  );
}
