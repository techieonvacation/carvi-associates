import { PARTNER_MARQUEE, type PartnerMarqueeItem } from "./home-data";

function PartnerLogo({ partner }: { partner: PartnerMarqueeItem }) {
  if (partner.logoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={partner.logoUrl}
        alt={partner.name}
        className="partner-marquee__logo-image"
        width={140}
        height={40}
      />
    );
  }

  return (
    <span className="partner-marquee__logo" data-variant={partner.variant ?? "default"}>
      <span className="partner-marquee__logo-name">{partner.name}</span>
      {partner.tagline ? (
        <span className="partner-marquee__logo-tagline">{partner.tagline}</span>
      ) : null}
    </span>
  );
}

function PartnerSequence({
  partners,
  duplicate,
}: {
  partners: PartnerMarqueeItem[];
  duplicate: number;
}) {
  return (
    <div
      className="partner-marquee__sequence"
      aria-hidden={duplicate === 1}
    >
      {partners.map((partner) => (
        <div key={`${duplicate}-${partner.name}`} className="partner-marquee__item">
          <PartnerLogo partner={partner} />
          <span className="partner-marquee__divider" aria-hidden="true" />
        </div>
      ))}
    </div>
  );
}

export function PartnerMarquee() {
  const { label, partners } = PARTNER_MARQUEE;

  return (
    <section className="partner-marquee" aria-label={label}>
      <div className="findox-container partner-marquee__container">
        <div className="partner-marquee__inner">
          <div className="partner-marquee__label-wrap">
            <p className="partner-marquee__label">{label}</p>
          </div>

          <div className="partner-marquee__viewport">
            <span className="partner-marquee__fade partner-marquee__fade--left" aria-hidden="true" />
            <span className="partner-marquee__fade partner-marquee__fade--right" aria-hidden="true" />

            <div className="partner-marquee__track">
              <PartnerSequence partners={partners} duplicate={0} />
              <PartnerSequence partners={partners} duplicate={1} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
