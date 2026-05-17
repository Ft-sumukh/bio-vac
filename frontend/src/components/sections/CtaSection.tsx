"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";

export const CtaSection = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 2000);
      return;
    }
    
    setStatus("submitting");
    setTimeout(() => {
      setStatus("success");
      setEmail("");
      setTimeout(() => setStatus("idle"), 4000);
    }, 1500);
  };

  return (
    <section className="relative py-32 overflow-hidden px-6">
      {/* Background with animated gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-secondary-900 z-0">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay" />
        {/* Glow effects */}
        <div className="absolute top-0 left-1/4 w-1/2 h-full bg-accent-500/20 blur-[100px] transform -skew-x-12 pointer-events-none" />
      </div>

      <div className="container mx-auto relative z-10 max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center space-x-2 bg-white/10 rounded-full px-4 py-1.5 mb-8 backdrop-blur-md border border-white/20">
            <ShieldCheck className="w-4 h-4 text-accent-400" />
            <span className="text-xs font-bold text-white uppercase tracking-widest">Enterprise Ready</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
            Ready to Transform <br className="hidden md:block" /> Vaccine Development?
          </h2>
          
          <p className="text-xl text-primary-100 mb-12 max-w-2xl mx-auto font-medium">
            Join the pharmaceutical leaders actively using BI-VAC intelligence to secure their clinical pipelines against emerging threats.
          </p>

          <form onSubmit={handleSubmit} className="max-w-xl mx-auto mb-8 relative">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your work email"
                  disabled={status === "success" || status === "submitting"}
                  className={`w-full px-6 py-4 bg-white/10 border ${status === "error" ? "border-red-500 shadow-[0_0_15px_rgba(255,82,82,0.5)]" : "border-white/20 focus:border-accent-400 focus:shadow-[0_0_20px_rgba(38,198,218,0.3)]"} rounded-xl text-white placeholder:text-white/50 outline-none backdrop-blur-sm transition-all`}
                />
                {status === "error" && (
                  <span className="absolute -bottom-6 left-2 text-xs text-red-400 font-bold uppercase tracking-widest">
                    Invalid Email Address
                  </span>
                )}
              </div>
              <button
                type="submit"
                disabled={status === "success" || status === "submitting"}
                className={`px-8 py-4 rounded-xl font-bold transition-all flex items-center justify-center whitespace-nowrap min-w-[160px]
                  ${status === "success" 
                    ? "bg-green-500 text-white cursor-default" 
                    : "bg-white text-primary-900 hover:bg-neutral-100 shadow-xl hover:scale-105"
                  }
                `}
              >
                {status === "submitting" ? (
                  <div className="w-6 h-6 border-2 border-primary-900 border-t-transparent rounded-full animate-spin" />
                ) : status === "success" ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 mr-2" /> Secured
                  </>
                ) : (
                  <>
                    Get Access <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="flex flex-wrap justify-center gap-6 text-xs font-bold text-primary-200 uppercase tracking-widest">
            <span className="flex items-center"><ShieldCheck className="w-4 h-4 mr-2" /> HIPAA Compliant</span>
            <span className="hidden sm:inline-block opacity-30">•</span>
            <span className="flex items-center"><ShieldCheck className="w-4 h-4 mr-2" /> SOC 2 Type II</span>
            <span className="hidden sm:inline-block opacity-30">•</span>
            <span className="flex items-center"><ShieldCheck className="w-4 h-4 mr-2" /> End-to-End Encryption</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
