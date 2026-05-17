"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldAlert, 
  Flame, 
  Activity, 
  HelpCircle, 
  Zap, 
  Crosshair,
  BellRing
} from "lucide-react";
import { GlassCard } from "@/components/ui/StatCard";
import confetti from "canvas-confetti";

export default function ThreatsPage() {
  const [hypotheticalScore, setHypotheticalScore] = useState(72);
  const [spikeMutationsCount, setSpikeMutationsCount] = useState(3);
  const [adjuvantEfficacy, setAdjuvantEfficacy] = useState(85);
  const [isSimulating, setIsSimulating] = useState(false);

  const calculateThreatIndex = () => {
    // Basic calculation for threat
    const base = (spikeMutationsCount * 12) + (100 - adjuvantEfficacy);
    return Math.min(10, Math.max(1, parseFloat((base / 15).toFixed(1))));
  };

  const handleSimulate = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      confetti({
        particleCount: 80,
        spread: 60,
        colors: ["#ff003c", "#ff9100", "#00d2ff"]
      });
    }, 1500);
  };

  const threatIndex = calculateThreatIndex();

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center space-x-2 text-brand-blue mb-2">
            <ShieldAlert size={14} className="text-red-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500">Live Warning Portal</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white">
            Threat <span className="text-white/40 block sm:inline">Detection</span>
          </h1>
          <p className="text-white/40 mt-2 font-medium max-w-xl">
            Real-time alerts, early warning indices, and simulation sandboxes for hypothetical mutation sequences.
          </p>
        </div>
      </section>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Dial & Status Screen */}
        <div className="lg:col-span-4">
          <GlassCard className="p-8 border-red-500/20 bg-red-500/[0.02] flex flex-col justify-between min-h-[450px]">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-black text-red-500 uppercase tracking-widest flex items-center">
                  <Flame size={12} className="mr-1 text-red-500" />
                  Primary Early Warning Dial
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              </div>

              <div className="text-center py-10">
                <span className="text-8xl font-black text-white leading-none tracking-tighter">
                  {threatIndex}
                </span>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-red-500 block mt-4">
                  Outbreak Risk Index
                </span>
              </div>
            </div>

            <div className="bg-black/40 border border-white/5 p-5 rounded-2xl">
              <span className="text-[9px] font-black uppercase tracking-widest text-white/30 block mb-2">Platform Recommendation</span>
              <p className="text-xs font-bold text-white/60 leading-relaxed">
                {threatIndex >= 7.0 
                  ? "🔴 CRITICAL THREAT: Trigger vaccine formulation revision immediately. Evasion score has crossed warning boundaries."
                  : "⚠️ ELEVATED ALERT: Closely monitor wastewater ingress data. No emergency adjuvants required at this time."}
              </p>
            </div>
          </GlassCard>
        </div>

        {/* Hypothetical Simulation sandbox */}
        <div className="lg:col-span-8">
          <GlassCard className="p-8 flex flex-col justify-between min-h-[450px]">
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <Crosshair className="text-brand-blue" size={16} />
                <h3 className="text-sm font-black uppercase text-white tracking-widest">Mutation Synthesis Sandbox</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                
                {/* Slider 1 */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-white/50">
                    <label>Spike Mutations Count</label>
                    <span className="text-brand-blue font-mono">{spikeMutationsCount} Residues</span>
                  </div>
                  <input 
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    value={spikeMutationsCount}
                    onChange={(e) => setSpikeMutationsCount(parseInt(e.target.value))}
                    className="w-full accent-brand-blue h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-[8px] text-white/30 block uppercase tracking-wider">Number of concurrent structural residue mutations.</span>
                </div>

                {/* Slider 2 */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-white/50">
                    <label>Neutralizing Adjuvant Efficacy</label>
                    <span className="text-brand-blue font-mono">{adjuvantEfficacy}%</span>
                  </div>
                  <input 
                    type="range"
                    min="10"
                    max="100"
                    step="5"
                    value={adjuvantEfficacy}
                    onChange={(e) => setAdjuvantEfficacy(parseInt(e.target.value))}
                    className="w-full accent-brand-blue h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-[8px] text-white/30 block uppercase tracking-wider">Effectiveness of current clinical antibody vaccines.</span>
                </div>

              </div>
            </div>

            <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-center sm:text-left">
                <span className="text-[9px] font-black uppercase tracking-widest text-white/20 block">Consensus Projection</span>
                <span className="text-lg font-black text-brand-blue">
                  {isSimulating ? "Synthesizing..." : `${(threatIndex * 10).toFixed(0)}% Immune Evasion Efficacy`}
                </span>
              </div>

              <button
                onClick={handleSimulate}
                disabled={isSimulating}
                className="px-10 py-4 bg-brand-blue hover:bg-brand-blue/90 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all hover:scale-105 active:scale-95 flex items-center space-x-2"
              >
                {isSimulating ? (
                  <>
                    <Activity className="animate-spin" size={14} />
                    <span>Analyzing Polymer Structure...</span>
                  </>
                ) : (
                  <>
                    <Zap className="fill-current" size={14} />
                    <span>Run Synthesis Simulation</span>
                  </>
                )}
              </button>
            </div>
          </GlassCard>
        </div>

      </div>
    </div>
  );
}
