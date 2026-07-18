import { CONTACT, SOCIALS } from "./nav-data";
import { SocialLinks } from "./SocialLinks";

export function Topbar() {
  return (
    <div className="topbar">
      <div className="findox-container">
        <div className="topbar__inner">
          <ul className="topbar__info">
            <li>
              <span className="topbar__info__icon">
                <i className="icon-email" aria-hidden="true" />
              </span>
              <span>
                <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
              </span>
            </li>
            <li>
              <span className="topbar__info__icon">
                <i className="icon-location" aria-hidden="true" />
              </span>
              <span>
                <a
                  href="https://www.google.com/maps"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {CONTACT.address}
                </a>
              </span>
            </li>
          </ul>

          <div className="topbar__right">
            <SocialLinks socials={SOCIALS} />
          </div>
        </div>
      </div>
    </div>
  );
}
