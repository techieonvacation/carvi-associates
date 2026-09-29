import {
  BLOG_CONTENT_TYPES,
  BLOG_POST_STATUSES,
  HERO_ALIGNMENTS,
  HERO_HEIGHTS,
  type BlogAuthorItem,
  type BlogCategoryItem,
  type BlogCommentItem,
  type BlogCommentStatus,
  type BlogContentType,
  type BlogFaq,
  type BlogPostItem,
  type BlogPostStatus,
  type BlogSectionContent,
  type BlogSource,
  type BlogTagItem,
  type HeroAlignment,
  type HeroHeight,
} from "@/lib/cms/blog-types";
import { estimateReadingMinutes, sanitizeBlogHtml } from "@/lib/cms/blog-sanitize";
import { normalizeNullable, slugify } from "@/lib/cms/service-mappers";
import type {
  BlogAuthorInput,
  BlogCategoryInput,
  BlogPostInput,
  BlogTagInput,
} from "@/lib/cms/blog-schemas";

export function parseContentType(value: unknown): BlogContentType {
  return typeof value === "string" && (BLOG_CONTENT_TYPES as readonly string[]).includes(value)
    ? (value as BlogContentType)
    : "BLOG";
}

export function parsePostStatus(value: unknown): BlogPostStatus {
  return typeof value === "string" && (BLOG_POST_STATUSES as readonly string[]).includes(value)
    ? (value as BlogPostStatus)
    : "DRAFT";
}

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function asStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

export function parseFaqs(value: unknown): BlogFaq[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((raw) => {
    if (!raw || typeof raw !== "object") return [];
    const faq = raw as Record<string, unknown>;
    const question = asString(faq.question);
    const answer = asString(faq.answer);
    return question && answer ? [{ question, answer }] : [];
  });
}

export function parseSources(value: unknown): BlogSource[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((raw) => {
    if (!raw || typeof raw !== "object") return [];
    const source = raw as Record<string, unknown>;
    const label = asString(source.label);
    const url = asString(source.url);
    return label && url ? [{ label, url }] : [];
  });
}

export function claimSlug(
  preferred: string | null | undefined,
  fallback: string,
  taken: Set<string>,
) {
  const base = normalizeNullable(preferred ?? null) ?? slugify(fallback);
  const safeBase = base || "post";

  let candidate = safeBase;
  let counter = 2;
  while (taken.has(candidate)) {
    candidate = `${safeBase}-${counter}`;
    counter += 1;
  }
  taken.add(candidate);
  return candidate;
}

export function stripTrashPrefix(slug: string): string {
  return slug.replace(/^trashed-[a-z0-9]+-/, "");
}

type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  accentColor: string;
  imageUrl: string | null;
  displayOrder: number;
  isFeatured: boolean;
  isVisible: boolean;
  isActive: boolean;
  deletedAt: Date | null;
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string | null;
  noIndex: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  _count?: { posts: number };
};

export function mapBlogCategory(row: CategoryRow): BlogCategoryItem {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    icon: row.icon,
    accentColor: row.accentColor,
    imageUrl: row.imageUrl,
    displayOrder: row.displayOrder,
    isFeatured: row.isFeatured,
    isVisible: row.isVisible,
    isActive: row.isActive,
    deletedAt: row.deletedAt?.toISOString() ?? null,
    seoTitle: row.seoTitle,
    seoDescription: row.seoDescription,
    seoKeywords: row.seoKeywords,
    noIndex: row.noIndex,
    ...(row._count ? { postCount: row._count.posts } : {}),
    ...(row.createdAt ? { createdAt: row.createdAt.toISOString() } : {}),
    ...(row.updatedAt ? { updatedAt: row.updatedAt.toISOString() } : {}),
  };
}

type TagRow = {
  id: string;
  name: string;
  slug: string;
  description: string;
  isVisible: boolean;
  isActive: boolean;
  deletedAt: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
  _count?: { posts: number };
};

export function mapBlogTag(row: TagRow): BlogTagItem {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    isVisible: row.isVisible,
    isActive: row.isActive,
    deletedAt: row.deletedAt?.toISOString() ?? null,
    ...(row._count ? { postCount: row._count.posts } : {}),
    ...(row.createdAt ? { createdAt: row.createdAt.toISOString() } : {}),
    ...(row.updatedAt ? { updatedAt: row.updatedAt.toISOString() } : {}),
  };
}

