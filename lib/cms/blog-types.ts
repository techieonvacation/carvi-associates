export const BLOG_POST_STATUSES = ["DRAFT", "SCHEDULED", "PUBLISHED", "ARCHIVED"] as const;
export type BlogPostStatus = (typeof BLOG_POST_STATUSES)[number];

export const BLOG_CONTENT_TYPES = [
  "BLOG",
  "ARTICLE",
  "NEWS",
  "GUIDE",
  "CASE_STUDY",
  "UPDATE",
  "CIRCULAR",
  "CHECKLIST",
  "FAQ",
  "OPINION",
] as const;
export type BlogContentType = (typeof BLOG_CONTENT_TYPES)[number];

export const BLOG_CONTENT_TYPE_META: Record<
  BlogContentType,
  { label: string; description: string }
> = {
  BLOG: { label: "Blog", description: "Conversational post for a general audience." },
  ARTICLE: { label: "Article", description: "Long-form, researched explainer." },
  NEWS: { label: "News", description: "What changed, reported briefly." },
  GUIDE: { label: "Guide", description: "Step-by-step how-to." },
  CASE_STUDY: { label: "Case Study", description: "Anonymised client engagement story." },
  UPDATE: { label: "Compliance Update", description: "Due dates, rate changes, filings." },
  CIRCULAR: { label: "Circular", description: "CBDT, CBIC or MCA release, decoded." },
  CHECKLIST: { label: "Checklist", description: "Document and action checklist." },
  FAQ: { label: "FAQ", description: "Question-and-answer format." },
  OPINION: { label: "Opinion", description: "Partner viewpoint or commentary." },
};

export const BLOG_COMMENT_STATUSES = ["PENDING", "APPROVED", "SPAM", "REJECTED"] as const;
export type BlogCommentStatus = (typeof BLOG_COMMENT_STATUSES)[number];

export type BlogFaq = { question: string; answer: string };
export type BlogSource = { label: string; url: string };

export type BlogAuthorItem = {
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
  deletedAt: string | null;
  postCount?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type BlogCategoryItem = {
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
  deletedAt: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string | null;
  noIndex: boolean;
  postCount?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type BlogTagItem = {
  id: string;
  name: string;
  slug: string;
  description: string;
  isVisible: boolean;
  isActive: boolean;
  deletedAt: string | null;
  postCount?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type BlogCommentItem = {
  id: string;
  postId: string;
  postTitle?: string;
  postSlug?: string;
  parentId: string | null;
  name: string;
  email: string;
  website: string | null;
  body: string;
  status: BlogCommentStatus;
  isPinned: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt?: string;
  replies?: BlogCommentItem[];
};

export type BlogPostItem = {
  id: string;
  title: string;
  slug: string;
  subtitle: string | null;
  excerpt: string;
  contentHtml: string;
  keyTakeaways: string[];
  faqs: BlogFaq[];
  sources: BlogSource[];
  coverImageUrl: string;
  coverImageAlt: string;
  thumbnailUrl: string | null;
  contentType: BlogContentType;
  status: BlogPostStatus;
  categoryId: string | null;
  authorId: string | null;
  category: Pick<BlogCategoryItem, "id" | "name" | "slug" | "accentColor" | "icon"> | null;
  author: Pick<
    BlogAuthorItem,
    "id" | "name" | "slug" | "role" | "credentials" | "avatarUrl" | "bio"
  > | null;
  tags: Array<Pick<BlogTagItem, "id" | "name" | "slug">>;
  readingMinutes: number;
  viewCount: number;
  commentCount: number;
  displayOrder: number;
  isFeatured: boolean;
  isPinned: boolean;
  allowComments: boolean;
  isVisible: boolean;
  isActive: boolean;
  publishedAt: string | null;
  deletedAt: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string | null;
  canonicalUrl: string | null;
  ogImageUrl: string | null;
  twitterImageUrl: string | null;
  noIndex: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type BlogSectionContent = {
  tagline: string;
  title: [string, string];
  taglineBg: string;
  homeLimit: number;
  homeCtaText: string;
  homeCtaHref: string;
  showHomeCta: boolean;
  isVisible: boolean;
  archiveTagline: string;
  archiveTitle: [string, string];
  archiveIntro: string;
  archiveHeroImage: string;
  postsPerPage: number;
  showSidebar: boolean;
  showSearch: boolean;
  showCategories: boolean;
  showTags: boolean;
  showNewsletter: boolean;
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

export type BlogHomeContent = {
  section: BlogSectionContent;
  posts: BlogPostItem[];
};

export type BlogArchiveFilters = {
  search?: string;
  category?: string;
  tag?: string;
  author?: string;
  type?: BlogContentType;
  page?: number;
  perPage?: number;
};

export type BlogArchiveResult = {
  posts: BlogPostItem[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
};
