"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Container } from "./Container";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { ABOUT } from "./home-data";
import "./css/about.css";

/**
 * The reference's inline check-mark + dot-grid icon (findox `about01/02/03`
 * tabs). Colours are handled in about.css: the checkmark path (first) and the
 * dot-grid paths (rest) swap green/yellow on `li:hover`.
 */
function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="18"
      viewBox="0 0 20 18"
      fill="none"
      aria-hidden="true"
    >
      <path d="M7.61783 15.3793L7.43261 15.0638C6.04331 12.6968 2.34781 7.66857 2.31054 7.61805L2.20215 7.47073L3.59246 6.0973L7.57091 8.87535C10.0644 5.65282 12.3873 3.435 13.9068 2.13527C15.5855 0.699346 16.6484 0.0568193 16.6926 0.0301654L16.7428 0H19.1925L18.7776 0.369473C13.539 5.03542 7.85568 14.9617 7.79886 15.0614L7.61783 15.3793Z" />
      <path d="M0.33825 3.36049C0.52506 3.36049 0.6765 3.20912 0.6765 3.02241C0.6765 2.83569 0.52506 2.68433 0.33825 2.68433C0.15144 2.68433 0 2.83569 0 3.02241C0 3.20912 0.15144 3.36049 0.33825 3.36049Z" />
      <path d="M1.65759 3.36049C1.8444 3.36049 1.99584 3.20912 1.99584 3.02241C1.99584 2.83569 1.8444 2.68433 1.65759 2.68433C1.47078 2.68433 1.31934 2.83569 1.31934 3.02241C1.31934 3.20912 1.47078 3.36049 1.65759 3.36049Z" />
      <path d="M2.97692 3.36049C3.16373 3.36049 3.31517 3.20912 3.31517 3.02241C3.31517 2.83569 3.16373 2.68433 2.97692 2.68433C2.79011 2.68433 2.63867 2.83569 2.63867 3.02241C2.63867 3.20912 2.79011 3.36049 2.97692 3.36049Z" />
      <path d="M4.29626 3.36049C4.48307 3.36049 4.63451 3.20912 4.63451 3.02241C4.63451 2.83569 4.48307 2.68433 4.29626 2.68433C4.10945 2.68433 3.95801 2.83569 3.95801 3.02241C3.95801 3.20912 4.10945 3.36049 4.29626 3.36049Z" />
      <path d="M5.61657 3.36049C5.80338 3.36049 5.95482 3.20912 5.95482 3.02241C5.95482 2.83569 5.80338 2.68433 5.61657 2.68433C5.42976 2.68433 5.27832 2.83569 5.27832 3.02241C5.27832 3.20912 5.42976 3.36049 5.61657 3.36049Z" />
      <path d="M6.93591 3.36049C7.12272 3.36049 7.27416 3.20912 7.27416 3.02241C7.27416 2.83569 7.12272 2.68433 6.93591 2.68433C6.7491 2.68433 6.59766 2.83569 6.59766 3.02241C6.59766 3.20912 6.7491 3.36049 6.93591 3.36049Z" />
      <path d="M8.25524 3.36049C8.44205 3.36049 8.59349 3.20912 8.59349 3.02241C8.59349 2.83569 8.44205 2.68433 8.25524 2.68433C8.06843 2.68433 7.91699 2.83569 7.91699 3.02241C7.91699 3.20912 8.06843 3.36049 8.25524 3.36049Z" />
      <path d="M9.57458 3.36049C9.76139 3.36049 9.91283 3.20912 9.91283 3.02241C9.91283 2.83569 9.76139 2.68433 9.57458 2.68433C9.38777 2.68433 9.23633 2.83569 9.23633 3.02241C9.23633 3.20912 9.38777 3.36049 9.57458 3.36049Z" />
      <path d="M10.8939 3.36049C11.0807 3.36049 11.2322 3.20912 11.2322 3.02241C11.2322 2.83569 11.0807 2.68433 10.8939 2.68433C10.7071 2.68433 10.5557 2.83569 10.5557 3.02241C10.5557 3.20912 10.7071 3.36049 10.8939 3.36049Z" />
      <path d="M0.33825 17.8751C0.52506 17.8751 0.6765 17.7238 0.6765 17.5371C0.6765 17.3503 0.52506 17.199 0.33825 17.199C0.15144 17.199 0 17.3503 0 17.5371C0 17.7238 0.15144 17.8751 0.33825 17.8751Z" />
      <path d="M1.65759 17.8751C1.8444 17.8751 1.99584 17.7238 1.99584 17.5371C1.99584 17.3503 1.8444 17.199 1.65759 17.199C1.47078 17.199 1.31934 17.3503 1.31934 17.5371C1.31934 17.7238 1.47078 17.8751 1.65759 17.8751Z" />
      <path d="M2.97692 17.8751C3.16373 17.8751 3.31517 17.7238 3.31517 17.5371C3.31517 17.3503 3.16373 17.199 2.97692 17.199C2.79011 17.199 2.63867 17.3503 2.63867 17.5371C2.63867 17.7238 2.97692 17.8751 2.97692 17.8751Z" />
      <path d="M4.29626 17.8751C4.48307 17.8751 4.63451 17.7238 4.63451 17.5371C4.63451 17.3503 4.48307 17.199 4.29626 17.199C4.10945 17.199 3.95801 17.3503 3.95801 17.5371C3.95801 17.7238 4.10945 17.8751 4.29626 17.8751Z" />
      <path d="M5.61657 17.8751C5.80338 17.8751 5.95482 17.7238 5.95482 17.5371C5.95482 17.3503 5.80338 17.199 5.61657 17.199C5.42976 17.199 5.27832 17.3503 5.27832 17.5371C5.27832 17.7238 5.42976 17.8751 5.61657 17.8751Z" />
      <path d="M6.93591 17.8751C7.12272 17.8751 7.27416 17.7238 7.27416 17.5371C7.27416 17.3503 7.12272 17.199 6.93591 17.199C6.7491 17.199 6.59766 17.3503 6.59766 17.5371C6.59766 17.7238 6.7491 17.8751 6.93591 17.8751Z" />
      <path d="M8.25524 17.8751C8.44205 17.8751 8.59349 17.7238 8.59349 17.5371C8.59349 17.3503 8.44205 17.199 8.25524 17.199C8.06843 17.199 7.91699 17.3503 7.91699 17.5371C7.91699 17.7238 8.06843 17.8751 8.25524 17.8751Z" />
      <path d="M9.57458 17.8751C9.76139 17.8751 9.91283 17.7238 9.91283 17.5371C9.91283 17.3503 9.76139 17.199 9.57458 17.199C9.38777 17.199 9.23633 17.3503 9.23633 17.5371C9.23633 17.7238 9.38777 17.8751 9.57458 17.8751Z" />
      <path d="M10.8939 17.8751C11.0807 17.8751 11.2322 17.7238 11.2322 17.5371C11.2322 17.3503 11.0807 17.199 10.8939 17.199C10.7071 17.199 10.5557 17.3503 10.5557 17.5371C10.5557 17.7238 10.7071 17.8751 10.8939 17.8751Z" />
      <path d="M12.2132 17.8751C12.4001 17.8751 12.5515 17.7238 12.5515 17.5371C12.5515 17.3503 12.4001 17.199 12.2132 17.199C12.0264 17.199 11.875 17.3503 11.875 17.5371C11.875 17.7238 12.0264 17.8751 12.2132 17.8751Z" />
      <path d="M13.5326 17.8751C13.7194 17.8751 13.8708 17.7238 13.8708 17.5371C13.8708 17.3503 13.7194 17.199 13.5326 17.199C13.3458 17.199 13.1943 17.3503 13.1943 17.5371C13.1943 17.7238 13.3458 17.8751 13.5326 17.8751Z" />
      <path d="M14.8529 17.8751C15.0397 17.8751 15.1911 17.7238 15.1911 17.5371C15.1911 17.3503 15.0397 17.199 14.8529 17.199C14.6661 17.199 14.5146 17.3503 14.5146 17.5371C14.5146 17.7238 14.6661 17.8751 14.8529 17.8751Z" />
      <path d="M0.338081 16.5556C0.524798 16.5556 0.676161 16.4042 0.676161 16.2174C0.676161 16.0306 0.524798 15.8792 0.338081 15.8792C0.151364 15.8792 0 16.0306 0 16.2174C0 16.4042 0.151364 16.5556 0.338081 16.5556Z" />
      <path d="M0.338081 15.2361C0.524798 15.2361 0.676161 15.0846 0.676161 14.8978C0.676161 14.711 0.524798 14.5596 0.338081 14.5596C0.151364 14.5596 0 14.711 0 14.8978C0 15.0846 0.151364 15.2361 0.338081 15.2361Z" />
      <path d="M0.338081 13.9167C0.524798 13.9167 0.676161 13.7653 0.676161 13.5785C0.676161 13.3917 0.524798 13.2402 0.338081 13.2402C0.151364 13.2402 0 13.3917 0 13.5785C0 13.7653 0.151364 13.9167 0.338081 13.9167Z" />
      <path d="M0.338081 12.5972C0.524798 12.5972 0.676161 12.4457 0.676161 12.2589C0.676161 12.0721 0.524798 11.9207 0.338081 11.9207C0.151364 11.9207 0 12.0721 0 12.2589C0 12.4457 0.151364 12.5972 0.338081 12.5972Z" />
      <path d="M0.338081 11.2777C0.524798 11.2777 0.676161 11.1263 0.676161 10.9394C0.676161 10.7526 0.524798 10.6012 0.338081 10.6012C0.151364 10.6012 0 10.7526 0 10.9394C0 11.1263 0.151364 11.2777 0.338081 11.2777Z" />
      <path d="M0.338081 9.95824C0.524798 9.95824 0.676161 9.8068 0.676161 9.61999C0.676161 9.43318 0.524798 9.28174 0.338081 9.28174C0.151364 9.28174 0 9.43318 0 9.61999C0 9.8068 0.151364 9.95824 0.338081 9.95824Z" />
      <path d="M0.338081 8.63878C0.524798 8.63878 0.676161 8.48734 0.676161 8.30053C0.676161 8.11372 0.524798 7.96228 0.338081 7.96228C0.151364 7.96228 0 8.11372 0 8.30053C0 8.48734 0.151364 8.63878 0.338081 8.63878Z" />
      <path d="M0.338081 7.3192C0.524798 7.3192 0.676161 7.16776 0.676161 6.98095C0.676161 6.79414 0.524798 6.6427 0.338081 6.6427C0.151364 6.6427 0 6.79414 0 6.98095C0 7.16776 0.151364 7.3192 0.338081 7.3192Z" />
      <path d="M0.338081 5.99974C0.524798 5.99974 0.676161 5.8483 0.676161 5.66149C0.676161 5.47468 0.524798 5.32324 0.338081 5.32324C0.151364 5.32324 0 5.47468 0 5.66149C0 5.8483 0.151364 5.99974 0.338081 5.99974Z" />
      <path d="M0.338081 4.68028C0.524798 4.68028 0.676161 4.52884 0.676161 4.34203C0.676161 4.15522 0.524798 4.00378 0.338081 4.00378C0.151364 4.00378 0 4.15522 0 4.34203C0 4.52884 0.151364 4.68028 0.338081 4.68028Z" />
      <path d="M14.8527 16.5556C15.0394 16.5556 15.1908 16.4042 15.1908 16.2174C15.1908 16.0306 15.0394 15.8792 14.8527 15.8792C14.666 15.8792 14.5146 16.0306 14.5146 16.2174C14.5146 16.4042 14.666 16.5556 14.8527 16.5556Z" />
      <path d="M14.8527 15.2361C15.0394 15.2361 15.1908 15.0846 15.1908 14.8978C15.1908 14.711 15.0394 14.5596 14.8527 14.5596C14.666 14.5596 14.5146 14.711 14.5146 14.8978C14.5146 15.0846 14.666 15.2361 14.8527 15.2361Z" />
      <path d="M14.8527 13.9167C15.0394 13.9167 15.1908 13.7653 15.1908 13.5785C15.1908 13.3917 15.0394 13.2402 14.8527 13.2402C14.666 13.2402 14.5146 13.3917 14.5146 13.5785C14.5146 13.7653 14.666 13.9167 14.8527 13.9167Z" />
      <path d="M14.8527 12.5972C15.0394 12.5972 15.1908 12.4457 15.1908 12.2589C15.1908 12.0721 15.0394 11.9207 14.8527 11.9207C14.666 11.9207 14.5146 12.0721 14.5146 12.2589C14.5146 12.4457 14.666 12.5972 14.8527 12.5972Z" />
      <path d="M14.8527 11.2777C15.0394 11.2777 15.1908 11.1263 15.1908 10.9394C15.1908 10.7526 15.0394 10.6012 14.8527 10.6012C14.666 10.6012 14.5146 10.7526 14.5146 10.9394C14.5146 11.1263 14.666 11.2777 14.8527 11.2777Z" />
      <path d="M14.8527 9.95824C15.0394 9.95824 15.1908 9.8068 15.1908 9.61999C15.1908 9.43318 15.0394 9.28174 14.8527 9.28174C14.666 9.28174 14.5146 9.43318 14.5146 9.61999C14.5146 9.8068 14.666 9.95824 14.8527 9.95824Z" />
      <path d="M14.8527 8.63878C15.0394 8.63878 15.1908 8.48734 15.1908 8.30053C15.1908 8.11372 15.0394 7.96228 14.8527 7.96228C14.666 7.96228 14.5146 8.11372 14.5146 8.30053C14.5146 8.48734 14.666 8.63878 14.8527 8.63878Z" />
      <path d="M14.8527 7.3192C15.0394 7.3192 15.1908 7.16776 15.1908 6.98095C15.1908 6.79414 15.0394 6.6427 14.8527 6.6427C14.666 6.6427 14.5146 6.79414 14.5146 6.98095C14.5146 7.16776 14.666 7.3192 14.8527 7.3192Z" />
    </svg>
  );
}

