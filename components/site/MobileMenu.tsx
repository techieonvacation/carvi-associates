"use client";

import { useState } from "react";
import { SmartLink } from "./SmartLink";
import { SocialLinks } from "./SocialLinks";
import { Logo } from "./Logo";
import type { PublicNavItem } from "./DesktopMenu";
import type { SiteLogo } from "@/lib/cms/types";

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
  items: PublicNavItem[];
  logo: SiteLogo;
  contact: {
    email: string;
    phone: string;
    phoneHref: string;
    address: string;
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
  logo,
  contact,
  socials,
}: MobileMenuProps) {
  const [expanded, setExpanded] = useState<string | null>(null);

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
          <Logo logo={logo} tone="dark" onClick={onClose} />
        </div>

        <div className="mobile-nav__container">
          <ul className="main-menu__list">
            {items.map((item) => {
              const hasChildren = !!item.children?.length;
              const isOpen = expanded === item.label;

              if (!hasChildren) {
                return (
                  <li key={item.label}>
                    <SmartLink href={item.href} onClick={onClose}>
                      {item.label}
                    </SmartLink>
                  </li>
                );
              }

              return (
                <li key={item.label} className="dropdown">
                  <div className="mobile-nav__row">
                    <SmartLink href={item.href} onClick={onClose}>
                      {item.label}
                    </SmartLink>
                    <button
                      type="button"
                      className={`mobile-nav__expander${isOpen ? " expanded" : ""}`}
                      aria-expanded={isOpen}
                      aria-label={`${isOpen ? "Collapse" : "Expand"} ${item.label}`}
                      onClick={() =>
                        setExpanded((current) =>
                          current === item.label ? null : item.label,
                        )
                      }
                    >
                      <i className="icon-down-arrow" aria-hidden="true" />
                    </button>
                  </div>
                  <ul className={isOpen ? "expanded" : undefined}>
                    {item.children!.map((child) => (
                      <li key={child.label}>
                        <SmartLink href={child.href} onClick={onClose}>
                          {child.label}
                        </SmartLink>
                      </li>
                    ))}
                  </ul>
                </li>
              );
            })}
          </ul>
        </div>

        <ul className="mobile-nav__contact">
          {contact.email ? (
            <li>
              <span className="mobile-nav__contact__icon">
                <i className="icon-email" aria-hidden="true" />
              </span>
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
            </li>
          ) : null}
          {contact.phone ? (
            <li>
              <span className="mobile-nav__contact__icon">
                <i className="icon-phone-call" aria-hidden="true" />
              </span>
              <a href={contact.phoneHref || `tel:${contact.phone.replace(/\s+/g, "")}`}>
                {contact.phone}
              </a>
            </li>
          ) : null}
          {contact.address ? (
            <li>
              <span className="mobile-nav__contact__icon">
                <i className="icon-location" aria-hidden="true" />
              </span>
              <span>{contact.address}</span>
            </li>
          ) : null}
        </ul>

        <SocialLinks socials={socials} />
      </div>
    </div>
  );
}
