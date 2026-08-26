export type HomeSectionAnchor = {
  id: string;
  label: string;
};

export const HOME_SECTION_ANCHORS: HomeSectionAnchor[] = [
  { id: "home", label: "Hero" },
  { id: "features", label: "Feature cards" },
  { id: "about-us", label: "About Us" },
  { id: "services", label: "Services" },
  { id: "contact", label: "Book an appointment" },
  { id: "why-choose-us", label: "Why choose us" },
  { id: "team", label: "Team" },
  { id: "projects", label: "Projects" },
  { id: "process", label: "Working process" },
  { id: "blog", label: "Blog" },
];

export function resolveAnchorId(href: string): string | null {
  const value = href?.trim();
  if (!value) return null;

  const hashIndex = value.indexOf("#");
  if (hashIndex < 0) return null;

  const path = value.slice(0, hashIndex);
  if (path && path !== "/") return null;

  const id = value.slice(hashIndex + 1).trim();
  return id ? id : null;
}

export function anchorHref(href: string): string {
  const id = resolveAnchorId(href);
  return id ? `/#${id}` : href;
}