/**
 * About — the two-image collage ("37+ Years Experience" badge overlapping a
 * second photo) beside a heading, blurb and an interactive 3-tab checklist
 * box ("Data Analysis" / "Team Support" active / "Advertising"). Mirrors the
 * reference `.about-one` section 1:1.
 */
export function About() {
  const [activeTab, setActiveTab] = useState(ABOUT.tabs[1].id);

  return (
    <section className="about-one relative bg-white pb-30 max-md:pb-25 max-sm:pb-20">
      <Container>
        <div className="grid grid-cols-1 gap-x-6 gap-y-[50px] lg:grid-cols-2">
          <Reveal direction="right" duration={1300}>
            <div className="about-one__image relative">
              <div className="about-one__image__one relative inline-block">
                <Image
                  src={ABOUT.images.collageOne}
                  alt="Advisors reviewing a financial plan"
                  width={497}
                  height={402}
                  className="about-one__image__one__img relative z-1 h-auto max-w-full rounded-bl-[100px]"
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/shapes/about-shape-1-1.png"
                  alt=""
                  width={64}
                  height={98}
                  aria-hidden="true"
                  className="about-one__image__shape-1 absolute top-[31px] -right-[43px] h-auto max-w-full max-sm:hidden"
                />
              </div>

              <div className="about-one__image__two relative z-1 mt-[-148px] mr-[15px] ml-auto table border-t-[10px] border-l-[10px] border-white lg:max-xl:mt-10 max-md:mr-0 max-[500px]:m-0">
                <Image
                  src={ABOUT.images.collageTwo}
                  alt="Client consultation in progress"
                  width={365}
                  height={261}
                  className="about-one__image__two__img relative z-1 h-auto max-w-full"
                />

                <div className="about-one__experience absolute top-[-104px] right-0 z-2 text-right">
                  <h3 className="about-one__experience__year relative z-1 m-0 ml-auto table rounded-t-[100px] bg-primary pt-[38px] pr-[22.5px] pb-[26px] pl-[22.5px] text-center text-[40px] leading-none font-bold text-[#222222]">
                    {ABOUT.experience.value}
                  </h3>
                  <h4 className="about-one__experience__title relative z-1 m-0 inline-block border-b-[10px] border-l-[10px] border-white bg-accent px-[15px] py-[5.5px] text-[18px] leading-[1.388] font-bold text-white capitalize">
                    {ABOUT.experience.label}
                  </h4>
                </div>

                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/shapes/about-shape-1-1.png"
                  alt=""
                  width={64}
                  height={98}
                  aria-hidden="true"
                  className="about-one__image__shape-2 absolute bottom-[6px] -left-[84px] h-auto max-w-full max-[500px]:hidden"
                />
              </div>
            </div>
          </Reveal>

          <div className="about-one__content mt-px max-lg:mt-0">
            <SectionHeading
              tagline={ABOUT.tagline}
              lines={ABOUT.title}
              taglineBg="#ecf5f4"
              className="mb-[7px]"
            />

            <Reveal direction="up" duration={1300}>
              <p className="about-one__text mb-[27px] text-[#636363]">{ABOUT.text}</p>
            </Reveal>

            <Reveal direction="up" duration={1300}>
              <div className="tabs-box">
                <ul className="tab-buttons m-0 flex list-none flex-wrap items-center gap-[30px] p-0">
                  {ABOUT.tabs.map((t) => (
                    <li
                      key={t.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => setActiveTab(t.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setActiveTab(t.id);
                        }
                      }}
                      className={cn(
                        "tab-btn relative cursor-pointer rounded-[50px_0px] border border-[#dddddd] bg-white px-[30px] py-[10px] font-heading text-[16px] leading-[1.562] font-semibold text-[#333333] capitalize transition-all duration-500 hover:border-primary hover:bg-primary hover:text-[#131111]",
                        activeTab === t.id && "active-btn border-primary bg-primary text-[#131111]",
                      )}
                    >
                      {t.label}
                    </li>
                  ))}
                </ul>

                <div className="tabs-content relative mt-8">
                  {ABOUT.tabs.map((t) => (
                    <div key={t.id} className={cn("tab", activeTab === t.id && "active-tab")}>
                      <div className="tabs-content__inner relative z-1 grid grid-cols-[1fr_231px] items-center gap-x-[35px] gap-y-[50px] bg-secondary py-[15px] pr-[15px] pl-[31px] lg:max-xl:grid-cols-1 lg:max-xl:px-5 lg:max-xl:pt-[39px] lg:max-xl:pb-5 max-md:grid-cols-1 max-md:px-5 max-md:pt-[39px] max-md:pb-5">
                        <ul className="tabs-content__list relative m-0 list-none p-0">
                          {ABOUT.checklist.map((line, i) => (
                            <li
                              key={line}
                              className={cn(
                                "relative z-1 flex items-start gap-[18px] font-normal text-[#333333] transition-all duration-500",
                                i > 0 && "mt-2.5",
                              )}
                            >
                              <span className="tabs-content__list__icon relative top-[3px] z-1 inline-flex">
                                <CheckIcon />
                              </span>
                              <Link href="#">{line}</Link>
                            </li>
                          ))}
                        </ul>
                        <div className="tabs-content__image">
                          <Image
                            src={t.image}
                            alt={t.label}
                            width={231}
                            height={147}
                            className="h-auto max-w-full"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/shapes/about-shape-1-2.png"
        alt=""
        width={193}
        height={193}
        aria-hidden="true"
        className="about-one__shape absolute right-[3%] bottom-[50px] h-auto max-w-full min-[1600px]:right-[86px] min-[1600px]:bottom-[90px]"
      />
    </section>
  );
}
