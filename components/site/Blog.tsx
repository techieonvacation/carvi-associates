import Image from "next/image";
import Link from "next/link";
import { Container } from "./Container";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { BLOG } from "./home-data";

export function Blog() {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <SectionHeading align="center" tagline={BLOG.tagline} lines={BLOG.title} />

        <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {BLOG.posts.map((post, i) => (
            <Reveal key={post.title} direction="up" delay={(i % 3) * 100}>
              <article className="group h-full overflow-hidden rounded-3xl border border-border bg-card transition-shadow hover:shadow-lg">
                <div className="relative aspect-4/3 overflow-hidden">
                  <Image
                    src={post.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <i className="icon-tag text-accent" aria-hidden="true" />
                      Finance Agency
                    </span>
                    <span className="flex items-center gap-1.5">
                      <i className="icon-comment text-accent" aria-hidden="true" />
                      Comments (3)
                    </span>
                  </div>
                  <h4 className="mt-3 font-heading text-lg leading-snug font-bold text-foreground!">
                    <Link href="#" className="hover:text-accent">
                      {post.title}
                    </Link>
                  </h4>

                  <div className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                    <div className="relative size-9 shrink-0 overflow-hidden rounded-full bg-secondary">
                      <Image src={post.avatar} alt={post.author} fill sizes="36px" className="object-cover" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{post.author}</p>
                      <p className="text-xs text-muted-foreground">{post.date}</p>
                    </div>
                  </div>

                  <Link
                    href="#"
                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-accent transition-colors hover:text-primary"
                  >
                    Learn More
                    <i className="icon-arrow-right-up" aria-hidden="true" />
                  </Link>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
