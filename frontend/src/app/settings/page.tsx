"use client";

import { motion } from "framer-motion";
import { 
  Settings, 
  User, 
  Shield, 
  Zap, 
  Database, 
  Bell, 
  Key, 
  Globe, 
  Smartphone,
  Eye,
  Terminal,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Activity,
  History
} from "lucide-react";
import { GlassCard } from "@/components/ui/StatCard";
import { cn } from "@/lib/utils";
import { useBIVACStore } from "@/lib/store";

export default function SettingsPage() {
  const { theme, setTheme, alertThreshold, setAlertThreshold } = useBIVACStore();

  return (
    <div className="space-y-10 pb-20">
      <section>
        <div className="flex items-center space-x-2 text-white/40 mb-2">
          <Settings size={14} className="fill-current" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">Operational Preferences</span>
        </div>
        <h1 className="text-5xl font-black tracking-tight text-white">System <span className="text-white/40">Config</span></h1>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Navigation Sidebar */}
        <aside className="lg:col-span-3 space-y-2">
           <SettingsLink active icon={<User size={18} />} label="Account Profile" />
           <SettingsLink icon={<Shield size={18} />} label="Security & Auth" />
           <SettingsLink icon={<Database size={18} />} label="Data Sync" />
           <SettingsLink icon={<Bell size={18} />} label="Notifications" />
           <SettingsLink icon={<Terminal size={18} />} label="Developer / API" />
           <div className="pt-8">
              <button className="w-full flex items-center space-x-4 px-6 py-4 rounded-xl text-red-500/60 hover:text-red-500 hover:bg-red-500/5 transition-all">
                 <LogOut size={18} />
                 <span className="text-xs font-black uppercase tracking-widest">Sign Out</span>
              </button>
           </div>
        </aside>

        {/* Main Configuration Content */}
        <div className="lg:col-span-9 space-y-8">
           <GlassCard className="p-10 border-white/5 bg-black/40">
              <h2 className="text-2xl font-black text-white mb-10 flex items-center">
                 <Zap className="text-brand-blue mr-3" size={24} />
                 Intelligence Engine Tuning
              </h2>
              
              <div className="space-y-12">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-4">
                       <label className="text-[10px] font-black uppercase tracking-widest text-white/30">Primary LLM Protocol</label>
                       <select className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-5 text-sm font-bold text-white focus:outline-none focus:border-brand-blue/50 transition-all appearance-none cursor-pointer">
                          <option>BIVAC Sentinel v4.2 (Precision)</option>
                          <option>Goliath Deep-Scan v2.1</option>
                          <option>Local Neural Engine (Private)</option>
                       </select>
                    </div>
                    <div className="space-y-4">
                       <div className="flex justify-between">
                          <label className="text-[10px] font-black uppercase tracking-widest text-white/30">Alert Sensitivity Threshold</label>
                          <span className="text-xs font-black text-brand-blue">{alertThreshold}%</span>
                       </div>
                       <input 
                         type="range" 
                         min="0" 
                         max="100" 
                         value={alertThreshold}
                         onChange={(e) => setAlertThreshold(parseInt(e.target.value))}
                         className="w-full accent-brand-blue bg-white/5 h-2 rounded-full cursor-pointer" 
                       />
                       <div className="flex justify-between text-[9px] font-bold text-white/20 uppercase tracking-widest">
                          <span>Conservative (Low Recall)</span>
                          <span>Sensitive (High Recall)</span>
                       </div>
                    </div>
                 </div>

                 <div className="p-8 bg-brand-blue/5 border border-brand-blue/20 rounded-3xl flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                       <div className="w-12 h-12 bg-brand-blue/10 rounded-2xl flex items-center justify-center">
                          <Key className="text-brand-blue" size={24} />
                       </div>
                       <div>
                          <div className="text-sm font-black text-white">OpenAI API Integration</div>
                          <div className="text-[10px] font-medium text-white/40 uppercase tracking-widest mt-1">Status: Operational & Fully Connected</div>
                       </div>
                    </div>
                    <button className="px-8 py-3 bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white rounded-xl transition-all">Rotate API Key</button>
                 </div>
              </div>
           </GlassCard>

           <GlassCard className="p-10 border-white/5 bg-black/40">
              <h2 className="text-2xl font-black text-white mb-10 flex items-center">
                 <Eye className="text-purple-500 mr-3" size={24} />
                 Visual Interface & Experience
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <ThemeOption 
                    active={theme === 'cyberpunk'} 
                    onClick={() => setTheme('cyberpunk')}
                    label="Cyberpunk Dark" 
                    desc="High contrast neon accents"
                    color="#00D2FF" 
                 />
                 <ThemeOption 
                    active={theme === 'biotech'} 
                    onClick={() => setTheme('biotech')}
                    label="Deep Biotech" 
                    desc="Organic purple and teal"
                    color="#A855F7" 
                 />
                 <ThemeOption 
                    active={theme === 'mono'} 
                    onClick={() => setTheme('mono')}
                    label="Lab Monochrome" 
                    desc="Strict high-fidelity gray"
                    color="#FFFFFF" 
                 />
              </div>
           </GlassCard>

           <GlassCard className="p-10 border-white/5 bg-black/40">
              <div className="flex items-center justify-between mb-8">
                 <h2 className="text-2xl font-black text-white flex items-center">
                    <History className="text-white/20 mr-3" size={24} />
                    Recent System Logs
                 </h2>
                 <button className="text-[10px] font-black uppercase tracking-widest text-brand-blue hover:underline">View Full Audit Trail</button>
              </div>
              <div className="space-y-4 font-mono text-[10px]">
                 <LogItem time="23:42:01" type="SYNC" msg="Global sequence sync completed. 1,482 new records indexed." />
                 <LogItem time="23:38:15" type="AUTH" msg="Successful login from root admin (Sumukh Dr.)." />
                 <LogItem time="23:12:44" type="ALERT" msg="Threshold exceeded: Evasion score in Cluster #4201 increased to 82%." />
              </div>
           </GlassCard>

           <div className="flex items-center justify-end space-x-6 pt-10 border-t border-white/5">
              <button className="px-10 py-5 bg-white/5 text-white/40 rounded-2xl font-black text-xs uppercase tracking-widest hover:text-white transition-all">Factory Reset System</button>
              <button className="px-14 py-5 bg-brand-blue text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-brand-blue/30 hover:scale-105 active:scale-95 transition-all">Save Changes</button>
           </div>
        </div>
      </div>
    </div>
  );
}

