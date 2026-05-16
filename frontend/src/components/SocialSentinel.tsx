"use client";

import { motion } from "framer-motion";
import { 
  MessageCircle, 
  TrendingUp, 
  AlertTriangle, 
  Zap, 
  BarChart3,
  Globe,
  Hash,
  Share2,
  MessageSquare
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function SocialSentiment() {
  const socialData = [
    { platform: 'Twitter/X', sentiment: 'Highly Negative', volume: '142K/hr', topic: '#H5N1 Outbreak' },
    { platform: 'Reddit', sentiment: 'Concerned', volume: '24K/hr', topic: 'Vaccine Efficacy' },
    { platform: 'News RSS', sentiment: 'Neutral', volume: '1.2K/hr', topic: 'Policy Shifts' },
  ];

  return (
    <div className="p-8 bg-black/40 border border-white/5 rounded-[32px] overflow-hidden">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <Globe className="text-brand-blue" size={20} />
          <h3 className="text-sm font-black uppercase tracking-widest text-white/60">Social Media Sentinel</h3>
        </div>
        <div className="px-3 py-1 bg-brand-blue/10 border border-brand-blue/20 rounded-lg text-[9px] font-black text-brand-blue uppercase tracking-widest">
           Live Stream
        </div>
      </div>

      <div className="space-y-6">
        {socialData.map((s, i) => (
          <div key={i} className="space-y-3">
             <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                   {s.platform === 'Twitter/X' ? <Hash size={14} className="text-brand-blue" /> : 
                    s.platform === 'Reddit' ? <MessageCircle size={14} className="text-orange-500" /> : 
                    <Globe size={14} className="text-green-400" />}
                   <span className="text-xs font-black text-white">{s.platform}</span>
                </div>
                <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{s.volume}</span>
             </div>
             <div className="p-4 bg-white/[0.03] rounded-2xl border border-white/5 flex items-center justify-between">
                <div>
                   <div className="text-[9px] font-black text-white/20 uppercase tracking-widest">Trending Topic</div>
                   <div className="text-xs font-bold text-white">{s.topic}</div>
                </div>
                <div className="text-right">
                   <div className="text-[9px] font-black text-white/20 uppercase tracking-widest">Sentiment</div>
                   <div className={cn(
                     "text-[10px] font-black uppercase",
                     s.sentiment === 'Highly Negative' ? "text-red-500" : "text-brand-blue"
                   )}>{s.sentiment}</div>
                </div>
             </div>
          </div>
        ))}
      </div>

      <div className="mt-10 p-6 bg-brand-blue/5 border border-brand-blue/20 rounded-3xl">
         <div className="flex items-center space-x-3 mb-2">
            <TrendingUp className="text-brand-blue" size={16} />
            <span className="text-[10px] font-black text-white uppercase tracking-widest">Predictive Outbreak Signal</span>
         </div>
         <p className="text-[10px] font-medium text-white/40 leading-relaxed italic">
            &quot;Spike in keyword &apos;unexplained fever&apos; detected in Northern India (+420% in 6h). Correlation with avian cluster #4201: High (0.89).&quot;
         </p>
      </div>
    </div>
  );
}
