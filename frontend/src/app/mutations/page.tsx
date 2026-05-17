"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Activity, 
  Search, 
  TrendingUp, 
  TrendingDown, 
  AlertCircle, 
  Filter,
  ShieldAlert
} from "lucide-react";
import { GlassCard } from "@/components/ui/StatCard";
import { cn } from "@/lib/utils";

interface MutationItem {
  id: string;
  residue: string;
  variant: string;
  escapeScore: number;
  frequency: number;
  threatLevel: "CRITICAL" | "SEVERE" | "ELEVATED";
  trend: "UP" | "DOWN" | "STABLE";
}

const MOCK_MUTATIONS: MutationItem[] = [
  { id: "M01", residue: "Spike E484K", variant: "JN.1-V5", escapeScore: 92, frequency: 14.8, threatLevel: "CRITICAL", trend: "UP" },
  { id: "M02", residue: "Spike N501Y", variant: "JN.1-V2", escapeScore: 88, frequency: 28.4, threatLevel: "CRITICAL", trend: "UP" },
  { id: "M03", residue: "Spike L452R", variant: "XBB.1.5", escapeScore: 76, frequency: 8.2, threatLevel: "SEVERE", trend: "DOWN" },
  { id: "M04", residue: "Spike F486S", variant: "EG.5", escapeScore: 68, frequency: 32.1, threatLevel: "ELEVATED", trend: "STABLE" },
  { id: "M05", residue: "Spike K417N", variant: "BA.2.86", escapeScore: 84, frequency: 4.6, threatLevel: "SEVERE", trend: "UP" },
  { id: "M06", residue: "Spike T478K", variant: "Delta-B", escapeScore: 59, frequency: 0.8, threatLevel: "ELEVATED", trend: "DOWN" }
];

export default function MutationsPage() {
  const [filter, setFilter] = useState<string>("ALL");
  const [search, setSearch] = useState<string>("");

  const filteredMutations = MOCK_MUTATIONS.filter(item => {
    const matchesSearch = item.residue.toLowerCase().includes(search.toLowerCase()) || 
                          item.variant.toLowerCase().includes(search.toLowerCase());
    if (filter === "ALL") return matchesSearch;
    return matchesSearch && item.threatLevel === filter;
  });

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center space-x-2 text-brand-blue mb-2">
            <Activity size={14} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Surveillance Database</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white">
            Mutation <span className="text-white/40 block sm:inline">Analytics</span>
          </h1>
          <p className="text-white/40 mt-2 font-medium max-w-xl">
            Live catalog tracking molecular lineage variations, immune evasion scores, and frequency thresholds.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={14} />
            <input 
              type="text"
              placeholder="Search mutations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-white/35 focus:border-brand-blue/30 focus:outline-none transition-all w-48"
            />
          </div>

          <div className="flex items-center space-x-2 bg-white/5 border border-white/5 p-1 rounded-xl">
            {["ALL", "CRITICAL", "SEVERE"].map(t => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={cn(
                  "px-3.5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all",
                  filter === t ? "bg-brand-blue text-black font-black" : "text-white/40 hover:text-white"
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence>
          {filteredMutations.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <GlassCard className="p-8 border-white/5 hover:border-brand-blue/30 transition-all flex flex-col justify-between min-h-[250px]">
                <div className="space-y-4">
                  {/* Header Row */}
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-brand-blue uppercase tracking-widest">{item.id}</span>
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest",
                      item.threatLevel === "CRITICAL" ? "bg-red-500/20 text-red-500 border border-red-500/30" :
                      item.threatLevel === "SEVERE" ? "bg-orange-500/20 text-orange-500 border border-orange-500/30" :
                      "bg-amber-500/20 text-amber-500 border border-amber-500/30"
                    )}>
                      {item.threatLevel}
                    </span>
                  </div>

                  {/* Description */}
                  <div>
                    <h3 className="text-xl font-black text-white uppercase tracking-tight">{item.residue}</h3>
                    <div className="text-[10px] font-bold text-white/40 uppercase block mt-1">Lineage Target: {item.variant}</div>
                  </div>

                  {/* Meters */}
                  <div className="space-y-3 pt-2">
                    {/* Escape Score Meter */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[9px] font-black uppercase tracking-wider">
                        <span className="text-white/40">Evasion Escape Score</span>
                        <span className="text-brand-blue">{item.escapeScore}%</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-brand-blue rounded-full" style={{ width: `${item.escapeScore}%` }} />
                      </div>
                    </div>

                    {/* Global Frequency Meter */}
                    <div className="flex justify-between text-[9px] font-black uppercase tracking-wider pt-1">
                      <span className="text-white/40">Global Frequency</span>
                      <span className="text-white/80">{item.frequency}%</span>
                    </div>
                  </div>
                </div>

                {/* Trend Footer */}
                <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-4">
                  <div className="flex items-center space-x-2">
                    {item.trend === "UP" ? <TrendingUp className="text-red-500" size={14} /> :
                     item.trend === "DOWN" ? <TrendingDown className="text-green-500" size={14} /> :
                     <Activity className="text-white/20" size={14} />}
                    <span className="text-[9px] font-black uppercase tracking-widest text-white/40">
                      Trend: {item.trend}
                    </span>
                  </div>

                  <span className="text-[8px] font-bold uppercase text-white/20">Updated 10m ago</span>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredMutations.length === 0 && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-center space-y-4">
            <AlertCircle className="text-white/10" size={48} />
            <h3 className="text-lg font-black text-white uppercase">No mutations matched</h3>
            <p className="text-xs text-white/30 uppercase font-black tracking-widest">Adjust filters or keyword criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}
