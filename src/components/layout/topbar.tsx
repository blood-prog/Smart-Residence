"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { 
  Bell, 
  Search, 
  Menu,
  ChevronLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { Sidebar } from "./sidebar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

gsap.registerPlugin(useGSAP);

interface TopbarProps {
  user: any;
  profile: any;
}

export function Topbar({ user, profile }: TopbarProps) {
  const container = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.fromTo(
      container.current,
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
    );
  }, { scope: container });

  return (
    <header ref={container} className="sticky top-0 z-40 w-full border-b border-border/50 bg-background/60 backdrop-blur-2xl transition-all shadow-sm">
      <div className="flex h-16 items-center justify-between px-4 lg:px-8">
        <div className="flex items-center gap-4">
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon" className="lg:hidden hover:bg-primary/10 transition-colors rounded-xl">
                  <Menu className="h-6 w-6" />
                </Button>
              }
            />
            <SheetContent side="right" className="p-0 w-72 border-none">
              <Sidebar user={user} profile={profile} />
            </SheetContent>
          </Sheet>

          {/* Breadcrumbs / Page Title */}
          <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground bg-secondary/30 px-3 py-1.5 rounded-full border border-border/50 shadow-sm backdrop-blur-sm">
            <span className="hover:text-primary cursor-pointer transition-colors">الرئيسية</span>
            <ChevronLeft className="h-4 w-4 opacity-50" />
            <span className="text-foreground font-semibold">لوحة التحكم</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Search bar */}
          <div className="relative hidden sm:block w-72">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
            <Input 
              placeholder="بحث عن شيء ما..." 
              className="pr-10 h-10 bg-secondary/40 border-border/50 hover:border-primary/30 focus-visible:ring-primary/20 focus-visible:border-primary transition-all rounded-xl shadow-inner"
            />
          </div>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative rounded-xl hover:bg-secondary/80 transition-colors h-10 w-10 border border-transparent hover:border-border/50 shadow-sm">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-destructive rounded-full shadow-[0_0_8px_rgba(239,68,68,0.6)] animate-pulse" />
          </Button>

          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="ghost" className="relative h-10 w-10 rounded-xl p-0 overflow-hidden border-2 border-transparent hover:border-primary/20 hover:shadow-md transition-all">
                  <Avatar className="h-full w-full">
                    <AvatarImage src={profile?.avatar_url} />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold">
                      {profile?.full_name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              }
            />
            <DropdownMenuContent className="w-56 mt-2 rounded-2xl shadow-xl border-border/50 p-2" align="start">
              <DropdownMenuGroup>
                <DropdownMenuLabel className="font-normal p-2">
                  <div className="flex flex-col space-y-1 text-right">
                    <p className="text-sm font-bold leading-none">{profile?.full_name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator className="bg-border/50" />
              <DropdownMenuItem className="text-right justify-end rounded-xl cursor-pointer py-2">
                الملف الشخصي
              </DropdownMenuItem>
              <DropdownMenuItem className="text-right justify-end rounded-xl cursor-pointer py-2">
                الإعدادات
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border/50" />
              <form action="/auth/signout" method="post">
                <button className="w-full">
                  <DropdownMenuItem className="text-right justify-end text-destructive focus:text-destructive focus:bg-destructive/10 rounded-xl cursor-pointer py-2">
                    تسجيل الخروج
                  </DropdownMenuItem>
                </button>
              </form>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
