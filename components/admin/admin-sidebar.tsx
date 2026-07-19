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

const items = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/topbar", label: "Top Bar", icon: PanelTop },
  { href: "/admin/navigation", label: "Navigation", icon: Navigation },
  { href: "/admin/hero", label: "Hero Section", icon: Sparkles },
  { href: "/admin/header", label: "Header CTA", icon: Megaphone },
  { href: "/admin/socials", label: "Social Links", icon: Share2 },
];

type AdminSidebarProps = {
  role: "ADMIN" | "MANAGER";
};

export function AdminSidebar({ role }: AdminSidebarProps) {
  const pathname = usePathname();
  const navItems =
    role === "ADMIN"
      ? [...items, { href: "/admin/users", label: "Users", icon: Users, exact: false }]
      : items;

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
            <SidebarMenu>
              {navItems.map((item) => {
                const active = item.exact
                  ? pathname === item.href
                  : pathname.startsWith(item.href);
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
              })}
            </SidebarMenu>
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
