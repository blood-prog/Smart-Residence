import { createClient } from "@/lib/supabase/server";
import { DashboardClient } from "./DashboardClient";
import { Trophy, Wrench, Home } from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();

  // Fetch initial data for dashboard
  const { data: announcements } = await supabase
    .from("announcements")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(3);

  const { data: bookings } = await supabase
    .from("sports_bookings")
    .select("*, sports_facilities(name)")
    .order("created_at", { ascending: false })
    .limit(3);

  const { data: tickets } = await supabase
    .from("maintenance_tickets")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(3);

  return (
    <DashboardClient 
      announcements={announcements || []}
      bookings={bookings || []}
      tickets={tickets || []}
    />
  );
}
