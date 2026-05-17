"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  Activity, 
  ShieldAlert, 
  Dna, 
  Database, 
  Settings, 
  MessageSquare, 
  Globe,
  Zap,
  ChevronRight,
  Cpu,
  Radio,
  Eye,
  Crosshair,
  Star,
  Play,
  Syringe
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { id: "dashboard", label: "Intelligence Hub", icon: LayoutDashboard, path: "/" },
  { id: "immunization", label: "Vaccine Ledger", icon: Syringe, path: "/immunization" },
  { id: "structural-genomics", label: "Structural Genomics", icon: Dna, path: "/structural-genomics" },
  { id: "simulation", label: "Simulation Lab", icon: Crosshair, path: "/simulation-lab" },
  { id: "surveillance", label: "Global Surveillance", icon: Globe, path: "/surveillance" },
  { id: "vision", label: "Neural Vision Unit", icon: Eye, path: "/vision" },
  { id: "mutations", label: "Mutation Analytics", icon: Activity, path: "/mutations" },
  { id: "threats", label: "Threat Detection", icon: ShieldAlert, path: "/threats" },
  { id: "research", label: "AI Research Lab", icon: Zap, path: "/ai-research" },
  { id: "genomics", label: "Genomic Library", icon: Database, path: "/genomics" },
  { id: "assistant", label: "AI Assistant", icon: MessageSquare, path: "/assistant" },
  { id: "settings", label: "Configuration", icon: Settings, path: "/settings" },
];

export const Sidebar = ({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (v: boolean) => void }) => {
  const pathname = usePathname();
  const [avatarError, setAvatarError] = useState(false);

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      <aside className={cn(
        "h-screen bg-[#050505] backdrop-blur-3xl border-r border-white/5 fixed left-0 top-0 z-50 flex flex-col transition-all duration-300 ease-in-out",
        isOpen ? "w-72 translate-x-0" : "w-20 -translate-x-full md:translate-x-0"
      )}>
        <div className="flex items-center space-x-3 mb-10 px-6 pt-6">
          <div className="w-10 h-10 bg-brand-blue rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(0,210,255,0.3)] shrink-0">
            <Dna className="text-white" size={24} />
          </div>
          {isOpen && (
            <motion.span 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="text-2xl font-black text-white tracking-tighter uppercase whitespace-nowrap"
            >
              BI-VAC
            </motion.span>
          )}
        </div>

        {/* Special Demo Action */}
        <div className="px-4 mb-6">
          <Link href="/demo">
             <div className={cn(
               "p-4 rounded-2xl border transition-all relative overflow-hidden group flex items-center",
               pathname === '/demo' 
                 ? "bg-brand-blue/20 border-brand-blue/50" 
                 : "bg-white/5 border-white/10 hover:border-brand-blue/40",
               !isOpen && "justify-center"
             )}>
                <div className="flex items-center space-x-3 relative z-10 w-full">
                   <div className="w-8 h-8 bg-brand-blue text-white rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform shrink-0">
                      <Play size={14} className="fill-current" />
                   </div>
                   {isOpen && (
                     <div className="whitespace-nowrap overflow-hidden">
                        <div className="text-[10px] font-black text-white uppercase tracking-widest truncate">Supreme Showcase</div>
                        <div className="text-[9px] font-bold text-brand-blue uppercase truncate">Live Presentation</div>
                     </div>
                   )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-brand-blue/0 via-brand-blue/10 to-brand-blue/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
             </div>
          </Link>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-4 custom-scrollbar overflow-x-hidden">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link 
                key={item.id} 
                href={item.path}
                title={!isOpen ? item.label : undefined}
                className={cn(
                  `tour-step-${item.id}`,
                  "flex items-center px-4 py-3.5 rounded-xl transition-all duration-300 group relative",
                  isActive 
                    ? "bg-brand-blue/10 text-brand-blue border border-brand-blue/20 shadow-[inset_0_0_20px_rgba(0,210,255,0.05)]" 
                    : "text-white/40 hover:text-white/80 hover:bg-white/5",
                  !isOpen ? "justify-center" : "justify-between"
                )}
              >
                <div className="flex items-center space-x-3 w-full">
                  <item.icon size={20} className={cn("shrink-0 transition-colors", isActive ? "text-brand-blue" : "group-hover:text-white")} />
                  {isOpen && (
                    <span className="text-sm font-bold tracking-tight whitespace-nowrap overflow-hidden text-ellipsis">{item.label}</span>
                  )}
                </div>
                {isActive && isOpen && (
                  <motion.div layoutId="sidebar-indicator" className="shrink-0 ml-2">
                     <div className="w-1.5 h-1.5 bg-brand-blue rounded-full shadow-[0_0_10px_rgba(0,210,255,1)]" />
                  </motion.div>
                )}
                {/* Minimal indicator for collapsed state */}
                {isActive && !isOpen && (
                  <div className="absolute right-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-brand-blue rounded-full shadow-[0_0_10px_rgba(0,210,255,1)]" />
                )}
              </Link>
            );
          })}

          {/* Mini Stats Cards */}
          <div className="pt-10 space-y-4 mb-4">
             {isOpen && <div className="px-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mb-4 whitespace-nowrap">Live Status</div>}
             <MiniStat icon={<Database size={12} />} label="Sequences" value="14.8M" color="brand-blue" isOpen={isOpen} />
             <MiniStat icon={<Radio size={12} />} label="Outbreaks" value="12 Clusters" color="red-500" isOpen={isOpen} />
          </div>
        </nav>

        <div className="mt-auto pt-6 border-t border-white/5 p-4">
          <div className={cn(
            "bg-white/5 rounded-2xl flex items-center border border-white/5 transition-all overflow-hidden",
            isOpen ? "p-4 space-x-3" : "p-2 justify-center"
          )}>
            <div className="w-10 h-10 rounded-full bg-brand-blue/20 border border-brand-blue/30 overflow-hidden shrink-0 flex items-center justify-center relative">
              {avatarError ? (
                <div className="w-full h-full bg-gradient-to-br from-brand-blue to-purple-600 flex items-center justify-center font-black text-xs text-white shadow-inner animate-pulse">
                  SD
                </div>
              ) : (
                <img 
                  src="https://api.dicebear.com/7.x/bottts/svg?seed=sumukh&backgroundColor=00D2FF&eyes=shade" 
                  alt="User" 
                  onError={() => setAvatarError(true)}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            {isOpen && (
              <div className="overflow-hidden whitespace-nowrap">
                <div className="text-xs font-black text-white truncate">Sumukh Dr.</div>
                <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest truncate">Intelligence Lead</div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

const MiniStat = ({ icon, label, value, color, isOpen }: any) => (
  <div className={cn(
    "bg-white/[0.02] border border-white/5 rounded-2xl group cursor-help transition-all overflow-hidden flex items-center justify-center",
    isOpen ? "p-4 flex-col items-start" : "p-3"
  )}>
     <div className={cn("flex items-center text-white/20 group-hover:text-white/40", isOpen ? "mb-1 space-x-2" : "")}>
        {icon}
        {isOpen && <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>}
     </div>
     {isOpen && <div className={cn("text-xs font-black", `text-${color}`)}>{value}</div>}
  </div>
);
