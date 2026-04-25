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
import { createHousingRequest } from "./actions";
import { toast } from "sonner";
import { Loader2, FileText } from "lucide-react";

export function HousingForm({ profile }: { profile: any }) {
  const [loading, setLoading] = useState(false);
  const [requestType, setRequestType] = useState("room_change");
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    const result = await createHousingRequest(formData);
    setLoading(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("تم إرسال الطلب بنجاح");
      const form = document.getElementById("housing-form") as HTMLFormElement;
      form?.reset();
      router.refresh();
    }
  }

  return (
    <form id="housing-form" action={handleSubmit} className="space-y-4">
      <input type="hidden" name="currentRoom" value={profile?.room_number || ""} />
      
      <div className="space-y-2">
        <Label className="text-sm font-bold">نوع الطلب</Label>
        <Select name="type" defaultValue="room_change" onValueChange={(val) => setRequestType(val || "room_change")}>
          <SelectTrigger className="rounded-xl h-11">
            <SelectValue placeholder="اختر نوع الطلب" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="room_change">تغيير الغرفة</SelectItem>
            <SelectItem value="extension">تمديد الإقامة</SelectItem>
            <SelectItem value="complaint">شكوى متعلقة بالإيواء</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {requestType === "room_change" && (
        <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
          <Label htmlFor="targetRoom" className="text-sm font-bold">الغرفة المطلوبة (اختياري)</Label>
          <Input 
            id="targetRoom" 
            name="targetRoom" 
            placeholder="مثلاً: 204" 
            className="rounded-xl h-11"
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="reason" className="text-sm font-bold">السبب أو التفاصيل</Label>
        <Textarea 
          id="reason" 
          name="reason" 
          placeholder="اشرح سبب طلبك هنا..." 
          required 
          className="rounded-xl min-h-[100px] resize-none"
        />
      </div>

      <Button type="submit" className="w-full h-11 rounded-xl bg-blue-700 hover:bg-blue-800" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="ml-2 h-4 w-4 animate-spin" />
            جارٍ الإرسال...
          </>
        ) : (
          <>
            <FileText className="ml-2 h-4 w-4" />
            إرسال الطلب
          </>
        )}
      </Button>
    </form>
  );
}
