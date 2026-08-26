"use client";

import { useActionState, useEffect, useRef } from "react";
import { submitEnquiry } from "@/app/actions/enquiry";
import { IDLE_ENQUIRY_STATE } from "@/lib/enquiry/schema";
import { Container } from "./Container";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import type { ContactContent } from "@/lib/cms/types";
import "./css/contact.css";

type ContactSectionProps = {
  contact: ContactContent;
  fallback: {
    phone: string;
    phoneHref: string;
    email: string;
    address: string;
    addressMapUrl: string;
  };
};

type FieldProps = {
  id: string;
  name: string;
  type: "text" | "email" | "tel";
  label: string;
  required?: boolean;
  autoComplete?: string;
  error?: string;
  full?: boolean;
};

function Field({
  id,
  name,
  type,
  label,
  required = true,
  autoComplete,
  error,
  full = false,
}: FieldProps) {
  return (
    <div className={`form-one__control${full ? " form-one__control--full" : ""}`}>
      <label className="sr-only" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        placeholder={label}
        required={required}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error ? (
        <span id={`${id}-error`} className="form-one__error" role="alert">
          {error}
        </span>
      ) : null}
    </div>
  );
}

function InfoCard({
  icon,
  title,
  text,
  href,
  external,
  direction,
}: {
  icon: string;
  title: string;
  text: string;
  href: string;
  external?: boolean;
  direction: "left" | "right";
}) {
  return (
    <li>
      <Reveal direction={direction} duration={1300}>
        <div className="contact-one__info__inner">
          <span className="contact-one__info__icon">
            <i className={icon} aria-hidden="true" />
          </span>
          <div className="contact-one__info__content">
            <h4 className="contact-one__info__title">{title}</h4>
            <a
              href={href}
              className="contact-one__info__text"
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              {text}
            </a>
          </div>
        </div>
      </Reveal>
    </li>
  );
}

export function ContactSection({ contact, fallback }: ContactSectionProps) {
  const [state, formAction, pending] = useActionState(submitEnquiry, IDLE_ENQUIRY_STATE);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") formRef.current?.reset();
  }, [state]);

  if (!contact.isVisible) return null;

  const phone = contact.phoneText || fallback.phone.trim();
  const phoneHref = contact.phoneHref || fallback.phoneHref.trim();
  const email = contact.emailText || fallback.email.trim();
  const location = contact.locationText || fallback.address.trim();
  const locationUrl = contact.locationUrl || fallback.addressMapUrl.trim();

  const showPhone = contact.showPhone && Boolean(phone);
  const showEmail = contact.showEmail && Boolean(email);
  const showLocation = contact.showLocation && Boolean(location);
  const showSideImage = contact.showSideImage && Boolean(contact.sideImageUrl);
  const errors = state.errors ?? {};

  return (
    <section
      id="contact-now"
      className="contact-one section-space py-30 max-md:py-25 max-sm:py-20"
    >
      <div className="contact-one__bg" aria-hidden="true">
        {contact.showShape ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src="/images/shapes/contact-shape-1-1.png"
            alt=""
            width={909}
            height={784}
            className="contact-one__bg__shape"
          />
        ) : null}
      </div>

      <Container className="contact-one__inner">
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-2 xl:grid-cols-12">
          <div className="contact-one__content xl:col-span-5">
            <SectionHeading
              tagline={contact.tagline}
              lines={[...contact.title]}
              taglineBg={contact.taglineBg}
              light
            />

            {showPhone || showEmail || showLocation ? (
              <ul className="contact-one__info">
                {showPhone ? (
                  <InfoCard
                    icon="icon-phone-call"
                    title={contact.phoneTitle}
                    text={phone}
                    href={phoneHref || `tel:${phone.replace(/\s+/g, "")}`}
                    direction="right"
                  />
                ) : null}
                {showEmail ? (
                  <InfoCard
                    icon="icon-mail"
                    title={contact.emailTitle}
                    text={email}
                    href={`mailto:${email}`}
                    direction="left"
                  />
                ) : null}
                {showLocation ? (
                  <InfoCard
                    icon="icon-round-arrow"
                    title={contact.locationTitle}
                    text={location}
                    href={
                      locationUrl ||
                      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`
                    }
                    external
                    direction="right"
                  />
                ) : null}
              </ul>
            ) : null}
          </div>

          <Reveal direction="up" duration={1300} className="xl:col-span-7">
            <div className="contact-one__form">
              <form ref={formRef} action={formAction} className="form-one" noValidate>
                <input type="hidden" name="kind" value="quote" />
                <div className="form-one__group">
                  <Field
                    id="contact-name"
                    name="name"
                    type="text"
                    label={contact.nameLabel}
                    autoComplete="name"
                    error={errors.name}
                    full
                  />
                  <Field
                    id="contact-company"
                    name="company"
                    type="text"
                    label={contact.companyLabel}
                    autoComplete="organization"
                    required={false}
                    error={errors.company}
                    full
                  />
                  <Field
                    id="contact-email"
                    name="email"
                    type="email"
                    label={contact.emailLabel}
                    autoComplete="email"
                    error={errors.email}
                  />
                  <Field
                    id="contact-phone"
                    name="phone"
                    type="tel"
                    label={contact.mobileLabel}
                    autoComplete="tel"
                    error={errors.phone}
                  />
                  <Field
                    id="contact-location"
                    name="location"
                    type="text"
                    label={contact.locationLabel}
                    autoComplete="address-level2"
                    error={errors.location}
                    full
                  />
                  <div className="form-one__control form-one__control--full">
                    <button
                      type="submit"
                      disabled={pending}
                      className="findox-btn findox-btn--base"
                    >
                      <span className="findox-btn__text">{contact.submitLabel}</span>
                      <span className="findox-btn__icon">
                        <i className="icon-arrow-right-2" aria-hidden="true" />
                        <i className="icon-arrow-right-2" aria-hidden="true" />
                      </span>
                    </button>
                  </div>
                </div>
              </form>

              {state.status !== "idle" ? (
                <p
                  role="status"
                  className={`form-one__status${
                    state.status === "error" ? " form-one__status--error" : ""
                  }`}
                >
                  {state.message}
                  {state.reference ? ` Reference: ${state.reference}.` : null}
                </p>
              ) : null}
            </div>
          </Reveal>
        </div>
      </Container>

      {showSideImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={contact.sideImageUrl}
          alt={contact.sideImageAlt}
          className="contact-one__image"
        />
      ) : null}
    </section>
  );
}
