import Image from "next/image";
import Link from "next/link";
import type { BlogPostItem } from "@/lib/cms/types";
import { cn } from "@/lib/utils";
import { formatCardDate } from "./blog-format";

export function PostCard({
  post,
  className,
}: {
  post: BlogPostItem;
  className?: string;
}) {
  const href = `/blog/${post.slug}`;
  const authorName = post.author?.name ?? "Carvi Associates";
  const avatar = post.author?.avatarUrl || "/images/blog/blog-admin-1-1.png";

  return (
    <div
      className={cn(
        "blog-card relative h-full overflow-hidden rounded-[20px] bg-white p-2.5",
        className,
      )}
    >
      <div className="blog-card__image relative z-1 aspect-[350/263] overflow-hidden rounded-t-[15px]">
        <Image
          src={post.thumbnailUrl || post.coverImageUrl}
          alt={post.coverImageAlt || post.title}
          fill
          sizes="(min-width: 992px) 33vw, (min-width: 768px) 50vw, 100vw"
          className="rounded-[inherit] object-cover"
        />
        <Link href={href} className="blog-card__image__link">
          <span className="sr-only">{post.title}</span>
        </Link>
      </div>

      <div className="blog-card__content relative z-1 flex flex-col px-5 pb-7.5 max-[412px]:px-2.5 max-[412px]:pb-3.75 md:max-xl:px-2.5 md:max-xl:pb-3.75">
        <div className="blog-card__admin inline-flex items-center gap-3.25 rounded-full border border-border bg-white py-2.5 pr-6.25 pl-2.5">
          <div className="relative size-12.5 shrink-0 overflow-hidden rounded-full">
            <Image src={avatar} alt={authorName} fill sizes="50px" className="object-cover" />
          </div>
          <div className="blog-card__admin__info">
            <h4 className="blog-card__admin__name mb-0.75 text-base leading-tight font-bold text-foreground capitalize">
              {authorName}
            </h4>
            <p className="blog-card__admin__date m-0 text-base text-muted-foreground">
              {formatCardDate(post.publishedAt ?? post.createdAt ?? null)}
            </p>
          </div>
        </div>

        <ul className="blog-card__meta m-0 mb-3.75 flex list-none items-center gap-x-4.25 gap-y-2.5 p-0 max-[412px]:flex-col max-[412px]:items-start md:max-xl:flex-col md:max-xl:items-start">
          <li className="flex items-start gap-2 text-base leading-tight font-normal text-muted-foreground">
            <span className="blog-card__meta__icon text-lg text-accent">
              <i className="icon-tag" aria-hidden="true" />
            </span>
            {post.category ? (
              <Link href={`/blog/category/${post.category.slug}`} className="hover:text-accent">
                {post.category.name}
              </Link>
            ) : (
              <span>Insights</span>
            )}
          </li>
          <li className="flex items-start gap-2 text-base leading-tight font-normal text-muted-foreground">
            <span className="blog-card__meta__icon text-lg text-accent">
              <i className="icon-comment" aria-hidden="true" />
            </span>
            <Link href={`${href}#comments`} className="hover:text-accent">
              Comments ({post.commentCount})
            </Link>
          </li>
        </ul>

        <h3 className="blog-card__title mb-6.75 text-[22px] leading-[1.272] font-bold text-foreground max-[375px]:text-xl lg:max-xl:text-xl">
          <Link href={href} className="text-inherit hover:text-accent">
            {post.title}
          </Link>
        </h3>

        <Link href={href} className="findox-btn findox-btn--base mt-auto self-start">
          <span className="findox-btn__text">learn more</span>
          <span className="findox-btn__icon-box">
            <span className="findox-btn__icon">
              <i className="icon-arrow-right-up" aria-hidden="true" />
              <i className="icon-arrow-right-up" aria-hidden="true" />
            </span>
          </span>
        </Link>
      </div>

      <div
        className="blog-card__border pointer-events-none absolute inset-0 rounded-[inherit] border border-border transition-colors duration-500"
        aria-hidden="true"
      />
    </div>
  );
}

export function PostRailCard({ post }: { post: BlogPostItem }) {
  const href = `/blog/${post.slug}`;

  return (
    <li className="flex items-start gap-4.5">
      <Link
        href={href}
        className="relative size-20 shrink-0 overflow-hidden rounded-[10px] border border-border/50"
      >
        <Image
          src={post.thumbnailUrl || post.coverImageUrl}
          alt={post.coverImageAlt || post.title}
          fill
          sizes="80px"
          className="object-cover transition-transform duration-500 hover:scale-110"
        />
      </Link>
      <div className="min-w-0">
        <p className="mb-1.5 flex items-center gap-2 text-sm text-muted-foreground">
          <i className="icon-calendar text-xs text-accent" aria-hidden="true" />
          {formatCardDate(post.publishedAt ?? post.createdAt ?? null)}
        </p>
        <h4 className="text-base leading-[1.45] font-bold text-foreground">
          <Link href={href} className="text-inherit transition-colors duration-500 hover:text-accent">
            {post.title}
          </Link>
        </h4>
      </div>
    </li>
  );
}
