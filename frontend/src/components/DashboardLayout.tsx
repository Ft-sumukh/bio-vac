"use client";

import { Sidebar } from "./Sidebar";
import { AIChatbot } from "./AIChatbot";
import { motion, AnimatePresence } from "framer-motion";

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-brand-blue selection:text-white">
      {/* Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-blue/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/5 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <Sidebar />
      <AIChatbot />
      
      <main className="pl-72 min-h-screen">
        <header className="h-20 border-b border-white/5 backdrop-blur-xl bg-black/20 sticky top-0 z-40 px-10 flex items-center justify-between">
          <div className="flex items-center space-x-4">
             <div className="bg-white/5 px-4 py-2 rounded-lg border border-white/10 flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white/60">System Online: v4.2.0</span>
             </div>
          </div>
          <div className="flex items-center space-x-6">
             <div className="text-right">
                <div className="text-[10px] font-black uppercase text-brand-blue tracking-[0.2em]">Next Scan In</div>
                <div className="text-lg font-mono font-black tabular-nums">04:12:88</div>
             </div>
             <button className="bg-brand-blue text-white px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-brand-blue/20 hover:scale-105 transition-all">
                Trigger Manual Sync
             </button>
          </div>
        </header>

        <div className="p-10">
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};
