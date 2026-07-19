"use client";

import { useEffect, useState } from "react";
import { Topbar } from "./Topbar";
import { DesktopMenu } from "./DesktopMenu";
import { MobileMenu } from "./MobileMenu";
import { SearchPopup } from "./SearchPopup";
import { FindoxButton } from "./FindoxButton";
import { Logo } from "./Logo";
import type { SiteContent } from "@/lib/cms/queries";

type HeaderProps = Pick<
  SiteContent,
  "navItems" | "socialLinks" | "topbar" | "header"
>;

function MainHeaderBar({
  onSearch,
  onMobile,
  navItems,
  contactCtaText,
  contactCtaHref,
}: {
  onSearch: () => void;
  onMobile: () => void;
  navItems: HeaderProps["navItems"];
  contactCtaText: string;
  contactCtaHref: string;
}) {
  const visibleItems = navItems
    .filter((item) => item.visible)
    .map((item) => ({ label: item.label, href: item.href }));

  return (
    <div className="findox-container">
      <div className="main-header__inner">
        <div className="main-header__logo logo-retina">
          <Logo tone="light" />
        </div>
        <div className="main-header__right">
          <nav className="main-header__nav main-menu" aria-label="Primary">
            <DesktopMenu items={visibleItems} />
          </nav>

          <button
            type="button"
            className="mobile-nav__btn mobile-nav__toggler"
            aria-label="Open menu"
            onClick={onMobile}
          >
            <span />
            <span />
            <span />
          </button>

          <button
            type="button"
            className="main-header__search search-toggler"
            aria-label="Search"
            onClick={onSearch}
          >
            <i className="icon-search" aria-hidden="true" />
          </button>

          <FindoxButton
            href={contactCtaHref}
            text={contactCtaText}
            className="main-header__btn"
          />
        </div>
      </div>
    </div>
  );
}

export function Header({ navItems, socialLinks, topbar, header }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [sticky, setSticky] = useState(false);

  const visibleNavItems = navItems
    .filter((item) => item.visible)
    .map((item) => ({ label: item.label, href: item.href }));

  const visibleSocials = socialLinks
    .filter((item) => item.visible)
    .map((item) => ({
      label: item.label,
      href: item.href,
      icon: item.icon,
    }));

  useEffect(() => {
    const onScroll = () => setSticky(window.scrollY > 240);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const locked = mobileOpen || searchOpen;
    document.body.classList.toggle("findox-locked", locked);
    return () => document.body.classList.remove("findox-locked");
  }, [mobileOpen, searchOpen]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <div className="header">
        <Topbar
          email={topbar.email}
          address={topbar.address}
          addressMapUrl={topbar.addressMapUrl}
          whatsappLabel={topbar.whatsappLabel}
          whatsappHref={topbar.whatsappHref}
          socials={visibleSocials}
        />
        <header className="main-header">
          <MainHeaderBar
            onSearch={() => setSearchOpen(true)}
            onMobile={() => setMobileOpen(true)}
            navItems={navItems}
            contactCtaText={header.contactCtaText}
            contactCtaHref={header.contactCtaHref}
          />
        </header>
      </div>

      <div className={`main-header sticky-header--clone${sticky ? " active" : ""}`}>
        <MainHeaderBar
          onSearch={() => setSearchOpen(true)}
          onMobile={() => setMobileOpen(true)}
          navItems={navItems}
          contactCtaText={header.contactCtaText}
          contactCtaHref={header.contactCtaHref}
        />
      </div>

      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        items={visibleNavItems}
        contact={{
          email: topbar.email,
          phone: topbar.phone,
          phoneHref: topbar.phoneHref,
        }}
        socials={visibleSocials}
      />
      <SearchPopup open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
