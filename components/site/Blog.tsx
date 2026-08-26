import Link from "next/link";
import { Container } from "./Container";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { PostCard } from "@/components/blog/PostCard";
import type { BlogHomeContent } from "@/lib/cms/types";
import "./css/blog.css";

export function Blog({ blog }: { blog: BlogHomeContent }) {
  const { section, posts } = blog;

  if (!section.isVisible || !posts.length) {
    return null;
  }

  return (
    <section id="blog" className="blog-one blog-one--home1 relative overflow-hidden bg-white py-30 max-md:py-25 max-sm:py-20">
      <Container className="relative z-10">
        <Reveal direction="up">
          <SectionHeading
            align="center"
            tagline={section.tagline}
            lines={[...section.title]}
            taglineBg={section.taglineBg}
          />
        </Reveal>

        <div className="grid grid-cols-1 gap-7.5 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <Reveal
              key={post.id}
              direction="up"
              delay={i * 100}
              duration={1300}
              className="h-full"
            >
              <PostCard post={post} />
            </Reveal>
          ))}
        </div>

        {section.showHomeCta ? (
          <Reveal direction="up" delay={200}>
            <div className="mt-15 flex justify-center max-md:mt-12">
              <Link href={section.homeCtaHref} className="findox-btn">
                <span className="findox-btn__text">{section.homeCtaText}</span>
                <span className="findox-btn__icon-box">
                  <span className="findox-btn__icon">
                    <i className="icon-arrow-right-up" aria-hidden="true" />
                    <i className="icon-arrow-right-up" aria-hidden="true" />
                  </span>
                </span>
              </Link>
            </div>
          </Reveal>
        ) : null}
      </Container>
    </section>
  );
}