const SettingsLink = ({ icon, label, active = false }: any) => (
  <button className={cn(
    "w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all",
    active ? "bg-white/5 text-white border border-white/10 shadow-lg" : "text-white/30 hover:text-white/60 hover:bg-white/[0.02]"
  )}>
    <div className="flex items-center space-x-4">
       {icon}
       <span className="text-xs font-black uppercase tracking-widest">{label}</span>
    </div>
    {active && <ChevronRight size={14} className="text-brand-blue" />}
  </button>
);

const ThemeOption = ({ label, desc, color, active = false, onClick }: any) => (
  <div 
    onClick={onClick}
    className={cn(
      "p-8 rounded-[32px] border cursor-pointer transition-all hover:scale-105",
      active ? "bg-white/10 border-white/20 shadow-2xl" : "bg-white/5 border-white/5 hover:border-white/10"
    )}
  >
    <div className="w-full h-32 rounded-2xl mb-6 relative overflow-hidden" style={{ backgroundColor: color, opacity: 0.1 }}>
       <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
       <div className="absolute bottom-4 right-4 w-12 h-12 rounded-full blur-xl" style={{ backgroundColor: color, opacity: 0.5 }} />
    </div>
    <div className="text-[10px] font-black uppercase tracking-widest text-white mb-1">{label}</div>
    <div className="text-[9px] font-bold text-white/20 uppercase tracking-widest">{desc}</div>
  </div>
);

const LogItem = ({ time, type, msg }: any) => (
  <div className="flex items-start space-x-6 py-2 border-b border-white/[0.02] last:border-0">
     <span className="text-white/20 shrink-0">[{time}]</span>
     <span className={cn(
       "shrink-0 w-12",
       type === 'ALERT' ? "text-red-500" : type === 'SYNC' ? "text-brand-blue" : "text-green-500"
     )}>{type}</span>
     <span className="text-white/40">{msg}</span>
  </div>
);
