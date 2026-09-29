import { redirect } from "next/navigation";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { getSessionUser } from "@/lib/auth";

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();
  if (!user) {
    redirect("/admin/login");
  }

  return (
    <ThemeProvider>
      <TooltipProvider>
        <SidebarProvider>
          <AdminSidebar role={user.role} />
          <SidebarInset className="min-h-screen bg-[radial-gradient(circle_at_top,color-mix(in_oklab,var(--secondary)_70%,transparent),transparent_35%)]">
            {children}
          </SidebarInset>
        </SidebarProvider>
        <Toaster richColors closeButton position="top-right" />
      </TooltipProvider>
    </ThemeProvider>
  );
}
