import Link from "next/link";

export type PublicNavItem = {
  label: string;
  href: string;
};

export function DesktopMenu({ items }: { items: PublicNavItem[] }) {
  return (
    <ul className="main-menu__list">
      {items.map((item) => (
        <li key={item.label}>
          <Link href={item.href}>{item.label}</Link>
        </li>
      ))}
    </ul>
  );
}
