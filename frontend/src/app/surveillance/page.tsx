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

interface LocalHotspot {
  city: string;
  coords: [number, number];
  wastewaterRate: number;
  sequencingVolume: number;
  strain: string;
  status: 'Critical' | 'Elevated' | 'Stable';
}

const LOCAL_HOTSPOTS: Record<string, LocalHotspot[]> = {
  "United States": [
    { city: "New York Metro Area", coords: [-74.006, 40.7128], wastewaterRate: 84, sequencingVolume: 4250, strain: "JN.1-V5", status: "Critical" },
    { city: "Los Angeles County", coords: [-118.2437, 34.0522], wastewaterRate: 72, sequencingVolume: 3120, strain: "JN.1-V3", status: "Elevated" },
    { city: "Chicago Cook County", coords: [-87.6298, 41.8781], wastewaterRate: 68, sequencingVolume: 1980, strain: "JN.1-V2", status: "Elevated" },
    { city: "Houston Harris Area", coords: [-95.3698, 29.7604], wastewaterRate: 89, sequencingVolume: 2850, strain: "JN.1-V5", status: "Critical" },
  ],
  "United Kingdom": [
    { city: "Greater London Area", coords: [-0.1278, 51.5074], wastewaterRate: 82, sequencingVolume: 3450, strain: "JN.1-V5", status: "Critical" },
    { city: "Greater Manchester", coords: [-2.2426, 53.4808], wastewaterRate: 70, sequencingVolume: 1820, strain: "JN.1-V3", status: "Elevated" },
    { city: "Edinburgh & Lothians", coords: [-3.1883, 55.9533], wastewaterRate: 64, sequencingVolume: 920, strain: "JN.1-V2", status: "Stable" },
  ],
  "India": [
    { city: "Mumbai Metro Region", coords: [72.8777, 19.0760], wastewaterRate: 92, sequencingVolume: 5120, strain: "JN.1-V5", status: "Critical" },
    { city: "Delhi NCR District", coords: [77.2090, 28.6139], wastewaterRate: 86, sequencingVolume: 4680, strain: "JN.1-V5", status: "Critical" },
    { city: "Bengaluru Bio-Hub", coords: [77.5946, 12.9716], wastewaterRate: 78, sequencingVolume: 3100, strain: "JN.1-V4", status: "Elevated" },
  ],
  "South Africa": [
    { city: "Gauteng (Joburg)", coords: [28.0473, -26.2041], wastewaterRate: 85, sequencingVolume: 2150, strain: "JN.1-V5", status: "Critical" },
    { city: "Western Cape (Cape Town)", coords: [18.4241, -33.9249], wastewaterRate: 74, sequencingVolume: 1680, strain: "JN.1-V4", status: "Elevated" },
    { city: "Durban Metro Area", coords: [31.0218, -29.8587], wastewaterRate: 62, sequencingVolume: 840, strain: "JN.1-V2", status: "Stable" },
  ],
};

const COUNTRY_CENTERS: Record<string, { center: [number, number], scale: number }> = {
  "United States": { center: [-95.7129, 37.0902], scale: 380 },
  "United Kingdom": { center: [-2.2426, 54.5], scale: 1300 },
  "India": { center: [78.9629, 20.5937], scale: 750 },
  "South Africa": { center: [25.0, -29.0], scale: 850 },
};

const getGeographyCenter = (geo: any): { center: [number, number], scale: number } => {
  const name = geo.properties.name;
  if (COUNTRY_CENTERS[name]) return COUNTRY_CENTERS[name];
  
  let sumLng = 0;
  let sumLat = 0;
  let count = 0;
  
  const processCoords = (coords: any[]) => {
    if (typeof coords[0] === 'number') {
      sumLng += coords[0];
      sumLat += coords[1];
      count++;
    } else {
      coords.forEach(processCoords);
    }
  };
  
  if (geo.geometry && geo.geometry.coordinates) {
    processCoords(geo.geometry.coordinates);
  }
  
  if (count > 0) {
    return { center: [sumLng / count, sumLat / count], scale: 400 };
  }
  
  return { center: [0, 20], scale: 200 };
};

