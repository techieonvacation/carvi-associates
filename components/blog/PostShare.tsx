"use client";

import { useState } from "react";
import { Check, Link2 } from "lucide-react";
import { LinkedinIcon, WhatsappIcon, XIcon } from "@/components/site/brand-icons";
import { toast } from "sonner";

export function PostShare({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const networks = [
    {
      label: "Share on LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      icon: LinkedinIcon,
    },
    {
      label: "Share on X",
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      icon: XIcon,
    },
    {
      label: "Share on WhatsApp",
      href: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
      icon: WhatsappIcon,
    },
  ];

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy the link");
    }
  }

  return (
    <div className="post-share flex flex-wrap items-center gap-3">
      <span className="text-[13px] font-bold tracking-[0.14em] text-muted-foreground uppercase">
        Share
      </span>
      <ul className="flex items-center gap-2">
        {networks.map((network) => {
          const Icon = network.icon;
          return (
            <li key={network.label}>
              <a
                href={network.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={network.label}
                className="post-share__btn"
              >
                <Icon className="size-4" aria-hidden="true" />
              </a>
            </li>
          );
        })}
        <li>
          <button
            type="button"
            onClick={() => void copyLink()}
            aria-label="Copy link to this article"
            className="post-share__btn"
          >
            {copied ? (
              <Check className="size-4" aria-hidden="true" />
            ) : (
              <Link2 className="size-4" aria-hidden="true" />
            )}
          </button>
        </li>
      </ul>
    </div>
  );
}
