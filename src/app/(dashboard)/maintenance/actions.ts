"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createTicket(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "يجب تسجيل الدخول لإرسال بلاغ صيانة" };
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;
  const priority = formData.get("priority") as string;
  const roomNumber = formData.get("roomNumber") as string;
  const building = formData.get("building") as string;

  const { error } = await supabase.from("maintenance_tickets").insert({
    student_id: user.id,
    title,
    description,
    category,
    priority,
    room_number: roomNumber,
    building,
    status: "open",
  });

  if (error) {
    return { error: "حدث خطأ أثناء إرسال البلاغ، يرجى المحاولة لاحقاً" };
  }

  revalidatePath("/maintenance");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function closeTicket(ticketId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "غير مصرح لك" };

  const { error } = await supabase
    .from("maintenance_tickets")
    .update({ status: "closed" })
    .eq("id", ticketId)
    .eq("student_id", user.id);

  if (error) return { error: "فشل إغلاق البلاغ" };

  revalidatePath("/maintenance");
  revalidatePath("/dashboard");
  return { success: true };
}
