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

export function Team() {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <SectionHeading align="center" tagline={TEAM.tagline} lines={TEAM.title} />

        <div className="mt-14">
          <Carousel
            autoplay={4200}
            itemClassName="basis-[85%] sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
            items={TEAM.members.map((member, i) => (
              <Reveal key={member.name} direction="up" delay={(i % 4) * 100} className="h-full px-1 pb-1">
                <div className="group relative h-full overflow-hidden rounded-3xl bg-secondary/60 shadow-sm">
                  <div className="relative aspect-4/5 overflow-hidden">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 85vw"
                      className="object-contain object-bottom p-4"
                    />
                    <span className="absolute top-4 right-4 flex size-9 items-center justify-center rounded-full bg-white text-accent shadow">
                      <Share2 className="size-4" aria-hidden="true" />
                    </span>
                    <div className="absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-center bg-accent/95 px-4 py-3 transition-transform duration-300 group-hover:translate-y-0">
                      <SocialLinks socials={SOCIALS} />
                    </div>
                  </div>
                  <div className="border-t border-border bg-card p-5 text-center">
                    <h4 className="font-heading text-lg font-bold text-foreground!">
                      <Link href="#" className="hover:text-accent">
                        {member.name}
                      </Link>
                    </h4>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
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
