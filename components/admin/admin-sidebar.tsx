"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PanelTop,
  Navigation,
  Sparkles,
  Megaphone,
  Share2,
  Users,
  ExternalLink,
  Building2,
  LayoutGrid,
  Info,
  BriefcaseBusiness,
  CalendarCheck2,
  BadgeCheck,
  UsersRound,
  Waypoints,
  PanelBottom,
  GalleryHorizontal,
  Newspaper,
  MailPlus,
  Search,
  FileCode2,
  Braces,
  TerminalSquare,
  Route,
  Gauge,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";

const contentItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/topbar", label: "Top Bar", icon: PanelTop },
  { href: "/admin/navigation", label: "Navigation", icon: Navigation },
  { href: "/admin/hero", label: "Hero Section", icon: Sparkles },
  { href: "/admin/partners", label: "Partner Marquee", icon: Building2 },
  { href: "/admin/features", label: "Features", icon: LayoutGrid },
  { href: "/admin/about", label: "About", icon: Info },
  { href: "/admin/services", label: "Services", icon: BriefcaseBusiness },
  { href: "/admin/book-appointment", label: "Book Appointment", icon: CalendarCheck2 },
  { href: "/admin/why-choose", label: "Why Choose Us", icon: BadgeCheck },
  { href: "/admin/marquee", label: "Marquee Bands", icon: GalleryHorizontal },
  { href: "/admin/team", label: "Team", icon: UsersRound },
  { href: "/admin/blog", label: "Blog", icon: Newspaper },
  { href: "/admin/working-process", label: "Working Process", icon: Waypoints },
  { href: "/admin/contact", label: "Contact", icon: MailPlus },
  { href: "/admin/footer", label: "Footer", icon: PanelBottom },
  { href: "/admin/header", label: "Header & Logo", icon: Megaphone },
  { href: "/admin/socials", label: "Social Links", icon: Share2 },
];

const seoItems = [
  { href: "/admin/seo", label: "Global SEO", icon: Search, exact: true },
  { href: "/admin/seo/pages", label: "Page SEO", icon: FileCode2 },
  { href: "/admin/seo/structured-data", label: "Structured Data", icon: Braces },
  { href: "/admin/seo/scripts", label: "Tracking & Scripts", icon: TerminalSquare },
  { href: "/admin/seo/technical", label: "Technical SEO", icon: Route },
  { href: "/admin/seo/audit", label: "SEO Health", icon: Gauge },
];

type AdminSidebarProps = {
  role: "ADMIN" | "MANAGER";
};

export function AdminSidebar({ role }: AdminSidebarProps) {
  const pathname = usePathname();
  const navItems =
    role === "ADMIN"
      ? [...contentItems, { href: "/admin/users", label: "Users", icon: Users, exact: false }]
      : contentItems;

  function renderItem(item: {
    href: string;
    label: string;
    icon: typeof LayoutDashboard;
    exact?: boolean;
  }) {
    const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
    const Icon = item.icon;
    return (
      <SidebarMenuItem key={item.href}>
        <SidebarMenuButton
          render={<Link href={item.href} />}
          isActive={active}
          tooltip={item.label}
          className="transition-all duration-200 data-[active=true]:bg-primary/15 data-[active=true]:text-foreground"
        >
          <Icon className="size-4" />
          <span>{item.label}</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border/80">
      <SidebarHeader className="border-b border-sidebar-border/70 px-4 py-5">
        <div className="flex items-center gap-3 overflow-hidden transition-all duration-300 group-data-[collapsible=icon]:justify-center">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <span className="text-sm font-bold">CA</span>
          </div>
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <p className="truncate text-sm font-semibold">Carvi CMS</p>
            <p className="truncate text-xs text-muted-foreground">Content Studio</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Content</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{navItems.map(renderItem)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>SEO &amp; AEO</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{seoItems.map(renderItem)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border/70 p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton render={<Link href="/" target="_blank" />} tooltip="View website">
              <ExternalLink className="size-4" />
              <span>View Website</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <div className="px-2 pt-2 group-data-[collapsible=icon]:hidden">
          <Badge variant="secondary" className="w-full justify-center capitalize">
            {role.toLowerCase()}
          </Badge>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
