"use server";

import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { blogCommentPublicSchema } from "@/lib/cms/blog-schemas";
import { getBlogSection } from "@/lib/cms/blog-queries";
import { rateLimit } from "@/lib/rate-limit";

export type BlogCommentState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Record<string, string>;
};

export const initialBlogCommentState: BlogCommentState = { status: "idle" };

function hashIp(ip: string) {
  return createHash("sha256").update(`carvi-blog:${ip}`).digest("hex").slice(0, 32);
}

export async function submitBlogComment(
  _prevState: BlogCommentState,
  formData: FormData,
): Promise<BlogCommentState> {
  if (formData.get("company_website")) {
    return { status: "success", message: "Thanks — your comment is awaiting moderation." };
  }

  const parsed = blogCommentPublicSchema.safeParse({
    postId: formData.get("postId"),
    parentId: formData.get("parentId") || null,
    name: formData.get("name"),
    email: formData.get("email"),
    body: formData.get("body"),
  });

  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0];
      if (typeof field === "string" && !errors[field]) errors[field] = issue.message;
    }
    return {
      status: "error",
      message: "Please check the highlighted fields and try again.",
      errors,
    };
  }

  const headerList = await headers();
  const ip =
    headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headerList.get("x-real-ip") ||
    "unknown";

  const limit = rateLimit(`blog-comment:${ip}`, { limit: 3, windowMs: 10 * 60 * 1000 });
  if (!limit.allowed) {
    return {
      status: "error",
      message: `Too many comments from this device. Try again in ${Math.ceil(
        limit.retryAfterSeconds / 60,
      )} minute(s).`,
    };
  }

  const [section, post] = await Promise.all([
    getBlogSection(),
    prisma.blogPost.findFirst({
      where: {
        id: parsed.data.postId,
        status: "PUBLISHED",
        isVisible: true,
        isActive: true,
        deletedAt: null,
      },
      select: { id: true, slug: true, allowComments: true },
    }),
  ]);

  if (!post) {
    return { status: "error", message: "This article is no longer accepting comments." };
  }

  if (!section.allowComments || !post.allowComments) {
    return { status: "error", message: "Comments are closed on this article." };
  }

  let parentId: string | null = null;
  if (parsed.data.parentId) {
    const parent = await prisma.blogComment.findFirst({
      where: {
        id: parsed.data.parentId,
        postId: post.id,
        status: "APPROVED",
        deletedAt: null,
      },
      select: { id: true, parentId: true },
    });
    parentId = parent ? (parent.parentId ?? parent.id) : null;
  }

  try {
    await prisma.blogComment.create({
      data: {
        postId: post.id,
        parentId,
        name: parsed.data.name,
        email: parsed.data.email.toLowerCase(),
        body: parsed.data.body,
        status: section.moderateComments ? "PENDING" : "APPROVED",
        ipHash: hashIp(ip),
        userAgent: headerList.get("user-agent")?.slice(0, 255) ?? null,
      },
    });
  } catch (error) {
    console.error("[blog-comment] create failed", error);
    return {
      status: "error",
      message: "We could not post your comment right now. Please try again in a moment.",
    };
  }

  if (!section.moderateComments) {
    revalidatePath(`/blog/${post.slug}`);
  }

  return {
    status: "success",
    message: section.moderateComments
      ? "Thanks — your comment has been submitted and will appear once approved."
      : "Thanks — your comment is live.",
  };
}
