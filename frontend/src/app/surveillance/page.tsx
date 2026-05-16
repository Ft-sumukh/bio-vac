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
  Zap
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

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export default function SurveillancePage() {
  const [hoveredRegion, setHoveredRegion] = useState<any>(null);

  return (
    <div className="space-y-10 pb-20">
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 text-brand-blue mb-2">
            <Globe size={14} className="fill-current" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Real-time Geospatial Intelligence</span>
          </div>
          <h1 className="text-5xl font-black tracking-tight text-white">Global <span className="text-white/40">Surveillance</span></h1>
          <p className="text-white/40 mt-2 font-medium max-w-xl">
            Visualizing structural shift clusters and regional evasion probabilities across 142 territories.
          </p>
        </div>

        <div className="flex items-center space-x-4 bg-white/5 p-1 rounded-2xl border border-white/5">
           <button className="px-6 py-2.5 bg-brand-blue text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-brand-blue/20">Vector Map</button>
           <button className="px-6 py-2.5 text-white/40 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Satellite</button>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Map Container */}
        <div className="lg:col-span-8">
           <GlassCard className="p-0 h-[650px] relative overflow-hidden bg-black/60 border-brand-blue/20">
              <div className="absolute top-8 left-8 z-20">
                 <div className="flex flex-col space-y-4">
                    <MapControl icon={<Zap size={16} />} label="Hotspots" active />
                    <MapControl icon={<Activity size={16} />} label="Transmission" />
                    <MapControl icon={<ShieldAlert size={16} />} label="Evasion" />
                 </div>
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
                    >
                      <circle r={8} fill={color} className="animate-pulse opacity-40" />
                      <circle r={3} fill={color} />
                    </Marker>
                  ))}
                </ComposableMap>
              </div>

              {/* Legend Overlay */}
              <div className="absolute bottom-8 left-8 z-20 bg-black/60 backdrop-blur-xl border border-white/10 p-5 rounded-2xl">
                 <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-4">Evasion Risk Scale</div>
                 <div className="flex items-center space-x-6">
                    <LegendItem color="#D50000" label="Critical" />
                    <LegendItem color="#FF9100" label="Elevated" />
                    <LegendItem color="#00E5FF" label="Monitored" />
                 </div>
              </div>

              {/* Hover Tooltip Overlay */}
              <AnimatePresence>
                 {hoveredRegion && (
                   <motion.div 
                     initial={{ opacity: 0, x: 20 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: 20 }}
                     className="absolute top-8 right-8 z-30 w-64"
                   >
                      <GlassCard className="p-6 border-white/20 bg-black/80 backdrop-blur-3xl">
                         <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-black text-white">{hoveredRegion.region}</h3>
                            <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: hoveredRegion.color }} />
                         </div>
                         <div className="space-y-4">
                            <div>
                               <div className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">Dominant Variant</div>
                               <div className="text-lg font-black text-brand-blue">{hoveredRegion.variant}</div>
                            </div>
                            <div>
                               <div className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">Risk Index</div>
                               <div className="text-3xl font-black text-white">{hoveredRegion.score}%</div>
                            </div>
                         </div>
                      </GlassCard>
                   </motion.div>
                 )}
              </AnimatePresence>
           </GlassCard>
        </div>

        {/* Regional Breakdown Sidebar */}
        <div className="lg:col-span-4 space-y-6">
           <GlassCard className="p-8">
              <h3 className="text-sm font-black uppercase tracking-widest text-white/60 mb-8">Outbreak Metrics</h3>
              <div className="space-y-8">
                {REGIONAL_RISK.slice(0, 4).map((item) => (
                  <div key={item.region} className="space-y-3">
                    <div className="flex justify-between items-end">
                       <span className="text-xs font-bold text-white/80">{item.region}</span>
                       <div className="flex items-center space-x-2">
                          <span className="text-[10px] font-black text-white/40">{item.variant}</span>
                          <span className="text-sm font-mono font-black text-white">{item.score}%</span>
                       </div>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: `${item.score}%` }}
                         className="h-full"
                         style={{ backgroundColor: item.color }}
                       />
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-10 py-4 bg-white/5 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-all">Download regional reports</button>
           </GlassCard>

           <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-[32px] flex items-center space-x-6">
             <AlertCircle className="text-red-500" size={32} />
             <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-red-500/60 mb-1">Critical Hotspot</div>
                <div className="text-xl font-black text-white">Berlin Metropolitan Area</div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}

const MapControl = ({ icon, label, active = false }: any) => (
  <button className={cn(
    "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all border",
    active ? "bg-brand-blue text-white border-brand-blue/50 shadow-lg shadow-brand-blue/20" : "bg-black/40 text-white/40 border-white/5 hover:bg-black/60"
  )}>
    {icon}
    <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
  </button>
);

const LegendItem = ({ color, label }: any) => (
  <div className="flex items-center space-x-2">
    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
    <span className="text-[9px] font-black uppercase tracking-widest text-white/60">{label}</span>
  </div>
);
