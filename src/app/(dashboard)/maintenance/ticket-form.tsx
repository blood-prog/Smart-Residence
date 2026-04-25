"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createTicket } from "./actions";
import { toast } from "sonner";
import { Loader2, Send } from "lucide-react";

export function TicketForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    const result = await createTicket(formData);
    setLoading(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("تم إرسال بلاغ مصلحة الصيانة بنجاح");
      // Reset form (simplified way)
      const form = document.getElementById("ticket-form") as HTMLFormElement;
      form?.reset();
      router.refresh();
    }
  }

  return (
    <form id="ticket-form" action={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="title" className="text-sm font-bold">عنوان البلاغ</Label>
        <Input 
          id="title" 
          name="title" 
          placeholder="مثلاً: صنبور المياه يسرب" 
          required 
          className="rounded-xl h-11"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category" className="text-sm font-bold">الفئة</Label>
          <Select name="category" defaultValue="general" required>
            <SelectTrigger className="rounded-xl h-11">
              <SelectValue placeholder="اختر الفئة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="plumbing">سباكة</SelectItem>
              <SelectItem value="electrical">كهرباء</SelectItem>
              <SelectItem value="furniture">أثاث</SelectItem>
              <SelectItem value="cleaning">نظافة</SelectItem>
              <SelectItem value="general">أخرى</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="priority" className="text-sm font-bold">الأولوية</Label>
          <Select name="priority" defaultValue="medium" required>
            <SelectTrigger className="rounded-xl h-11">
              <SelectValue placeholder="اختر الأولوية" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">منخفضة</SelectItem>
              <SelectItem value="medium">متوسطة</SelectItem>
              <SelectItem value="high">عالية</SelectItem>
              <SelectItem value="critical">حرج (طارئ)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="building" className="text-sm font-bold">المبنى</Label>
          <Input id="building" name="building" placeholder="أ، ب، ج..." required className="rounded-xl h-11" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="roomNumber" className="text-sm font-bold">رقم الغرفة</Label>
          <Input id="roomNumber" name="roomNumber" placeholder="101" required className="rounded-xl h-11" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm font-bold">وصف المشكلة</Label>
        <Textarea 
          id="description" 
          name="description" 
          placeholder="يرجى شرح العطل بالتفصيل..." 
          required 
          className="rounded-xl min-h-[120px] resize-none"
        />
      </div>

      <Button type="submit" className="w-full h-12 rounded-xl text-lg font-medium shadow-lg" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="ml-2 h-5 w-5 animate-spin" />
            جارٍ الإرسال...
          </>
        ) : (
          <>
            <Send className="ml-2 h-5 w-5" />
            إرسال البلاغ
          </>
        )}
      </Button>
    </form>
  );
}
