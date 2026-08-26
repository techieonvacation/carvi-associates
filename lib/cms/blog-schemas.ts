import { z } from "zod";
import {
  BLOG_COMMENT_STATUSES,
  BLOG_CONTENT_TYPES,
  BLOG_POST_STATUSES,
  HERO_ALIGNMENTS,
  HERO_HEIGHTS,
} from "@/lib/cms/blog-types";

const optionalText = z.string().optional().nullable();
const optionalUrl = z.string().optional().nullable();
const slug = z
  .string()
  .min(1)
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use a lowercase slug (letters, numbers, hyphens)");

export const blogFaqSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
});

export const blogSourceSchema = z.object({
  label: z.string().min(1),
  url: z.string().min(1),
});

export const blogSectionSchema = z.object({
  tagline: z.string().min(1),
  titleLine1: z.string().min(1),
  titleLine2: z.string().min(1),
  taglineBg: z.string().min(1),
  homeLimit: z.number().int().min(1).max(12),
  homeCtaText: z.string().min(1),
  homeCtaHref: z.string().min(1),
  showHomeCta: z.boolean(),
  isVisible: z.boolean(),
  archiveTagline: z.string().min(1),
  archiveTitleLine1: z.string().min(1),
  archiveTitleLine2: z.string().min(1),
  archiveIntro: z.string().min(1),
  archiveHeroImage: z.string().min(1),
  archiveHeroOverlay: z.number().int().min(0).max(95),
  archiveHeroHeight: z.enum(HERO_HEIGHTS),
  archiveHeroAlign: z.enum(HERO_ALIGNMENTS),
  archiveShowCrumbs: z.boolean(),
  postsPerPage: z.number().int().min(3).max(48),
  showSidebar: z.boolean(),
  showSearch: z.boolean(),
  showCategories: z.boolean(),
  showTags: z.boolean(),
  showNewsletter: z.boolean(),
  allowComments: z.boolean(),
  moderateComments: z.boolean(),
  disclaimer: z.string(),
  seoTitle: optionalText,
  seoDescription: optionalText,
  seoKeywords: optionalText,
  canonicalUrl: optionalUrl,
  ogImageUrl: optionalUrl,
  twitterImageUrl: optionalUrl,
  noIndex: z.boolean(),
});

export const blogAuthorSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Author name is required"),
  slug: z.union([z.literal(""), slug]).optional(),
  role: z.string().default(""),
  credentials: z.string().default(""),
  bio: z.string().default(""),
  avatarUrl: z.string().default(""),
  email: optionalText,
  linkedinUrl: optionalUrl,
  twitterUrl: optionalUrl,
  websiteUrl: optionalUrl,
  displayOrder: z.number().int().optional(),
  isVisible: z.boolean(),
  isActive: z.boolean(),
});

export const blogCategorySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Category name is required"),
  slug: z.union([z.literal(""), slug]).optional(),
  description: z.string().default(""),
  icon: z.string().default("icon-folder"),
  accentColor: z.string().default("#006654"),
  imageUrl: optionalUrl,
  displayOrder: z.number().int().optional(),
  isFeatured: z.boolean(),
  isVisible: z.boolean(),
  isActive: z.boolean(),
  seoTitle: optionalText,
  seoDescription: optionalText,
  seoKeywords: optionalText,
  noIndex: z.boolean(),
});

export const blogTagSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Tag name is required"),
  slug: z.union([z.literal(""), slug]).optional(),
  description: z.string().default(""),
  isVisible: z.boolean(),
  isActive: z.boolean(),
});

export const blogPostSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required").max(200),
  slug: z.union([z.literal(""), slug]).optional(),
  subtitle: optionalText,
  excerpt: z.string().min(1, "Excerpt is required").max(500),
  contentHtml: z.string().default(""),
  keyTakeaways: z.array(z.string().min(1)).default([]),
  faqs: z.array(blogFaqSchema).default([]),
  sources: z.array(blogSourceSchema).default([]),
  coverImageUrl: z.string().min(1, "Cover image is required"),
  coverImageAlt: z.string().default(""),
  thumbnailUrl: optionalUrl,
  contentType: z.enum(BLOG_CONTENT_TYPES),
  status: z.enum(BLOG_POST_STATUSES),
  categoryId: optionalText,
  authorId: optionalText,
  tagIds: z.array(z.string().min(1)).default([]),
  readingMinutes: z.number().int().min(0).max(180).optional(),
  displayOrder: z.number().int().optional(),
  isFeatured: z.boolean(),
  isPinned: z.boolean(),
  allowComments: z.boolean(),
  isVisible: z.boolean(),
  isActive: z.boolean(),
  publishedAt: optionalText,
  seoTitle: optionalText,
  seoDescription: optionalText,
  seoKeywords: optionalText,
  canonicalUrl: optionalUrl,
  ogImageUrl: optionalUrl,
  twitterImageUrl: optionalUrl,
  noIndex: z.boolean(),
});

export const blogReorderSchema = z.object({
  orderedIds: z.array(z.string().min(1)).min(1),
});

export const blogBulkSchema = z.object({
  ids: z.array(z.string().min(1)).min(1),
  action: z.enum([
    "publish",
    "draft",
    "archive",
    "show",
    "hide",
    "activate",
    "deactivate",
    "feature",
    "unfeature",
    "pin",
    "unpin",
    "soft-delete",
    "restore",
    "hard-delete",
    "duplicate",
  ]),
});

export const blogCommentModerationSchema = z.object({
  ids: z.array(z.string().min(1)).min(1),
  action: z.enum(["approve", "reject", "spam", "pending", "pin", "unpin", "delete"]),
});

export const blogCommentAdminUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  body: z.string().min(1).optional(),
  status: z.enum(BLOG_COMMENT_STATUSES).optional(),
  isPinned: z.boolean().optional(),
});

export const blogCommentPublicSchema = z.object({
  postId: z.string().min(1),
  parentId: z.string().optional().nullable(),
  name: z.string().trim().min(2, "Please enter your name").max(80),
  email: z.email("Enter a valid email address").max(160),
  body: z
    .string()
    .trim()
    .min(10, "Comment must be at least 10 characters")
    .max(3000, "Comment is too long (3000 characters max)"),
});

export type BlogPostInput = z.infer<typeof blogPostSchema>;
export type BlogCategoryInput = z.infer<typeof blogCategorySchema>;
export type BlogTagInput = z.infer<typeof blogTagSchema>;
export type BlogAuthorInput = z.infer<typeof blogAuthorSchema>;
export type BlogSectionInput = z.infer<typeof blogSectionSchema>;
