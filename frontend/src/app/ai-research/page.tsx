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
import NeuralExplainability from "@/components/NeuralExplainability";
import Leaderboard from "@/components/Leaderboard";
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
        {/* 3D Protein Viewer */}
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

      {/* AI Transparency & Engagement Unit */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <NeuralExplainability />
         <Leaderboard />
      </div>

      {/* Research Paper Carousel */}
      <section className="space-y-6">
         <h2 className="text-xl font-black uppercase tracking-widest text-white/60">Latest Biological Intelligence</h2>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Convergent Evolution of SARS-CoV-2", author: "Dr. A. Smith et al.", journal: "Nature Biotech", date: "Mar 2024" },
              { title: "Deep Learning for Evasion Prediction", author: "BIVAC AI Team", journal: "Lancet ID", date: "Apr 2024" },
              { title: "Structural Basis of H5N1 Adaptation", author: "University of Zurich", journal: "Cell Reports", date: "May 2024" },
            ].map((paper, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="group"
              >
                <GlassCard className="p-8 border-white/5 hover:border-purple-500/30 transition-all cursor-pointer">
                   <div className="flex items-center justify-between mb-6">
                      <BookOpen size={24} className="text-purple-500/40 group-hover:text-purple-500 transition-colors" />
                      <ArrowUpRight size={18} className="text-white/10 group-hover:text-white" />
                   </div>
                   <h3 className="text-lg font-black text-white leading-tight mb-4">{paper.title}</h3>
                   <div className="flex items-center justify-between">
                      <div>
                         <div className="text-[10px] font-black uppercase tracking-widest text-white/20">Authors</div>
                         <div className="text-xs font-bold text-white/60">{paper.author}</div>
                      </div>
                      <div className="text-right">
                         <div className="text-[10px] font-black uppercase tracking-widest text-purple-500/60">{paper.journal}</div>
                         <div className="text-[9px] font-bold text-white/20">{paper.date}</div>
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
