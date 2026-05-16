"use client";

import { motion } from "framer-motion";
import { 
  Zap, 
  Cpu, 
  Activity, 
  BarChart, 
  Search, 
  Sparkles,
  BookOpen,
  ArrowUpRight,
  TrendingUp,
  BrainCircuit,
  Binary,
  Layers,
  Maximize2
} from "lucide-react";
import { GlassCard } from "@/components/ui/StatCard";
import ProteinViewer from "@/components/ProteinViewer";
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  Cell
} from 'recharts';
import { cn } from "@/lib/utils";

const radarData = [
  { subject: 'Transmissibility', A: 120, B: 110, fullMark: 150 },
  { subject: 'Evasion', A: 98, B: 130, fullMark: 150 },
  { subject: 'Stability', A: 86, B: 130, fullMark: 150 },
  { subject: 'Affinity', A: 99, B: 100, fullMark: 150 },
  { subject: 'Virulence', A: 85, B: 90, fullMark: 150 },
];

const clusterData = Array.from({ length: 50 }, (_, i) => ({
  x: Math.random() * 100,
  y: Math.random() * 100,
  z: Math.random() * 100,
  cluster: Math.floor(Math.random() * 3)
}));

export default function AIResearchPage() {
  return (
    <div className="space-y-10 pb-20">
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 text-purple-500 mb-2">
            <BrainCircuit size={14} className="fill-current" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Advanced Neural Modeling Lab</span>
          </div>
          <h1 className="text-5xl font-black tracking-tight text-white">Research <span className="text-white/40">Lab</span></h1>
          <p className="text-white/40 mt-2 font-medium max-w-xl">
            Benchmarking predictive architectures and visualizing high-dimensional mutation clusters in 3D.
          </p>
        </div>

        <div className="flex items-center space-x-4">
           <button className="flex items-center space-x-2 px-6 py-3.5 bg-purple-600 text-white rounded-xl shadow-lg shadow-purple-600/20 hover:scale-105 transition-all">
              <Sparkles size={18} />
              <span className="text-xs font-black uppercase tracking-widest">Run Prediction</span>
           </button>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 3D Protein Viewer - The "Wow" Factor */}
        <div className="lg:col-span-8">
           <GlassCard className="p-0 h-[600px] overflow-hidden">
              <ProteinViewer />
           </GlassCard>
        </div>

        {/* Predictive Metrics */}
        <div className="lg:col-span-4 flex flex-col gap-8">
           <GlassCard className="p-8 flex-1">
              <div className="flex items-center justify-between mb-8">
                 <h3 className="text-sm font-black uppercase tracking-widest text-white/60">Molecular Benchmarks</h3>
                 <Layers size={16} className="text-purple-500" />
              </div>
              <div className="h-[250px] w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                       <PolarGrid stroke="#ffffff10" />
                       <PolarAngleAxis dataKey="subject" stroke="#ffffff40" fontSize={10} fontWeight="bold" />
                       <PolarRadiusAxis hide />
                       <Radar name="Wild-Type" dataKey="A" stroke="#00D2FF" fill="#00D2FF" fillOpacity={0.1} />
                       <Radar name="JN.1-V5" dataKey="B" stroke="#A855F7" fill="#A855F7" fillOpacity={0.4} />
                    </RadarChart>
                 </ResponsiveContainer>
              </div>
              <div className="mt-8 space-y-4">
                 <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                    <span className="text-white/20">Model Confidence</span>
                    <span className="text-purple-500">97.8%</span>
                 </div>
                 <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500" style={{ width: '97.8%' }} />
                 </div>
              </div>
           </GlassCard>

           <GlassCard className="p-8">
              <div className="flex items-center justify-between mb-6">
                 <h3 className="text-xs font-black uppercase tracking-widest text-white/30">Latency / Compute</h3>
                 <Cpu size={14} className="text-white/20" />
              </div>
              <div className="space-y-6">
                 <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white/60">TPU Cluster V4-128</span>
                    <span className="text-xs font-black text-green-400">ONLINE</span>
                 </div>
                 <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white/60">Mean Inference</span>
                    <span className="text-xs font-black text-brand-blue">142ms</span>
                 </div>
              </div>
           </GlassCard>
        </div>
      </div>

      {/* Latent Space Clusters */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <GlassCard className="lg:col-span-2 p-10 h-[400px]">
            <div className="flex items-center justify-between mb-10">
               <div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-white/60">Viral Evolution Latent Space (UMAP)</h3>
                  <div className="text-[10px] font-bold text-brand-blue mt-1 uppercase tracking-widest">Cluster density: High</div>
               </div>
               <Binary size={16} className="text-brand-blue" />
            </div>
            <div className="h-[250px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart>
                     <XAxis type="number" dataKey="x" hide />
                     <YAxis type="number" dataKey="y" hide />
                     <ZAxis type="number" range={[20, 100]} />
                     <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                     <Scatter data={clusterData}>
                        {clusterData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.cluster === 0 ? "#00D2FF" : entry.cluster === 1 ? "#A855F7" : "#FF1744"} />
                        ))}
                     </Scatter>
                  </ScatterChart>
               </ResponsiveContainer>
            </div>
         </GlassCard>

         <GlassCard className="p-10 flex flex-col justify-center">
            <h3 className="text-lg font-black text-white mb-4">Neural Architecture</h3>
            <p className="text-xs text-white/40 leading-relaxed mb-8">
               Our proprietary **Bio-Transformer v4** uses multi-head cross-attention to weigh structural shifts against historic evasion patterns.
            </p>
            <button className="w-full py-4 bg-white/5 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white/60 hover:bg-white/10 transition-all">
               View Architecture Diagram
            </button>
         </GlassCard>
      </div>
    </div>
  );
}
