import { getSessionUser, requireAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import { UsersPageClient } from "@/components/admin/users-page-client";

export default async function UsersPage() {
  const user = await getSessionUser();
  if (!user) return null;
  if (!requireAdmin(user)) {
    redirect("/admin");
  }
  return <UsersPageClient user={user} />;
}
