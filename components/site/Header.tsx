"use client";

import { useEffect, useState } from "react";
import { Topbar } from "./Topbar";
import { DesktopMenu } from "./DesktopMenu";
import { MobileMenu } from "./MobileMenu";
import { SearchPopup } from "./SearchPopup";
import { SidebarPanel } from "./SidebarPanel";
import { FindoxButton } from "./FindoxButton";
import { Logo } from "./Logo";
import { AnchorScrollManager } from "./AnchorScrollManager";
import { withKnowledgeBankDropdown } from "./nav-data";
import type { PublicNavItem } from "./DesktopMenu";
import type { SiteContent } from "@/lib/cms/queries";

type HeaderProps = Pick<
  SiteContent,
  "navItems" | "socialLinks" | "topbar" | "header"
>;

type MainHeaderBarProps = {
  navItems: PublicNavItem[];
  header: HeaderProps["header"];
  phone: string;
  phoneHref: string;
  onSearch: () => void;
  onMobile: () => void;
  onSidebar: () => void;
};

function MainHeaderBar({
  navItems,
  header,
  phone,
  phoneHref,
  onSearch,
  onMobile,
  onSidebar,
}: MainHeaderBarProps) {
  const showCall = header.showCall && Boolean(phone);

  return (
    <div className="findox-container">
      <div className="main-header__inner">
        <div className="main-header__logo logo-retina">
          <Logo logo={header.logo} tone="light" />
        </div>
        <div className="main-header__right">
          <nav className="main-header__nav main-menu" aria-label="Primary">
            <DesktopMenu items={navItems} />
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

          {header.showSearch ? (
            <button
              type="button"
              className="main-header__search search-toggler"
              aria-label="Search"
              onClick={onSearch}
            >
              <i className="icon-search" aria-hidden="true" />
            </button>
          ) : null}

          {header.showContactCta ? (
            <FindoxButton
              href={header.contactCtaHref}
              text={header.contactCtaText}
              className="main-header__btn"
            />
          ) : null}

          {showCall ? (
            <div className="main-header__call">
              <span className="main-header__call__icon">
                <i className="icon-phone-call" aria-hidden="true" />
              </span>
              <div className="main-header__call__content">
                <h4 className="main-header__call__title">{header.callTitle}</h4>
                <a
                  href={phoneHref || `tel:${phone.replace(/\s+/g, "")}`}
                  className="main-header__call__number"
                >
                  {phone}
                </a>
              </div>
            </div>
          ) : null}

          {header.showSidebar ? (
            <button
              type="button"
              className="sidebar-btn__toggler"
              aria-label="Open sidebar"
              onClick={onSidebar}
            >
              <span className="sidebar-btn__toggler__line" />
              <span className="sidebar-btn__toggler__line" />
              <span className="sidebar-btn__toggler__line" />
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function Header({ navItems, socialLinks, topbar, header }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sticky, setSticky] = useState(false);

  const visibleNavItems = withKnowledgeBankDropdown(
    navItems
      .filter((item) => item.visible)
      .map((item) => ({ label: item.label, href: item.href })),
  );

  const visibleSocials = socialLinks
    .filter((item) => item.visible)
    .map((item) => ({
      label: item.label,
      href: item.href,
      icon: item.icon,
    }));

  const phone = topbar.phone.trim();
  const phoneHref = topbar.phoneHref.trim();

  useEffect(() => {
    const onScroll = () => setSticky(window.scrollY > 240);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const locked = mobileOpen || searchOpen || sidebarOpen;
    document.body.classList.toggle("findox-locked", locked);
    return () => document.body.classList.remove("findox-locked");
  }, [mobileOpen, searchOpen, sidebarOpen]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
        setSearchOpen(false);
        setSidebarOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const bar = (
    <MainHeaderBar
      navItems={visibleNavItems}
      header={header}
      phone={phone}
      phoneHref={phoneHref}
      onSearch={() => setSearchOpen(true)}
      onMobile={() => setMobileOpen(true)}
      onSidebar={() => setSidebarOpen(true)}
    />
  );

  return (
    <>
      <div className="header">
        <Topbar topbar={topbar} socials={visibleSocials} />
        <header className="main-header">{bar}</header>
      </div>

      <div className={`main-header sticky-header--clone${sticky ? " active" : ""}`}>
        {bar}
      </div>

      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        items={visibleNavItems}
        logo={header.logo}
        contact={{
          email: topbar.email.trim(),
          phone,
          phoneHref,
          address: topbar.address.trim(),
        }}
        socials={visibleSocials}
      />
      <SearchPopup open={searchOpen} onClose={() => setSearchOpen(false)} />
      {header.showSidebar ? (
        <SidebarPanel
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          logo={header.logo}
          about={header.sidebarAbout}
          contactTitle={header.sidebarContactTitle}
          newsletterTitle={header.sidebarNewsletterTitle}
          showNewsletter={header.showSidebarNewsletter}
          contact={{
            email: topbar.email.trim(),
            phone,
            phoneHref,
            address: topbar.address.trim(),
          }}
          socials={visibleSocials}
        />
      ) : null}
      <AnchorScrollManager />
    </>
  );
}
