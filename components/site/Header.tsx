"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Topbar } from "./Topbar";
import { DesktopMenu } from "./DesktopMenu";
import { MobileMenu } from "./MobileMenu";
import { SearchPopup } from "./SearchPopup";
import { FindoxButton } from "./FindoxButton";

function Logo() {
  return (
    <div className="main-header__logo logo-retina">
      <Link href="/" aria-label="Carvi Associates home">
        {/* <Image
          src="/images/logo-dark.png"
          alt="Carvi Associates"
          width={200}
          height={50}
          priority
        /> */}
         <span className="text-base lg:text-2xl font-medium">Carvi Associates</span>
      </Link>
    </div>
  );
}

/** The white navigation bar — reused for the in-flow header and the sticky clone. */
function MainHeaderBar({
  onSearch,
  onMobile,
}: {
  onSearch: () => void;
  onMobile: () => void;
}) {
  return (
    <div className="findox-container">
      <div className="main-header__inner">
        <Logo />
        <div className="main-header__right">
          <nav className="main-header__nav main-menu" aria-label="Primary">
            <DesktopMenu />
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
            href="#"
            text="Contact Us"
            className="main-header__btn"
          />
        </div>
      </div>
    </div>
  );
}

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [sticky, setSticky] = useState(false);

  // Slide-in the sticky clone once the original header scrolls away.
  useEffect(() => {
    const onScroll = () => setSticky(window.scrollY > 240);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while an overlay is open.
  useEffect(() => {
    const locked = mobileOpen || searchOpen;
    document.body.classList.toggle("findox-locked", locked);
    return () => document.body.classList.remove("findox-locked");
  }, [mobileOpen, searchOpen]);

  // Close overlays on Escape.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
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
        <Topbar />
        <header className="main-header">
          <MainHeaderBar
            onSearch={() => setSearchOpen(true)}
            onMobile={() => setMobileOpen(true)}
          />
        </header>
      </div>

      {/* Sticky clone that slides down on scroll */}
      <div className={`main-header sticky-header--clone${sticky ? " active" : ""}`}>
        <MainHeaderBar
          onSearch={() => setSearchOpen(true)}
          onMobile={() => setMobileOpen(true)}
        />
      </div>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
      <SearchPopup open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
