"use client";

import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { FeatureCardsSection } from "@/components/sections/FeatureCardsSection";
import { StatsSection } from "@/components/sections/StatsSection";
import { CtaSection } from "@/components/sections/CtaSection";
import { BIVACSupremeDemo } from "@/components/BIVACSupremeDemo";

export default function Home() {
  return (
    <div className="bg-bg-dark text-white">
      {/* 4.1 Navigation */}
      <Navigation />
      
      <main>
        {/* 4.2 Hero Section */}
        <HeroSection />

        {/* 4.3 Feature Cards Section */}
        <FeatureCardsSection />

        {/* 4.4 Showcase Section (The Interactive Sandbox Demo) */}
        <section className="py-32 bg-bg-dark relative overflow-hidden" id="showcase">
          {/* Subtle background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-900/20 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="container mx-auto px-6 mb-16 text-center relative z-10">
            <div className="inline-block px-4 py-1.5 bg-accent-500/10 border border-accent-500/20 rounded-full text-accent-400 text-xs font-bold uppercase tracking-widest mb-6">
              Live Environment
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
              Interactive <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">Sandbox Demo</span>
            </h2>
            <p className="text-lg text-neutral-400 max-w-2xl mx-auto font-medium">
              Experience the power of the BI-VAC intelligence engine firsthand. Interact with real-time genomic data, molecular structures, and predictive forecasts.
            </p>
          </div>
          
          <div className="container mx-auto relative z-10 px-4 md:px-8">
             {/* The 5-Feature Demo built previously */}
             <BIVACSupremeDemo />
          </div>
        </section>

        {/* 4.5 Stats Section */}
        <StatsSection />

        {/* 4.6 CTA Section */}
        <CtaSection />
      </main>

      {/* 4.7 Footer */}
      <Footer />
    </div>
  );
}
