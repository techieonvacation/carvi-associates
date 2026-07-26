import { getSessionUser } from "@/lib/auth";
import { BookAppointmentPageClient } from "@/components/admin/book-appointment-page-client";

export default async function BookAppointmentAdminPage() {
  const user = await getSessionUser();
  if (!user) return null;
  return <BookAppointmentPageClient user={user} />;
}
