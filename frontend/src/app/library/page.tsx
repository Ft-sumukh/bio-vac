"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Database, 
  Search, 
  Filter, 
  Download, 
  ChevronDown, 
  ExternalLink,
  History,
  Tag,
  Calendar,
  MapPin
} from "lucide-react";
import { GlassCard } from "@/components/ui/StatCard";
import { GENOMIC_LIBRARY } from "@/lib/mock";
import { cn } from "@/lib/utils";

export default function LibraryPage() {
  const [search, setSearch] = useState("");

  const filteredData = GENOMIC_LIBRARY.filter(item => 
    item.id.toLowerCase().includes(search.toLowerCase()) || 
    item.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-10 pb-20">
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 text-brand-blue mb-2">
            <Database size={14} className="fill-current" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Global Sequence Archive</span>
          </div>
          <h1 className="text-5xl font-black tracking-tight text-white">Genomic <span className="text-white/40">Library</span></h1>
          <p className="text-white/40 mt-2 font-medium max-w-xl">
            Centralized repository for global genomic submissions, clade classification, and archival data acknowledgments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-brand-blue transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search by accession ID or region..." 
              className="bg-white/5 border border-white/5 pl-12 pr-6 py-3.5 rounded-xl w-[350px] text-sm font-bold focus:outline-none focus:border-brand-blue/50 focus:bg-white/10 transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="flex items-center space-x-2 px-6 py-3.5 bg-white/5 border border-white/5 text-white/60 rounded-xl hover:bg-white/10 transition-all">
            <Filter size={18} />
            <span className="text-xs font-black uppercase tracking-widest">Filters</span>
          </button>
        </div>
      </section>

      {/* Library Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <GlassCard className="p-8">
            <div className="flex items-center space-x-3 mb-4">
               <History className="text-brand-blue" size={20} />
               <h3 className="text-xs font-black uppercase tracking-widest text-white/40">Recent Submissions (24h)</h3>
            </div>
            <div className="text-3xl font-black text-white">12,482</div>
         </GlassCard>
         <GlassCard className="p-8">
            <div className="flex items-center space-x-3 mb-4">
               <Tag className="text-purple-500" size={20} />
               <h3 className="text-xs font-black uppercase tracking-widest text-white/40">Primary Clades</h3>
            </div>
            <div className="text-3xl font-black text-white">42 Active</div>
         </GlassCard>
         <GlassCard className="p-8">
            <div className="flex items-center space-x-3 mb-4">
               <Database className="text-green-500" size={20} />
               <h3 className="text-xs font-black uppercase tracking-widest text-white/40">Total Archive Size</h3>
            </div>
            <div className="text-3xl font-black text-white">14.8M Records</div>
         </GlassCard>
      </div>

      {/* Table Section */}
      <GlassCard className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/40">Accession ID</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/40">Clade</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/40">Submission Date</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/40">Region / Host</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/40 text-right">Sequence Count</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/40"></th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, i) => (
                <motion.tr 
                  key={row.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-3">
                       <Database size={16} className="text-brand-blue/40" />
                       <span className="text-sm font-bold text-white">{row.id}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1 bg-white/5 rounded-lg text-[10px] font-black text-white/60 border border-white/5">
                      {row.clade}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center text-xs font-bold text-white/40">
                       <Calendar size={12} className="mr-2" /> {row.date}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-1">
                       <div className="flex items-center text-xs font-bold text-white">
                          <MapPin size={12} className="mr-2 text-red-400" /> {row.location}
                       </div>
                       <div className="text-[10px] font-medium text-white/20 pl-5">{row.host}</div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <span className="text-sm font-mono font-black text-brand-blue">{row.submissions.toLocaleString()}</span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="p-2 bg-white/5 rounded-lg hover:bg-brand-blue hover:text-white transition-all opacity-0 group-hover:opacity-100">
                       <ExternalLink size={16} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-6 bg-white/[0.01] border-t border-white/5 flex items-center justify-between">
           <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Showing {filteredData.length} of 14,821,092 sequences</div>
           <div className="flex items-center space-x-4">
              <button className="px-4 py-2 bg-white/5 rounded-lg text-[10px] font-black text-white/40 hover:text-white transition-colors">Previous</button>
              <button className="px-4 py-2 bg-brand-blue rounded-lg text-[10px] font-black text-white shadow-lg shadow-brand-blue/20">Next Page</button>
           </div>
        </div>
      </GlassCard>
    </div>
  );
}
