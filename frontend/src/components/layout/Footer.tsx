"use client";

import React from "react";
import Link from "next/link";
import { Dna, Globe } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-bg-dark border-t border-white/5 pt-20 pb-8 px-6">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Branding */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
                <Dna className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tighter uppercase">BI-VAC</span>
            </Link>
            <p className="text-sm text-neutral-400 font-medium">
              Next-generation genomic surveillance and vaccine intelligence platform for global biosecurity.
            </p>
            <div className="flex items-center space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-primary-600 hover:border-primary-500 transition-all">
                <Globe className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-primary-600 hover:border-primary-500 transition-all">
                <Globe className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-primary-600 hover:border-primary-500 transition-all">
                <Globe className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-white font-bold mb-6 tracking-wide">Platform</h4>
            <ul className="space-y-4">
              {['Evolution Forecasting', 'Pathogen Convergence', 'Structural Dynamics', 'Immunological Memory', 'Adjuvant Matchmaker'].map(link => (
                <li key={link}>
                  <a href="#" className="text-sm text-neutral-400 hover:text-accent-400 transition-colors">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-white font-bold mb-6 tracking-wide">Company</h4>
            <ul className="space-y-4">
              {['About Us', 'Careers', 'Research Blog', 'Partners', 'Contact Sales'].map(link => (
                <li key={link}>
                  <a href="#" className="text-sm text-neutral-400 hover:text-accent-400 transition-colors">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="text-white font-bold mb-6 tracking-wide">Resources</h4>
            <ul className="space-y-4">
              {['Documentation', 'API Reference', 'Security & Compliance', 'Case Studies', 'System Status'].map(link => (
                <li key={link}>
                  <a href="#" className="text-sm text-neutral-400 hover:text-accent-400 transition-colors">{link}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between">
          <p className="text-xs text-neutral-500 font-medium mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Antigravity AI - BI-VAC Platform. All rights reserved.
          </p>
          <div className="flex space-x-6 text-xs text-neutral-500 font-medium">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
