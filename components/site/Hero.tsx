"use client";

import { useState } from "react";
import Image from "next/image";
import { FindoxButton } from "./FindoxButton";
import { CountUp } from "./CountUp";
import { VideoModal } from "./VideoModal";
import type { SiteContent } from "@/lib/cms/queries";

type HeroProps = {
  hero: SiteContent["hero"];
};

export function Hero({ hero }: HeroProps) {
  const [videoOpen, setVideoOpen] = useState(false);

  return (
    <section className="hero-one">
      <div
        className="hero-one__bg"
        style={{ backgroundImage: "url(/images/shapes/hero-bg-1-1.png)" }}
      />

      <div className="findox-container">
        <div className="hero-one__row">
          <div className="hero-one__col hero-one__col--content">
            <div className="hero-one__content">
              <div className="hero-one__tagline" data-aos="fade-right">
                <img
                  src="/images/shapes/sec-title-shape-1-1.png"
                  alt=""
                  className="hero-one__tagline__shape"
                  width={18}
                  height={18}
                />
                <p className="hero-one__tagline__text">{hero.tagline}</p>
              </div>

              <h1 className="hero-one__title" data-aos="fade-left">
                {hero.titleBeforeVideo}{" "}
                {hero.videoId ? (
                  <button
                    type="button"
                    className="hero-one__video video-btn"
                    aria-label="Play intro video"
                    onClick={() => setVideoOpen(true)}
                  >
                    <i className="icon-play" aria-hidden="true" />
                  </button>
                ) : null}{" "}
                <span>
                  {hero.titleHighlight}
                  <span>n</span>
                  {hero.titleAfterVideo}
                </span>
              </h1>

              <div className="hero-one__bottom">
                <div
                  className="hero-one__button"
                  data-aos="fade-up"
                  style={{ animationDelay: "200ms" }}
                >
                  <FindoxButton href={hero.ctaHref} text={hero.ctaText} variant="base" />
                </div>

                <div
                  className="active-user"
                  data-aos="fade-up"
                  style={{ animationDelay: "300ms" }}
                >
                  <div className="active-user__image">
                    {hero.activeUserImages.map((image, index) => (
                      <img
                        key={`${image}-${index}`}
                        src={image}
                        alt={`Active user ${index + 1}`}
                        width={46}
                        height={46}
                      />
                    ))}
                  </div>
                  <div className="active-user__info">
                    <h3 className="active-user__count">
                      <CountUp end={hero.activeUserCount} duration={1500} />
                      <span>{hero.activeUserSuffix}</span>
                    </h3>
                    <p className="active-user__text">{hero.activeUserLabel}</p>
                  </div>
                </div>
              </div>

              <img
                src="/images/shapes/hero-title-shape-1-1.png"
                alt=""
                className="hero-one__content__shape"
                width={141}
                height={147}
              />
            </div>
          </div>

          <div className="hero-one__col hero-one__col--image">
            <div className="hero-one__image" data-aos="fade-up">
              <Image
                src={hero.heroImageUrl}
                alt="Financial advisor"
                width={698}
                height={668}
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
      />
      <img
        src="/images/shapes/hero-shape-1-2.png"
        alt=""
        className="hero-one__shape-2"
        width={1212}
        height={529}
      />
      <img
        src="/images/shapes/hero-shape-1-3.png"
        alt=""
        className="hero-one__shape-3"
        width={431}
        height={291}
      />
      <img
        src="/images/shapes/hero-shape-1-4.png"
        alt=""
        className="hero-one__shape-4"
        width={94}
        height={96}
      />

      {hero.videoId ? (
        <VideoModal
          open={videoOpen}
          onClose={() => setVideoOpen(false)}
          videoId={hero.videoId}
        />
      ) : null}
    </section>
  );
}
