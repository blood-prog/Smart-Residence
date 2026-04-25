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
  Wrench,
  AlertTriangle,
  Clock,
  CheckCircle2,
  FileDown,
  Filter,
  Inbox,
} from "lucide-react";
import { generateMaintenanceSummaryPDF } from "@/lib/pdf-generator";

gsap.registerPlugin(useGSAP);

interface MaintenanceAdminClientProps {
  tickets: any[];
  stats: {
    total: number;
    open: number;
    inProgress: number;
    resolved: number;
  };
}

export function MaintenanceAdminClient({ tickets, stats }: MaintenanceAdminClientProps) {
  const container = useRef<HTMLDivElement>(null);
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useGSAP(() => {
    gsap.fromTo(".gsap-maint-header", { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" });
    gsap.fromTo(".gsap-maint-stat", { opacity: 0, y: 30, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.1, ease: "back.out(1.2)", delay: 0.2 });
    gsap.fromTo(".gsap-maint-content", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: "power3.out", delay: 0.4 });
  }, { scope: container });

  const filteredTickets = tickets.filter((t: any) => {
    const matchStatus = statusFilter === "all" || t.status === statusFilter;
    const matchDateFrom = !dateFrom || new Date(t.created_at) >= new Date(dateFrom);
    const matchDateTo = !dateTo || new Date(t.created_at) <= new Date(dateTo + "T23:59:59");
    return matchStatus && matchDateFrom && matchDateTo;
  });

  const handleExportPDF = async () => {
    const doc = await generateMaintenanceSummaryPDF({
      dateFrom: dateFrom || "بداية السجل",
      dateTo: dateTo || new Date().toLocaleDateString("ar-DZ"),
      tickets: filteredTickets.map((t: any) => ({
        title: t.title,
        description: t.description,
        category: t.category,
        priority: t.priority,
        status: t.status,
        createdAt: t.created_at,
        resolvedAt: t.resolved_at,
      })),
      stats: {
        total: filteredTickets.length,
        resolved: filteredTickets.filter((t: any) => t.status === "resolved" || t.status === "closed").length,
        pending: filteredTickets.filter((t: any) => t.status === "open" || t.status === "in_progress").length,
        critical: filteredTickets.filter((t: any) => t.priority === "critical").length,
      },
    });
    doc.save(`تقرير-الصيانة-${new Date().toISOString().split("T")[0]}.pdf`);
  };

  const statCards = [
    { label: "إجمالي الطلبات", value: stats.total, icon: Inbox, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "مفتوحة", value: stats.open, icon: AlertTriangle, color: "text-red-500", bg: "bg-red-500/10" },
    { label: "قيد المعالجة", value: stats.inProgress, icon: Clock, color: "text-orange-500", bg: "bg-orange-500/10" },
    { label: "تم الحل", value: stats.resolved, icon: CheckCircle2, color: "text-green-500", bg: "bg-green-500/10" },
  ];

  const statusMap: Record<string, { label: string; class: string }> = {
    open: { label: "مفتوح", class: "bg-red-500/15 text-red-600 border-none" },
    in_progress: { label: "قيد المعالجة", class: "bg-orange-500/15 text-orange-600 border-none" },
    resolved: { label: "تم الحل", class: "bg-green-500/15 text-green-600 border-none" },
    closed: { label: "مغلق", class: "bg-gray-500/15 text-gray-600 border-none" },
  };

  const priorityMap: Record<string, { label: string; class: string }> = {
    low: { label: "منخفض", class: "bg-slate-500/15 text-slate-600 border-none" },
    medium: { label: "متوسط", class: "bg-blue-500/15 text-blue-600 border-none" },
    high: { label: "مرتفع", class: "bg-orange-500/15 text-orange-600 border-none" },
    critical: { label: "حرج", class: "bg-red-500/15 text-red-600 border-none" },
  };

  const categoryMap: Record<string, string> = {
    plumbing: "سباكة",
    electrical: "كهرباء",
    furniture: "أثاث",
    cleaning: "نظافة",
    general: "عام",
  };

  return (
    <div ref={container} className="space-y-8 pb-8">
      {/* Header */}
      <div className="gsap-maint-header flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-br from-orange-500/10 via-orange-500/5 to-background p-8 rounded-[2rem] border border-orange-500/10 relative overflow-hidden shadow-lg">
        <div className="absolute -left-10 -top-10 opacity-[0.03] pointer-events-none">
          <Wrench className="w-64 h-64" />
        </div>
        <div className="flex items-center gap-6 relative z-10">
          <div className="p-5 rounded-[1.5rem] bg-orange-500 text-white shadow-xl shadow-orange-500/30">
            <Wrench className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight">إدارة مصلحة الصيانة</h1>
            <p className="text-muted-foreground mt-2 text-lg">متابعة طلبات الإصلاح وتوزيع المهام</p>
          </div>
        </div>
        <Button
          onClick={handleExportPDF}
          size="lg"
          className="bg-orange-600 hover:bg-orange-700 text-white rounded-xl gap-2 shadow-lg shadow-orange-600/30"
        >
          <FileDown className="w-5 h-5" />
          تحميل تقرير الصيانة
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.label} className="gsap-maint-stat border-0 shadow-lg rounded-[2rem] bg-card overflow-hidden">
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

      {/* Tickets Table */}
      <Card className="gsap-maint-content border-0 shadow-lg rounded-[2rem] bg-card overflow-hidden">
        <CardHeader className="p-6 border-b border-border/10 bg-secondary/10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/10 rounded-xl text-orange-500">
                <Filter className="w-5 h-5" />
              </div>
              <CardTitle className="text-xl font-bold">سجل طلبات الصيانة</CardTitle>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-12 px-4 rounded-xl border border-input/50 bg-background/50 backdrop-blur-sm text-sm focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all outline-none"
              >
                <option value="all">جميع الحالات</option>
                <option value="open">مفتوح</option>
                <option value="in_progress">قيد المعالجة</option>
                <option value="resolved">تم الحل</option>
                <option value="closed">مغلق</option>
              </select>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                placeholder="من"
                className="h-12 px-4 rounded-xl border border-input/50 bg-background/50 backdrop-blur-sm text-sm focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all outline-none"
              />
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                placeholder="إلى"
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
                  <th className="p-4 text-right font-bold text-muted-foreground">العنوان</th>
                  <th className="p-4 text-right font-bold text-muted-foreground">الطالب</th>
                  <th className="p-4 text-right font-bold text-muted-foreground">الموقع</th>
                  <th className="p-4 text-center font-bold text-muted-foreground">الفئة</th>
                  <th className="p-4 text-center font-bold text-muted-foreground">الأولوية</th>
                  <th className="p-4 text-center font-bold text-muted-foreground">الحالة</th>
                  <th className="p-4 text-right font-bold text-muted-foreground">التاريخ</th>
                </tr>
              </thead>
              <tbody>
                {filteredTickets.length > 0 ? filteredTickets.map((ticket: any) => (
                  <tr key={ticket.id} className="border-b border-border/5 hover:bg-secondary/30 transition-colors">
                    <td className="p-4 font-medium max-w-[200px] truncate">{ticket.title}</td>
                    <td className="p-4">{ticket.profiles?.full_name || "—"}</td>
                    <td className="p-4 text-xs">
                      {ticket.building ? `مبنى ${ticket.building}` : ""} {ticket.room_number ? `غرفة ${ticket.room_number}` : "—"}
                    </td>
                    <td className="p-4 text-center text-xs">{categoryMap[ticket.category] || ticket.category}</td>
                    <td className="p-4 text-center">
                      <Badge className={`rounded-lg px-2 py-0.5 text-xs font-bold ${priorityMap[ticket.priority]?.class || ""}`}>
                        {priorityMap[ticket.priority]?.label || ticket.priority}
                      </Badge>
                    </td>
                    <td className="p-4 text-center">
                      <Badge className={`rounded-xl px-3 py-1 font-bold ${statusMap[ticket.status]?.class || ""}`}>
                        {statusMap[ticket.status]?.label || ticket.status}
                      </Badge>
                    </td>
                    <td className="p-4 font-mono text-xs">{new Date(ticket.created_at).toLocaleDateString("ar-DZ")}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={7} className="p-16 text-center text-muted-foreground">
                      <Wrench className="w-12 h-12 mx-auto opacity-20 mb-4" />
                      <p className="font-medium">لا توجد طلبات صيانة مطابقة</p>
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
