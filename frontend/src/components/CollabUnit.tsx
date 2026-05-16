"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  MousePointer2, 
  MessageSquare, 
  Share2, 
  Lock, 
  CheckCircle2, 
  X,
  Plus
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Collaborator {
  id: string;
  name: string;
  color: string;
  x: number;
  y: number;
  status: 'active' | 'typing' | 'idle';
}

export default function CollabUnit() {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([
    { id: '1', name: 'Dr. Sarah Smith', color: '#00D2FF', x: 200, y: 150, status: 'active' },
    { id: '2', name: 'Dr. Chen Wei', color: '#A855F7', x: 450, y: 300, status: 'typing' },
    { id: '3', name: 'Adm. James Holden', color: '#FF1744', x: 600, y: 100, status: 'idle' }
  ]);

  const [annotations, setAnnotations] = useState<any[]>([
    { id: 'a1', user: 'Dr. Sarah Smith', text: 'Significant drift in S1 domain detected here.', x: 220, y: 170 },
    { id: 'a2', user: 'Dr. Chen Wei', text: 'Confirming ACE2 affinity shift.', x: 470, y: 320 }
  ]);

  const [input, setInput] = useState("");

  useEffect(() => {
    // Mock cursor movement
    const interval = setInterval(() => {
      setCollaborators(prev => prev.map(c => ({
        ...c,
        x: c.x + (Math.random() * 20 - 10),
        y: c.y + (Math.random() * 20 - 10)
      })));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[500px] bg-black/40 border border-white/5 rounded-[40px] overflow-hidden group">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
      
      {/* Collaboration Canvas Area */}
      <div className="absolute inset-0 p-10">
         <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
               <div className="flex -space-x-3">
                  {collaborators.map(c => (
                    <div key={c.id} className="w-10 h-10 rounded-full border-4 border-black overflow-hidden bg-white/10 flex items-center justify-center text-[10px] font-black uppercase tracking-tighter" style={{ color: c.color }}>
                       {c.name.split(' ')[1][0]}
                    </div>
                  ))}
                  <div className="w-10 h-10 rounded-full border-4 border-black bg-white/5 flex items-center justify-center text-white/40">
                     <Plus size={14} />
                  </div>
               </div>
               <div className="h-6 w-px bg-white/10 mx-2" />
               <div className="text-[10px] font-black uppercase tracking-widest text-white/40 flex items-center">
                  <Users size={12} className="mr-2" /> 4 Active Sessions
               </div>
            </div>
            
            <div className="flex items-center space-x-3">
               <div className="px-4 py-2 bg-brand-blue/10 border border-brand-blue/20 rounded-xl text-[10px] font-black text-brand-blue uppercase tracking-widest flex items-center">
                  <Lock size={12} className="mr-2" /> Encrypted Session
               </div>
               <button className="p-3 bg-white/5 border border-white/10 rounded-xl text-white/40 hover:text-white transition-all">
                  <Share2 size={16} />
               </button>
            </div>
         </div>

         {/* Mock Shared Cursors */}
         {collaborators.map(c => (
           <motion.div 
             key={c.id}
             animate={{ x: c.x, y: c.y }}
             className="absolute pointer-events-none z-50 flex flex-col items-start"
           >
              <MousePointer2 size={24} className="fill-current" style={{ color: c.color }} />
              <div className="mt-1 px-3 py-1.5 rounded-lg text-[9px] font-black text-white whitespace-nowrap shadow-xl" style={{ backgroundColor: c.color }}>
                 {c.name} {c.status === 'typing' && '...'}
              </div>
           </motion.div>
         ))}

         {/* Annotations */}
         {annotations.map(a => (
           <div key={a.id} className="absolute p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl max-w-[200px]" style={{ left: a.x, top: a.y }}>
              <div className="text-[9px] font-black text-white/20 uppercase mb-2">{a.user}</div>
              <p className="text-[10px] font-bold text-white/80 leading-relaxed italic">"{a.text}"</p>
           </div>
         ))}

         {/* Collaborative Chat Overlay */}
         <div className="absolute bottom-10 right-10 w-80">
            <div className="p-6 bg-black/60 backdrop-blur-2xl border border-white/10 rounded-[32px] shadow-2xl">
               <div className="flex items-center space-x-3 mb-4">
                  <MessageSquare className="text-brand-blue" size={16} />
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">Live Annotation Channel</span>
               </div>
               <div className="space-y-4 mb-6 max-h-[150px] overflow-y-auto pr-2 custom-scrollbar">
                  <div className="text-[10px] leading-relaxed">
                     <span className="font-black text-brand-blue">DR. SMITH:</span> <span className="text-white/60 font-medium">Have you seen the latest H5N1-MOD clusters in Mumbai?</span>
                  </div>
                  <div className="text-[10px] leading-relaxed">
                     <span className="font-black text-purple-500">DR. WEI:</span> <span className="text-white/60 font-medium">Checking now. Evasion score is trending high (+12%).</span>
                  </div>
               </div>
               <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Drop a shared insight..." 
                    className="w-full bg-white/5 border border-white/5 rounded-2xl pl-5 pr-12 py-4 text-[10px] font-bold text-white focus:outline-none focus:border-brand-blue/40 transition-all"
                  />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-brand-blue text-white rounded-xl shadow-lg shadow-brand-blue/30">
                     <Plus size={14} />
                  </button>
               </div>
            </div>
         </div>
      </div>

      <div className="absolute bottom-10 left-10 p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
         <div className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-1">Session Duration</div>
         <div className="text-sm font-black text-white tabular-nums">04:12:88</div>
      </div>
    </div>
  );
}
