import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { HousingAdminClient } from "./HousingAdminClient";

export const dynamic = "force-dynamic";

export default async function HousingAdminPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user?.id)
    .single();

  if (!["housing_dept", "admin", "director"].includes(profile?.role || "")) {
    redirect("/dashboard");
  }

  // All students with room info
  const { data: students } = await supabase
    .from("profiles")
    .select("id, full_name, student_id, room_number, building, phone, role")
    .eq("role", "student")
    .order("building")
    .order("room_number");

  // Housing requests
  const { data: requests } = await supabase
    .from("housing_requests")
    .select("*, profiles(full_name, student_id, room_number, building)")
    .order("created_at", { ascending: false });

  // Summons
  const { data: summons } = await supabase
    .from("admin_summons")
    .select("*, profiles!admin_summons_student_id_fkey(full_name, student_id, room_number, building)")
    .order("created_at", { ascending: false });

  // Stats
  const totalStudents = students?.length || 0;
  const occupiedRooms = new Set(
    students?.filter((s: any) => s.room_number).map((s: any) => `${s.building}-${s.room_number}`)
  ).size;
  const { count: pendingRequests } = await supabase
    .from("housing_requests")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending");

  return (
    <HousingAdminClient
      students={students || []}
      requests={requests || []}
      summons={summons || []}
      currentUserId={user?.id || ""}
      stats={{
        totalStudents,
        occupiedRooms,
        pendingRequests: pendingRequests || 0,
        totalSummons: summons?.length || 0,
      }}
    />
  );
}
