"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signup } from "../login/actions";
import { Building2, Loader2, Mail, Lock, User } from "lucide-react";

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    const result = await signup(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="animate-fade-in">
      {/* Logo / Branding */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white text-primary mb-4 shadow-xl border border-border/50 overflow-hidden">
          <img src="/logo.png" alt="Logo" className="w-full h-full object-contain p-2" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">الاقامة الجامعية عبد القادر بلعربي</h1>
        <p className="text-muted-foreground mt-1 text-sm">نظام إدارة الإقامة الجامعية</p>
      </div>

      <Card className="glass border-border/50 shadow-xl">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-xl">إنشاء حساب جديد</CardTitle>
          <CardDescription>أدخل بياناتك لإنشاء حساب في النظام</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">الاسم الكامل</Label>
              <div className="relative">
                <User className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="محمد أحمد"
                  required
                  className="pr-10 h-11"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="example@univ.dz"
                  required
                  className="pr-10 h-11"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="pr-10 h-11"
                  dir="ltr"
                />
              </div>
            </div>

            {error && (
              <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg p-3 animate-slide-up">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full h-11 text-base font-medium" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  جارٍ إنشاء الحساب...
                </>
              ) : (
                "إنشاء الحساب"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              لديك حساب بالفعل؟{" "}
              <Link href="/login" className="text-primary font-medium hover:underline underline-offset-4 transition-all">
                تسجيل الدخول
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>

      <p className="text-center text-xs text-muted-foreground mt-6">
        © {new Date().getFullYear()} الاقامة الجامعية عبد القادر بلعربي — جميع الحقوق محفوظة
      </p>
      <div className="mt-2 text-center">
        <a 
          href="https://ibrahim-benabida.vercel.app" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-[10px] text-muted-foreground/30 hover:text-primary transition-colors font-medium uppercase tracking-widest"
        >
          Made by Ibrahim Benabida
        </a>
      </div>
    </div>
  );
}
