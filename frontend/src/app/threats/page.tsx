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
  AlertTriangle,
  ArrowDownRight,
  TrendingUp,
  Target
} from "lucide-react";
import { GlassCard } from "@/components/ui/StatCard";
import { THREAT_CARDS } from "@/lib/data-generator";
import { 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  ZAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { cn } from "@/lib/utils";

export default function ThreatsPage() {
  const scatterData = THREAT_CARDS.map(t => ({
    x: t.transmissibility,
    y: t.risk,
    name: t.id,
    color: t.color
  }));

  return (
    <div className="space-y-10 pb-20">
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 text-red-500 mb-2">
            <ShieldAlert size={14} className="fill-current" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Strategic Threat Intelligence</span>
          </div>
          <h1 className="text-5xl font-black tracking-tight text-white">Threat <span className="text-white/40">Detection</span></h1>
          <p className="text-white/40 mt-2 font-medium max-w-xl">
            High-fidelity risk assessment combining transmissibility indices with neural-predicted evasion scores.
          </p>
        </div>

        <div className="flex items-center space-x-4">
           <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-red-500 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Filter by lineage or motif..." 
                className="bg-white/5 border border-white/5 pl-12 pr-6 py-3.5 rounded-xl w-[300px] text-sm font-bold focus:outline-none focus:border-red-500/50 focus:bg-white/10 transition-all"
              />
           </div>
           <button className="flex items-center space-x-2 px-6 py-3.5 bg-red-500 text-white rounded-xl shadow-lg shadow-red-500/20 hover:scale-105 transition-all">
              <ShieldCheck size={18} />
              <span className="text-xs font-black uppercase tracking-widest">Verify Signal</span>
           </button>
        </div>
      </section>

      {/* Risk Matrix Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
           <GlassCard className="p-10 h-[500px]">
              <div className="flex items-center justify-between mb-8">
                 <h3 className="text-sm font-black uppercase tracking-widest text-white/60">Risk Matrix: Evasion vs. Transmissibility</h3>
                 <Target size={16} className="text-red-500" />
              </div>
              <div className="h-[350px] w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart>
                       <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                       <XAxis type="number" dataKey="x" name="Transmissibility" stroke="#ffffff20" fontSize={10} domain={[0, 10]} />
                       <YAxis type="number" dataKey="y" name="Evasion Risk" stroke="#ffffff20" fontSize={10} domain={[0, 100]} />
                       <ZAxis type="number" range={[100, 1000]} />
                       <Tooltip 
                          cursor={{ strokeDasharray: '3 3' }}
                          contentStyle={{ backgroundColor: '#050505', border: '1px solid #ffffff10', borderRadius: '16px' }}
                       />
                       <Scatter name="Variants" data={scatterData}>
                          {scatterData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                       </Scatter>
                    </ScatterChart>
                 </ResponsiveContainer>
              </div>
           </GlassCard>
        </div>

        <div className="lg:col-span-4 space-y-6">
           <GlassCard className="p-8 h-full">
              <h3 className="text-xs font-black uppercase tracking-widest text-white/30 mb-8">Evasion Forecasting (14D)</h3>
              <div className="space-y-10">
                 {THREAT_CARDS.slice(0, 3).map((t) => (
                    <div key={t.id} className="space-y-3">
                       <div className="flex justify-between items-end">
                          <span className="text-sm font-black text-white">{t.id}</span>
                          <div className="flex items-center space-x-2">
                             <TrendingUp size={12} className="text-red-500" />
                             <span className="text-xs font-black text-red-500">+{Math.floor(Math.random() * 20)}%</span>
                          </div>
                       </div>
                       <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${t.risk}%` }}
                            className="h-full"
                            style={{ backgroundColor: t.color }}
                          />
                       </div>
                    </div>
                 ))}
              </div>
              <div className="mt-12 p-6 bg-red-500/10 border border-red-500/20 rounded-2xl">
                 <div className="flex items-center space-x-3 mb-2">
                    <AlertTriangle className="text-red-500" size={16} />
                    <span className="text-xs font-black text-white uppercase tracking-widest">Model Consensus</span>
                 </div>
                 <p className="text-[10px] font-medium text-white/40 leading-relaxed italic">
                    "High probability of reassortment in H5N1-MOD clusters. Geographic expansion into Central Europe confirmed."
                 </p>
              </div>
           </GlassCard>
        </div>
      </div>

      {/* Threat Cards */}
      <section className="space-y-6">
        <h2 className="text-xl font-black uppercase tracking-widest text-white/60 px-2">Active Intelligence Profiles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {THREAT_CARDS.map((threat, i) => (
             <motion.div 
               key={threat.id}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.1 }}
             >
                <GlassCard className="p-10 group overflow-hidden border-white/5 hover:border-red-500/30 transition-all">
                   <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center space-x-6">
                         <div className="w-16 h-16 rounded-3xl flex items-center justify-center border transition-all group-hover:scale-110" style={{ backgroundColor: `${threat.color}10`, borderColor: `${threat.color}30`, color: threat.color }}>
                            <ShieldAlert size={32} />
                         </div>
                         <div>
                            <h3 className="text-3xl font-black text-white tracking-tighter">{threat.id}</h3>
                            <div className="flex items-center space-x-2">
                               <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                               <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">{threat.family} Strain</span>
                            </div>
                         </div>
                      </div>
                      <div className="text-right">
                         <div className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-1">Evasion Score</div>
                         <div className="text-4xl font-black font-mono text-white">{threat.risk}%</div>
                      </div>
                   </div>

                   <div className="grid grid-cols-2 gap-8 mb-8">
                      <div className="space-y-1">
                         <div className="text-[10px] font-black uppercase tracking-widest text-white/30">Molecular Basis</div>
                         <p className="text-xs font-medium text-white/60 leading-relaxed">{threat.basis}</p>
                      </div>
                      <div className="space-y-1">
                         <div className="text-[10px] font-black uppercase tracking-widest text-white/30">Geographic Forecast</div>
                         <p className="text-xs font-medium text-white/60 leading-relaxed">{threat.forecast}</p>
                      </div>
                   </div>

                   <div className="flex items-center justify-between pt-8 border-t border-white/5">
                      <div className="flex items-center space-x-8">
                         <div className="text-center">
                            <div className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-1">Transmissibility</div>
                            <div className="text-sm font-bold text-white">{threat.transmissibility}/10</div>
                         </div>
                         <div className="text-center">
                            <div className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-1">Prevalence</div>
                            <div className="text-sm font-bold text-white">{threat.prevalence}%</div>
                         </div>
                      </div>
                      <button className="flex items-center space-x-2 px-6 py-3 bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white/40 hover:bg-white/10 hover:text-white transition-all">
                         <span>Full Report</span>
                         <ArrowUpRight size={14} />
                      </button>
                   </div>
                </GlassCard>
             </motion.div>
           ))}
        </div>
      </section>
    </div>
  );
}
