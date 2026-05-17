"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, Activity, Plane, QrCode, Syringe, Clock, 
  AlertTriangle, ThermometerSnowflake, CheckCircle2, ChevronRight, X 
} from "lucide-react";

// Mock Data
const VACCINE_LEDGER = [
  { id: 1, name: "SARS-CoV-2 (mRNA-1273)", date: "2023-11-15", status: "completed", batch: "MOD-882X", clinician: "Dr. A. Chen", route: "Intramuscular" },
  { id: 2, name: "Influenza Quadrivalent", date: "2023-10-02", status: "completed", batch: "SFI-400A", clinician: "Dr. L. Vance", route: "Intramuscular" },
  { id: 3, name: "Yellow Fever (YF-Vax)", date: "2026-06-10", status: "upcoming", urgency: "high", reason: "Upcoming travel: Brazil", batch: "Pending", clinician: "Pending", route: "Subcutaneous" },
  { id: 4, name: "Tetanus-Diphtheria (Td)", date: "2026-08-20", status: "upcoming", urgency: "medium", reason: "10-year booster required", batch: "Pending", clinician: "Pending", route: "Intramuscular" }
];

export default function ImmunizationIntelligenceModule() {
  const [selectedVaccine, setSelectedVaccine] = useState<any>(null);

  return (
    <div className="min-h-[90vh] pb-24 text-slate-200">
      
      {/* Module Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6"
      >
        <div>
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-cyan-900/40 border border-cyan-500/30 rounded-lg">
              <ShieldCheck className="w-6 h-6 text-cyan-400" />
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Immunization Intelligence
            </h1>
          </div>
          <p className="text-slate-400 font-medium">
            Advanced patient ledger and predictive immunity profiling.
          </p>
        </div>
        
        {/* Quick Status Pill */}
        <div className="flex items-center space-x-3 bg-blue-900/30 border border-blue-500/20 px-4 py-2 rounded-full backdrop-blur-md">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-200">Live Surveillance Active</span>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (Main Ledger & Timeline) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Smart Dashboard Overviews */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Immunity Status Ring */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-2xl p-6 relative overflow-hidden group hover:border-cyan-500/30 transition-colors"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-3xl group-hover:bg-cyan-500/20 transition-all" />
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6">Global Immunity Coverage</h3>
              
              <div className="flex items-center justify-between">
                <div className="relative w-28 h-28 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                    <circle className="text-slate-800 stroke-current" strokeWidth="8" cx="50" cy="50" r="40" fill="transparent" />
                    <motion.circle 
                      initial={{ strokeDasharray: "0 251" }}
                      animate={{ strokeDasharray: "215 251" }} // ~85%
                      transition={{ duration: 2, ease: "easeOut" }}
                      className="text-cyan-400 stroke-current drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]" 
                      strokeWidth="8" 
                      strokeLinecap="round" 
                      cx="50" 
                      cy="50" 
                      r="40" 
                      fill="transparent" 
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-3xl font-extrabold text-white">85%</span>
                  </div>
                </div>
                
                <div className="flex-1 ml-8 space-y-3">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-slate-400">Viral Defense</span>
                    <span className="text-cyan-400">Optimal</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="w-[90%] h-full bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
                  </div>
                  
                  <div className="flex items-center justify-between text-xs font-medium pt-2">
                    <span className="text-slate-400">Bacterial Defense</span>
                    <span className="text-teal-400">Adequate</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="w-[75%] h-full bg-teal-400 shadow-[0_0_10px_rgba(45,212,191,0.8)]" />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* AI Travel & Booster Alerts */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-2xl p-6 relative overflow-hidden group hover:border-blue-500/30 transition-colors flex flex-col justify-between"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl group-hover:bg-blue-500/20 transition-all" />
              
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">AI Predictive Modeling</h3>
                <Plane className="w-5 h-5 text-blue-400" />
              </div>
              
              <div className="bg-blue-950/40 border border-blue-500/20 rounded-xl p-4 mb-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-white mb-1">Travel Alert: Brazil (June 2026)</h4>
                    <p className="text-xs text-blue-200/70">Yellow Fever vaccination is strongly recommended based on destination epidemiology and your current immunity profile.</p>
                  </div>
                </div>
              </div>

              <button className="w-full py-3 bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/30 text-blue-300 font-bold text-sm rounded-xl transition-all flex items-center justify-center shadow-[inset_0_0_20px_rgba(59,130,246,0.1)] hover:shadow-[inset_0_0_20px_rgba(59,130,246,0.3)]">
                Schedule Recommended Doses
              </button>
            </motion.div>
          </div>

          {/* The Timeline: Intelligent Patient Ledger */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-2xl p-6 md:p-8 relative"
          >
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-8 flex items-center">
              <Clock className="w-4 h-4 mr-2" /> Lifelong Immunization Journey
            </h3>

            <div className="relative border-l-2 border-slate-800 ml-4 space-y-8">
              {VACCINE_LEDGER.map((vax, idx) => (
                <div key={vax.id} className="relative pl-8">
                  {/* Glowing Node */}
                  <div className={`absolute -left-[11px] top-1.5 w-5 h-5 rounded-full border-4 border-slate-900 flex items-center justify-center ${vax.status === 'completed' ? 'bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.8)]' : 'bg-slate-800 border-yellow-400/50'}`}>
                    {vax.status === 'completed' && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                  </div>
                  
                  {/* Timeline Card */}
                  <div 
                    onClick={() => setSelectedVaccine(vax)}
                    className={`p-5 rounded-xl border transition-all cursor-pointer group ${
                      vax.status === 'completed' 
                        ? 'bg-slate-800/30 border-white/5 hover:border-cyan-500/40 hover:bg-slate-800/50' 
                        : 'bg-yellow-950/20 border-yellow-500/20 hover:border-yellow-500/50'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
                      <h4 className={`text-lg font-bold ${vax.status === 'completed' ? 'text-white group-hover:text-cyan-300' : 'text-yellow-300'} transition-colors`}>
                        {vax.name}
                      </h4>
                      <span className="text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1 rounded-full border border-white/5">
                        {vax.date}
                      </span>
                    </div>
                    
                    {vax.status === 'completed' ? (
                      <div className="flex items-center text-xs text-slate-400 space-x-4">
                        <span className="flex items-center"><CheckCircle2 className="w-3 h-3 mr-1 text-teal-400" /> Verified</span>
                        <span>Batch: <span className="font-mono text-slate-300">{vax.batch}</span></span>
                      </div>
                    ) : (
                      <div className="text-xs text-yellow-200/70 font-medium">
                        {vax.reason}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Column (Passport & Batch Integrity) */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Digital Health Passport */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-2xl p-6 relative overflow-hidden group hover:border-teal-500/30 transition-colors"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-teal-500/10 blur-[100px] group-hover:bg-teal-500/20 transition-all pointer-events-none" />
            
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6 flex items-center">
              <QrCode className="w-4 h-4 mr-2" /> Digital Health Passport
            </h3>

            <div className="bg-white p-4 rounded-xl flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
              {/* Mock QR Code visual using SVG patterns */}
              <svg width="160" height="160" viewBox="0 0 160 160" className="opacity-90">
                <rect width="160" height="160" fill="white" />
                {Array.from({ length: 64 }).map((_, i) => (
                  <rect 
                    key={i} 
                    x={(i % 8) * 20} 
                    y={Math.floor(i / 8) * 20} 
                    width={Math.random() > 0.4 ? 20 : 0} 
                    height={Math.random() > 0.4 ? 20 : 0} 
                    fill="#020617" 
                  />
                ))}
                {/* Corner markers */}
                <rect x="10" y="10" width="40" height="40" fill="none" stroke="#020617" strokeWidth="8" />
                <rect x="110" y="10" width="40" height="40" fill="none" stroke="#020617" strokeWidth="8" />
                <rect x="10" y="110" width="40" height="40" fill="none" stroke="#020617" strokeWidth="8" />
              </svg>
            </div>

            <div className="space-y-3">
              <button className="w-full py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-[0_0_20px_rgba(20,184,166,0.3)] hover:shadow-[0_0_30px_rgba(20,184,166,0.5)]">
                Export Certificate (PDF)
              </button>
              <p className="text-center text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                Cryptographically Signed & Verified
              </p>
            </div>
          </motion.div>

          {/* Biotech Batch Monitoring */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-2xl p-6 relative overflow-hidden group hover:border-blue-500/30 transition-colors"
          >
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6 flex items-center">
              <ThermometerSnowflake className="w-4 h-4 mr-2" /> Cold-Chain Integrity
            </h3>

            <div className="space-y-4">
              <div className="bg-slate-800/40 border border-white/5 p-4 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-slate-300">Batch MOD-882X</span>
                  <span className="text-[10px] px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full font-bold uppercase tracking-widest border border-green-500/30">Intact</span>
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest">Storage Temp. History</span>
                  <span className="text-sm font-mono text-slate-300">-70.2°C avg</span>
                </div>
                <div className="w-full h-8 mt-3 flex items-end space-x-1 opacity-70">
                  {/* Mock temperature variance graph */}
                  {[...Array(20)].map((_, i) => (
                    <div key={i} className="flex-1 bg-blue-500/50 rounded-t-sm" style={{ height: `${60 + Math.random() * 30}%` }} />
                  ))}
                </div>
              </div>

              <div className="bg-slate-800/40 border border-white/5 p-4 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-slate-300">Batch SFI-400A</span>
                  <span className="text-[10px] px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full font-bold uppercase tracking-widest border border-green-500/30">Intact</span>
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest">Storage Temp. History</span>
                  <span className="text-sm font-mono text-slate-300">2.4°C avg</span>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Slide-out / Modal Overlay for Data Panels */}
      <AnimatePresence>
        {selectedVaccine && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setSelectedVaccine(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden"
            >
              {/* Modal Header */}
              <div className={`p-6 border-b ${selectedVaccine.status === 'completed' ? 'border-cyan-900/50 bg-cyan-950/20' : 'border-yellow-900/50 bg-yellow-950/20'} flex justify-between items-start`}>
                <div>
                  <div className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${selectedVaccine.status === 'completed' ? 'text-cyan-400' : 'text-yellow-400'}`}>
                    {selectedVaccine.status === 'completed' ? 'Administered Vaccine Record' : 'Pending Requirement'}
                  </div>
                  <h3 className="text-2xl font-bold text-white">{selectedVaccine.name}</h3>
                </div>
                <button onClick={() => setSelectedVaccine(null)} className="p-2 bg-black/20 hover:bg-black/40 rounded-full transition-colors">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <span className="block text-[10px] text-slate-500 uppercase tracking-widest mb-1">Date</span>
                    <span className="text-sm font-mono text-slate-200">{selectedVaccine.date}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-500 uppercase tracking-widest mb-1">Route</span>
                    <span className="text-sm font-medium text-slate-200">{selectedVaccine.route}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-500 uppercase tracking-widest mb-1">Clinician</span>
                    <span className="text-sm font-medium text-slate-200">{selectedVaccine.clinician}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-500 uppercase tracking-widest mb-1">Batch / Lot #</span>
                    <span className="text-sm font-mono text-slate-200">{selectedVaccine.batch}</span>
                  </div>
                </div>

                {selectedVaccine.status === 'completed' && (
                  <div className="bg-slate-800/50 rounded-xl p-4 border border-white/5 flex items-start space-x-3">
                    <ShieldCheck className="w-5 h-5 text-cyan-400 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-white mb-1">Cryptographic Signature Valid</h4>
                      <p className="text-xs text-slate-400">This record is immutably verified via the national health ledger and linked to your biosecurity profile.</p>
                    </div>
                  </div>
                )}
                
                {selectedVaccine.status === 'upcoming' && (
                  <button className="w-full py-4 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/50 text-yellow-300 font-bold rounded-xl transition-all shadow-[inset_0_0_20px_rgba(234,179,8,0.1)]">
                    Locate Clinic & Schedule
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
