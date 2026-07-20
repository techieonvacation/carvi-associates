import { Container } from "./Container";
import { Reveal } from "./Reveal";
import { NEWSLETTER } from "./home-data";
import "./css/newsletter.css";

/**
 * Newsletter — a huge yellow "blob" (extreme border-radius + negative
 * bottom margin) that straddles the boundary with whatever section
 * follows (the footer), overlapping down into it. Mirrors the reference
 * `.newsletter-one` markup/CSS.
 */
export function Newsletter() {
  return (
    <section className="newsletter-one relative z-[1]">
      <Container>
        <Reveal direction="up" duration={1300}>
          <div className="newsletter-one__inner relative overflow-hidden bg-primary px-[120px] pt-[70px] pb-[77px] max-xl:px-[100px] max-lg:px-[80px] max-md:px-[40px] max-md:pt-[50px] max-md:pb-[57px] max-[412px]:px-[30px]">
            <div
              className="newsletter-one__bg absolute inset-0"
              aria-hidden="true"
            />
            <div className="newsletter-one__content relative z-[1] mx-auto max-w-[694px] text-center">
              <h3 className="newsletter-one__title mb-[13px] text-[35px] leading-[1.314] font-bold text-foreground max-md:text-[32px] max-[440px]:text-[30px]">
                {NEWSLETTER.title}
              </h3>
              <p className="newsletter-one__text mb-[23px] text-[18px] leading-[1.444] text-foreground/85 max-[440px]:text-[16px]">
                {NEWSLETTER.text}
              </p>
              <form
                action="#"
                className="newsletter-one__form relative mx-auto max-w-[470px]"
              >
                <label htmlFor="newsletter-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="newsletter-email"
                  type="text"
                  name="EMAIL"
                  placeholder="Your Email"
                  className="newsletter-one__input h-[45px] w-full rounded-full border-none bg-white pr-[5px] pl-[30px] text-sm text-muted-foreground outline-none transition-colors duration-500 focus:text-foreground"
                />
                <button
                  type="submit"
                  className="newsletter-one__submit mt-[17px] flex w-full items-center justify-center gap-1.5 rounded-full bg-accent px-[30px] py-[9.5px] text-[15px] font-bold text-white uppercase transition-colors hover:bg-accent/90 sm:mt-0 sm:w-auto sm:px-6"
                >
                  SEND REQUEST
                  <i className="icon-paper-plane text-sm" aria-hidden="true" />
                </button>
              </form>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
