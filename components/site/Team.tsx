import Image from "next/image";
import Link from "next/link";
import { Share2 } from "lucide-react";
import { Container } from "./Container";
import { Carousel } from "./Carousel";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { SocialLinks } from "./SocialLinks";
import { TEAM } from "./home-data";
import { SOCIALS } from "./nav-data";
import "./css/team.css";

/**
 * Team — the `.team-one` owl carousel of `.team-card`s (1 / 2 / 3 / 4 items
 * at 0 / 576 / 992 / 1200, matching the reference's owl-responsive config).
 * Each card is a transparent member cutout over a masked decorative blob,
 * a share button that fans a row of social links out on hover, and an
 * info panel that fills in with the base colour on card hover. Mirrors
 * Features.tsx: layout/type/colour as Tailwind, masks/pseudo-elements/hover
 * choreography in css/team.css.
 */
export function Team() {
  return (
    <section className="team-one section-space bg-white py-30 max-md:py-25 max-sm:py-20">
      <Container>
        <SectionHeading
          tagline={TEAM.tagline}
          lines={TEAM.title}
          align="center"
          taglineBg="#f4ebd8"
        />

        <div className="team-one__carousel mt-[60px]">
          <Carousel
            autoplay={false}
            showDots
            showArrows={false}
            gapClassName="gap-[30px]"
            itemClassName="basis-full sm:basis-[calc(50%-15px)] lg:basis-[calc(33.333%-20px)] xl:basis-[calc(25%-22.5px)]"
            items={TEAM.members.map((member, i) => (
              <Reveal key={member.name} direction="up" duration={1300} delay={(i + 1) * 100}>
                <div className="team-card group relative">
                  <div className="team-card__image relative overflow-hidden text-center">
                    <Image
                      src={member.image}
                      alt={member.name}
                      width={270}
                      height={322}
                      className="relative z-[1] mx-auto h-auto w-auto max-w-full"
                    />

                    <div className="team-card__social absolute right-0 bottom-0 z-[3] h-[45px] w-20">
                      <span className="team-card__social__icon absolute right-0 bottom-0 flex size-[45px] cursor-pointer items-center justify-center rounded-tl-[20px] bg-accent text-white transition-all duration-500 hover:bg-primary hover:text-accent">
                        <Share2 className="size-[18px]" aria-hidden="true" />
                      </span>
                      <SocialLinks socials={SOCIALS} />
                    </div>

                    <div
                      className="team-card__overlay absolute top-0 left-0 z-[1] h-0 w-full bg-accent/50 opacity-0 transition-all duration-500"
                      style={{
                        WebkitMaskImage: `url(${member.image})`,
                        maskImage: `url(${member.image})`,
                      }}
                      aria-hidden="true"
                    />

                    <span
                      className="team-card__shape absolute bottom-0 left-0 h-[242px] w-full bg-muted"
                      aria-hidden="true"
                    />
                  </div>

                  <div className="team-card__info relative z-[1] overflow-hidden rounded-b-[50px] bg-white px-[25px] pt-5 pb-[17px] text-center">
                    <h3 className="team-card__name mb-1.5 text-[22px] leading-[1.318] font-bold text-foreground capitalize transition-colors duration-500 group-hover:text-white sm:max-md:text-[19px]">
                      <Link href="#">{member.name}</Link>
                    </h3>
                    <p className="team-card__designation m-0 capitalize text-muted-foreground transition-colors duration-500 group-hover:text-white">
                      {member.role}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          />
        </div>
      </Container>
    </section>
  );
}
