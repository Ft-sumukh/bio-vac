"use client";

import { Sidebar } from "./Sidebar";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Bell, Menu, User, ChevronLeft } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Dynamic page title based on path
  const getPageTitle = () => {
    switch (pathname) {
      case '/': return 'Intelligence Hub';
      case '/structural-genomics': return 'Structural Genomics';
      case '/simulation-lab': return 'Simulation Lab';
      case '/surveillance': return 'Global Surveillance';
      case '/vision': return 'Neural Vision Unit';
      case '/mutations': return 'Mutation Analytics';
      case '/threats': return 'Threat Detection';
      case '/ai-research': return 'Research Lab';
      case '/genomics': return 'Sequence Browser';
      case '/assistant': return 'AI Assistant';
      case '/demo': return 'Supreme Showcase';
      case '/settings': return 'System Config';
      default: return 'BI-VAC';
    }
  };

  // Cinematic landing page bypass
  if (pathname === '/') {
    return (
      <div className="bg-[#050B14] font-sans selection:bg-cyan-500/30 selection:text-cyan-100 overflow-x-hidden min-h-screen">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "circOut" }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-brand-blue selection:text-white font-sans overflow-x-hidden">
      {/* Dynamic Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-blue/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/5 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <main className={cn(
        "min-h-screen transition-all duration-300 ease-in-out",
        isSidebarOpen ? "md:pl-72 pl-0" : "md:pl-20 pl-0"
      )}>
        {/* Production-Grade Header */}
        <header className="h-20 border-b border-white/5 backdrop-blur-3xl bg-black/40 sticky top-0 z-40 px-4 md:px-12 flex items-center justify-between">
          <div className="flex items-center space-x-3 md:space-x-6">
             <button 
               onClick={() => setIsSidebarOpen(!isSidebarOpen)}
               className="p-2.5 md:p-3 bg-white/5 border border-white/10 rounded-xl text-white/40 hover:text-white transition-all flex-shrink-0"
             >
                {isSidebarOpen ? <ChevronLeft size={18} /> : <Menu size={18} />}
             </button>
             <div className="flex items-center space-x-2 md:space-x-3 truncate">
                <span className="hidden sm:inline text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Section /</span>
                <span className="text-xs md:text-sm font-black text-white uppercase tracking-widest truncate">{getPageTitle()}</span>
             </div>
          </div>

          <div className="flex items-center space-x-4 md:space-x-8">
             <div className="hidden lg:flex items-center space-x-6">
                <div className="flex items-center space-x-3 text-white/40">
                   <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                   <span className="text-[10px] font-black uppercase tracking-widest">Network Secure</span>
                </div>
                <div className="h-6 w-px bg-white/10" />
                <div className="text-right">
                   <div className="text-[9px] font-black text-brand-blue uppercase tracking-widest">Next Global Scan</div>
                   <div className="text-sm font-mono font-black tabular-nums">04:12:88</div>
                </div>
             </div>

             <div className="flex items-center space-x-3 md:space-x-4">
                <button className="p-2.5 md:p-3 bg-white/5 border border-white/10 rounded-xl text-white/40 hover:text-white transition-all relative">
                   <Bell size={18} />
                   <span className="absolute top-1.5 md:top-2 right-1.5 md:right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#050505]" />
                </button>
                <div className="h-9 w-9 md:h-10 md:w-10 bg-gradient-to-br from-brand-blue to-purple-500 rounded-xl flex items-center justify-center p-0.5 shadow-lg shadow-brand-blue/20 cursor-pointer hover:scale-105 transition-all">
                   <div className="w-full h-full bg-[#050505] rounded-[10px] flex items-center justify-center">
                      <User size={16} className="text-white/60" />
                   </div>
                </div>
             </div>
          </div>
        </header>

        <div className="p-4 md:p-8 lg:p-12 max-w-[1600px] mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};
