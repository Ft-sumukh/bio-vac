"use client";

import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, Float } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, ShieldAlert, Cpu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useHandTracking } from '@/hooks/useHandTracking';
import GestureIntelligencePanel from '@/components/genomics/GestureIntelligencePanel';

// --- CUSTOM 3D COMPONENTS ---
const ProteinModel = ({ mode, mutationActive, setHoveredAA }: any) => {
  const groupRef = useRef<THREE.Group>(null);
  const { clock } = useThree();

  const atoms = useMemo(() => {
    const points = [];
    let currentPoint = new THREE.Vector3(0, -10, 0);
    for (let i = 0; i < 400; i++) {
      const angle = i * 0.5;
      const radius = 3 + Math.sin(i * 0.1) * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = (i / 400) * 20 - 10;
      const pos = new THREE.Vector3(x, y, z);
      pos.x += (Math.random() - 0.5) * 0.5;
      pos.y += (Math.random() - 0.5) * 0.5;
      pos.z += (Math.random() - 0.5) * 0.5;
      const isMutation = Math.random() > 0.95;
      points.push({
        position: pos,
        id: `AA-${i}`,
        type: isMutation ? 'MUTATION' : 'NORMAL',
        severity: isMutation ? Math.random() : 0,
        name: isMutation ? ['N501Y', 'E484K', 'L452R'][Math.floor(Math.random()*3)] : 'Standard'
      });
    }
    return points;
  }, []);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.1;
      groupRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.5) * 0.5;
    }
  });

  return (
    <group ref={groupRef}>
      {mode === 'Ball-and-Stick' || mode === 'Surface' ? (
        atoms.map((atom, i) => (
          <mesh 
            key={i} 
            position={atom.position}
            onPointerOver={(e) => {
              e.stopPropagation();
              setHoveredAA(atom);
            }}
            onPointerOut={() => setHoveredAA(null)}
          >
            <sphereGeometry args={[mode === 'Surface' ? 0.8 : 0.3, 16, 16]} />
            <meshPhysicalMaterial 
              color={
                atom.type === 'MUTATION' && mutationActive 
                  ? (atom.severity > 0.7 ? '#ff0000' : '#ffaa00') 
                  : '#00D2FF'
              }
              emissive={
                atom.type === 'MUTATION' && mutationActive 
                  ? (atom.severity > 0.7 ? '#ff0000' : '#ffaa00') 
                  : '#001133'
              }
              emissiveIntensity={atom.type === 'MUTATION' && mutationActive ? 2 : 0.5}
              roughness={0.2}
              metalness={0.8}
              transparent
              opacity={mode === 'Surface' ? 0.9 : 1}
            />
          </mesh>
        ))
      ) : (
        <mesh>
          <tubeGeometry args={[new THREE.CatmullRomCurve3(atoms.map(a => a.position)), 200, mode === 'Wireframe' ? 0.1 : 0.4, 8, false]} />
          <meshPhysicalMaterial 
            color="#00D2FF" 
            emissive="#003366"
            wireframe={mode === 'Wireframe'}
            roughness={0.1}
            metalness={0.5}
            clearcoat={1}
          />
        </mesh>
      )}
      
      {mode === 'Ball-and-Stick' && atoms.map((atom, i) => {
        if (i === 0) return null;
        const prev = atoms[i - 1];
        const distance = atom.position.distanceTo(prev.position);
        if (distance > 2) return null;
        const center = new THREE.Vector3().addVectors(atom.position, prev.position).multiplyScalar(0.5);
        const orientation = new THREE.Matrix4();
        orientation.lookAt(atom.position, prev.position, new THREE.Object3D().up);
        orientation.multiply(new THREE.Matrix4().set(1, 0, 0, 0, 0, 0, 1, 0, 0, -1, 0, 0, 0, 0, 0, 1));
        const quaternion = new THREE.Quaternion().setFromRotationMatrix(orientation);
        return (
          <mesh key={`bond-${i}`} position={center} quaternion={quaternion}>
            <cylinderGeometry args={[0.08, 0.08, distance, 8]} />
            <meshStandardMaterial color="#ffffff" transparent opacity={0.5} />
          </mesh>
        );
      })}
    </group>
  );
};

