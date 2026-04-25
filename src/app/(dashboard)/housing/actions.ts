"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createHousingRequest(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "يجب تسجيل الدخول لإرسال طلب" };
  }

  const type = formData.get("type") as string;
  const reason = formData.get("reason") as string;
  const currentRoom = formData.get("currentRoom") as string;
  const targetRoom = formData.get("targetRoom") as string;

  const { error } = await supabase.from("housing_requests").insert({
    student_id: user.id,
    request_type: type,
    description: reason,
    current_room: currentRoom,
    requested_room: targetRoom || null,
    status: "pending",
  });

  if (error) {
    return { error: "حدث خطأ أثناء إرسال الطلب، يرجى المحاولة لاحقاً" };
  }

  revalidatePath("/housing");
  revalidatePath("/dashboard");
  return { success: true };
}
