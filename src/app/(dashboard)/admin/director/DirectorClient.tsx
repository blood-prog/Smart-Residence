"use client";

import { useRef } from "react";
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
  ShieldCheck,
  Users,
  Wrench,
  Trophy,
  Megaphone,
  FileDown,
  TrendingUp,
  CheckCircle2,
  XCircle,
  BarChart3,
  FileText,
  Activity,
  Clock,
} from "lucide-react";
import { generatePerformanceReportPDF } from "@/lib/pdf-generator";

gsap.registerPlugin(useGSAP);

interface DirectorClientProps {
  stats: {
    totalStudents: number;
    totalIssues: number;
    resolvedIssues: number;
    successRate: number;
    totalBookings: number;
    totalAnnouncements: number;
    totalSummons: number;
  };
  issuesByCategory: { category: string; count: number }[];
  recentIssues: any[];
  recentActivity: any[];
}

export function DirectorClient({ stats, issuesByCategory, recentIssues, recentActivity }: DirectorClientProps) {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(".gsap-dir-header", { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" });
    gsap.fromTo(".gsap-dir-stat", { opacity: 0, y: 30, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.08, ease: "back.out(1.2)", delay: 0.2 });
    gsap.fromTo(".gsap-dir-content", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: "power3.out", delay: 0.5 });

    // Animate success rate ring
    gsap.fromTo(".gsap-success-ring", { strokeDashoffset: 283 }, {
      strokeDashoffset: 283 - (283 * stats.successRate) / 100,
      duration: 1.5,
      ease: "power3.out",
      delay: 0.8,
    });
  }, { scope: container });

  const handleExportPDF = async () => {
    const doc = await generatePerformanceReportPDF({
      totalIssues: stats.totalIssues,
      resolvedIssues: stats.resolvedIssues,
      successRate: stats.successRate,
      totalStudents: stats.totalStudents,
      totalBookings: stats.totalBookings,
      totalAnnouncements: stats.totalAnnouncements,
      issuesByCategory,
      recentIssues: recentIssues.map((i: any) => ({
        title: i.title,
        category: i.category,
        status: i.status,
        createdAt: i.created_at,
      })),
    });
    doc.save(`تقرير-أداء-الإقامة-${new Date().toISOString().split("T")[0]}.pdf`);
  };

  const categoryMap: Record<string, string> = {
    plumbing: "سباكة",
    electrical: "كهرباء",
    furniture: "أثاث",
    cleaning: "نظافة",
    general: "عام",
  };
  const statusMap: Record<string, { label: string; class: string }> = {
    open: { label: "مفتوح", class: "bg-red-500/15 text-red-600 border-none" },
    in_progress: { label: "قيد المعالجة", class: "bg-orange-500/15 text-orange-600 border-none" },
    resolved: { label: "تم الحل", class: "bg-green-500/15 text-green-600 border-none" },
    closed: { label: "مغلق", class: "bg-gray-500/15 text-gray-600 border-none" },
  };

  const kpiCards = [
    { label: "الطلبة المقيمين", value: stats.totalStudents, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "إجمالي الشكاوى", value: stats.totalIssues, icon: Wrench, color: "text-orange-500", bg: "bg-orange-500/10" },
    { label: "تم حلها", value: stats.resolvedIssues, icon: CheckCircle2, color: "text-green-500", bg: "bg-green-500/10" },
    { label: "الحجوزات الرياضية", value: stats.totalBookings, icon: Trophy, color: "text-purple-500", bg: "bg-purple-500/10" },
    { label: "الإعلانات", value: stats.totalAnnouncements, icon: Megaphone, color: "text-pink-500", bg: "bg-pink-500/10" },
    { label: "الاستدعاءات", value: stats.totalSummons, icon: FileText, color: "text-amber-500", bg: "bg-amber-500/10" },
  ];

  return (
    <div ref={container} className="space-y-8 pb-8">
      {/* Header */}
      <div className="gsap-dir-header flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-br from-primary/10 via-primary/5 to-background p-8 rounded-[2rem] border border-primary/10 relative overflow-hidden shadow-lg">
        <div className="absolute -left-10 -top-10 opacity-[0.03] pointer-events-none">
          <ShieldCheck className="w-64 h-64" />
        </div>
        <div className="flex items-center gap-6 relative z-10">
          <div className="p-5 rounded-[1.5rem] bg-primary text-primary-foreground shadow-xl shadow-primary/30">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight">لوحة المدير العام</h1>
            <p className="text-muted-foreground mt-2 text-lg">نظرة شاملة على أداء الإقامة الجامعية</p>
          </div>
        </div>
        <Button
          onClick={handleExportPDF}
          size="lg"
          className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl gap-2 shadow-lg shadow-primary/30"
        >
          <FileDown className="w-5 h-5" />
          تحميل تقرير الأداء
        </Button>
      </div>

      {/* KPI Grid */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        {kpiCards.map((stat) => (
          <Card key={stat.label} className="gsap-dir-stat border-0 shadow-lg rounded-[2rem] bg-card overflow-hidden">
            <CardContent className="p-5">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className={`p-3 rounded-[1.2rem] ${stat.bg} ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <p className="text-3xl font-black">{stat.value}</p>
                <p className="text-xs font-bold text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Success Rate Ring */}
        <Card className="gsap-dir-content lg:col-span-4 border-0 shadow-lg rounded-[2rem] bg-card overflow-hidden">
          <CardHeader className="p-6 border-b border-border/10 bg-secondary/10">
            <CardTitle className="text-lg font-bold flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-xl text-green-500"><TrendingUp className="w-5 h-5" /></div>
              نسبة النجاح في حل المشاكل
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 flex flex-col items-center">
            <div className="relative w-40 h-40">
              <svg className="w-40 h-40 -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-secondary" />
                <circle
                  cx="50" cy="50" r="45" fill="none" strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray="283"
                  strokeDashoffset="283"
                  className="gsap-success-ring text-green-500"
                  stroke="currentColor"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-green-500">{stats.successRate}%</span>
                <span className="text-xs text-muted-foreground font-bold mt-1">نسبة النجاح</span>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4 w-full">
              <div className="text-center p-3 bg-green-500/5 rounded-xl">
                <p className="text-lg font-black text-green-600">{stats.resolvedIssues}</p>
                <p className="text-xs text-muted-foreground">تم حلها</p>
              </div>
              <div className="text-center p-3 bg-red-500/5 rounded-xl">
                <p className="text-lg font-black text-red-600">{stats.totalIssues - stats.resolvedIssues}</p>
                <p className="text-xs text-muted-foreground">غير محلولة</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Issues by Category + Activity Feed */}
        <div className="lg:col-span-8 space-y-8">
          {/* Category Breakdown */}
          <Card className="gsap-dir-content border-0 shadow-lg rounded-[2rem] bg-card overflow-hidden">
            <CardHeader className="p-6 border-b border-border/10 bg-secondary/10">
              <CardTitle className="text-lg font-bold flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-xl text-blue-500"><BarChart3 className="w-5 h-5" /></div>
                الشكاوى حسب الفئة
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {issuesByCategory.length > 0 ? issuesByCategory.map((cat) => {
                  const max = Math.max(...issuesByCategory.map((c) => c.count));
                  const percentage = max > 0 ? (cat.count / max) * 100 : 0;
                  const colors: Record<string, string> = {
                    plumbing: "bg-blue-500",
                    electrical: "bg-yellow-500",
                    furniture: "bg-purple-500",
                    cleaning: "bg-green-500",
                    general: "bg-slate-500",
                  };
                  return (
                    <div key={cat.category} className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold">{categoryMap[cat.category] || cat.category}</span>
                        <span className="text-sm font-mono font-bold text-muted-foreground">{cat.count}</span>
                      </div>
                      <div className="h-3 bg-secondary rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${colors[cat.category] || "bg-primary"}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                }) : (
                  <p className="text-center text-muted-foreground py-8">لا توجد بيانات</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Activity Feed */}
          <Card className="gsap-dir-content border-0 shadow-lg rounded-[2rem] bg-card overflow-hidden">
            <CardHeader className="p-6 border-b border-border/10 bg-secondary/10">
              <CardTitle className="text-lg font-bold flex items-center gap-3">
                <div className="p-2 bg-purple-500/10 rounded-xl text-purple-500"><Activity className="w-5 h-5" /></div>
                آخر النشاطات
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 divide-y divide-border/5">
              {recentActivity.length > 0 ? recentActivity.map((activity: any) => (
                <div key={activity.id} className="p-4 flex items-center justify-between hover:bg-secondary/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-secondary rounded-lg">
                      <Wrench className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-bold">{activity.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-muted-foreground">{categoryMap[activity.category] || activity.category}</span>
                        <span className="text-xs text-muted-foreground opacity-50">•</span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(activity.created_at).toLocaleDateString("ar-DZ")}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Badge className={`rounded-lg px-2 py-0.5 text-xs font-bold ${statusMap[activity.status]?.class || ""}`}>
                    {statusMap[activity.status]?.label || activity.status}
                  </Badge>
                </div>
              )) : (
                <div className="p-12 text-center text-muted-foreground">
                  <Activity className="w-12 h-12 mx-auto opacity-20 mb-4" />
                  <p className="font-medium">لا توجد نشاطات حديثة</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
