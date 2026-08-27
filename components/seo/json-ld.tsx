import { serializeJsonLd } from "@/lib/seo/json-ld";

type JsonLdProps = {
  id: string;
  data: unknown;
};

export function JsonLd({ id, data }: JsonLdProps) {
  if (!data) return null;

  return (
    <script
      id={id}
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
