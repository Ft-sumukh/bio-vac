"use client";

import React, { useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Activity, Database, Clock, Zap } from "lucide-react";

const STATS = [
  { id: 1, value: 87, suffix: "%", label: "Forecast Accuracy", icon: Activity, duration: 2 },
  { id: 2, value: 24, suffix: "Mo", label: "Prediction Horizon", icon: Clock, duration: 1.5 },
  { id: 3, value: 14, suffix: "M+", label: "Genomes Processed", icon: Database, duration: 2.5 },
  { id: 4, value: 5, suffix: "", label: "Core AI Engines", icon: Zap, duration: 1 }
];

export const StatsSection = () => {
  return (
    <section className="py-24 bg-bg-dark border-t border-white/5 relative z-10 px-6">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map((stat, index) => (
            <StatCard key={stat.id} stat={stat} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

const StatCard = ({ stat, index }: { stat: any; index: number }) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isInView) {
      let startTime: number;
      let animationFrame: number;
      
      const updateCount = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = (timestamp - startTime) / (stat.duration * 1000);
        
        if (progress < 1) {
          setCount(Math.floor(stat.value * progress));
          animationFrame = requestAnimationFrame(updateCount);
        } else {
          setCount(stat.value);
        }
      };
      
      animationFrame = requestAnimationFrame(updateCount);
      return () => cancelAnimationFrame(animationFrame);
    }
  }, [isInView, stat.value, stat.duration]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className="bg-gradient-to-br from-primary-900/40 to-accent-900/20 rounded-2xl p-8 text-center border border-white/10 relative overflow-hidden group hover:border-accent-500/50 transition-colors"
    >
      {/* Background glow on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-accent-500/0 to-accent-500/0 group-hover:from-accent-500/10 transition-colors duration-500" />
      
      <div className="flex justify-center mb-4 relative z-10">
        <div className="p-3 bg-white/5 rounded-xl text-white/80 group-hover:text-white group-hover:bg-accent-500/20 transition-colors duration-300">
          <stat.icon className="w-8 h-8" />
        </div>
      </div>
      
      <div className="text-5xl font-extrabold text-white mb-2 tracking-tight relative z-10 flex items-center justify-center">
        {count}
        <span className="text-accent-400">{stat.suffix}</span>
      </div>
      
      <p className="text-xs font-bold uppercase tracking-widest text-neutral-400 relative z-10">
        {stat.label}
      </p>
    </motion.div>
  );
};
