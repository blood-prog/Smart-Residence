"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createSummons(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const studentId = formData.get("student_id") as string;
  const reason = formData.get("reason") as string;
  const details = formData.get("details") as string;

  const { error } = await supabase.from("admin_summons").insert({
    student_id: studentId,
    issued_by: user?.id,
    reason,
    details,
  });

  if (error) throw new Error(error.message);
  revalidatePath("/admin/housing");
}
