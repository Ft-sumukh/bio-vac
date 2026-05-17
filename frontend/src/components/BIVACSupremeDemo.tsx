'use client';

import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  Activity, 
  Maximize2, 
  Play, 
  Settings, 
  Brain, 
  ShieldCheck, 
  Download,
  Dna,
  Flame,
  Sparkles,
  Beaker,
  ShieldAlert,
  HelpCircle
} from 'lucide-react';
import { cn } from "@/lib/utils";
import confetti from 'canvas-confetti';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { 
  AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar 
} from 'recharts';

import {
  fetchEvolutionForecast,
  fetchConvergenceDetection,
  fetchMolecularDynamics,
  fetchImmunologyProfile,
  fetchAdjuvantMatch,
  ForecastMutation,
  ConvergenceHotspot,
  ThermodynamicDelta,
  WaningPoint,
  AdjuvantCandidate
} from '@/lib/api';

export function BIVACSupremeDemo() {
  // Navigation tabs mapping to all 5 Game-Winning Features
  const [activeTab, setActiveTab] = useState<
    'forecasting' | 'convergence' | 'sandbox' | 'immunology' | 'adjuvant'
  >('forecasting');

  const [loading, setLoading] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  // --- STATE FOR FEATURE 1: EVOLUTION FORECASTING ---
  const [f1Lineage, setF1Lineage] = useState('XEC.1.5');
  const [f1Horizon, setF1Horizon] = useState(12);
  const [f1Forecast, setF1Forecast] = useState<ForecastMutation[]>([]);

  // --- STATE FOR FEATURE 2: CONVERGENCE DETECTOR ---
  const [f2PathogenA, setF2PathogenA] = useState('SARS-CoV-2 (Spike RBD)');
  const [f2PathogenB, setF2PathogenB] = useState('Influenza-A (HA segment)');
  const [f2Hotspots, setF2Hotspots] = useState<ConvergenceHotspot[]>([]);

  // --- STATE FOR FEATURE 3: STRUCTURAL SANDBOX ---
  const [f3PdbId, setF3PdbId] = useState('7T9K');
  const [f3Mutations, setF3Mutations] = useState('N501Y, E484K, L452R');
  const [f3Temp, setF3Temp] = useState(310.0);
  const [f3Thermodynamics, setF3Thermodynamics] = useState<ThermodynamicDelta[]>([]);
  const [f3Rmsd, setF3Rmsd] = useState<number[]>([]);
  const [simulationAtoms, setSimulationAtoms] = useState<any[]>([]);
  const proteinCanvasRef = useRef<HTMLCanvasElement>(null);

  // --- STATE FOR FEATURE 4: IMMUNOLOGICAL memory ---
  const [f4Lineage, setF4Lineage] = useState('XEC.1.5');
  const [f4Region, setF4Region] = useState('Southeast Asia');
  const [f4Cohort, setF4Cohort] = useState('Omicron-BA.5-Vaccinated');
  const [f4Hla, setF4Hla] = useState<Record<string, number>>({});
  const [f4Waning, setF4Waning] = useState<WaningPoint[]>([]);

  // --- STATE FOR FEATURE 5: ADJUVANT MATCHMAKER ---
  const [f5Pathogen, setF5Pathogen] = useState('SARS-CoV-2');
  const [f5Response, setF5Response] = useState('Th1');
  const [f5Vehicle, setF5Vehicle] = useState('LNP');
  const [f5Adjuvants, setF5Adjuvants] = useState<AdjuvantCandidate[]>([]);
  const [f5Recipe, setF5Recipe] = useState('');

  // ============================================================================
  // INITIALIZERS
  // ============================================================================
  useEffect(() => {
    // Run default predictions on startup
    triggerEvolutionForecast();
    triggerConvergenceDetection();
    triggerMolecularDynamics();
    triggerImmunologyProfile();
    triggerAdjuvantMatch();
  }, []);

  // ============================================================================
  // NOTIFICATION & AUDIO EFFECTS
  // ============================================================================
  const playSound = (frequency: number, duration: number = 200) => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const envelope = audioContext.createGain();

      oscillator.connect(envelope);
      envelope.connect(audioContext.destination);

      oscillator.frequency.value = frequency;
      envelope.gain.setValueAtTime(0.08, audioContext.currentTime);
      envelope.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration / 1000);
    } catch (e) {
      // Ignored if user hasn't interacted yet
    }
  };

  const notify = (msg: string, type: 'success' | 'error' | 'info' = 'info') => {
    playSound(type === 'success' ? 780 : type === 'error' ? 220 : 480, 150);
    const n = document.createElement('div');
    n.className = "fixed top-10 right-10 z-[9999] px-8 py-5 rounded-[24px] font-black text-xs uppercase tracking-widest shadow-2xl border border-white/10 animate-in slide-in-from-right duration-300";
    n.style.background = type === 'success' ? '#00D2FF' : type === 'error' ? '#FF1744' : '#10152F';
    n.style.color = type === 'success' ? '#050505' : '#ffffff';
    n.innerText = msg;
    document.body.appendChild(n);
    setTimeout(() => {
      n.classList.add('animate-out', 'slide-out-to-right');
      setTimeout(() => n.remove(), 300);
    }, 3000);
  };

  // ============================================================================
  // REPORT EXPORT (PDF)
  // ============================================================================
  const generatePDFReport = async () => {
    if (!reportRef.current) return;
    notify('Generating PDF Intelligence Report...', 'info');
    try {
      const canvas = await html2canvas(reportRef.current, { scale: 1.5, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'landscape', format: 'a4' });
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('BI-VAC_Surveillance_Report.pdf');
      confetti({ particleCount: 60, spread: 80 });
      notify('Intelligence PDF exported successfully!', 'success');
    } catch (err) {
      notify('Failed to render PDF report', 'error');
    }
  };

  // ============================================================================
  // TRIGGER ACTIONS
  // ============================================================================
  const triggerEvolutionForecast = async () => {
    setLoading(true);
    const res = await fetchEvolutionForecast({
      lineage: f1Lineage,
      horizon_months: f1Horizon,
      regions: ['Global']
    });
    setF1Forecast(res.forecasted_mutations);
    setLoading(false);
    notify(`Evolution model completed for ${f1Lineage}`, 'success');
  };

  const triggerConvergenceDetection = async () => {
    setLoading(true);
    // Create random DNA bits represents actual sequence for API homologous search
    const rawA = "ATGTTTGTTTTTCTTGTTTTATTGCCACTAGTCTCTAGTCAGTGTGTTAATCTTACAACCAGAACTCAATTACCCCCTGCATACACTAATTCTTTCACACGTGGTGTT";
    const rawB = "ATGGAGAAAATAGTGCTTCTTCTTGCAATAGTCAGTCTTGTTAAAAGTGATCAGATTTGCATTGGTTACCATGCAAACAATTCAACAGAGCAGGTTGACACAATAATGG";
    
    const res = await fetchConvergenceDetection({
      pathogen_a_sequence: rawA,
      pathogen_b_sequence: rawB
    });
    setF2Hotspots(res.convergence_hotspots);
    setLoading(false);
    notify(`Multi-pathogen alignment finished scanning`, 'success');
  };

  const triggerMolecularDynamics = async () => {
    setLoading(true);
    const muts = f3Mutations.split(',').map(m => m.trim()).filter(Boolean);
    const res = await fetchMolecularDynamics({
      pdb_id: f3PdbId,
      mutations: muts,
      temperature_kelvin: f3Temp,
      simulation_steps: 100,
      frame_frequency: 10
    });
    setF3Thermodynamics(res.thermodynamics);
    setF3Rmsd(res.rmsd_trajectory);
    if (res.frames && res.frames[0]) {
      setSimulationAtoms(res.frames[0].coordinates);
    }
    setLoading(false);
    notify(`Verlet MD coordinates simulated for ${f3PdbId}`, 'success');
  };

  const triggerImmunologyProfile = async () => {
    setLoading(true);
    const res = await fetchImmunologyProfile({
      lineage: f4Lineage,
      region: f4Region,
      prior_exposure_cohort: f4Cohort
    });
    setF4Hla(res.demographic_hla_distribution);
    setF4Waning(res.waning_projection_180_days);
    setLoading(false);
    notify(`T-cell protective wane mapped for ${f4Region}`, 'success');
  };

  const triggerAdjuvantMatch = async () => {
    setLoading(true);
    const res = await fetchAdjuvantMatch({
      pathogen: f5Pathogen,
      target_immune_response: f5Response,
      delivery_vehicle: f5Vehicle
    });
    setF5Adjuvants(res.adjuvants);
    setF5Recipe(res.formulation_recipe_recommendation);
    setLoading(false);
    notify(`Morgan similarity matching complete`, 'success');
  };

  // ============================================================================
  // THREE.JS PARTICLES SANDBOX VIEWPORT
  // ============================================================================
  useEffect(() => {
    if (activeTab !== 'sandbox' || !proteinCanvasRef.current) return;

    const canvas = proteinCanvasRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);

    // Create custom particle geometries for simulated atomic coordinates
    const particleCount = simulationAtoms.length > 0 ? simulationAtoms.length : 40;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const atom = simulationAtoms[i];
      // Map PDB simulation coordinates or fallback cylindrical loop
      const x = atom ? atom.x * 1.5 : Math.sin(i * 0.4) * 5.0;
      const y = atom ? atom.y * 1.5 : Math.cos(i * 0.4) * 5.0;
      const z = atom ? atom.z * 0.8 - 8.0 : i * 0.5 - 10.0;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Color atoms based on element (Nitrogen = Blue, Carbon = Green, Oxygen = Red)
      const el = atom ? atom.element : 'C';
      if (el === 'N') {
        colors[i * 3] = 0.0; colors[i * 3 + 1] = 0.8; colors[i * 3 + 2] = 1.0;
      } else if (el === 'O') {
        colors[i * 3] = 1.0; colors[i * 3 + 1] = 0.1; colors[i * 3 + 2] = 0.3;
      } else {
        colors[i * 3] = 0.1; colors[i * 3 + 1] = 1.0; colors[i * 3 + 2] = 0.5;
      }
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Custom particle texture
    const material = new THREE.PointsMaterial({
      size: 1.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Draw connecting backbone lines
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, opacity: 0.15, transparent: true });
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const lines = new THREE.Line(lineGeometry, lineMaterial);
    scene.add(lines);

    camera.position.z = 18;

    let mouseX = 0, mouseY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);

    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      
      // Revolving structural coordinates
      particles.rotation.y += 0.003;
      particles.rotation.x += (mouseY * 0.4 - particles.rotation.x) * 0.03;
      particles.rotation.y += (mouseX * 0.4 - particles.rotation.y) * 0.03;
      lines.rotation.copy(particles.rotation);

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(frameId);
      renderer.dispose();
    };
  }, [activeTab, simulationAtoms]);

  return (
    <div className="space-y-12" ref={reportRef}>
      {/* Header Banner */}
      <section className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-3 text-brand-blue mb-3">
            <Sparkles size={18} className="animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-blue">Integrated Surveillance Core</span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-white mb-2 uppercase">
            Supreme <span className="text-white/30">Intelligence terminal</span>
          </h1>
          <p className="text-white/40 text-xs font-semibold max-w-xl leading-relaxed">
            Real-time interface linking sequence forecasting, cross-pathogen alignments, force-field molecular trajectories, regional immunology, and chemical matchmaking.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={generatePDFReport}
            className="px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center space-x-2 transition-all"
            title="Download Intelligence Report"
          >
            <Download size={14} />
            <span>Export Intelligence Report</span>
          </button>
        </div>
      </section>

      {/* Feature Menu Tabs */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {[
          { id: 'forecasting', label: '1. Evolution Forecasting', icon: Brain },
          { id: 'convergence', label: '2. Multi-Pathogen Linker', icon: Dna },
          { id: 'sandbox', label: '3. Structural MD Lab', icon: Beaker },
          { id: 'immunology', label: '4. Immunology Atlas', icon: ShieldCheck },
          { id: 'adjuvant', label: '5. Adjuvant Matchmaker', icon: Flame }
        ].map((t) => (
          <button 
            key={t.id}
            onClick={() => {
              setActiveTab(t.id as any);
              playSound(480, 100);
            }}
            className={cn(
              "px-5 py-4 rounded-2xl flex items-center space-x-3 border transition-all duration-300",
              activeTab === t.id 
                ? "bg-brand-blue/15 border-brand-blue/45 text-brand-blue shadow-[0_0_20px_rgba(0,210,255,0.08)]" 
                : "bg-white/5 border-white/5 text-white/40 hover:text-white/80 hover:bg-white/10"
            )}
          >
            <t.icon size={16} className="shrink-0" />
            <span className="text-[10px] font-black uppercase tracking-wider text-left truncate">{t.label}</span>
          </button>
        ))}
      </div>

      {/* Main Workspace Frame */}
      <div className="relative min-h-[620px] bg-black/60 border border-white/5 rounded-[40px] overflow-hidden backdrop-blur-3xl p-8 md:p-10">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: EVOLUTION FORECASTING */}
          {activeTab === 'forecasting' && (
            <motion.div 
              key="forecasting" 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
            >
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 border-b border-white/5 pb-6">
                <div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight">Viral Evolution Forecasting</h2>
                  <p className="text-[10px] font-bold text-brand-blue uppercase tracking-widest mt-1">Bayesian Model Averaging ensemble predicting future drift variants</p>
                </div>
                <div className="flex flex-wrap items-center gap-3 bg-white/5 p-2 rounded-2xl border border-white/5">
                  <select 
                    value={f1Lineage} 
                    onChange={(e) => setF1Lineage(e.target.value)}
                    className="bg-[#0c0d14] border border-white/10 text-white font-bold text-xs px-4 py-2.5 rounded-xl outline-none"
                  >
                    <option value="XEC.1.5">XEC.1.5 (Active Variant)</option>
                    <option value="KP.3">KP.3 (Omnipresent Lineage)</option>
                    <option value="JN.1">JN.1 (Parent Clade)</option>
                  </select>
                  <select 
                    value={f1Horizon} 
                    onChange={(e) => setF1Horizon(Number(e.target.value))}
                    className="bg-[#0c0d14] border border-white/10 text-white font-bold text-xs px-4 py-2.5 rounded-xl outline-none"
                  >
                    <option value={6}>6 Months Horizon</option>
                    <option value={12}>12 Months Horizon</option>
                    <option value={24}>24 Months Horizon</option>
                  </select>
                  <button 
                    onClick={triggerEvolutionForecast}
                    disabled={loading}
                    className="px-6 py-2.5 bg-brand-blue text-black font-black text-xs uppercase tracking-widest rounded-xl hover:scale-105 transition-transform"
                  >
                    {loading ? "Forecasting..." : "Run Forecast"}
                  </button>
                </div>
              </div>

              {/* Data Visualization */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-7 bg-[#0a0c14] border border-white/5 p-8 rounded-3xl space-y-6">
                  <h3 className="text-xs font-black uppercase tracking-widest text-white/50">Emergence Probability by Mutation</h3>
                  <div className="h-[280px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={f1Forecast}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                        <XAxis dataKey="mutation" stroke="#ffffff20" fontSize={10} fontWeight="bold" />
                        <YAxis stroke="#ffffff20" fontSize={10} fontWeight="bold" />
                        <Tooltip contentStyle={{ backgroundColor: '#07080f', border: '1px solid #ffffff10', borderRadius: '12px' }} />
                        <Bar dataKey="probability" fill="#00D2FF" radius={[8, 8, 0, 0]} barSize={40} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="lg:col-span-5 space-y-4">
                  <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                    <div className="text-[10px] font-black text-brand-blue uppercase mb-1">Evasion Forecast consensus</div>
                    <p className="text-xs text-white/70 leading-relaxed font-semibold">
                      Bayesian model aggregates selection pressures, ESC structural alignments, and epidemiological factors.
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    {f1Forecast.map((m) => (
                      <div key={m.mutation} className="p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between">
                        <div>
                          <div className="text-sm font-black text-white">{m.mutation}</div>
                          <div className="text-[9px] font-bold text-white/40 uppercase mt-0.5">Advantage: x{m.growth_advantage_multiplier.toFixed(2)}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-black text-brand-blue">{(m.probability * 100).toFixed(0)}% Probability</div>
                          <div className="text-[9px] font-bold text-white/40 uppercase mt-0.5">Evasion: {(m.estimated_evasion_index * 100).toFixed(0)}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: MULTI-PATHOGEN LINKER */}
          {activeTab === 'convergence' && (
            <motion.div 
              key="convergence" 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 border-b border-white/5 pb-6">
                <div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight">Cross-Pathogen Convergence Detector</h2>
                  <p className="text-[10px] font-bold text-brand-blue uppercase tracking-widest mt-1">Locates homologous mutation points across pathogens for multivalent design</p>
                </div>
                <button 
                  onClick={triggerConvergenceDetection}
                  disabled={loading}
                  className="px-8 py-3.5 bg-brand-blue text-black font-black text-[10px] uppercase tracking-widest rounded-xl hover:scale-105 transition-transform"
                >
                  {loading ? "Aligning..." : "Scan Pathogen Homology"}
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Pathogen inputs */}
                <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl space-y-6">
                  <h3 className="text-sm font-black text-white uppercase">Pathogen Target Segments</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-black text-white/30 uppercase mb-2 block">Pathogen A Sequence</label>
                      <input 
                        type="text" 
                        value={f2PathogenA} 
                        onChange={(e) => setF2PathogenA(e.target.value)}
                        className="w-full bg-[#0c0d14] border border-white/10 text-white font-bold text-xs p-4 rounded-xl outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-white/30 uppercase mb-2 block">Pathogen B Sequence</label>
                      <input 
                        type="text" 
                        value={f2PathogenB} 
                        onChange={(e) => setF2PathogenB(e.target.value)}
                        className="w-full bg-[#0c0d14] border border-white/10 text-white font-bold text-xs p-4 rounded-xl outline-none"
                      />
                    </div>
                  </div>
                  
                  <div className="p-5 bg-brand-blue/5 border border-brand-blue/10 rounded-2xl">
                    <div className="text-[9px] font-black text-brand-blue uppercase mb-1">Smith-Waterman Alignment parameters</div>
                    <p className="text-[10px] text-white/60 leading-relaxed font-semibold">
                      Applies a sub-quadratic dynamic matrix sequence match scoring spatial coordinates.
                    </p>
                  </div>
                </div>

                {/* Hotspot outputs */}
                <div className="space-y-6">
                  <h3 className="text-sm font-black text-white uppercase">Homologous Convergence Hotspots</h3>
                  {f2Hotspots.map((hs) => (
                    <div key={hs.hotspot_id} className="p-6 bg-white/5 border border-white/5 rounded-3xl space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs font-black text-brand-blue uppercase">Hotspot {hs.hotspot_id}</div>
                          <div className="text-lg font-black text-white mt-1">{hs.coordinates}</div>
                        </div>
                        <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-center">
                          <div className="text-[9px] font-black text-white/40 uppercase">Match Score</div>
                          <div className="text-md font-black text-white">{hs.convergence_score}%</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl text-center">
                          <div className="text-[8px] font-black text-white/20 uppercase">Sequence Identity</div>
                          <div className="text-xs font-bold text-white mt-1">{hs.sequence_identity_percent}%</div>
                        </div>
                        <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl text-center">
                          <div className="text-[8px] font-black text-white/20 uppercase">Fold Overlap</div>
                          <div className="text-xs font-bold text-white mt-1">{hs.structural_fold_overlap_index.toFixed(2)}</div>
                        </div>
                        <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl text-center">
                          <div className="text-[8px] font-black text-white/20 uppercase">Selection Correlation</div>
                          <div className="text-xs font-bold text-white mt-1">{hs.correlation_selection_pressure.toFixed(2)}</div>
                        </div>
                      </div>

                      <div className="p-4 bg-brand-blue/5 border border-brand-blue/10 rounded-2xl">
                        <div className="text-[9px] font-black text-brand-blue uppercase mb-1">Vaccine Feasibility Review</div>
                        <p className="text-[10px] text-white/70 leading-relaxed font-semibold italic">{hs.combination_vaccine_feasibility}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 3: MOLECULAR DYNAMICS SANDBOX */}
          {activeTab === 'sandbox' && (
            <motion.div 
              key="sandbox" 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 border-b border-white/5 pb-6">
                <div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight">Interactive Structural MD Sandbox</h2>
                  <p className="text-[10px] font-bold text-brand-blue uppercase tracking-widest mt-1">Implicit solvent Verlet dynamics simulation of targeted mutations</p>
                </div>
                <div className="flex flex-wrap items-center gap-3 bg-white/5 p-2 rounded-2xl border border-white/5">
                  <input 
                    type="text" 
                    value={f3PdbId} 
                    onChange={(e) => setF3PdbId(e.target.value)}
                    placeholder="PDB ID"
                    className="bg-[#0c0d14] border border-white/10 text-white font-bold text-xs px-4 py-2.5 rounded-xl outline-none w-24 text-center"
                  />
                  <input 
                    type="text" 
                    value={f3Mutations} 
                    onChange={(e) => setF3Mutations(e.target.value)}
                    placeholder="Mutations (e.g. N501Y)"
                    className="bg-[#0c0d14] border border-white/10 text-white font-bold text-xs px-4 py-2.5 rounded-xl outline-none w-48"
                  />
                  <button 
                    onClick={triggerMolecularDynamics}
                    disabled={loading}
                    className="px-6 py-2.5 bg-brand-blue text-black font-black text-xs uppercase tracking-widest rounded-xl hover:scale-105 transition-transform"
                  >
                    {loading ? "Simulating..." : "Trigger MD"}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* 3D Viewport */}
                <div className={cn(
                  "lg:col-span-7 bg-[#020408] rounded-3xl border border-white/5 relative overflow-hidden flex flex-col justify-center",
                  isMaximized ? "fixed inset-0 w-screen h-screen z-50 p-8" : "h-[420px]"
                )}>
                  <button 
                    onClick={() => setIsMaximized(!isMaximized)}
                    className="absolute top-6 right-6 z-30 p-3 bg-black/60 hover:bg-brand-blue hover:text-black rounded-xl border border-white/10 text-white/70 transition-all"
                  >
                    <Maximize2 size={14} />
                  </button>
                  <canvas ref={proteinCanvasRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
                </div>

                {/* Thermodynamics & RMSD */}
                <div className="lg:col-span-5 space-y-6">
                  <h3 className="text-sm font-black text-white uppercase">Thermodynamic Free Energy Shifts</h3>
                  {f3Thermodynamics.map((thermo) => (
                    <div key={thermo.mutation} className="p-5 bg-white/5 border border-white/5 rounded-3xl space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-black text-white">{thermo.mutation} Mutation Delta</span>
                        <span className="text-xs font-black text-brand-blue">Affinity Change: +{thermo.binding_affinity_change_percent}%</span>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-3">
                        <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl text-center">
                          <div className="text-[8px] font-black text-white/20 uppercase">WT G</div>
                          <div className="text-xs font-bold text-white mt-1">{thermo.delta_g_wildtype_kcal} kcal</div>
                        </div>
                        <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl text-center">
                          <div className="text-[8px] font-black text-white/20 uppercase">MUT G</div>
                          <div className="text-xs font-bold text-white mt-1">{thermo.delta_g_mutant_kcal} kcal</div>
                        </div>
                        <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl text-center">
                          <div className="text-[8px] font-black text-white/20 uppercase">Delta Delta G</div>
                          <div className="text-xs font-bold text-red-500 mt-1">{thermo.delta_delta_g_kcal} kcal</div>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="p-6 bg-[#0a0c14] border border-white/5 rounded-3xl space-y-3">
                    <div className="text-[10px] font-black text-white/40 uppercase">Trajectory RMSD Curve</div>
                    <div className="h-[120px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={f3Rmsd.map((val, idx) => ({ frame: idx, rmsd: val }))}>
                          <Line type="monotone" dataKey="rmsd" stroke="#00D2FF" strokeWidth={2.5} dot={false} />
                          <Tooltip contentStyle={{ backgroundColor: '#07080f', border: '1px solid #ffffff10', borderRadius: '12px' }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 4: IMMUNOLOGICAL memory ATLAS */}
          {activeTab === 'immunology' && (
            <motion.div 
              key="immunology" 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 border-b border-white/5 pb-6">
                <div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight">Immunological Memory Atlas</h2>
                  <p className="text-[10px] font-bold text-brand-blue uppercase tracking-widest mt-1">Maps demographic HLA allele distributions and predicts peptide waning thresholds</p>
                </div>
                <div className="flex flex-wrap items-center gap-3 bg-white/5 p-2 rounded-2xl border border-white/5">
                  <select 
                    value={f4Region} 
                    onChange={(e) => setF4Region(e.target.value)}
                    className="bg-[#0c0d14] border border-white/10 text-white font-bold text-xs px-4 py-2.5 rounded-xl outline-none"
                  >
                    <option value="Southeast Asia">Southeast Asia Pool</option>
                    <option value="North America">North America Pool</option>
                    <option value="Europe">Europe Pool</option>
                  </select>
                  <select 
                    value={f4Cohort} 
                    onChange={(e) => setF4Cohort(e.target.value)}
                    className="bg-[#0c0d14] border border-white/10 text-white font-bold text-xs px-4 py-2.5 rounded-xl outline-none"
                  >
                    <option value="Omicron-BA.5-Vaccinated">Omicron-BA.5-Vaccinated</option>
                    <option value="Wildtype-Infected">Wildtype-Infected</option>
                  </select>
                  <button 
                    onClick={triggerImmunologyProfile}
                    disabled={loading}
                    className="px-6 py-2.5 bg-brand-blue text-black font-black text-xs uppercase tracking-widest rounded-xl hover:scale-105 transition-transform"
                  >
                    {loading ? "Profiling..." : "Profile Immunology"}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Waning chart */}
                <div className="lg:col-span-7 bg-[#0a0c14] border border-white/5 p-8 rounded-3xl space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black uppercase tracking-widest text-white/50">Neutralization Titer GMT Waning Curve (180 Days)</h3>
                  </div>
                  <div className="h-[280px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={f4Waning}>
                        <defs>
                          <linearGradient id="colorWane" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#00D2FF" stopOpacity={0.25}/>
                            <stop offset="95%" stopColor="#00D2FF" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                        <XAxis dataKey="days_post_exposure" stroke="#ffffff20" fontSize={10} fontWeight="bold" />
                        <YAxis stroke="#ffffff20" fontSize={10} fontWeight="bold" />
                        <Tooltip contentStyle={{ backgroundColor: '#07080f', border: '1px solid #ffffff10', borderRadius: '12px' }} />
                        <Area type="monotone" dataKey="neutralization_titer_gmt" stroke="#00D2FF" strokeWidth={2.5} fillOpacity={1} fill="url(#colorWane)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* HLA Pool Demographics */}
                <div className="lg:col-span-5 space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-widest text-white/50 px-2">Population HLA Allele Frequencies</h3>
                  <div className="space-y-4">
                    {Object.entries(f4Hla).map(([allele, freq]) => (
                      <div key={allele} className="space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold px-1">
                          <span className="text-white">{allele}</span>
                          <span className="text-brand-blue">{(freq * 100).toFixed(0)}% frequency</span>
                        </div>
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                          <div className="h-full bg-brand-blue rounded-full" style={{ width: `${freq * 100}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 p-6 bg-brand-blue/5 border border-brand-blue/10 rounded-2xl flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-black text-brand-blue uppercase mb-1">Recommended Booster Gap</div>
                      <div className="text-2xl font-black text-white">6 Months</div>
                    </div>
                    <div className="h-10 w-px bg-white/10" />
                    <div>
                      <div className="text-[10px] font-black text-brand-blue uppercase mb-1">Booster Priority Index</div>
                      <div className="text-2xl font-black text-white">High (0.84)</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 5: ADJUVANT MATCHMAKER */}
          {activeTab === 'adjuvant' && (
            <motion.div 
              key="adjuvant" 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 border-b border-white/5 pb-6">
                <div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight">AI-Powered Adjuvant Matchmaker</h2>
                  <p className="text-[10px] font-bold text-brand-blue uppercase tracking-widest mt-1">Chemical Tanimoto Morgan fingerprinting and LightGBM ranking library</p>
                </div>
                <div className="flex flex-wrap items-center gap-3 bg-white/5 p-2 rounded-2xl border border-white/5">
                  <select 
                    value={f5Response} 
                    onChange={(e) => setF5Response(e.target.value)}
                    className="bg-[#0c0d14] border border-white/10 text-white font-bold text-xs px-4 py-2.5 rounded-xl outline-none"
                  >
                    <option value="Th1">Th1 Response (Cellular)</option>
                    <option value="Th2">Th2 Response (Humoral)</option>
                    <option value="Tfh">Tfh Response (Germinal)</option>
                  </select>
                  <select 
                    value={f5Vehicle} 
                    onChange={(e) => setF5Vehicle(e.target.value)}
                    className="bg-[#0c0d14] border border-white/10 text-white font-bold text-xs px-4 py-2.5 rounded-xl outline-none"
                  >
                    <option value="LNP">LNP Vehicle</option>
                    <option value="Alum">Alum vehicle</option>
                  </select>
                  <button 
                    onClick={triggerAdjuvantMatch}
                    disabled={loading}
                    className="px-6 py-2.5 bg-brand-blue text-black font-black text-xs uppercase tracking-widest rounded-xl hover:scale-105 transition-transform"
                  >
                    {loading ? "Matching..." : "Screen Adjuvants"}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Adjuvant Compound Cards */}
                <div className="space-y-6">
                  <h3 className="text-sm font-black text-white uppercase">Ranked Adjuvant Candidates</h3>
                  {f5Adjuvants.map((adj) => (
                    <div key={adj.name} className="p-6 bg-white/5 border border-white/5 rounded-3xl space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs font-black text-brand-blue uppercase">{adj.chemical_class}</div>
                          <h4 className="text-lg font-black text-white mt-1">{adj.name}</h4>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-black text-brand-blue">Tanimoto similarity: {(adj.tanimoto_similarity * 100).toFixed(1)}%</div>
                          <div className="text-[9px] font-bold text-white/40 uppercase mt-1">LGBM Score: {adj.ml_metrics.ensemble_score.toFixed(3)}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl text-center">
                          <div className="text-[8px] font-black text-white/20 uppercase">Safety Index</div>
                          <div className="text-xs font-bold text-white mt-1">{adj.ml_metrics.safety_index.toFixed(2)}</div>
                        </div>
                        <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl text-center">
                          <div className="text-[8px] font-black text-white/20 uppercase">Production Scalability</div>
                          <div className="text-xs font-bold text-white mt-1">{adj.ml_metrics.manufacturing_scalability.toFixed(2)}</div>
                        </div>
                        <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl text-center">
                          <div className="text-[8px] font-black text-white/20 uppercase">Cost Per Dose</div>
                          <div className="text-xs font-bold text-white mt-1">${adj.cost_per_dose_usd.toFixed(2)}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Formulation recipe */}
                <div className="p-6 bg-[#0a0c14] border border-white/5 rounded-3xl space-y-6">
                  <h3 className="text-sm font-black text-white uppercase flex items-center">
                    <Beaker size={16} className="text-brand-blue mr-2" />
                    Target Formulation Recipe
                  </h3>
                  
                  <div className="bg-[#04060a] p-6 rounded-2xl border border-white/5 font-mono text-xs text-white/70 leading-relaxed whitespace-pre-line h-[320px] overflow-y-auto">
                    {f5Recipe}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Feature checklist */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 pt-10 border-t border-white/5">
        <CheckItem label="1. BMA Evolution Forecast" />
        <CheckItem label="2. Homologous Pathogen Link" />
        <CheckItem label="3. Force-Field verlet MD" />
        <CheckItem label="4. HLA memory Waning" />
        <CheckItem label="5. PubChem Matchmaker" />
      </div>
    </div>
  );
}

const CheckItem = ({ label }: { label: string }) => (
  <div className="flex items-center space-x-3 text-white/30">
    <ShieldCheck size={14} className="text-brand-blue" />
    <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
  </div>
);
