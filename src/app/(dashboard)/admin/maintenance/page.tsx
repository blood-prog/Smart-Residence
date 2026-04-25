import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { MaintenanceAdminClient } from "./MaintenanceAdminClient";

export const dynamic = "force-dynamic";

export default async function MaintenanceAdminPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user?.id)
    .single();

  if (!["maintenance_dept", "admin", "director"].includes(profile?.role || "")) {
    redirect("/dashboard");
  }

  // Fetch all tickets with student info
  const { data: tickets } = await supabase
    .from("maintenance_tickets")
    .select("*, profiles(full_name, room_number, building)")
    .order("created_at", { ascending: false });

  // Stats
  const { count: totalTickets } = await supabase
    .from("maintenance_tickets")
    .select("*", { count: "exact", head: true });
  const { count: openTickets } = await supabase
    .from("maintenance_tickets")
    .select("*", { count: "exact", head: true })
    .eq("status", "open");
  const { count: inProgressTickets } = await supabase
    .from("maintenance_tickets")
    .select("*", { count: "exact", head: true })
    .eq("status", "in_progress");
  const { count: resolvedTickets } = await supabase
    .from("maintenance_tickets")
    .select("*", { count: "exact", head: true })
    .eq("status", "resolved");

  return (
    <MaintenanceAdminClient
      tickets={tickets || []}
      stats={{
        total: totalTickets || 0,
        open: openTickets || 0,
        inProgress: inProgressTickets || 0,
        resolved: resolvedTickets || 0,
      }}
    />
  );
}
