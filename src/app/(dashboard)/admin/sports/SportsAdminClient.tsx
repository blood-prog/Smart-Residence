"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Trophy,
  Calendar,
  Users,
  CheckCircle2,
  Clock,
  FileDown,
  Filter,
} from "lucide-react";
import { generatePitchRosterPDF } from "@/lib/pdf-generator";

gsap.registerPlugin(useGSAP);

interface SportsAdminClientProps {
  facilities: any[];
  bookings: any[];
  stats: {
    total: number;
    pending: number;
    approved: number;
    facilities: number;
  };
}

export function SportsAdminClient({ facilities, bookings, stats }: SportsAdminClientProps) {
  const container = useRef<HTMLDivElement>(null);
  const [selectedFacility, setSelectedFacility] = useState<string>("all");
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  useGSAP(() => {
    gsap.fromTo(
      ".gsap-sports-header",
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
    );
    gsap.fromTo(
      ".gsap-sports-stat",
      { opacity: 0, y: 30, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.1, ease: "back.out(1.2)", delay: 0.2 }
    );
    gsap.fromTo(
      ".gsap-sports-content",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: "power3.out", delay: 0.4 }
    );
  }, { scope: container });

  const filteredBookings = bookings.filter((b: any) => {
    const matchFacility = selectedFacility === "all" || b.facility_id === selectedFacility;
    const matchDate = !selectedDate || b.booking_date === selectedDate;
    return matchFacility && matchDate;
  });

  const handleExportPDF = async () => {
    if (!selectedFacility || selectedFacility === "all") {
      alert("يرجى اختيار ملعب محدد لتوليد كشف اللاعبين");
      return;
    }

    const facilityBookings = bookings.filter(
      (b: any) => b.facility_id === selectedFacility && b.booking_date === selectedDate && b.status === "approved"
    );

    const facilityName = facilities.find((f: any) => f.id === selectedFacility)?.name || "غير محدد";

    const doc = await generatePitchRosterPDF({
      date: selectedDate,
      facilityName,
      timeSlot: facilityBookings.map((b: any) => b.time_slot).join("، ") || "جميع الأوقات",
      players: facilityBookings.map((b: any) => ({
        name: b.profiles?.full_name || "غير معروف",
        roomNumber: b.profiles?.room_number || "—",
        studentId: b.profiles?.student_id || "—",
      })),
    });

    doc.save(`كشف-اللاعبين-${selectedDate}.pdf`);
  };

  const statCards = [
    { label: "إجمالي الحجوزات", value: stats.total, icon: Calendar, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "قيد الانتظار", value: stats.pending, icon: Clock, color: "text-orange-500", bg: "bg-orange-500/10" },
    { label: "مؤكدة", value: stats.approved, icon: CheckCircle2, color: "text-green-500", bg: "bg-green-500/10" },
    { label: "المرافق النشطة", value: stats.facilities, icon: Trophy, color: "text-purple-500", bg: "bg-purple-500/10" },
  ];

  const statusMap: Record<string, { label: string; class: string }> = {
    pending: { label: "قيد الانتظار", class: "bg-orange-500/15 text-orange-600 border-none" },
    approved: { label: "مؤكد", class: "bg-green-500/15 text-green-600 border-none" },
    rejected: { label: "مرفوض", class: "bg-red-500/15 text-red-600 border-none" },
    cancelled: { label: "ملغي", class: "bg-gray-500/15 text-gray-600 border-none" },
  };

  return (
    <div ref={container} className="space-y-8 pb-8">
      {/* Header */}
      <div className="gsap-sports-header flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-background p-8 rounded-[2rem] border border-blue-500/10 relative overflow-hidden shadow-lg">
        <div className="absolute -left-10 -top-10 opacity-[0.03] pointer-events-none">
          <Trophy className="w-64 h-64" />
        </div>
        <div className="flex items-center gap-6 relative z-10">
          <div className="p-5 rounded-[1.5rem] bg-blue-500 text-white shadow-xl shadow-blue-500/30">
            <Trophy className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight">إدارة النشاطات الرياضية</h1>
            <p className="text-muted-foreground mt-2 text-lg">إدارة الحجوزات والملاعب وقوائم اللاعبين</p>
          </div>
        </div>
        <Button
          onClick={handleExportPDF}
          size="lg"
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl gap-2 shadow-lg shadow-blue-600/30"
        >
          <FileDown className="w-5 h-5" />
          تحميل كشف اللاعبين
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.label} className="gsap-sports-stat border-0 shadow-lg rounded-[2rem] bg-card overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-bold text-muted-foreground">{stat.label}</p>
                  <p className="text-3xl font-black">{stat.value}</p>
                </div>
                <div className={`p-4 rounded-[1.5rem] ${stat.bg} ${stat.color}`}>
                  <stat.icon className="w-7 h-7" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters + Table */}
      <Card className="gsap-sports-content border-0 shadow-lg rounded-[2rem] bg-card overflow-hidden">
        <CardHeader className="p-6 border-b border-border/10 bg-secondary/10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-xl text-blue-500">
                <Filter className="w-5 h-5" />
              </div>
              <CardTitle className="text-xl font-bold">جدول الحجوزات</CardTitle>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <select
                value={selectedFacility}
                onChange={(e) => setSelectedFacility(e.target.value)}
                className="h-12 px-4 rounded-xl border border-input/50 bg-background/50 backdrop-blur-sm text-sm focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all outline-none"
              >
                <option value="all">جميع الملاعب</option>
                {facilities.map((f: any) => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="h-12 px-4 rounded-xl border border-input/50 bg-background/50 backdrop-blur-sm text-sm focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all outline-none"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm" dir="rtl">
              <thead>
                <tr className="border-b border-border/10 bg-muted/30">
                  <th className="p-4 text-right font-bold text-muted-foreground">اسم الطالب</th>
                  <th className="p-4 text-right font-bold text-muted-foreground">الملعب</th>
                  <th className="p-4 text-right font-bold text-muted-foreground">التاريخ</th>
                  <th className="p-4 text-right font-bold text-muted-foreground">التوقيت</th>
                  <th className="p-4 text-right font-bold text-muted-foreground">رقم الغرفة</th>
                  <th className="p-4 text-center font-bold text-muted-foreground">الحالة</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.length > 0 ? filteredBookings.map((booking: any) => (
                  <tr key={booking.id} className="border-b border-border/5 hover:bg-secondary/30 transition-colors">
                    <td className="p-4 font-medium">{booking.profiles?.full_name || "—"}</td>
                    <td className="p-4">{booking.sports_facilities?.name || "—"}</td>
                    <td className="p-4 font-mono text-xs">{booking.booking_date}</td>
                    <td className="p-4 font-mono text-xs">{booking.time_slot}</td>
                    <td className="p-4">{booking.profiles?.room_number || "—"}</td>
                    <td className="p-4 text-center">
                      <Badge className={`rounded-xl px-3 py-1 font-bold ${statusMap[booking.status]?.class || ""}`}>
                        {statusMap[booking.status]?.label || booking.status}
                      </Badge>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} className="p-16 text-center text-muted-foreground">
                      <Users className="w-12 h-12 mx-auto opacity-20 mb-4" />
                      <p className="font-medium">لا توجد حجوزات لهذا التاريخ</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
