import { getSessionUser } from "@/lib/auth";
import { HeroPageClient } from "@/components/admin/hero-page-client";

export default async function HeroPage() {
  const user = await getSessionUser();
  if (!user) return null;
  return <HeroPageClient user={user} />;
}
