"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Link from "next/link";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Mail, 
  Phone, 
  MapPin, 
  LogOut,
  Camera,
  ShieldCheck
} from "lucide-react";
import { ProfileForm } from "./profile-form";

gsap.registerPlugin(useGSAP);

interface ProfileClientProps {
  user: any;
  profile: any;
}

export function ProfileClient({ user, profile }: ProfileClientProps) {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Header background reveal
    gsap.fromTo(
      ".gsap-profile-cover",
      { opacity: 0, scale: 0.95 },
      { opacity: 1, scale: 1, duration: 0.8, ease: "power3.out" }
    );

    // Avatar bounce in
    gsap.fromTo(
      ".gsap-avatar",
      { opacity: 0, scale: 0.5, y: 50 },
      { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: "back.out(1.5)", delay: 0.3 }
    );

    // Header text staggered entry
    gsap.fromTo(
      ".gsap-header-text > *",
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, duration: 0.5, stagger: 0.1, ease: "power2.out", delay: 0.5 }
    );

    // Left column stats
    gsap.fromTo(
      ".gsap-left-col > *",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out", delay: 0.6 }
    );

    // Right column form
    gsap.fromTo(
      ".gsap-right-col",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", delay: 0.7 }
    );
  }, { scope: container });

  return (
    <div ref={container} className="space-y-10 pb-10">
      {/* Profile Header */}
      <div className="gsap-profile-cover relative h-56 rounded-[2rem] bg-gradient-to-r from-slate-900 to-slate-800 overflow-visible shadow-lg border border-border/10">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] rounded-[2rem]" />
        
        <div className="absolute -bottom-16 right-8 flex items-end gap-6 z-10">
          <div className="gsap-avatar relative group">
            <Avatar className="h-36 w-36 border-[6px] border-background shadow-2xl">
              <AvatarImage src={profile?.avatar_url} />
              <AvatarFallback className="text-4xl bg-primary/10 text-primary font-bold">
                {profile?.full_name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer backdrop-blur-sm">
              <Camera className="text-white w-8 h-8" />
            </div>
          </div>
          
          <div className="gsap-header-text mb-20 space-y-2">
            <h1 className="text-4xl font-black text-white drop-shadow-lg">{profile?.full_name}</h1>
            <div className="flex items-center gap-3">
              <Badge className="bg-white/20 text-white border-0 backdrop-blur-md px-3 py-1 font-bold shadow-sm hover:bg-white/30">طالب مقيم</Badge>
              <Badge variant="outline" className="text-white/80 border-white/20 px-3 py-1 font-mono backdrop-blur-md">{profile?.student_id || 'SR-0000'}</Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3 mt-16">
        {/* Stats Column */}
        <div className="gsap-left-col lg:col-span-1 space-y-6">
          <Card className="border-0 shadow-lg bg-card rounded-[2rem] overflow-hidden">
            <CardHeader className="bg-secondary/10 border-b border-border/5">
              <CardTitle className="text-xl flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-xl text-primary">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                معلومات الحساب
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="flex items-center gap-4 group">
                <div className="p-3 bg-secondary rounded-xl group-hover:bg-primary/10 group-hover:text-primary transition-colors"><Mail className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" /></div>
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">البريد الإلكتروني</p>
                  <p className="text-sm font-bold">{user?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="p-3 bg-secondary rounded-xl group-hover:bg-primary/10 group-hover:text-primary transition-colors"><Phone className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" /></div>
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">رقم الهاتف</p>
                  <p className="text-sm font-bold" dir="ltr">{profile?.phone_number || 'غير متوفر'}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="p-3 bg-secondary rounded-xl group-hover:bg-primary/10 group-hover:text-primary transition-colors"><MapPin className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" /></div>
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">الإقامة الحالية</p>
                  <p className="text-sm font-bold">المبنى {profile?.building || '--'}، غرفة {profile?.room_number || '--'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Link href="/auth/signout" className="block outline-none">
            <Button variant="destructive" className="w-full h-14 rounded-[1.25rem] gap-2 shadow-lg shadow-destructive/20 text-lg font-bold hover:shadow-xl hover:shadow-destructive/30 transition-all hover:-translate-y-1">
              <LogOut className="w-5 h-5" />
              تسجيل الخروج
            </Button>
          </Link>
        </div>

        {/* Form Column */}
        <div className="gsap-right-col lg:col-span-2">
          <Card className="border-0 shadow-lg bg-card rounded-[2rem] overflow-hidden">
            <CardHeader className="bg-secondary/10 border-b border-border/5">
              <CardTitle className="text-xl">تعديل الملف الشخصي</CardTitle>
              <CardDescription>قم بتحديث معلوماتك الشخصية والأكاديمية.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ProfileForm profile={profile} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
