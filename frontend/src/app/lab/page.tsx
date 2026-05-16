"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Zap, 
  Upload, 
  Dna, 
  ShieldCheck, 
  Target, 
  TrendingUp, 
  Users, 
  AlertTriangle,
  ArrowRight,
  Loader2,
  FileText,
  Microscope
} from "lucide-react";
import { GlassCard } from "@/components/ui/StatCard";
import { cn } from "@/lib/utils";

export default function LabPage() {
  const [isUploading, setIsUploading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [sequence, setSequence] = useState("");

  const handleUpload = async () => {
    if (!sequence) return;
    setIsUploading(true);
    
    // Simulate deep AI analysis
    setTimeout(() => {
      setAnalysisResult({
        lineage: "XBB.1.16-Prime",
        risk_score: 92.4,
        unique_features: {
          antibody_escape: {
            "Neutralization V1": 98,
            "Neutralization V2": 82,
            "Receptor Binding": 95,
            "Structural Integrity": 88
          },
          digital_twins: [
            { group: "Immunocompromised", risk: 96, reactivity: "Critical" },
            { group: "Elderly (75+)", risk: 88, reactivity: "High" },
            { group: "General Pop", risk: 42, reactivity: "Moderate" }
          ],
          future_branches: [
            { mutation: "L452R + E484K", probability: 35, severity: "High" },
            { mutation: "K417N + N501Y", probability: 22, severity: "Medium" }
          ],
          biosafety: "Flagged: Research of Concern motif detected at 122-128bp"
        }
      });
      setIsUploading(false);
    }, 2500);
  };

  return (
    <div className="space-y-10 pb-20">
      <section>
        <div className="flex items-center space-x-2 text-brand-blue mb-2">
          <Microscope size={14} className="fill-current" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">Neural Structural Analysis</span>
        </div>
        <h1 className="text-5xl font-black tracking-tight text-white">AI Research <span className="text-white/40">Lab</span></h1>
        <p className="text-white/40 mt-2 font-medium max-w-xl">
          Advanced genomic simulation engine for predictive evolution and antibody escape profiling.
        </p>
      </section>

      {!analysisResult ? (
        <section className="max-w-4xl">
          <GlassCard className="p-12 border-dashed border-white/10 hover:border-brand-blue/30 transition-colors">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-brand-blue/10 rounded-3xl flex items-center justify-center mb-6">
                <Upload className="text-brand-blue" size={32} />
              </div>
              <h2 className="text-2xl font-black mb-4">Upload Genomic Sequence</h2>
              <p className="text-white/40 mb-8 max-w-md font-medium">
                Drag and drop your FASTA or raw sequence data. Our AI will perform deep structural mapping and evasion profiling.
              </p>
              
              <textarea 
                value={sequence}
                onChange={(e) => setSequence(e.target.value)}
                placeholder="Paste sequence here (e.g. ATGC...)"
                className="w-full h-40 bg-black/40 border border-white/5 rounded-2xl p-6 text-sm font-mono text-white/60 focus:outline-none focus:border-brand-blue/40 mb-6"
              />

              <button 
                onClick={handleUpload}
                disabled={isUploading || !sequence}
                className={cn(
                  "flex items-center space-x-3 px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all",
                  isUploading ? "bg-white/5 text-white/20 cursor-wait" : "bg-brand-blue text-white shadow-lg shadow-brand-blue/20 hover:scale-105 active:scale-95"
                )}
              >
                {isUploading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Analyzing Neural Paths...</span>
                  </>
                ) : (
                  <>
                    <Zap size={16} className="fill-current" />
                    <span>Initiate Deep Analysis</span>
                  </>
                )}
              </button>
            </div>
          </GlassCard>
        </section>
      ) : (
        <AnimatePresence>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {/* Header / Summary */}
            <div className="lg:col-span-12">
               <div className="flex items-end justify-between bg-white/5 border border-white/5 p-8 rounded-[32px]">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                       <span className="text-[10px] font-black uppercase tracking-widest text-brand-blue bg-brand-blue/10 px-3 py-1 rounded-full">New Lineage Detected</span>
                       <span className="text-[10px] font-black uppercase tracking-widest text-red-500 bg-red-500/10 px-3 py-1 rounded-full">High Evasion</span>
                    </div>
                    <h2 className="text-4xl font-black text-white">{analysisResult.lineage}</h2>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Confidence Score</div>
                    <div className="text-5xl font-black font-mono text-brand-blue">98.2%</div>
                  </div>
               </div>
            </div>

            {/* Left Column: Unique Feature 1 & 2 */}
            <div className="lg:col-span-7 space-y-8">
              {/* Unique Feature 1: Antibody Escape Radar (Simulated UI) */}
              <GlassCard className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-brand-blue/10 rounded-2xl text-brand-blue">
                      <Target size={24} />
                    </div>
                    <h3 className="text-lg font-black uppercase tracking-tight">Antibody Escape Profile</h3>
                  </div>
                  <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">3D Neural Projection</span>
                </div>
                
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-6">
                    {Object.entries(analysisResult.unique_features.antibody_escape).map(([key, value]: any) => (
                      <div key={key}>
                        <div className="flex justify-between text-xs font-bold mb-2">
                          <span className="text-white/60">{key}</span>
                          <span className="text-brand-blue">{value}%</span>
                        </div>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${value}%` }}
                            className="h-full bg-brand-blue shadow-[0_0_15px_rgba(0,210,255,0.5)]"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="relative flex items-center justify-center border border-white/5 rounded-3xl bg-black/40 overflow-hidden">
                    {/* Simulated Radar Chart Visualization */}
                    <div className="absolute inset-0 opacity-20 pointer-events-none">
                       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 border border-brand-blue rounded-full animate-pulse" />
                       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 border border-brand-blue/40 rounded-full" />
                       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 border border-brand-blue/20 rounded-full" />
                    </div>
                    <Dna className="text-brand-blue/60 animate-bounce" size={48} />
                  </div>
                </div>
              </GlassCard>

              {/* Unique Feature 2: Digital Twin Reactivity */}
              <GlassCard className="p-8">
                 <div className="flex items-center space-x-4 mb-8">
                    <div className="p-3 bg-purple-500/10 rounded-2xl text-purple-500">
                      <Users size={24} />
                    </div>
                    <h3 className="text-lg font-black uppercase tracking-tight">Digital Twin Reactivity</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {analysisResult.unique_features.digital_twins.map((twin: any) => (
                      <div key={twin.group} className="bg-white/5 border border-white/5 p-6 rounded-3xl">
                        <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-3">{twin.group}</div>
                        <div className="text-2xl font-black text-white mb-2">{twin.risk}%</div>
                        <div className={cn(
                          "text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md inline-block",
                          twin.reactivity === 'Critical' ? "bg-red-500/20 text-red-400" : "bg-purple-500/20 text-purple-400"
                        )}>
                          {twin.reactivity}
                        </div>
                      </div>
                    ))}
                  </div>
              </GlassCard>
            </div>

            {/* Right Column: Unique Feature 3 & 4 */}
            <div className="lg:col-span-5 space-y-8">
               {/* Unique Feature 3: Predictive Evolution */}
               <GlassCard className="p-8 h-full">
                  <div className="flex items-center space-x-4 mb-8">
                    <div className="p-3 bg-orange-500/10 rounded-2xl text-orange-500">
                      <TrendingUp size={24} />
                    </div>
                    <h3 className="text-lg font-black uppercase tracking-tight">Future-Cast Branches</h3>
                  </div>
                  <div className="space-y-6">
                    {analysisResult.unique_features.future_branches.map((branch: any, i: number) => (
                      <div key={i} className="relative pl-8 border-l-2 border-white/5 pb-6 last:pb-0">
                        <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-orange-500 border-4 border-black shadow-[0_0_10px_rgba(255,165,0,0.5)]" />
                        <div className="text-xs font-black text-white mb-1">{branch.mutation}</div>
                        <div className="flex items-center justify-between">
                           <div className="text-[10px] font-medium text-white/40">Probability: {branch.probability}%</div>
                           <span className="text-[8px] font-black uppercase tracking-widest text-orange-400">{branch.severity} Risk</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Unique Feature 4: Biosafety Audit */}
                  <div className="mt-12 pt-8 border-t border-white/5">
                    <div className={cn(
                      "p-6 rounded-[24px] flex items-start space-x-4",
                      analysisResult.unique_features.biosafety.includes('Flagged') 
                        ? "bg-red-500/10 border border-red-500/20" 
                        : "bg-green-500/10 border border-green-500/20"
                    )}>
                      {analysisResult.unique_features.biosafety.includes('Flagged') 
                        ? <AlertTriangle className="text-red-500 shrink-0" size={24} />
                        : <ShieldCheck className="text-green-500 shrink-0" size={24} />
                      }
                      <div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Biosafety & IP Audit</div>
                        <p className="text-xs font-bold text-white leading-relaxed">
                          {analysisResult.unique_features.biosafety}
                        </p>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => setAnalysisResult(null)}
                    className="w-full mt-10 flex items-center justify-center space-x-3 bg-white/5 border border-white/5 hover:bg-white/10 text-white/60 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all"
                  >
                    <span>Analyze New Sequence</span>
                    <ArrowRight size={14} />
                  </button>
               </GlassCard>

               {/* Explainable AI Block */}
               <GlassCard className="bg-brand-blue/5 border-brand-blue/10">
                  <div className="flex items-center space-x-3 mb-4">
                    <FileText className="text-brand-blue" size={20} />
                    <h3 className="text-xs font-black uppercase tracking-widest text-white">Neural Reasoning (XAI)</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 bg-black/40 rounded-xl border border-white/5">
                       <p className="text-[11px] font-medium text-white/60 leading-relaxed italic">
                         "The high risk score is primarily driven by the <span className="text-brand-blue">E484K mutation</span> which disrupts the salt bridge in the RBD, significantly reducing mAB binding affinity while maintaining ACE2 structural stability."
                       </p>
                    </div>
                    <div className="flex items-center justify-between px-2">
                       <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Model: BioLLM-v4-Structural</span>
                       <span className="text-[9px] font-black text-brand-blue uppercase tracking-widest cursor-pointer hover:underline">Full Trace</span>
                    </div>
                  </div>
               </GlassCard>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
