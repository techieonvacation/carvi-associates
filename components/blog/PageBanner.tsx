import Image from "next/image";
import { Container } from "@/components/site/Container";
import { Reveal } from "@/components/site/Reveal";
import { SmartLink } from "@/components/site/SmartLink";
import { SplitHeading } from "@/components/site/SplitHeading";
import type { HeroAlignment, HeroHeight } from "@/lib/cms/blog-types";
import { cn } from "@/lib/utils";

export type Crumb = { label: string; href?: string };

const HEIGHT_CLASSES: Record<HeroHeight, string> = {
  compact: "pt-38 pb-16 max-lg:pt-34 max-md:pt-30 max-md:pb-14",
  standard: "pt-45 pb-25 max-lg:pt-40 max-md:pt-35 max-md:pb-20",
  tall: "pt-55 pb-35 max-lg:pt-48 max-md:pt-40 max-md:pb-26",
};

export function PageBanner({
  tagline,
  titleLines,
  intro,
  backgroundImageUrl,
  crumbs,
  overlay = 82,
  height = "standard",
  align = "center",
  showCrumbs = true,
}: {
  tagline: string;
  titleLines: string[];
  intro?: string;
  backgroundImageUrl: string;
  crumbs: Crumb[];
  overlay?: number;
  height?: HeroHeight;
  align?: HeroAlignment;
  showCrumbs?: boolean;
}) {
  const isCentered = align === "center";

  return (
    <section
      className={cn(
        "blog-banner relative overflow-hidden",
        HEIGHT_CLASSES[height] ?? HEIGHT_CLASSES.standard,
      )}
    >
      <div className="blog-banner__bg absolute inset-0">
        {backgroundImageUrl ? (
          <Image
            src={backgroundImageUrl}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        ) : null}
        <div
          className="absolute inset-0 bg-[#3a3020]"
          style={{ opacity: overlay / 100 }}
          aria-hidden="true"
        />
      </div>

      <Container className="relative z-1">
        <div className={cn("max-w-200", isCentered ? "mx-auto text-center" : "text-left")}>
          <Reveal direction="up" className={cn("flex", isCentered && "justify-center")}>
            <div className="sec-title__top">
              <Image
                src="/images/shapes/sec-title-shape-1-1.png"
                alt=""
                width={18}
                height={18}
                className="sec-title__shape"
                aria-hidden="true"
              />
              <p className="sec-title__tagline">{tagline}</p>
            </div>
          </Reveal>

          <SplitHeading
            lines={titleLines}
            className="blog-banner__title bw-split-in-up mt-5.5"
          />

          {intro ? (
            <Reveal direction="up" delay={150}>
              <p
                className={cn(
                  "mt-6 max-w-175 text-[17px] leading-[1.7] text-white/80 max-sm:text-base",
                  isCentered && "mx-auto",
                )}
              >
                {intro}
              </p>
            </Reveal>
          ) : null}

          {showCrumbs && crumbs.length ? (
            <Reveal direction="up" delay={250}>
              <nav aria-label="Breadcrumb" className="mt-8.5">
                <ol
                  className={cn(
                    "flex flex-wrap items-center gap-x-3 gap-y-2 text-[15px] font-medium",
                    isCentered && "justify-center",
                  )}
                >
                  {crumbs.map((crumb, index) => (
                    <li key={`${crumb.label}-${index}`} className="flex items-center gap-3">
                      {crumb.href ? (
                        <SmartLink
                          href={crumb.href}
                          className="text-white/70 transition-colors duration-500 hover:text-primary"
                        >
                          {crumb.label}
                        </SmartLink>
                      ) : (
                        <span className="max-w-70 truncate text-primary sm:max-w-none">
                          {crumb.label}
                        </span>
                      )}
                      {index < crumbs.length - 1 ? (
                        <i
                          className="icon-right-2 text-[10px] text-white/40"
                          aria-hidden="true"
                        />
                      ) : null}
                    </li>
                  ))}
                </ol>
              </nav>
            </Reveal>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
