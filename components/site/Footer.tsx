import Image from "next/image";
import Link from "next/link";
import { Container } from "./Container";
import { Logo } from "./Logo";
import { Reveal } from "./Reveal";
import { SocialLinks } from "./SocialLinks";
import { FOOTER } from "./home-data";
import { SOCIALS } from "./nav-data";
import "./css/footer.css";

/**
 * Footer — dark-green `main-footer` band: a 4-column widget row (about +
 * socials / links / explore / recent blog) over a tinted background photo,
 * a faint giant wordmark watermark, and a slim copyright bar. Mirrors the
 * reference's Bootstrap `col-xl-3 col-lg-* col-md-* col-sm-*` grid via
 * Tailwind at the project's Bootstrap-aligned breakpoints, its dash-bullet
 * "Links" list, and its link underline-sweep hovers (see css/footer.css).
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="main-footer relative overflow-hidden bg-accent text-white">
      <div
        className="main-footer__bg absolute inset-0 bg-cover bg-top bg-no-repeat"
        style={{ backgroundImage: "url(/images/backgrounds/footer-bg.jpg)" }}
        aria-hidden="true"
      />

      <div className="main-footer__top relative overflow-hidden pt-[223px] pb-[70px] max-xl:pt-40 max-lg:pt-28 max-md:pt-20">
        {/* Faint giant wordmark watermark — a tasteful stand-in for the
            reference's oversized placeholder-number texture. */}
        <div
          className="pointer-events-none absolute inset-0 z-0 hidden items-center justify-center lg:flex"
          aria-hidden="true"
        >
          <span className="text-[260px] leading-none font-black tracking-tight whitespace-nowrap text-white/[0.05] select-none">
            CARVI ASSOCIATES
          </span>
        </div>

        <Container className="relative z-[1]">
          <div className="grid grid-cols-12 gap-x-6 gap-y-10">
            {/* Col 1 — logo, blurb, socials */}
            <Reveal
              direction="up"
              delay={100}
              className="col-span-12 md:col-span-7 lg:col-span-5 xl:col-span-3"
            >
              <div className="footer-widget footer-widget--about">
                <div className="footer-widget__logo mb-[31px] inline-flex">
                  <Logo tone="dark" />
                </div>
                <p className="footer-widget__text mb-[22px] text-white">{FOOTER.about}</p>
                <SocialLinks socials={SOCIALS} />
              </div>
            </Reveal>

            {/* Col 2 — Links (two dash-bulleted columns) */}
            <Reveal
              direction="up"
              delay={200}
              className="col-span-12 sm:col-span-6 md:col-span-5 lg:col-span-4 xl:col-span-3"
            >
              <div className="footer-widget footer-widget--links footer-widget--links-1 mt-0 pl-0 md:pl-5 lg:pl-10 xl:mt-5 xl:pl-[70px]">
                <h2 className="footer-widget__title mb-[34px] text-[22px] leading-[1.363] font-bold capitalize">
                  Links
                </h2>
                <div className="footer-widget__links-box flex items-start gap-[25px]">
                  <ul className="footer-widget__links footer-widget__links--1 list-none space-y-2.5">
                    {FOOTER.linksColumnOne.map((link) => (
                      <li key={link.label} className="relative pl-[15px] before:absolute before:top-1/2 before:left-0 before:-translate-y-1/2 before:text-[14px] before:leading-none before:text-white before:transition-colors before:duration-500 before:content-['-'] hover:before:text-primary">
                        <Link href={link.href} className="text-base text-white transition-colors hover:text-primary">
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <ul className="footer-widget__links footer-widget__links--1 list-none space-y-2.5">
                    {FOOTER.linksColumnTwo.map((link) => (
                      <li key={link.label} className="relative pl-[15px] before:absolute before:top-1/2 before:left-0 before:-translate-y-1/2 before:text-[14px] before:leading-none before:text-white before:transition-colors before:duration-500 before:content-['-'] hover:before:text-primary">
                        <Link href={link.href} className="text-base text-white transition-colors hover:text-primary">
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>

            {/* Col 3 — Explore (single column, no bullets) */}
            <Reveal
              direction="up"
              delay={300}
              className="col-span-12 sm:col-span-6 md:col-span-5 lg:col-span-3 xl:col-span-3"
            >
              <div className="footer-widget footer-widget--links footer-widget--links-2 mt-0 pl-0 lg:pl-10 xl:mt-5 xl:pl-[70px]">
                <h2 className="footer-widget__title mb-[34px] text-[22px] leading-[1.363] font-bold capitalize">
                  Explore
                </h2>
                <ul className="footer-widget__links list-none space-y-2.5">
                  {FOOTER.explore.map((link) => (
                    <li key={link.label} className="text-base">
                      <Link href={link.href} className="text-base text-white transition-colors hover:text-primary">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            {/* Col 4 — Recent Blog */}
            <Reveal
              direction="up"
              delay={400}
              className="col-span-12 md:col-span-7 lg:col-span-6 xl:col-span-3"
            >
              <div className="footer-widget footer-widget--blog mt-0 pl-0 xl:mt-5 xl:pl-3">
                <h2 className="footer-widget__title mb-[34px] text-[22px] leading-[1.363] font-bold capitalize">
                  Recent Blog
                </h2>
                <ul className="footer-widget__blog list-none space-y-[30px]">
                  {FOOTER.recentBlog.map((post) => (
                    <li key={post.title} className="grid grid-cols-[75px_auto] items-start gap-[19px]">
                      <div className="footer-widget__blog__image size-[75px] shrink-0 overflow-hidden rounded-[5px]">
                        <Image
                          src={post.image}
                          alt=""
                          width={75}
                          height={76}
                          className="size-full object-cover"
                        />
                      </div>
                      <div className="footer-widget__blog__content">
                        <span className="footer-widget__blog__date mb-2 inline-flex items-center gap-2.5 text-sm font-medium text-white">
                          <span className="footer-widget__blog__icon inline-flex shrink-0 text-sm text-primary">
                            <i className="icon-calendar" aria-hidden="true" />
                          </span>
                          {post.date}
                        </span>
                        <h3 className="footer-widget__blog__title m-0 text-base leading-[1.375] font-semibold">
                          <Link href="#" className="text-white transition-colors hover:text-primary">
                            {post.title}
                          </Link>
                        </h3>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </Container>
      </div>

      <div className="main-footer__bottom relative z-[1]">
        <Container>
          <div className="main-footer__bottom__inner flex flex-col-reverse items-center justify-center gap-x-[30px] gap-y-[25px] border-t border-white/30 py-[30px] text-center lg:flex-row lg:justify-between lg:py-[25px] lg:text-left">
            <p className="main-footer__copyright m-0 text-base font-normal text-white capitalize">
              &copy; Copyright {year} by Carvi Associates.
            </p>
            <ul className="main-footer__page m-0 flex flex-wrap items-center justify-center gap-x-[26px] gap-y-[13px] lg:justify-start">
              {FOOTER.bottomLinks.map((link) => (
                <li key={link.label} className="text-base leading-[1.25] font-normal text-white capitalize">
                  <Link href={link.href} className="text-white hover:text-primary">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </div>
    </footer>
  );
}
