"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, 
  Bot, 
  User, 
  Zap, 
  ShieldCheck, 
  Activity, 
  Trash2, 
  Maximize2,
  Sparkles,
  Search,
  Dna
} from "lucide-react";
import { GlassCard } from "@/components/ui/StatCard";
import { cn } from "@/lib/utils";

interface Message {
  role: 'user' | 'assistant';
  content: string;
  type?: 'analysis' | 'text';
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Systems initialized. I am your BIVAC Bio-Intelligence Sentinel. How can I assist with your genomic analysis today?" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const generateMockResponse = (query: string) => {
    const q = query.toLowerCase();
    if (q.includes("spike") || q.includes("glycoprotein")) {
      return "Analyzing Spike structural shifts... I detect a significant salt-bridge disruption at E484. This substitution reduces class II antibody neutralization by approximately 72%. JN.1 sub-lineages are showing a convergent path here.";
    }
    if (q.includes("evasion") || q.includes("probability")) {
      return "Current evasion probability for XBB.1.5-Prime is calculated at 94.2%. This is driven by the K417N + N501Y + P681R triple-motif. Recommending shift in adjuvant formulation for next-gen mRNA targets.";
    }
    if (q.includes("h5n1") || q.includes("avian")) {
      return "H5N1-V2 (2.3.4.4b) alert: Mammalian adaptation marker Q226L confirmed in Southeast Asian clusters. PB2 E627K mutation also present, indicating high replication efficiency at human core temperatures.";
    }
    return "Query acknowledged. Cross-referencing global genomic archives... Based on current metadata, this lineage shows stable phylodynamics but requires monitoring for S1/S2 cleavage site enhancements.";
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI thinking
    setTimeout(() => {
      const botMessage: Message = { 
        role: 'assistant', 
        content: generateMockResponse(input),
        type: 'analysis'
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="h-[calc(100vh-160px)] flex flex-col space-y-6">
      {/* Header */}
      <section className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
           <div className="w-12 h-12 bg-brand-blue rounded-2xl flex items-center justify-center shadow-lg shadow-brand-blue/30">
              <Zap className="text-white fill-current" size={24} />
           </div>
           <div>
              <h1 className="text-2xl font-black text-white uppercase tracking-tighter">AI Assistant</h1>
              <div className="flex items-center space-x-2">
                 <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                 <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Neural Engine Online</span>
              </div>
           </div>
        </div>

        <div className="flex items-center space-x-4">
           <button onClick={() => setMessages([messages[0]])} className="p-3 bg-white/5 rounded-xl text-white/40 hover:text-red-500 transition-colors">
              <Trash2 size={20} />
           </button>
           <button className="p-3 bg-white/5 rounded-xl text-white/40 hover:text-white transition-colors">
              <Maximize2 size={20} />
           </button>
        </div>
      </section>

      {/* Chat Container */}
      <GlassCard className="flex-1 flex flex-col p-0 overflow-hidden border-white/5">
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-8 space-y-8 scroll-smooth"
        >
          {messages.map((msg, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex space-x-6",
                msg.role === 'user' ? "flex-row-reverse space-x-reverse" : "flex-row"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border",
                msg.role === 'assistant' ? "bg-brand-blue/10 border-brand-blue/20 text-brand-blue" : "bg-white/5 border-white/10 text-white/60"
              )}>
                {msg.role === 'assistant' ? <Zap size={20} className="fill-current" /> : <User size={20} />}
              </div>

              <div className={cn(
                "max-w-[70%] space-y-3",
                msg.role === 'user' ? "text-right" : "text-left"
              )}>
                <div className={cn(
                  "p-5 rounded-3xl text-sm leading-relaxed",
                  msg.role === 'assistant' 
                    ? "bg-white/[0.03] text-white/80 border border-white/5 shadow-inner" 
                    : "bg-brand-blue text-white shadow-lg shadow-brand-blue/10"
                )}>
                  {msg.content}
                </div>
                
                {msg.type === 'analysis' && (
                  <div className="flex items-center space-x-4 text-[10px] font-black uppercase tracking-widest text-brand-blue/60">
                     <span className="flex items-center"><ShieldCheck size={12} className="mr-1.5" /> Verified Source</span>
                     <span className="flex items-center"><Activity size={12} className="mr-1.5" /> High Confidence</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}

          {isTyping && (
            <div className="flex space-x-6">
               <div className="w-10 h-10 rounded-xl bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center">
                  <LoaderDots />
               </div>
               <div className="text-[10px] font-black text-white/20 uppercase tracking-widest mt-4">Analysing Protein Fold...</div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-8 bg-white/[0.02] border-t border-white/5">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Ask about specific lineages, evasion scores, or structural motifs..." 
              className="w-full bg-black/40 border border-white/10 rounded-2xl pl-6 pr-24 py-5 text-sm font-medium text-white focus:outline-none focus:border-brand-blue/50 focus:bg-black/60 transition-all shadow-inner"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-2">
               <button className="p-3 text-white/20 hover:text-brand-blue transition-colors">
                  <Search size={20} />
               </button>
               <button 
                 onClick={handleSend}
                 disabled={!input.trim()}
                 className="p-3 bg-brand-blue text-white rounded-xl shadow-lg shadow-brand-blue/30 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale"
               >
                  <Send size={20} />
               </button>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-center space-x-8">
             <QuickAction icon={<Dna size={12} />} label="Spike Shifts" onClick={() => setInput("Tell me about recent Spike glycoprotein shifts")} />
             <QuickAction icon={<Activity size={12} />} label="Evasion Probability" onClick={() => setInput("What is the evasion probability of JN.1-V5?")} />
             <QuickAction icon={<ShieldCheck size={12} />} label="H5N1 Alert" onClick={() => setInput("Analyze recent H5N1 Adaptation markers")} />
          </div>
        </div>
      </GlassCard>
    </div>
  );
}

const QuickAction = ({ icon, label, onClick }: any) => (
  <button 
    onClick={onClick}
    className="flex items-center space-x-2 text-[9px] font-black uppercase tracking-widest text-white/20 hover:text-brand-blue transition-colors"
  >
    {icon}
    <span>{label}</span>
  </button>
);

const LoaderDots = () => (
  <div className="flex space-x-1">
    {[0, 1, 2].map((i) => (
      <motion.div 
        key={i}
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
        className="w-1 h-1 bg-brand-blue rounded-full"
      />
    ))}
  </div>
);
