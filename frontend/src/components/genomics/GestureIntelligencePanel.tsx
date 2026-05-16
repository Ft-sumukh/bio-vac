"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Activity, Maximize, RotateCcw, Search, Hand, Power, AlertCircle, RefreshCw, Crosshair, Lock, SlidersHorizontal, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GestureType } from '@/hooks/useHandTracking';

interface GestureIntelligencePanelProps {
  trackingState: {
    isEnabled: boolean;
    isLoaded: boolean;
    activeGesture: GestureType;
    confidence: number;
    fps: number;
  };
  onEnable: () => void;
  onDisable: () => void;
  showOverlay: boolean;
  setShowOverlay: (val: boolean) => void;
}

export default function GestureIntelligencePanel({
  trackingState,
  onEnable,
  onDisable,
  showOverlay,
  setShowOverlay
}: GestureIntelligencePanelProps) {
  const [sensitivity, setSensitivity] = useState(50);
  const [rotationLocked, setRotationLocked] = useState(false);

  const { isEnabled, isLoaded, activeGesture, confidence, fps } = trackingState;

  const renderGestureIcon = () => {
    switch(activeGesture) {
      case 'PINCH_ROTATE': return <RotateCcw className="text-brand-blue" size={32} />;
      case 'DUAL_ZOOM': return <Search className="text-green-400" size={32} />;
      case 'OPEN_PAN': return <Maximize className="text-purple-400" size={32} />;
      default: return <Hand className="text-white/20" size={32} />;
    }
  };

  const gestureName = activeGesture === 'PINCH_ROTATE' ? 'Rotation Locked' :
                      activeGesture === 'DUAL_ZOOM' ? 'Dual-Hand Zoom' :
                      activeGesture === 'OPEN_PAN' ? 'Panning Active' : 'Scanning...';

  return (
    <div className="w-80 flex flex-col space-y-4 h-full">
      
      {/* Status Header */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/5 rounded-[32px] p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-blue to-transparent opacity-50" />
        
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Activity size={18} className={isEnabled ? "text-brand-blue animate-pulse" : "text-white/40"} />
            <h2 className="text-xs font-black uppercase tracking-widest text-white/60">AI Tracking</h2>
          </div>
          <div className="px-2 py-1 bg-black/40 rounded-md text-[10px] font-mono font-bold text-white/40">
            {fps} FPS
          </div>
        </div>

        {/* Master Toggle */}
        <button 
          onClick={isEnabled ? onDisable : onEnable}
          className={cn(
            "w-full p-4 rounded-2xl flex items-center justify-center space-x-3 transition-all border group",
            isEnabled 
              ? "bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20" 
              : "bg-brand-blue/10 border-brand-blue/30 text-brand-blue hover:bg-brand-blue/20 hover:shadow-[0_0_20px_rgba(0,210,255,0.2)]"
          )}
        >
          <Power size={18} className={isEnabled ? "animate-pulse" : ""} />
          <span className="text-xs font-black uppercase tracking-widest">
            {isEnabled ? 'Terminate Tracking' : 'Initialize Tracking'}
          </span>
        </button>

        {isEnabled && !isLoaded && (
          <div className="mt-4 flex items-center justify-center space-x-2 text-[10px] text-brand-blue uppercase font-bold tracking-widest">
            <RefreshCw size={12} className="animate-spin" />
            <span>Loading Neural Models...</span>
          </div>
        )}
      </div>

      {/* Active Gesture HUD */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/5 rounded-[32px] p-6 flex-1 flex flex-col relative overflow-hidden">
        {activeGesture !== 'NONE' && (
          <div className="absolute inset-0 bg-brand-blue/5 animate-pulse pointer-events-none" />
        )}
        
        <div className="text-center mb-6 mt-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-black/40 border border-white/10 mb-4 shadow-inner relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeGesture}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                {renderGestureIcon()}
              </motion.div>
            </AnimatePresence>
            
            {/* Tracking rings */}
            {isEnabled && isLoaded && (
              <>
                <div className="absolute inset-[-10px] border border-brand-blue/30 rounded-full animate-[spin_4s_linear_infinite]" />
                <div className="absolute inset-[-20px] border border-white/10 border-dashed rounded-full animate-[spin_8s_linear_infinite_reverse]" />
              </>
            )}
          </div>
          
          <h3 className={cn(
            "text-sm font-black uppercase tracking-widest",
            activeGesture !== 'NONE' ? "text-white" : "text-white/40"
          )}>
            {isEnabled && isLoaded ? gestureName : 'System Offline'}
          </h3>
        </div>

        {/* Confidence Meter */}
        <div className="space-y-2 mb-8">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Confidence</span>
            <span className="text-xs font-black text-brand-blue font-mono">{(confidence * 100).toFixed(0)}%</span>
          </div>
          <div className="h-1 bg-black/40 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-brand-blue shadow-[0_0_10px_rgba(0,210,255,0.8)]" 
              animate={{ width: `${confidence * 100}%` }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-4 mt-auto border-t border-white/10 pt-6">
          <button 
            onClick={() => setShowOverlay(!showOverlay)}
            className="flex items-center justify-between w-full p-3 rounded-xl bg-black/40 hover:bg-white/5 border border-white/5 transition-colors group"
          >
            <div className="flex items-center space-x-3 text-white/60 group-hover:text-white transition-colors">
              {showOverlay ? <Eye size={16} /> : <EyeOff size={16} />}
              <span className="text-[10px] font-black uppercase tracking-widest">Webcam Overlay</span>
            </div>
            <div className={cn("w-2 h-2 rounded-full", showOverlay ? "bg-brand-blue" : "bg-white/20")} />
          </button>

          <button 
            onClick={() => setRotationLocked(!rotationLocked)}
            className="flex items-center justify-between w-full p-3 rounded-xl bg-black/40 hover:bg-white/5 border border-white/5 transition-colors group"
          >
            <div className="flex items-center space-x-3 text-white/60 group-hover:text-white transition-colors">
              <Lock size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">Lock Rotation Axis</span>
            </div>
            <div className={cn("w-2 h-2 rounded-full", rotationLocked ? "bg-red-500" : "bg-white/20")} />
          </button>

          <div className="p-3 rounded-xl bg-black/40 border border-white/5">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center space-x-2 text-white/60">
                <SlidersHorizontal size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest">Sensitivity</span>
              </div>
              <span className="text-[10px] font-bold text-white/40">{sensitivity}%</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="100" 
              value={sensitivity}
              onChange={(e) => setSensitivity(Number(e.target.value))}
              className="w-full accent-brand-blue h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>

      </div>

      {/* Instructions */}
      <div className="bg-brand-navy/50 border border-brand-blue/20 rounded-2xl p-4 flex items-start space-x-3">
        <AlertCircle size={16} className="text-brand-blue shrink-0 mt-0.5" />
        <div className="space-y-2">
          <div className="text-[10px] font-bold text-white/80 uppercase">Gesture Guide</div>
          <ul className="text-[9px] text-white/50 space-y-1 font-medium">
            <li>• <strong className="text-white/80">Pinch & Drag:</strong> Rotate Model</li>
            <li>• <strong className="text-white/80">Two-Hand Pinch:</strong> Zoom In/Out</li>
            <li>• <strong className="text-white/80">Open Palm Drag:</strong> Pan Camera</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
