import { createClient } from "@/lib/supabase/server";
import { SportsClient } from "./SportsClient";

export default async function SportsPage() {
  const supabase = await createClient();

  // Fetch facilities
  const { data: facilities } = await supabase
    .from("sports_facilities")
    .select("*")
    .eq("is_active", true);

  // Fetch user's bookings
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user?.id)
    .single();

  let bookingsQuery = supabase
    .from("sports_bookings")
    .select("*, sports_facilities(name), profiles(full_name)")
    .order("booking_date", { ascending: false });

  if (profile?.role === "student") {
    bookingsQuery = bookingsQuery.eq("student_id", user?.id);
  }

  const { data: userBookings } = await bookingsQuery;

  return (
    <SportsClient 
      facilities={facilities || []} 
      userBookings={userBookings || []} 
      userRole={profile?.role}
    />
  );
}
