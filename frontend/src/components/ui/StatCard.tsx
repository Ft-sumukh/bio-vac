"use client";

import { cn } from "@/lib/utils";

export const GlassCard = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn(
    "bg-white/[0.03] backdrop-blur-3xl border border-white/5 rounded-[32px] p-8 shadow-2xl overflow-hidden relative group transition-all duration-500 hover:bg-white/[0.05] hover:border-white/10",
    className
  )}>
    {/* Subtle Inner Glow */}
    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    <div className="relative z-10">
      {children}
    </div>
  </div>
);

export const StatCard = ({ label, value, icon: Icon, trend, color = "brand-blue" }: { label: string, value: string | number, icon: any, trend?: string, color?: string, chartData?: any }) => (
  <GlassCard className="p-6">
    <div className="flex justify-between items-start mb-6">
      <div className={cn("p-3 rounded-2xl bg-opacity-10 shadow-inner", `bg-${color}`, `text-${color}`)}>
        <Icon size={24} />
      </div>
      {trend && (
        <span className={cn(
          "text-[10px] font-black px-2.5 py-1 rounded-full",
          trend.startsWith('+') ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
        )}>
          {trend}
        </span>
      )}
    </div>
    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-1">{label}</div>
    <div className="text-4xl font-black tracking-tight">{value}</div>
  </GlassCard>
);
