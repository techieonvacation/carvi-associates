import { marqueeItemSchema } from "@/lib/cms/schemas";
import { normalizeNullable } from "@/lib/cms/service-mappers";

export type MarqueeItemInput = ReturnType<typeof marqueeItemSchema.parse>;

export function marqueeItemWriteData(item: MarqueeItemInput, displayOrder: number) {
  return {
    kind: item.kind,
    band: item.band,
    text: item.text.trim(),
    imageUrl: normalizeNullable(item.imageUrl),
    imageAlt: item.imageAlt.trim(),
    imageWidth: item.imageWidth,
    imageHeight: item.imageHeight,
    href: normalizeNullable(item.href),
    outlined: item.outlined,
    displayOrder,
    isVisible: item.isVisible,
    isActive: item.isActive,
    deletedAt: null,
  };
}
