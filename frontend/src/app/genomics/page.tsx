"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Database, 
  Search, 
  Filter, 
  Download, 
  ExternalLink,
  Calendar,
  MapPin,
  Tag,
  Dna,
  CheckCircle2,
  AlertCircle,
  FileJson,
  FileCode,
  X,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { GlassCard } from "@/components/ui/StatCard";
import { MOCK_LIBRARY, VIRAL_FAMILIES } from "@/lib/data-generator";
import { cn } from "@/lib/utils";

export default function GenomicsPage() {
  const [search, setSearch] = useState("");
  const [selectedFamily, setSelectedFamily] = useState("All");
  const [selectedSequence, setSelectedSequence] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredData = useMemo(() => {
    return MOCK_LIBRARY.filter(item => {
      const matchesSearch = item.id.toLowerCase().includes(search.toLowerCase()) || 
                           item.location.toLowerCase().includes(search.toLowerCase()) ||
                           item.gisaidAccession.toLowerCase().includes(search.toLowerCase());
      const matchesFamily = selectedFamily === "All" || item.viralFamily === selectedFamily;
      return matchesSearch && matchesFamily;
    });
  }, [search, selectedFamily]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-10 pb-20">
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 text-brand-blue mb-2">
            <Database size={14} className="fill-current" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Global Genomic Archive</span>
          </div>
          <h1 className="text-5xl font-black tracking-tight text-white">Sequence <span className="text-white/40">Browser</span></h1>
          <p className="text-white/40 mt-2 font-medium max-w-xl">
            Access, filter, and analyze over 14.8 million high-quality genomic records from global contributing labs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-brand-blue transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search Accession, ID, or Location..." 
              className="bg-white/5 border border-white/5 pl-12 pr-6 py-3.5 rounded-xl w-[350px] text-sm font-bold focus:outline-none focus:border-brand-blue/50 focus:bg-white/10 transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="flex items-center space-x-2 px-6 py-3.5 bg-brand-blue text-white rounded-xl shadow-lg shadow-brand-blue/20 hover:scale-105 transition-all">
            <Download size={18} />
            <span className="text-xs font-black uppercase tracking-widest">Bulk Export</span>
          </button>
        </div>
      </section>

      {/* Filters Bar */}
      <div className="flex items-center space-x-6 overflow-x-auto pb-2">
         {["All", ...VIRAL_FAMILIES].map((f) => (
           <button 
             key={f}
             onClick={() => { setSelectedFamily(f); setCurrentPage(1); }}
             className={cn(
               "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border",
               selectedFamily === f ? "bg-brand-blue/10 text-brand-blue border-brand-blue/30" : "bg-white/5 text-white/40 border-white/5 hover:border-white/10"
             )}
           >
             {f}
           </button>
         ))}
      </div>

      {/* Main Table Content */}
      <GlassCard className="overflow-hidden p-0 border-white/5 bg-black/40">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/40">Sequence ID / Accession</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/40">Viral Family / Clade</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/40">Geographic Origin</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/40">Collection Date</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/40 text-center">QC Score</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/40 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row, i) => (
                <motion.tr 
                  key={row.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => setSelectedSequence(row)}
                  className="border-b border-white/5 hover:bg-white/[0.03] transition-colors group cursor-pointer"
                >
                  <td className="px-8 py-6">
                    <div className="space-y-1">
                       <div className="text-sm font-black text-white">{row.id}</div>
                       <div className="text-[10px] font-bold text-white/20 font-mono tracking-tighter">{row.gisaidAccession}</div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-1">
                       <div className="text-xs font-bold text-white/80">{row.viralFamily}</div>
                       <div className="text-[10px] font-black text-brand-blue uppercase tracking-widest">{row.clade}</div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-2">
                       <MapPin size={12} className="text-red-400" />
                       <span className="text-xs font-bold text-white/60">{row.location}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-2 text-xs font-bold text-white/40">
                       <Calendar size={12} />
                       <span>{row.collectionDate}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col items-center">
                       <div className={cn(
                         "text-xs font-black",
                         row.qcScore > 90 ? "text-green-400" : "text-brand-blue"
                       )}>{row.qcScore}%</div>
                       <div className="w-12 h-1 bg-white/5 rounded-full mt-1 overflow-hidden">
                          <div className={cn("h-full", row.qcScore > 90 ? "bg-green-400" : "bg-brand-blue")} style={{ width: `${row.qcScore}%` }} />
                       </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="p-3 bg-white/5 rounded-xl hover:bg-brand-blue hover:text-white transition-all opacity-0 group-hover:opacity-100">
                       <Maximize2 size={16} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Controls */}
        <div className="p-8 bg-white/[0.01] border-t border-white/5 flex items-center justify-between">
           <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest">
             Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} records
           </div>
           <div className="flex items-center space-x-4">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2.5 bg-white/5 border border-white/5 rounded-xl text-white/40 hover:text-white transition-all disabled:opacity-30"
              >
                 <ChevronLeft size={20} />
              </button>
              <div className="text-[10px] font-black text-white px-4">PAGE {currentPage} OF {totalPages}</div>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2.5 bg-white/5 border border-white/5 rounded-xl text-white/40 hover:text-white transition-all disabled:opacity-30"
              >
                 <ChevronRight size={20} />
              </button>
           </div>
        </div>
      </GlassCard>

      {/* Detailed Sequence Modal */}
      <AnimatePresence>
         {selectedSequence && (
           <div className="fixed inset-0 z-[100] flex items-center justify-center p-10">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedSequence(null)}
                className="absolute inset-0 bg-black/90 backdrop-blur-xl"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative z-10 w-full max-w-4xl bg-[#050505] border border-white/10 rounded-[40px] shadow-2xl overflow-hidden"
              >
                 <div className="h-2 bg-gradient-to-r from-brand-blue via-purple-500 to-red-500 w-full" />
                 
                 <div className="p-12 overflow-y-auto max-h-[80vh]">
                    <div className="flex items-start justify-between mb-12">
                       <div>
                          <div className="flex items-center space-x-3 mb-3">
                             <Dna className="text-brand-blue" size={24} />
                             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Sequence Record</span>
                          </div>
                          <h2 className="text-4xl font-black text-white tracking-tighter">{selectedSequence.gisaidAccession}</h2>
                          <div className="flex items-center space-x-4 mt-2">
                             <span className="text-xs font-bold text-white/60">{selectedSequence.viralFamily}</span>
                             <span className="w-1 h-1 bg-white/20 rounded-full" />
                             <span className="text-xs font-black text-brand-blue uppercase tracking-widest">{selectedSequence.clade}</span>
                          </div>
                       </div>
                       <button onClick={() => setSelectedSequence(null)} className="p-4 bg-white/5 rounded-2xl text-white/20 hover:text-white transition-colors">
                          <X size={24} />
                       </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                       <DetailItem label="Collection Date" value={selectedSequence.collectionDate} icon={<Calendar size={14} />} />
                       <DetailItem label="Location" value={selectedSequence.location} icon={<MapPin size={14} />} />
                       <DetailItem label="QC Score" value={`${selectedSequence.qcScore}/100`} icon={<CheckCircle2 size={14} />} />
                       <DetailItem label="Contributing Lab" value={selectedSequence.lab} icon={<Database size={14} />} />
                       <DetailItem label="Submission ID" value={selectedSequence.id} icon={<Tag size={14} />} />
                       <DetailItem label="Status" value="Verified" icon={<ShieldCheck size={14} />} />
                    </div>

                    <div className="space-y-8">
                       <section>
                          <h3 className="text-xs font-black uppercase tracking-widest text-white/40 mb-4">Annotated Mutations</h3>
                          <div className="flex flex-wrap gap-3">
                             {selectedSequence.mutations.map((m: string) => (
                               <span key={m} className="px-4 py-2 bg-brand-blue/10 border border-brand-blue/20 rounded-xl text-xs font-black text-brand-blue">
                                 {m}
                               </span>
                             ))}
                             <span className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-black text-white/20">+14 more</span>
                          </div>
                       </section>

                       <section>
                          <div className="flex items-center justify-between mb-4">
                             <h3 className="text-xs font-black uppercase tracking-widest text-white/40">Raw Sequence Data (FASTA)</h3>
                             <button className="text-[10px] font-black uppercase text-brand-blue hover:underline">Copy to Clipboard</button>
                          </div>
                          <div className="p-6 bg-black rounded-2xl border border-white/5 font-mono text-[10px] text-white/40 leading-relaxed overflow-x-auto">
                             {`>EPI_ISL_87654321 | ${selectedSequence.clade} | ${selectedSequence.collectionDate}\n`}
                             {`ATTAAAGGTTTATACCTTCCCAGGTAACAAACCAACCAACTTTCGATCTCTTGTAGATCTGTTCTCTAAACGAACTTTAAAATCTGTGTGGCTGTCACTCGGCTGCATGCTTAGTGCACTCACGCAGTATAATTAATAACTAATTACTGTCGTTGACAGGACACGAGTAACTCGTCTATCTTCTGCAGGCTGCTTACGGTTTCGTCCGTGTTGCAGCCGATCATCAGCACATCTAGGTTTCGTCCGGGTGTGACCGAAAGGTAA...`}
                          </div>
                       </section>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-12">
                       <button className="flex items-center justify-center space-x-3 py-5 bg-white/5 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white/60 hover:bg-white/10 transition-all">
                          <FileJson size={18} />
                          <span>Download Metadata JSON</span>
                       </button>
                       <button className="flex items-center justify-center space-x-3 py-5 bg-brand-blue text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-brand-blue/20 hover:scale-105 transition-all">
                          <FileCode size={18} />
                          <span>Export FASTA</span>
                       </button>
                    </div>
                 </div>
              </motion.div>
           </div>
         )}
      </AnimatePresence>
    </div>
  );
}

const DetailItem = ({ label, value, icon }: any) => (
  <div className="space-y-1">
    <div className="text-[10px] font-black uppercase tracking-widest text-white/20 flex items-center">
       <span className="mr-2">{icon}</span>
       {label}
    </div>
    <div className="text-sm font-bold text-white/80">{value}</div>
  </div>
);

const ShieldCheck = ({ size, className }: any) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);
