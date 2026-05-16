"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Zap, 
  ShieldAlert, 
  Activity, 
  Globe, 
  TrendingUp, 
  Search,
  Filter,
  Download,
  ArrowUpRight,
  Dna,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon
} from "lucide-react";
import { GlassCard, StatCard } from "@/components/ui/StatCard";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { MOCK_ALERTS, REGIONAL_RISK, VARIANT_TRACKING_DATA } from "@/lib/mock";
import { cn, formatDate } from "@/lib/utils";

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const barData = REGIONAL_RISK.map(r => ({ name: r.region, value: r.score, color: r.color }));

  return (
    <div className="space-y-10 pb-20">
      {/* Header Section */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2 text-brand-blue mb-2"
          >
            <Zap size={14} className="fill-current" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Operational Intelligence</span>
          </motion.div>
          <h1 className="text-5xl font-black tracking-tight text-white">Intelligence <span className="text-white/40">Hub</span></h1>
          <p className="text-white/40 mt-2 font-medium max-w-xl">
            Real-time aggregate of global genomic structural shifts and vaccine evasion probabilities.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-brand-blue transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search mutations, locations..." 
              className="bg-white/5 border border-white/5 pl-12 pr-6 py-3.5 rounded-xl w-[300px] text-sm font-bold focus:outline-none focus:border-brand-blue/50 focus:bg-white/10 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="p-3.5 bg-brand-blue text-white rounded-xl shadow-lg shadow-brand-blue/20 hover:scale-105 transition-all">
            <Download size={20} />
          </button>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Critical Threats" value="08" icon={ShieldAlert} trend="+4" color="red-500" />
        <StatCard label="Global Sequences" value="14.8M" icon={Activity} trend="+12.8%" color="brand-blue" />
        <StatCard label="Active Regions" value="142" icon={Globe} trend="Stable" color="green-400" />
        <StatCard label="Evasion Score (Avg)" value="72.4" icon={TrendingUp} trend="+2.4" color="purple-500" />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Feed */}
        <section className="lg:col-span-8 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black uppercase tracking-widest text-white/60">Live Detection Feed</h2>
            <button className="text-[10px] font-black uppercase tracking-widest text-brand-blue hover:underline">View All Records</button>
          </div>
          
          <div className="space-y-4">
            {MOCK_ALERTS.map((alert, i) => (
              <motion.div 
                key={alert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group cursor-pointer"
              >
                <GlassCard className="p-6 hover:translate-x-2 transition-transform duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center border",
                        alert.status === 'Critical' ? "bg-red-500/10 border-red-500/20 text-red-500" : "bg-brand-blue/10 border-brand-blue/20 text-brand-blue"
                      )}>
                        <Dna size={22} />
                      </div>
                      <div>
                        <div className="flex items-center space-x-3 mb-1">
                          <h3 className="text-lg font-black tracking-tight">{alert.id}</h3>
                          <span className={cn(
                            "text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md",
                            alert.status === 'Critical' ? "bg-red-500/20 text-red-400" : "bg-brand-blue/20 text-brand-blue"
                          )}>
                            {alert.status}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-xs font-bold text-white/30">
                          <span className="flex items-center"><Globe size={12} className="mr-1.5" /> {alert.location}</span>
                          <span className="flex items-center"><Activity size={12} className="mr-1.5" /> Detected {formatDate(alert.date)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                       <div className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-1">Evasion Risk</div>
                       <div className="flex items-center space-x-3">
                          <div className="text-2xl font-black font-mono">{alert.risk}%</div>
                          <ArrowUpRight size={18} className="text-white/20 group-hover:text-brand-blue transition-colors" />
                       </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Sidebar Analytics */}
        <aside className="lg:col-span-4 space-y-10">
          <GlassCard className="p-8 h-[400px]">
             <div className="flex items-center justify-between mb-8">
                <h3 className="text-sm font-black uppercase tracking-widest text-white/60">Regional Evasion Map</h3>
                <BarChartIcon size={16} className="text-brand-blue" />
             </div>
             <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={barData} layout="vertical">
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" stroke="#ffffff40" fontSize={10} fontWeight="bold" width={80} />
                      <Tooltip 
                         cursor={{ fill: 'transparent' }}
                         contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid #ffffff10', borderRadius: '12px' }}
                      />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={12}>
                        {barData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                   </BarChart>
                </ResponsiveContainer>
             </div>
          </GlassCard>

          <GlassCard className="bg-brand-blue/10 border-brand-blue/20 p-8">
             <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-brand-blue rounded-lg flex items-center justify-center shadow-lg shadow-brand-blue/30">
                   <Zap size={16} className="text-white fill-current" />
                </div>
                <h3 className="text-sm font-black uppercase tracking-widest text-white">AI Analyst Briefing</h3>
             </div>
             <p className="text-xs font-medium text-white/60 leading-relaxed mb-6 italic">
                "Spike glycoprotein shifts in XBB clusters indicate a 12% increase in ACE2 binding affinity. Recommend immediate update to mRNA targeting sequences."
             </p>
             <button className="w-full bg-white text-brand-navy py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-brand-blue hover:text-white transition-all">
                Generate Full Report
             </button>
          </GlassCard>
        </aside>
      </div>
    </div>
  );
}
