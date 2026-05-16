"use client";

import { motion } from "framer-motion";
import { 
  ShieldAlert, 
  Search, 
  ArrowUpRight, 
  Activity, 
  Globe, 
  Zap,
  Filter,
  ShieldCheck,
  AlertTriangle
} from "lucide-react";
import { GlassCard } from "@/components/ui/StatCard";
import { MOCK_ALERTS } from "@/lib/mock";
import { cn } from "@/lib/utils";

export default function AlertsPage() {
  return (
    <div className="space-y-10 pb-20">
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 text-red-500 mb-2">
            <ShieldAlert size={14} className="fill-current" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Threat Intelligence Unit</span>
          </div>
          <h1 className="text-5xl font-black tracking-tight text-white">Threat <span className="text-white/40">Detection</span></h1>
          <p className="text-white/40 mt-2 font-medium max-w-xl">
            Real-time tracking of high-risk variants, vaccine evasion motifs, and regional outbreaks.
          </p>
        </div>

        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-red-500 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Filter by lineage or motif..." 
            className="bg-white/5 border border-white/5 pl-12 pr-6 py-3.5 rounded-xl w-[300px] text-sm font-bold focus:outline-none focus:border-red-500/50 focus:bg-white/10 transition-all"
          />
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
         <GlassCard className="p-6 border-red-500/20 bg-red-500/5">
            <div className="text-[10px] font-black uppercase tracking-widest text-red-500/60 mb-2">Active Critical</div>
            <div className="text-4xl font-black text-white">08</div>
         </GlassCard>
         <GlassCard className="p-6">
            <div className="text-[10px] font-black uppercase tracking-widest text-orange-500/60 mb-2">Elevated Risks</div>
            <div className="text-4xl font-black text-white">24</div>
         </GlassCard>
         <GlassCard className="p-6">
            <div className="text-[10px] font-black uppercase tracking-widest text-brand-blue/60 mb-2">Monitored Lineages</div>
            <div className="text-4xl font-black text-white">142</div>
         </GlassCard>
         <GlassCard className="p-6">
            <div className="text-[10px] font-black uppercase tracking-widest text-green-500/60 mb-2">Stable (Low Risk)</div>
            <div className="text-4xl font-black text-white">891</div>
         </GlassCard>
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between px-2">
           <h2 className="text-xs font-black uppercase tracking-widest text-white/30">Active Threat Stream</h2>
           <div className="flex items-center space-x-6">
              <span className="text-[10px] font-black text-white/40 cursor-pointer hover:text-white">Sort: Priority</span>
              <span className="text-[10px] font-black text-white/40 cursor-pointer hover:text-white">Filter: All Regions</span>
           </div>
        </div>

        <div className="space-y-4">
          {MOCK_ALERTS.map((alert, i) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <GlassCard className={cn(
                "p-6 group cursor-pointer hover:bg-white/[0.07]",
                alert.status === 'Critical' ? "border-red-500/20" : "border-white/5"
              )}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-8">
                     <div className={cn(
                       "w-12 h-12 rounded-2xl flex items-center justify-center border",
                       alert.status === 'Critical' ? "bg-red-500/10 border-red-500/20 text-red-500" : "bg-orange-500/10 border-orange-500/20 text-orange-500"
                     )}>
                       {alert.status === 'Critical' ? <ShieldAlert size={24} /> : <AlertTriangle size={24} />}
                     </div>
                     
                     <div className="space-y-1">
                        <div className="flex items-center space-x-3">
                           <h3 className="text-xl font-black text-white tracking-tight">{alert.id}</h3>
                           <span className={cn(
                             "text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md",
                             alert.status === 'Critical' ? "bg-red-500/20 text-red-400" : "bg-orange-500/20 text-orange-400"
                           )}>
                             {alert.status}
                           </span>
                        </div>
                        <p className="text-xs font-medium text-white/40">{alert.details}</p>
                     </div>
                  </div>

                  <div className="flex items-center space-x-12">
                     <div className="text-center">
                        <div className="text-[8px] font-black uppercase tracking-widest text-white/20 mb-1">Location</div>
                        <div className="text-sm font-bold text-white/80 flex items-center"><Globe size={12} className="mr-1.5 text-brand-blue" /> {alert.location}</div>
                     </div>
                     <div className="text-center">
                        <div className="text-[8px] font-black uppercase tracking-widest text-white/20 mb-1">Evasion Risk</div>
                        <div className="text-xl font-black font-mono text-white">{alert.risk}%</div>
                     </div>
                     <div className="text-right">
                        <div className={cn(
                          "text-sm font-black flex items-center justify-end",
                          alert.trend.startsWith('+') ? "text-red-400" : "text-green-400"
                        )}>
                          {alert.trend} <Activity size={12} className="ml-1.5" />
                        </div>
                        <div className="text-[8px] font-bold text-white/20 uppercase tracking-widest">7D Trend</div>
                     </div>
                     <button className="p-3 bg-white/5 rounded-xl group-hover:bg-brand-blue group-hover:text-white transition-all text-white/20">
                        <ArrowUpRight size={20} />
                     </button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
