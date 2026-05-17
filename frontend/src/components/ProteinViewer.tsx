"use client";

import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, Minimize2, MousePointer2, Zap } from 'lucide-react';

export default function ProteinViewer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    
    // Get client sizes or fallback sizes
    let width = container.clientWidth || 600;
    let height = container.clientHeight || 500;

    // Initialize Three.js
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setPixelRatio(typeof window !== 'undefined' ? window.devicePixelRatio : 1);
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    // Create complex "protein" geometry (Icosahedron + noise-like spheres)
    const group = new THREE.Group();
    
    const geometry = new THREE.IcosahedronGeometry(4.5, 4);
    const material = new THREE.MeshPhongMaterial({
      color: 0x00D2FF,
      emissive: 0x001133,
      shininess: 100,
      wireframe: true,
    });
    const core = new THREE.Mesh(geometry, material);
    group.add(core);

    // Add "Mutation Markers" as glowing red spheres
    for (let i = 0; i < 12; i++) {
      const markerGeom = new THREE.SphereGeometry(0.35, 16, 16);
      const markerMat = new THREE.MeshBasicMaterial({ 
        color: 0xFF1744,
      });
      const marker = new THREE.Mesh(markerGeom, markerMat);
      
      const phi = Math.random() * Math.PI * 2;
      const theta = Math.random() * Math.PI;
      const radius = 4.7;
      
      marker.position.x = radius * Math.sin(theta) * Math.cos(phi);
      marker.position.y = radius * Math.sin(theta) * Math.sin(phi);
      marker.position.z = radius * Math.cos(theta);
      
      group.add(marker);
    }

    scene.add(group);

    // Lighting
    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight1.position.set(5, 5, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x00D2FF, 1.0);
    dirLight2.position.set(-5, -5, 5);
    scene.add(dirLight2);

    scene.add(new THREE.AmbientLight(0xffffff, 0.3));

    camera.position.z = 11;

    // Interactive Rotation
    let mouseX = 0, mouseY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Dynamic resize observer loop to handle full screen transitions instantly
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const w = entry.contentRect.width || container.clientWidth || 600;
        const h = entry.contentRect.height || container.clientHeight || 500;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }
    });
    resizeObserver.observe(container);

    const animate = () => {
      requestAnimationFrame(animate);
      group.rotation.y += 0.003;
      group.rotation.x += (mouseY * 0.15 - group.rotation.x) * 0.05;
      group.rotation.y += (mouseX * 0.15 - group.rotation.y) * 0.05;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      resizeObserver.disconnect();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className={isMaximized 
      ? "fixed inset-0 z-50 bg-[#050505]/95 backdrop-blur-3xl flex flex-col p-8 md:p-12 md:pl-24" 
      : "relative w-full h-full min-h-[400px] md:min-h-[600px] group cursor-grab active:cursor-grabbing"
    }>
      {/* 3D Target container */}
      <div ref={containerRef} className="w-full h-full flex-1 min-h-0" />
      
      {/* HUD Overlays (Top Left) */}
      <div className="absolute top-8 left-8 md:left-12 pointer-events-none z-10">
         <div className="flex items-center space-x-3 mb-2">
            <Zap className="text-brand-blue animate-pulse" size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest text-white/60">3D Structural Analysis</span>
         </div>
         <div className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">SPIKE GLYCOPROTEIN</div>
         <div className="text-[10px] font-bold text-white/20 mt-1 uppercase tracking-widest">PDB ID: 7K8M (JN.1 MODIFIED)</div>
      </div>

      {/* Controller Buttons (Bottom Right) */}
      <div className="absolute bottom-8 right-8 md:right-12 flex items-center space-x-4 z-10">
         <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-black/40 border border-white/10 rounded-lg text-[9px] font-black text-white/40 uppercase tracking-widest">
            <MousePointer2 size={10} />
            <span>Interactive Pan & Drag</span>
         </div>
         
         <button 
           onClick={() => setIsMaximized(!isMaximized)}
           className="p-3 bg-brand-blue text-white rounded-xl shadow-lg shadow-brand-blue/20 hover:scale-110 active:scale-95 transition-all flex items-center justify-center"
           title={isMaximized ? "Minimize viewport" : "Maximize view"}
         >
            {isMaximized ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
         </button>
      </div>

      {/* Mutation Info Overlay (Center Right) */}
      <div className="absolute top-1/2 right-8 md:right-12 -translate-y-1/2 space-y-4 pointer-events-none z-10">
         {[
           { m: "N501Y", risk: "HIGH", col: "text-orange-400" },
           { m: "E484K", risk: "CRIT", col: "text-red-500" },
           { m: "L452R", risk: "MED", col: "text-brand-blue" }
         ].map((mut, i) => (
           <motion.div 
             key={mut.m}
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.5 + i * 0.1 }}
             className="px-4 py-2.5 bg-black/60 border border-white/10 backdrop-blur-md rounded-xl shadow-xl w-32"
           >
              <div className="text-[8px] font-black text-white/35 uppercase tracking-widest">{mut.risk} RISK</div>
              <div className={`text-sm font-black uppercase ${mut.col} tracking-tight mt-0.5`}>{mut.m}</div>
           </motion.div>
         ))}
      </div>
    </div>
  );
}
