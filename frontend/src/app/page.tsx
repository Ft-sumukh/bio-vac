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
  Users
} from "lucide-react";
import { GlassCard, StatCard } from "@/components/ui/StatCard";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { MOCK_ALERTS, MOCK_TARGETS, VARIANT_TRACKING_DATA } from "@/lib/mock";
import CollabUnit from "@/components/CollabUnit";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  return (
    <div className="space-y-12 pb-20">
      {/* Hero Banner - Strategic Threat Level */}
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
        
        {/* Animated Background Pulse */}
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" />
      </section>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard 
          title="Sequences Indexed" 
          value="14,821,092" 
          trend="+1.2M" 
          icon={<Database className="text-brand-blue" />} 
          chartData={VARIANT_TRACKING_DATA} 
        />
        <StatCard 
          title="Viral Families" 
          value="1,402" 
          trend="Stable" 
          icon={<Dna className="text-purple-500" />} 
          chartData={VARIANT_TRACKING_DATA} 
        />
        <StatCard 
          title="Evasion Signals" 
          value="42" 
          trend="+8 Critical" 
          icon={<ShieldAlert className="text-red-500" />} 
          chartData={VARIANT_TRACKING_DATA} 
        />
        <StatCard 
          title="Model Confidence" 
          value="98.4%" 
          trend="+0.2%" 
          icon={<Zap className="text-brand-blue" />} 
          chartData={VARIANT_TRACKING_DATA} 
        />
      </div>

      {/* Mission Control: Collaborative Strategy Board */}
      <section className="space-y-6">
         <div className="flex items-center justify-between px-2">
            <div>
               <h2 className="text-xl font-black uppercase tracking-widest text-white/60 flex items-center">
                  <Users size={20} className="mr-3 text-brand-blue" />
                  Mission Control <span className="mx-2 text-white/20">/</span> <span className="text-white/40 font-bold">Strategy Board</span>
               </h2>
               <p className="text-[10px] font-black uppercase text-white/20 tracking-widest mt-1">Real-time cross-institutional collaboration active</p>
            </div>
            <div className="flex items-center space-x-3">
               <button className="px-6 py-3 bg-white/5 border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-all">Join Live Session</button>
               <button className="px-6 py-3 bg-brand-blue text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-brand-blue/20 hover:scale-105 transition-all">Host Mission</button>
            </div>
         </div>
         <CollabUnit />
      </section>

      {/* Main Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Evolutionary Phylodynamics */}
        <div className="lg:col-span-8">
           <GlassCard className="p-10 h-[500px]">
              <div className="flex items-center justify-between mb-10">
                 <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-white/60">Global Lineage Frequency</h3>
                    <div className="text-[10px] font-bold text-brand-blue mt-1 uppercase tracking-widest">Real-time Phylodynamics Scan</div>
                 </div>
                 <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                       <span className="w-2 h-2 bg-brand-blue rounded-full" />
                       <span className="text-[10px] font-black text-white/40 uppercase">Omicron</span>
                    </div>
                    <div className="flex items-center space-x-2">
                       <span className="w-2 h-2 bg-purple-500 rounded-full" />
                       <span className="text-[10px] font-black text-white/40 uppercase">JN.1</span>
                    </div>
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
                          <linearGradient id="colorPurple" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="#A855F7" stopOpacity={0.3}/>
                             <stop offset="95%" stopColor="#A855F7" stopOpacity={0}/>
                          </linearGradient>
                       </defs>
                       <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                       <XAxis dataKey="name" stroke="#ffffff20" fontSize={10} fontWeight="bold" />
                       <YAxis stroke="#ffffff20" fontSize={10} fontWeight="bold" />
                       <Tooltip 
                          contentStyle={{ backgroundColor: '#050505', border: '1px solid #ffffff10', borderRadius: '16px' }}
                          itemStyle={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase' }}
                       />
                       <Area type="monotone" dataKey="Omicron" stroke="#00D2FF" strokeWidth={3} fillOpacity={1} fill="url(#colorBlue)" />
                       <Area type="monotone" dataKey="JN1" stroke="#A855F7" strokeWidth={3} fillOpacity={1} fill="url(#colorPurple)" />
                    </AreaChart>
                 </ResponsiveContainer>
              </div>
           </GlassCard>
        </div>

        {/* Live Signal Feed */}
        <div className="lg:col-span-4">
           <GlassCard className="p-10 h-full flex flex-col">
              <h3 className="text-sm font-black uppercase tracking-widest text-white/60 mb-8 flex items-center">
                 <Target className="text-red-500 mr-2" size={16} />
                 Threat Signal Feed
              </h3>
              <div className="flex-1 space-y-6 overflow-y-auto pr-2 custom-scrollbar">
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
                      <div className="mt-4 flex items-center justify-between">
                         <div className="flex items-center space-x-2">
                            <ShieldAlert size={12} className="text-red-500" />
                            <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">{alert.risk}% RISK</span>
                         </div>
                         <ArrowUpRight size={14} className="text-white/10 group-hover:text-white transition-colors" />
                      </div>
                   </motion.div>
                 ))}
              </div>
              <button className="w-full py-5 bg-white/5 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-all mt-8">
                 Access Global Signal Archive
              </button>
           </GlassCard>
        </div>
      </div>
    </div>
  );
}

const Database = ({ className }: { className?: string }) => (
  <svg 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M3 5V19A9 3 0 0 0 21 19V5" />
    <path d="M3 12A9 3 0 0 0 21 12" />
  </svg>
);
