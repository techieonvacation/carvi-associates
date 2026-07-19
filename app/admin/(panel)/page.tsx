import Link from "next/link";
import {
  ArrowUpRight,
  Navigation,
  PanelTop,
  Share2,
  Sparkles,
  Users,
} from "lucide-react";
import { AdminHeader } from "@/components/admin/admin-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const user = await getSessionUser();
  if (!user) return null;

  const [navCount, socialCount] = await Promise.all([
    prisma.navItem.count(),
    prisma.socialLink.count(),
  ]);

  const cards = [
    {
      title: "Top Bar",
      description: "Email, address, phone, and WhatsApp channel",
      href: "/admin/topbar",
      icon: PanelTop,
    },
    {
      title: "Navigation",
      description: `${navCount} menu items configured`,
      href: "/admin/navigation",
      icon: Navigation,
    },
    {
      title: "Hero Section",
      description: "Headline, CTA, video, and hero imagery",
      href: "/admin/hero",
      icon: Sparkles,
    },
    {
      title: "Social Links",
      description: `${socialCount} social profiles connected`,
      href: "/admin/socials",
      icon: Share2,
    },
  ];

  return (
    <>
      <AdminHeader
        user={user}
        title="Dashboard"
        description="Manage the public website content from one place."
      />
      <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <Link key={card.href} href={card.href} className="group">
                <Card className="h-full border-border/70 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg">
                  <CardHeader className="space-y-4">
                    <div className="flex size-11 items-center justify-center rounded-xl bg-primary/12 text-primary transition-transform duration-300 group-hover:scale-105">
                      <Icon className="size-5" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{card.title}</CardTitle>
                      <CardDescription>{card.description}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                      Open
                      <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </section>

        <Card className="border-border/70">
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <div>
              <CardTitle>Account</CardTitle>
              <CardDescription>Your current workspace access level.</CardDescription>
            </div>
            <Badge variant="secondary" className="capitalize">
              {user.role.toLowerCase()}
            </Badge>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
            {user.role === "ADMIN" ? (
              <Link
                href="/admin/users"
                className="inline-flex items-center gap-2 text-sm font-medium text-primary"
              >
                <Users className="size-4" />
                Manage users
              </Link>
            ) : null}
          </CardContent>
        </Card>
      </main>
    </>
  );
}
