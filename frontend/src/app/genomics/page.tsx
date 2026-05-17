"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Database, 
  Search, 
  Dna, 
  Play, 
  CheckCircle2, 
  AlertTriangle,
  UploadCloud
} from "lucide-react";
import { GlassCard } from "@/components/ui/StatCard";
import confetti from "canvas-confetti";

interface GenomicRow {
  lineage: string;
  family: string;
  nucleotides: string;
  mutationsCount: number;
  origin: string;
  evasionLevel: "HIGH" | "MEDIUM" | "LOW";
}

const MOCK_GENOMICS: GenomicRow[] = [
  { lineage: "JN.1-V5", family: "Omicron BA.2.86", nucleotides: "ATG-GCT-TTA-CGA-GTA-CCC-GAT", mutationsCount: 36, origin: "Denmark", evasionLevel: "HIGH" },
  { lineage: "XBB.1.5", family: "Omicron Recombinant", nucleotides: "ATG-GCT-TTA-CGA-GTA-CCC-TTA", mutationsCount: 32, origin: "USA", evasionLevel: "HIGH" },
  { lineage: "EG.5.1", family: "Omicron XBB.1.9.2", nucleotides: "ATG-GCT-TTA-CGA-GTA-CCA-GAT", mutationsCount: 29, origin: "China", evasionLevel: "MEDIUM" },
  { lineage: "BA.2", family: "Omicron Variant", nucleotides: "ATG-GCT-TTA-CGA-GTA-CAC-GAT", mutationsCount: 24, origin: "South Africa", evasionLevel: "MEDIUM" },
  { lineage: "B.1.617.2", family: "Delta Variant", nucleotides: "ATG-GCT-TTA-CGA-GTT-CCC-GAT", mutationsCount: 18, origin: "India", evasionLevel: "LOW" }
];

export default function GenomicsPage() {
  const [fastaInput, setFastaInput] = useState(">BI-VAC-TEMP-LINEAGE\nATGGCTTTACGAGTACCCGAT...");
  const [isParsing, setIsParsing] = useState(false);
  const [matchLineage, setMatchLineage] = useState<string | null>(null);

  const handleParse = () => {
    if (!fastaInput.trim()) return;
    setIsParsing(true);
    setTimeout(() => {
      setIsParsing(false);
      setMatchLineage("JN.1-V5");
      confetti({
        particleCount: 60,
        spread: 45,
        colors: ["#00d2ff", "#ffffff"]
      });
    }, 1200);
  };

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center space-x-2 text-brand-blue mb-2">
            <Database size={14} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Genomic Library Browser</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white">
            Genomic <span className="text-white/40 block sm:inline">Library</span>
          </h1>
          <p className="text-white/40 mt-2 font-medium max-w-xl">
            Access, browse, and align raw FASTA codon structures with global sequence indices in real-time.
          </p>
        </div>
      </section>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* FASTA Align-er Input */}
        <div className="lg:col-span-5">
          <GlassCard className="p-8 h-full flex flex-col justify-between min-h-[420px]">
            <div className="space-y-4 flex-1">
              <div className="flex items-center space-x-2">
                <UploadCloud className="text-brand-blue" size={16} />
                <h3 className="text-sm font-black uppercase text-white tracking-widest">FASTA Nucleotide Parser</h3>
              </div>

              <textarea 
                value={fastaInput}
                onChange={(e) => setFastaInput(e.target.value)}
                className="w-full h-44 bg-black/40 border border-white/5 rounded-2xl p-4 font-mono text-[10px] text-white/70 placeholder-white/20 focus:border-brand-blue/30 focus:outline-none custom-scrollbar"
                placeholder="Paste FASTA header and nucleotides sequence here..."
              />
            </div>

            <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <span className="text-[8px] font-black uppercase tracking-widest text-white/20 block">Aligned Target Match</span>
                <span className="text-xs font-black text-brand-blue">
                  {isParsing ? "Scanning database..." : matchLineage ? `Matched lineage: ${matchLineage}` : "Ready to align"}
                </span>
              </div>

              <button
                onClick={handleParse}
                disabled={isParsing}
                className="px-8 py-3.5 bg-brand-blue hover:bg-brand-blue/90 text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all hover:scale-105 active:scale-95 flex items-center space-x-2 self-stretch sm:self-auto justify-center"
              >
                <Play className="fill-current" size={12} />
                <span>{isParsing ? "Aligning..." : "Parse & Align"}</span>
              </button>
            </div>
          </GlassCard>
        </div>

        {/* Database List Table */}
        <div className="lg:col-span-7">
          <GlassCard className="p-8 h-full min-h-[420px] flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <Dna className="text-brand-blue" size={16} />
                <h3 className="text-sm font-black uppercase text-white tracking-widest">GISAID Codon Database</h3>
              </div>

              {/* Table */}
              <div className="overflow-x-auto w-full custom-scrollbar">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-[9px] font-black uppercase tracking-widest text-white/30">
                      <th className="pb-3">Lineage</th>
                      <th className="pb-3">Sub-family</th>
                      <th className="pb-3">Mutations</th>
                      <th className="pb-3">Origin</th>
                      <th className="pb-3 text-right">Evasion</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_GENOMICS.map((row) => (
                      <tr key={row.lineage} className="border-b border-white/5 text-[10px] font-black hover:bg-white/[0.02] transition-all">
                        <td className="py-4 text-brand-blue">{row.lineage}</td>
                        <td className="py-4 text-white/60">{row.family}</td>
                        <td className="py-4 text-white/40">{row.mutationsCount} residues</td>
                        <td className="py-4 text-white/40">{row.origin}</td>
                        <td className="py-4 text-right">
                          <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                            row.evasionLevel === "HIGH" ? "bg-red-500/10 text-red-500" :
                            row.evasionLevel === "MEDIUM" ? "bg-orange-500/10 text-orange-500" :
                            "bg-green-500/10 text-green-500"
                          }`}>
                            {row.evasionLevel}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-white/5 pt-4 text-[9px] font-black uppercase tracking-widest text-white/20">
              <span>Displaying 5 of 14,821,092 indexed records</span>
              <span>Updated 5m ago</span>
            </div>
          </GlassCard>
        </div>

      </div>
    </div>
  );
}
