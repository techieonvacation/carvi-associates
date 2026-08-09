import { projectCategorySchema, projectItemSchema } from "@/lib/cms/schemas";
import { normalizeNullable, slugify } from "@/lib/cms/service-mappers";

export type ProjectItemInput = ReturnType<typeof projectItemSchema.parse>;
export type ProjectCategoryInput = ReturnType<typeof projectCategorySchema.parse>;

/**
 * Case-study slugs are unique in the database, so a title-derived slug gets a
 * numeric suffix whenever it collides with one already claimed in this write.
 */
export function claimProjectSlug(item: ProjectItemInput, taken: Set<string>) {
  const base = normalizeNullable(item.slug) ?? slugify(item.title);
  if (!base) return null;

  let candidate = base;
  let counter = 2;
  while (taken.has(candidate)) {
    candidate = `${base}-${counter}`;
    counter += 1;
  }
  taken.add(candidate);
  return candidate;
}

export function projectItemWriteData(
  item: ProjectItemInput,
  displayOrder: number,
  slug: string | null,
) {
  return {
    title: item.title.trim(),
    text: item.text.trim(),
    icon: item.icon.trim(),
    imageUrl: item.imageUrl.trim(),
    imageAlt: item.imageAlt.trim(),
    href: item.href.trim() || "#",
    slug,
    categorySlug: normalizeNullable(item.categorySlug),
    tags: item.tags.map((tag) => ({
      label: tag.label.trim(),
      href: tag.href.trim() || "#",
      tone: tag.tone,
    })),
    displayOrder,
    isFeatured: item.isFeatured,
    isVisible: item.isVisible,
    isActive: item.isActive,
    deletedAt: null,
  };
}

export function projectCategoryWriteData(
  category: ProjectCategoryInput,
  displayOrder: number,
) {
  return {
    label: category.label.trim(),
    slug: category.slug.trim(),
    displayOrder,
    isVisible: category.isVisible,
    isActive: category.isActive,
    deletedAt: null,
  };
}
