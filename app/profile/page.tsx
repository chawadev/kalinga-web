"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Calendar,
  Settings,
  LogOut,
  Shield,
  CreditCard,
  TrendingUp,
  Bell,
  Home,
  Sun,
  Moon,
  Sparkles,
  ChevronRight,
  Zap,
  Lock,
  Globe,
  Smartphone,
} from "lucide-react";
import { VoiceOrb, OrbState } from "@/components/VoiceOrb";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [isDark, setIsDark] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [orbState, setOrbState] = useState<OrbState>("idle");

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      router.push("/auth/login");
      return;
    }

    try {
      setUser(JSON.parse(userData));
    } catch (error) {
      console.error("Error parsing user data:", error);
      router.push("/auth/login");
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/auth/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const menuItems = [
    { icon: Settings, label: "Account Settings", description: "Personalize your experience", href: "/settings" },
    { icon: Shield, label: "Security", description: "Password and 2FA settings", href: "/security" },
    { icon: CreditCard, label: "Payment Methods", description: "Manage your cards", href: "/payment" },
    { icon: TrendingUp, label: "Financial Goals", description: "Track your progress", href: "/goals" },
    { icon: Bell, label: "Notifications", description: "Alert preferences", href: "/notifications" },
  ];

  const quickStats = [
    { icon: TrendingUp, label: "Financial Score", value: "78", color: "emerald" },
    { icon: CreditCard, label: "Linked Accounts", value: "3", color: "primary" },
    { icon: Shield, label: "Security Status", value: "Active", color: "amber" },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      {/* Canopy Glow */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,var(--page-glow),transparent_62%)]" 
      />

      {/* Top Left Header */}
      <header className="fixed top-6 left-6 z-30 flex items-center gap-2">
        <button
          onClick={() => router.push("/")}
          className="h-10 w-10 rounded-full glass hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center text-foreground"
        >
          <Home className="h-5 w-5" />
        </button>
        <h1 className="text-xl font-bold tracking-tight text-foreground">
          Kalinga
        </h1>
        <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
      </header>

      {/* Theme Toggle */}
      <div className="fixed top-6 right-6 z-30">
        <button
          onClick={() => setIsDark(!isDark)}
          className="h-10 w-10 rounded-full glass hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center text-foreground"
        >
          <Sparkles className="h-5 w-5" />
        </button>
      </div>

      {/* Main Content */}
      <main className="mx-auto w-full max-w-4xl px-4 pt-20 pb-8">
        {/* Voice Orb */}
        <div className="flex justify-center mb-6">
          <VoiceOrb state={orbState} onClick={() => setOrbState(orbState === "idle" ? "listening" : "idle")} />
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-foreground mb-1">Profile</h1>
          <p className="text-sm text-muted-foreground">Manage your account and preferences</p>
        </div>

        {/* Profile Card */}
        <div className="glass-strong rounded-2xl p-6 border border-glass-border mb-6">
          <div className="flex flex-col md:flex-row items-center gap-5">
            {/* Avatar */}
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/30 text-primary grid place-items-center text-2xl font-bold ring-2 ring-primary/20">
              {user.name.charAt(0).toUpperCase()}
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-xl font-semibold text-foreground mb-1">{user.name}</h2>
              <div className="flex items-center justify-center md:justify-start gap-2 text-xs text-muted-foreground">
                <Mail className="h-3.5 w-3.5" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-2 text-xs text-muted-foreground mt-1">
                <Calendar className="h-3.5 w-3.5" />
                <span>Member since {new Date(user.created_at).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors text-sm font-medium"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {quickStats.map((stat, index) => (
            <div key={index} className="glass-strong rounded-xl p-4 border border-glass-border text-center">
              <div className={`h-8 w-8 rounded-full bg-${stat.color}-500/10 text-${stat.color}-500 grid place-items-center mx-auto mb-2`}>
                <stat.icon className="h-4 w-4" />
              </div>
              <div className="text-lg font-bold text-foreground">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Menu Items */}
        <div className="glass-strong rounded-2xl border border-glass-border overflow-hidden">
          {menuItems.map((item, index) => (
            <button
              key={index}
              className="w-full flex items-center gap-4 p-4 hover:bg-primary/5 transition-colors border-b border-glass-border last:border-b-0 group"
            >
              <div className="h-9 w-9 rounded-full bg-primary/10 text-primary grid place-items-center group-hover:scale-110 transition-transform">
                <item.icon className="h-4.5 w-4.5" />
              </div>
              <div className="flex-1 text-left">
                <div className="text-sm font-medium text-foreground">{item.label}</div>
                <div className="text-xs text-muted-foreground">{item.description}</div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            </button>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          <button className="glass-strong rounded-xl p-4 border border-glass-border flex items-center gap-3 hover:bg-primary/5 transition-colors">
            <div className="h-9 w-9 rounded-full bg-primary/10 text-primary grid place-items-center">
              <Smartphone className="h-4.5 w-4.5" />
            </div>
            <div className="text-left">
              <div className="text-sm font-medium text-foreground">Mobile App</div>
              <div className="text-xs text-muted-foreground">Download</div>
            </div>
          </button>

          <button className="glass-strong rounded-xl p-4 border border-glass-border flex items-center gap-3 hover:bg-primary/5 transition-colors">
            <div className="h-9 w-9 rounded-full bg-primary/10 text-primary grid place-items-center">
              <Globe className="h-4.5 w-4.5" />
            </div>
            <div className="text-left">
              <div className="text-sm font-medium text-foreground">Web Portal</div>
              <div className="text-xs text-muted-foreground">Access</div>
            </div>
          </button>
        </div>

        {/* Security Banner */}
        <div className="mt-6 glass-strong rounded-xl p-4 border border-primary/20 bg-primary/5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/20 text-primary grid place-items-center">
              <Zap className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-foreground">Security Enhanced</div>
              <div className="text-xs text-muted-foreground">Your account is protected with 2FA</div>
            </div>
            <button className="text-xs text-primary font-medium hover:underline">
              Manage
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
