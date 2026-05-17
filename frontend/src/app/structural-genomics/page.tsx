"use client";

import React, { useRef, useState, useMemo, useEffect, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, Float } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Layers, ShieldAlert, Cpu, Camera, Activity, RotateCcw, 
  Search, Hand, Power, AlertCircle, RefreshCw, Crosshair, 
  Lock, SlidersHorizontal, Eye, EyeOff, Download, Undo2, 
  Redo2, HelpCircle, CheckCircle2, Settings, Sparkles, Compass
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useHandTracking, GestureType, GestureSettings, GestureHistoryItem } from '@/hooks/useHandTracking';

// --- VISUALIZATION PALETTES ---
const SCHEME_PALETTES: Record<string, { main: string; emissive: string; glow: string }> = {
  'Cyber Cyan': { main: '#00D2FF', emissive: '#001133', glow: 'rgba(0,210,255,0.4)' },
  'Toxic Amber': { main: '#FFB300', emissive: '#332200', glow: 'rgba(255,179,0,0.4)' },
  'Critical Ruby': { main: '#FF1744', emissive: '#330005', glow: 'rgba(255,23,68,0.4)' },
  'Emerald Bio': { main: '#00E676', emissive: '#002205', glow: 'rgba(0,230,118,0.4)' },
};

// --- DEFAULT SETTINGS ---
const DEFAULT_SETTINGS: GestureSettings & {
  modelQuality: string;
  colorScheme: string;
  resolutionScale: number;
  showGrid: boolean;
  showAxes: boolean;
  showLabels: boolean;
  showFps: boolean;
  hardwareAcceleration: boolean;
} = {
  // Tab 1: Visualization Settings
  modelQuality: 'Medium',
  colorScheme: 'Cyber Cyan',
  resolutionScale: 1.0,

  // Tab 2: Gesture Sensitivity
  gestureThreshold: 0.7,
  smoothingFactor: 0.12,
  responseDelay: 50,

  // Tab 3: Display Options
  showGrid: false,
  showAxes: false,
  showLabels: true,

  // Tab 4: Performance & Diagnostics
  showFps: true,
  hardwareAcceleration: true,
  debugMode: false,
};

// --- MULTI-VARIANT MODELS ---
interface AtomData {
  position: THREE.Vector3;
  id: string;
  type: 'NORMAL' | 'MUTATION';
  severity: number;
  name: string;
}

const VARIANT_GENOMICS: Record<string, { title: string; lineage: string; description: string; alertLevel: string; evasionScore: number; mutationProb: number }> = {
  'Original': {
    title: 'SARS-CoV-2 Wildtype',
    lineage: 'Wuhan-Hu-1',
    description: 'Ancestral reference strain identified in December 2019. Lacks modern escape-mutations.',
    alertLevel: 'LOW THREAT',
    evasionScore: 12,
    mutationProb: 0.02
  },
  'BA.2': {
    title: 'Omicron Variant BA.2',
    lineage: 'Stealth Omicron',
    description: 'Highly contagious sub-lineage showing moderate neutralization escape from early vaccines.',
    alertLevel: 'MODERATE RISK',
    evasionScore: 68,
    mutationProb: 0.08
  },
  'JN.1': {
    title: 'JN.1 Evasion Spike',
    lineage: 'Pirola Descendant',
    description: 'Possesses critical L455F evasion mutation in the spike protein receptor-binding domain.',
    alertLevel: 'CRITICAL ESCAPE',
    evasionScore: 96,
    mutationProb: 0.16
  }
};

// --- THREEJS INNER MODELS & SHADER SCENE ---
interface ProteinModelProps {
  renderMode: string;
  variantKey: string;
  mutationActive: boolean;
  colorScheme: string;
  quality: string;
  setHoveredAtom: (atom: AtomData | null) => void;
  clickedPoints: THREE.Vector3[];
  onAtomClick: (pos: THREE.Vector3) => void;
  modelRotation: [number, number, number];
  setModelRotation: (rot: [number, number, number]) => void;
}

