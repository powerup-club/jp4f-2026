import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { isAdminEmail } from "@/admin/config";
import { AdminDashboardClient } from "@/components/admin/AdminDashboardClient";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await auth().catch(() => null);

  if (!session?.user?.email) {
    redirect("/admin/login?callbackUrl=%2Fadmin");
  }

  if (!isAdminEmail(session.user.email)) {
    redirect("/admin/login?error=AccessDenied&callbackUrl=%2Fadmin");
  }

  return <AdminDashboardClient userEmail={session.user.email} />;
}
