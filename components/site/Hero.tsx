"use client";

import { useState } from "react";
import Image from "next/image";
import { FindoxButton } from "./FindoxButton";
import { CountUp } from "./CountUp";
import { VideoModal } from "./VideoModal";

const VIDEO_ID = "h9MbznbxlLc";

export function Hero() {
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
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/shapes/sec-title-shape-1-1.png"
                  alt=""
                  className="hero-one__tagline__shape"
                  width={18}
                  height={18}
                />
                <p className="hero-one__tagline__text">
                  SOLUTIONS FOR finance GROWTH
                </p>
              </div>

              <h1 className="hero-one__title" data-aos="fade-left">
                Expert Solutions for Corporate{" "}
                <button
                  type="button"
                  className="hero-one__video video-btn"
                  aria-label="Play intro video"
                  onClick={() => setVideoOpen(true)}
                >
                  <i className="icon-play" aria-hidden="true" />
                </button>{" "}
                <span>
                  Fina<span>n</span>cial
                </span>{" "}
                Success.
              </h1>

              <div className="hero-one__bottom">
                <div
                  className="hero-one__button"
                  data-aos="fade-up"
                  style={{ animationDelay: "200ms" }}
                >
                  <FindoxButton href="#" text="Get Started" variant="base" />
                </div>

                <div
                  className="active-user"
                  data-aos="fade-up"
                  style={{ animationDelay: "300ms" }}
                >
                  <div className="active-user__image">
                    {[1, 2, 3].map((n) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={n}
                        src={`/images/resources/active-user-${n}.jpg`}
                        alt={`Active user ${n}`}
                        width={46}
                        height={46}
                      />
                    ))}
                  </div>
                  <div className="active-user__info">
                    <h3 className="active-user__count">
                      <CountUp end={125} duration={1500} />
                      <span>k+</span>
                    </h3>
                    <p className="active-user__text">Active Users</p>
                  </div>
                </div>
              </div>

              {/* eslint-disable-next-line @next/next/no-img-element */}
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
                src="https://bracketweb.com/findox-laravel/assets/images/hero-slider/hero-1-1.png"
                alt="Financial advisor"
                width={698}
                height={668}
                priority
              />
            </div>
          </div>
        </div>
      </div>

      {/* Decorative floating shapes */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/shapes/hero-shape-1-1.png"
        alt=""
        className="hero-one__shape-1"
        width={168}
        height={168}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/shapes/hero-shape-1-2.png"
        alt=""
        className="hero-one__shape-2"
        width={1212}
        height={529}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/shapes/hero-shape-1-3.png"
        alt=""
        className="hero-one__shape-3"
        width={431}
        height={291}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/shapes/hero-shape-1-4.png"
        alt=""
        className="hero-one__shape-4"
        width={94}
        height={96}
      />

      <VideoModal
        open={videoOpen}
        onClose={() => setVideoOpen(false)}
        videoId={VIDEO_ID}
      />
    </section>
  );
}
