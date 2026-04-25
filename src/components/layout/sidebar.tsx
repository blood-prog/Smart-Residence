"use client";

import { useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  LayoutDashboard,
  Trophy,
  Home,
  Wrench,
  UserCircle,
  LogOut,
  Building2,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  isAdminRole,
  getAdminRoute,
  getRoleLabel,
  ROLE_SIDEBAR_LABELS,
} from "@/lib/admin-roles";

gsap.registerPlugin(useGSAP);

const routes = [
  {
    label: "لوحة التحكم",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    label: "مصلحة النشاطات الرياضية",
    icon: Trophy,
    href: "/sports",
  },
  {
    label: "مصلحة الإيواء",
    icon: Home,
    href: "/housing",
  },
  {
    label: "مصلحة الصيانة",
    icon: Wrench,
    href: "/maintenance",
  },
  {
    label: "الملف الشخصي",
    icon: UserCircle,
    href: "/profile",
  },
];

const adminIconMap: Record<string, typeof ShieldCheck> = {
  admin: ShieldCheck,
  director: ShieldCheck,
  sports_dept: Trophy,
  maintenance_dept: Wrench,
  housing_dept: Building2,
};

interface SidebarProps {
  user: any;
  profile: any;
}

export function Sidebar({ user, profile }: SidebarProps) {
  const pathname = usePathname();
  const container = useRef<HTMLDivElement>(null);
  const role = profile?.role || "student";

  useGSAP(() => {
    // Initial entry animations
    gsap.fromTo(
      ".gsap-sidebar-logo",
      { opacity: 0, x: 20 },
      { opacity: 1, x: 0, duration: 0.6, ease: "power3.out" }
    );
    
    gsap.fromTo(
      ".gsap-sidebar-link",
      { opacity: 0, x: 20 },
      { opacity: 1, x: 0, duration: 0.5, stagger: 0.05, ease: "power2.out", delay: 0.1 }
    );

    gsap.fromTo(
      ".gsap-sidebar-bottom",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", delay: 0.3 }
    );
  }, { scope: container });

  const AdminIcon = adminIconMap[role] || ShieldCheck;
  const adminRoute = getAdminRoute(role);
  const adminLabel = ROLE_SIDEBAR_LABELS[role] || "لوحة الإدارة";
  const isActive = pathname.startsWith("/admin");

  return (
    <div ref={container} className="flex flex-col h-full py-6 bg-card/40 backdrop-blur-3xl border-l border-border/50">
      <div className="gsap-sidebar-logo px-6 mb-8 flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center p-1 shadow-md border border-border/50 transition-transform duration-300 hover:scale-105 hover:rotate-3">
          <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold tracking-tight leading-tight">الاقامة الجامعية</span>
          <span className="text-xs font-medium text-muted-foreground">عبد القادر بلعربي</span>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1.5">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "gsap-sidebar-link group flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300",
              pathname === route.href
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02]"
                : "text-muted-foreground hover:bg-secondary/80 hover:text-foreground hover:translate-x-[-4px]"
            )}
          >
            <route.icon className={cn(
              "w-5 h-5 transition-colors duration-300",
              pathname === route.href ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
            )} />
            {route.label}
          </Link>
        ))}

        {isAdminRole(role) && (
          <Link
            href={adminRoute}
            className={cn(
              "gsap-sidebar-link group flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 mt-4 border border-dashed",
              isActive
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 border-transparent scale-[1.02]"
                : "border-primary/20 text-primary hover:bg-primary/5 hover:border-primary/40 hover:translate-x-[-4px]"
            )}
          >
            <AdminIcon className={cn(
              "w-5 h-5 transition-colors",
              isActive ? "text-primary-foreground" : "text-primary group-hover:scale-110 transition-transform"
            )} />
            {adminLabel}
          </Link>
        )}
      </nav>

      <div className="gsap-sidebar-bottom px-4 mt-auto">
        <Separator className="my-4 bg-border/50" />
        <div className="flex items-center gap-3 px-4 py-4 rounded-2xl bg-secondary/30 backdrop-blur-sm border border-border/50 hover:bg-secondary/50 transition-colors">
          <Avatar className="w-10 h-10 border-2 border-background shadow-sm">
            <AvatarImage src={profile?.avatar_url} />
            <AvatarFallback className="bg-primary/10 text-primary font-bold">
              {profile?.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold truncate leading-none mb-1">
              {profile?.full_name || "مستخدم"}
            </span>
            <span className="text-xs text-muted-foreground truncate">
              {getRoleLabel(role)}
            </span>
          </div>
        </div>

        <form action="/auth/signout" method="post">
          <Button
            variant="ghost"
            className="w-full mt-2 justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl py-6 transition-colors"
            type="submit"
          >
            <LogOut className="w-5 h-5" />
            <span>تسجيل الخروج</span>
          </Button>
        </form>

        <div className="mt-4 text-center">
          <a 
            href="https://ibrahim-benabida.vercel.app" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[10px] text-muted-foreground/50 hover:text-primary transition-colors font-medium tracking-wider uppercase"
          >
            Made by Ibrahim Benabida
          </a>
        </div>
      </div>
    </div>
  );
}

