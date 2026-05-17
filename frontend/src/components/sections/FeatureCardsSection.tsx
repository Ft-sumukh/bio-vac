"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Link as LinkIcon, Box, Brain, FlaskConical, ArrowRight } from "lucide-react";

const FEATURES = [
  {
    id: 1,
    title: "Viral Evolution Forecasting",
    description: "Predict high-probability mutation trajectories 6-24 months in advance using advanced phylogenetic modeling.",
    icon: TrendingUp,
    color: "accent"
  },
  {
    id: 2,
    title: "Multi-Pathogen Convergence",
    description: "Detect dangerous recombination events and intersecting evolutionary pathways across multiple viral families.",
    icon: LinkIcon,
    color: "secondary"
  },
  {
    id: 3,
    title: "Structural Dynamics Sandbox",
    description: "Interact with live 3D molecular structures to analyze binding affinities and neutralization vulnerabilities.",
    icon: Box,
    color: "primary"
  },
  {
    id: 4,
    title: "Immunological Memory Atlas",
    description: "Map global population immunity profiles against emerging strains to quantify actual outbreak risks.",
    icon: Brain,
    color: "warning" // Using warning/amber equivalent logic via custom classes if needed
  },
  {
    id: 5,
    title: "AI-Powered Adjuvant Matchmaker",
    description: "Synthesize optimal antigen-adjuvant combinations to accelerate specialized vaccine formulation.",
    icon: FlaskConical,
    color: "success"
  }
];

export const FeatureCardsSection = () => {
  return (
    <section className="py-24 bg-bg-dark relative px-6">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary-900/10 via-bg-dark to-bg-dark pointer-events-none" />
      
      <div className="container mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-extrabold mb-4 text-white">
            Powered by Advanced <span className="text-accent-400">Intelligence</span>
          </h2>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            Five game-winning architectural features that redefine genomic surveillance and vaccine development.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURES.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              className={index === 3 ? "lg:col-start-1 lg:col-end-2 lg:translate-x-1/2" : index === 4 ? "lg:col-start-2 lg:col-end-4 lg:-translate-x-1/2" : ""}
            >
              <FeatureCard feature={feature} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FeatureCard = ({ feature }: { feature: any }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Map colors to tailwind classes since we simplified the palette
  const getColorClasses = (color: string) => {
    switch (color) {
      case 'accent': return 'text-accent-400 bg-accent-500/10 border-accent-500/30';
      case 'secondary': return 'text-secondary-400 bg-secondary-500/10 border-secondary-500/30';
      case 'primary': return 'text-primary-400 bg-primary-500/10 border-primary-500/30';
      case 'warning': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      case 'success': return 'text-green-400 bg-green-500/10 border-green-500/30';
      default: return 'text-primary-400 bg-primary-500/10 border-primary-500/30';
    }
  };

  const getHoverBorderClass = (color: string) => {
    switch (color) {
      case 'accent': return 'hover:border-accent-400 hover:shadow-[0_0_30px_rgba(38,198,218,0.2)]';
      case 'secondary': return 'hover:border-secondary-400 hover:shadow-[0_0_30px_rgba(142,36,170,0.2)]';
      case 'primary': return 'hover:border-primary-400 hover:shadow-[0_0_30px_rgba(66,165,245,0.2)]';
      case 'warning': return 'hover:border-yellow-400 hover:shadow-[0_0_30px_rgba(255,235,59,0.2)]';
      case 'success': return 'hover:border-green-400 hover:shadow-[0_0_30px_rgba(76,175,80,0.2)]';
      default: return 'hover:border-primary-400';
    }
  };

  const colorClasses = getColorClasses(feature.color);
  const hoverClass = getHoverBorderClass(feature.color);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        relative p-8 h-full min-h-[320px] rounded-xl border border-white/5
        bg-white/[0.02] backdrop-blur-sm
        transition-all duration-300 cursor-pointer flex flex-col
        ${hoverClass}
        ${isHovered ? 'scale-105 -translate-y-2 bg-white/[0.04]' : ''}
      `}
    >
      {/* Icon */}
      <div className={`mb-6 w-16 h-16 rounded-xl flex items-center justify-center border transition-colors duration-300 ${isHovered ? colorClasses : 'bg-white/5 border-white/10 text-white/50'}`}>
        <feature.icon className="w-8 h-8" />
      </div>

      {/* Content */}
      <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
      <p className="text-sm text-neutral-400 leading-relaxed flex-grow">
        {feature.description}
      </p>

      {/* Arrow indicator */}
      <div className="mt-8 flex justify-between items-center border-t border-white/5 pt-4">
        <span className="text-xs font-bold uppercase tracking-widest text-neutral-500">Explore</span>
        <ArrowRight className={`w-5 h-5 transition-all duration-300 ${isHovered ? colorClasses.split(' ')[0] + ' translate-x-2' : 'text-neutral-600'}`} />
      </div>
    </div>
  );
};
