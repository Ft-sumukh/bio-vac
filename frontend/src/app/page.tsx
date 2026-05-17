"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Dna, Activity, Shield, Network, ArrowRight, Microchip, Fingerprint, Box } from "lucide-react";
import Link from "next/link";

export default function CinematicLandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  
  // Parallax calculations
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const yForeground = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const opacityFade = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <div ref={containerRef} className="relative bg-[#020617] min-h-screen text-slate-200 selection:bg-cyan-500/30 font-sans overflow-hidden">
      
      {/* 🌌 Luminous Atmosphere & Depth */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Core Blue/Cyan glows */}
        <motion.div style={{ y: yBg }} className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-blue-600/10 rounded-full blur-[150px]" />
        <motion.div style={{ y: yBg }} className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-cyan-400/5 rounded-full blur-[150px]" />
        
        {/* Abstract Grid Layer for scientific feel */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.02]" />
      </div>

      {/* 🧭 Transparent Navigation */}
      <nav className="fixed top-0 w-full z-50 px-8 md:px-16 py-6 flex justify-between items-center bg-transparent backdrop-blur-[2px]">
        <div className="flex items-center space-x-3">
          <motion.div 
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="w-10 h-10 border border-cyan-500/30 bg-cyan-950/40 backdrop-blur-md rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.2)]"
          >
            <Dna className="w-5 h-5 text-cyan-400" />
          </motion.div>
          <motion.span 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-lg font-bold tracking-widest text-slate-100 uppercase"
          >
            BI-VAC
          </motion.span>
        </div>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          <Link href="/demo">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-[0.2em] hover:text-cyan-300 transition-colors cursor-pointer">
              Initialize System
            </span>
          </Link>
        </motion.div>
      </nav>

      <main className="relative z-10 flex flex-col items-center">
        
        {/* 🎬 Section 1: The Hero Cinematic */}
        <section className="relative w-full min-h-screen flex flex-col items-center justify-center px-6">
          <motion.div style={{ opacity: opacityFade, y: yForeground }} className="text-center max-w-4xl z-20">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="inline-flex items-center space-x-2 bg-blue-950/40 border border-blue-500/30 rounded-full px-4 py-1.5 backdrop-blur-md mb-8">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_rgba(6,182,212,1)]" />
                <span className="text-[10px] font-bold text-cyan-100 uppercase tracking-widest">
                  Computational Genomics Engine Active
                </span>
              </div>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
              className="text-5xl md:text-7xl lg:text-8xl font-medium tracking-tighter text-white mb-6 leading-tight"
            >
              Decoding the Future of <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-400 font-bold">
                Biosecurity.
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
              className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-light leading-relaxed mb-12"
            >
              An immersive synthesis of predictive AI and molecular science, engineered to preempt pathogenic evolution and accelerate vaccine design with unprecedented precision.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="flex justify-center"
            >
              {/* Animated Scroll Indicator */}
              <div className="flex flex-col items-center space-y-3 opacity-50">
                <span className="text-[9px] uppercase tracking-[0.3em] font-bold">Initiate Sequence</span>
                <div className="w-px h-16 bg-gradient-to-b from-cyan-500/50 to-transparent relative overflow-hidden">
                  <motion.div 
                    animate={{ y: [0, 64] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="w-full h-1/2 bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.8)]"
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
          
          {/* Holographic Interface Element in Background */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, delay: 0.5 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1200px] h-[600px] z-10 pointer-events-none hidden md:block"
          >
            <div className="absolute inset-0 border-[0.5px] border-cyan-500/10 rounded-[100%] rounded-b-none border-b-0 animate-[spin_60s_linear_infinite]" style={{ transform: 'rotateX(75deg)' }} />
            <div className="absolute inset-0 border-[0.5px] border-blue-500/10 rounded-[100%] rounded-t-none border-t-0 animate-[spin_40s_linear_infinite_reverse]" style={{ transform: 'rotateX(75deg) scale(0.8)' }} />
          </motion.div>
        </section>

        {/* 🔬 Section 2: Glassmorphic Analytical Interface */}
        <section className="relative w-full min-h-screen py-32 px-6 flex flex-col items-center justify-center">
          <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Text Narrative */}
            <motion.div 
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="space-y-8"
            >
              <h2 className="text-3xl md:text-5xl font-light text-white tracking-tight leading-tight">
                Holographic Depth. <br/>
                <span className="font-bold text-cyan-400">Scientific Clarity.</span>
              </h2>
              <p className="text-slate-400 text-lg font-light leading-relaxed">
                By fusing high-dimensional vector search with topological deep learning, BI-VAC transforms petabytes of raw genomic sequencing data into a fluid, interactive digital ecosystem. 
              </p>
              <p className="text-slate-400 text-lg font-light leading-relaxed">
                Every mutation, every structural shift, and every immunological risk profile is rendered with architectural precision, allowing researchers to perceive complex evolutionary narratives instantly.
              </p>
              
              <div className="pt-4 flex items-center space-x-6 text-sm font-medium text-cyan-200/60">
                <div className="flex items-center"><Activity className="w-4 h-4 mr-2 text-cyan-400" /> Real-time Processing</div>
                <div className="flex items-center"><Shield className="w-4 h-4 mr-2 text-blue-400" /> Clinical Integrity</div>
              </div>
            </motion.div>

            {/* Immersive Glass Interface Display */}
            <motion.div 
              initial={{ opacity: 0, y: 40, rotateX: 20 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              style={{ perspective: 1000 }}
              className="relative"
            >
              <div className="relative w-full aspect-square md:aspect-[4/3] rounded-2xl bg-white/[0.02] backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden group">
                
                {/* Internal Glows */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/20 blur-[80px] rounded-full group-hover:bg-cyan-500/30 transition-colors duration-700" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/20 blur-[80px] rounded-full group-hover:bg-blue-600/30 transition-colors duration-700" />
                
                {/* Floating UI Elements inside the glass */}
                <div className="absolute inset-6 border border-white/5 rounded-xl flex flex-col justify-between p-6">
                  
                  {/* Top Bar */}
                  <div className="flex justify-between items-center border-b border-white/10 pb-4">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 rounded-full bg-slate-600" />
                      <div className="w-2 h-2 rounded-full bg-slate-600" />
                    </div>
                    <div className="text-[10px] uppercase tracking-widest text-slate-500">Live Telemetry</div>
                  </div>

                  {/* Center Visualization Mock */}
                  <div className="flex-1 flex items-center justify-center relative">
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="w-32 h-32 rounded-full border border-dashed border-cyan-500/30 flex items-center justify-center relative"
                    >
                      <motion.div 
                        animate={{ rotate: -360 }}
                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                        className="w-24 h-24 rounded-full border border-blue-500/40 flex items-center justify-center"
                      >
                         <Network className="w-8 h-8 text-cyan-300 opacity-80" />
                      </motion.div>
                    </motion.div>
                  </div>

                  {/* Bottom Stats */}
                  <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-4">
                     <div>
                       <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Efficacy</div>
                       <div className="text-lg font-mono text-cyan-400">99.8%</div>
                     </div>
                     <div>
                       <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Latency</div>
                       <div className="text-lg font-mono text-blue-400">12ms</div>
                     </div>
                     <div>
                       <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Threats</div>
                       <div className="text-lg font-mono text-slate-300">Zero</div>
                     </div>
                  </div>
                </div>
              </div>
            </motion.div>
            
          </div>
        </section>

        {/* 🚀 Section 3: The Evolutionary Apex (Final Transition) */}
        <section className="relative w-full min-h-[80vh] flex flex-col items-center justify-center px-6 text-center border-t border-white/5 bg-gradient-to-b from-[#020617] to-[#040C1D]">
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="max-w-3xl z-20"
          >
            <Microchip className="w-12 h-12 text-cyan-500/80 mx-auto mb-8" />
            <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-8">
              Step into the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Observation Deck.</span>
            </h2>
            <p className="text-slate-400 text-lg md:text-xl font-light mb-12 leading-relaxed">
              Experience the convergence of computational prediction and immunological defense. The intelligence engine is calibrated, primed, and awaiting your command.
            </p>

            <Link href="/demo">
              <button className="group relative px-10 py-5 bg-cyan-950/40 backdrop-blur-xl border border-cyan-500/50 rounded-2xl overflow-hidden transition-all duration-500 hover:border-cyan-400 hover:shadow-[0_0_40px_rgba(6,182,212,0.3)]">
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                <span className="relative flex items-center justify-center text-cyan-300 font-bold tracking-[0.2em] uppercase text-sm">
                  Initialize Main Dashboard 
                  <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-2 transition-transform duration-300" />
                </span>
              </button>
            </Link>
          </motion.div>

          {/* Bottom Ambient Glow */}
          <div className="absolute bottom-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
        </section>

      </main>
    </div>
  );
}
