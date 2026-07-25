"use client";

import Image from "next/image";
import { FindoxButton } from "./FindoxButton";
import { CountUp } from "./CountUp";
import type { SiteContent } from "@/lib/cms/queries";

type HeroProps = {
  hero: SiteContent["hero"];
  whatsappHref: string;
};

export function Hero({ hero, whatsappHref }: HeroProps) {
  return (
    <section className="hero-one">
      <div
        className="hero-one__bg"
        style={{ backgroundImage: "url(/images/shapes/hero-bg-1-1.png)" }}
        aria-hidden="true"
      />

      <div className="findox-container hero-one__container">
        <div className="hero-one__grid">
          <div className="hero-one__content">
            <div className="hero-one__eyebrow" data-aos="fade-right">
              <img
                src="/images/shapes/sec-title-shape-1-1.png"
                alt=""
                className="hero-one__eyebrow-shape"
                width={18}
                height={18}
              />
              <p className="hero-one__eyebrow-text">{hero.tagline}</p>
            </div>

            <h1 className="hero-one__title" data-aos="fade-left">
              {hero.titleBeforeVideo}{" "}
              <span className="hero-one__title-highlight">{hero.titleHighlight}</span>{" "}
              {hero.titleAfterVideo}
            </h1>

            <p className="hero-one__text" data-aos="fade-up">
              {hero.description}
            </p>

            <ul className="hero-one__stats" data-aos="fade-up">
              {hero.stats.map((stat) => (
                <li key={stat.label} className="hero-one__stat">
                  <span className="hero-one__stat-icon" aria-hidden="true">
                    <i className={stat.icon} />
                  </span>
                  <span className="hero-one__stat-body">
                    <strong className="hero-one__stat-value">
                      <CountUp end={stat.end} duration={1600} />
                      {stat.suffix}
                    </strong>
                    <span className="hero-one__stat-label">{stat.label}</span>
                  </span>
                </li>
              ))}
            </ul>

            <div className="hero-one__actions" data-aos="fade-up">
              <div className="hero-one__button">
                <FindoxButton href={hero.ctaHref} text={hero.ctaText} variant="base" />
              </div>
              <div className="hero-one__button">
                <FindoxButton
                  href={whatsappHref}
                  text={hero.secondaryCtaText}
                  external
                />
              </div>
            </div>

            <ul className="hero-one__trust" data-aos="fade-up">
              {hero.trust.map((item) => (
                <li key={item.label} className="hero-one__trust-item">
                  <span className="hero-one__trust-icon" aria-hidden="true">
                    <i className={item.icon} />
                  </span>
                  <span>{item.label}</span>
                </li>
              ))}
            </ul>

            <img
              src="/images/shapes/hero-title-shape-1-1.png"
              alt=""
              className="hero-one__content__shape"
              width={141}
              height={147}
              aria-hidden="true"
            />
          </div>

          <div className="hero-one__media" data-aos="fade-up">
            <div className="hero-one__image">
              <Image
                src={hero.heroImageUrl}
                alt="Financial advisor"
                width={698}
                height={668}
                sizes="(max-width: 991px) 90vw, 40vw"
                priority
                unoptimized
              />
            </div>
          </div>
        </div>
      </div>

      <img
        src="/images/shapes/hero-shape-1-1.png"
        alt=""
        className="hero-one__shape-1"
        width={168}
        height={168}
        aria-hidden="true"
      />
      <img
        src="/images/shapes/hero-shape-1-2.png"
        alt=""
        className="hero-one__shape-2"
        width={1212}
        height={529}
        aria-hidden="true"
      />
      <img
        src="/images/shapes/hero-shape-1-3.png"
        alt=""
        className="hero-one__shape-3"
        width={431}
        height={291}
        aria-hidden="true"
      />
      <img
        src="/images/shapes/hero-shape-1-4.png"
        alt=""
        className="hero-one__shape-4"
        width={94}
        height={96}
        aria-hidden="true"
      />
    </section>
  );
}
