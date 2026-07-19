"use client";

import Link from "next/link";
import { SocialLinks } from "./SocialLinks";
import { Logo } from "./Logo";
import type { PublicNavItem } from "./DesktopMenu";

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
  items: PublicNavItem[];
  contact: {
    email: string;
    phone: string;
    phoneHref: string;
  };
  socials: Array<{
    label: string;
    href: string;
    icon: string;
  }>;
};

export function MobileMenu({
  open,
  onClose,
  items,
  contact,
  socials,
}: MobileMenuProps) {
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
            {items.map((item) => (
              <li key={item.label}>
                <Link href={item.href} onClick={onClose}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <ul className="mobile-nav__contact">
          <li>
            <span className="mobile-nav__contact__icon">
              <i className="icon-email" aria-hidden="true" />
            </span>
            <a href={`mailto:${contact.email}`}>{contact.email}</a>
          </li>
          <li>
            <span className="mobile-nav__contact__icon">
              <i className="icon-location" aria-hidden="true" />
            </span>
            <a href={contact.phoneHref}>{contact.phone}</a>
          </li>
        </ul>

        <SocialLinks socials={socials} />
      </div>
    </div>
  );
}
