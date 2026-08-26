import { getSessionUser } from "@/lib/auth";
import { ContactPageClient } from "@/components/admin/contact-page-client";

export default async function ContactPage() {
  const user = await getSessionUser();
  if (!user) return null;
  return <ContactPageClient user={user} />;
}
