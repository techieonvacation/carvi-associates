import Link from "next/link";
import { Container } from "@/components/site/Container";

export default function BlogNotFound() {
  return (
    <section className="bg-background py-28 max-md:py-20">
      <Container className="text-center">
        <p className="mb-3 text-[12px] font-bold tracking-[0.2em] text-accent uppercase">
          404 — Not found
        </p>
        <h1 className="mx-auto mb-4 max-w-[620px] text-[34px] leading-[1.2] font-bold text-foreground max-sm:text-[26px]">
          We could not find that article
        </h1>
        <p className="mx-auto mb-9 max-w-[520px] text-[16px] leading-[1.7] text-muted-foreground">
          It may have been moved, renamed or unpublished. Browse the knowledge desk for the
          latest tax, GST and compliance writing.
        </p>
        <Link
          href="/blog"
          className="inline-block rounded-full bg-accent px-8 py-3.5 text-[13px] font-bold text-white uppercase transition-opacity hover:opacity-90"
        >
          Browse all articles
        </Link>
      </Container>
    </section>
  );
}
