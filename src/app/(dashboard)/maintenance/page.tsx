import { createClient } from "@/lib/supabase/server";
import { MaintenanceClient } from "./MaintenanceClient";

export const dynamic = "force-dynamic";

export default async function MaintenancePage() {
  const supabase = await createClient();

  // Fetch user and profile
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.id)
    .single();

  let query = supabase
    .from("maintenance_tickets")
    .select("*")
    .order("created_at", { ascending: false });

  // If not admin, filter by student_id
  if (profile?.role === "student") {
    query = query.eq("student_id", user?.id);
  }

  const { data: tickets, error: ticketsError } = await query;

  if (ticketsError) {
    console.error("Error fetching tickets:", ticketsError);
  }

  const openTicketsCount = tickets?.filter(t => t.status !== 'closed' && t.status !== 'resolved').length || 0;

  return (
    <MaintenanceClient 
      tickets={tickets || []}
      openTicketsCount={openTicketsCount}
    />
  );
}
