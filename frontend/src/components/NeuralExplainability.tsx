"use client";

import { motion } from "framer-motion";
import { 
  Network, 
  Brain, 
  Eye, 
  Zap, 
  ShieldCheck, 
  Activity,
  Layers,
  Binary,
  Target
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function NeuralExplainability() {
  const nodes = Array.from({ length: 6 }, (_, i) => i);
  const layers = Array.from({ length: 4 }, (_, i) => i);

  return (
    <div className="p-8 bg-black/40 border border-white/5 rounded-[32px] overflow-hidden">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <Brain className="text-purple-500" size={20} />
          <h3 className="text-sm font-black uppercase tracking-widest text-white/60">Neural Decision Architecture</h3>
        </div>
        <div className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-lg text-[9px] font-black text-purple-500 uppercase tracking-widest">
          Explainable AI (XAI)
        </div>
      </div>

      <div className="relative h-64 flex justify-between items-center px-12">
        {layers.map((layerIndex) => (
          <div key={layerIndex} className="flex flex-col space-y-4 relative z-10">
            {nodes.slice(0, 5 - Math.abs(layerIndex - 2)).map((nodeIndex) => (
              <motion.div 
                key={nodeIndex}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: (layerIndex + nodeIndex) * 0.05 }}
                className="w-4 h-4 rounded-full bg-purple-500/20 border border-purple-500/40 relative group cursor-help"
              >
                 <div className="absolute inset-0 bg-purple-500 rounded-full animate-ping opacity-20 hidden group-hover:block" />
                 
                 {/* Hidden Logic Tooltip */}
                 <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 hidden group-hover:block z-50">
                    <div className="px-4 py-2 bg-black border border-white/10 rounded-xl text-[8px] font-bold text-white whitespace-nowrap">
                       WEIGHT: 0.842 | BIAS: -0.12
                    </div>
                 </div>
              </motion.div>
            ))}
          </div>
        ))}

        {/* Connection Lines (Mocked via SVG) */}
        <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none">
           <defs>
              <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                 <stop offset="0%" style={{ stopColor: '#A855F7', stopOpacity: 0.1 }} />
                 <stop offset="100%" style={{ stopColor: '#00D2FF', stopOpacity: 0.5 }} />
              </linearGradient>
           </defs>
           <line x1="15%" y1="20%" x2="40%" y2="50%" stroke="url(#grad1)" strokeWidth="1" />
           <line x1="15%" y1="50%" x2="40%" y2="20%" stroke="url(#grad1)" strokeWidth="1" />
           <line x1="40%" y1="50%" x2="65%" y2="80%" stroke="url(#grad1)" strokeWidth="1" />
           <line x1="65%" y1="80%" x2="90%" y2="50%" stroke="url(#grad1)" strokeWidth="1" />
        </svg>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-6">
         <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
            <div className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-1">Inference Transparency</div>
            <div className="text-sm font-black text-white">94% Interpretable</div>
         </div>
         <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
            <div className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-1">Feature Attribution</div>
            <div className="text-sm font-black text-purple-500">S:452R (Critical)</div>
         </div>
      </div>
    </div>
  );
}