const ProteinModelMesh = ({
  renderMode,
  variantKey,
  mutationActive,
  colorScheme,
  quality,
  setHoveredAtom,
  clickedPoints,
  onAtomClick,
  modelRotation,
  setModelRotation
}: ProteinModelProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const { clock } = useThree();

  // Settings for Geometry Segments depending on Quality
  const sphereQuality = quality === 'High' ? 32 : quality === 'Medium' ? 16 : 8;
  const cylinderQuality = quality === 'High' ? 12 : quality === 'Medium' ? 8 : 4;

  const variantStats = VARIANT_GENOMICS[variantKey] || VARIANT_GENOMICS['JN.1'];

  // Generate atoms procedurally with deterministic seeds based on variant mutation probability
  const atoms = useMemo(() => {
    const points: AtomData[] = [];
    const count = 350;
    
    // Simple deterministic pseudorandom generator to keep structures consistent per variant
    let seed = variantKey === 'Original' ? 123 : variantKey === 'BA.2' ? 456 : 789;
    const random = () => {
      const x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };

    for (let i = 0; i < count; i++) {
      const angle = i * 0.45;
      const radius = 3.5 + Math.sin(i * 0.12) * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = (i / count) * 18 - 9;
      
      const pos = new THREE.Vector3(x, y, z);
      pos.x += (random() - 0.5) * 0.6;
      pos.y += (random() - 0.5) * 0.6;
      pos.z += (random() - 0.5) * 0.6;

      const isMutation = random() < variantStats.mutationProb;
      const mutationName = isMutation 
        ? ['N501Y', 'E484K', 'L452R', 'K417N', 'L455F', 'F486P'][Math.floor(random() * 6)] 
        : 'Standard';

      points.push({
        position: pos,
        id: `AA-${i}-${variantKey}`,
        type: isMutation ? 'MUTATION' : 'NORMAL',
        severity: isMutation ? (0.4 + random() * 0.6) : 0,
        name: mutationName
      });
    }
    return points;
  }, [variantKey, variantStats.mutationProb]);

  useFrame(() => {
    if (groupRef.current) {
      // Slow auto rotation when idle
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.1;
      
      // Update position for gentle floating effect
      groupRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.4) * 0.4;
      
      // Sync rotation back to parent for undo/redo tracking when rotation changes slightly
      const rot = groupRef.current.rotation;
      if (Math.abs(modelRotation[1] - rot.y) > 0.05) {
        setModelRotation([rot.x, rot.y, rot.z]);
      }
    }
  });

  const palette = SCHEME_PALETTES[colorScheme] || SCHEME_PALETTES['Cyber Cyan'];

  return (
    <group ref={groupRef}>
      {/* 1. Atom Spheres (surface & balls) */}
      {(renderMode === 'Ball-and-Stick' || renderMode === 'Surface') && (
        atoms.map((atom, i) => {
          const isSelected = clickedPoints.some(p => p.distanceTo(atom.position) < 0.05);
          
          return (
            <mesh 
              key={atom.id} 
              position={atom.position}
              onPointerOver={(e) => {
                e.stopPropagation();
                setHoveredAtom(atom);
              }}
              onPointerOut={() => setHoveredAtom(null)}
              onPointerDown={(e) => {
                e.stopPropagation();
                onAtomClick(atom.position);
              }}
            >
              <sphereGeometry args={[
                renderMode === 'Surface' ? 0.95 : (isSelected ? 0.55 : 0.35), 
                sphereQuality, 
                sphereQuality
              ]} />
              <meshPhysicalMaterial 
                color={
                  isSelected 
                    ? '#F59E0B' // Selected for measurement (Gold)
                    : atom.type === 'MUTATION' && mutationActive 
                      ? (atom.severity > 0.75 ? '#FF1744' : '#FF9100') // Critical Red or Orange Hotspots
                      : palette.main
                }
                emissive={
                  isSelected 
                    ? '#F59E0B'
                    : atom.type === 'MUTATION' && mutationActive 
                      ? (atom.severity > 0.75 ? '#550000' : '#442200') 
                      : palette.emissive
                }
                emissiveIntensity={atom.type === 'MUTATION' && mutationActive ? 2.5 : 0.8}
                roughness={0.15}
                metalness={0.8}
                clearcoat={1.0}
                transparent={renderMode === 'Surface'}
                opacity={renderMode === 'Surface' ? 0.85 : 1}
              />
            </mesh>
          );
        })
      )}

      {/* 2. Ribbon or Wireframe Tubing */}
      {(renderMode === 'Ribbon' || renderMode === 'Wireframe') && (
        <mesh>
          <tubeGeometry args={[
            new THREE.CatmullRomCurve3(atoms.map(a => a.position)), 
            220, 
            renderMode === 'Wireframe' ? 0.08 : 0.45, 
            cylinderQuality, 
            false
          ]} />
          <meshPhysicalMaterial 
            color={palette.main} 
            emissive={palette.emissive}
            wireframe={renderMode === 'Wireframe'}
            roughness={0.1}
            metalness={0.7}
            clearcoat={1}
            emissiveIntensity={1.2}
          />
        </mesh>
      )}

      {/* 3. Connecting Bonds for Ball-and-Stick view */}
      {renderMode === 'Ball-and-Stick' && atoms.map((atom, i) => {
        if (i === 0) return null;
        const prev = atoms[i - 1];
        const distance = atom.position.distanceTo(prev.position);
        if (distance > 2.8) return null; // Avoid drawing connections between very distant chains

        const center = new THREE.Vector3().addVectors(atom.position, prev.position).multiplyScalar(0.5);
        const orientation = new THREE.Matrix4();
        orientation.lookAt(atom.position, prev.position, new THREE.Object3D().up);
        orientation.multiply(new THREE.Matrix4().set(1, 0, 0, 0, 0, 0, 1, 0, 0, -1, 0, 0, 0, 0, 0, 1));
        const quaternion = new THREE.Quaternion().setFromRotationMatrix(orientation);

        return (
          <mesh key={`bond-${atom.id}-${i}`} position={center} quaternion={quaternion}>
            <cylinderGeometry args={[0.08, 0.08, distance, cylinderQuality]} />
            <meshStandardMaterial color="#ffffff" transparent opacity={0.35} metalness={0.5} roughness={0.2} />
          </mesh>
        );
      })}
    </group>
  );
};

// --- MEASUREMENT LASER LINE COMPONENT ---
const MeasurementLine = ({ points }: { points: THREE.Vector3[] }) => {
  if (points.length < 2) return null;
  const start = points[0];
  const end = points[1];
  const distance = start.distanceTo(end);
  const center = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
  const direction = new THREE.Vector3().subVectors(end, start).normalize();
  const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);

  return (
    <group>
      {/* Neon glowing laser cylinder */}
      <mesh position={center} quaternion={quaternion}>
        <cylinderGeometry args={[0.06, 0.06, distance, 12]} />
        <meshBasicMaterial color="#FFD700" transparent opacity={0.85} />
      </mesh>
      
      {/* High-frequency secondary pulse cylinder */}
      <mesh position={center} quaternion={quaternion}>
        <cylinderGeometry args={[0.12, 0.12, distance * 0.98, 8]} />
        <meshPhysicalMaterial 
          color="#FF9100" 
          transparent 
          opacity={0.3} 
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Start node beacon */}
      <mesh position={start}>
        <sphereGeometry args={[0.42, 16, 16]} />
        <meshBasicMaterial color="#FF5722" />
      </mesh>

      {/* End node beacon */}
      <mesh position={end}>
        <sphereGeometry args={[0.42, 16, 16]} />
        <meshBasicMaterial color="#FF5722" />
      </mesh>
    </group>
  );
};

// --- CUSTOM INTERACTION RESET LISTENER ---
const GestureResetController = ({ onReset }: { onReset: () => void }) => {
  useEffect(() => {
    const handleGestureReset = () => {
      onReset();
    };
    window.addEventListener('gesture-reset', handleGestureReset);
    return () => window.removeEventListener('gesture-reset', handleGestureReset);
  }, [onReset]);
  return null;
};

