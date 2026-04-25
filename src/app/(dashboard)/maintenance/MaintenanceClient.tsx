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
  Wrench, 
  AlertCircle, 
  Clock, 
  CheckCircle2,
  PlusCircle,
  Building
} from "lucide-react";
import { TicketForm } from "./ticket-form";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

gsap.registerPlugin(useGSAP);

interface MaintenanceClientProps {
  tickets: any[];
  openTicketsCount: number;
}

export function MaintenanceClient({ tickets, openTicketsCount }: MaintenanceClientProps) {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Header animation
    gsap.fromTo(
      ".gsap-header",
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
    );

    // Left column form entry
    gsap.fromTo(
      ".gsap-left-col",
      { opacity: 0, x: 20 },
      { opacity: 1, x: 0, duration: 0.6, ease: "power3.out", delay: 0.2 }
    );

    // Right column tabs entry
    gsap.fromTo(
      ".gsap-tabs-nav",
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.4, ease: "power2.out", delay: 0.3 }
    );

    // Tickets staggered entry
    gsap.fromTo(
      ".gsap-ticket-card",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out", delay: 0.4 }
    );
  }, { scope: container });

  const openTickets = tickets.filter(t => t.status !== 'closed' && t.status !== 'resolved');
  const closedTickets = tickets.filter(t => t.status === 'closed' || t.status === 'resolved');

  return (
    <div ref={container} className="space-y-10 pb-10">
      {/* Page Header */}
      <div className="gsap-header flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-br from-orange-500/10 via-orange-500/5 to-background p-8 rounded-[2rem] border border-orange-500/10 relative overflow-hidden">
        <div className="absolute -left-10 -top-10 opacity-[0.03] pointer-events-none">
          <Wrench className="w-64 h-64" />
        </div>
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-3 text-orange-600">
            <div className="p-3 bg-orange-500/10 rounded-2xl">
              <Wrench className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">مصلحة الصيانة</h1>
          </div>
          <p className="text-muted-foreground max-w-xl text-lg mt-2">
            هل تواجه مشكلة في غرفتك أو مرافق الإقامة؟ أرسل بلاغاً وسيقوم فريق مصلحة الصيانة بمعالجته في أقرب وقت.
          </p>
        </div>
        <div className="flex gap-4 relative z-10">
          <div className="bg-card/80 backdrop-blur-md px-8 py-4 rounded-[1.5rem] border-0 shadow-lg text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-orange-500/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            <p className="text-sm font-bold text-muted-foreground relative z-10">بلاغات مفتوحة</p>
            <p className="text-4xl font-black text-orange-500 mt-1 relative z-10">{openTicketsCount}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column: Form */}
        <div className="gsap-left-col lg:col-span-1">
          <Card className="border-0 shadow-xl bg-card rounded-[2rem] sticky top-24 overflow-hidden">
            <CardHeader className="bg-secondary/10 border-b border-border/5">
              <CardTitle className="flex items-center gap-2 text-xl">
                <PlusCircle className="w-5 h-5 text-orange-500" />
                بلاغ جديد
              </CardTitle>
              <CardDescription>أدخل تفاصيل العطل أو المشكلة بدقة.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <TicketForm />
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Tickets List */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="all" className="w-full" dir="rtl">
            <div className="gsap-tabs-nav flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 bg-card p-4 rounded-[1.5rem] shadow-sm">
              <h2 className="text-xl font-bold flex items-center gap-3">
                <div className="p-2 bg-orange-500/10 rounded-xl text-orange-500">
                  <AlertCircle className="w-5 h-5" />
                </div>
                سجل البلاغات
              </h2>
              <TabsList className="bg-secondary/30 rounded-xl p-1 h-auto">
                <TabsTrigger value="all" className="rounded-lg px-6 py-2.5 font-bold data-[state=active]:bg-background data-[state=active]:text-orange-600 data-[state=active]:shadow-sm transition-all">الكل</TabsTrigger>
                <TabsTrigger value="open" className="rounded-lg px-6 py-2.5 font-bold data-[state=active]:bg-background data-[state=active]:text-orange-600 data-[state=active]:shadow-sm transition-all">قيد المعالجة</TabsTrigger>
                <TabsTrigger value="closed" className="rounded-lg px-6 py-2.5 font-bold data-[state=active]:bg-background data-[state=active]:text-orange-600 data-[state=active]:shadow-sm transition-all">المنتهية</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="space-y-4 focus-visible:outline-none">
              <TicketList tickets={tickets} />
            </TabsContent>
            <TabsContent value="open" className="space-y-4 focus-visible:outline-none">
              <TicketList tickets={openTickets} />
            </TabsContent>
            <TabsContent value="closed" className="space-y-4 focus-visible:outline-none">
              <TicketList tickets={closedTickets} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

