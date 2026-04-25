import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getAdminRoute, isAdminRole } from "@/lib/admin-roles";

export const dynamic = "force-dynamic";

/**
 * Admin Router — redirects each admin to their role-specific dashboard
 */
export default async function AdminPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!isAdminRole(profile?.role)) {
    redirect("/dashboard");
  }

  // Redirect to role-specific dashboard
  redirect(getAdminRoute(profile?.role));
}
