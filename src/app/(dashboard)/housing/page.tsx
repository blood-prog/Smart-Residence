import { createClient } from "@/lib/supabase/server";
import { HousingClient } from "./HousingClient";

export default async function HousingPage() {
  const supabase = await createClient();

  // Fetch user profile and housing requests
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.id)
    .single();

  let query = supabase
    .from("housing_requests")
    .select("*")
    .order("created_at", { ascending: false });

  // If not admin, filter by student_id
  if (profile?.role === "student") {
    query = query.eq("student_id", user?.id);
  }

  const { data: requests } = await query;

  return (
    <HousingClient 
      profile={profile}
      requests={requests || []}
    />
  );
}
