"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Globe, 
  Map as MapIcon, 
  Target, 
  AlertCircle, 
  Activity, 
  ArrowUpRight,
  ShieldAlert,
  Zap,
  Layers,
  Maximize2,
  Download,
  Filter
} from "lucide-react";
import { GlassCard } from "@/components/ui/StatCard";
import { 
  ComposableMap, 
  Geographies, 
  Geography, 
  Marker,
  Sphere,
  Graticule
} from "react-simple-maps";
import { REGIONAL_RISK } from "@/lib/mock";
import { cn } from "@/lib/utils";
import { useBIVACStore } from "@/lib/store";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export default function SurveillancePage() {
  const { selectedRegion, setSelectedRegion } = useBIVACStore();
  const [hoveredRegion, setHoveredRegion] = useState<any>(null);
  const [mapMode, setMapMode] = useState<'risk' | 'volume' | 'active'>('risk');

  const selectedRegionData = REGIONAL_RISK.find(r => r.region === selectedRegion);

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 text-brand-blue mb-2">
            <Globe size={14} className="fill-current" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Geospatial Surveillance Engine</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white">Global <span className="text-white/40 block sm:inline">Surveillance</span></h1>
          <p className="text-white/40 mt-2 font-medium max-w-xl">
            Real-time monitoring of variant migration and regional outbreak intensity across 142 territories.
          </p>
        </div>

        <div className="flex items-center gap-3">
           <div className="flex items-center space-x-4 bg-white/5 p-1 rounded-2xl border border-white/5">
              <MapModeButton active={mapMode === 'risk'} onClick={() => setMapMode('risk')} label="Evasion Risk" />
              <MapModeButton active={mapMode === 'volume'} onClick={() => setMapMode('volume')} label="Sequence Volume" />
           </div>
           <button className="p-3.5 bg-white/5 border border-white/5 rounded-xl text-white/40 hover:text-white transition-colors">
              <Download size={20} />
           </button>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Map Container */}
        <div className="lg:col-span-8">
           <GlassCard className="p-0 h-[400px] md:h-[650px] relative overflow-hidden bg-black/60 border-brand-blue/20">
              {/* Map UI Overlays */}
              <div className="absolute top-8 left-8 z-20 space-y-4">
                 <GlassCard className="p-4 bg-black/40 backdrop-blur-3xl border-white/10 w-48">
                    <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-3">Map Layers</div>
                    <div className="space-y-2">
                       <LayerToggle icon={<Zap size={14} />} label="Hotspots" active />
                       <LayerToggle icon={<Activity size={14} />} label="Flow Lines" />
                       <LayerToggle icon={<ShieldAlert size={14} />} label="Evasion Buffer" />
                    </div>
                 </GlassCard>
              </div>

              <div className="w-full h-full">
                <ComposableMap 
                   projectionConfig={{ rotate: [-10, 0, 0], scale: 180 }}
                   className="w-full h-full"
                >
                  <Sphere stroke="#ffffff10" strokeWidth={0.5} id="sphere" fill="none" />
                  <Graticule stroke="#ffffff05" strokeWidth={0.5} />
                  <Geographies geography={geoUrl}>
                    {({ geographies }) =>
                      geographies.map((geo) => (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          fill="#ffffff08"
                          stroke="#ffffff15"
                          strokeWidth={0.5}
                          style={{
                            default: { outline: "none" },
                            hover: { fill: "#00D2FF20", outline: "none" },
                            pressed: { outline: "none" },
                          }}
                        />
                      ))
                    }
                  </Geographies>

                  {REGIONAL_RISK.map(({ region, lat, lng, score, color, variant }) => (
                    <Marker 
                      key={region} 
                      coordinates={[lng, lat]}
                      onMouseEnter={() => setHoveredRegion({ region, score, variant, color })}
                      onMouseLeave={() => setHoveredRegion(null)}
                      onClick={() => setSelectedRegion(region)}
                    >
                      <circle r={mapMode === 'risk' ? 8 : 12} fill={color} className="animate-pulse opacity-40 cursor-pointer" />
                      <circle r={mapMode === 'risk' ? 3 : 5} fill={color} className="cursor-pointer" />
                    </Marker>
                  ))}
                </ComposableMap>
              </div>

              {/* Time Slider Mock */}
              <div className="absolute bottom-4 md:bottom-8 left-4 md:left-8 right-4 md:right-8 z-20 hidden sm:block">
                 <GlassCard className="p-6 bg-black/80 backdrop-blur-3xl border-white/10">
                    <div className="flex items-center justify-between mb-4">
                       <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Historical Playback</span>
                       <span className="text-xs font-black text-brand-blue">May 2024 — Present</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full relative">
                       <div className="absolute top-0 left-0 w-3/4 h-full bg-brand-blue rounded-full shadow-[0_0_15px_rgba(0,210,255,0.5)]" />
                       <div className="absolute top-1/2 left-3/4 -translate-y-1/2 w-4 h-4 bg-white rounded-full border-2 border-brand-blue cursor-pointer" />
                    </div>
                 </GlassCard>
              </div>
           </GlassCard>
        </div>

        {/* Regional Intelligence Sidebar */}
        <div className="lg:col-span-4 space-y-6">
           <AnimatePresence mode="wait">
              {selectedRegionData ? (
                 <motion.div 
                   key={selectedRegionData.region}
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: 20 }}
                 >
                    <GlassCard className="p-8 border-brand-blue/30 bg-brand-blue/5">
                       <div className="flex items-center justify-between mb-8">
                          <h2 className="text-2xl font-black text-white">{selectedRegionData.region}</h2>
                          <button onClick={() => setSelectedRegion(null)} className="text-[10px] font-black uppercase text-white/20 hover:text-white transition-colors">Close</button>
                       </div>
                       
                       <div className="space-y-8">
                          <div>
                             <div className="text-[10px] font-black uppercase tracking-widest text-brand-blue mb-2">Dominant Strains</div>
                             <div className="flex flex-wrap gap-2">
                                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs font-black text-white">{selectedRegionData.variant}</span>
                                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs font-black text-white/40">JN.1-V2</span>
                             </div>
                          </div>

                          <div className="grid grid-cols-2 gap-6">
                             <div>
                                <div className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-1">Evasion Risk</div>
                                <div className="text-3xl font-black text-white">{selectedRegionData.score}%</div>
                             </div>
                             <div>
                                <div className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-1">Case Trend</div>
                                <div className="text-3xl font-black text-red-500">+14.2%</div>
                             </div>
                          </div>

                          <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                             <div className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2">Molecular Profile</div>
                             <p className="text-xs font-medium text-white/60 leading-relaxed italic">
                                &quot;High frequency of Spike-E484K detected in wastewater samples. Evasion buffer calculation suggests imminent vaccine breakthrough clusters.&quot;
                             </p>
                          </div>

                          <button className="w-full py-4 bg-brand-blue text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-brand-blue/20 hover:scale-105 transition-all">
                             View Regional Report
                          </button>
                       </div>
                    </GlassCard>
                 </motion.div>
              ) : (
                 <GlassCard className="p-10 flex flex-col items-center justify-center text-center h-[400px]">
                    <Globe className="text-white/10 mb-6" size={48} />
                    <h3 className="text-lg font-black text-white mb-2">Regional Intelligence</h3>
                    <p className="text-xs text-white/20 font-medium leading-relaxed max-w-[200px]">
                       Select a territory on the map to view detailed genomic surveillance data.
                    </p>
                 </GlassCard>
              )}
           </AnimatePresence>

           <GlassCard className="p-8">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-6">Trending Territiories</h3>
              <div className="space-y-4">
                 {REGIONAL_RISK.slice(0, 3).map((item) => (
                    <div key={item.region} className="flex items-center justify-between group cursor-pointer" onClick={() => setSelectedRegion(item.region)}>
                       <div className="flex items-center space-x-3">
                          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-sm font-bold text-white/80 group-hover:text-white transition-colors">{item.region}</span>
                       </div>
                       <ArrowUpRight size={14} className="text-white/10 group-hover:text-white transition-colors" />
                    </div>
                 ))}
              </div>
           </GlassCard>
        </div>
      </div>
    </div>
  );
}

const MapModeButton = ({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={cn(
      "px-3 md:px-6 py-2.5 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all",
      active ? "bg-brand-blue text-white shadow-lg shadow-brand-blue/20" : "text-white/40 hover:text-white"
    )}
  >
    {label}
  </button>
);

const LayerToggle = ({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) => (
  <div className="flex items-center justify-between group cursor-pointer">
     <div className="flex items-center space-x-3 text-white/40 group-hover:text-white transition-colors">
        {icon}
        <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
     </div>
     <div className={cn(
       "w-8 h-4 rounded-full relative transition-colors",
       active ? "bg-brand-blue" : "bg-white/10"
     )}>
        <div className={cn(
          "absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-all",
          active ? "translate-x-4" : "translate-x-0"
        )} />
     </div>
  </div>
);