type AuthorRow = {
  id: string;
  name: string;
  slug: string;
  role: string;
  credentials: string;
  bio: string;
  avatarUrl: string;
  email: string | null;
  linkedinUrl: string | null;
  twitterUrl: string | null;
  websiteUrl: string | null;
  displayOrder: number;
  isVisible: boolean;
  isActive: boolean;
  deletedAt: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
  _count?: { posts: number };
};

export function mapBlogAuthor(row: AuthorRow): BlogAuthorItem {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    role: row.role,
    credentials: row.credentials,
    bio: row.bio,
    avatarUrl: row.avatarUrl,
    email: row.email,
    linkedinUrl: row.linkedinUrl,
    twitterUrl: row.twitterUrl,
    websiteUrl: row.websiteUrl,
    displayOrder: row.displayOrder,
    isVisible: row.isVisible,
    isActive: row.isActive,
    deletedAt: row.deletedAt?.toISOString() ?? null,
    ...(row._count ? { postCount: row._count.posts } : {}),
    ...(row.createdAt ? { createdAt: row.createdAt.toISOString() } : {}),
    ...(row.updatedAt ? { updatedAt: row.updatedAt.toISOString() } : {}),
  };
}

type PostRow = {
  id: string;
  title: string;
  slug: string;
  subtitle: string | null;
  excerpt: string;
  contentHtml: string;
  keyTakeaways: unknown;
  faqs: unknown;
  sources: unknown;
  coverImageUrl: string;
  coverImageAlt: string;
  thumbnailUrl: string | null;
  contentType: string;
  status: string;
  categoryId: string | null;
  authorId: string | null;
  readingMinutes: number;
  viewCount: number;
  displayOrder: number;
  isFeatured: boolean;
  isPinned: boolean;
  allowComments: boolean;
  isVisible: boolean;
  isActive: boolean;
  publishedAt: Date | null;
  deletedAt: Date | null;
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string | null;
  canonicalUrl: string | null;
  ogImageUrl: string | null;
  twitterImageUrl: string | null;
  noIndex: boolean;
  createdAt: Date;
  updatedAt: Date;
  category?: {
    id: string;
    name: string;
    slug: string;
    accentColor: string;
    icon: string;
  } | null;
  author?: {
    id: string;
    name: string;
    slug: string;
    role: string;
    credentials: string;
    avatarUrl: string;
    bio: string;
  } | null;
  tags?: Array<{ tag: { id: string; name: string; slug: string } }>;
  _count?: { comments: number };
};

