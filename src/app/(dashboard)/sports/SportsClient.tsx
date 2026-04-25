"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { BookingModal } from "./booking-modal";
import { Trophy, Clock, Plus, CalendarIcon, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

gsap.registerPlugin(useGSAP);

export function SportsClient({ facilities, userBookings }: { facilities: any[], userBookings: any[] }) {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Header animation
    gsap.fromTo(
      ".gsap-header",
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
    );

    // Facilities entry
    gsap.fromTo(
      ".gsap-facility-card",
      { opacity: 0, y: 40, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.1, ease: "back.out(1.2)", delay: 0.2 }
    );

    // Bookings entry
    gsap.fromTo(
      ".gsap-booking-card",
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, duration: 0.5, stagger: 0.1, ease: "power3.out", delay: 0.4 }
    );
  }, { scope: container });

  return (
    <div ref={container} className="space-y-10 pb-10">
      {/* Page Header */}
      <div className="gsap-header flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-br from-primary/10 via-primary/5 to-background p-8 rounded-[2rem] border border-primary/10 shadow-sm relative overflow-hidden">
        <div className="absolute -left-10 -top-10 opacity-5 pointer-events-none">
            <Trophy className="w-64 h-64" />
        </div>
        <div className="space-y-3 relative z-10">
          <div className="flex items-center gap-3 text-primary">
            <div className="p-3 bg-primary/10 rounded-2xl">
                <Trophy className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">مصلحة النشاطات الرياضية</h1>
          </div>
          <p className="text-muted-foreground max-w-xl text-lg">
            استكشف المرافق الرياضية المتاحة في الإقامة وقم بحجز موعد لممارسة نشاطك المفضل مع زملائك.
          </p>
        </div>
        <div className="flex gap-4 relative z-10">
          <div className="bg-background/80 backdrop-blur-md px-8 py-4 rounded-[1.5rem] border border-white/20 shadow-xl shadow-primary/5 text-center">
            <p className="text-sm text-muted-foreground font-medium mb-1">حجوزاتك النشطة</p>
            <p className="text-4xl font-black text-primary">
              {userBookings?.filter(b => b.status === 'approved' || b.status === 'pending').length || 0}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Facilities List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <span className="p-2 bg-primary/10 text-primary rounded-xl"><Plus className="w-5 h-5" /></span>
              المرافق المتاحة للحجز
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {facilities?.map((facility) => (
              <Card key={facility.id} className="gsap-facility-card group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 rounded-[2rem] bg-card flex flex-col h-full">
                {/* Image Section */}
                <div className="relative h-56 overflow-hidden bg-muted">
                  {facility.name.includes('قدم') || facility.name.includes('ملعب') ? (
                    <img 
                      src="/stadium.jpg" 
                      alt={facility.name} 
                      className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110 group-hover:rotate-1" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Trophy className="w-16 h-16 text-muted-foreground/30 transition-transform duration-500 group-hover:scale-125 group-hover:text-primary/40" />
                    </div>
                  )}
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100" />
                  
                  {/* Overlay Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-row items-end justify-between text-white z-10">
                    <h3 className="text-2xl font-bold translate-y-2 group-hover:translate-y-0 transition-transform duration-500 ease-out drop-shadow-md">{facility.name}</h3>
                    <Badge variant="secondary" className="rounded-xl backdrop-blur-md bg-white/20 text-white border-white/20 px-3 py-1 font-bold translate-y-2 group-hover:translate-y-0 transition-transform duration-500 ease-out shadow-lg">
                      {facility.capacity} شخص
                    </Badge>
                  </div>
                </div>

                <div className="p-6 flex-grow flex flex-col">
                  <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed flex-grow">
                    {facility.description}
                  </p>
                  <div className="mt-6">
                    <BookingModal facility={facility} />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* User Bookings Sidebar */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <span className="p-2 bg-primary/10 text-primary rounded-xl"><Clock className="w-5 h-5" /></span>
            سجل حجوزاتك
          </h2>

          <div className="space-y-4">
            {userBookings && userBookings.length > 0 ? userBookings.map((booking: any) => (
              <Card key={booking.id} className="gsap-booking-card border border-border/50 shadow-md hover:shadow-lg transition-all duration-300 rounded-[1.5rem] bg-card/80 backdrop-blur-sm overflow-hidden group">
                <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <div className="space-y-1.5">
                      <p className="font-bold text-base group-hover:text-primary transition-colors">{booking.sports_facilities?.name}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground bg-secondary/50 px-2 py-1 rounded-md w-fit">
                        <CalendarIcon className="w-3.5 h-3.5 text-primary/70" />
                        <span>{booking.booking_date}</span>
                      </div>
                    </div>
                    <Badge className={`
                      px-3 py-1 rounded-full text-xs font-bold shadow-sm
                      ${booking.status === 'approved' ? 'bg-green-500/15 text-green-600 border-none' :
                        booking.status === 'pending' ? 'bg-orange-500/15 text-orange-600 border-none' :
                          'bg-destructive/15 text-destructive border-none'}
                    `}>
                      {booking.status === 'approved' ? 'مؤكد' :
                        booking.status === 'pending' ? 'قيد الانتظار' : 'ملغي'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <span className="bg-primary/5 text-primary font-mono text-sm px-3 py-1.5 rounded-lg border border-primary/10" dir="ltr">{booking.time_slot}</span>
                    {booking.status === 'pending' && (
                      <Button variant="ghost" size="sm" className="h-8 text-destructive hover:text-white hover:bg-destructive rounded-lg transition-all">
                        إلغاء الحجز
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )) : (
              <div className="text-center py-16 px-6 border border-dashed rounded-[2rem] bg-secondary/20 flex flex-col items-center justify-center">
                <div className="p-4 bg-muted rounded-full mb-4">
                  <Info className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-base font-medium text-foreground">لا يوجد حجوزات حالياً</p>
                <p className="text-sm text-muted-foreground mt-1">ابدأ بحجز مرفق رياضي للعب مع أصدقائك</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
