"use client";

import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { Maximize2, MousePointer2, Zap } from 'lucide-react';

export default function ProteinViewer() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize Three.js
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.appendChild(renderer.domElement);

    // Create complex "protein" geometry (Icosahedron + noise-like spheres)
    const group = new THREE.Group();
    
    const geometry = new THREE.IcosahedronGeometry(5, 4);
    const material = new THREE.MeshPhongMaterial({
      color: 0x00D2FF,
      emissive: 0x003366,
      shininess: 100,
      wireframe: true,
    });
    const core = new THREE.Mesh(geometry, material);
    group.add(core);

    // Add "Mutation Markers" as glowing red spheres
    for (let i = 0; i < 8; i++) {
      const markerGeom = new THREE.SphereGeometry(0.3, 16, 16);
      const markerMat = new THREE.MeshBasicMaterial({ 
        color: 0xFF1744,
      });
      const marker = new THREE.Mesh(markerGeom, markerMat);
      
      const phi = Math.random() * Math.PI * 2;
      const theta = Math.random() * Math.PI;
      const radius = 5.2;
      
      marker.position.x = radius * Math.sin(theta) * Math.cos(phi);
      marker.position.y = radius * Math.sin(theta) * Math.sin(phi);
      marker.position.z = radius * Math.cos(theta);
      
      group.add(marker);
    }

    scene.add(group);

    // Lighting
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 5);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));

    camera.position.z = 12;

    // Interactive Rotation
    let mouseX = 0, mouseY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      requestAnimationFrame(animate);
      group.rotation.y += 0.005;
      group.rotation.x += (mouseY * 0.2 - group.rotation.x) * 0.1;
      group.rotation.y += (mouseX * 0.2 - group.rotation.y) * 0.1;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full min-h-[400px] group cursor-grab active:cursor-grabbing">
      <div ref={containerRef} className="w-full h-full" />
      
      {/* AR Overlays */}
      <div className="absolute top-6 left-6 pointer-events-none">
         <div className="flex items-center space-x-3 mb-2">
            <Zap className="text-brand-blue" size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest text-white/60">3D Structural Analysis</span>
         </div>
         <div className="text-xl font-black text-white">SPIKE GLYCOPROTEIN</div>
         <div className="text-[10px] font-bold text-white/20 mt-1 uppercase tracking-widest">PDB ID: 7K8M (JN.1 MODIFIED)</div>
      </div>

      <div className="absolute bottom-6 right-6 flex items-center space-x-4">
         <div className="flex items-center space-x-2 px-3 py-1.5 bg-black/40 border border-white/10 rounded-lg text-[9px] font-black text-white/40 uppercase tracking-widest">
            <MousePointer2 size={10} />
            <span>Orbit Enabled</span>
         </div>
         <button className="p-3 bg-brand-blue text-white rounded-xl shadow-lg shadow-brand-blue/20">
            <Maximize2 size={16} />
         </button>
      </div>

      {/* Mutation Info Overlay */}
      <div className="absolute top-1/2 right-6 -translate-y-1/2 space-y-4 pointer-events-none">
         {[
           { m: "N501Y", risk: "HIGH" },
           { m: "E484K", risk: "CRIT" },
           { m: "L452R", risk: "MED" }
         ].map((mut, i) => (
           <motion.div 
             key={mut.m}
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.5 + i * 0.1 }}
             className="px-4 py-2 bg-black/60 border border-white/5 backdrop-blur-md rounded-xl"
           >
              <div className="text-[9px] font-black text-white/40 uppercase">{mut.risk} RISK SITE</div>
              <div className="text-sm font-black text-white">{mut.m}</div>
           </motion.div>
         ))}
      </div>
    </div>
  );
}
