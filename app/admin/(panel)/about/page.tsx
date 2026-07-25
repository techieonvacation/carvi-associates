import { getSessionUser } from "@/lib/auth";
import { AboutPageClient } from "@/components/admin/about-page-client";

export default async function AboutPage() {
  const user = await getSessionUser();
  if (!user) return null;
  return <AboutPageClient user={user} />;
}