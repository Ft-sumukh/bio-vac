"use client";

import { motion } from "framer-motion";
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
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { id: "dashboard", label: "Intelligence Hub", icon: LayoutDashboard, path: "/" },
  { id: "surveillance", label: "Global Surveillance", icon: Globe, path: "/surveillance" },
  { id: "mutations", label: "Mutation Analytics", icon: Dna, path: "/mutations" },
  { id: "alerts", label: "Threat Detection", icon: ShieldAlert, path: "/alerts" },
  { id: "lab", label: "AI Research Lab", icon: Zap, path: "/lab" },
  { id: "database", label: "Genomic Library", icon: Database, path: "/library" },
  { id: "chat", label: "AI Assistant", icon: MessageSquare, path: "/chat" },
  { id: "settings", label: "Configuration", icon: Settings, path: "/settings" },
];

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="w-72 h-screen bg-black/40 backdrop-blur-3xl border-r border-white/5 fixed left-0 top-0 z-50 flex flex-col p-6">
      <div className="flex items-center space-x-3 mb-12 px-2">
        <div className="w-10 h-10 bg-brand-blue rounded-xl flex items-center justify-center shadow-lg shadow-brand-blue/30">
          <Dna className="text-white" size={24} />
        </div>
        <span className="text-2xl font-black text-white tracking-tighter uppercase">BI-VAC</span>
      </div>

      <nav className="flex-1 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link 
              key={item.id} 
              href={item.path}
              className={cn(
                "flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-300 group",
                isActive 
                  ? "bg-brand-blue/10 text-brand-blue border border-brand-blue/20" 
                  : "text-white/40 hover:text-white/80 hover:bg-white/5"
              )}
            >
              <div className="flex items-center space-x-3">
                <item.icon size={20} className={cn("transition-colors", isActive ? "text-brand-blue" : "group-hover:text-white")} />
                <span className="text-sm font-bold tracking-tight">{item.label}</span>
              </div>
              {isActive && (
                <motion.div layoutId="sidebar-indicator">
                  <ChevronRight size={14} className="text-brand-blue" />
                </motion.div>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-white/5">
        <div className="bg-white/5 rounded-2xl p-4 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-brand-blue/20 border border-brand-blue/30 overflow-hidden">
             <img src="https://i.pravatar.cc/150?u=42" alt="User" />
          </div>
          <div>
            <div className="text-xs font-black text-white">Sumukh Dr.</div>
            <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Lead Researcher</div>
          </div>
        </div>
      </div>
    </aside>
  );
};
