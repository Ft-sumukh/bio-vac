"use client";

import { motion } from "framer-motion";
import { Globe, Map, Target, AlertCircle } from "lucide-react";
import { GlassCard } from "@/components/ui/StatCard";

export default function SurveillancePage() {
  return (
    <div className="space-y-10 pb-20">
      <section>
        <div className="flex items-center space-x-2 text-brand-blue mb-2">
          <Globe size={14} className="fill-current" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">Real-time Geospatial Intelligence</span>
        </div>
        <h1 className="text-5xl font-black tracking-tight text-white">Global <span className="text-white/40">Surveillance</span></h1>
      </section>

      <GlassCard className="h-[600px] flex items-center justify-center border-brand-blue/10">
        {/* Placeholder for Interactive Map */}
        <div className="text-center">
          <div className="relative inline-block mb-8">
            <Globe size={120} className="text-brand-blue/20 animate-spin-slow" />
            <motion.div 
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute inset-0 bg-brand-blue/10 blur-3xl rounded-full" 
            />
          </div>
          <h2 className="text-2xl font-black mb-2">Interactive Outbreak Engine</h2>
          <p className="text-white/40 max-w-sm mx-auto font-medium">
            Visualizing structural shift clusters across 142 territories. 
            Real-time heatmapping active for XBB.1.5 and H5N1-V2 lineages.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
             <button className="bg-brand-blue text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest">
                Initialize Vector Map
             </button>
             <button className="bg-white/5 border border-white/5 text-white/60 px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-white/10">
                Switch Projection
             </button>
          </div>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-[32px] flex items-center space-x-6">
           <AlertCircle className="text-red-500" size={32} />
           <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-red-500/60 mb-1">Critical Hotspot</div>
              <div className="text-xl font-black text-white">Berlin Metropolitan Area</div>
           </div>
        </div>
        <div className="bg-brand-blue/10 border border-brand-blue/20 p-8 rounded-[32px] flex items-center space-x-6">
           <Map className="text-brand-blue" size={32} />
           <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-brand-blue/60 mb-1">New Clusters</div>
              <div className="text-xl font-black text-white">Southeast Asia (12)</div>
           </div>
        </div>
        <div className="bg-purple-500/10 border border-purple-500/20 p-8 rounded-[32px] flex items-center space-x-6">
           <Target className="text-purple-500" size={32} />
           <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-purple-500/60 mb-1">Target Match</div>
              <div className="text-xl font-black text-white">88% Adjuvant Overlay</div>
           </div>
        </div>
      </div>
    </div>
  );
}
