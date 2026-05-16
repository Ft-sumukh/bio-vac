"use client";

import { motion } from "framer-motion";
import { 
  Zap, 
  ShieldAlert, 
  Activity, 
  Globe, 
  TrendingUp, 
  Search,
  Download,
  ArrowUpRight,
  Dna,
  Server,
  Database,
  Cpu,
  Clock,
  ExternalLink
} from "lucide-react";
import { GlassCard, StatCard } from "@/components/ui/StatCard";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { THREAT_CARDS, EVOLUTIONARY_DATA } from "@/lib/data-generator";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function DashboardPage() {
  const threatLevel = 8; // Scale 1-10

  return (
    <div className="space-y-10 pb-20">
      {/* Hero Banner: Global Threat Level */}
      <section className="relative h-[250px] rounded-[40px] overflow-hidden group">
         <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/20 via-black to-red-500/10 z-0" />
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 z-0" />
         
         <div className="relative z-10 h-full flex flex-col justify-center px-12">
            <div className="flex items-center space-x-3 mb-4">
               <span className="px-4 py-1 bg-red-500 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-full animate-pulse">Critical Alert</span>
               <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Global Bio-Security Status</span>
            </div>
            
            <div className="flex items-end space-x-8">
               <div>
                  <h1 className="text-6xl font-black text-white tracking-tighter">LEVEL <span className="text-red-500">{threatLevel}.0</span></h1>
                  <p className="text-white/40 font-medium max-w-md mt-2 italic">
                    "Elevated genomic evasion detected in Southeast Asian clusters. Recommend immediate sequence intensification."
                  </p>
               </div>
               
               <div className="flex-1 max-w-md mb-2">
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                     <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${threatLevel * 10}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-brand-blue via-purple-500 to-red-500"
                     />
                  </div>
                  <div className="flex justify-between mt-2 text-[10px] font-black uppercase tracking-widest text-white/20">
                     <span>Safe (1.0)</span>
                     <span>Outbreak (10.0)</span>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 4-Column KPI Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Sequences Indexed" value="14.8M" icon={Database} trend="+12.4%" color="brand-blue" />
        <StatCard label="Viral Families" value="05" icon={Dna} trend="Stable" color="green-400" />
        <StatCard label="High-Risk Variants" value="12" icon={ShieldAlert} trend="+2" color="red-500" />
        <StatCard label="Model Confidence" value="94.2%" icon={Cpu} trend="+0.8%" color="purple-500" />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content: Timeline & Featured Threats */}
        <div className="lg:col-span-8 space-y-8">
           <GlassCard className="p-8 h-[450px]">
              <div className="flex items-center justify-between mb-8">
                 <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-white/60">Variant Emergence Timeline</h3>
                    <p className="text-[10px] text-white/20 font-bold mt-1 uppercase">12-Month Genomic Trajectory</p>
                 </div>
                 <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-brand-blue rounded-full" />
                    <span className="text-[10px] font-bold text-white/40">Divergence Index</span>
                 </div>
              </div>
              <div className="h-[300px] w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={EVOLUTIONARY_DATA}>
                       <defs>
                          <linearGradient id="colorDiv" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="#00D2FF" stopOpacity={0.3}/>
                             <stop offset="95%" stopColor="#00D2FF" stopOpacity={0}/>
                          </linearGradient>
                       </defs>
                       <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                       <XAxis dataKey="time" stroke="#ffffff20" fontSize={10} fontWeight="bold" />
                       <YAxis stroke="#ffffff20" fontSize={10} fontWeight="bold" />
                       <Tooltip 
                          contentStyle={{ backgroundColor: '#050505', border: '1px solid #ffffff10', borderRadius: '16px' }}
                       />
                       <Area type="monotone" dataKey="divergence" stroke="#00D2FF" strokeWidth={4} fillOpacity={1} fill="url(#colorDiv)" />
                    </AreaChart>
                 </ResponsiveContainer>
              </div>
           </GlassCard>

           <section className="space-y-6">
              <div className="flex items-center justify-between">
                 <h2 className="text-xl font-black uppercase tracking-widest text-white/60">Featured Threats</h2>
                 <Link href="/threats" className="text-[10px] font-black uppercase tracking-widest text-brand-blue hover:underline">View All Intelligence</Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {THREAT_CARDS.slice(0, 2).map((threat) => (
                    <motion.div key={threat.id} whileHover={{ y: -5 }}>
                       <GlassCard className="p-8 group">
                          <div className="flex items-start justify-between mb-6">
                             <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center group-hover:bg-brand-blue/10 transition-colors">
                                <ShieldAlert style={{ color: threat.color }} size={28} />
                             </div>
                             <div className="text-right">
                                <div className="text-[10px] font-black uppercase tracking-widest text-white/20">Evasion Risk</div>
                                <div className="text-3xl font-black text-white">{threat.risk}%</div>
                             </div>
                          </div>
                          <h3 className="text-2xl font-black text-white mb-2">{threat.id}</h3>
                          <p className="text-xs text-white/40 font-medium leading-relaxed mb-6">{threat.basis}</p>
                          <div className="flex items-center justify-between pt-6 border-t border-white/5">
                             <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-brand-blue">
                                <Activity size={12} />
                                <span>{threat.transmissibility}/10 Power</span>
                             </div>
                             <ArrowUpRight className="text-white/20 group-hover:text-white transition-colors" size={18} />
                          </div>
                       </GlassCard>
                    </motion.div>
                 ))}
              </div>
           </section>
        </div>

        {/* Sidebar: System Health & Live Feed */}
        <aside className="lg:col-span-4 space-y-8">
           <GlassCard className="p-8">
              <h3 className="text-sm font-black uppercase tracking-widest text-white/60 mb-8">System Health</h3>
              <div className="space-y-6">
                 <HealthItem icon={<Server size={16} />} label="Sequence Pipeline" status="Optimal" color="green-400" />
                 <HealthItem icon={<Cpu size={16} />} label="Neural Inference" status="High Load" color="orange-400" />
                 <HealthItem icon={<Database size={16} />} label="Global Archive Sync" status="99.9%" color="brand-blue" />
                 <HealthItem icon={<Clock size={16} />} label="Last Global Scan" status="4m ago" color="white/40" />
              </div>
           </GlassCard>

           <GlassCard className="p-8 bg-brand-blue/5 border-brand-blue/20">
              <div className="flex items-center justify-between mb-8">
                 <h3 className="text-sm font-black uppercase tracking-widest text-white/60">Live Signal Detection</h3>
                 <span className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
              </div>
              <div className="space-y-6">
                 {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-start space-x-4">
                       <div className="w-1.5 h-10 bg-brand-blue/20 rounded-full shrink-0" />
                       <div>
                          <div className="text-[10px] font-black uppercase tracking-widest text-brand-blue mb-1">Signal Cluster #{4800 + i}</div>
                          <p className="text-xs font-bold text-white/80 line-clamp-1">Novel substitution detected in Southeast Asia.</p>
                          <div className="text-[9px] font-medium text-white/20 uppercase mt-1">2m 42s ago • GISAID Sync</div>
                       </div>
                    </div>
                 ))}
              </div>
              <button className="w-full mt-8 py-4 bg-white/5 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-all flex items-center justify-center space-x-2">
                 <span>Explore Data Stream</span>
                 <ExternalLink size={14} />
              </button>
           </GlassCard>
        </aside>
      </div>
    </div>
  );
}

const HealthItem = ({ icon, label, status, color }: any) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center space-x-3 text-white/40">
      {icon}
      <span className="text-xs font-bold">{label}</span>
    </div>
    <span className={cn("text-[10px] font-black uppercase tracking-widest", `text-${color}`)}>{status}</span>
  </div>
);
