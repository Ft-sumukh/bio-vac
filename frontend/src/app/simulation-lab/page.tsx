"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Target, Activity, Zap, Dna, AlertTriangle, Crosshair, Play, RotateCcw, Trophy, BrainCircuit } from 'lucide-react';
import { cn } from '@/lib/utils';
import confetti from 'canvas-confetti';

// --- GAME LOGIC TYPES ---
type GameState = 'MENU' | 'PLAYING_A' | 'PLAYING_B' | 'GAME_OVER';

export default function SimulationLab() {
  const [gameState, setGameState] = useState<GameState>('MENU');
  
  // Game Stats
  const [score, setScore] = useState(0);
  const [health, setHealth] = useState(100);
  const [time, setTime] = useState(60);
  const [combo, setCombo] = useState(0);
  const [severity, setSeverity] = useState(0);

  // RNA Sequence Defense State
  const [targetSequence, setTargetSequence] = useState('AUG-GCC-UAA');
  const [playerSequence, setPlayerSequence] = useState('');
  
  // Neutralization Strategy State
  const [pathogenHealth, setPathogenHealth] = useState(100);
  const [antibodies, setAntibodies] = useState(5);

  // --- GAME LOOP ---
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if ((gameState === 'PLAYING_A' || gameState === 'PLAYING_B') && time > 0 && health > 0) {
      interval = setInterval(() => {
        setTime(prev => prev - 1);
        if (gameState === 'PLAYING_A') {
          // Increase severity over time in Mode A
          setSeverity(prev => Math.min(prev + 2, 100));
          if (severity > 80) setHealth(prev => Math.max(prev - 5, 0));
        } else {
          // Pathogen attacks in Mode B
          if (Math.random() > 0.7) setHealth(prev => Math.max(prev - 10, 0));
        }
      }, 1000);
    } else if (time === 0 || health === 0) {
      if (gameState !== 'MENU' && gameState !== 'GAME_OVER') {
        setGameState('GAME_OVER');
      }
    }
    return () => clearInterval(interval);
  }, [gameState, time, health, severity]);

  // --- RNA GAME MECHANICS ---
  const handleRNAInput = (codon: string) => {
    const newSeq = playerSequence ? `${playerSequence}-${codon}` : codon;
    setPlayerSequence(newSeq);
    
    if (newSeq.length === targetSequence.length) {
      if (newSeq === targetSequence) {
        // Success
        setScore(s => s + 100 * (1 + combo * 0.5));
        setCombo(c => c + 1);
        setSeverity(Math.max(severity - 20, 0));
        generateNewSequence();
      } else {
        // Fail
        setCombo(0);
        setHealth(h => Math.max(h - 10, 0));
      }
      setPlayerSequence('');
    } else if (!targetSequence.startsWith(newSeq)) {
      // Mistake mid-sequence
      setCombo(0);
      setHealth(h => Math.max(h - 5, 0));
      setPlayerSequence('');
    }
  };

  const generateNewSequence = () => {
    const codons = ['AUG', 'GCC', 'UAA', 'CGC', 'UAG', 'GCA'];
    const s1 = codons[Math.floor(Math.random() * codons.length)];
    const s2 = codons[Math.floor(Math.random() * codons.length)];
    const s3 = codons[Math.floor(Math.random() * codons.length)];
    setTargetSequence(`${s1}-${s2}-${s3}`);
  };

  // --- NEUTRALIZATION GAME MECHANICS ---
  const handleAntibodyDeploy = () => {
    if (antibodies > 0) {
      setAntibodies(a => a - 1);
      const damage = Math.floor(Math.random() * 30) + 20;
      setPathogenHealth(h => Math.max(h - damage, 0));
      setScore(s => s + damage * 10);
      
      if (pathogenHealth - damage <= 0) {
        // Pathogen Neutralized
        setScore(s => s + 1000);
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        setGameState('GAME_OVER');
      }
    }
  };

  // --- RENDERERS ---
  const renderHUD = () => (
    <div className="absolute top-0 left-0 right-0 p-8 flex justify-between items-start z-50 pointer-events-none">
      <div className="space-y-4">
        {/* Health */}
        <div className="bg-black/60 backdrop-blur-xl border border-white/10 p-4 rounded-2xl w-64">
          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-white/60 mb-2">
            <span>System Integrity</span>
            <span className={health < 30 ? "text-red-500 animate-pulse" : "text-brand-blue"}>{health}%</span>
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              className={cn("h-full", health < 30 ? "bg-red-500" : "bg-brand-blue")}
              animate={{ width: `${health}%` }}
            />
          </div>
        </div>
        
        {/* Score & Combo */}
        <div className="bg-black/60 backdrop-blur-xl border border-white/10 p-4 rounded-2xl flex items-center space-x-6">
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-white/40">Score</div>
            <div className="text-2xl font-black text-white">{score.toLocaleString()}</div>
          </div>
          {combo > 1 && (
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-xl font-black text-purple-500"
            >
              {combo}x COMBO
            </motion.div>
          )}
        </div>
      </div>

      <div className="bg-black/60 backdrop-blur-xl border border-white/10 p-6 rounded-3xl flex flex-col items-center">
        <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-2">Time Remaining</div>
        <div className={cn(
          "text-5xl font-black font-mono",
          time <= 10 ? "text-red-500 animate-pulse" : "text-white"
        )}>
          00:{time.toString().padStart(2, '0')}
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-[calc(100vh-4rem)] relative rounded-[40px] overflow-hidden bg-[#02050A] border border-white/5 shadow-2xl pb-6">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay pointer-events-none" />
      
      <AnimatePresence mode="wait">
        
        {/* --- MENU --- */}
        {gameState === 'MENU' && (
          <motion.div 
            key="menu"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center p-12 z-20"
          >
            <div className="text-center mb-16">
              <div className="inline-flex items-center space-x-3 px-4 py-1.5 bg-brand-blue/10 border border-brand-blue/20 rounded-full mb-6">
                <Shield size={14} className="text-brand-blue" />
                <span className="text-[10px] font-black uppercase tracking-widest text-brand-blue">Tactical Training Simulator</span>
              </div>
              <h1 className="text-6xl font-black uppercase tracking-tighter text-white mb-4">Outbreak Defense</h1>
              <p className="text-white/40 max-w-xl mx-auto font-medium">
                Engage in highly realistic simulations modeling viral mutation dynamics, vaccine adaptation, and targeted immune responses.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
              {/* Mode A */}
              <div className="bg-white/5 border border-white/10 p-8 rounded-[32px] hover:bg-white/10 transition-colors group">
                <Dna size={40} className="text-purple-500 mb-6" />
                <h3 className="text-2xl font-black uppercase text-white mb-2">RNA Sequence Defense</h3>
                <p className="text-sm text-white/60 mb-8 h-16">Identify mutating pathogenic RNA and adapt synthetic mRNA templates rapidly to prevent viral escape.</p>
                <button 
                  onClick={() => {
                    setGameState('PLAYING_A');
                    setScore(0); setHealth(100); setTime(60); setCombo(0); setSeverity(0);
                    generateNewSequence();
                  }}
                  className="w-full py-4 bg-brand-blue text-black font-black uppercase tracking-widest rounded-2xl flex justify-center items-center group-hover:scale-105 transition-transform"
                >
                  <Play size={18} className="mr-2" /> Initialize Simulation
                </button>
              </div>

              {/* Mode B */}
              <div className="bg-white/5 border border-white/10 p-8 rounded-[32px] hover:bg-white/10 transition-colors group">
                <Crosshair size={40} className="text-red-500 mb-6" />
                <h3 className="text-2xl font-black uppercase text-white mb-2">Neutralization Strategy</h3>
                <p className="text-sm text-white/60 mb-8 h-16">Deploy targeted monoclonal antibodies to block docking domains before cellular infection occurs.</p>
                <button 
                  onClick={() => {
                    setGameState('PLAYING_B');
                    setScore(0); setHealth(100); setTime(30); setCombo(0); setPathogenHealth(100); setAntibodies(5);
                  }}
                  className="w-full py-4 bg-red-500 text-white font-black uppercase tracking-widest rounded-2xl flex justify-center items-center group-hover:scale-105 transition-transform"
                >
                  <Play size={18} className="mr-2" /> Initialize Simulation
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* --- GAME MODE A: RNA DEFENSE --- */}
        {gameState === 'PLAYING_A' && (
          <motion.div 
            key="gameA"
            initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-[#02050A] to-[#02050A]"
          >
            {renderHUD()}

            {/* Severity Warning */}
            <div className="absolute top-40 w-full max-w-lg px-8 pointer-events-none">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-red-500 mb-2">
                <span>Mutation Severity</span>
                <span>{severity}%</span>
              </div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div className="h-full bg-red-500" animate={{ width: `${severity}%` }} />
              </div>
            </div>

            {/* Target Sequence Hologram */}
            <div className="text-center mb-16 relative">
              <motion.div 
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-purple-500/20 blur-3xl -z-10"
              />
              <div className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 mb-4">Target Pathogen RNA</div>
              <div className="flex flex-wrap gap-2 md:gap-4 justify-center font-mono text-3xl md:text-5xl font-black text-white tracking-widest">
                {targetSequence.split('-').map((codon, i) => (
                  <span key={i} className="px-3 md:px-4 py-2 bg-white/5 border border-white/10 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.05)]">
                    {codon}
                  </span>
                ))}
              </div>
            </div>

            {/* Player Input Area */}
            <div className="flex flex-col items-center">
              <div className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-blue mb-4">Synthesize mRNA Vaccine Template</div>
              <div className="flex flex-wrap gap-2 md:gap-4 justify-center font-mono text-2xl md:text-3xl font-black text-brand-blue tracking-widest mb-12 min-h-16">
                {playerSequence ? playerSequence.split('-').map((codon, i) => (
                  <motion.span 
                    key={i} 
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="px-3 md:px-4 py-2 bg-brand-blue/10 border border-brand-blue/30 rounded-xl"
                  >
                    {codon}
                  </motion.span>
                )) : <span className="text-white/10 opacity-50">AWAITING INPUT...</span>}
              </div>

              {/* Codon Keyboard */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 md:gap-4">
                {['AUG', 'GCC', 'UAA', 'CGC', 'UAG', 'GCA'].map(codon => (
                  <button
                    key={codon}
                    onClick={() => handleRNAInput(codon)}
                    className="px-4 md:px-8 py-3 md:py-4 bg-white/5 hover:bg-brand-blue/20 hover:border-brand-blue/50 border border-white/10 rounded-2xl font-mono text-lg md:text-xl font-bold text-white transition-all active:scale-95"
                  >
                    {codon}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* --- GAME MODE B: NEUTRALIZATION --- */}
        {gameState === 'PLAYING_B' && (
          <motion.div 
            key="gameB"
            initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-900/20 via-[#02050A] to-[#02050A]"
          >
            {renderHUD()}

            {/* Pathogen Target */}
            <div className="relative group cursor-crosshair" onClick={handleAntibodyDeploy}>
              <motion.div 
                animate={{ 
                  scale: [1, 1.05, 1], 
                  rotate: [0, 5, -5, 0],
                  filter: pathogenHealth < 30 ? ['hue-rotate(0deg)', 'hue-rotate(90deg)'] : 'none'
                }}
                transition={{ duration: 4, repeat: Infinity }}
                className="w-64 h-64 bg-red-500/20 rounded-full border-4 border-red-500/50 shadow-[0_0_100px_rgba(239,68,68,0.2)] flex items-center justify-center relative backdrop-blur-sm"
              >
                {/* Spikes */}
                {[...Array(8)].map((_, i) => (
                  <div 
                    key={i} 
                    className="absolute w-4 h-12 bg-red-500/80 rounded-full"
                    style={{ 
                      transform: `rotate(${i * 45}deg) translateY(-140px)`,
                      transformOrigin: 'bottom center'
                    }}
                  />
                ))}
                
                <div className="text-center">
                  <div className="text-3xl font-black text-white">{pathogenHealth}%</div>
                  <div className="text-[10px] font-black uppercase text-red-300 tracking-widest mt-1">Viral Integrity</div>
                </div>
              </motion.div>

              {/* Crosshair Overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                <Target size={120} className="text-brand-blue animate-spin-slow" />
              </div>
            </div>

            {/* Antibody Arsenal */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-xl border border-white/10 p-6 rounded-3xl flex flex-col items-center">
              <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-4">Arsenal: Monoclonal Antibodies</div>
              <div className="flex space-x-3">
                {[...Array(5)].map((_, i) => (
                  <div 
                    key={i} 
                    className={cn(
                      "w-12 h-12 rounded-xl border flex items-center justify-center transition-all",
                      i < antibodies ? "bg-brand-blue/20 border-brand-blue/50 text-brand-blue shadow-[0_0_15px_rgba(0,210,255,0.3)]" : "bg-white/5 border-white/10 text-white/10"
                    )}
                  >
                    <Zap size={20} />
                  </div>
                ))}
              </div>
              <div className="text-xs text-white/60 font-medium mt-4">Click pathogen to deploy countermeasures</div>
            </div>
          </motion.div>
        )}

        {/* --- GAME OVER / DEBRIEF --- */}
        {gameState === 'GAME_OVER' && (
          <motion.div 
            key="gameover"
            initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center p-12 bg-black/90 backdrop-blur-3xl z-50"
          >
            <div className="w-full max-w-2xl bg-white/5 border border-white/10 rounded-[40px] p-12 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-blue via-purple-500 to-red-500" />
              
              <div className="text-center mb-10">
                <h2 className="text-4xl font-black uppercase text-white mb-2">Mission Debrief</h2>
                <p className="text-xs font-bold text-white/40 uppercase tracking-widest">Bio-Intelligence Readiness Report</p>
              </div>

              <div className="grid grid-cols-2 gap-8 mb-10">
                <div className="p-6 bg-black/40 rounded-3xl border border-white/5 text-center">
                  <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Final Score</div>
                  <div className="text-5xl font-black text-brand-blue">{score.toLocaleString()}</div>
                </div>
                <div className="p-6 bg-black/40 rounded-3xl border border-white/5 text-center">
                  <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Readiness Class</div>
                  <div className="text-5xl font-black text-purple-500">
                    {score > 5000 ? 'S-TIER' : score > 2000 ? 'A-TIER' : 'B-TIER'}
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-10">
                <div className="flex items-center space-x-4 text-sm font-medium text-white/60">
                  <CheckItem success={health > 50} />
                  <span>System Integrity Maintained ({health}%)</span>
                </div>
                <div className="flex items-center space-x-4 text-sm font-medium text-white/60">
                  <CheckItem success={combo > 3} />
                  <span>Rapid Adaptation Sequencing (Max Combo: {combo}x)</span>
                </div>
                <div className="flex items-center space-x-4 text-sm font-medium text-white/60">
                  <CheckItem success={score > 2000} />
                  <span>Sufficient Neutralization Response</span>
                </div>
              </div>

              <div className="flex space-x-4">
                <button 
                  onClick={() => setGameState('MENU')}
                  className="flex-1 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black uppercase tracking-widest rounded-2xl transition-colors flex items-center justify-center"
                >
                  <RotateCcw size={18} className="mr-2" /> Return to Command
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const CheckItem = ({ success }: { success: boolean }) => (
  <div className={cn(
    "w-6 h-6 rounded-full flex items-center justify-center",
    success ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"
  )}>
    {success ? "✓" : "✗"}
  </div>
);
