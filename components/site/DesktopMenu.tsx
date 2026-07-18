import Link from "next/link";
import { MENU, type NavLink } from "./nav-data";

/** Renders nested <ul> dropdowns (levels 2+). */
function SubMenu({ items }: { items: NavLink[] }) {
  return (
    <ul>
      {items.map((item) => {
        const hasChildren = !!item.children?.length;
        return (
          <li key={item.label} className={hasChildren ? "dropdown" : undefined}>
            <Link href={item.href}>{item.label}</Link>
            {hasChildren && <SubMenu items={item.children!} />}
          </li>
        );
      })}
    </ul>
  );
}

export function DesktopMenu() {
  return (
    <ul className="main-menu__list">
      {MENU.map((item) => {
        const hasChildren = !!item.children?.length;
        return (
          <li key={item.label} className={hasChildren ? "dropdown" : undefined}>
            <Link href={item.href}>{item.label}</Link>
            {hasChildren && <SubMenu items={item.children!} />}
          </li>
        );
      })}
    </ul>
  );
}
