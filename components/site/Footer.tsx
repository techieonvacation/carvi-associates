import Image from "next/image";
import Link from "next/link";
import { Container } from "./Container";
import { Logo } from "./Logo";
import { SocialLinks } from "./SocialLinks";
import { FOOTER } from "./home-data";
import { SOCIALS } from "./nav-data";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#131111] pt-20 text-white">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-15"
        style={{ backgroundImage: "url(/images/backgrounds/footer-bg.jpg)" }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-[#131111]/85" aria-hidden="true" />

      <Container className="relative">
        <div className="grid gap-12 pb-16 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <div>
            <Logo tone="dark" />
            <p className="mt-5 text-sm text-white/70">{FOOTER.about}</p>
            <div className="mt-6">
              <SocialLinks socials={SOCIALS} />
            </div>
          </div>

          <div>
            <h4 className="font-heading text-lg font-bold text-white!">Links</h4>
            <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3">
              <ul className="space-y-3">
                {FOOTER.linksColumnOne.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-white/70 transition-colors hover:text-primary">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <ul className="space-y-3">
                {FOOTER.linksColumnTwo.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-white/70 transition-colors hover:text-primary">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <h4 className="font-heading text-lg font-bold text-white!">Explore</h4>
            <ul className="mt-5 space-y-3">
              {FOOTER.explore.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-white/70 transition-colors hover:text-primary">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading text-lg font-bold text-white!">Recent Blog</h4>
            <div className="mt-5 space-y-4">
              {FOOTER.recentBlog.map((post) => (
                <div key={post.title} className="flex gap-3">
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-xl">
                    <Image src={post.image} alt="" fill sizes="64px" className="object-cover" />
                  </div>
                  <div>
                    <p className="flex items-center gap-1.5 text-xs text-white/50">
                      <i className="icon-calendar" aria-hidden="true" />
                      {post.date}
                    </p>
                    <Link
                      href="#"
                      className="mt-1 block text-sm leading-snug font-medium text-white/90 transition-colors hover:text-primary"
                    >
                      {post.title}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 py-6 sm:flex-row">
          <p className="text-sm text-white/60">
            © Copyright {new Date().getFullYear()} by Carvi Associates.
          </p>
          <div className="flex gap-6">
            {FOOTER.bottomLinks.map((link) => (
              <Link key={link.label} href={link.href} className="text-sm text-white/60 transition-colors hover:text-primary">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}
