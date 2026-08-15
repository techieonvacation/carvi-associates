import Image from "next/image";
import Link from "next/link";
import { Globe, Mail } from "lucide-react";
import { LinkedinIcon, XIcon } from "@/components/site/brand-icons";
import type { BlogAuthorItem, BlogPostItem } from "@/lib/cms/types";

type AuthorLike =
  | BlogAuthorItem
  | NonNullable<BlogPostItem["author"]>;

function socialsOf(author: AuthorLike) {
  const full = author as Partial<BlogAuthorItem>;
  return [
    full.linkedinUrl ? { href: full.linkedinUrl, label: "LinkedIn", icon: LinkedinIcon } : null,
    full.twitterUrl ? { href: full.twitterUrl, label: "X", icon: XIcon } : null,
    full.websiteUrl ? { href: full.websiteUrl, label: "Website", icon: Globe } : null,
    full.email ? { href: `mailto:${full.email}`, label: "Email", icon: Mail } : null,
  ].filter((item): item is NonNullable<typeof item> => item !== null);
}

export function AuthorCard({
  author,
  linkToArchive = true,
  postCount,
}: {
  author: AuthorLike;
  linkToArchive?: boolean;
  postCount?: number;
}) {
  const socials = socialsOf(author);
  const href = `/blog/author/${author.slug}`;

  return (
    <div className="author-card flex flex-col gap-5 rounded-[20px] border border-border/60 bg-secondary/40 p-8 max-sm:p-5 sm:flex-row sm:items-start">
      {author.avatarUrl ? (
        <div className="relative size-[92px] shrink-0 overflow-hidden rounded-full border-2 border-white shadow-sm max-sm:size-[72px]">
          <Image
            src={author.avatarUrl}
            alt={author.name}
            fill
            sizes="92px"
            className="object-cover"
          />
        </div>
      ) : null}

      <div className="min-w-0 flex-1">
        <p className="mb-1 text-[11px] font-bold tracking-[0.16em] text-accent uppercase">
          Written by
        </p>
        <h3 className="mb-1 text-[20px] leading-tight font-bold text-foreground">
          {linkToArchive ? (
            <Link href={href} className="text-inherit transition-colors hover:text-accent">
              {author.name}
            </Link>
          ) : (
            author.name
          )}
        </h3>

        <p className="mb-3 text-[14px] font-medium text-muted-foreground">
          {[author.role, author.credentials].filter(Boolean).join(" · ")}
          {typeof postCount === "number" ? ` · ${postCount} article${postCount === 1 ? "" : "s"}` : ""}
        </p>

        {author.bio ? (
          <p className="mb-4 text-[15px] leading-[1.75] text-muted-foreground">{author.bio}</p>
        ) : null}

        {socials.length ? (
          <ul className="flex flex-wrap items-center gap-2">
            {socials.map((social) => {
              const Icon = social.icon;
              const external = social.href.startsWith("http");
              return (
                <li key={social.label}>
                  <a
                    href={social.href}
                    aria-label={`${author.name} on ${social.label}`}
                    className="post-share__btn"
                    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    <Icon className="size-4" aria-hidden="true" />
                  </a>
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
