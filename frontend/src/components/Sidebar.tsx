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
  ChevronRight,
  Cpu,
  Radio
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { id: "dashboard", label: "Intelligence Hub", icon: LayoutDashboard, path: "/" },
  { id: "surveillance", label: "Global Surveillance", icon: Globe, path: "/surveillance" },
  { id: "mutations", label: "Mutation Analytics", icon: Dna, path: "/mutations" },
  { id: "threats", label: "Threat Detection", icon: ShieldAlert, path: "/threats" },
  { id: "research", label: "AI Research Lab", icon: Zap, path: "/ai-research" },
  { id: "genomics", label: "Genomic Library", icon: Database, path: "/genomics" },
  { id: "assistant", label: "AI Assistant", icon: MessageSquare, path: "/assistant" },
  { id: "settings", label: "Configuration", icon: Settings, path: "/settings" },
];

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="w-72 h-screen bg-[#050505] backdrop-blur-3xl border-r border-white/5 fixed left-0 top-0 z-50 flex flex-col p-6">
      <div className="flex items-center space-x-3 mb-10 px-2">
        <div className="w-10 h-10 bg-brand-blue rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(0,210,255,0.3)]">
          <Dna className="text-white" size={24} />
        </div>
        <span className="text-2xl font-black text-white tracking-tighter uppercase">BI-VAC</span>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto pr-2 custom-scrollbar">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link 
              key={item.id} 
              href={item.path}
              className={cn(
                "flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-300 group relative",
                isActive 
                  ? "bg-brand-blue/10 text-brand-blue border border-brand-blue/20 shadow-[inset_0_0_20px_rgba(0,210,255,0.05)]" 
                  : "text-white/40 hover:text-white/80 hover:bg-white/5"
              )}
            >
              <div className="flex items-center space-x-3">
                <item.icon size={20} className={cn("transition-colors", isActive ? "text-brand-blue" : "group-hover:text-white")} />
                <span className="text-sm font-bold tracking-tight">{item.label}</span>
              </div>
              {isActive && (
                <motion.div layoutId="sidebar-indicator">
                   <div className="w-1.5 h-1.5 bg-brand-blue rounded-full shadow-[0_0_10px_rgba(0,210,255,1)]" />
                </motion.div>
              )}
            </Link>
          );
        })}

        {/* Mini Stats Cards */}
        <div className="pt-10 space-y-4">
           <div className="px-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mb-4">Live Status</div>
           
           <MiniStat 
              icon={<Database size={12} />} 
              label="Sequences Indexed" 
              value="14,821,092" 
              color="brand-blue" 
           />
           <MiniStat 
              icon={<Radio size={12} />} 
              label="Active Outbreaks" 
              value="12 Clusters" 
              color="red-500" 
           />
           <MiniStat 
              icon={<Cpu size={12} />} 
              label="Model Uptime" 
              value="99.98%" 
              color="green-400" 
           />
        </div>
      </nav>

      <div className="mt-auto pt-6 border-t border-white/5">
        <div className="bg-white/5 rounded-2xl p-4 flex items-center space-x-3 border border-white/5 hover:border-white/10 transition-colors cursor-pointer group">
          <div className="w-10 h-10 rounded-full bg-brand-blue/20 border border-brand-blue/30 overflow-hidden shrink-0 group-hover:scale-110 transition-transform">
             <img src="https://i.pravatar.cc/150?u=sumukh" alt="User" />
          </div>
          <div className="overflow-hidden">
            <div className="text-xs font-black text-white truncate">Sumukh Dr.</div>
            <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest truncate">Lead Intelligence</div>
          </div>
        </div>
      </div>
    </aside>
  );
};

const MiniStat = ({ icon, label, value, color }: any) => (
  <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.05] transition-colors group">
     <div className="flex items-center space-x-2 text-white/20 mb-1 group-hover:text-white/40 transition-colors">
        {icon}
        <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
     </div>
     <div className={cn("text-xs font-black", `text-${color}`)}>{value}</div>
  </div>
);
