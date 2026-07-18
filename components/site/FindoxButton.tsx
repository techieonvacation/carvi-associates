import Link from "next/link";
import { cn } from "@/lib/utils";

type CommonProps = {
  text: string;
  variant?: "primary" | "base";
  className?: string;
};

type LinkProps = CommonProps & {
  href: string;
  onClick?: () => void;
};

type ButtonProps = CommonProps & {
  type: "button" | "submit";
  onClick?: () => void;
  "aria-label"?: string;
};

function Inner({ text }: { text: string }) {
  return (
    <>
      <span className="findox-btn__text">{text}</span>
      <span className="findox-btn__icon-box">
        <span className="findox-btn__icon">
          <i className="icon-arrow-right-up" aria-hidden="true" />
          <i className="icon-arrow-right-up" aria-hidden="true" />
        </span>
      </span>
    </>
  );
}

/**
 * The signature Findox pill button: uppercase label + a circular icon
 * badge whose arrow rotates out on hover while the fill sweeps across.
 */
export function FindoxButton(props: LinkProps | ButtonProps) {
  const classes = cn(
    "findox-btn",
    props.variant === "base" && "findox-btn--base",
    props.className,
  );

  if ("href" in props) {
    return (
      <Link href={props.href} className={classes} onClick={props.onClick}>
        <Inner text={props.text} />
      </Link>
    );
  }

  return (
    <button
      type={props.type}
      className={classes}
      onClick={props.onClick}
      aria-label={props["aria-label"]}
    >
      <Inner text={props.text} />
    </button>
  );
}
