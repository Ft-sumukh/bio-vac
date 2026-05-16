"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Camera, 
  Hand, 
  Zap, 
  ShieldAlert, 
  Maximize2, 
  ScanLine, 
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Cpu,
  Eye,
  Activity
} from "lucide-react";
import { GlassCard } from "@/components/ui/StatCard";
import { cn } from "@/lib/utils";

// Mock TensorFlow and MediaPipe logic for demo stability
// In a real env, these would load the full models
export default function VisionPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [detectedSequence, setDetectedSequence] = useState<string | null>(null);
  const [gesture, setGesture] = useState<string>("CALIBRATING...");
  const [isModelReady, setIsModelReady] = useState(false);

  useEffect(() => {
    // Setup camera
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            setIsModelReady(true);
          }
        })
        .catch(err => console.error("Camera Error:", err));
    }

    // Mock gesture detection loop
    const gestureInterval = setInterval(() => {
      const gestures = ["👍 APPROVE", "👎 REJECT", "👈 PREVIOUS", "👉 NEXT", "NONE"];
      setGesture(gestures[Math.floor(Math.random() * gestures.length)]);
    }, 3000);

    return () => clearInterval(gestureInterval);
  }, []);

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setDetectedSequence("ATGATGATGCTAGCT[MUTATED_N501Y]TAGCTAGCT");
      setIsScanning(false);
    }, 2000);
  };

  return (
    <div className="space-y-10 pb-20">
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 text-brand-blue mb-2">
            <Eye size={14} className="fill-current" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Neural Vision Unit</span>
          </div>
          <h1 className="text-5xl font-black tracking-tight text-white">Vision <span className="text-white/40">& Interaction</span></h1>
          <p className="text-white/40 mt-2 font-medium max-w-xl">
            Real-time genomic OCR and hands-free gesture control for high-stakes laboratory environments.
          </p>
        </div>

        <div className="flex items-center space-x-4">
           <div className="flex items-center space-x-3 px-4 py-2 bg-white/5 border border-white/10 rounded-xl">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">TensorFlow.js Active</span>
           </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Viewfinder */}
        <div className="lg:col-span-8 relative group">
           <GlassCard className="p-0 overflow-hidden aspect-video relative border-white/10 shadow-2xl">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
              />
              
              {/* Vision Overlays */}
              <div className="absolute inset-0 pointer-events-none">
                 {/* Corners */}
                 <div className="absolute top-10 left-10 w-20 h-20 border-t-4 border-l-4 border-brand-blue/40" />
                 <div className="absolute top-10 right-10 w-20 h-20 border-t-4 border-r-4 border-brand-blue/40" />
                 <div className="absolute bottom-10 left-10 w-20 h-20 border-b-4 border-l-4 border-brand-blue/40" />
                 <div className="absolute bottom-10 right-10 w-20 h-20 border-b-4 border-r-4 border-brand-blue/40" />

                 {/* Scan Line */}
                 {isScanning && (
                   <motion.div 
                     initial={{ top: "0%" }}
                     animate={{ top: "100%" }}
                     transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                     className="absolute left-0 right-0 h-1 bg-brand-blue shadow-[0_0_20px_rgba(0,210,255,1)] z-10"
                   />
                 )}

                 {/* Detection Boxes */}
                 <AnimatePresence>
                    {detectedSequence && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                      >
                         <div className="px-8 py-4 bg-brand-blue/20 backdrop-blur-xl border border-brand-blue/40 rounded-2xl flex items-center space-x-4">
                            <CheckCircle2 className="text-brand-blue" size={24} />
                            <div>
                               <div className="text-[10px] font-black uppercase text-brand-blue tracking-[0.2em]">Sequence Detected</div>
                               <div className="text-lg font-black text-white font-mono">{detectedSequence}</div>
                            </div>
                         </div>
                      </motion.div>
                    )}
                 </AnimatePresence>
              </div>

              {/* Controls UI Overlay */}
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center space-x-6 z-20">
                 <button 
                   onClick={handleScan}
                   className="flex items-center space-x-3 px-10 py-5 bg-brand-blue text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all"
                 >
                    <ScanLine size={20} />
                    <span>Initiate Scan</span>
                 </button>
                 <button 
                   onClick={() => setDetectedSequence(null)}
                   className="p-5 bg-white/10 backdrop-blur-xl border border-white/10 text-white rounded-2xl hover:bg-white/20 transition-all"
                 >
                    <RotateCcw size={20} />
                 </button>
              </div>
           </GlassCard>
        </div>

        {/* Interaction Sidebar */}
        <div className="lg:col-span-4 space-y-6">
           <GlassCard className="p-8">
              <div className="flex items-center space-x-3 mb-8">
                 <Hand className="text-purple-500" size={20} />
                 <h3 className="text-sm font-black uppercase tracking-widest text-white/60">Gesture Engine</h3>
              </div>
              
              <div className="bg-black/40 rounded-[32px] p-10 border border-white/5 flex flex-col items-center justify-center text-center">
                 <div className="w-24 h-24 rounded-full bg-purple-500/10 flex items-center justify-center mb-6 border border-purple-500/20">
                    <Activity className="text-purple-500 animate-pulse" size={40} />
                 </div>
                 <div className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-2">Live Detection</div>
                 <div className="text-3xl font-black text-white tracking-tighter">{gesture}</div>
              </div>

              <div className="mt-8 space-y-4">
                 <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
                    <span className="text-[10px] font-black uppercase text-white/40 tracking-widest">Latency</span>
                    <span className="text-xs font-black text-brand-blue">42ms</span>
                 </div>
                 <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
                    <span className="text-[10px] font-black uppercase text-white/40 tracking-widest">Confidence</span>
                    <span className="text-xs font-black text-green-400">98.4%</span>
                 </div>
              </div>
           </GlassCard>

           <GlassCard className="p-8">
              <div className="flex items-center space-x-3 mb-6">
                 <ShieldAlert className="text-red-500" size={20} />
                 <h3 className="text-sm font-black uppercase tracking-widest text-white/60">AI Verification</h3>
              </div>
              <p className="text-xs text-white/40 leading-relaxed mb-6">
                 Neural OCR engine has extracted 124 polymorphic sites from the current viewport. Consensus match: 99.9% with JN.1-V5.
              </p>
              <div className="flex items-center space-x-2">
                 <div className="h-1 flex-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500" style={{ width: '85%' }} />
                 </div>
                 <span className="text-[10px] font-black text-red-500">CRITICAL RISK</span>
              </div>
           </GlassCard>
        </div>
      </div>
    </div>
  );
}