// --- MAIN PORTAL VIEWPORT ---
export default function StructuralGenomics() {
  // Configurations & Sub-tabs State loaded from localStorage if exists
  const [activeTab, setActiveTab] = useState<'visual' | 'gesture' | 'display' | 'performance'>('visual');
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  
  // Selected Variant and hotspots status
  const [variant, setVariant] = useState<'Original' | 'BA.2' | 'JN.1'>('JN.1');
  const [renderMode, setRenderMode] = useState('Ball-and-Stick');
  const [mutationActive, setMutationActive] = useState(true);
  const [hoveredAtom, setHoveredAtom] = useState<AtomData | null>(null);

  // Auto rotation and measurement states
  const [autoRotate, setAutoRotate] = useState(true);
  const [measurementMode, setMeasurementMode] = useState(false);
  const [clickedPoints, setClickedPoints] = useState<THREE.Vector3[]>([]);

  // Undo/Redo Stacks for navigation history
  const [undoStack, setUndoStack] = useState<[number, number, number][]>([]);
  const [redoStack, setRedoStack] = useState<[number, number, number][]>([]);
  const [modelRotation, setModelRotation] = useState<[number, number, number]>([0, 0, 0]);

  // Onboarding & Help Guide states
  const [onboardingStep, setOnboardingStep] = useState<number | null>(null);
  const [showGestureGuide, setShowGestureGuide] = useState(false);

  // References
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvas3DRef = useRef<HTMLCanvasElement>(null);
  const orbitControlsRef = useRef<any>(null);

  // Initialize tracking hook with customized sensitivity parameters
  const trackingSettings = useMemo(() => ({
    gestureThreshold: settings.gestureThreshold,
    smoothingFactor: settings.smoothingFactor,
    responseDelay: settings.responseDelay,
    debugMode: settings.debugMode
  }), [settings.gestureThreshold, settings.smoothingFactor, settings.responseDelay, settings.debugMode]);

  const { state: trackingState, gestureHistory, enableTracking, disableTracking, setGestureHistory } = 
    useHandTracking(videoRef, canvasRef, containerRef, trackingSettings);

  // Load preferences from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('bi-vac-genomics-preferences');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setSettings(prev => ({ ...prev, ...parsed }));
          if (parsed.colorScheme) {
            // Apply color schemes
          }
        } catch (e) {
          console.error("Could not parse stored settings:", e);
        }
      }
      
      // Trigger Onboarding on very first visit
      const onboardingDone = localStorage.getItem('bi-vac-onboarding-done');
      if (!onboardingDone) {
        setOnboardingStep(1);
      }
    }
  }, []);

  // Save preferences to localStorage helper
  const updateSetting = <K extends keyof typeof DEFAULT_SETTINGS>(key: K, value: typeof DEFAULT_SETTINGS[K]) => {
    setSettings(prev => {
      const updated = { ...prev, [key]: value };
      localStorage.setItem('bi-vac-genomics-preferences', JSON.stringify(updated));
      return updated;
    });
  };

  // Reset tab to defaults
  const resetTabDefaults = (tab: typeof activeTab) => {
    const updatedSettings = { ...settings };
    if (tab === 'visual') {
      updatedSettings.modelQuality = DEFAULT_SETTINGS.modelQuality;
      updatedSettings.colorScheme = DEFAULT_SETTINGS.colorScheme;
      updatedSettings.resolutionScale = DEFAULT_SETTINGS.resolutionScale;
      setRenderMode('Ball-and-Stick');
    } else if (tab === 'gesture') {
      updatedSettings.gestureThreshold = DEFAULT_SETTINGS.gestureThreshold;
      updatedSettings.smoothingFactor = DEFAULT_SETTINGS.smoothingFactor;
      updatedSettings.responseDelay = DEFAULT_SETTINGS.responseDelay;
    } else if (tab === 'display') {
      updatedSettings.showGrid = DEFAULT_SETTINGS.showGrid;
      updatedSettings.showAxes = DEFAULT_SETTINGS.showAxes;
      updatedSettings.showLabels = DEFAULT_SETTINGS.showLabels;
    } else if (tab === 'performance') {
      updatedSettings.showFps = DEFAULT_SETTINGS.showFps;
      updatedSettings.hardwareAcceleration = DEFAULT_SETTINGS.hardwareAcceleration;
      updatedSettings.debugMode = DEFAULT_SETTINGS.debugMode;
    }
    setSettings(updatedSettings);
    localStorage.setItem('bi-vac-genomics-preferences', JSON.stringify(updatedSettings));
    
    // Haptic feedback
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([60, 40, 60]);
    }
  };

  // Capture Screenshot of WebGL Canvas
  const captureSnapshot = useCallback(() => {
    const canvas = containerRef.current?.querySelector('canvas');
    if (!canvas) return;

    try {
      // Must set preserveDrawingBuffer: true or capture at rendering frame
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `BI-VAC_Spike_Protein_${variant}_${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
      
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(80);
      }
    } catch (e) {
      console.error("Screenshot capture failed:", e);
    }
  }, [variant]);

  // Handle atom click for distance calculations
  const handleAtomClick = (pos: THREE.Vector3) => {
    if (!measurementMode) return;
    
    setClickedPoints(prev => {
      if (prev.length >= 2) {
        // Reset and insert as first point
        return [pos];
      }
      const next = [...prev, pos];
      
      // Haptic confirmation
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(50);
      }
      return next;
    });
  };

  // Undo / Redo view states implementation
  const saveStateToHistory = useCallback(() => {
    setUndoStack(prev => [...prev, modelRotation]);
    setRedoStack([]); // Clear redo stack on manual interaction
  }, [modelRotation]);

  const triggerUndo = () => {
    if (undoStack.length === 0) return;
    const previous = undoStack[undoStack.length - 1];
    setUndoStack(prev => prev.slice(0, prev.length - 1));
    setRedoStack(prev => [...prev, modelRotation]);
    
    // Apply position reset smoothly
    if (orbitControlsRef.current) {
      orbitControlsRef.current.reset();
    }
    setModelRotation(previous);
  };

  const triggerRedo = () => {
    if (redoStack.length === 0) return;
    const nextState = redoStack[redoStack.length - 1];
    setRedoStack(prev => prev.slice(0, prev.length - 1));
    setUndoStack(prev => [...prev, modelRotation]);
    
    setModelRotation(nextState);
  };

  // Keyboard Shortcuts handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Bypass when typing inside inputs
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;

      switch(e.key.toLowerCase()) {
        case 'r':
          // Reset view
          resetCameraView();
          break;
        case ' ':
          e.preventDefault();
          setAutoRotate(prev => !prev);
          break;
        case 'm':
          setMeasurementMode(prev => !prev);
          setClickedPoints([]);
          break;
        case 'e':
          captureSnapshot();
          break;
        case 'z':
          if (e.ctrlKey) {
            triggerUndo();
          }
          break;
        case 'y':
          if (e.ctrlKey) {
            triggerRedo();
          }
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [captureSnapshot, undoStack, redoStack, modelRotation]);

  // Clean camera reset
  const resetCameraView = useCallback(() => {
    if (orbitControlsRef.current) {
      saveStateToHistory();
      orbitControlsRef.current.reset();
      
      // Haptic confirmation
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([30, 20, 30]);
      }
    }
  }, [saveStateToHistory]);

  const finishOnboarding = () => {
    setOnboardingStep(null);
    localStorage.setItem('bi-vac-onboarding-done', 'true');
  };

  // Determine gesture color for bounding boxes & glows
  const activeGlowColor = 
    trackingState.activeGesture === 'PINCH_ROTATE' ? 'border-brand-blue/80 shadow-[0_0_30px_rgba(0,210,255,0.35)]' :
    trackingState.activeGesture === 'OPEN_PAN' ? 'border-purple-500/80 shadow-[0_0_30px_rgba(168,85,247,0.35)]' :
    trackingState.activeGesture === 'DUAL_ZOOM' ? 'border-green-400/80 shadow-[0_0_30px_rgba(74,222,128,0.35)]' :
    trackingState.activeGesture === 'VICTORY_RESET' ? 'border-amber-500/80 shadow-[0_0_30px_rgba(245,158,11,0.35)]' :
    'border-brand-blue/20';

  // Distance calculation in Angstroms (standard bio spacing metric scale factor 4.5)
  const measuredDistanceStr = useMemo(() => {
    if (clickedPoints.length < 2) return '';
    const dist = clickedPoints[0].distanceTo(clickedPoints[1]) * 4.5;
    return `${dist.toFixed(2)} Å`;
  }, [clickedPoints]);

  return (
    <div className="space-y-8 pb-12 w-full max-w-[1600px] mx-auto min-h-screen">
      
      {/* 3-STEP SYMMETRIC INTERACTIVE ONBOARDING TUTORIAL */}
      <AnimatePresence>
        {onboardingStep !== null && (
          <div className="fixed inset-0 bg-black/85 z-[9999] flex items-center justify-center p-4 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#0b0c10] border border-brand-blue/30 p-8 rounded-[24px] max-w-md w-full shadow-2xl relative"
            >
              <div className="absolute top-4 right-4 text-xs font-mono text-brand-blue/50">
                Step {onboardingStep} of 3
              </div>

              {onboardingStep === 1 && (
                <div className="space-y-6">
                  <div className="w-12 h-12 rounded-xl bg-brand-blue/20 flex items-center justify-center text-brand-blue">
                    <Compass size={24} className="animate-spin" style={{ animationDuration: '6s' }} />
                  </div>
                  <h3 className="text-xl font-black uppercase text-white tracking-widest">Split-Screen Interface</h3>
                  <p className="text-sm text-white/60 leading-relaxed">
                    Welcome to the v4.2 Structural Analytics console. The interface is divided into a <strong className="text-brand-blue">50/50 Split layout</strong>. 
                    The left panel captures your video tracking stream, while the right displays the fully reactive 3D WebGL rendering.
                  </p>
                </div>
              )}

              {onboardingStep === 2 && (
                <div className="space-y-6">
                  <div className="w-12 h-12 rounded-xl bg-brand-blue/20 flex items-center justify-center text-brand-blue">
                    <Hand size={24} className="animate-bounce" />
                  </div>
                  <h3 className="text-xl font-black uppercase text-white tracking-widest">Gesture Operations</h3>
                  <p className="text-sm text-white/60 leading-relaxed">
                    Control the 3D protein structure directly in physical space using intuitive gestures:
                  </p>
                  <ul className="text-xs text-white/50 space-y-2 border-l border-brand-blue/20 pl-4 py-1">
                    <li>✋ <strong className="text-white/80">Open Palm Drag:</strong> Pan camera smoothly</li>
                    <li>👌 <strong className="text-white/80">Pinch & Drag:</strong> Rotate model axis</li>
                    <li>👐 <strong className="text-white/80">Two-Hand Pinch:</strong> Zoom in/out smoothly</li>
                    <li>✌️ <strong className="text-white/80">Victory Sign:</strong> Reset camera instantly</li>
                  </ul>
                </div>
              )}

              {onboardingStep === 3 && (
                <div className="space-y-6">
                  <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center text-green-400">
                    <CheckCircle2 size={24} />
                  </div>
                  <h3 className="text-xl font-black uppercase text-white tracking-widest">Fully Operational</h3>
                  <p className="text-sm text-white/60 leading-relaxed">
                    Need backups? Normal mouse dragging and touch interactions work perfectly as fallback controls. 
                    Your visual settings can be saved and managed below the split viewport!
                  </p>
                </div>
              )}

              <div className="mt-8 flex justify-between gap-4">
                {onboardingStep > 1 ? (
                  <button 
                    onClick={() => setOnboardingStep(prev => prev! - 1)}
                    className="px-5 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-xs text-white font-bold uppercase transition-colors"
                  >
                    Back
                  </button>
                ) : (
                  <button 
                    onClick={finishOnboarding}
                    className="px-5 py-2.5 rounded-xl text-white/30 hover:text-white text-xs font-bold uppercase transition-colors"
                  >
                    Skip
                  </button>
                )}

                <button 
                  onClick={() => {
                    if (onboardingStep === 3) {
                      finishOnboarding();
                    } else {
                      setOnboardingStep(prev => prev! + 1);
                    }
                  }}
                  className="flex-1 px-5 py-2.5 rounded-xl bg-brand-blue text-black font-black text-xs uppercase tracking-widest shadow-lg shadow-brand-blue/20 hover:scale-105 transition-all"
                >
                  {onboardingStep === 3 ? "Initialize Portal" : "Continue"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* HEADER SECTION */}
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-brand-blue mb-1">
            <Sparkles size={14} className="animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Precision Biometrics Console</span>
          </div>
          <h2 className="text-3xl font-black text-white uppercase tracking-wider">Spike Protein Analytics</h2>
          <p className="text-sm text-white/40 font-bold uppercase tracking-wider mt-1">
            SARS-CoV-2 Variant Evasion & Neutralization Hotspots
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Variant dropdown */}
          <div className="flex items-center space-x-2 bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl">
            <span className="text-[10px] font-black text-white/30 uppercase">Strain:</span>
            <select 
              value={variant}
              onChange={(e) => setVariant(e.target.value as any)}
              className="bg-transparent text-xs font-bold text-brand-blue outline-none cursor-pointer uppercase"
            >
              <option value="Original" className="bg-black text-white">Original Strain (Wuhan-Hu-1)</option>
              <option value="BA.2" className="bg-black text-white">BA.2 Stealth Variant</option>
              <option value="JN.1" className="bg-black text-white">JN.1 Highly Evasive</option>
            </select>
          </div>

          <button 
            onClick={() => setOnboardingStep(1)}
            className="p-3 bg-white/5 border border-white/10 rounded-xl text-white/60 hover:text-white hover:border-white/20 transition-all"
            title="Launch Interactive Tutorial"
          >
            <HelpCircle size={16} />
          </button>
        </div>
      </header>

      {/* 50/50 SPLIT SCREEN LAYOUT CONTAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full items-stretch min-h-[600px]">
        
        {/* COLUMN 1 (LEFT HALF): CAMERA FEED & TRACKING CONTROLLER */}
        <div className="flex flex-col h-full bg-white/[0.02] border border-white/5 rounded-[32px] p-6 space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-brand-blue/[0.01] pointer-events-none" />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-brand-blue/15 flex items-center justify-center text-brand-blue">
                <Camera size={18} />
              </div>
              <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-white/80">Optical Gesture Uplink</h3>
                <span className="text-[9px] font-bold text-white/40 uppercase tracking-wider block">Webcam Scanning Interface</span>
              </div>
            </div>
            
            {/* Tracking Status indicator */}
            <div className="flex items-center space-x-2">
              <span className={cn(
                "w-2 h-2 rounded-full",
                trackingState.isEnabled ? (trackingState.isLoaded ? "bg-green-400 animate-pulse" : "bg-yellow-400 animate-pulse") : "bg-red-500"
              )} />
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">
                {trackingState.isEnabled ? (trackingState.isLoaded ? "Live Tracking" : "Booting Model") : "Offline"}
              </span>
            </div>
          </div>

          {/* WEBCAM CAPTURE WORKSPACE */}
          <div className={cn(
            "relative w-full aspect-video md:aspect-[4/3] max-h-[380px] bg-black border rounded-2xl overflow-hidden transition-all duration-300",
            activeGlowColor
          )}>
            {/* Grid layout decoration inside webcam */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,3px_100%] opacity-25 pointer-events-none z-10" />

            <video 
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover hidden"
              playsInline
              muted
            />

            {/* Skeleton Canvas overlay for handpose node tracking */}
            <canvas 
              ref={canvasRef}
              width={640}
              height={480}
              className="w-full h-full object-cover relative z-10"
              style={{ transform: 'scaleX(-1)' }}
            />

            {/* Tracking status prompt placeholder */}
            {!trackingState.isEnabled && (
              <div className="absolute inset-0 z-20 bg-black/80 flex flex-col items-center justify-center p-6 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-brand-blue/15 border border-brand-blue/30 flex items-center justify-center text-brand-blue animate-pulse">
                  <Hand size={24} />
                </div>
                <div className="space-y-2">
                  <h4 className="text-xs font-black uppercase tracking-widest text-white">AI Pose Tracking Offline</h4>
                  <p className="text-[10px] text-white/40 uppercase max-w-xs leading-relaxed">
                    Initialize your optical tracker to enable real-time spatial hand gesture modeling.
                  </p>
                </div>
                <button 
                  onClick={enableTracking}
                  className="px-6 py-2.5 rounded-xl bg-brand-blue text-black font-black text-xs uppercase tracking-widest shadow-lg shadow-brand-blue/20 hover:scale-105 transition-all"
                >
                  Initialize Tracking
                </button>
              </div>
            )}

            {trackingState.isEnabled && !trackingState.isLoaded && (
              <div className="absolute inset-0 z-20 bg-black/90 flex flex-col items-center justify-center p-6 text-center space-y-4">
                <RefreshCw size={32} className="text-brand-blue animate-spin" />
                <div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-white">Downloading Models</h4>
                  <p className="text-[10px] text-brand-blue animate-pulse font-bold tracking-widest mt-1">
                    ESTABLISHING CDN PIPELINE...
                  </p>
                </div>
              </div>
            )}

            {trackingState.error && (
              <div className="absolute inset-0 z-20 bg-black/95 flex flex-col items-center justify-center p-6 text-center space-y-4">
                <AlertCircle size={32} className="text-red-500 animate-bounce" />
                <div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-white">Hardware Capture Exception</h4>
                  <p className="text-[10px] text-white/50 uppercase leading-relaxed max-w-sm mt-1">
                    Failed to lock video feed: {trackingState.error}
                  </p>
                </div>
                <div className="text-[9px] text-yellow-500/80 bg-yellow-500/10 border border-yellow-500/20 px-4 py-2 rounded-lg max-w-sm font-medium">
                  ⚠️ FALLBACK ENGAGED: Mouse dragging and double-click tools are fully active.
                </div>
                <button 
                  onClick={disableTracking}
                  className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white uppercase transition-colors"
                >
                  Close Optical Link
                </button>
              </div>
            )}
          </div>

          {/* DYNAMIC REAL-TIME PERFORMANCE GRAPH & COUNTERS */}
          <div className="grid grid-cols-4 gap-3">
            <div className="bg-black/40 border border-white/5 rounded-2xl p-3 text-center">
              <span className="text-[8px] font-black uppercase text-white/30 block mb-1">Latency</span>
              <span className="text-sm font-mono font-black text-brand-blue">
                {trackingState.isEnabled ? `${trackingState.latency}ms` : '0ms'}
              </span>
            </div>
            
            <div className="bg-black/40 border border-white/5 rounded-2xl p-3 text-center">
              <span className="text-[8px] font-black uppercase text-white/30 block mb-1">Frame Rate</span>
              <span className="text-sm font-mono font-black text-green-400">
                {trackingState.isEnabled ? `${trackingState.fps} FPS` : '0 FPS'}
              </span>
            </div>
            
            <div className="bg-black/40 border border-white/5 rounded-2xl p-3 text-center">
              <span className="text-[8px] font-black uppercase text-white/30 block mb-1">Confidence</span>
              <span className="text-sm font-mono font-black text-yellow-400">
                {trackingState.isEnabled ? `${Math.round(trackingState.confidence * 100)}%` : '0%'}
              </span>
            </div>

            <div className="bg-black/40 border border-white/5 rounded-2xl p-3 text-center">
              <span className="text-[8px] font-black uppercase text-white/30 block mb-1">Interactions</span>
              <span className="text-sm font-mono font-black text-purple-400">
                {trackingState.interactionCount}
              </span>
            </div>
          </div>

          {/* ACTIVE GESTURE HISTORY LOGGER */}
          <div className="bg-black/40 border border-white/5 rounded-2xl p-4 flex-1 flex flex-col space-y-3">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-white/50">Recent Gestures</span>
              <button 
                onClick={() => setGestureHistory([])}
                className="text-[9px] font-bold text-brand-blue/60 hover:text-brand-blue uppercase transition-colors"
              >
                Clear Logs
              </button>
            </div>
            
            <div className="space-y-1.5 overflow-y-auto max-h-[140px] pr-1 flex-1 custom-scrollbar">
              {gestureHistory.length === 0 ? (
                <div className="text-[9px] text-white/20 uppercase tracking-widest text-center py-6">
                  No active gestures logged
                </div>
              ) : (
                gestureHistory.map((item) => (
                  <div key={item.id} className="flex items-center justify-between bg-white/[0.02] border border-white/5 px-3 py-1.5 rounded-xl hover:bg-white/[0.04] transition-all">
                    <div className="flex items-center space-x-2">
                      <span className={cn(
                        "w-1.5 h-1.5 rounded-full animate-pulse",
                        item.gesture === 'PINCH_ROTATE' ? "bg-brand-blue" :
                        item.gesture === 'OPEN_PAN' ? "bg-purple-400" :
                        item.gesture === 'DUAL_ZOOM' ? "bg-green-400" : "bg-amber-400"
                      )} />
                      <span className="text-[9px] font-black uppercase text-white tracking-widest">
                        {item.gesture}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-3 text-right">
                      <span className="text-[8px] font-mono text-white/30">{item.timestamp}</span>
                      <span className="text-[8px] font-mono font-black text-brand-blue">
                        {Math.round(item.confidence * 100)}%
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          
          {/* Optical controller action termination */}
          {trackingState.isEnabled && (
            <button 
              onClick={disableTracking}
              className="w-full py-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 hover:text-red-300 text-xs font-black uppercase tracking-wider transition-all"
            >
              Kill Optical Capture Pipeline
            </button>
          )}
        </div>

        {/* COLUMN 2 (RIGHT HALF): 3D PROTEIN ENGINE VIEWPORT */}
        <div className="flex flex-col h-full bg-white/[0.02] border border-white/5 rounded-[32px] p-6 space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-brand-blue/[0.01] pointer-events-none" />

          {/* Top header stats overlay inside column */}
          <div className="flex items-center justify-between z-20">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-brand-blue/15 flex items-center justify-center text-brand-blue">
                <Layers size={18} />
              </div>
              <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-white/80">3D Simulation Space</h3>
                <span className="text-[9px] font-bold text-white/40 uppercase tracking-wider block">Interactive Spike Model</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button 
                onClick={captureSnapshot}
                className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-white/55 hover:text-brand-blue hover:border-brand-blue/30 transition-all flex items-center"
                title="Export Frame PNG"
              >
                <Download size={14} />
              </button>
              
              <button 
                onClick={resetCameraView}
                className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-white/55 hover:text-brand-blue hover:border-brand-blue/30 transition-all flex items-center"
                title="Reset Camera view (Shortcut: R)"
              >
                <RotateCcw size={14} />
              </button>
            </div>
          </div>

          {/* 3D RENDERING WORKSPACE PORT */}
          <div 
            ref={containerRef}
            className="relative w-full aspect-video md:aspect-[4/3] max-h-[380px] bg-black border border-white/10 rounded-2xl overflow-hidden shadow-inner group"
          >
            {/* Scanner line overlays */}
            <div className="absolute top-2 left-2 z-10 px-3 py-1 bg-black/60 rounded-lg backdrop-blur-md border border-white/10 pointer-events-none">
              <span className="text-[8px] font-black tracking-widest text-brand-blue uppercase">
                {renderMode} | GL ACTIVE
              </span>
            </div>

            {/* Canvas implementation */}
            <Canvas 
              ref={canvas3DRef}
              gl={{ antialias: true, preserveDrawingBuffer: true, powerPreference: 'high-performance' }} 
              camera={{ position: [0, 0, 24], fov: 45 }}
            >
              <color attach="background" args={['#020408']} />
              <ambientLight intensity={0.25} />
              <pointLight position={[10, 10, 10]} intensity={1.8} color={SCHEME_PALETTES[settings.colorScheme]?.main || "#00D2FF"} />
              <pointLight position={[-10, -10, -10]} intensity={0.6} color="#FF1744" />
              <spotLight position={[0, 20, 0]} angle={0.3} penumbra={1} intensity={2.5} color="#ffffff" castShadow />
              
              <Stars radius={90} depth={40} count={2000} factor={4} saturation={0} fade speed={1} />
              
              {settings.showGrid && <gridHelper args={[30, 30, '#00D2FF', '#ffffff10']} position={[0, -9, 0]} />}
              {settings.showAxes && <axesHelper args={[6]} />}

              <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.3}>
                <ProteinModelMesh 
                  renderMode={renderMode}
                  variantKey={variant}
                  mutationActive={mutationActive}
                  colorScheme={settings.colorScheme}
                  quality={settings.modelQuality}
                  setHoveredAtom={setHoveredAtom}
                  clickedPoints={clickedPoints}
                  onAtomClick={handleAtomClick}
                  modelRotation={modelRotation}
                  setModelRotation={setModelRotation}
                />
                
                {/* Visual laser measurements line */}
                {measurementMode && <MeasurementLine points={clickedPoints} />}
              </Float>
              
              <OrbitControls 
                ref={orbitControlsRef}
                makeDefault 
                enableDamping 
                dampingFactor={0.06} 
                minDistance={8} 
                maxDistance={50}
                autoRotate={autoRotate && !trackingState.isEnabled && hoveredAtom === null}
                autoRotateSpeed={0.5}
                onChange={() => {
                  if (orbitControlsRef.current) {
                    const rot = orbitControlsRef.current.object.rotation;
                    setModelRotation([rot.x, rot.y, rot.z]);
                  }
                }}
                onEnd={saveStateToHistory}
              />

              <GestureResetController onReset={() => resetCameraView()} />
            </Canvas>

            {/* Hovered Atom card HUD */}
            <AnimatePresence>
              {hoveredAtom && settings.showLabels && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="absolute bottom-6 left-6 z-30 p-5 bg-black/85 backdrop-blur-md border border-white/10 rounded-[20px] w-72 shadow-2xl pointer-events-none"
                >
                  <div className="flex items-center space-x-2 mb-3 pb-2.5 border-b border-white/10">
                    <Cpu size={16} className="text-brand-blue animate-pulse" />
                    <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Genomic Hotspot Data</h4>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[8px] font-black text-white/40 uppercase tracking-widest">Residue ID</span>
                      <span className="text-xs font-mono font-black text-brand-blue">{hoveredAtom.id.split('-')[0]}-{hoveredAtom.id.split('-')[1]}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-[8px] font-black text-white/40 uppercase tracking-widest">Amino Acid Status</span>
                      <span className={cn(
                        "text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider",
                        hoveredAtom.type === 'MUTATION' ? "bg-red-500/20 text-red-400 border border-red-500/30" : "bg-green-500/20 text-green-400 border border-green-500/30"
                      )}>
                        {hoveredAtom.type === 'MUTATION' ? hoveredAtom.name : 'Ancestral'}
                      </span>
                    </div>

                    {hoveredAtom.type === 'MUTATION' && (
                      <div className="space-y-1.5 pt-1.5 border-t border-white/5">
                        <div className="flex justify-between items-center">
                          <span className="text-[8px] font-black text-white/40 uppercase tracking-widest font-mono">Evasion Probability</span>
                          <span className="text-xs font-black text-red-400 font-mono">
                            {(hoveredAtom.severity * 100).toFixed(0)}%
                          </span>
                        </div>
                        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-orange-500 to-red-500" style={{ width: `${hoveredAtom.severity * 100}%` }} />
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* LASER MEASUREMENT MODE FLOATING HUD OVERLAY */}
            <AnimatePresence>
              {measurementMode && (
                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="absolute top-14 left-1/2 -translate-x-1/2 z-20 bg-black/90 border border-amber-500/30 px-5 py-3 rounded-2xl shadow-xl flex items-center gap-4 text-center max-w-sm"
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping shrink-0" />
                  
                  <div className="text-left shrink-0">
                    <span className="text-[8px] font-black uppercase text-amber-500 block">Measurement Tool Active</span>
                    <span className="text-[10px] text-white/50 font-bold block uppercase mt-0.5">
                      {clickedPoints.length === 0 ? "Click an atom node to start" :
                       clickedPoints.length === 1 ? "Select second atom node" :
                       `Distance: ${measuredDistanceStr}`}
                    </span>
                  </div>

                  {clickedPoints.length > 0 && (
                    <button 
                      onClick={() => setClickedPoints([])}
                      className="px-2.5 py-1 bg-amber-500 text-black font-black text-[9px] uppercase tracking-wider rounded hover:scale-105 transition-transform"
                    >
                      Clear
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ROTATION & MEASUREMENT UTILITY BAR */}
          <div className="grid grid-cols-3 gap-3">
            <button 
              onClick={() => {
                setMeasurementMode(prev => !prev);
                setClickedPoints([]);
              }}
              className={cn(
                "p-3 rounded-2xl flex items-center justify-center space-x-2 border transition-all text-xs font-black uppercase tracking-wider",
                measurementMode 
                  ? "bg-amber-500/10 border-amber-500/50 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.15)]" 
                  : "bg-black/40 border-white/5 text-white/40 hover:bg-white/5 hover:text-white"
              )}
            >
              <Crosshair size={14} />
              <span>Laser Measure</span>
            </button>

            <button 
              onClick={() => setAutoRotate(prev => !prev)}
              className={cn(
                "p-3 rounded-2xl flex items-center justify-center space-x-2 border transition-all text-xs font-black uppercase tracking-wider",
                autoRotate 
                  ? "bg-brand-blue/15 border-brand-blue/40 text-brand-blue" 
                  : "bg-black/40 border-white/5 text-white/40 hover:bg-white/5 hover:text-white"
              )}
            >
              <RotateCcw size={14} className={autoRotate ? "animate-[spin_6s_linear_infinite]" : ""} />
              <span>Auto Rotate</span>
            </button>

            <button 
              onClick={() => setMutationActive(prev => !prev)}
              className={cn(
                "p-3 rounded-2xl flex items-center justify-center space-x-2 border transition-all text-xs font-black uppercase tracking-wider",
                mutationActive 
                  ? "bg-red-500/15 border-red-500/30 text-red-400" 
                  : "bg-black/40 border-white/5 text-white/40 hover:bg-white/5 hover:text-white"
              )}
            >
              <ShieldAlert size={14} />
              <span>Hotspots</span>
            </button>
          </div>

          {/* REAL TIME PHYLODYNAMIC METRICS PANEL */}
          <div className="bg-black/40 border border-white/5 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[9px] font-black text-brand-blue uppercase tracking-widest font-mono">Variant Escape consensus</span>
              <h4 className="text-base font-black text-white uppercase tracking-tight">
                {VARIANT_GENOMICS[variant].title}
              </h4>
              <p className="text-[10px] text-white/40 leading-relaxed font-medium">
                {VARIANT_GENOMICS[variant].description}
              </p>
            </div>

            <div className="text-right shrink-0">
              <span className="text-[8px] font-black text-white/30 uppercase block">Evasion score</span>
              <span className={cn(
                "text-2xl font-black font-mono",
                VARIANT_GENOMICS[variant].evasionScore > 80 ? "text-red-500" :
                VARIANT_GENOMICS[variant].evasionScore > 50 ? "text-orange-500" : "text-brand-blue"
              )}>
                {VARIANT_GENOMICS[variant].evasionScore}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* FULL-WIDTH SYMMETRIC MULTI-TAB CONFIGURATION DASHBOARD PANE */}
      <section className="bg-white/[0.02] border border-white/5 rounded-[32px] p-8 shadow-2xl relative">
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-brand-blue to-transparent" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-white/5 pb-6 mb-6 gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-brand-blue/15 flex items-center justify-center text-brand-blue">
              <Settings size={18} />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-white">System Configurations</h3>
              <span className="text-[9px] font-bold text-white/40 uppercase block mt-0.5">Custom settings & persistence parameters</span>
            </div>
          </div>

          {/* Sub-tab selections */}
          <div className="flex flex-wrap items-center bg-black/40 border border-white/10 p-1.5 rounded-2xl gap-2 self-stretch md:self-auto">
            <button 
              onClick={() => setActiveTab('visual')}
              className={cn(
                "px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                activeTab === 'visual' ? "bg-brand-blue text-black" : "text-white/40 hover:text-white"
              )}
            >
              Visualization
            </button>
            
            <button 
              onClick={() => setActiveTab('gesture')}
              className={cn(
                "px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                activeTab === 'gesture' ? "bg-brand-blue text-black" : "text-white/40 hover:text-white"
              )}
            >
              Gesture Sensitivity
            </button>

            <button 
              onClick={() => setActiveTab('display')}
              className={cn(
                "px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                activeTab === 'display' ? "bg-brand-blue text-black" : "text-white/40 hover:text-white"
              )}
            >
              Display Options
            </button>

            <button 
              onClick={() => setActiveTab('performance')}
              className={cn(
                "px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                activeTab === 'performance' ? "bg-brand-blue text-black" : "text-white/40 hover:text-white"
              )}
            >
              Diagnostics
            </button>
          </div>
        </div>

        {/* SUB-TABS INTERACTIVE BODY WITH REAL-TIME PREVIEW ACTIONS */}
        <div className="min-h-[220px] flex flex-col justify-between">
          <div>
            {/* SUB-TAB 1: VISUALIZATION SETTINGS */}
            {activeTab === 'visual' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-white/50 uppercase tracking-widest block">Render Quality Model</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Low', 'Medium', 'High'].map(q => (
                      <button
                        key={q}
                        onClick={() => updateSetting('modelQuality', q)}
                        className={cn(
                          "px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all",
                          settings.modelQuality === q ? "bg-brand-blue/20 text-brand-blue border-brand-blue/40" : "bg-black/20 border-white/5 text-white/40 hover:text-white"
                        )}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                  <span className="text-[8px] text-white/30 block uppercase tracking-wider mt-1">Adjusts geometry density segments.</span>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-white/50 uppercase tracking-widest block">Core Color Scheme Preset</label>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.keys(SCHEME_PALETTES).map(paletteName => (
                      <button
                        key={paletteName}
                        onClick={() => updateSetting('colorScheme', paletteName)}
                        className={cn(
                          "px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all flex items-center justify-between",
                          settings.colorScheme === paletteName ? "bg-brand-blue/20 text-brand-blue border-brand-blue/40" : "bg-black/20 border-white/5 text-white/40 hover:text-white"
                        )}
                      >
                        <span>{paletteName}</span>
                        <div 
                          className="w-2.5 h-2.5 rounded-full shrink-0" 
                          style={{ backgroundColor: SCHEME_PALETTES[paletteName].main }}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-white/50 uppercase tracking-widest block">Rendering Resolution Scale</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[0.5, 1.0, 2.0].map(res => (
                      <button
                        key={res}
                        onClick={() => updateSetting('resolutionScale', res)}
                        className={cn(
                          "px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all",
                          settings.resolutionScale === res ? "bg-brand-blue/20 text-brand-blue border-brand-blue/40" : "bg-black/20 border-white/5 text-white/40 hover:text-white"
                        )}
                      >
                        {res}x
                      </button>
                    ))}
                  </div>
                  <span className="text-[8px] text-white/30 block uppercase tracking-wider mt-1">Balances pixel output density vs GPU load.</span>
                </div>
              </div>
            )}

            {/* SUB-TAB 2: GESTURE SENSITIVITY */}
            {activeTab === 'gesture' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black text-white/50 uppercase tracking-widest block">Detection Threshold</label>
                    <span className="text-xs font-mono font-black text-brand-blue">{settings.gestureThreshold}</span>
                  </div>
                  <input 
                    type="range"
                    min="0.4"
                    max="0.95"
                    step="0.05"
                    value={settings.gestureThreshold}
                    onChange={(e) => updateSetting('gestureThreshold', parseFloat(e.target.value))}
                    className="w-full accent-brand-blue h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-[8px] text-white/30 block uppercase tracking-wider">Required confidence criteria for joint detection.</span>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black text-white/50 uppercase tracking-widest block">Interpolation Smoothing</label>
                    <span className="text-xs font-mono font-black text-brand-blue">{settings.smoothingFactor}</span>
                  </div>
                  <input 
                    type="range"
                    min="0.02"
                    max="0.4"
                    step="0.02"
                    value={settings.smoothingFactor}
                    onChange={(e) => updateSetting('smoothingFactor', parseFloat(e.target.value))}
                    className="w-full accent-brand-blue h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-[8px] text-white/30 block uppercase tracking-wider">Smoothing scale factor. Smaller = smoother but slow.</span>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black text-white/50 uppercase tracking-widest block">Response Delay Buffer (ms)</label>
                    <span className="text-xs font-mono font-black text-brand-blue">{settings.responseDelay}ms</span>
                  </div>
                  <input 
                    type="range"
                    min="0"
                    max="300"
                    step="10"
                    value={settings.responseDelay}
                    onChange={(e) => updateSetting('responseDelay', parseInt(e.target.value))}
                    className="w-full accent-brand-blue h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-[8px] text-white/30 block uppercase tracking-wider">Adds software debounce delay to filter gestures noise.</span>
                </div>
              </div>
            )}

            {/* SUB-TAB 3: DISPLAY OPTIONS */}
            {activeTab === 'display' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-4">
                  <div className="text-[10px] font-black text-white/50 uppercase tracking-widest block">3D Scene Helpers</div>
                  
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3 cursor-pointer group">
                      <input 
                        type="checkbox"
                        checked={settings.showGrid}
                        onChange={(e) => updateSetting('showGrid', e.target.checked)}
                        className="accent-brand-blue w-4 h-4 bg-black/40 border border-white/10 rounded cursor-pointer"
                      />
                      <span className="text-xs font-bold text-white/60 group-hover:text-white transition-colors uppercase tracking-wider">
                        Show Reference Base Grid
                      </span>
                    </label>

                    <label className="flex items-center space-x-3 cursor-pointer group">
                      <input 
                        type="checkbox"
                        checked={settings.showAxes}
                        onChange={(e) => updateSetting('showAxes', e.target.checked)}
                        className="accent-brand-blue w-4 h-4 bg-black/40 border border-white/10 rounded cursor-pointer"
                      />
                      <span className="text-xs font-bold text-white/60 group-hover:text-white transition-colors uppercase tracking-wider">
                        Show Coordinate Axes Helper
                      </span>
                    </label>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="text-[10px] font-black text-white/50 uppercase tracking-widest block">Protein Metadata Overlay</div>
                  
                  <label className="flex items-center space-x-3 cursor-pointer group">
                    <input 
                      type="checkbox"
                      checked={settings.showLabels}
                      onChange={(e) => updateSetting('showLabels', e.target.checked)}
                      className="accent-brand-blue w-4 h-4 bg-black/40 border border-white/10 rounded cursor-pointer"
                    />
                    <span className="text-xs font-bold text-white/60 group-hover:text-white transition-colors uppercase tracking-wider">
                      Enable Hover Info Labels
                    </span>
                  </label>
                </div>

                {/* COLOR CODING LEGEND METADATA */}
                <div className="space-y-3 bg-black/30 border border-white/5 p-4 rounded-2xl">
                  <span className="text-[9px] font-black uppercase tracking-widest text-brand-blue block">Chain Color Legend</span>
                  <div className="space-y-2 mt-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: SCHEME_PALETTES[settings.colorScheme]?.main || '#00D2FF' }} />
                      <span className="text-[9px] font-black text-white/60 uppercase tracking-wider">Standard Helix Sequence Chain</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0" />
                      <span className="text-[9px] font-black text-white/60 uppercase tracking-wider">Critical Evasion Hostspots (Score &gt; 75)</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-orange-500 shrink-0" />
                      <span className="text-[9px] font-black text-white/60 uppercase tracking-wider">Secondary Escape Residues (Score &lt; 75)</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                      <span className="text-[9px] font-black text-white/60 uppercase tracking-wider">Active Laser Anchor Selection</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SUB-TAB 4: DIAGNOSTICS & PERFORMANCE */}
            {activeTab === 'performance' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-4">
                  <div className="text-[10px] font-black text-white/50 uppercase tracking-widest block">Optical Bounding Overlays</div>
                  
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3 cursor-pointer group">
                      <input 
                        type="checkbox"
                        checked={settings.debugMode}
                        onChange={(e) => updateSetting('debugMode', e.target.checked)}
                        className="accent-brand-blue w-4 h-4 bg-black/40 border border-white/10 rounded cursor-pointer"
                      />
                      <span className="text-xs font-bold text-white/60 group-hover:text-white transition-colors uppercase tracking-wider">
                        Enable Hand Bone highlights
                      </span>
                    </label>

                    <label className="flex items-center space-x-3 cursor-pointer group">
                      <input 
                        type="checkbox"
                        checked={settings.showFps}
                        onChange={(e) => updateSetting('showFps', e.target.checked)}
                        className="accent-brand-blue w-4 h-4 bg-black/40 border border-white/10 rounded cursor-pointer"
                      />
                      <span className="text-xs font-bold text-white/60 group-hover:text-white transition-colors uppercase tracking-wider">
                        Render Diagnostics Panel
                      </span>
                    </label>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="text-[10px] font-black text-white/50 uppercase tracking-widest block">GPU Hardware Engine</div>
                  
                  <label className="flex items-center space-x-3 cursor-pointer group">
                    <input 
                      type="checkbox"
                      checked={settings.hardwareAcceleration}
                      onChange={(e) => updateSetting('hardwareAcceleration', e.target.checked)}
                      className="accent-brand-blue w-4 h-4 bg-black/40 border border-white/10 rounded cursor-pointer"
                    />
                    <span className="text-xs font-bold text-white/60 group-hover:text-white transition-colors uppercase tracking-wider">
                      Force WebGL Antialiasing (60fps lock)
                    </span>
                  </label>
                </div>

                <div className="space-y-2 bg-black/30 border border-white/5 p-4 rounded-2xl flex flex-col justify-center">
                  <span className="text-[8px] font-black uppercase text-white/30 block mb-1">Interactive stack index</span>
                  <div className="flex items-center space-x-3">
                    <button 
                      onClick={triggerUndo}
                      disabled={undoStack.length === 0}
                      className={cn(
                        "flex-1 p-2 rounded-xl flex items-center justify-center space-x-1.5 border text-[10px] font-bold uppercase transition-all",
                        undoStack.length > 0 ? "bg-white/5 border-white/15 text-white hover:bg-white/10" : "opacity-35 text-white/30 border-white/5 cursor-not-allowed"
                      )}
                    >
                      <Undo2 size={12} />
                      <span>Undo ({undoStack.length})</span>
                    </button>
                    
                    <button 
                      onClick={triggerRedo}
                      disabled={redoStack.length === 0}
                      className={cn(
                        "flex-1 p-2 rounded-xl flex items-center justify-center space-x-1.5 border text-[10px] font-bold uppercase transition-all",
                        redoStack.length > 0 ? "bg-white/5 border-white/15 text-white hover:bg-white/10" : "opacity-35 text-white/30 border-white/5 cursor-not-allowed"
                      )}
                    >
                      <Redo2 size={12} />
                      <span>Redo ({redoStack.length})</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-white/5 pt-6 mt-6 flex justify-end gap-3">
            <button 
              onClick={() => {
                setSettings(DEFAULT_SETTINGS);
                localStorage.setItem('bi-vac-genomics-preferences', JSON.stringify(DEFAULT_SETTINGS));
                
                // Haptic feedback
                if (typeof navigator !== 'undefined' && navigator.vibrate) {
                  navigator.vibrate([100, 50, 100]);
                }
              }}
              className="px-6 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-[10px] font-black uppercase tracking-widest text-white transition-colors"
            >
              Master Reset All Settings
            </button>

            <button 
              onClick={() => resetTabDefaults(activeTab)}
              className="px-6 py-2.5 rounded-xl bg-brand-blue text-black font-black text-[10px] uppercase tracking-widest shadow-lg shadow-brand-blue/10 hover:scale-105 transition-all"
            >
              Reset Current Tab Defaults
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
