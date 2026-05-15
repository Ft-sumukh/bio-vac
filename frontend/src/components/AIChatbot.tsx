"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Zap, Dna, Brain } from "lucide-react";

export const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'BI-VAC Intelligence initialized. How can I assist with your genomic analysis today?' }
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    setInput("");
    
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `Analyzing "${input}"... I've cross-referenced this with the recent XBB.1.5 structural shifts. Recommendation: Increase adjuvant surveillance in the Southeast sector.` 
      }]);
    }, 1000);
  };

  return (
    <>
      {/* Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-10 right-10 w-16 h-16 bg-brand-blue text-white rounded-2xl shadow-2xl shadow-brand-blue/40 z-50 flex items-center justify-center border border-white/20"
      >
        <Brain size={28} className="fill-current" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            className="fixed bottom-32 right-10 w-[400px] h-[600px] bg-[#0A0F1D]/80 backdrop-blur-3xl border border-white/10 rounded-[40px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5">
              <div className="flex items-center space-x-3">
                 <div className="w-8 h-8 bg-brand-blue rounded-lg flex items-center justify-center">
                    <Zap size={16} className="text-white fill-current" />
                 </div>
                 <div>
                    <div className="text-sm font-black text-white uppercase tracking-widest">AI Intelligence</div>
                    <div className="text-[10px] text-green-400 font-bold flex items-center">
                       <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2 animate-pulse" />
                       NEURAL LINK ACTIVE
                    </div>
                 </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/20 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-4 rounded-2xl text-sm font-medium leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-brand-blue text-white rounded-tr-none shadow-lg shadow-brand-blue/10' 
                      : 'bg-white/5 text-white/80 rounded-tl-none border border-white/5'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-6 border-t border-white/5 bg-black/20">
              <div className="relative">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask the AI researcher..." 
                  className="w-full bg-white/5 border border-white/5 pl-4 pr-12 py-3.5 rounded-xl text-sm font-bold focus:outline-none focus:border-brand-blue/50 transition-all"
                />
                <button 
                  onClick={handleSend}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-brand-blue hover:scale-110 transition-all"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
