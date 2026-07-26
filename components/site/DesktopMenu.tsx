import Link from "next/link";
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
            <Link href={item.href}>{item.label}</Link>
            {hasChildren ? (
              <ul>
                {item.children!.map((child) => (
                  <li key={child.label}>
                    <Link href={child.href}>{child.label}</Link>
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