function TicketList({ tickets }: { tickets: any[] }) {
  if (tickets.length === 0) {
    return (
      <div className="text-center py-20 border-2 border-dashed border-border/50 rounded-[2rem] bg-secondary/5 flex flex-col items-center justify-center">
        <div className="p-4 bg-secondary/20 rounded-full mb-4">
          <AlertCircle className="w-10 h-10 text-muted-foreground" />
        </div>
        <p className="text-lg font-medium text-muted-foreground">لا توجد بلاغات حالياً</p>
        <p className="text-sm text-muted-foreground mt-1">تأكد من اختيار التبويب الصحيح</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tickets.map((ticket) => (
        <Card key={ticket.id} className="gsap-ticket-card group border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-card rounded-[1.5rem] overflow-hidden">
          <CardContent className="p-6 relative">
            <div className="absolute right-0 top-0 bottom-0 w-1.5 transition-colors duration-300 group-hover:bg-orange-500/20" />
            <div className="flex flex-col sm:flex-row justify-between gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant={
                    ticket.priority === 'critical' ? 'destructive' :
                    ticket.priority === 'high' ? 'default' : 'secondary'
                  } className="rounded-xl px-3 py-1 font-bold shadow-sm">
                    {ticket.priority === 'critical' ? 'حرج' : 
                     ticket.priority === 'high' ? 'عالي' : 'عادي'}
                  </Badge>
                  <Badge className={`
                    rounded-xl px-3 py-1 font-bold shadow-sm border-none
                    ${ticket.status === 'open' ? 'bg-blue-500/15 text-blue-600' :
                      ticket.status === 'in_progress' ? 'bg-orange-500/15 text-orange-600' :
                      'bg-green-500/15 text-green-600'}
                  `}>
                    {ticket.status === 'open' ? 'مفتوح' : 
                     ticket.status === 'in_progress' ? 'قيد العمل' : 'تم الحل'}
                  </Badge>
                </div>
                <div>
                  <h3 className="text-lg font-bold group-hover:text-orange-500 transition-colors">{ticket.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed max-w-2xl">
                    {ticket.description}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-muted-foreground pt-2">
                  <div className="flex items-center gap-1.5 bg-secondary/50 px-2.5 py-1.5 rounded-md">
                    <Building className="w-3.5 h-3.5" />
                    <span>المبنى {ticket.building} - غرفة {ticket.room_number}</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-secondary/50 px-2.5 py-1.5 rounded-md">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{new Date(ticket.created_at).toLocaleDateString('ar-DZ')}</span>
                  </div>
                </div>
              </div>
              <div className="flex sm:flex-col justify-end gap-2 shrink-0 sm:pt-2">
                {ticket.status !== 'closed' && (
                  <Button variant="outline" size="sm" className="rounded-xl h-10 font-bold border-border/50 hover:bg-orange-500/10 hover:text-orange-600 hover:border-orange-500/30 transition-colors">
                    متابعة
                  </Button>
                )}
                {ticket.status === 'resolved' && (
                  <Button size="sm" className="rounded-xl h-10 font-bold bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg transition-all">
                    <CheckCircle2 className="w-4 h-4 ml-2" />
                    إغلاق البلاغ
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
