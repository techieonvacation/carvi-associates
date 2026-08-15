import sanitizeHtml from "sanitize-html";

const ALLOWED_IFRAME_HOSTS = [
  "www.youtube.com",
  "www.youtube-nocookie.com",
  "youtube.com",
  "youtube-nocookie.com",
  "player.vimeo.com",
];

const OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    "p",
    "br",
    "strong",
    "em",
    "u",
    "s",
    "code",
    "pre",
    "blockquote",
    "h2",
    "h3",
    "h4",
    "ul",
    "ol",
    "li",
    "a",
    "img",
    "hr",
    "table",
    "thead",
    "tbody",
    "tr",
    "th",
    "td",
    "figure",
    "figcaption",
    "div",
    "iframe",
    "span",
  ],
  allowedAttributes: {
    a: ["href", "target", "rel"],
    img: ["src", "alt", "title", "width", "height"],
    iframe: ["src", "width", "height", "allow", "allowfullscreen", "frameborder", "title"],
    div: ["data-youtube-video"],
    th: ["colspan", "rowspan", "colwidth"],
    td: ["colspan", "rowspan", "colwidth"],
    "*": ["style"],
  },
  allowedStyles: {
    "*": { "text-align": [/^left$|^right$|^center$|^justify$/] },
  },
  allowedSchemes: ["http", "https", "mailto", "tel"],
  allowedSchemesByTag: { img: ["http", "https", "data"] },
  allowProtocolRelative: false,
  transformTags: {
    a: (tagName, attribs) => {
      const href = attribs.href ?? "";
      const external = /^https?:\/\//i.test(href);
      return {
        tagName,
        attribs: external
          ? { ...attribs, target: "_blank", rel: "noopener noreferrer" }
          : { ...attribs },
      };
    },
    h1: "h2",
    h5: "h4",
    h6: "h4",
  },
  exclusiveFilter: (frame) => {
    if (frame.tag !== "iframe") return false;
    try {
      return !ALLOWED_IFRAME_HOSTS.includes(new URL(frame.attribs.src ?? "").hostname);
    } catch {
      return true;
    }
  },
};

export function sanitizeBlogHtml(html: string): string {
  return sanitizeHtml(html, OPTIONS);
}

export function htmlToPlainText(html: string): string {
  return sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} })
    .replace(/\s+/g, " ")
    .trim();
}

export function estimateReadingMinutes(html: string, excerpt = ""): number {
  const words = `${htmlToPlainText(html)} ${excerpt}`.trim();
  return Math.max(1, Math.round((words ? words.split(/\s+/).length : 0) / 200));
}

export type HeadingEntry = { id: string; text: string; level: 2 | 3 };

export function extractHeadings(html: string): HeadingEntry[] {
  const entries: HeadingEntry[] = [];
  const pattern = /<h([23])[^>]*>([\s\S]*?)<\/h\1>/gi;
  let match: RegExpExecArray | null;
  let index = 0;

  while ((match = pattern.exec(html)) !== null) {
    const text = htmlToPlainText(match[2]);
    if (!text) continue;
    entries.push({ id: `section-${index}`, text, level: Number(match[1]) as 2 | 3 });
    index += 1;
  }

  return entries;
}

export function injectHeadingIds(html: string): string {
  let index = 0;
  return html.replace(/<h([23])([^>]*)>/gi, (match, level, attrs) => {
    const id = `section-${index}`;
    index += 1;
    return `<h${level}${attrs} id="${id}">`;
  });
}
