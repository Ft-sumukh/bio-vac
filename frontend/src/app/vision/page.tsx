"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Eye, 
  Camera, 
  RefreshCw, 
  Activity, 
  Cpu, 
  ShieldCheck, 
  AlertTriangle,
  Grid
} from "lucide-react";
import { GlassCard } from "@/components/ui/StatCard";

export default function VisionPage() {
  const [isScanning, setIsScanning] = useState(true);
  const [scanSpeed, setScanSpeed] = useState(42);
  const [confidence, setConfidence] = useState(98.6);
  const [logs, setLogs] = useState<string[]>([
    "SYS: Optical scanner initialized.",
    "OCR: Calibrating neural layer V3...",
    "OCR: Standby for camera input streams..."
  ]);

  // Simulating live OCR streaming logs
  useEffect(() => {
    if (!isScanning) return;
    const interval = setInterval(() => {
      const msgs = [
        "SYS: Streaming genomic frames [24fps]...",
        "OCR: Identified segment helix codon sequence 'ATG-GCT-TTA'",
        "ALIGN: Matched with GISAID lineage lineage JN.1 (99.1% match)",
        "WARN: Point mutation detected: S:N501Y",
        "WARN: Escape potential recalculated to elevated danger index (8.4/10)",
        "SYS: Cache buffer synchronized with backend early-warning matrix"
      ];
      setLogs(prev => [...prev.slice(-8), msgs[Math.floor(Math.random() * msgs.length)]]);
      setConfidence(c => Math.min(99.9, Math.max(97.2, c + (Math.random() * 0.4 - 0.2))));
      setScanSpeed(s => Math.min(60, Math.max(30, s + Math.floor(Math.random() * 6 - 3))));
    }, 2000);
    return () => clearInterval(interval);
  }, [isScanning]);

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center space-x-2 text-brand-blue mb-2">
            <Eye size={14} className="animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Optical Sequence OCR</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white">
            Neural <span className="text-white/40 block sm:inline">Vision Unit</span>
          </h1>
          <p className="text-white/40 mt-2 font-medium max-w-xl">
            Real-time computer vision and OCR pipelines targeting physical gel electrophoresis and molecular sequencing files.
          </p>
        </div>

        <button 
          onClick={() => setIsScanning(!isScanning)}
          className={`px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
            isScanning 
              ? "bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:bg-red-600" 
              : "bg-brand-blue text-white shadow-[0_0_20px_rgba(0,210,255,0.3)] hover:bg-brand-blue/90"
          }`}
        >
          {isScanning ? "Deactivate Feed" : "Activate Scanner"}
        </button>
      </section>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Scanner HUD view */}
        <div className="lg:col-span-8">
          <GlassCard className="p-0 relative overflow-hidden bg-black/70 border-brand-blue/20 min-h-[500px] flex flex-col justify-between">
            {/* Overlay Scanner Bars */}
            {isScanning && (
              <div className="absolute inset-0 pointer-events-none z-10">
                <div className="absolute top-8 left-8 w-8 h-8 border-t-2 border-l-2 border-brand-blue" />
                <div className="absolute top-8 right-8 w-8 h-8 border-t-2 border-r-2 border-brand-blue" />
                <div className="absolute bottom-8 left-8 w-8 h-8 border-b-2 border-l-2 border-brand-blue" />
                <div className="absolute bottom-8 right-8 w-8 h-8 border-b-2 border-r-2 border-brand-blue" />
                <motion.div 
                  animate={{ top: ["0%", "100%"] }} 
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="absolute left-0 right-0 h-0.5 bg-brand-blue/40 shadow-[0_0_15px_rgba(0,210,255,1)]" 
                />
              </div>
            )}

            {/* Viewport Frame */}
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-6">
              <Camera size={64} className={isScanning ? "text-brand-blue animate-pulse" : "text-white/10"} />
              <div className="space-y-2">
                <h3 className="text-xl font-black uppercase text-white tracking-wider">
                  {isScanning ? "SURVEILLANCE OPTICAL GRID ACTIVE" : "VISION SCANNER OFFLINE"}
                </h3>
                <p className="text-xs text-white/40 uppercase font-black tracking-widest">
                  {isScanning ? "Streaming live raster coordinates" : "Awaiting activation stimulus"}
                </p>
              </div>

              {/* Grid Simulator */}
              {isScanning && (
                <div className="w-full max-w-md h-32 border border-white/5 bg-white/[0.01] rounded-2xl flex items-center justify-center p-4 relative overflow-hidden">
                  <div className="absolute inset-0 grid grid-cols-6 gap-2 p-3 opacity-20">
                    {Array.from({ length: 24 }).map((_, i) => (
                      <div key={i} className="bg-brand-blue rounded-md animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
                    ))}
                  </div>
                  <span className="relative z-10 font-mono text-[10px] font-black text-brand-blue uppercase tracking-widest">
                    ALIGNING HELIX POLYMER SEQUENCES...
                  </span>
                </div>
              )}
            </div>

            {/* Performance Indicators bottom bar */}
            <div className="bg-black/50 border-t border-white/5 p-6 grid grid-cols-3 gap-6">
              <div>
                <span className="text-[9px] font-black text-white/20 uppercase tracking-widest block">Response Latency</span>
                <span className="text-lg font-mono font-black text-brand-blue">{scanSpeed}ms</span>
              </div>
              <div>
                <span className="text-[9px] font-black text-white/20 uppercase tracking-widest block">Core Model Confidence</span>
                <span className="text-lg font-mono font-black text-brand-blue">{confidence.toFixed(2)}%</span>
              </div>
              <div>
                <span className="text-[9px] font-black text-white/20 uppercase tracking-widest block">Status Code</span>
                <span className="text-lg font-mono font-black text-green-500 uppercase">SYS_SECURE</span>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Live Stream Terminal Logs */}
        <div className="lg:col-span-4 space-y-6">
          <GlassCard className="p-8 h-[500px] flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <Cpu className="text-brand-blue" size={16} />
                <h3 className="text-xs font-black uppercase text-white tracking-widest">Inference Matrix Log</h3>
              </div>

              <div className="space-y-3 font-mono text-[9px] text-white/50 bg-black/40 p-4 border border-white/5 rounded-2xl h-80 overflow-y-auto custom-scrollbar">
                {logs.map((log, i) => (
                  <div key={i} className="leading-relaxed hover:text-white transition-colors">
                    <span className="text-brand-blue/60 mr-2">&gt;&gt;</span>
                    {log}
                  </div>
                ))}
              </div>
            </div>

            <button 
              onClick={() => setLogs(["SYS: Matrix logger reset.", "OCR: Standing by..."])}
              className="w-full py-4 border border-white/5 hover:border-brand-blue/30 text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-brand-blue rounded-2xl transition-all"
            >
              Clear Live Cache
            </button>
          </GlassCard>
        </div>

      </div>
    </div>
  );
}
