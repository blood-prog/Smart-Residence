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
import { Input } from "@/components/ui/input";
import {
  Home,
  Users,
  FileDown,
  Search,
  Send,
  FileText,
  Building2,
  AlertCircle,
  BedDouble,
} from "lucide-react";
import { generateSummonsPDF, generateOccupancyReportPDF } from "@/lib/pdf-generator";
import { createSummons } from "./actions";

gsap.registerPlugin(useGSAP);

interface HousingAdminClientProps {
  students: any[];
  requests: any[];
  summons: any[];
  currentUserId: string;
  stats: {
    totalStudents: number;
    occupiedRooms: number;
    pendingRequests: number;
    totalSummons: number;
  };
}

export function HousingAdminClient({ students, requests, summons, currentUserId, stats }: HousingAdminClientProps) {
  const container = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<"students" | "summons">("students");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSummonsForm, setShowSummonsForm] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  useGSAP(() => {
    gsap.fromTo(".gsap-housing-header", { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" });
    gsap.fromTo(".gsap-housing-stat", { opacity: 0, y: 30, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.1, ease: "back.out(1.2)", delay: 0.2 });
    gsap.fromTo(".gsap-housing-content", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", delay: 0.4 });
  }, { scope: container });

  const filteredStudents = students.filter((s: any) =>
    !searchQuery ||
    s.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.student_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.room_number?.includes(searchQuery) ||
    s.building?.includes(searchQuery)
  );

  const handleOccupancyPDF = async () => {
    const doc = await generateOccupancyReportPDF({
      totalRooms: stats.occupiedRooms + 50, // Estimate total capacity
      occupiedRooms: stats.occupiedRooms,
      emptyRooms: 50, // Estimate empty
      students: students.map((s: any) => ({
        name: s.full_name || "—",
        studentId: s.student_id || "—",
        building: s.building || "—",
        roomNumber: s.room_number || "—",
      })),
    });
    doc.save(`تقرير-الإيواء-${new Date().toISOString().split("T")[0]}.pdf`);
  };

  const handleSummonsPDF = async (student: any, reason: string = "استدعاء إداري") => {
    const doc = await generateSummonsPDF({
      studentName: student.full_name || "—",
      studentId: student.student_id || "—",
      roomNumber: student.room_number || "—",
      building: student.building || "—",
      reason,
      details: "",
      summonsDate: new Date().toLocaleDateString("ar-DZ", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    });
    doc.save(`استدعاء-${student.full_name || "طالب"}.pdf`);
  };

  const handleCreateSummons = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      await createSummons(formData);
      setShowSummonsForm(false);
      setSelectedStudent(null);
    } catch {
      alert("حدث خطأ أثناء إنشاء الاستدعاء");
    }
  };

  const statCards = [
    { label: "الطلبة المقيمين", value: stats.totalStudents, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "الغرف المشغولة", value: stats.occupiedRooms, icon: BedDouble, color: "text-green-500", bg: "bg-green-500/10" },
    { label: "طلبات معلقة", value: stats.pendingRequests, icon: AlertCircle, color: "text-orange-500", bg: "bg-orange-500/10" },
    { label: "الاستدعاءات", value: stats.totalSummons, icon: FileText, color: "text-purple-500", bg: "bg-purple-500/10" },
  ];

  const tabs = [
    { key: "students" as const, label: "قائمة الطلبة والغرف", icon: Users },
    { key: "summons" as const, label: "الاستدعاءات الإدارية", icon: FileText },
  ];

  return (
    <div ref={container} className="space-y-8 pb-8">
      {/* Header */}
      <div className="gsap-housing-header flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-br from-green-500/10 via-green-500/5 to-background p-8 rounded-[2rem] border border-green-500/10 relative overflow-hidden shadow-lg">
        <div className="absolute -left-10 -top-10 opacity-[0.03] pointer-events-none">
          <Building2 className="w-64 h-64" />
        </div>
        <div className="flex items-center gap-6 relative z-10">
          <div className="p-5 rounded-[1.5rem] bg-green-500 text-white shadow-xl shadow-green-500/30">
            <Home className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight">إدارة مصلحة الإيواء</h1>
            <p className="text-muted-foreground mt-2 text-lg">إدارة الغرف والطلبة والاستدعاءات الإدارية</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={handleOccupancyPDF}
            size="lg"
            className="bg-green-600 hover:bg-green-700 text-white rounded-xl gap-2 shadow-lg shadow-green-600/30"
          >
            <FileDown className="w-5 h-5" />
            تقرير الإيواء
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.label} className="gsap-housing-stat border-0 shadow-lg rounded-[2rem] bg-card overflow-hidden">
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

      {/* Tabs */}
      <div className="gsap-housing-content flex gap-2 bg-secondary/30 p-1.5 rounded-2xl w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
              activeTab === tab.key
                ? "bg-background text-foreground shadow-lg"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "students" && (
        <Card className="gsap-housing-content border-0 shadow-lg rounded-[2rem] bg-card overflow-hidden">
          <CardHeader className="p-6 border-b border-border/10 bg-secondary/10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <CardTitle className="text-xl font-bold flex items-center gap-3">
                <div className="p-2 bg-green-500/10 rounded-xl text-green-500"><Search className="w-5 h-5" /></div>
                خريطة الغرف والطلبة
              </CardTitle>
              <div className="relative max-w-sm w-full">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="بحث بالاسم، الرقم، الغرفة أو المبنى..."
                  className="pr-10"
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
                    <th className="p-4 text-right font-bold text-muted-foreground">الرقم التعريفي</th>
                    <th className="p-4 text-right font-bold text-muted-foreground">المبنى</th>
                    <th className="p-4 text-right font-bold text-muted-foreground">رقم الغرفة</th>
                    <th className="p-4 text-right font-bold text-muted-foreground">الهاتف</th>
                    <th className="p-4 text-center font-bold text-muted-foreground">إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student: any) => (
                    <tr key={student.id} className="border-b border-border/5 hover:bg-secondary/30 transition-colors">
                      <td className="p-4 font-medium">{student.full_name || "—"}</td>
                      <td className="p-4 font-mono text-xs">{student.student_id || "—"}</td>
                      <td className="p-4">{student.building || "—"}</td>
                      <td className="p-4">
                        <Badge className={`rounded-lg px-2 py-0.5 text-xs font-bold ${
                          student.room_number ? "bg-green-500/15 text-green-600 border-none" : "bg-red-500/15 text-red-600 border-none"
                        }`}>
                          {student.room_number || "بدون غرفة"}
                        </Badge>
                      </td>
                      <td className="p-4 font-mono text-xs" dir="ltr">{student.phone || "—"}</td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-purple-500 hover:bg-purple-500/10 rounded-lg gap-1 text-xs"
                            onClick={() => {
                              setSelectedStudent(student);
                              setShowSummonsForm(true);
                            }}
                          >
                            <Send className="w-3.5 h-3.5" />
                            استدعاء
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-blue-500 hover:bg-blue-500/10 rounded-lg gap-1 text-xs"
                            onClick={() => handleSummonsPDF(student)}
                          >
                            <FileDown className="w-3.5 h-3.5" />
                            PDF
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "summons" && (
        <Card className="gsap-housing-content border-0 shadow-lg rounded-[2rem] bg-card overflow-hidden">
          <CardHeader className="p-6 border-b border-border/10 bg-secondary/10">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold flex items-center gap-3">
                <div className="p-2 bg-purple-500/10 rounded-xl text-purple-500"><FileText className="w-5 h-5" /></div>
                سجل الاستدعاءات الإدارية
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm" dir="rtl">
                <thead>
                  <tr className="border-b border-border/10 bg-muted/30">
                    <th className="p-4 text-right font-bold text-muted-foreground">اسم الطالب</th>
                    <th className="p-4 text-right font-bold text-muted-foreground">السبب</th>
                    <th className="p-4 text-center font-bold text-muted-foreground">الحالة</th>
                    <th className="p-4 text-right font-bold text-muted-foreground">التاريخ</th>
                  </tr>
                </thead>
                <tbody>
                  {summons.length > 0 ? summons.map((s: any) => (
                    <tr key={s.id} className="border-b border-border/5 hover:bg-secondary/30 transition-colors">
                      <td className="p-4 font-medium">{s.profiles?.full_name || "—"}</td>
                      <td className="p-4 max-w-[200px] truncate">{s.reason}</td>
                      <td className="p-4 text-center">
                        <Badge className={`rounded-xl px-3 py-1 font-bold ${
                          s.status === "pending" ? "bg-orange-500/15 text-orange-600 border-none" :
                          s.status === "acknowledged" ? "bg-blue-500/15 text-blue-600 border-none" :
                          s.status === "resolved" ? "bg-green-500/15 text-green-600 border-none" :
                          "bg-gray-500/15 text-gray-600 border-none"
                        }`}>
                          {s.status === "pending" ? "معلق" :
                           s.status === "acknowledged" ? "تم الاطلاع" :
                           s.status === "resolved" ? "تمت المعالجة" : "ملغي"}
                        </Badge>
                      </td>
                      <td className="p-4 font-mono text-xs">{new Date(s.created_at).toLocaleDateString("ar-DZ")}</td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={4} className="p-16 text-center text-muted-foreground">
                        <FileText className="w-12 h-12 mx-auto opacity-20 mb-4" />
                        <p className="font-medium">لا توجد استدعاءات مسجلة</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summons Modal */}
      {showSummonsForm && selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-md">
          <Card className="w-full max-w-lg rounded-[2rem] border border-border/50 shadow-2xl">
            <CardHeader className="p-6">
              <CardTitle className="text-xl font-bold">إصدار استدعاء إداري</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                للطالب: <span className="font-bold text-foreground">{selectedStudent.full_name}</span>
                {" "}— غرفة {selectedStudent.room_number || "—"}
              </p>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <form onSubmit={handleCreateSummons} className="space-y-4">
                <input type="hidden" name="student_id" value={selectedStudent.id} />
                <div>
                  <label className="block text-sm font-bold mb-2">سبب الاستدعاء</label>
                  <Input name="reason" required placeholder="مثال: مخالفة النظام الداخلي..." />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">تفاصيل إضافية</label>
                  <textarea
                    name="details"
                    rows={3}
                    placeholder="تفاصيل إضافية اختيارية..."
                    className="w-full rounded-xl border border-input/50 bg-background/50 backdrop-blur-sm px-4 py-3 text-sm focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all outline-none resize-none"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <Button type="submit" className="flex-1 bg-purple-600 hover:bg-purple-700 text-white gap-2">
                    <Send className="w-4 h-4" />
                    إرسال الاستدعاء
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowSummonsForm(false);
                      setSelectedStudent(null);
                    }}
                  >
                    إلغاء
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
