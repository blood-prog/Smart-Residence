import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DirectorClient } from "./DirectorClient";

export const dynamic = "force-dynamic";

export default async function DirectorPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user?.id)
    .single();

  if (!["admin", "director"].includes(profile?.role || "")) {
    redirect("/dashboard");
  }

  // Global stats
  const { count: totalStudents } = await supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "student");
  const { count: totalTickets } = await supabase.from("maintenance_tickets").select("*", { count: "exact", head: true });
  const { count: resolvedTickets } = await supabase.from("maintenance_tickets").select("*", { count: "exact", head: true }).in("status", ["resolved", "closed"]);
  const { count: totalBookings } = await supabase.from("sports_bookings").select("*", { count: "exact", head: true });
  const { count: totalAnnouncements } = await supabase.from("announcements").select("*", { count: "exact", head: true });
  const { count: totalSummons } = await supabase.from("admin_summons").select("*", { count: "exact", head: true });

  // Issues by category
  const { data: categoryData } = await supabase
    .from("maintenance_tickets")
    .select("category");

  const categoryCounts: Record<string, number> = {};
  categoryData?.forEach((t: any) => {
    categoryCounts[t.category] = (categoryCounts[t.category] || 0) + 1;
  });
  const issuesByCategory = Object.entries(categoryCounts).map(([category, count]) => ({ category, count }));

  // Recent issues
  const { data: recentIssues } = await supabase
    .from("maintenance_tickets")
    .select("title, category, status, created_at")
    .order("created_at", { ascending: false })
    .limit(20);

  // Recent activity
  const { data: recentActivity } = await supabase
    .from("maintenance_tickets")
    .select("id, title, status, created_at, category")
    .order("created_at", { ascending: false })
    .limit(10);

  const total = totalTickets || 0;
  const resolved = resolvedTickets || 0;
  const successRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

  return (
    <DirectorClient
      stats={{
        totalStudents: totalStudents || 0,
        totalIssues: total,
        resolvedIssues: resolved,
        successRate,
        totalBookings: totalBookings || 0,
        totalAnnouncements: totalAnnouncements || 0,
        totalSummons: totalSummons || 0,
      }}
      issuesByCategory={issuesByCategory}
      recentIssues={recentIssues || []}
      recentActivity={recentActivity || []}
    />
  );
}