export function mapBlogPost(row: PostRow): BlogPostItem {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    subtitle: row.subtitle,
    excerpt: row.excerpt,
    contentHtml: row.contentHtml,
    keyTakeaways: asStringArray(row.keyTakeaways),
    faqs: parseFaqs(row.faqs),
    sources: parseSources(row.sources),
    coverImageUrl: row.coverImageUrl,
    coverImageAlt: row.coverImageAlt,
    thumbnailUrl: row.thumbnailUrl,
    contentType: parseContentType(row.contentType),
    status: parsePostStatus(row.status),
    categoryId: row.categoryId,
    authorId: row.authorId,
    category: row.category ?? null,
    author: row.author ?? null,
    tags: row.tags?.map((link) => link.tag) ?? [],
    readingMinutes: row.readingMinutes || estimateReadingMinutes(row.contentHtml, row.excerpt),
    viewCount: row.viewCount,
    commentCount: row._count?.comments ?? 0,
    displayOrder: row.displayOrder,
    isFeatured: row.isFeatured,
    isPinned: row.isPinned,
    allowComments: row.allowComments,
    isVisible: row.isVisible,
    isActive: row.isActive,
    publishedAt: row.publishedAt?.toISOString() ?? null,
    deletedAt: row.deletedAt?.toISOString() ?? null,
    seoTitle: row.seoTitle,
    seoDescription: row.seoDescription,
    seoKeywords: row.seoKeywords,
    canonicalUrl: row.canonicalUrl,
    ogImageUrl: row.ogImageUrl,
    twitterImageUrl: row.twitterImageUrl,
    noIndex: row.noIndex,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

type CommentRow = {
  id: string;
  postId: string;
  parentId: string | null;
  name: string;
  email: string;
  website: string | null;
  body: string;
  status: string;
  isPinned: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt?: Date;
  post?: { title: string; slug: string } | null;
};

export function mapBlogComment(row: CommentRow): BlogCommentItem {
  return {
    id: row.id,
    postId: row.postId,
    parentId: row.parentId,
    name: row.name,
    email: row.email,
    website: row.website,
    body: row.body,
    status: row.status as BlogCommentStatus,
    isPinned: row.isPinned,
    deletedAt: row.deletedAt?.toISOString() ?? null,
    createdAt: row.createdAt.toISOString(),
    ...(row.updatedAt ? { updatedAt: row.updatedAt.toISOString() } : {}),
    ...(row.post ? { postTitle: row.post.title, postSlug: row.post.slug } : {}),
  };
}

type SectionRow = {
  tagline: string;
  titleLine1: string;
  titleLine2: string;
  taglineBg: string;
  homeLimit: number;
  homeCtaText: string;
  homeCtaHref: string;
  showHomeCta: boolean;
  isVisible: boolean;
  archiveTagline: string;
  archiveTitleLine1: string;
  archiveTitleLine2: string;
  archiveIntro: string;
  archiveHeroImage: string;
  archiveHeroOverlay: number;
  archiveHeroHeight: string;
  archiveHeroAlign: string;
  archiveShowCrumbs: boolean;
  postsPerPage: number;
  showSidebar: boolean;
  showSearch: boolean;
  showCategories: boolean;
  showTags: boolean;
  allowComments: boolean;
  moderateComments: boolean;
  disclaimer: string;
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string | null;
  canonicalUrl: string | null;
  ogImageUrl: string | null;
  twitterImageUrl: string | null;
  noIndex: boolean;
};

export function clampOverlay(value: number): number {
  if (!Number.isFinite(value)) return 82;
  return Math.min(95, Math.max(0, Math.round(value)));
}

export function normalizeHeroHeight(value: string): HeroHeight {
  return (HERO_HEIGHTS as readonly string[]).includes(value)
    ? (value as HeroHeight)
    : "standard";
}

export function normalizeHeroAlignment(value: string): HeroAlignment {
  return (HERO_ALIGNMENTS as readonly string[]).includes(value)
    ? (value as HeroAlignment)
    : "center";
}

export function mapBlogSection(row: SectionRow): BlogSectionContent {
  return {
    tagline: row.tagline,
    title: [row.titleLine1, row.titleLine2],
    taglineBg: row.taglineBg,
    homeLimit: row.homeLimit,
    homeCtaText: row.homeCtaText,
    homeCtaHref: row.homeCtaHref,
    showHomeCta: row.showHomeCta,
    isVisible: row.isVisible,
    archiveTagline: row.archiveTagline,
    archiveTitle: [row.archiveTitleLine1, row.archiveTitleLine2],
    archiveIntro: row.archiveIntro,
    archiveHeroImage: row.archiveHeroImage,
    archiveHeroOverlay: clampOverlay(row.archiveHeroOverlay),
    archiveHeroHeight: normalizeHeroHeight(row.archiveHeroHeight),
    archiveHeroAlign: normalizeHeroAlignment(row.archiveHeroAlign),
    archiveShowCrumbs: row.archiveShowCrumbs,
    postsPerPage: row.postsPerPage,
    showSidebar: row.showSidebar,
    showSearch: row.showSearch,
    showCategories: row.showCategories,
    showTags: row.showTags,
    allowComments: row.allowComments,
    moderateComments: row.moderateComments,
    disclaimer: row.disclaimer,
    seoTitle: row.seoTitle,
    seoDescription: row.seoDescription,
    seoKeywords: row.seoKeywords,
    canonicalUrl: row.canonicalUrl,
    ogImageUrl: row.ogImageUrl,
    twitterImageUrl: row.twitterImageUrl,
    noIndex: row.noIndex,
  };
}

export function resolvePublishedAt(
  status: BlogPostStatus,
  provided: string | null | undefined,
  existing: Date | null = null,
): Date | null {
  const parsed = provided ? new Date(provided) : null;
  const valid = parsed && !Number.isNaN(parsed.getTime()) ? parsed : null;

  if (status === "PUBLISHED") return valid ?? existing ?? new Date();
  return valid ?? existing;
}

export function blogPostWriteData(
  input: BlogPostInput,
  options: { slug: string; displayOrder: number; existingPublishedAt?: Date | null },
) {
  const contentHtml = sanitizeBlogHtml(input.contentHtml);

  return {
    title: input.title.trim(),
    slug: options.slug,
    subtitle: normalizeNullable(input.subtitle),
    excerpt: input.excerpt.trim(),
    contentHtml,
    keyTakeaways: input.keyTakeaways.map((item) => item.trim()).filter(Boolean),
    faqs: input.faqs.map((faq) => ({
      question: faq.question.trim(),
      answer: faq.answer.trim(),
    })),
    sources: input.sources.map((source) => ({
      label: source.label.trim(),
      url: source.url.trim(),
    })),
    coverImageUrl: input.coverImageUrl.trim(),
    coverImageAlt: (input.coverImageAlt || input.title).trim(),
    thumbnailUrl: normalizeNullable(input.thumbnailUrl),
    contentType: input.contentType,
    status: input.status,
    categoryId: normalizeNullable(input.categoryId),
    authorId: normalizeNullable(input.authorId),
    readingMinutes: input.readingMinutes || estimateReadingMinutes(contentHtml, input.excerpt),
    displayOrder: options.displayOrder,
    isFeatured: input.isFeatured,
    isPinned: input.isPinned,
    allowComments: input.allowComments,
    isVisible: input.isVisible,
    isActive: input.isActive,
    publishedAt: resolvePublishedAt(
      input.status,
      input.publishedAt,
      options.existingPublishedAt ?? null,
    ),
    seoTitle: normalizeNullable(input.seoTitle),
    seoDescription: normalizeNullable(input.seoDescription),
    seoKeywords: normalizeNullable(input.seoKeywords),
    canonicalUrl: normalizeNullable(input.canonicalUrl),
    ogImageUrl: normalizeNullable(input.ogImageUrl),
    twitterImageUrl: normalizeNullable(input.twitterImageUrl),
    noIndex: input.noIndex,
    deletedAt: null,
  };
}

export function blogCategoryWriteData(
  input: BlogCategoryInput,
  slug: string,
  displayOrder: number,
) {
  return {
    name: input.name.trim(),
    slug,
    description: input.description.trim(),
    icon: input.icon.trim() || "icon-folder",
    accentColor: input.accentColor.trim() || "#5c6b45",
    imageUrl: normalizeNullable(input.imageUrl),
    displayOrder,
    isFeatured: input.isFeatured,
    isVisible: input.isVisible,
    isActive: input.isActive,
    seoTitle: normalizeNullable(input.seoTitle),
    seoDescription: normalizeNullable(input.seoDescription),
    seoKeywords: normalizeNullable(input.seoKeywords),
    noIndex: input.noIndex,
    deletedAt: null,
  };
}

export function blogTagWriteData(input: BlogTagInput, slug: string) {
  return {
    name: input.name.trim(),
    slug,
    description: input.description.trim(),
    isVisible: input.isVisible,
    isActive: input.isActive,
    deletedAt: null,
  };
}

export function blogAuthorWriteData(
  input: BlogAuthorInput,
  slug: string,
  displayOrder: number,
) {
  return {
    name: input.name.trim(),
    slug,
    role: input.role.trim(),
    credentials: input.credentials.trim(),
    bio: input.bio.trim(),
    avatarUrl: input.avatarUrl.trim(),
    email: normalizeNullable(input.email),
    linkedinUrl: normalizeNullable(input.linkedinUrl),
    twitterUrl: normalizeNullable(input.twitterUrl),
    websiteUrl: normalizeNullable(input.websiteUrl),
    displayOrder,
    isVisible: input.isVisible,
    isActive: input.isActive,
    deletedAt: null,
  };
}
