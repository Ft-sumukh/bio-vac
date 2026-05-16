"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Dna, 
  TrendingUp, 
  Activity, 
  AlertCircle,
  Share2,
  Download,
  Filter,
  Zap,
  ChevronDown,
  Info,
  Maximize2
} from "lucide-react";
import { GlassCard } from "@/components/ui/StatCard";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  Legend,
  ScatterChart,
  Scatter,
  ZAxis
} from 'recharts';
import { VARIANT_TRACKING_DATA, EVOLUTIONARY_DRIFT } from "@/lib/mock";
import { VIRAL_FAMILIES, CLADES } from "@/lib/data-generator";
import { cn } from "@/lib/utils";

export default function MutationsPage() {
  const [selectedFamily, setSelectedFamily] = useState("SARS-CoV-2");

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 text-brand-blue mb-2">
            <Dna size={14} className="fill-current" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Molecular Surveillance Unit</span>
          </div>
          <h1 className="text-5xl font-black tracking-tight text-white">Mutation <span className="text-white/40">Analytics</span></h1>
          <p className="text-white/40 mt-2 font-medium max-w-xl">
            Deep-dive into structural shifts, amino acid substitutions, and evolutionary trajectories.
          </p>
        </div>

        <div className="flex items-center space-x-4">
           <div className="bg-white/5 p-1 rounded-2xl border border-white/5 flex">
              {VIRAL_FAMILIES.slice(0, 3).map((f) => (
                <button 
                  key={f}
                  onClick={() => setSelectedFamily(f)}
                  className={cn(
                    "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                    selectedFamily === f ? "bg-brand-blue text-white" : "text-white/40 hover:text-white"
                  )}
                >
                  {f}
                </button>
              ))}
           </div>
        </div>
      </section>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Phylodynamics Chart */}
        <div className="lg:col-span-8">
           <GlassCard className="p-8 h-[550px]">
              <div className="flex items-center justify-between mb-10">
                 <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-white/60">Clade Frequency Over Time</h3>
                    <div className="text-[10px] font-bold text-brand-blue mt-1 uppercase tracking-widest">{selectedFamily} Lineages</div>
                 </div>
                 <div className="flex items-center space-x-4">
                    <button className="p-2 bg-white/5 rounded-lg text-white/20 hover:text-white"><Maximize2 size={16} /></button>
                 </div>
              </div>
              <div className="h-[400px] w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={VARIANT_TRACKING_DATA}>
                       <defs>
                          {['Omicron', 'JN1', 'Delta'].map((variant, i) => (
                            <linearGradient key={variant} id={`color${variant}`} x1="0" y1="0" x2="0" y2="1">
                               <stop offset="5%" stopColor={i === 0 ? "#00D2FF" : i === 1 ? "#A855F7" : "#FF1744"} stopOpacity={0.3}/>
                               <stop offset="95%" stopColor={i === 0 ? "#00D2FF" : i === 1 ? "#A855F7" : "#FF1744"} stopOpacity={0}/>
                            </linearGradient>
                          ))}
                       </defs>
                       <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                       <XAxis dataKey="name" stroke="#ffffff20" fontSize={10} fontWeight="bold" />
                       <YAxis stroke="#ffffff20" fontSize={10} fontWeight="bold" />
                       <Tooltip 
                          contentStyle={{ backgroundColor: '#050505', border: '1px solid #ffffff10', borderRadius: '16px' }}
                       />
                       <Legend iconType="circle" />
                       <Area type="monotone" dataKey="Omicron" stroke="#00D2FF" strokeWidth={3} fill="url(#colorOmicron)" />
                       <Area type="monotone" dataKey="JN1" stroke="#A855F7" strokeWidth={3} fill="url(#colorJN1)" />
                       <Area type="monotone" dataKey="Delta" stroke="#FF1744" strokeWidth={3} fill="url(#colorDelta)" />
                    </AreaChart>
                 </ResponsiveContainer>
              </div>
           </GlassCard>
        </div>

        {/* Evolutionary Drift Sidebar */}
        <div className="lg:col-span-4">
           <GlassCard className="p-8 h-full">
              <h3 className="text-sm font-black uppercase tracking-widest text-white/60 mb-8">Evolutionary Divergence</h3>
              <div className="h-[300px] w-full mb-8">
                 <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={EVOLUTIONARY_DRIFT}>
                       <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                       <XAxis dataKey="label" hide />
                       <YAxis hide />
                       <Tooltip contentStyle={{ backgroundColor: '#050505', border: '1px solid #ffffff10', borderRadius: '12px' }} />
                       <Line type="monotone" dataKey="divergence" stroke="#C1FF00" strokeWidth={4} dot={{ r: 4, fill: '#C1FF00', strokeWidth: 0 }} />
                    </LineChart>
                 </ResponsiveContainer>
              </div>
              <div className="space-y-6">
                 <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                    <div>
                       <div className="text-[10px] font-black uppercase tracking-widest text-white/30">Mean Drift Rate</div>
                       <div className="text-xl font-black text-white">0.08 / Site / Year</div>
                    </div>
                    <div className="text-green-400 flex items-center space-x-1">
                       <TrendingUp size={14} />
                       <span className="text-xs font-black">+2.4%</span>
                    </div>
                 </div>
                 <div className="p-6 bg-purple-500/10 border border-purple-500/20 rounded-2xl">
                    <div className="flex items-center space-x-3 mb-2">
                       <Zap className="text-purple-500" size={16} />
                       <span className="text-xs font-black text-white uppercase tracking-widest">Antigenic Shift Alert</span>
                    </div>
                    <p className="text-[10px] font-medium text-white/40 leading-relaxed italic">
                       "Significant divergence detected in Spike RBD position 452. Predicted antigenic shift magnitude: 2.1 units."
                    </p>
                 </div>
              </div>
           </GlassCard>
        </div>
      </div>

      {/* Critical Mutation Tracker */}
      <section className="space-y-6">
         <div className="flex items-center justify-between">
            <h2 className="text-xl font-black uppercase tracking-widest text-white/60">Critical Mutation Tracker</h2>
            <div className="flex items-center space-x-2">
               <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
               <span className="text-[10px] font-black uppercase tracking-widest text-red-500">Live Scanning</span>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { m: "S:L452R", lineage: "XBB.1.5", impact: "High", effect: "ACE2 Affinity+", color: "red-500" },
              { m: "S:E484K", lineage: "JN.1", impact: "Critical", effect: "mAB Evasion++", color: "purple-500" },
              { m: "S:N501Y", lineage: "BA.2.86", impact: "Moderate", effect: "Infectivity+", color: "brand-blue" },
              { m: "NA:S247N", lineage: "H5N1-V2", impact: "Critical", effect: "Drug Resistance+", color: "orange-500" },
              { m: "HA:Q226L", lineage: "H5N1-MOD", impact: "High", effect: "Human Adaptation", color: "pink-500" },
              { m: "P:T478K", lineage: "Mpox-G2", impact: "Elevated", effect: "Dimer Stability", color: "green-400" },
            ].map((item, i) => (
              <motion.div 
                key={item.m}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
              >
                <GlassCard className="p-8 group hover:border-brand-blue/30 transition-all cursor-pointer">
                   <div className="flex items-start justify-between mb-6">
                      <div className={cn("px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest", `bg-${item.color}/10 text-${item.color} border border-${item.color}/20`)}>
                        {item.m}
                      </div>
                      <Info className="text-white/10 group-hover:text-white/40 transition-colors" size={16} />
                   </div>
                   <div className="text-2xl font-black text-white mb-2">{item.effect}</div>
                   <div className="space-y-4">
                      <div className="flex items-center justify-between">
                         <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Clade Affinity</span>
                         <span className="text-xs font-bold text-white/80">{item.lineage}</span>
                      </div>
                      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                         <div className={cn("h-full", `bg-${item.color}`)} style={{ width: '75%' }} />
                      </div>
                      <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest">
                         <span className={cn(`text-${item.color}`)}>{item.impact} Impact</span>
                         <span className="text-white/20">78% Frequency</span>
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
