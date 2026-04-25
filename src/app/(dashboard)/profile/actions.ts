"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "غير مصرح لك" };
  }

  const fullName = formData.get("fullName") as string;
  const phoneNumber = formData.get("phoneNumber") as string;
  const faculty = formData.get("faculty") as string;
  const yearOfStudy = formData.get("yearOfStudy") as string;

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: fullName,
      phone_number: phoneNumber,
      faculty: faculty,
      year_of_study: yearOfStudy,
    })
    .eq("id", user.id);

  if (error) {
    return { error: "حدث خطأ أثناء تحديث البيانات" };
  }

  revalidatePath("/profile");
  revalidatePath("/dashboard");
  return { success: true };
}
