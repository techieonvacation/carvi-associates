import { SmartLink } from "./SmartLink";
import type { NavLink } from "./nav-data";

export type PublicNavItem = NavLink;

export function DesktopMenu({ items }: { items: PublicNavItem[] }) {
  return (
    <ul className="main-menu__list">
      {items.map((item) => {
        const hasChildren = !!item.children?.length;

        return (
          <li
            key={item.label}
            className={hasChildren ? "dropdown" : undefined}
          >
            <SmartLink href={item.href}>{item.label}</SmartLink>
            {hasChildren ? (
              <ul>
                {item.children!.map((child) => (
                  <li key={child.label}>
                    <SmartLink href={child.href}>{child.label}</SmartLink>
                  </li>
                ))}
              </ul>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
