"use client";

import { useState } from "react";
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
import { updateProfile } from "./actions";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";

export function ProfileForm({ profile }: { profile: any }) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    const result = await updateProfile(formData);
    setLoading(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("تم تحديث الملف الشخصي بنجاح");
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="fullName" className="text-sm font-bold">الاسم الكامل</Label>
          <Input 
            id="fullName" 
            name="fullName" 
            defaultValue={profile?.full_name} 
            required 
            className="rounded-xl h-11"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phoneNumber" className="text-sm font-bold">رقم الهاتف</Label>
          <Input 
            id="phoneNumber" 
            name="phoneNumber" 
            defaultValue={profile?.phone_number} 
            placeholder="0xxxxxxxxx"
            className="rounded-xl h-11"
            dir="ltr"
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="faculty" className="text-sm font-bold">الكلية / المعهد</Label>
          <Input 
            id="faculty" 
            name="faculty" 
            defaultValue={profile?.faculty} 
            placeholder="مثلاً: كلية الإعلام"
            className="rounded-xl h-11"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="yearOfStudy" className="text-sm font-bold">السنة الدراسية</Label>
          <Select name="yearOfStudy" defaultValue={profile?.year_of_study}>
            <SelectTrigger className="rounded-xl h-11">
              <SelectValue placeholder="اختر السنة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="L1">السنة الأولى (ليسانس)</SelectItem>
              <SelectItem value="L2">السنة الثانية (ليسانس)</SelectItem>
              <SelectItem value="L3">السنة الثالثة (ليسانس)</SelectItem>
              <SelectItem value="M1">السنة الأولى (ماستر)</SelectItem>
              <SelectItem value="M2">السنة الثانية (ماستر)</SelectItem>
              <SelectItem value="D">دكتوراه</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="pt-4 border-t">
        <Button type="submit" className="w-full md:w-auto px-8 h-12 rounded-xl gap-2 text-lg font-medium shadow-lg" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="ml-2 h-5 w-5 animate-spin" />
              جارٍ الحفظ...
            </>
          ) : (
            <>
              <Save className="ml-2 h-5 w-5" />
              حفظ التغييرات
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
