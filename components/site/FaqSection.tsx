import { Container } from "./Container";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import type { SeoFaqItem } from "@/lib/seo/types";
import "./css/faq.css";

type FaqSectionProps = {
  faqs: SeoFaqItem[];
  tagline?: string;
  titleLines?: string[];
  intro?: string;
};

export function FaqSection({
  faqs,
  tagline = "Answers",
  titleLines = ["Questions Clients Ask", "Before They Engage Us."],
  intro,
}: FaqSectionProps) {
  const visible = faqs.filter((faq) => faq.showOnPage);
  if (!visible.length) return null;

  return (
    <section id="faq" className="seo-faq section-space bg-secondary/30 py-30 max-md:py-25 max-sm:py-20">
      <Container>
        <SectionHeading align="center" tagline={tagline} lines={titleLines} />

        {intro ? (
          <Reveal direction="up" duration={1300}>
            <p className="mx-auto mb-10 max-w-[760px] text-center text-muted-foreground">{intro}</p>
          </Reveal>
        ) : null}

        <Reveal direction="up" duration={1300}>
          <div className="mx-auto max-w-[900px] rounded-[20px] border border-border bg-white px-9 max-sm:px-5">
            {visible.map((faq) => (
              <details key={faq.id} className="seo-faq__item" name="seo-faq">
                <summary>{faq.question}</summary>
                <p className="seo-faq__answer">{faq.answer}</p>
              </details>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
