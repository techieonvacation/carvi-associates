import Link from "next/link";
import { Container } from "@/components/site/Container";
import { Reveal } from "@/components/site/Reveal";
import { SplitHeading } from "@/components/site/SplitHeading";

export function InsightBanner({
  tagline,
  title,
  intro,
  crumbs,
}: {
  tagline: string;
  title: string;
  intro: string;
  crumbs: { label: string; href?: string }[];
}) {
  return (
    <section className="relative overflow-hidden pt-45 pb-25 max-lg:pt-40 max-md:pt-35 max-md:pb-20">
      <div className="insight-banner__bg absolute inset-0" aria-hidden="true" />

      <Container className="relative z-1">
        <div className="mx-auto max-w-200 text-center">
          <Reveal direction="up" className="flex justify-center">
            <span className="insight-tagline inline-flex items-start gap-2 bg-secondary py-3.25 pr-9.25 pl-7.5 font-heading text-[18px] leading-tight font-semibold text-accent uppercase max-md:text-base">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/shapes/sec-title-shape-1-1.png"
                alt=""
                width={18}
                height={18}
                className="relative top-px h-4.5 w-4.5"
                aria-hidden="true"
              />
              {tagline}
            </span>
          </Reveal>

          <SplitHeading
            as="h1"
            lines={[title]}
            className="mt-5.5 font-heading text-[46px] leading-[1.22] font-bold text-white max-lg:text-[38px] max-sm:text-[29px]"
          />

          <Reveal direction="up" delay={150}>
            <p className="mx-auto mt-6 max-w-175 text-[17px] leading-[1.7] text-white/80 max-sm:text-base">
              {intro}
            </p>
          </Reveal>

          <Reveal direction="up" delay={250}>
            <nav aria-label="Breadcrumb" className="mt-8.5">
              <ol className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-[15px] font-medium">
                {crumbs.map((crumb, index) => (
                  <li key={crumb.label} className="flex items-center gap-3">
                    {crumb.href ? (
                      <Link
                        href={crumb.href}
                        className="text-white/70 transition-colors duration-500 hover:text-primary"
                      >
                        {crumb.label}
                      </Link>
                    ) : (
                      <span className="text-primary">{crumb.label}</span>
                    )}
                    {index < crumbs.length - 1 ? (
                      <i className="icon-right-2 text-[10px] text-white/40" aria-hidden="true" />
                    ) : null}
                  </li>
                ))}
              </ol>
            </nav>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
