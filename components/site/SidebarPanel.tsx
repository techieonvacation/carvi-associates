"use client";

import { useActionState } from "react";
import { submitEnquiry } from "@/app/actions/enquiry";
import { IDLE_ENQUIRY_STATE } from "@/lib/enquiry/schema";
import { Logo } from "./Logo";
import { SocialLinks } from "./SocialLinks";
import type { SiteLogo } from "@/lib/cms/types";

type SidebarPanelProps = {
  open: boolean;
  onClose: () => void;
  logo: SiteLogo;
  about: string;
  contactTitle: string;
  newsletterTitle: string;
  showNewsletter: boolean;
  contact: {
    email: string;
    phone: string;
    phoneHref: string;
    address: string;
  };
  socials: Array<{
    label: string;
    href: string;
    icon: string;
  }>;
};

function NewsletterForm({ title }: { title: string }) {
  const [state, formAction, pending] = useActionState(submitEnquiry, IDLE_ENQUIRY_STATE);

  return (
    <div className="sidebar-panel__item">
      <label className="sidebar-panel__title" htmlFor="sidebar-newsletter-email">
        {title}
      </label>
      <form action={formAction} className="sidebar-panel__newsletter__inner">
        <input type="hidden" name="kind" value="newsletter" />
        <input
          type="email"
          name="email"
          id="sidebar-newsletter-email"
          required
          placeholder="Email Address"
          className="sidebar-panel__newsletter__input"
        />
        <button
          type="submit"
          disabled={pending}
          className="sidebar-panel__newsletter__btn"
          aria-label="Subscribe"
        >
          <i className="icon-paper-plane" aria-hidden="true" />
        </button>
      </form>
      {state.status !== "idle" ? (
        <p
          role="status"
          className={`sidebar-panel__newsletter__note${
            state.status === "error" ? " sidebar-panel__newsletter__note--error" : ""
          }`}
        >
          {state.message}
        </p>
      ) : null}
    </div>
  );
}

export function SidebarPanel({
  open,
  onClose,
  logo,
  about,
  contactTitle,
  newsletterTitle,
  showNewsletter,
  contact,
  socials,
}: SidebarPanelProps) {
  const hasContact = Boolean(contact.address || contact.email || contact.phone);

  return (
    <aside className={`sidebar-panel${open ? " active" : ""}`} aria-hidden={!open}>
      <button
        type="button"
        className="sidebar-panel__overlay"
        aria-label="Close sidebar"
        tabIndex={open ? 0 : -1}
        onClick={onClose}
      />
      <div className="sidebar-panel__content">
        <button
          type="button"
          className="sidebar-panel__close"
          aria-label="Close sidebar"
          tabIndex={open ? 0 : -1}
          onClick={onClose}
        >
          <i className="icon-close" aria-hidden="true" />
        </button>

        <div className="sidebar-panel__item">
          <Logo logo={logo} tone="light" onClick={onClose} />
        </div>

        {about ? (
          <div className="sidebar-panel__item">
            <p className="sidebar-panel__about">{about}</p>
          </div>
        ) : null}

        {hasContact ? (
          <div className="sidebar-panel__item">
            <h4 className="sidebar-panel__title">{contactTitle}</h4>
            <ul className="sidebar-panel__info">
              {contact.address ? (
                <li>
                  <span className="sidebar-panel__info__icon">
                    <i className="icon-location" aria-hidden="true" />
                  </span>
                  <address>{contact.address}</address>
                </li>
              ) : null}
              {contact.email ? (
                <li>
                  <span className="sidebar-panel__info__icon">
                    <i className="icon-email" aria-hidden="true" />
                  </span>
                  <a href={`mailto:${contact.email}`}>{contact.email}</a>
                </li>
              ) : null}
              {contact.phone ? (
                <li>
                  <span className="sidebar-panel__info__icon">
                    <i className="icon-phone-call" aria-hidden="true" />
                  </span>
                  <a href={contact.phoneHref || `tel:${contact.phone.replace(/\s+/g, "")}`}>
                    {contact.phone}
                  </a>
                </li>
              ) : null}
            </ul>
          </div>
        ) : null}

        {socials.length ? (
          <div className="sidebar-panel__item">
            <SocialLinks socials={socials} />
          </div>
        ) : null}

        {showNewsletter ? <NewsletterForm title={newsletterTitle} /> : null}
      </div>
    </aside>
  );
}
