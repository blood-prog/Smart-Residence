"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createBooking(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "يجب تسجيل الدخول لإتمام الحجز" };
  }

  const facilityId = formData.get("facilityId") as string;
  const bookingDate = formData.get("bookingDate") as string;
  const timeSlot = formData.get("timeSlot") as string;
  const notes = formData.get("notes") as string;

  const { error } = await supabase.from("sports_bookings").insert({
    facility_id: facilityId,
    student_id: user.id,
    booking_date: bookingDate,
    time_slot: timeSlot,
    notes: notes,
    status: "pending",
  });

  if (error) {
    if (error.code === "23505") {
      return { error: "هذا الموعد محجوز مسبقاً، يرجى اختيار وقت آخر" };
    }
    return { error: "حدث خطأ أثناء الحجز، يرجى المحاولة لاحقاً" };
  }

  revalidatePath("/sports");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function cancelBooking(bookingId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "غير مصرح لك بالقيام بهذا الإجراء" };

  const { error } = await supabase
    .from("sports_bookings")
    .update({ status: "cancelled" })
    .eq("id", bookingId)
    .eq("student_id", user.id);

  if (error) return { error: "فشل إلغاء الحجز" };

  revalidatePath("/sports");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function updateBookingStatus(bookingId: string, status: "approved" | "rejected") {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "غير مصرح لك بالقيام بهذا الإجراء" };

  // Note: RLS ensures only sports_dept (or admins if configured) can update.
  const { error } = await supabase
    .from("sports_bookings")
    .update({ status })
    .eq("id", bookingId);

  if (error) return { error: "حدث خطأ أثناء تحديث حالة الحجز" };

  revalidatePath("/sports");
  revalidatePath("/dashboard");
  return { success: true };
}
