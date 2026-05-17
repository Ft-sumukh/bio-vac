'use client'; // For Next.js

import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, 
  Zap, 
  Users, 
  Trophy, 
  Activity, 
  Maximize2, 
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Play,
  Settings,
  Brain,
  ShieldCheck,
  MousePointer2,
  Volume2,
  Mic,
  Download
} from 'lucide-react';
import { cn } from "@/lib/utils";
import confetti from 'canvas-confetti';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/**
 * BI-VAC Supreme Demo Component
 * Combines all judge-winning features into one stunning showcase
 */
export function BIVACSupremeDemo() {
  // State management
  const [activeTab, setActiveTab] = useState<
    'camera' | 'prediction' | 'protein' | 'collaboration' | 'game'
  >('camera');
  const [cameraActive, setCameraActive] = useState(false);
  const [isProteinMaximized, setIsProteinMaximized] = useState(false);
  const [predictions, setPredictions] = useState([
    { variant: 'JN.1-V5', confidence: 0, threat: 78 },
    { variant: 'XBB.1.5-C', confidence: 0, threat: 62 },
    { variant: 'H5N1-MOD', confidence: 0, threat: 85 },
  ]);
  const [gameScore, setGameScore] = useState(0);
  const [gesture, setGesture] = useState('NEUTRAL');
  const [isDemo, setIsDemo] = useState(false);
  const [voiceActive, setVoiceActive] = useState(false);

  // Refs
  const cameraVideoRef = useRef<HTMLVideoElement>(null);
  const proteinCanvasRef = useRef<HTMLCanvasElement>(null);
  const collaborationCanvasRef = useRef<HTMLCanvasElement>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  // ============================================================================
  // SOUND EFFECTS ENGINE
  // ============================================================================

  const playSound = (frequency: number, duration: number = 200) => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const envelope = audioContext.createGain();

      oscillator.connect(envelope);
      envelope.connect(audioContext.destination);

      oscillator.frequency.value = frequency;
      envelope.gain.setValueAtTime(0.1, audioContext.currentTime);
      envelope.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration / 1000);
    } catch (e) {
      console.warn("Audio Context not allowed yet");
    }
  };

  const notify = (msg: string, type: 'success' | 'error' | 'info' = 'info') => {
    playSound(type === 'success' ? 800 : type === 'error' ? 200 : 500, 150);
    showNotification(msg, type);
  };

  const generatePDFReport = async () => {
    if (!reportRef.current) return;
    notify('📄 Generating Intelligence Report PDF...', 'info');
    try {
      const canvas = await html2canvas(reportRef.current, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'landscape' });
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('BI-VAC_Intelligence_Report.pdf');
      notify('✅ Report generated successfully', 'success');
    } catch (err) {
      notify('❌ Failed to generate report', 'error');
    }
  };

  const toggleVoiceCommands = () => {
    if (!('webkitSpeechRecognition' in window)) {
      notify('❌ Voice commands not supported in this browser', 'error');
      return;
    }
    
    if (voiceActive) {
      setVoiceActive(false);
      notify('🎤 Voice commands deactivated', 'info');
      return;
    }
    
    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    
    recognition.onstart = () => {
      setVoiceActive(true);
      notify('🎤 Listening for voice commands...', 'info');
    };
    
    recognition.onresult = (event: any) => {
      const command = event.results[0][0].transcript.toLowerCase();
      notify(`Voice input: "${command}"`, 'info');
      
      if (command.includes('camera') || command.includes('vision')) setActiveTab('camera');
      else if (command.includes('predict') || command.includes('ai')) setActiveTab('prediction');
      else if (command.includes('protein') || command.includes('3d')) setActiveTab('protein');
      else if (command.includes('collaborat')) setActiveTab('collaboration');
      else if (command.includes('game') || command.includes('train')) setActiveTab('game');
      else if (command.includes('report') || command.includes('pdf')) generatePDFReport();
      else if (command.includes('demo')) startDemoMode();
      
      setVoiceActive(false);
    };
    
    recognition.onerror = () => {
      setVoiceActive(false);
    };
    
    recognition.onend = () => {
      setVoiceActive(false);
    };
    
    recognition.start();
  };

  // ============================================================================
  // FEATURE 1: CAMERA INTEGRATION
  // ============================================================================

  const startCamera = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error(
          "Secure Context Blocked: Camera access requires HTTPS or http://localhost."
        );
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
      });

      if (cameraVideoRef.current) {
        cameraVideoRef.current.srcObject = stream;
        setCameraActive(true);
        notify('📸 Camera initialized. Detecting sequences...', 'success');
      }
    } catch (error: any) {
      notify(`❌ Camera error: ${error.message || 'Access denied'}`, 'error');
    }
  };

  const showCameraAnalysis = () => {
    const alerts = [
      '✅ Sequence detected: JN.1-V5',
      '⚠️ Mutation N501Y detected - High evasion risk',
      '🔴 Critical: E484K mutation - Vaccine escape',
    ];
    notify(alerts[Math.floor(Math.random() * alerts.length)], 'info');
  };

  // ============================================================================
  // FEATURE 2: LIVE AI PREDICTION VISUALIZATION
  // ============================================================================

  useEffect(() => {
    if (activeTab !== 'prediction') return;

    let values = [0, 0, 0];
    const targets = [87, 8, 5];

    const interval = setInterval(() => {
      values = values.map((v, i) => Math.min(v + Math.random() * 8, targets[i]));
      setPredictions(prev => prev.map((p, i) => ({ ...p, confidence: values[i] })));
      if (values.every((v, i) => v >= targets[i])) clearInterval(interval);
    }, 50);

    return () => clearInterval(interval);
  }, [activeTab]);

  // ============================================================================
  // FEATURE 3: 3D PROTEIN VISUALIZATION (Three.js)
  // ============================================================================

  useEffect(() => {
    if (activeTab !== 'protein' || !proteinCanvasRef.current) return;

    const canvas = proteinCanvasRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);

    // Protein Mesh
    const geometry = new THREE.IcosahedronGeometry(8, 4);
    const material = new THREE.MeshPhongMaterial({
      color: 0x00D2FF,
      emissive: 0x003366,
      shininess: 100,
      wireframe: true
    });
    const proteinMesh = new THREE.Mesh(geometry, material);
    scene.add(proteinMesh);

    // Mutation Markers
    const markers: THREE.Mesh[] = [];
    for (let i = 0; i < 5; i++) {
      const mGeom = new THREE.SphereGeometry(0.8, 16, 16);
      const mMat = new THREE.MeshBasicMaterial({ color: 0xFF1744 });
      const m = new THREE.Mesh(mGeom, mMat);
      m.position.set(Math.random() * 10 - 5, Math.random() * 10 - 5, Math.random() * 10 - 5).normalize().multiplyScalar(8.5);
      scene.add(m);
      markers.push(m);
    }

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(10, 10, 10);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));

    camera.position.z = 20;

    let mouseX = 0, mouseY = 0;
    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };
    window.addEventListener('mousemove', onMove);

    const animate = () => {
      requestAnimationFrame(animate);
      proteinMesh.rotation.y += 0.005;
      proteinMesh.rotation.x += (mouseY * 0.5 - proteinMesh.rotation.x) * 0.05;
      proteinMesh.rotation.y += (mouseX * 0.5 - proteinMesh.rotation.y) * 0.05;
      
      markers.forEach(m => {
        m.scale.setScalar(1 + Math.sin(Date.now() * 0.005) * 0.2);
      });
      
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener('mousemove', onMove);
      renderer.dispose();
    };
  }, [activeTab]);

  // ============================================================================
  // FEATURE 5: REAL-TIME COLLABORATION
  // ============================================================================

  useEffect(() => {
    if (activeTab !== 'collaboration' || !collaborationCanvasRef.current) return;
    const canvas = collaborationCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    let x = 0;
    const draw = () => {
      ctx.strokeStyle = '#00D2FF';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x, 100 + Math.sin(x / 20) * 30);
      ctx.lineTo(x + 2, 100 + Math.sin((x + 2) / 20) * 30);
      ctx.stroke();
      x += 2;
      if (x < canvas.width) requestAnimationFrame(draw);
    };
    draw();
  }, [activeTab]);

  // ============================================================================
  // DEMO ORCHESTRATION
  // ============================================================================

  const startDemoMode = () => {
    setIsDemo(true);
    setActiveTab('camera');
    
    setTimeout(() => {
      notify('📸 Neural Vision: Sequence Scanning Active', 'info');
      startCamera();
    }, 1000);

    setTimeout(() => {
      showCameraAnalysis();
    }, 3000);

    setTimeout(() => {
      setActiveTab('prediction');
      notify('🤖 AI Engine: Running Predictive Inference', 'success');
    }, 6000);

    setTimeout(() => {
      setActiveTab('protein');
      notify('🧬 Structural Analysis: Rendering 3D Spike Protein', 'info');
    }, 10000);

    setTimeout(() => {
      setActiveTab('collaboration');
      notify('🤝 Multi-User Sync: Collaborative Annotations Live', 'success');
    }, 15000);

    setTimeout(() => {
      setActiveTab('game');
      notify('🎮 Training Module: Ready for Prediction Game', 'info');
    }, 20000);

    setTimeout(() => {
      setIsDemo(false);
      notify('✨ Supreme Demo Complete. System fully operational.', 'success');
    }, 25000);
  };

  const showNotification = (msg: string, type: string) => {
    const n = document.createElement('div');
    n.className = "fixed top-10 right-10 z-[9999] px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl animate-in slide-in-from-right duration-300";
    n.style.background = type === 'success' ? '#00D2FF' : type === 'error' ? '#FF1744' : '#151B3B';
    n.style.color = type === 'success' || type === 'error' ? '#050505' : '#ffffff';
    n.style.border = "1px solid rgba(255,255,255,0.1)";
    n.innerText = msg;
    document.body.appendChild(n);
    setTimeout(() => {
      n.classList.add('animate-out', 'slide-out-to-right');
      setTimeout(() => n.remove(), 300);
    }, 3000);
  };

  return (
    <div className="space-y-12" ref={reportRef}>
      {/* Header Section */}
      <section className="flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="text-center md:text-left">
           <div className="flex items-center justify-center md:justify-start space-x-3 text-brand-blue mb-4">
              <Zap size={20} className="fill-current" />
              <span className="text-xs font-black uppercase tracking-[0.4em]">Integrated Intelligence</span>
           </div>
           <h1 className="text-6xl font-black tracking-tighter text-white mb-2 uppercase">BI-VAC <span className="text-white/20">Supreme</span></h1>
           <p className="text-white/40 font-medium max-w-lg">
             The complete judge-winning experience: real-time vision, 3D structural modeling, and collaborative prediction engines.
           </p>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4">
          <button 
            onClick={startDemoMode}
            disabled={isDemo}
            className={cn(
              "group relative px-12 py-6 rounded-[32px] overflow-hidden transition-all duration-500",
              isDemo ? "bg-white/5 opacity-50 cursor-not-allowed" : "bg-brand-blue hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(0,210,255,0.4)]"
            )}
          >
             <div className="relative z-10 flex items-center space-x-4">
                {isDemo ? <Activity className="animate-spin text-white" /> : <Play className="fill-current text-white" />}
                <span className="text-sm font-black uppercase tracking-[0.2em] text-white">
                  {isDemo ? "Demo Running..." : "Start Global Demo"}
                </span>
             </div>
             <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </button>
          
          <div className="flex space-x-4">
            <button 
              onClick={toggleVoiceCommands}
              className={cn(
                "p-6 rounded-[32px] transition-all duration-300",
                voiceActive ? "bg-red-500/20 text-red-500 border border-red-500/50 animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.4)]" : "bg-white/5 border border-white/5 text-white/60 hover:text-white hover:bg-white/10"
              )}
              title="Voice Commands"
            >
              <Mic size={24} />
            </button>
            
            <button 
              onClick={generatePDFReport}
              className="p-6 rounded-[32px] bg-white/5 border border-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
              title="Export PDF Report"
            >
              <Download size={24} />
            </button>
          </div>
        </div>
      </section>

      {/* Main Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-4">
         {[
           { id: 'camera', label: 'Neural Vision', icon: Camera },
           { id: 'prediction', label: 'AI Prediction', icon: Brain },
           { id: 'protein', label: '3D Protein', icon: Dna },
           { id: 'collaboration', label: 'Collab Board', icon: Users },
           { id: 'game', label: 'Training Game', icon: Trophy }
         ].map((t) => (
           <button 
             key={t.id}
             onClick={() => setActiveTab(t.id as any)}
             className={cn(
               "px-8 py-4 rounded-2xl flex items-center space-x-3 border transition-all duration-300",
               activeTab === t.id 
                 ? "bg-brand-blue/10 border-brand-blue/40 text-brand-blue shadow-[0_0_20px_rgba(0,210,255,0.1)]" 
                 : "bg-white/5 border-white/5 text-white/40 hover:text-white hover:bg-white/10"
             )}
           >
              <t.icon size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest">{t.label}</span>
           </button>
         ))}
      </div>

      {/* Dynamic Content Frame */}
      <div className="relative min-h-[600px] bg-black/60 border border-white/5 rounded-[48px] overflow-hidden backdrop-blur-3xl p-12">
         <AnimatePresence mode="wait">
            {activeTab === 'camera' && (
              <motion.div 
                key="camera"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="h-full flex flex-col items-center justify-center space-y-10"
              >
                 <div className="text-center">
                    <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-2">Neural Vision Scanner</h2>
                    <p className="text-xs text-white/40 font-bold uppercase tracking-widest">Real-time genomic OCR pipeline active</p>
                 </div>
                 
                 <div className="relative w-full max-w-2xl aspect-video rounded-[32px] overflow-hidden border-4 border-brand-blue/20 shadow-2xl">
                    <video ref={cameraVideoRef} autoPlay playsInline muted className="w-full h-full object-cover grayscale opacity-60" />
                    {!cameraActive && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80">
                         <Camera size={48} className="text-white/10 mb-6" />
                         <button onClick={startCamera} className="px-8 py-4 bg-brand-blue text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl">Activate Feed</button>
                      </div>
                    )}
                    {cameraActive && (
                      <div className="absolute inset-0 pointer-events-none">
                         <div className="absolute top-8 left-8 w-12 h-12 border-t-2 border-l-2 border-brand-blue" />
                         <div className="absolute bottom-8 right-8 w-12 h-12 border-b-2 border-r-2 border-brand-blue" />
                         <motion.div 
                           animate={{ top: ['0%', '100%'] }} 
                           transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                           className="absolute left-0 right-0 h-0.5 bg-brand-blue shadow-[0_0_15px_rgba(0,210,255,1)]" 
                         />
                      </div>
                    )}
                 </div>

                 <div className="flex items-center space-x-12">
                    <div className="text-center">
                       <div className="text-[10px] font-black text-white/20 uppercase mb-2">Confidence</div>
                       <div className="text-2xl font-black text-brand-blue">98.4%</div>
                    </div>
                    <div className="h-10 w-px bg-white/10" />
                    <div className="text-center">
                       <div className="text-[10px] font-black text-white/20 uppercase mb-2">Processing</div>
                       <div className="text-2xl font-black text-brand-blue">42ms</div>
                    </div>
                 </div>
              </motion.div>
            )}

            {activeTab === 'prediction' && (
              <motion.div 
                key="prediction"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="h-full flex flex-col justify-center max-w-3xl mx-auto space-y-12"
              >
                 <div className="text-center">
                    <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-2">Live Inference Engine</h2>
                    <p className="text-xs text-white/40 font-bold uppercase tracking-widest">Bio-Transformer V4 Active</p>
                 </div>

                 <div className="space-y-8">
                    {predictions.map((p) => (
                      <div key={p.variant} className="space-y-3">
                         <div className="flex items-center justify-between px-2">
                            <span className="text-sm font-black text-white">{p.variant}</span>
                            <span className="text-[10px] font-black text-brand-blue">Threat Index: {p.threat}</span>
                         </div>
                         <div className="h-12 bg-white/5 rounded-2xl border border-white/5 overflow-hidden relative">
                            <motion.div 
                               initial={{ width: 0 }}
                               animate={{ width: `${p.confidence}%` }}
                               className="h-full bg-gradient-to-r from-brand-blue to-purple-500 shadow-[inset_0_0_20px_rgba(255,255,255,0.2)]"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-white">{p.confidence.toFixed(1)}%</span>
                         </div>
                      </div>
                    ))}
                 </div>
              </motion.div>
            )}

            {activeTab === 'protein' && (
              <motion.div key="protein" className="h-full flex flex-col items-center">
                 <div className="text-center mb-8">
                    <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-2">Structural Analysis</h2>
                    <p className="text-xs text-white/40 font-bold uppercase tracking-widest">3D Surface Mapping of Mutation Hotspots</p>
                 </div>
                 
                 <div className={cn(
                    "bg-black/20 rounded-[40px] overflow-hidden relative border border-white/5 transition-all duration-300",
                    isProteinMaximized 
                      ? "fixed inset-0 w-screen h-screen z-50 p-8 flex flex-col justify-center bg-[#020408]" 
                      : "w-full h-[450px]"
                 )}>
                    <button 
                      onClick={() => setIsProteinMaximized(!isProteinMaximized)}
                      className="absolute top-6 right-6 z-30 p-3 bg-black/60 hover:bg-brand-blue hover:text-black rounded-xl backdrop-blur-md border border-white/10 text-white/70 transition-all"
                      title={isProteinMaximized ? "Minimize Viewport" : "Maximize Viewport"}
                    >
                      <Maximize2 size={16} className={cn("transition-transform", isProteinMaximized && "rotate-180")} />
                    </button>
                    <canvas ref={proteinCanvasRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
                 </div>

                 <div className="mt-8 flex items-center space-x-6">
                    <div className="flex items-center space-x-3 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl">
                       <div className="w-2 h-2 bg-red-500 rounded-full" />
                       <span className="text-[10px] font-black text-red-500 uppercase">Mutation Sites (High Risk)</span>
                    </div>
                 </div>
              </motion.div>
            )}

            {activeTab === 'collaboration' && (
              <motion.div key="collaboration" className="h-full flex flex-col">
                 <div className="text-center mb-10">
                    <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-2">Strategy Board</h2>
                    <p className="text-xs text-white/40 font-bold uppercase tracking-widest">Global Institutional Annotation Sync</p>
                 </div>
                 <div className="flex-1 relative bg-black/40 border border-white/5 rounded-[40px] overflow-hidden">
                    <canvas ref={collaborationCanvasRef} className="w-full h-full" />
                    <div className="absolute top-10 right-10 flex items-center space-x-4">
                       <div className="flex -space-x-3">
                          <div className="w-10 h-10 rounded-full border-4 border-black bg-brand-blue flex items-center justify-center text-[10px] font-black">S</div>
                          <div className="w-10 h-10 rounded-full border-4 border-black bg-purple-500 flex items-center justify-center text-[10px] font-black">C</div>
                          <div className="w-10 h-10 rounded-full border-4 border-black bg-red-500 flex items-center justify-center text-[10px] font-black">M</div>
                       </div>
                       <span className="text-[10px] font-black text-white/40 uppercase">3 Online</span>
                    </div>
                    <div className="absolute bottom-10 left-10 p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
                       <div className="text-[9px] font-black text-brand-blue uppercase mb-1">Dr. Sarah Smith</div>
                       <p className="text-[10px] font-medium text-white/80">"Analyzing the S1-S2 junction for drift signals."</p>
                    </div>
                 </div>
              </motion.div>
            )}

            {activeTab === 'game' && (
              <motion.div key="game" className="h-full flex flex-col items-center justify-center space-y-12">
                 <div className="text-center">
                    <h2 className="text-4xl font-black text-white uppercase mb-4">Training Challenge</h2>
                    <p className="text-sm text-white/40 font-medium max-w-sm mx-auto leading-relaxed">
                       Identify the highest risk variant based on current structural and social signals.
                    </p>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
                    {['N501Y', 'E484K', 'L452R'].map((opt) => (
                      <button 
                        key={opt}
                        onClick={() => {
                          setGameScore(s => s + 100);
                          confetti({
                            particleCount: 100,
                            spread: 70,
                            origin: { y: 0.6 },
                            colors: ['#00D2FF', '#ffffff', '#FF1744']
                          });
                          notify('✅ Correct analysis! +100 Points', 'success');
                        }}
                        className="p-10 bg-white/5 border border-white/5 rounded-[32px] hover:bg-brand-blue hover:border-brand-blue transition-all group"
                      >
                         <Trophy size={32} className="text-white/20 group-hover:text-white mb-6 mx-auto" />
                         <div className="text-xl font-black text-white uppercase">{opt}</div>
                         <div className="text-[10px] font-bold text-white/40 group-hover:text-white/60 uppercase mt-2">Select Variant</div>
                      </button>
                    ))}
                 </div>

                 <div className="text-center">
                    <div className="text-[10px] font-black text-brand-blue uppercase tracking-[0.3em] mb-2">Institutional Score</div>
                    <div className="text-5xl font-black text-white">{gameScore}</div>
                 </div>
              </motion.div>
            )}
         </AnimatePresence>
      </div>

      {/* Feature Checklist Footer */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12 border-t border-white/5">
         <CheckItem label="Real-time Vision" />
         <CheckItem label="3D Structural AR" />
         <CheckItem label="Predictive AI" />
         <CheckItem label="Multi-User Sync" />
      </div>
    </div>
  );
}

const CheckItem = ({ label }: { label: string }) => (
  <div className="flex items-center space-x-3 text-white/20">
     <CheckCircle2 size={16} className="text-brand-blue" />
     <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
  </div>
);

const Dna = ({ className, size = 24 }: { className?: string, size?: number }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M8 3v3a2 2 0 0 1-2 2H3" />
    <path d="M21 8h-3a2 2 0 0 1-2-2V3" />
    <path d="M3 16h3a2 2 0 0 1 2 2v3" />
    <path d="M16 21v-3a2 2 0 0 1 2-2h3" />
    <path d="M15 15l1-1" />
    <path d="M9 9l1-1" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);
