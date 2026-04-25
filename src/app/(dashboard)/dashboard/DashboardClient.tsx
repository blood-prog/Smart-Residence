"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Trophy, 
  Wrench, 
  Home, 
  Megaphone,
  Clock
} from "lucide-react";

gsap.registerPlugin(useGSAP);

interface DashboardClientProps {
  announcements: any[];
  bookings: any[];
  tickets: any[];
}

export function DashboardClient({ announcements, bookings, tickets }: DashboardClientProps) {
  const container = useRef<HTMLDivElement>(null);

  const stats = [
    {
      title: "مصلحة النشاطات الرياضية",
      value: bookings?.length || 0,
      icon: Trophy,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      href: "/sports"
    },
    {
      title: "مصلحة الصيانة",
      value: tickets?.length || 0,
      icon: Wrench,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
      href: "/maintenance"
    },
    {
      title: "مصلحة الإيواء",
      value: 0, // Placeholder
      icon: Home,
      color: "text-green-500",
      bg: "bg-green-500/10",
      href: "/housing"
    }
  ];

  useGSAP(() => {
    // Header animation
    gsap.fromTo(
      ".gsap-dash-header",
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
    );

    // Stats entry
    gsap.fromTo(
      ".gsap-stat-card",
      { opacity: 0, y: 30, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.1, ease: "back.out(1.2)", delay: 0.2 }
    );

    // Number counters
    const statNumbers = gsap.utils.toArray(".gsap-stat-value") as HTMLElement[];
    statNumbers.forEach((el) => {
      const targetVal = parseInt(el.getAttribute("data-value") || "0", 10);
      // Start at 0, animate to targetVal
      el.innerHTML = "0";
      gsap.to(el, {
        innerHTML: targetVal,
        duration: 1.5,
        ease: "power2.out",
        snap: { innerHTML: 1 },
        delay: 0.4,
      });
    });

    // Widgets entry
    gsap.fromTo(
      ".gsap-widget",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: "power3.out", delay: 0.4 }
    );
  }, { scope: container });

  return (
    <div ref={container} className="space-y-8 pb-8">
      {/* Welcome Header */}
      <div className="gsap-dash-header flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-br from-primary/10 via-primary/5 to-background p-8 rounded-[2rem] border border-primary/10 shadow-sm relative overflow-hidden">
        <div className="absolute -right-10 -top-10 opacity-[0.03] pointer-events-none">
            <Home className="w-64 h-64" />
        </div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold tracking-tight text-primary">أهلاً بك مجدداً 👋</h1>
          <p className="text-muted-foreground mt-2 text-lg">هنا نظرة سريعة على حالة طلباتك وآخر التحديثات.</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-6 md:grid-cols-3">
        {stats.map((stat, i) => (
          <Link key={stat.title} href={stat.href} className="gsap-stat-card group outline-none">
            <Card className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 rounded-[2rem] bg-card h-full">
              <CardContent className="p-6 relative">
                <div className="absolute right-0 top-0 bottom-0 w-2 transition-colors duration-300 group-hover:bg-primary/20" />
                <div className="flex items-center justify-between relative z-10">
                  <div className="space-y-2">
                    <p className="text-sm font-bold text-muted-foreground">{stat.title}</p>
                    <p className="text-4xl font-black text-foreground gsap-stat-value" data-value={stat.value}>
                      0
                    </p>
                  </div>
                  <div className={`p-4 rounded-[1.5rem] ${stat.bg} ${stat.color} transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-inner`}>
                    <stat.icon className="w-8 h-8" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Announcements Feed */}
        <Card className="gsap-widget border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-[2rem] bg-card overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-6 border-b border-border/10 bg-secondary/10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-xl text-primary">
                <Megaphone className="w-5 h-5" />
              </div>
              <CardTitle className="text-xl font-bold">آخر الإعلانات</CardTitle>
            </div>
            <Link href="/announcements" className="text-sm font-bold text-primary hover:text-primary/80 transition-colors bg-primary/10 px-3 py-1.5 rounded-lg">عرض الكل</Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/5">
              {announcements?.length ? announcements.map((announcement) => (
                <div key={announcement.id} className="group p-6 space-y-3 hover:bg-secondary/30 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <Badge variant={
                      announcement.priority === 'urgent' ? 'destructive' :
                      announcement.priority === 'high' ? 'default' : 'secondary'
                    } className="rounded-xl px-3 py-1 font-bold shadow-sm">
                      {announcement.priority === 'urgent' ? 'عاجل' : 
                       announcement.priority === 'high' ? 'مهم' : 'عادي'}
                    </Badge>
                    <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-secondary/50 px-2.5 py-1 rounded-md">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(announcement.created_at).toLocaleDateString('ar-DZ')}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold group-hover:text-primary transition-colors">{announcement.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    {announcement.content}
                  </p>
                </div>
              )) : (
                <div className="p-16 flex flex-col items-center justify-center text-muted-foreground">
                  <Megaphone className="w-12 h-12 opacity-20 mb-4" />
                  <p className="font-medium">لا توجد إعلانات حالياً</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity / Tickets */}
        <div className="space-y-8">
          <Card className="gsap-widget border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-[2rem] bg-card overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-6 border-b border-border/10 bg-secondary/10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500/10 rounded-xl text-orange-500">
                  <Wrench className="w-5 h-5" />
                </div>
                <CardTitle className="text-xl font-bold">طلبات مصلحة الصيانة</CardTitle>
              </div>
              <Link href="/maintenance" className="text-sm font-bold text-orange-500 hover:text-orange-600 transition-colors bg-orange-500/10 px-3 py-1.5 rounded-lg">إضافة طلب</Link>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/5">
                {tickets?.length ? tickets.map((ticket) => (
                  <div key={ticket.id} className="group p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-secondary/30 transition-all duration-300">
                    <div className="space-y-2">
                      <h3 className="text-base font-bold group-hover:text-orange-500 transition-colors">{ticket.title}</h3>
                      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                        <span className="bg-secondary px-2 py-1 rounded-md">{ticket.category === 'plumbing' ? 'سباكة' : 
                               ticket.category === 'electrical' ? 'كهرباء' : 'عام'}</span>
                        <span className="opacity-50">•</span>
                        <span>{new Date(ticket.created_at).toLocaleDateString('ar-DZ')}</span>
                      </div>
                    </div>
                    <Badge className={`
                      rounded-xl px-3 py-1.5 font-bold shadow-sm self-start sm:self-auto
                      ${ticket.status === 'open' ? 'bg-blue-500/15 text-blue-600 hover:bg-blue-500/20 border-none' :
                        ticket.status === 'in_progress' ? 'bg-orange-500/15 text-orange-600 hover:bg-orange-500/20 border-none' :
                        'bg-green-500/15 text-green-600 hover:bg-green-500/20 border-none'}
                    `}>
                      {ticket.status === 'open' ? 'مفتوح' : 
                       ticket.status === 'in_progress' ? 'قيد المعالجة' : 'تم الحل'}
                    </Badge>
                  </div>
                )) : (
                  <div className="p-12 flex flex-col items-center justify-center text-muted-foreground">
                    <Wrench className="w-12 h-12 opacity-20 mb-4" />
                    <p className="font-medium">لا توجد طلبات صيانة حالياً</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="gsap-widget border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-[2rem] bg-card overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-6 border-b border-border/10 bg-secondary/10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-xl text-blue-500">
                  <Trophy className="w-5 h-5" />
                </div>
                <CardTitle className="text-xl font-bold">الحجوزات الرياضية القادمة</CardTitle>
              </div>
              <Link href="/sports" className="text-sm font-bold text-blue-500 hover:text-blue-600 transition-colors bg-blue-500/10 px-3 py-1.5 rounded-lg">حجز جديد</Link>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/5">
                {bookings?.length ? bookings.map((booking: any) => (
                  <div key={booking.id} className="group p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-secondary/30 transition-all duration-300">
                    <div className="space-y-2">
                      <h3 className="text-base font-bold group-hover:text-blue-500 transition-colors">{booking.sports_facilities?.name}</h3>
                      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                        <span className="bg-secondary px-2 py-1 rounded-md flex items-center gap-1.5"><Clock className="w-3 h-3"/>{booking.booking_date}</span>
                        <span className="opacity-50">•</span>
                        <span className="font-mono bg-blue-500/5 text-blue-600 px-2 py-1 rounded-md" dir="ltr">{booking.time_slot}</span>
                      </div>
                    </div>
                    <Badge className={`
                      rounded-xl px-3 py-1.5 font-bold shadow-sm self-start sm:self-auto
                      ${booking.status === 'approved' ? 'bg-green-500/15 text-green-600 border-none' : 
                        booking.status === 'pending' ? 'bg-orange-500/15 text-orange-600 border-none' : 
                        'bg-destructive/15 text-destructive border-none'}
                    `}>
                      {booking.status === 'approved' ? 'مؤكد' : 
                       booking.status === 'pending' ? 'قيد الانتظار' : 'ملغي'}
                    </Badge>
                  </div>
                )) : (
                  <div className="p-12 flex flex-col items-center justify-center text-muted-foreground">
                    <Trophy className="w-12 h-12 opacity-20 mb-4" />
                    <p className="font-medium">لا توجد حجوزات حالياً</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