const getCountryHotspots = (countryName: string, center: [number, number]): LocalHotspot[] => {
  if (LOCAL_HOTSPOTS[countryName]) return LOCAL_HOTSPOTS[countryName];
  
  let seed = 0;
  for (let i = 0; i < countryName.length; i++) {
    seed += countryName.charCodeAt(i);
  }
  const random = (offset: number) => {
    const x = Math.sin(seed + offset) * 10000;
    return x - Math.floor(x);
  };
  
  return [
    {
      city: `${countryName} Metropolitan Hub`,
      coords: [center[0] + (random(1) - 0.5) * 3, center[1] + (random(2) - 0.5) * 3],
      wastewaterRate: Math.round(55 + random(3) * 35),
      sequencingVolume: Math.round(500 + random(4) * 2500),
      strain: "JN.1-V5",
      status: random(5) > 0.6 ? "Critical" : "Elevated"
    },
    {
      city: `${countryName} Coastal Transit Port`,
      coords: [center[0] + (random(6) - 0.5) * 4, center[1] + (random(7) - 0.5) * 4],
      wastewaterRate: Math.round(40 + random(8) * 40),
      sequencingVolume: Math.round(200 + random(9) * 1500),
      strain: "JN.1-V3",
      status: random(10) > 0.5 ? "Elevated" : "Stable"
    },
    {
      city: `${countryName} Northern Border District`,
      coords: [center[0] + (random(11) - 0.5) * 3, center[1] + (random(12) - 0.5) * 3],
      wastewaterRate: Math.round(30 + random(13) * 50),
      sequencingVolume: Math.round(100 + random(14) * 1000),
      strain: "JN.1-V2",
      status: "Stable"
    }
  ];
};

