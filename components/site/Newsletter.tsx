import { Container } from "./Container";
import { Reveal } from "./Reveal";
import { NEWSLETTER } from "./home-data";

export function Newsletter() {
  return (
    <section className="py-4">
      <Container>
        <Reveal direction="up">
          <div className="rounded-3xl bg-secondary/60 p-10 sm:p-14">
            <div className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-16">
              <div>
                <h3 className="font-heading text-2xl font-bold text-foreground! sm:text-3xl">
                  {NEWSLETTER.title}
                </h3>
                <p className="mt-3 text-muted-foreground">{NEWSLETTER.text}</p>
              </div>
              <form className="flex flex-col gap-3 sm:flex-row">
                <label htmlFor="newsletter-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  required
                  placeholder="Enter your email"
                  className="w-full rounded-full border border-border bg-background px-5 py-3 text-sm text-foreground outline-none focus:border-accent"
                />
                <button
                  type="submit"
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold tracking-wide text-white uppercase transition-colors hover:bg-accent/90"
                >
                  Send Request
                  <i className="icon-paper-plane" aria-hidden="true" />
                </button>
              </form>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
