import { createClient } from "@/lib/supabase/server";
import { ProfileClient } from "./ProfileClient";

export default async function ProfilePage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.id)
    .single();

  return (
    <ProfileClient 
      user={user}
      profile={profile}
    />
  );
}
