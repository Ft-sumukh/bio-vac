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
  Dna,
  Link as LinkIcon,
  Download,
  Terminal,
  Cpu,
  History,
  Info
} from "lucide-react";
import { GlassCard } from "@/components/ui/StatCard";
import { cn } from "@/lib/utils";

interface Message {
  role: 'user' | 'assistant';
  content: string;
  type?: 'analysis' | 'text';
  citations?: string[];
  model?: string;
}

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: "Strategic Bio-Intelligence Neural Engine initialized. I am your BIVAC Sentinel. I have real-time access to global genomic archives and predictive evasion models. How can I assist your research today?",
      model: "BIVAC-SENTINEL-v4"
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedModel, setSelectedModel] = useState("Sentinel v4 (Optimal)");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const generateAILogic = (query: string) => {
    const q = query.toLowerCase();
    if (q.includes("spike") || q.includes("glycoprotein")) {
      return {
        content: "🧬 SPIKE GLYCOPROTEIN MUTATION ANALYSIS\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nRecent shifts in Spike protein represent critical immune evasion mechanisms:\n\n📊 Key Substitutions (Last 90 Days):\n• N501Y (Spike RBD): Found in 34% of new sequences, 23 countries\n  - Impact: +8% ACE2 binding affinity, -12% neutralizing antibody recognition\n  - Vaccine Efficacy Reduction: 15-22%\n  \n• E484K (Spike RBD): Emerging in 12% of sequences\n  - Impact: Strong immune escape signature\n\n🔬 Structural Prediction:\nBased on AlphaFold2 modeling, N501Y-E484K double mutation shows a 24% reduction in antibody contact surface.",
        citations: ["GISAID: EPI_ISL_1827364", "Nature Bio: 2024-04-12", "WHO Surveillance Hub"]
      };
    }
    if (q.includes("jn.1") || q.includes("evasion")) {
      return {
        content: "🚨 JN.1-V5 IMMUNE EVASION RISK ASSESSMENT\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nOverall Evasion Probability: 81% (CONFIDENCE: 87%)\n\n📈 Risk Breakdown:\n- Antibody Recognition Loss: 78%\n- Therapeutic Escape Potential: 84%\n- Vaccine Breakthrough Cases: 73%\n- Reinfection Risk: 72%\n\n🧪 Experimental Evidence:\n- Pseudovirus neutralization assays: 4.2-fold reduction in geometric mean antibody titer.\n- Sera from vaccinated individuals: 34% complete escape observed.",
        citations: ["Lancet ID: Vol 24.3", "BIVAC Internal Forecast", "CDC Global Reports"]
      };
    }
    if (q.includes("h5n1") || q.includes("spillover")) {
      return {
        content: "⚠️ H5N1-MOD ZOONOTIC SPILLOVER ASSESSMENT\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nSpillover Risk Index: 45% (Elevated)\nAnimal-to-Human Transmission: 23 CONFIRMED CASES (2024)\n\n🐦 Viral Characteristics:\n- Receptor binding specificity: Enhanced mammalian tropism\n- PB2 E627K mutation: Present, indicating efficient replication at human temperatures.\n\n🌍 Current Outbreak Status:\n- Human cases: 23 (lethality: 89%)\n- Surveillance priority: Critical (Tier 1)",
        citations: ["FAO/WHO Joint Brief", "GISAID H5 Clusters", "Emerging Microbes: 2024.1"]
      };
    }
    return {
      content: "Query acknowledged. Cross-referencing global genomic archives... Based on the current metadata, this lineage shows stable phylodynamics but requires monitoring for S1/S2 cleavage site enhancements in the upcoming 14-day window.",
      citations: ["Global Genomic Archive v4.2"]
    };
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const response = generateAILogic(input);
      const botMessage: Message = { 
        role: 'assistant', 
        content: response.content,
        type: 'analysis',
        citations: response.citations,
        model: selectedModel
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="h-[calc(100vh-160px)] flex flex-col space-y-6">
      {/* AI Assistant Header */}
      <section className="flex items-center justify-between px-2">
        <div className="flex items-center space-x-6">
           <div className="w-14 h-14 bg-brand-blue rounded-[20px] flex items-center justify-center shadow-lg shadow-brand-blue/30 relative">
              <Zap className="text-white fill-current" size={28} />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-4 border-[#050505] animate-pulse" />
           </div>
           <div>
              <h1 className="text-3xl font-black text-white uppercase tracking-tighter">AI Assistant</h1>
              <div className="flex items-center space-x-4 mt-1">
                 <div className="flex items-center space-x-1.5">
                    <span className="text-[10px] font-black text-brand-blue uppercase tracking-widest">Active Model:</span>
                    <select 
                      className="bg-transparent text-[10px] font-black text-white/40 uppercase tracking-widest focus:outline-none cursor-pointer hover:text-white"
                      value={selectedModel}
                      onChange={(e) => setSelectedModel(e.target.value)}
                    >
                       <option>Sentinel v4 (Optimal)</option>
                       <option>Goliath v2 (Detailed)</option>
                       <option>Local (Private)</option>
                    </select>
                 </div>
                 <span className="w-1 h-1 bg-white/10 rounded-full" />
                 <span className="text-[10px] font-black text-white/20 uppercase tracking-widest flex items-center">
                    <History size={10} className="mr-1.5" /> 2.4k History
                 </span>
              </div>
           </div>
        </div>

        <div className="flex items-center space-x-3">
           <button onClick={() => setMessages([messages[0]])} className="p-3.5 bg-white/5 border border-white/5 rounded-xl text-white/20 hover:text-red-500 transition-colors">
              <Trash2 size={20} />
           </button>
           <button className="flex items-center space-x-2 px-6 py-3.5 bg-white text-brand-navy rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:scale-105 transition-all">
              <Download size={16} />
              <span>Export Transcript</span>
           </button>
        </div>
      </section>

      {/* Main Chat Area */}
      <GlassCard className="flex-1 flex flex-col p-0 overflow-hidden bg-black/40 border-white/5">
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-12 space-y-10 scroll-smooth"
        >
          {messages.map((msg, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex space-x-8",
                msg.role === 'user' ? "flex-row-reverse space-x-reverse" : "flex-row"
              )}
            >
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border transition-all shadow-lg",
                msg.role === 'assistant' 
                  ? "bg-brand-blue/10 border-brand-blue/20 text-brand-blue shadow-brand-blue/5" 
                  : "bg-white/5 border-white/10 text-white/60"
              )}>
                {msg.role === 'assistant' ? <Zap size={24} className="fill-current" /> : <User size={24} />}
              </div>

              <div className={cn(
                "max-w-[75%] space-y-4",
                msg.role === 'user' ? "text-right items-end" : "text-left"
              )}>
                <div className={cn(
                  "p-8 rounded-[32px] text-sm font-medium leading-relaxed shadow-2xl",
                  msg.role === 'assistant' 
                    ? "bg-[#0a0a0a] text-white/90 border border-white/5" 
                    : "bg-brand-blue text-white"
                )}>
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                </div>
                
                {msg.role === 'assistant' && (
                  <div className="flex flex-col space-y-4 px-2">
                     {msg.citations && (
                       <div className="flex flex-wrap gap-4">
                          <span className="text-[10px] font-black uppercase text-white/20 tracking-widest">Sources:</span>
                          {msg.citations.map((c, i) => (
                            <span key={i} className="flex items-center text-[10px] font-bold text-brand-blue/60 hover:text-brand-blue cursor-pointer">
                               <LinkIcon size={10} className="mr-1.5" /> {c}
                            </span>
                          ))}
                       </div>
                     )}
                     <div className="flex items-center space-x-6">
                        <span className="flex items-center text-[10px] font-black uppercase text-white/20 tracking-widest"><ShieldCheck size={12} className="mr-2 text-green-500" /> Verified Intelligence</span>
                        <span className="flex items-center text-[10px] font-black uppercase text-white/20 tracking-widest"><Cpu size={12} className="mr-2 text-brand-blue" /> {msg.model}</span>
                     </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}

          {isTyping && (
            <div className="flex space-x-8">
               <div className="w-12 h-12 rounded-2xl bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center">
                  <div className="flex space-x-1">
                    {[0, 1, 2].map(i => (
                      <motion.div key={i} animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.1 }} className="w-1.5 h-1.5 bg-brand-blue rounded-full" />
                    ))}
                  </div>
               </div>
               <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mt-5">Synthesizing Genomic Matrix...</div>
            </div>
          )}
        </div>

        {/* Dynamic Input System */}
        <div className="p-10 bg-white/[0.01] border-t border-white/5">
           <div className="flex items-center justify-center space-x-6 mb-8">
              <QuickPrompt label="Spike Shifts" onClick={() => setInput("Analyze recent Spike glycoprotein shifts")} />
              <QuickPrompt label="Evasion Risk" onClick={() => setInput("Current JN.1-V5 evasion probability?")} />
              <QuickPrompt label="H5N1 Spillover" onClick={() => setInput("Report on H5N1-MOD zoonotic spillover risk")} />
              <QuickPrompt label="Mutation Pairings" onClick={() => setInput("Co-evolution patterns in XBB clusters?")} />
           </div>

           <div className="relative group max-w-5xl mx-auto">
              <input 
                type="text" 
                placeholder="Query the BIVAC Bio-Intelligence Sentinel..." 
                className="w-full bg-black border border-white/10 rounded-[28px] pl-8 pr-32 py-7 text-sm font-medium text-white focus:outline-none focus:border-brand-blue/50 focus:bg-black/80 transition-all shadow-inner"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center space-x-2">
                 <button className="p-4 text-white/20 hover:text-white transition-colors">
                    <Terminal size={22} />
                 </button>
                 <button 
                   onClick={handleSend}
                   disabled={!input.trim() || isTyping}
                   className="p-4 bg-brand-blue text-white rounded-2xl shadow-lg shadow-brand-blue/30 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale"
                 >
                    <Send size={22} />
                 </button>
              </div>
           </div>
           <p className="text-center mt-4 text-[9px] font-bold text-white/10 uppercase tracking-[0.2em]">
             AI-generated reports may require institutional validation. Cite sources before citation.
           </p>
        </div>
      </GlassCard>
    </div>
  );
}

const QuickPrompt = ({ label, onClick }: any) => (
  <button 
    onClick={onClick}
    className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest text-white/30 hover:text-brand-blue hover:border-brand-blue/30 transition-all"
  >
    {label}
  </button>
);
