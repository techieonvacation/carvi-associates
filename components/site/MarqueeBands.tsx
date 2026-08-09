import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type {
  MarqueeContent,
  MarqueeDirection,
  MarqueeItemData,
} from "@/lib/cms/types";
import "./css/slidetext.css";

type MarqueeBandsProps = {
  marquee: MarqueeContent;
};

type BandConfig = {
  key: "one" | "two";
  bgColor: string;
  textColor: string;
  direction: MarqueeDirection;
  speedSeconds: number;
  separatorUrl: string;
  items: MarqueeItemData[];
};

function MarqueeItem({
  item,
  index,
  alternateOutline,
}: {
  item: MarqueeItemData;
  index: number;
  alternateOutline: boolean;
}) {
  const outlined = alternateOutline ? index % 2 === 1 : item.outlined;
  const showText = item.kind !== "IMAGE" && item.text.length > 0;
  const showImage = item.kind !== "TEXT" && Boolean(item.imageUrl);

  const content = (
    <>
      {showImage ? (
        <Image
          src={item.imageUrl as string}
          alt={item.imageAlt || item.text}
          width={item.imageWidth}
          height={item.imageHeight}
          className="marquee-band__logo"
        />
      ) : null}
      {showText ? (
        <span
          className="marquee-band__text font-heading font-bold leading-[1.192] whitespace-nowrap uppercase"
          data-outlined={outlined}
        >
          {item.text}
        </span>
      ) : null}
    </>
  );

  if (!item.href) return content;

  return (
    <Link href={item.href} className="marquee-band__link">
      {content}
    </Link>
  );
}

function MarqueeSequence({
  band,
  alternateOutline,
  showSeparator,
  duplicate,
}: {
  band: BandConfig;
  alternateOutline: boolean;
  showSeparator: boolean;
  duplicate: number;
}) {
  return (
    <div className="marquee-band__sequence" aria-hidden={duplicate > 0}>
      {band.items.map((item, index) => (
        <span key={item.id} className="marquee-band__item">
          <MarqueeItem item={item} index={index} alternateOutline={alternateOutline} />
          {showSeparator ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={band.separatorUrl}
              alt=""
              aria-hidden="true"
              className="marquee-band__separator"
            />
          ) : null}
        </span>
      ))}
    </div>
  );
}

function MarqueeBand({
  band,
  layer,
  alternateOutline,
  showSeparator,
}: {
  band: BandConfig;
  layer: "base" | "overlay";
  alternateOutline: boolean;
  showSeparator: boolean;
}) {
  return (
    <div
      className={cn("marquee-band", `marquee-band--${band.key}`)}
      data-layer={layer}
      style={
        {
          "--marquee-band-bg": band.bgColor,
          "--marquee-band-text": band.textColor,
          "--marquee-duration": `${band.speedSeconds}s`,
        } as React.CSSProperties
      }
    >
      <div className="marquee-band__viewport">
        <div className="marquee-band__track" data-direction={band.direction}>
          {[0, 1].map((duplicate) => (
            <MarqueeSequence
              key={duplicate}
              band={band}
              duplicate={duplicate}
              alternateOutline={alternateOutline}
              showSeparator={showSeparator}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * MarqueeBands — the crossing-ribbon highlight strip. Every band colour,
 * direction, speed, separator and item (text, logo, or both, optionally
 * linked) is managed in the CMS; items opt into band one, band two, or both.
 */
export function MarqueeBands({ marquee }: MarqueeBandsProps) {
  if (!marquee.isVisible) return null;

  const itemsFor = (target: "ONE" | "TWO") =>
    marquee.items.filter((item) => item.band === target || item.band === "BOTH");

  const candidates: BandConfig[] = [
    {
      key: "one",
      bgColor: marquee.bandOneBgColor,
      textColor: marquee.bandOneTextColor,
      direction: marquee.bandOneDirection,
      speedSeconds: marquee.bandOneSpeedSeconds,
      separatorUrl: marquee.bandOneSeparatorUrl,
      items: itemsFor("ONE"),
    },
    {
      key: "two",
      bgColor: marquee.bandTwoBgColor,
      textColor: marquee.bandTwoTextColor,
      direction: marquee.bandTwoDirection,
      speedSeconds: marquee.bandTwoSpeedSeconds,
      separatorUrl: marquee.bandTwoSeparatorUrl,
      items: itemsFor("TWO"),
    },
  ];

  const bands = candidates.filter(
    (band) =>
      band.items.length > 0 &&
      (band.key === "one" ? marquee.showBandOne : marquee.showBandTwo),
  );

  if (!bands.length) return null;

  return (
    <section
      className="marquee-bands my-20 max-[1199px]:my-14 max-md:my-10"
      aria-label={marquee.ariaLabel}
      data-layout={marquee.layout}
      data-pause-on-hover={marquee.pauseOnHover}
      style={
        {
          "--marquee-skew": `${marquee.skewDegrees}deg`,
          "--marquee-font-size-max": `${marquee.fontSizePx}px`,
          "--marquee-gap": `${marquee.itemGapPx}px`,
          "--marquee-band-padding": `${marquee.bandPaddingPx}px`,
        } as React.CSSProperties
      }
    >
      <div className="marquee-bands__stack">
        {bands.map((band, index) => (
          <MarqueeBand
            key={band.key}
            band={band}
            layer={index === 0 ? "base" : "overlay"}
            alternateOutline={marquee.alternateOutline}
            showSeparator={marquee.showSeparator}
          />
        ))}
      </div>
    </section>
  );
}
