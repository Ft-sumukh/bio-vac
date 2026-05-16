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
  Layers
} from "lucide-react";
import { GlassCard } from "@/components/ui/StatCard";
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
            Benchmarking predictive architectures and visualizing high-dimensional mutation clusters.
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
        {/* Model Benchmarking */}
        <div className="lg:col-span-7">
           <GlassCard className="p-8 h-[550px]">
              <div className="flex items-center justify-between mb-10">
                 <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-white/60">Predictive Feature Analysis</h3>
                    <p className="text-[10px] text-purple-500 font-black mt-1 uppercase tracking-widest">Model: BIVAC-Transformer-v2</p>
                 </div>
                 <Layers size={16} className="text-purple-500" />
              </div>
              <div className="h-[400px] w-full">
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
           </GlassCard>
        </div>

        {/* Mutation Clustering */}
        <div className="lg:col-span-5 space-y-8">
           <GlassCard className="p-8 h-[300px]">
              <div className="flex items-center justify-between mb-6">
                 <h3 className="text-xs font-black uppercase tracking-widest text-white/30">Mutation UMAP (Latent Space)</h3>
                 <Binary size={14} className="text-white/20" />
              </div>
              <div className="h-[200px] w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart>
                       <XAxis type="number" dataKey="x" hide />
                       <YAxis type="number" dataKey="y" hide />
                       <ZAxis type="number" range={[20, 100]} />
                       <Scatter data={clusterData}>
                          {clusterData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.cluster === 0 ? "#00D2FF" : entry.cluster === 1 ? "#A855F7" : "#FF1744"} />
                          ))}
                       </Scatter>
                    </ScatterChart>
                 </ResponsiveContainer>
              </div>
           </GlassCard>

           <div className="grid grid-cols-2 gap-6">
              <StatItem label="Prediction Precision" value="94.2%" color="purple-500" />
              <StatItem label="Training Iterations" value="1.8M" color="brand-blue" />
           </div>
        </div>
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

const StatItem = ({ label, value, color }: any) => (
  <GlassCard className="p-6">
     <div className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-1">{label}</div>
     <div className={cn("text-2xl font-black", `text-${color}`)}>{value}</div>
  </GlassCard>
);