// --- MAIN COMPONENT ---
export default function StructuralGenomics() {
  const [renderMode, setRenderMode] = useState('Ball-and-Stick');
  const [mutationActive, setMutationActive] = useState(true);
  const [hoveredAA, setHoveredAA] = useState<any>(null);
  const [showWebcamOverlay, setShowWebcamOverlay] = useState(true);

  // References for Hand Tracking
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { state: trackingState, enableTracking, disableTracking } = useHandTracking(videoRef, canvasRef, containerRef);

  return (
    <div className="h-[calc(100vh-4rem)] flex gap-6 overflow-hidden pb-6">
      
      {/* LEFT SIDE: 3D VIEWPORT */}
      <div 
        ref={containerRef}
        className="flex-1 relative rounded-[40px] overflow-hidden border border-brand-blue/20 bg-black/80 shadow-[0_0_50px_rgba(0,210,255,0.05)] touch-none"
      >
        <div className="absolute inset-0 pointer-events-none z-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay" />
        <div className="absolute inset-0 pointer-events-none z-10 box-border border-[2px] border-white/5 rounded-[40px]" />
        
        {/* Top UI Overlay */}
        <div className="absolute top-8 left-8 z-20 pointer-events-none">
          <div className="flex items-center space-x-3 mb-2">
            <div className={cn("w-2 h-2 rounded-full animate-pulse", trackingState.isEnabled ? "bg-brand-blue" : "bg-red-500")} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">
              {trackingState.isEnabled ? 'AI GESTURE INTERFACE ACTIVE' : 'Live Structural Feed'}
            </span>
          </div>
          <h1 className="text-4xl font-black text-brand-blue uppercase tracking-tighter">SARS-CoV-2</h1>
          <p className="text-sm font-bold text-white/40 uppercase tracking-widest">Spike Glycoprotein (Variant JN.1)</p>
        </div>

        <Canvas gl={{ antialias: true, alpha: false }} camera={{ position: [0, 0, 25], fov: 45 }}>
          <color attach="background" args={['#02050A']} />
          <ambientLight intensity={0.2} />
          <pointLight position={[10, 10, 10]} intensity={1.5} color="#00D2FF" />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#FF1744" />
          <spotLight position={[0, 20, 0]} angle={0.3} penumbra={1} intensity={2} color="#ffffff" castShadow />
          
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          
          <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
            <ProteinModel mode={renderMode} mutationActive={mutationActive} setHoveredAA={setHoveredAA} />
          </Float>
          
          <OrbitControls 
            makeDefault 
            enableDamping 
            dampingFactor={0.05} 
            minDistance={10} 
            maxDistance={50}
            autoRotate={!trackingState.isEnabled && !hoveredAA} // Pause auto-rotate if tracking is enabled
            autoRotateSpeed={0.5}
          />
        </Canvas>

        {/* Hovered Amino Acid HUD */}
        <AnimatePresence>
          {hoveredAA && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute bottom-10 left-10 z-30 p-6 bg-black/60 backdrop-blur-xl border border-white/10 rounded-3xl w-80 shadow-2xl"
            >
              <div className="flex items-center space-x-3 mb-4 pb-4 border-b border-white/10">
                <Cpu size={20} className="text-brand-blue" />
                <h3 className="text-sm font-black text-white uppercase tracking-widest">Neural Analysis</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Region ID</span>
                  <span className="text-xs font-black text-brand-blue font-mono">{hoveredAA.id}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Classification</span>
                  <span className={cn(
                    "text-xs font-black px-2 py-1 rounded-md uppercase",
                    hoveredAA.type === 'MUTATION' ? "bg-red-500/20 text-red-500" : "bg-green-500/20 text-green-500"
                  )}>
                    {hoveredAA.type === 'MUTATION' ? hoveredAA.name : 'Stable'}
                  </span>
                </div>
                {hoveredAA.type === 'MUTATION' && (
                  <>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Escape Prob.</span>
                        <span className="text-xs font-black text-red-500">{(hoveredAA.severity * 100).toFixed(1)}%</span>
                      </div>
                      <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-red-500" style={{ width: `${hoveredAA.severity * 100}%` }} />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* BOTTOM OVERLAY: Mini Live Webcam Preview */}
        <AnimatePresence>
          {showWebcamOverlay && trackingState.isEnabled && (
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="absolute bottom-10 right-10 z-40 w-64 h-48 rounded-2xl overflow-hidden border border-brand-blue/30 shadow-[0_0_20px_rgba(0,210,255,0.2)] bg-black"
            >
              <div className="absolute top-2 left-2 z-10 px-2 py-0.5 bg-black/60 rounded backdrop-blur border border-white/10 flex items-center space-x-1">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                <span className="text-[8px] font-bold text-white/80 uppercase">Live Feed</span>
              </div>
              <video 
                ref={videoRef} 
                className="absolute inset-0 w-full h-full object-cover hidden"
                playsInline
              />
              <canvas 
                ref={canvasRef} 
                width={640} 
                height={480} 
                className="w-full h-full object-cover"
                style={{ transform: 'scaleX(-1)' }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* RIGHT SIDE: Layout Column */}
      <div className="w-80 flex flex-col space-y-6 overflow-y-auto custom-scrollbar pr-2 pb-2">
        
        {/* New Gesture Intelligence Panel */}
        <GestureIntelligencePanel 
          trackingState={trackingState}
          onEnable={enableTracking}
          onDisable={disableTracking}
          showOverlay={showWebcamOverlay}
          setShowOverlay={setShowWebcamOverlay}
        />

        {/* Original Controls (Render Mode & Targets) */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/5 rounded-[32px] p-6 space-y-4">
          <div className="flex items-center space-x-3 mb-6">
            <Layers size={18} className="text-brand-blue" />
            <h2 className="text-xs font-black uppercase tracking-widest text-white/60">Render Engine</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {['Ribbon', 'Ball-and-Stick', 'Surface', 'Wireframe'].map((mode) => (
              <button
                key={mode}
                onClick={() => setRenderMode(mode)}
                className={cn(
                  "p-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
                  renderMode === mode 
                    ? "bg-brand-blue/20 text-brand-blue border border-brand-blue/50" 
                    : "bg-black/40 text-white/40 border border-white/5 hover:bg-white/5 hover:text-white"
                )}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/5 rounded-[32px] p-6 space-y-4">
          <div className="flex items-center space-x-3 mb-6">
            <ShieldAlert size={18} className="text-red-500" />
            <h2 className="text-xs font-black uppercase tracking-widest text-white/60">Intelligence</h2>
          </div>
          
          <button 
            onClick={() => setMutationActive(!mutationActive)}
            className={cn(
              "w-full p-4 rounded-2xl flex items-center justify-between border transition-all",
              mutationActive 
                ? "bg-red-500/10 border-red-500/50 text-red-500" 
                : "bg-black/40 border-white/5 text-white/40"
            )}
          >
            <span className="text-[10px] font-black uppercase tracking-widest">Mutation Hotspots</span>
            <div className={cn("w-3 h-3 rounded-full", mutationActive ? "bg-red-500 animate-pulse" : "bg-white/20")} />
          </button>
        </div>
      </div>
    </div>
  );
}
