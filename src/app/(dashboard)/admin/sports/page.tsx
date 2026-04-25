import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { SportsAdminClient } from "./SportsAdminClient";

export const dynamic = "force-dynamic";

export default async function SportsAdminPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user?.id)
    .single();

  if (!["sports_dept", "admin", "director"].includes(profile?.role || "")) {
    redirect("/dashboard");
  }

  // Fetch all facilities
  const { data: facilities } = await supabase
    .from("sports_facilities")
    .select("*")
    .order("name");

  // Fetch all bookings with student info
  const { data: bookings } = await supabase
    .from("sports_bookings")
    .select("*, sports_facilities(name), profiles(full_name, room_number, student_id)")
    .order("booking_date", { ascending: false });

  // Stats
  const { count: totalBookings } = await supabase
    .from("sports_bookings")
    .select("*", { count: "exact", head: true });
  const { count: pendingBookings } = await supabase
    .from("sports_bookings")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending");
  const { count: approvedBookings } = await supabase
    .from("sports_bookings")
    .select("*", { count: "exact", head: true })
    .eq("status", "approved");
  const { count: facilityCount } = await supabase
    .from("sports_facilities")
    .select("*", { count: "exact", head: true })
    .eq("is_active", true);

  return (
    <SportsAdminClient
      facilities={facilities || []}
      bookings={bookings || []}
      stats={{
        total: totalBookings || 0,
        pending: pendingBookings || 0,
        approved: approvedBookings || 0,
        facilities: facilityCount || 0,
      }}
    />
  );
}
