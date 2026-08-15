"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Loader2, Reply, X } from "lucide-react";
import {
  initialBlogCommentState,
  submitBlogComment,
  type BlogCommentState,
} from "@/app/actions/blog-comment";
import type { BlogCommentItem } from "@/lib/cms/types";
import { formatLongDate } from "./blog-format";
import { cn } from "@/lib/utils";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function CommentBubble({
  comment,
  onReply,
  isReply = false,
}: {
  comment: BlogCommentItem;
  onReply?: (comment: BlogCommentItem) => void;
  isReply?: boolean;
}) {
  return (
    <li className={cn("comment-item", isReply && "comment-item--reply")}>
      <div className="flex gap-4">
        <span className="comment-item__avatar" aria-hidden="true">
          {initials(comment.name)}
        </span>
        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
            <p className="text-[16px] font-bold text-foreground">{comment.name}</p>
            {comment.isPinned ? (
              <span className="rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-primary-foreground uppercase">
                Pinned
              </span>
            ) : null}
            <time dateTime={comment.createdAt} className="text-[13px] text-muted-foreground">
              {formatLongDate(comment.createdAt)}
            </time>
          </div>
          <p className="mb-3 text-[15px] leading-[1.75] whitespace-pre-line text-muted-foreground">
            {comment.body}
          </p>
          {onReply ? (
            <button
              type="button"
              onClick={() => onReply(comment)}
              className="inline-flex items-center gap-1.5 text-[13px] font-bold text-accent uppercase transition-opacity hover:opacity-75"
            >
              <Reply className="size-3.5" aria-hidden="true" />
              Reply
            </button>
          ) : null}
        </div>
      </div>

      {comment.replies?.length ? (
        <ul className="mt-6 flex flex-col gap-6 border-l-2 border-border/50 pl-6 max-sm:pl-4">
          {comment.replies.map((reply) => (
            <CommentBubble key={reply.id} comment={reply} isReply />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

export function CommentSection({
  postId,
  comments,
  allowComments,
  moderated,
}: {
  postId: string;
  comments: BlogCommentItem[];
  allowComments: boolean;
  moderated: boolean;
}) {
  const [replyTo, setReplyTo] = useState<BlogCommentItem | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [state, formAction, pending] = useActionState(
    async (previous: BlogCommentState, formData: FormData) => {
      const result = await submitBlogComment(previous, formData);
      if (result.status === "success") setReplyTo(null);
      return result;
    },
    initialBlogCommentState,
  );

  useEffect(() => {
    if (state.status === "success") formRef.current?.reset();
  }, [state]);

  const total = comments.reduce((sum, comment) => sum + 1 + (comment.replies?.length ?? 0), 0);

  return (
    <section id="comments" className="comment-section scroll-mt-24">
      <h2 className="mb-8 text-[28px] leading-tight font-bold text-foreground max-sm:text-[24px]">
        {total > 0 ? `${total} Comment${total === 1 ? "" : "s"}` : "Join the discussion"}
      </h2>

      {comments.length ? (
        <ul className="mb-12 flex flex-col gap-8">
          {comments.map((comment) => (
            <CommentBubble
              key={comment.id}
              comment={comment}
              onReply={allowComments ? setReplyTo : undefined}
            />
          ))}
        </ul>
      ) : (
        <p className="mb-10 text-[15px] text-muted-foreground">
          No comments yet — be the first to share your view on this article.
        </p>
      )}

      {allowComments ? (
        <div className="comment-form-wrap">
          <h3 className="mb-2 text-[22px] leading-tight font-bold text-foreground">
            {replyTo ? `Replying to ${replyTo.name}` : "Leave a comment"}
          </h3>
          <p className="mb-6 text-[14px] text-muted-foreground">
            {moderated
              ? "Your email is never published. Comments appear after review."
              : "Your email is never published."}
          </p>

          {replyTo ? (
            <button
              type="button"
              onClick={() => setReplyTo(null)}
              className="mb-5 inline-flex items-center gap-1.5 rounded-full bg-secondary px-3.5 py-1.5 text-[13px] font-medium text-foreground"
            >
              <X className="size-3.5" aria-hidden="true" />
              Cancel reply
            </button>
          ) : null}

          <form ref={formRef} action={formAction} className="comment-form grid gap-5">
            <input type="hidden" name="postId" value={postId} />
            <input type="hidden" name="parentId" value={replyTo?.id ?? ""} />
            <input
              type="text"
              name="company_website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="hidden"
            />

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="comment-name" className="comment-form__label">
                  Your name *
                </label>
                <input
                  id="comment-name"
                  name="name"
                  required
                  maxLength={80}
                  className="comment-form__input"
                  aria-invalid={state.errors?.name ? true : undefined}
                />
                {state.errors?.name ? (
                  <p className="comment-form__error">{state.errors.name}</p>
                ) : null}
              </div>
              <div>
                <label htmlFor="comment-email" className="comment-form__label">
                  Email * <span className="font-normal text-muted-foreground">(not published)</span>
                </label>
                <input
                  id="comment-email"
                  name="email"
                  type="email"
                  required
                  maxLength={160}
                  className="comment-form__input"
                  aria-invalid={state.errors?.email ? true : undefined}
                />
                {state.errors?.email ? (
                  <p className="comment-form__error">{state.errors.email}</p>
                ) : null}
              </div>
            </div>

            <div>
              <label htmlFor="comment-body" className="comment-form__label">
                Comment *
              </label>
              <textarea
                id="comment-body"
                name="body"
                required
                rows={5}
                maxLength={3000}
                className="comment-form__input comment-form__input--area"
                placeholder="Share your question or experience…"
                aria-invalid={state.errors?.body ? true : undefined}
              />
              {state.errors?.body ? (
                <p className="comment-form__error">{state.errors.body}</p>
              ) : null}
            </div>

            {state.message ? (
              <p
                role="status"
                className={cn(
                  "rounded-xl px-4 py-3 text-[14px]",
                  state.status === "success"
                    ? "bg-accent/10 text-accent"
                    : "bg-destructive/10 text-destructive",
                )}
              >
                {state.message}
              </p>
            ) : null}

            <div>
              <button type="submit" disabled={pending} className="findox-btn findox-btn--base">
                <span className="findox-btn__text">
                  {pending ? "posting…" : "post comment"}
                </span>
                <span className="findox-btn__icon-box">
                  <span className="findox-btn__icon">
                    {pending ? (
                      <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
                    ) : (
                      <>
                        <i className="icon-arrow-right-up" aria-hidden="true" />
                        <i className="icon-arrow-right-up" aria-hidden="true" />
                      </>
                    )}
                  </span>
                </span>
              </button>
            </div>
          </form>
        </div>
      ) : (
        <p className="rounded-xl border border-border/60 bg-secondary/40 px-5 py-4 text-[15px] text-muted-foreground">
          Comments are closed on this article.
        </p>
      )}
    </section>
  );
}
