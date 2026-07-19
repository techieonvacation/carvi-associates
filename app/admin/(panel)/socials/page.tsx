import { getSessionUser } from "@/lib/auth";
import { SocialsPageClient } from "@/components/admin/socials-page-client";

export default async function SocialsPage() {
  const user = await getSessionUser();
  if (!user) return null;
  return <SocialsPageClient user={user} />;
}
