"use client";

import { motion } from "framer-motion";
import { 
  Dna, 
  TrendingUp, 
  Activity, 
  AlertCircle,
  Share2,
  Download,
  Filter,
  Zap
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
  Legend
} from 'recharts';
import { VARIANT_TRACKING_DATA, EVOLUTIONARY_DRIFT } from "@/lib/mock";
import { cn } from "@/lib/utils";

export default function MutationsPage() {
  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 text-brand-blue mb-2">
            <Dna size={14} className="fill-current" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Molecular Surveillance</span>
          </div>
          <h1 className="text-5xl font-black tracking-tight text-white">Mutation <span className="text-white/40">Analytics</span></h1>
          <p className="text-white/40 mt-2 font-medium max-w-xl">
            Tracking amino acid substitutions and structural shifts across global viral families.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="p-3.5 bg-white/5 border border-white/5 rounded-xl text-white/40 hover:text-white transition-colors">
            <Filter size={20} />
          </button>
          <button className="flex items-center space-x-2 px-6 py-3.5 bg-brand-blue text-white rounded-xl shadow-lg shadow-brand-blue/20 hover:scale-105 transition-all">
            <Download size={18} />
            <span className="text-xs font-black uppercase tracking-widest">Export Data</span>
          </button>
        </div>
      </section>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <GlassCard className="p-8 h-[450px]">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-sm font-black uppercase tracking-widest text-white/60">Variant Frequency (Phylodynamics)</h3>
            <Activity size={16} className="text-brand-blue" />
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={VARIANT_TRACKING_DATA}>
                <defs>
                  <linearGradient id="colorOmicron" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00D2FF" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00D2FF" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorDelta" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF1744" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#FF1744" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="name" stroke="#ffffff40" fontSize={10} fontWeight="bold" />
                <YAxis stroke="#ffffff40" fontSize={10} fontWeight="bold" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid #ffffff10', borderRadius: '16px' }}
                  itemStyle={{ fontSize: '10px', fontWeight: 'bold' }}
                />
                <Legend iconType="circle" />
                <Area type="monotone" dataKey="Omicron" stroke="#00D2FF" fillOpacity={1} fill="url(#colorOmicron)" strokeWidth={3} />
                <Area type="monotone" dataKey="JN1" stroke="#FFD600" fillOpacity={1} fill="none" strokeWidth={3} strokeDasharray="5 5" />
                <Area type="monotone" dataKey="Delta" stroke="#FF1744" fillOpacity={1} fill="url(#colorDelta)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard className="p-8 h-[450px]">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-sm font-black uppercase tracking-widest text-white/60">Evolutionary Divergence</h3>
            <TrendingUp size={16} className="text-purple-500" />
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={EVOLUTIONARY_DRIFT}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="label" stroke="#ffffff40" fontSize={10} fontWeight="bold" />
                <YAxis stroke="#ffffff40" fontSize={10} fontWeight="bold" />
                <Tooltip 
                   contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid #ffffff10', borderRadius: '16px' }}
                />
                <Line type="stepAfter" dataKey="divergence" stroke="#A855F7" strokeWidth={4} dot={{ r: 6, fill: '#A855F7', strokeWidth: 2, stroke: '#000' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      {/* Hotspot substitutions */}
      <section className="space-y-6">
         <div className="flex items-center justify-between">
            <h2 className="text-xl font-black uppercase tracking-widest text-white/60">Critical Amino Acid Substitutions</h2>
            <div className="flex items-center space-x-2">
               <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
               <span className="text-[10px] font-black uppercase tracking-widest text-red-500">Real-time Monitoring</span>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { mutation: "S:L452R", lineage: "XBB.1.5", impact: "High", effect: "ACE2 Affinity+", color: "red-500" },
              { mutation: "S:E484K", lineage: "JN.1", impact: "Critical", effect: "mAB Evasion++", color: "purple-500" },
              { mutation: "S:N501Y", lineage: "BA.2.86", impact: "Moderate", effect: "Transmissibility+", color: "brand-blue" },
              { mutation: "NA:S247N", lineage: "H5N1-V2", impact: "Critical", effect: "Oseltamivir Res+", color: "orange-500" },
              { mutation: "HA:Q226L", lineage: "H5N1-MOD", impact: "High", effect: "Mammalian Adapt", color: "pink-500" },
              { mutation: "P:T478K", lineage: "Mpox-G2", impact: "Elevated", effect: "Dimer Stability", color: "green-400" },
            ].map((m, i) => (
              <motion.div 
                key={m.mutation}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
              >
                <GlassCard className="p-6 group hover:border-brand-blue/30 transition-all">
                   <div className="flex items-start justify-between mb-4">
                      <div className={cn("px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest", `bg-${m.color}/10 text-${m.color}`)}>
                        {m.mutation}
                      </div>
                      <AlertCircle className={cn(`text-${m.color}/40 group-hover:text-${m.color}`)} size={16} />
                   </div>
                   <div className="text-lg font-black text-white mb-1">{m.effect}</div>
                   <div className="flex items-center justify-between text-[10px] font-bold">
                      <span className="text-white/40">Lineage: {m.lineage}</span>
                      <span className={cn("uppercase tracking-widest", `text-${m.color}`)}>{m.impact} Impact</span>
                   </div>
                </GlassCard>
              </motion.div>
            ))}
         </div>
      </section>
    </div>
  );
}
