"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Dna, Menu, X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const NAV_LINKS = [
    { label: "Features", href: "#features" },
    { label: "Showcase", href: "#showcase" },
    { label: "Intelligence", href: "#intelligence" },
    { label: "API Docs", href: "#docs" }
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "h-16 bg-bg-dark/80 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
            : "h-20 bg-transparent border-b border-transparent"
        }`}
      >
        <div className="container mx-auto px-6 h-full flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(33,150,243,0.3)] group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(0,188,212,0.5)] transition-all">
              <Dna className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-extrabold text-white tracking-tighter uppercase">
              BI-VAC
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm font-semibold text-neutral-300 hover:text-white transition-colors relative group py-2"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent-400 group-hover:w-full transition-all duration-300 ease-out" />
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center">
            <Link href="/demo">
              <button className="px-6 py-2.5 bg-primary-600 hover:bg-primary-500 text-white text-sm font-bold rounded-lg transition-all shadow-[0_0_15px_rgba(33,150,243,0.3)] hover:shadow-[0_0_25px_rgba(33,150,243,0.6)] flex items-center group">
                Launch Platform
              </button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-bg-dark flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
                  <Dna className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-extrabold text-white tracking-tighter uppercase">BI-VAC</span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="text-white p-2 bg-white/5 rounded-full">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto py-8 px-6 flex flex-col space-y-6">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-2xl font-bold text-white border-b border-white/10 pb-4"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="p-6 border-t border-white/10">
              <Link href="/demo" onClick={() => setMobileMenuOpen(false)}>
                <button className="w-full py-4 bg-primary-600 text-white font-bold rounded-xl flex items-center justify-center shadow-lg">
                  Launch Platform <ArrowRight className="w-5 h-5 ml-2" />
                </button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
