"use client";

import { motion } from "framer-motion";
import { 
  Trophy, 
  TrendingUp, 
  Star, 
  Target, 
  Award,
  Zap,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

const LEADERS = [
  { rank: 1, name: "Dr. Sarah Smith", score: 9840, accuracy: "98.2%", org: "WHO" },
  { rank: 2, name: "Adm. Holden", score: 9210, accuracy: "96.5%", org: "MCRN" },
  { rank: 3, name: "Dr. Chen Wei", score: 8900, accuracy: "94.8%", org: "CDC" },
  { rank: 4, name: "Prof. Miller", score: 8540, accuracy: "92.1%", org: "GISAID" },
];

export default function Leaderboard() {
  return (
    <div className="p-8 bg-black/40 border border-white/5 rounded-[32px]">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center space-x-3">
          <Trophy className="text-brand-blue" size={20} />
          <h3 className="text-sm font-black uppercase tracking-widest text-white/60">Global Prediction Leaderboard</h3>
        </div>
        <div className="flex items-center space-x-2 text-[10px] font-black text-brand-blue uppercase tracking-widest">
           <Zap size={12} />
           <span>Next Reset: 14:22</span>
        </div>
      </div>

      <div className="space-y-4">
        {LEADERS.map((leader, i) => (
          <motion.div 
            key={leader.rank}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={cn(
              "p-4 rounded-2xl flex items-center justify-between border transition-all hover:scale-[1.02] cursor-pointer",
              leader.rank === 1 ? "bg-brand-blue/10 border-brand-blue/30" : "bg-white/5 border-white/5 hover:border-white/10"
            )}
          >
            <div className="flex items-center space-x-6">
               <div className={cn(
                 "w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black",
                 leader.rank === 1 ? "bg-brand-blue text-white" : "bg-white/10 text-white/40"
               )}>
                 {leader.rank}
               </div>
               <div>
                  <div className="text-xs font-black text-white">{leader.name}</div>
                  <div className="text-[9px] font-bold text-white/20 uppercase tracking-widest">{leader.org}</div>
               </div>
            </div>

            <div className="flex items-center space-x-10 text-right">
               <div>
                  <div className="text-[9px] font-black text-white/20 uppercase tracking-widest">Forecast Acc.</div>
                  <div className="text-xs font-black text-white">{leader.accuracy}</div>
               </div>
               <div>
                  <div className="text-[9px] font-black text-white/20 uppercase tracking-widest">Global Pts</div>
                  <div className="text-xs font-black text-brand-blue">{leader.score}</div>
               </div>
               <ChevronRight size={14} className="text-white/10" />
            </div>
          </motion.div>
        ))}
      </div>

      <button className="w-full mt-10 py-5 bg-white/5 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-all flex items-center justify-center space-x-3">
         <Award size={16} />
         <span>Submit Your Forecast</span>
      </button>
    </div>
  );
}