export default function SurveillancePage() {
  const { selectedRegion, setSelectedRegion } = useBIVACStore();
  const [hoveredRegion, setHoveredRegion] = useState<any>(null);
  const [mapMode, setMapMode] = useState<'risk' | 'volume' | 'active'>('risk');
  const [isMapMaximized, setIsMapMaximized] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<any>(null);

  const selectedRegionData = REGIONAL_RISK.find(r => r.region === selectedRegion);

  const handleCountryClick = (geo: any) => {
    const name = geo.properties.name;
    const centerAndScale = getGeographyCenter(geo);
    const hotspots = getCountryHotspots(name, centerAndScale.center);
    
    setSelectedCountry({
      name,
      geo,
      center: centerAndScale.center,
      scale: centerAndScale.scale,
      hotspots
    });
  };

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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Map Container */}
        <div className={cn(
          "transition-all duration-500 flex flex-col justify-stretch",
          isMapMaximized 
            ? "fixed inset-0 w-screen h-screen z-50 bg-[#020408]/95 backdrop-blur-3xl p-8"
            : "lg:col-span-8"
        )}>
           <GlassCard className={cn(
              "p-0 relative overflow-hidden bg-black/60 border-brand-blue/20 transition-all duration-500 flex-1 flex flex-col",
              isMapMaximized ? "w-full h-full p-4" : "h-[400px] md:h-[650px]"
           )}>
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

              {/* Maximize Toggle Button */}
              <button 
                onClick={() => setIsMapMaximized(!isMapMaximized)}
                className="absolute top-8 right-8 z-30 p-3 bg-black/60 hover:bg-brand-blue hover:text-black rounded-xl backdrop-blur-md border border-white/10 text-white/70 transition-all"
                title={isMapMaximized ? "Minimize Map" : "Maximize Map"}
              >
                <Maximize2 size={16} className={cn("transition-transform", isMapMaximized && "rotate-180")} />
              </button>

              <div className="w-full flex-1 min-h-[300px]">
                <ComposableMap 
                   projectionConfig={{ rotate: [-10, 0, 0], scale: isMapMaximized ? 240 : 180 }}
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
                           onClick={() => handleCountryClick(geo)}
                           className="cursor-pointer"
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
      <AnimatePresence>
        {selectedCountry && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 w-screen h-screen z-50 bg-black/95 backdrop-blur-2xl p-6 md:p-12 flex flex-col lg:flex-row gap-8 overflow-y-auto"
          >
            {/* Left Column: High-Tech Focused Zoom Map */}
            <div className="flex-1 bg-black/40 border border-white/10 rounded-[32px] p-6 flex flex-col relative min-h-[450px]">
              <div className="absolute top-6 left-6 z-20">
                <div className="flex items-center space-x-2 text-brand-blue mb-1">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Focused Surveillance</span>
                </div>
                <h3 className="text-2xl font-black text-white uppercase">{selectedCountry.name} Spatial Projection</h3>
              </div>

              {/* Close/Back Button */}
              <button 
                onClick={() => setSelectedCountry(null)}
                className="absolute top-6 right-6 z-30 px-5 py-2.5 bg-white/5 hover:bg-brand-blue hover:text-black rounded-xl border border-white/10 text-xs font-black uppercase tracking-wider transition-all"
              >
                Close Projection
              </button>

              <div className="w-full flex-1 min-h-[350px] relative mt-12">
                <ComposableMap
                  projection="geoMercator"
                  projectionConfig={{
                    center: selectedCountry.center,
                    scale: selectedCountry.scale
                  }}
                  className="w-full h-full"
                >
                  <Geographies geography={geoUrl}>
                    {({ geographies }) =>
                      geographies
                        .filter(g => {
                          const gName = g.properties.name;
                          const sName = selectedCountry.name;
                          return gName === sName || gName.includes(sName) || sName.includes(gName);
                        })
                        .map((geo) => (
                          <Geography
                            key={geo.rsmKey}
                            geography={geo}
                            fill="#00D2FF10"
                            stroke="#00D2FF60"
                            strokeWidth={1.5}
                            style={{
                              default: { outline: "none" },
                              hover: { fill: "#00D2FF20", outline: "none" },
                              pressed: { outline: "none" },
                            }}
                          />
                        ))
                    }
                  </Geographies>

                  {/* Hotspot Municipal markers inside country */}
                  {selectedCountry.hotspots.map((hotspot: LocalHotspot) => (
                    <Marker key={hotspot.city} coordinates={hotspot.coords}>
                      <circle 
                        r={12} 
                        fill={hotspot.status === 'Critical' ? '#FF1744' : hotspot.status === 'Elevated' ? '#FF9100' : '#00E676'} 
                        className="animate-ping opacity-25" 
                      />
                      <circle 
                        r={6} 
                        fill={hotspot.status === 'Critical' ? '#FF1744' : hotspot.status === 'Elevated' ? '#FF9100' : '#00E676'} 
                      />
                    </Marker>
                  ))}
                </ComposableMap>
              </div>

              {/* Map Legend */}
              <div className="absolute bottom-6 left-6 z-20 flex gap-4 text-[9px] font-black uppercase">
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-[#FF1744] rounded-full" /> Critical</div>
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-[#FF9100] rounded-full" /> Elevated</div>
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-[#00E676] rounded-full" /> Stable</div>
              </div>
            </div>

            {/* Right Column: Dynamic municipal surveillance panel */}
            <div className="w-full lg:w-[450px] bg-white/[0.02] border border-white/10 rounded-[32px] p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-6">
                <div>
                  <span className="text-[10px] font-black tracking-widest text-brand-blue uppercase">Municipal Node Activity</span>
                  <h3 className="text-3xl font-black text-white uppercase mt-1">{selectedCountry.name}</h3>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-lg mt-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-[9px] font-black text-red-400 uppercase">ACTIVE SURVEILLANCE BUFFER</span>
                  </div>
                </div>

                {/* Hotspots Grid list */}
                <div className="space-y-4">
                  <div className="text-xs font-black uppercase text-white/40 border-b border-white/5 pb-2">Hotspots Monitoring Sites</div>
                  <div className="space-y-3 overflow-y-auto max-h-[350px] pr-1 custom-scrollbar">
                    {selectedCountry.hotspots.map((hotspot: LocalHotspot) => (
                      <div key={hotspot.city} className="bg-black/40 border border-white/5 p-4 rounded-2xl space-y-2 hover:border-brand-blue/30 transition-all">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-white">{hotspot.city}</span>
                          <span className={cn(
                            "text-[8px] font-black px-2 py-0.5 rounded uppercase",
                            hotspot.status === 'Critical' ? "bg-red-500/20 text-red-400" :
                            hotspot.status === 'Elevated' ? "bg-amber-500/20 text-amber-400" :
                            "bg-green-500/20 text-green-400"
                          )}>
                            {hotspot.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-[10px] font-bold uppercase text-white/50">
                          <div>
                            <span className="block text-[8px] font-black text-white/20">Wastewater</span>
                            <span className="text-white font-mono">{hotspot.wastewaterRate}%</span>
                          </div>
                          <div>
                            <span className="block text-[8px] font-black text-white/20">Genomes</span>
                            <span className="text-white font-mono">{hotspot.sequencingVolume.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="block text-[8px] font-black text-white/20">Strain</span>
                            <span className="text-brand-blue">{hotspot.strain}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-6 border-t border-white/5">
                <button 
                  onClick={() => alert(`Municipal sequencing pipeline initialized for selected regions in ${selectedCountry.name}.`)}
                  className="w-full py-4 bg-brand-blue text-black font-black text-xs uppercase tracking-widest rounded-2xl shadow-lg shadow-brand-blue/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Initiate Local Sequencing Request
                </button>
                <button 
                  onClick={() => alert(`Downloading structural surveillance summary report for ${selectedCountry.name}...`)}
                  className="w-full py-4 bg-white/5 hover:bg-white/10 text-white font-black text-xs uppercase tracking-widest rounded-2xl border border-white/10 transition-all"
                >
                  Export Surveillance PDF Summary
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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
