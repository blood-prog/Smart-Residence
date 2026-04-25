"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  Move, 
  Clock, 
  AlertCircle,
  FileText
} from "lucide-react";
import { HousingForm } from "./housing-form";

gsap.registerPlugin(useGSAP);

interface HousingClientProps {
  profile: any;
  requests: any[];
}

export function HousingClient({ profile, requests }: HousingClientProps) {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Header animation
    gsap.fromTo(
      ".gsap-header",
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
    );

    // Left column cards staggered entry
    gsap.fromTo(
      ".gsap-left-col > div",
      { opacity: 0, x: 20 },
      { opacity: 1, x: 0, duration: 0.6, stagger: 0.15, ease: "power3.out", delay: 0.2 }
    );

    // Request history cards staggered entry
    gsap.fromTo(
      ".gsap-request-card",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out", delay: 0.4 }
    );
  }, { scope: container });

  return (
    <div ref={container} className="space-y-10 pb-10">
      {/* Page Header */}
      <div className="gsap-header flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-br from-blue-600/10 via-blue-600/5 to-background p-8 rounded-[2rem] border border-blue-600/10 relative overflow-hidden">
        <div className="absolute -left-10 -top-10 opacity-[0.03] pointer-events-none">
          <Home className="w-64 h-64" />
        </div>
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-3 text-blue-600">
            <div className="p-3 bg-blue-600/10 rounded-2xl">
              <Home className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">مصلحة الإيواء</h1>
          </div>
          <p className="text-muted-foreground max-w-xl text-lg mt-2">
            إدارة إقامتك، طلب تغيير الغرف، أو تجديد تسجيلك السنوي بكل سهولة.
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column: Stats & Actions */}
        <div className="gsap-left-col lg:col-span-1 space-y-6">
          {/* Current Status Card */}
          <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white overflow-hidden relative rounded-[2rem]">
            <div className="absolute top-0 right-0 p-4 opacity-10 mix-blend-overlay">
              <Home className="w-48 h-48 -mr-10 -mt-10" />
            </div>
            <CardHeader>
              <CardTitle className="text-xl">حالة الإقامة الحالية</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 relative z-10">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-blue-100/80 text-sm font-medium mb-1">المبنى / الغرفة</p>
                  <p className="text-4xl font-black">{profile?.building || '--'} / {profile?.room_number || '--'}</p>
                </div>
                <Badge className="bg-white/20 text-white backdrop-blur-md border-0 px-3 py-1 text-sm font-bold shadow-sm">نشط</Badge>
              </div>
              <div className="pt-6 border-t border-white/20 flex gap-4">
                <div className="flex-1">
                  <p className="text-blue-100/70 text-xs font-bold uppercase tracking-wider mb-1">النوع</p>
                  <p className="font-bold text-lg">{profile?.room_type || 'فردية'}</p>
                </div>
                <div className="flex-1 pl-4 border-r border-white/20">
                  <p className="text-blue-100/70 text-xs font-bold uppercase tracking-wider mb-1">تاريخ الدخول</p>
                  <p className="font-bold text-lg">01 أكتوبر 2025</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions Card */}
          <Card className="border-0 shadow-lg bg-card rounded-[2rem] overflow-hidden">
            <CardHeader className="bg-secondary/10 border-b border-border/5">
              <CardTitle className="text-xl">تقديم طلب جديد</CardTitle>
              <CardDescription>اختر نوع الطلب الذي تود تقديمه.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <HousingForm profile={profile} />
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Request History */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between bg-card p-6 rounded-[2rem] shadow-sm border-0">
            <h2 className="text-xl font-bold flex items-center gap-3">
              <div className="p-2 bg-blue-600/10 rounded-xl text-blue-600">
                <FileText className="w-5 h-5" />
              </div>
              تاريخ الطلبات
            </h2>
          </div>

          <div className="space-y-4">
            {requests && requests.length > 0 ? requests.map((request) => (
              <Card key={request.id} className="gsap-request-card group border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-card rounded-[1.5rem] overflow-hidden cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
                <CardContent className="p-6 relative">
                  <div className="absolute right-0 top-0 bottom-0 w-1.5 transition-colors duration-300 group-hover:bg-blue-600/20" />
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex gap-4 items-start sm:items-center">
                      <div className={`p-4 rounded-[1.25rem] transition-transform duration-300 group-hover:scale-110 shadow-inner ${
                        request.request_type === 'room_change' ? 'bg-orange-500/10 text-orange-600' :
                        request.request_type === 'extension' ? 'bg-green-500/10 text-green-600' :
                        'bg-blue-500/10 text-blue-600'
                      }`}>
                        {request.request_type === 'room_change' ? <Move className="w-6 h-6" /> : <FileText className="w-6 h-6" />}
                      </div>
                      <div className="space-y-1.5">
                        <h3 className="font-bold text-lg group-hover:text-blue-600 transition-colors">
                          {request.request_type === 'room_change' ? 'طلب تغيير غرفة' :
                           request.request_type === 'extension' ? 'طلب تمديد إقامة' :
                           request.request_type === 'complaint' ? 'شكوى إيواء' : 'طلب إيواء'}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-1 max-w-lg">{request.description}</p>
                        <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground pt-1">
                          <span className="flex items-center gap-1.5 bg-secondary/50 px-2 py-1 rounded-md"><Clock className="w-3.5 h-3.5" /> {new Date(request.created_at).toLocaleDateString('ar-DZ')}</span>
                          {request.requested_room && <span className="flex items-center gap-1.5 bg-secondary/50 px-2 py-1 rounded-md"><Move className="w-3.5 h-3.5" /> إلى غرفة {request.requested_room}</span>}
                        </div>
                      </div>
                    </div>
                    <Badge className={`
                      rounded-xl px-3 py-1.5 font-bold shadow-sm self-start sm:self-auto text-sm
                      ${request.status === 'approved' ? 'bg-green-500/15 text-green-600 border-none' :
                        request.status === 'pending' ? 'bg-blue-500/15 text-blue-600 border-none' :
                        'bg-destructive/15 text-destructive border-none'}
                    `}>
                      {request.status === 'approved' ? 'مقبول' : 
                       request.status === 'pending' ? 'قيد الدراسة' : 'مرفوض'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )) : (
              <div className="text-center py-20 border-2 border-dashed border-border/50 rounded-[2rem] bg-secondary/5 flex flex-col items-center justify-center">
                <div className="p-4 bg-secondary/20 rounded-full mb-4">
                  <AlertCircle className="w-10 h-10 text-muted-foreground" />
                </div>
                <p className="text-lg font-medium text-muted-foreground">لا توجد طلبات سابقة</p>
                <p className="text-sm text-muted-foreground mt-1">يمكنك تقديم طلب جديد من النموذج الجانبي</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
