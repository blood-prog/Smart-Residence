"use client";

import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
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
import { createBooking } from "./actions";
import { toast } from "sonner";
import { Loader2, Calendar } from "lucide-react";

interface BookingModalProps {
  facility: {
    id: string;
    name: string;
  };
}

const TIME_SLOTS = [
  "08:00 - 10:00",
  "10:00 - 12:00",
  "14:00 - 16:00",
  "16:00 - 18:00",
  "18:00 - 20:00",
  "20:00 - 22:00",
];

export function BookingModal({ facility }: BookingModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    const result = await createBooking(formData);
    setLoading(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("تم إرسال طلب الحجز بنجاح");
      setOpen(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className="w-full rounded-xl gap-2">
            <Calendar className="w-4 h-4" />
            حجز الآن
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[450px] rounded-[2rem] p-0 overflow-hidden border-none shadow-2xl" dir="rtl">
        <div className="p-8 space-y-6">
          <DialogHeader className="text-right space-y-3">
            <DialogTitle className="text-2xl font-bold">حجز {facility.name}</DialogTitle>
            <DialogDescription className="text-base">
              يرجى اختيار التاريخ والوقت المناسب لحجزك.
            </DialogDescription>
          </DialogHeader>

          <form action={handleSubmit} className="space-y-6">
            <input type="hidden" name="facilityId" value={facility.id} />
            
            <div className="space-y-3">
              <Label htmlFor="bookingDate" className="text-sm font-bold pr-1">التاريخ</Label>
              <div className="relative">
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input 
                  id="bookingDate" 
                  name="bookingDate" 
                  type="date" 
                  required 
                  min={new Date().toISOString().split('T')[0]}
                  className="rounded-2xl h-12 pr-10 border-muted-foreground/20 focus:border-primary transition-colors"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="timeSlot" className="text-sm font-bold pr-1">الوقت</Label>
              <Select name="timeSlot" required>
                <SelectTrigger className="rounded-2xl h-12 border-muted-foreground/20 focus:border-primary transition-colors" dir="rtl">
                  <SelectValue placeholder="اختر فترة زمنية" />
                </SelectTrigger>
                <SelectContent dir="rtl">
                  {TIME_SLOTS.map((slot) => (
                    <SelectItem key={slot} value={slot}>
                      {slot}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label htmlFor="notes" className="text-sm font-bold pr-1">ملاحظات إضافية (اختياري)</Label>
              <Textarea 
                id="notes" 
                name="notes" 
                placeholder="مثلاً: أسماء الزملاء المشاركين..." 
                className="rounded-2xl min-h-[100px] border-muted-foreground/20 focus:border-primary transition-colors resize-none p-4"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button type="submit" className="flex-1 h-12 rounded-2xl text-base font-bold shadow-lg shadow-primary/20" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                    جارٍ المعالجة...
                  </>
                ) : (
                  "تأكيد الحجز"
                )}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setOpen(false)}
                className="flex-1 h-12 rounded-2xl text-base border-muted-foreground/20 hover:bg-muted"
              >
                إلغاء
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
