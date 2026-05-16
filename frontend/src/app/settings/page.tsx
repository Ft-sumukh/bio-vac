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
  Terminal
} from "lucide-react";
import { GlassCard } from "@/components/ui/StatCard";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  return (
    <div className="space-y-10 pb-20">
      <section>
        <div className="flex items-center space-x-2 text-white/40 mb-2">
          <Settings size={14} className="fill-current" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">System Configuration</span>
        </div>
        <h1 className="text-5xl font-black tracking-tight text-white">Hub <span className="text-white/40">Settings</span></h1>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Navigation */}
        <aside className="lg:col-span-3 space-y-2">
           <SettingsLink active icon={<User size={18} />} label="Account Profile" />
           <SettingsLink icon={<Shield size={18} />} label="Security & Auth" />
           <SettingsLink icon={<Database size={18} />} label="Data Sync" />
           <SettingsLink icon={<Bell size={18} />} label="Notifications" />
           <SettingsLink icon={<Smartphone size={18} />} label="Devices" />
           <SettingsLink icon={<Terminal size={18} />} label="API / Dev" />
        </aside>

        {/* Main Content */}
        <div className="lg:col-span-9 space-y-8">
           <GlassCard className="p-10">
              <h2 className="text-xl font-black text-white mb-8">AI Intelligence Configuration</h2>
              <div className="space-y-8">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                       <label className="text-[10px] font-black uppercase tracking-widest text-white/30">Primary LLM Engine</label>
                       <select className="w-full bg-white/5 border border-white/5 rounded-xl px-5 py-4 text-sm font-bold text-white focus:outline-none focus:border-brand-blue/50 transition-all">
                          <option>Gemini 1.5 Pro (Precision)</option>
                          <option>GPT-4o (Standard)</option>
                          <option>BIVAC-LLM-v4 (Experimental)</option>
                       </select>
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black uppercase tracking-widest text-white/30">Analysis Threshold</label>
                       <input type="range" className="w-full accent-brand-blue bg-white/5 h-2 rounded-lg" />
                       <div className="flex justify-between text-[10px] font-bold text-white/20">
                          <span>Conservative</span>
                          <span>Sensitive</span>
                       </div>
                    </div>
                 </div>

                 <div className="p-6 bg-brand-blue/10 border border-brand-blue/20 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                       <Key className="text-brand-blue" size={24} />
                       <div>
                          <div className="text-sm font-black text-white">OpenAI Integration</div>
                          <div className="text-[10px] font-medium text-white/40">Status: Active & Validated</div>
                       </div>
                    </div>
                    <button className="px-6 py-2 bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white rounded-lg transition-all">Rotate Key</button>
                 </div>
              </div>
           </GlassCard>

           <GlassCard className="p-10">
              <h2 className="text-xl font-black text-white mb-8">Appearance & Visuals</h2>
              <div className="grid grid-cols-3 gap-6">
                 <ThemeCard active label="Cyberpunk Dark" color="#00D2FF" />
                 <ThemeCard label="Deep Biotech" color="#9C27B0" />
                 <ThemeCard label="Lab Monochrome" color="#FFFFFF" />
              </div>
           </GlassCard>

           <div className="flex items-center justify-end space-x-4 pt-4">
              <button className="px-8 py-4 bg-white/5 text-white/40 rounded-2xl font-black text-xs uppercase tracking-widest hover:text-white transition-all">Reset to Defaults</button>
              <button className="px-10 py-4 bg-brand-blue text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-brand-blue/20 hover:scale-105 transition-all">Save Changes</button>
           </div>
        </div>
      </div>
    </div>
  );
}

const SettingsLink = ({ icon, label, active = false }: any) => (
  <button className={cn(
    "w-full flex items-center space-x-4 px-6 py-4 rounded-xl transition-all",
    active ? "bg-white/5 text-white border border-white/5" : "text-white/30 hover:text-white/60 hover:bg-white/[0.02]"
  )}>
    {icon}
    <span className="text-xs font-black uppercase tracking-widest">{label}</span>
  </button>
);

const ThemeCard = ({ label, color, active = false }: any) => (
  <div className={cn(
    "p-6 rounded-3xl border cursor-pointer transition-all",
    active ? "bg-white/10 border-white/20" : "bg-white/5 border-white/5 hover:border-white/10"
  )}>
    <div className="w-full h-24 rounded-2xl mb-4" style={{ backgroundColor: color, opacity: 0.2 }} />
    <div className="text-[10px] font-black uppercase tracking-widest text-center">{label}</div>
  </div>
);
