import Image from "next/image";
import { Container } from "./Container";
import { Carousel } from "./Carousel";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { SocialLinks } from "./SocialLinks";
import { SmartLink } from "./SmartLink";
import type { TeamContent, TeamMemberItem } from "@/lib/cms/types";
import "./css/team.css";

type TeamProps = {
  team: TeamContent;
};

function ShareIcon() {
  return (
    <svg viewBox="0 0 448 512" width="1em" height="1em" fill="currentColor" aria-hidden="true">
      <path d="M352 224c53 0 96-43 96-96s-43-96-96-96-96 43-96 96c0 4 .2 8 .7 11.9l-94.1 47c-16.4-14.3-37.9-23-61.3-23-53 0-96 43-96 96s43 96 96 96c23.4 0 44.9-8.4 61.3-22.9l94.1 47c-.5 3.8-.7 7.8-.7 11.8 0 53 43 96 96 96s96-43 96-96-43-96-96-96c-23.4 0-44.9 8.4-61.3 22.9l-94.1-47c.5-3.8.7-7.8.7-11.8s-.2-8-.7-11.9l94.1-47C307.1 215.4 328.6 224 352 224z" />
    </svg>
  );
}

function MemberCard({ member }: { member: TeamMemberItem }) {
  const socials = member.socials.filter((social) => social.href.trim());
  const href = member.href.trim();

  return (
    <div className="team-card-two group h-full">
      <div className="team-card-two__image">
        <div className="team-card-two__image__inner relative aspect-[370/430]">
          <Image
            src={member.imageUrl}
            alt={member.imageAlt || member.name}
            fill
            sizes="(max-width: 767px) 100vw, (max-width: 991px) 50vw, 33vw"
          />
        </div>
      </div>
      <div className="team-card-two__info">
        {socials.length ? (
          <div className="team-card-two__social">
            <span className="team-card-two__social__icon">
              <ShareIcon />
            </span>
            <SocialLinks socials={socials} />
          </div>
        ) : null}
        <div className="team-card-two__info__inner">
          <h3 className="team-card-two__name">
            {href && href !== "#" ? (
              <SmartLink href={href}>{member.name}</SmartLink>
            ) : (
              member.name
            )}
          </h3>
          <p className="team-card-two__designation">{member.role}</p>
        </div>
      </div>
    </div>
  );
}

export function Team({ team }: TeamProps) {
  if (!team.isVisible || !team.members.length) {
    return null;
  }

  return (
    <section id="team" className="team-two section-space py-30 max-md:py-25 max-sm:py-20">
      <div
        className="team-two__bg"
        style={
          team.backgroundImageUrl
            ? { backgroundImage: `url(${team.backgroundImageUrl})` }
            : undefined
        }
        role={team.backgroundImageAlt ? "img" : undefined}
        aria-label={team.backgroundImageAlt || undefined}
        aria-hidden={team.backgroundImageAlt ? undefined : true}
      />

      <Container className="team-two__inner">
        <SectionHeading
          tagline={team.tagline}
          lines={[...team.title]}
          align="center"
          taglineBg={team.taglineBg}
          light
        />

        <div className="team-two__carousel">
          <Carousel
            autoplay={false}
            showDots
            showArrows={false}
            gapClassName="gap-[30px]"
            itemClassName="basis-full md:basis-[calc(50%-15px)] lg:basis-[calc(33.333%-20px)]"
            items={team.members.map((member, index) => (
              <Reveal
                key={member.id}
                direction="up"
                duration={1300}
                delay={(index + 1) * 100}
                className="h-full"
              >
                <MemberCard member={member} />
              </Reveal>
            ))}
          />
        </div>
      </Container>
    </section>
  );
}
