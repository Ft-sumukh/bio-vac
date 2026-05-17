"use client";

import React from "react";
import { motion } from "framer-motion";
import { Dna, ArrowRight, Play } from "lucide-react";
import Link from "next/link";

export const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-bg-dark via-primary-950 to-secondary-900 overflow-hidden pt-20">
      {/* Background animated elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated gradient orbs */}
        <div className="absolute top-20 right-10 w-96 h-96 bg-accent-500 rounded-full opacity-10 blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-40 left-10 w-80 h-80 bg-secondary-500 rounded-full opacity-10 blur-3xl animate-pulse-glow" />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] mix-blend-overlay" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-12 px-6">
        {/* Left: Text */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 backdrop-blur-md">
            <Dna className="w-4 h-4 text-accent-400 animate-pulse" />
            <span className="text-xs font-bold text-white uppercase tracking-widest">
              AI-Powered Genomic Intelligence
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-tight">
            Predict. <span className="bg-gradient-to-r from-primary-400 via-accent-400 to-secondary-400 bg-clip-text text-transparent">Analyze.</span> Vaccinate.
          </h1>
          
          <p className="text-lg md:text-xl text-neutral-300 max-w-xl font-medium leading-relaxed">
            Next-generation surveillance platform for proactive pandemic preparedness and rapid vaccine development.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link href="/demo">
              <button className="w-full sm:w-auto px-8 py-4 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(33,150,243,0.4)] hover:shadow-[0_0_30px_rgba(33,150,243,0.6)] flex items-center justify-center group">
                Launch Platform
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <button className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold rounded-xl transition-all flex items-center justify-center group">
              <Play className="mr-2 w-5 h-5 text-accent-400 group-hover:scale-110 transition-transform" />
              View Demo
            </button>
          </div>
          
          <div className="pt-8 border-t border-white/10 flex items-center space-x-4">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-bg-dark bg-secondary-900 flex items-center justify-center text-xs font-bold text-white">
                  {i === 4 ? "12+" : <div className="w-full h-full bg-gradient-to-br from-primary-500 to-accent-500 rounded-full opacity-80" />}
                </div>
              ))}
            </div>
            <p className="text-sm text-neutral-400 font-medium">
              Trusted by 12+ leading pharmaceutical companies
            </p>
          </div>
        </motion.div>

        {/* Right: Visual Element */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative h-[500px] hidden lg:block"
        >
          <div className="absolute inset-0 flex items-center justify-center animate-float">
            {/* Abstract Tech DNA/Globe representation */}
            <div className="w-80 h-80 rounded-full border border-primary-500/30 flex items-center justify-center relative shadow-[inset_0_0_60px_rgba(33,150,243,0.2)]">
              <div className="absolute w-full h-full border border-accent-500/40 rounded-full animate-[spin_10s_linear_infinite]" style={{ transform: 'rotateX(60deg)' }} />
              <div className="absolute w-full h-full border border-secondary-500/40 rounded-full animate-[spin_15s_linear_infinite_reverse]" style={{ transform: 'rotateY(60deg)' }} />
              
              <div className="w-32 h-32 bg-gradient-to-br from-primary-400 to-accent-500 rounded-full blur-xl opacity-50 animate-pulse-glow" />
              <Dna className="absolute text-white w-20 h-20 opacity-80" />
              
              {/* Floating data nodes */}
              {[...Array(5)].map((_, i) => (
                <div 
                  key={i}
                  className="absolute w-3 h-3 bg-accent-400 rounded-full shadow-[0_0_10px_rgba(38,198,218,0.8)]"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${i * 0.5}s`
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
