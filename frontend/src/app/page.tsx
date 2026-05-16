"use client";

import { motion } from "framer-motion";
import { 
  Activity, 
  ShieldAlert, 
  Dna, 
  TrendingUp, 
  Globe, 
  Zap, 
  ArrowUpRight,
  ShieldCheck,
  Target,
  BarChart3,
  Users,
  Database
} from "lucide-react";
import { GlassCard, StatCard } from "@/components/ui/StatCard";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { MOCK_ALERTS, VARIANT_TRACKING_DATA } from "@/lib/mock";
import CollabUnit from "@/components/CollabUnit";
import SocialSentinel from "@/components/SocialSentinel";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  return (
    <div className="space-y-12 pb-20">
      {/* Hero Banner */}
      <section className="relative h-80 rounded-[40px] overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-red-500 to-brand-navy z-0 opacity-90" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30 mix-blend-overlay" />
        
        <div className="relative z-10 h-full flex flex-col justify-center px-12 space-y-4">
          <div className="flex items-center space-x-3">
             <div className="px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full border border-white/30 flex items-center space-x-2">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white">Critical Surveillance Mode</span>
             </div>
             <span className="text-white/40 text-xs font-bold uppercase tracking-widest">Global Status: ELEVATED</span>
          </div>
          
          <h1 className="text-7xl font-black tracking-tighter text-white uppercase leading-none">
            Intelligence <span className="text-white/40">Hub</span>
          </h1>
          
          <div className="flex items-center space-x-12 mt-4">
             <div>
                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-1">Current Threat Index</div>
                <div className="text-5xl font-black text-white flex items-center space-x-2">
                   <span>8.4</span>
                   <ShieldAlert size={32} className="text-white/60" />
                </div>
             </div>
             <div className="h-16 w-px bg-white/10" />
             <div>
                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-1">Active Clusters</div>
                <div className="text-5xl font-black text-white">12</div>
             </div>
             <div className="h-16 w-px bg-white/10" />
             <div className="flex-1 max-w-sm">
                <p className="text-xs font-medium text-white/60 leading-relaxed italic">
                   "Significant reassortment detected in Southeast Asian avian clusters. Model consensus predicts 85% evasion probability."
                </p>
             </div>
          </div>
        </div>
      </section>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard 
          label="Sequences Indexed" 
          value="14,821,092" 
          trend="+1.2M" 
          icon={Database} 
          chartData={VARIANT_TRACKING_DATA} 
        />
        <StatCard 
          label="Viral Families" 
          value="1,402" 
          trend="Stable" 
          icon={Dna} 
          chartData={VARIANT_TRACKING_DATA} 
        />
        <StatCard 
          label="Evasion Signals" 
          value="42" 
          trend="+8 Critical" 
          icon={ShieldAlert} 
          chartData={VARIANT_TRACKING_DATA} 
        />
        <StatCard 
          label="Model Confidence" 
          value="98.4%" 
          trend="+0.2%" 
          icon={Zap} 
          chartData={VARIANT_TRACKING_DATA} 
        />
      </div>

      {/* Mission Control */}
      <section className="space-y-6">
         <div className="flex items-center justify-between px-2">
            <div>
               <h2 className="text-xl font-black uppercase tracking-widest text-white/60 flex items-center">
                  <Users size={20} className="mr-3 text-brand-blue" />
                  Mission Control <span className="mx-2 text-white/20">/</span> <span className="text-white/40 font-bold">Strategy Board</span>
               </h2>
            </div>
         </div>
         <CollabUnit />
      </section>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
           <GlassCard className="p-10 h-full">
              <div className="flex items-center justify-between mb-10">
                 <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-white/60">Global Lineage Frequency</h3>
                    <div className="text-[10px] font-bold text-brand-blue mt-1 uppercase tracking-widest">Real-time Phylodynamics Scan</div>
                 </div>
              </div>
              <div className="h-[350px] w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={VARIANT_TRACKING_DATA}>
                       <defs>
                          <linearGradient id="colorBlue" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="#00D2FF" stopOpacity={0.3}/>
                             <stop offset="95%" stopColor="#00D2FF" stopOpacity={0}/>
                          </linearGradient>
                       </defs>
                       <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                       <XAxis dataKey="name" stroke="#ffffff20" fontSize={10} fontWeight="bold" />
                       <YAxis stroke="#ffffff20" fontSize={10} fontWeight="bold" />
                       <Tooltip 
                          contentStyle={{ backgroundColor: '#050505', border: '1px solid #ffffff10', borderRadius: '16px' }}
                       />
                       <Area type="monotone" dataKey="Omicron" stroke="#00D2FF" strokeWidth={3} fillOpacity={1} fill="url(#colorBlue)" />
                    </AreaChart>
                 </ResponsiveContainer>
              </div>
           </GlassCard>
        </div>

        {/* Live Signal Feed & Social Sentinel */}
        <div className="lg:col-span-4 space-y-8">
           <GlassCard className="p-10">
              <h3 className="text-sm font-black uppercase tracking-widest text-white/60 mb-8 flex items-center">
                 <Target className="text-red-500 mr-2" size={16} />
                 Threat Signal Feed
              </h3>
              <div className="space-y-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                 {MOCK_ALERTS.map((alert, i) => (
                   <motion.div 
                     key={alert.id}
                     initial={{ opacity: 0, x: 20 }}
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ delay: i * 0.1 }}
                     className="p-5 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all group cursor-pointer"
                   >
                      <div className="flex items-center justify-between mb-2">
                         <span className="text-[10px] font-black text-brand-blue uppercase tracking-widest">{alert.id}</span>
                         <span className="text-[9px] font-bold text-white/20 uppercase">{alert.date}</span>
                      </div>
                      <p className="text-xs font-bold text-white/60 line-clamp-2 leading-relaxed">{alert.details}</p>
                   </motion.div>
                 ))}
              </div>
           </GlassCard>
           
           <SocialSentinel />
        </div>
      </div>
    </div>
  );
}
