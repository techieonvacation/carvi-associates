import Image from "next/image";
import Link from "next/link";
import { Container } from "./Container";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { BLOG } from "./home-data";
import "./css/blog.css";

/**
 * Blog — the `.blog-one--home1` "Our Latest Blog" grid: a mint gradient wash
 * behind a centered heading, then three `.blog-card`s (white, rounded,
 * bordered) each with a circular author badge overlapping the image's
 * bottom edge, a tag/comment meta row, a bold two-line title, and the
 * two-tone `.findox-btn--base` "learn more" pill. Mirrors the reference
 * `row gutter-y-30` / `col-lg-4 col-md-6` grid (1 / 2 / 3 columns at
 * 0 / 768 / 992).
 */
export function Blog() {
  return (
    <section className="blog-one blog-one--home1 relative overflow-hidden bg-white py-30 max-md:py-25 max-sm:py-20">
      <Container className="relative z-10">
        <Reveal direction="up">
          <SectionHeading align="center" tagline={BLOG.tagline} lines={BLOG.title} />
        </Reveal>

        <div className="grid grid-cols-1 gap-7.5 md:grid-cols-2 lg:grid-cols-3">
          {BLOG.posts.map((post, i) => (
            <Reveal key={post.title} direction="up" delay={i * 100} duration={1300}>
              <div className="blog-card relative overflow-hidden rounded-[20px] bg-white p-2.5">
                <div className="blog-card__image relative z-1 overflow-hidden rounded-t-[15px]">
                  <Image
                    src={post.image}
                    alt={post.title}
                    width={350}
                    height={263}
                    sizes="(min-width: 992px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="block h-auto w-full rounded-[inherit]"
                  />
                  <Link href="#" className="blog-card__image__link">
                    <span className="sr-only">{post.title}</span>
                  </Link>
                </div>

                <div className="blog-card__content relative z-1 px-5 pb-7.5 max-[412px]:px-2.5 max-[412px]:pb-3.75 md:max-xl:px-2.5 md:max-xl:pb-3.75">
                  <div className="blog-card__admin inline-flex items-center gap-3.25 rounded-full border border-[#dddddd] bg-white py-2.5 pr-6.25 pl-2.5">
                    <div className="relative size-12.5 shrink-0 overflow-hidden rounded-full">
                      <Image
                        src={post.avatar}
                        alt={post.author}
                        fill
                        sizes="50px"
                        className="object-cover"
                      />
                    </div>
                    <div className="blog-card__admin__info">
                      <h4 className="blog-card__admin__name mb-0.75 text-base leading-tight font-bold text-[#222222] capitalize">
                        {post.author}
                      </h4>
                      <p className="blog-card__admin__date m-0 text-base text-muted-foreground">
                        {post.date}
                      </p>
                    </div>
                  </div>

                  <ul className="blog-card__meta m-0 mb-3.75 flex list-none items-center gap-x-4.25 gap-y-2.5 p-0 max-[412px]:flex-col max-[412px]:items-start md:max-xl:flex-col md:max-xl:items-start">
                    <li className="flex items-start gap-2 text-base leading-tight font-normal text-muted-foreground">
                      <span className="blog-card__meta__icon text-lg text-accent">
                        <i className="icon-tag" aria-hidden="true" />
                      </span>
                      <Link href="#" className="hover:text-primary">
                        Finance Agency
                      </Link>
                    </li>
                    <li className="flex items-start gap-2 text-base leading-tight font-normal text-muted-foreground">
                      <span className="blog-card__meta__icon text-lg text-accent">
                        <i className="icon-comment" aria-hidden="true" />
                      </span>
                      <Link href="#" className="hover:text-primary">
                        Comments (3)
                      </Link>
                    </li>
                  </ul>

                  <h3 className="blog-card__title mb-6.75 text-[22px] leading-[1.272] font-bold text-[#222222] max-[375px]:text-xl lg:max-xl:text-xl">
                    <Link href="#" className="text-inherit hover:text-primary">
                      {post.title}
                    </Link>
                  </h3>

                  <a href="#" className="findox-btn findox-btn--base">
                    <span className="findox-btn__text">learn more</span>
                    <span className="findox-btn__icon-box">
                      <span className="findox-btn__icon">
                        <i className="icon-arrow-right-up" aria-hidden="true" />
                        <i className="icon-arrow-right-up" aria-hidden="true" />
                      </span>
                    </span>
                  </a>
                </div>

                <div
                  className="blog-card__border pointer-events-none absolute inset-0 rounded-[inherit] border border-[#dddddd] transition-colors duration-500"
                  aria-hidden="true"
                />
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
