"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Headset, 
  ChevronDown, 
  Check, 
  Sparkles, 
  Plus, 
  X, 
  Dna, 
  AlertCircle,
  Activity,
  Globe,
  Database,
  Zap,
  Layout,
  Terminal,
  UploadCloud,
  FileText,
  Code,
  Settings,
  CreditCard,
  CheckCircle2
} from "lucide-react";

// --- Mock Data ---

const MOCK_ALERTS = [
  { id: "XBB.1.5-C", date: "2026-05-07", location: "Berlin, DE", risk: 94, status: "Critical" },
  { id: "BA.2.86-D", date: "2026-05-06", location: "New York, US", risk: 82, status: "Elevated" },
  { id: "JN.1-V5", date: "2026-05-05", location: "Tokyo, JP", risk: 65, status: "Monitored" },
  { id: "H5N1-MOD", date: "2026-05-04", location: "Mumbai, IN", risk: 89, status: "Critical" },
  { id: "FLU-A-S", date: "2026-05-03", location: "London, UK", risk: 45, status: "Stable" },
];

const MOCK_TARGETS = [
  { name: "Lipid Nanoparticle A", confidence: 92, type: "Delivery System" },
  { name: "TLR7/8 Agonist V2", confidence: 88, type: "Immune Response" },
  { name: "Squalene Emulsion", confidence: 74, type: "Adjuvant" },
  { name: "Matrix-M Complex", confidence: 95, type: "Delivery System" },
  { name: "Alum-CpG Binder", confidence: 62, type: "Adjuvant" },
  { name: "Saponin Q-21", confidence: 81, type: "Immune Response" },
];

// --- Sub-Components ---

const ViewTransition = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);

const SectionHeader = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <div className="mb-12">
    <h2 className="text-4xl font-black text-brand-navy tracking-tight">{title}</h2>
    {subtitle && <p className="text-brand-gray mt-2 font-medium">{subtitle}</p>}
  </div>
);

// --- Page Views ---

const LandingView = ({ onOpenAccess, onPromptChange, promptValue }: any) => {
  // Infinite Scroll Logic (Moved from main component for cleanliness)
  const [alerts, setAlerts] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [mounted, setMounted] = useState(false);
  const loaderRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const generateFakeAlerts = (p: number) => {
    const mutations = ["XBB.1.5", "BA.2.86", "JN.1", "H5N1-V2", "RSV-2026", "FLU-A-HS"];
    return Array.from({ length: 10 }).map((_, i) => ({
      id: `${mutations[Math.floor(Math.random() * mutations.length)]}-${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${p}${i}`,
      date: new Date(Date.now() - Math.random() * 100000000).toLocaleDateString(),
      location: ["Berlin, DE", "New York, US", "Tokyo, JP", "Mumbai, IN", "London, UK"][Math.floor(Math.random() * 5)],
      risk: 40 + Math.floor(Math.random() * 55)
    }));
  };

  useEffect(() => {
    setAlerts(prev => [...prev, ...generateFakeAlerts(page)]);
  }, [page]);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) setPage(prev => prev + 1);
      }, { threshold: 1.0 });
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, []);

  if (!mounted) return null;

  return (
    <ViewTransition>
      <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between min-h-screen relative z-10">
        <div className="lg:w-1/2 z-20 space-y-10">
          <h1 className="text-6xl lg:text-8xl font-black tracking-tight leading-[0.95]">
            <span className="text-brand-blue block mb-2">AI-Powered Early-Warning</span>
            <span className="text-brand-navy block">for Vaccine Evasion Mutations</span>
          </h1>
          <p className="text-xl text-brand-gray max-w-xl font-medium leading-relaxed">
            Instantly identifying high-risk, complement-evading mutations and suggesting adjuvant targets weeks before laboratory confirmation.
          </p>
          <button onClick={onOpenAccess} className="bg-brand-blue text-white font-black text-xl px-12 py-6 rounded-xl shadow-2xl shadow-brand-blue/40 hover:scale-105 hover:shadow-brand-blue/60 transition-all duration-500">
            Request Access Now
          </button>
        </div>
        <div className="lg:w-1/2 relative h-[700px] w-full mt-16 lg:mt-0 flex justify-center items-center">
          <div className="absolute inset-0 flex items-center justify-center space-x-1 opacity-[0.15] -z-10">
            {[...Array(24)].map((_, i) => (
              <motion.div key={i} className="w-2 bg-brand-blue rounded-full" animate={{ height: ["10%", "90%", "10%"] }} transition={{ duration: 2 + Math.random(), repeat: Infinity, ease: "easeInOut", delay: i * 0.05 }} />
            ))}
          </div>
          <div className="relative z-10 w-[500px] h-[500px] rounded-[40px] overflow-hidden border-[12px] border-white shadow-[0_40px_100px_-20px_rgba(0,0,0,0.2)] bg-gray-100">
            <img src="/medical-hero.png" alt="Medical Professional" className="w-full h-full object-cover grayscale-[0.2] contrast-[1.1]" />
          </div>
          <div className="absolute inset-0 z-20 pointer-events-none">
            <FloatingPill top="25%" left="-16%" icon={<Dna size={18} />} text="detect Evasion mutation (e.g., Spike K417N)" />
            <FloatingPill top="66%" right="0%" icon={<Activity size={18} />} text="calculate Evasion Score (e.g., 88/100)" />
            <FloatingPill bottom="25%" left="0%" icon={<Sparkles size={18} />} text="suggest Adjuvant target (e.g., Lipid X)" />
          </div>
        </div>
      </div>
      <section className="bg-gray-50/50 py-32 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-6">
          <div className="mb-16 text-center">
            <span className="text-brand-blue font-black uppercase tracking-[0.3em] text-sm">Real-Time Surveillance</span>
            <h2 className="text-5xl font-black mt-4 text-brand-navy">Active Mutation Alerts</h2>
          </div>
          <div className="space-y-4">
            {alerts.map((alert, idx) => (
              <AlertCard key={alert.id + idx} alert={alert} />
            ))}
          </div>
          <div ref={loaderRef} className="py-20 flex justify-center">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-10 h-10 border-4 border-brand-blue/20 border-t-brand-blue rounded-full" />
          </div>
        </div>
      </section>
      <PromptBar value={promptValue} onChange={onPromptChange} />
    </ViewTransition>
  );
};

const FloatingPill = ({ top, left, right, bottom, icon, text }: any) => (
  <motion.div className="absolute pointer-events-auto" style={{ top, left, right, bottom }} animate={{ y: [0, -20, 0], rotate: [-1, 1, -1] }} transition={{ duration: 5 + Math.random() * 2, repeat: Infinity, ease: "easeInOut" }} whileHover={{ scale: 1.1, y: 0 }}>
    <div className="bg-white/80 backdrop-blur-xl px-6 py-4 rounded-2xl shadow-2xl border border-white/50 flex items-center space-x-4 text-brand-navy font-bold text-sm cursor-pointer group">
      <div className="bg-brand-blue p-2 rounded-lg text-white shadow-lg shadow-brand-blue/30">{icon}</div>
      <span>{text}</span>
    </div>
  </motion.div>
);

const AlertCard = ({ alert }: any) => (
  <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between group">
    <div className="flex items-center space-x-6">
      <div className={`p-3 rounded-lg ${alert.risk > 80 ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-brand-blue'}`}><AlertCircle size={24} /></div>
      <div>
        <h4 className="font-mono text-lg font-bold text-brand-navy group-hover:text-brand-blue transition-colors">{alert.id}</h4>
        <div className="flex items-center space-x-4 mt-1 text-sm text-brand-gray"><span className="flex items-center"><Activity size={14} className="mr-1" /> {alert.date}</span><span className="flex items-center"><Globe size={14} className="mr-1" /> {alert.location}</span></div>
      </div>
    </div>
    <div className="w-64">
      <div className="flex justify-between mb-2"><span className="text-xs font-bold text-brand-navy uppercase tracking-wider">Evasion Risk</span><span className="text-xs font-mono font-bold text-brand-blue">{alert.risk}%</span></div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <motion.div initial={{ width: 0 }} whileInView={{ width: `${alert.risk}%` }} transition={{ duration: 1 }} className={`h-full rounded-full ${alert.risk > 80 ? 'bg-red-500' : 'bg-brand-blue'}`} />
      </div>
    </div>
  </motion.div>
);

const PromptBar = ({ value, onChange }: any) => (
  <motion.div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 group" initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 1 }}>
    <div className="bg-white/90 backdrop-blur-2xl border-2 border-brand-blue/10 rounded-[24px] pl-6 pr-3 py-3 flex items-center space-x-6 shadow-[0_30px_100px_-10px_rgba(0,82,255,0.2)] transition-all duration-500 group-hover:border-brand-blue/30 w-[600px]">
      <Plus size={24} className="text-brand-blue" /><input type="text" value={value} onChange={onChange} placeholder="Analyze a sequence now..." className="bg-transparent border-none outline-none text-brand-navy placeholder-brand-navy/30 font-bold text-lg w-full" />
      <div className="bg-brand-blue rounded-xl p-3 relative flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-all shadow-lg shadow-brand-blue/30"><Sparkles size={22} className="text-white relative z-10" /></div>
    </div>
  </motion.div>
);

// --- Page Component Views ---

const DataFeedsView = () => (
  <ViewTransition>
    <div className="pt-40 px-6 max-w-7xl mx-auto">
      <SectionHeader title="Live Genomic Data Feeds" subtitle="Real-time streaming from GISAID and NCBI repositories." />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-brand-navy rounded-xl p-6 h-[600px] flex flex-col shadow-2xl">
          <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-4">
            <div className="flex items-center space-x-2"><Terminal size={18} className="text-green-400" /><span className="text-white font-mono text-sm uppercase tracking-widest">Sequence Stream</span></div>
            <div className="flex items-center space-x-4"><div className="flex items-center space-x-2"><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /><span className="text-green-400 font-mono text-xs">UPLINK ACTIVE</span></div><div className="text-white/40 font-mono text-xs">842 SEQ/MIN</div></div>
          </div>
          <div className="flex-1 overflow-y-auto space-y-2 font-mono text-sm">
            {mounted && Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="text-green-400/80 hover:text-green-400 transition-colors cursor-default">
                <span className="text-white/20 mr-2">[{new Date().toLocaleTimeString()}]</span>
                <span className="text-brand-blue mr-2">INGEST:</span>
                SARS-CoV-2_S_{Math.random().toString(16).slice(2, 10).toUpperCase()} ... <span className="text-white">PROCESSED</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl p-8 shadow-sm">
          <h3 className="text-xl font-black mb-6">Source Status</h3>
          <div className="space-y-6">
            {[ { name: "GISAID Global", status: "Active", delay: "42ms" }, { name: "NCBI GenBank", status: "Active", delay: "128ms" }, { name: "UK Genomics Consortium", status: "Active", delay: "89ms" }, { name: "Nextstrain Hub", status: "Syncing", delay: "2.4s" }].map((source, i) => (
              <div key={i} className="flex items-center justify-between">
                <div><div className="font-bold text-brand-navy">{source.name}</div><div className="text-xs text-brand-gray">Latency: {source.delay}</div></div>
                <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${source.status === 'Active' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>{source.status}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </ViewTransition>
);

const MutationEngineView = () => (
  <ViewTransition>
    <div className="pt-40 px-6 max-w-7xl mx-auto">
      <SectionHeader title="Mutation Analysis Engine" subtitle="Upload sequences for instantaneous evasion score calculation." />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="border-4 border-dashed border-gray-100 rounded-3xl flex flex-col items-center justify-center p-20 bg-gray-50/50 hover:bg-gray-100/50 transition-colors cursor-pointer group">
          <div className="bg-white p-8 rounded-full shadow-xl mb-8 group-hover:scale-110 transition-transform"><UploadCloud size={48} className="text-brand-blue" /></div>
          <h3 className="text-2xl font-black text-brand-navy">Upload Sequence</h3>
          <p className="text-brand-gray mt-2 font-medium text-center">Drag and drop FASTA, CSV, or JSON files<br />Maximum file size 50MB</p>
        </div>
        <div className="bg-brand-navy rounded-3xl p-10 shadow-2xl flex flex-col h-[500px]">
          <div className="flex items-center space-x-2 mb-6"><div className="w-3 h-3 bg-red-500 rounded-full" /><div className="w-3 h-3 bg-yellow-500 rounded-full" /><div className="w-3 h-3 bg-green-500 rounded-full" /><span className="ml-4 text-white/40 font-mono text-xs">engine_output.log</span></div>
          <div className="flex-1 font-mono text-sm text-brand-blue/80 space-y-4">
            <p>Initializing Evasion_Scorer_v4.2...</p>
            <p className="text-white">Waiting for input sequence...</p>
            <div className="pt-10 border-t border-white/5 space-y-2">
              <p className="text-white/20">&gt; run --mode heuristic --target Spike_Protein</p>
              <p className="text-white/20">&gt; analyzing structural shift indices...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ViewTransition>
);

const AlertsView = () => (
  <ViewTransition>
    <div className="pt-40 px-6 max-w-7xl mx-auto">
      <SectionHeader title="Active Evasion Alerts" subtitle="Consolidated database of high-risk mutation events." />
      <div className="bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-brand-navy">Mutation ID</th>
              <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-brand-navy">Detection Date</th>
              <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-brand-navy">Location</th>
              <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-brand-navy">Evasion Score</th>
              <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-brand-navy">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {MOCK_ALERTS.map((alert, i) => (
              <tr key={i} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-8 py-6 font-mono font-bold text-brand-navy group-hover:text-brand-blue">{alert.id}</td>
                <td className="px-8 py-6 text-brand-gray font-medium">{alert.date}</td>
                <td className="px-8 py-6 text-brand-gray font-medium">{alert.location}</td>
                <td className="px-8 py-6 w-64">
                  <div className="flex items-center space-x-4">
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${alert.risk > 80 ? 'bg-red-500' : 'bg-brand-blue'}`} style={{ width: `${alert.risk}%` }} />
                    </div>
                    <span className="font-mono text-xs font-bold text-brand-navy">{alert.risk}%</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${alert.status === 'Critical' ? 'bg-red-100 text-red-600' : alert.status === 'Elevated' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-brand-blue'}`}>{alert.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </ViewTransition>
);

const TargetsView = () => (
  <ViewTransition>
    <div className="pt-40 px-6 max-w-7xl mx-auto">
      <SectionHeader title="Adjuvant Target Recommendations" subtitle="AI-suggested chemical targets to overcome identified evasion patterns." />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {MOCK_TARGETS.map((target, i) => (
          <div key={i} className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all group">
            <div className="flex justify-between items-start mb-8">
              <div><h3 className="text-xl font-black text-brand-navy">{target.name}</h3><div className="text-xs text-brand-blue font-bold uppercase tracking-widest mt-1">{target.type}</div></div>
              <div className="relative w-16 h-16 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-gray-100" />
                  <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="transparent" strokeDasharray={175.9} strokeDashoffset={175.9 - (175.9 * target.confidence) / 100} className="text-brand-blue" />
                </svg>
                <span className="absolute font-mono text-[10px] font-black">{target.confidence}%</span>
              </div>
            </div>
            <button className="w-full bg-gray-50 text-brand-navy font-bold py-3 rounded-xl border border-gray-100 group-hover:bg-brand-blue group-hover:text-white group-hover:border-brand-blue transition-all">Export to Lab Inventory</button>
          </div>
        ))}
      </div>
    </div>
  </ViewTransition>
);

const WebhooksView = () => (
  <ViewTransition>
    <div className="pt-40 px-6 max-w-7xl mx-auto">
      <SectionHeader title="Webhook Integration" subtitle="Push critical alerts directly to your internal analysis systems." />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm h-fit">
          <h3 className="text-xl font-black mb-6">Add Endpoint</h3>
          <div className="space-y-4">
            <div><label className="text-xs font-black uppercase text-brand-gray tracking-wider">Endpoint URL</label><input type="text" placeholder="https://api.yourlab.com/webhooks" className="w-full bg-gray-50 border border-gray-100 p-4 rounded-xl mt-2 outline-none focus:border-brand-blue font-medium" /></div>
            <div><label className="text-xs font-black uppercase text-brand-gray tracking-wider">Secret Key</label><input type="password" value="••••••••••••••••" readOnly className="w-full bg-gray-50 border border-gray-100 p-4 rounded-xl mt-2 outline-none font-mono text-sm" /></div>
            <button className="w-full bg-brand-blue text-white font-black py-4 rounded-xl shadow-lg shadow-brand-blue/30 mt-4">Add Endpoint</button>
          </div>
        </div>
        <div className="lg:col-span-2 space-y-6">
          {[ { url: "https://global-health.gov/v1/ingest", events: ["Alert > 90", "New Sequence"], active: true }, { url: "https://lab-internal-prod.pharma.io/webhooks", events: ["All Mutations"], active: false }].map((hook, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm flex items-center justify-between">
              <div>
                <div className="font-mono text-sm font-bold text-brand-navy">{hook.url}</div>
                <div className="flex space-x-2 mt-2">
                  {hook.events.map((e, j) => (<span key={j} className="text-[10px] bg-gray-50 px-2 py-1 rounded font-bold text-brand-gray">{e}</span>))}
                </div>
              </div>
              <div className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${hook.active ? 'bg-brand-blue' : 'bg-gray-200'}`}><div className={`w-4 h-4 bg-white rounded-full transition-transform ${hook.active ? 'translate-x-6' : 'translate-x-0'}`} /></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </ViewTransition>
);

const APIDocsView = () => (
  <ViewTransition>
    <div className="pt-40 px-6 max-w-7xl mx-auto flex">
      <div className="w-64 border-r border-gray-100 pr-12 space-y-8">
        <div><h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-gray mb-4">Authentication</h4><div className="text-sm font-bold text-brand-navy cursor-pointer hover:text-brand-blue">Overview</div></div>
        <div><h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-gray mb-4">Endpoints</h4><div className="space-y-3">
          <div className="text-sm font-bold text-brand-navy cursor-pointer hover:text-brand-blue flex items-center"><span className="text-[10px] text-green-500 mr-2 font-mono">GET</span> /alerts</div>
          <div className="text-sm font-bold text-brand-navy cursor-pointer hover:text-brand-blue flex items-center"><span className="text-[10px] text-brand-blue mr-2 font-mono">POST</span> /analyze</div>
          <div className="text-sm font-bold text-brand-navy cursor-pointer hover:text-brand-blue flex items-center"><span className="text-[10px] text-green-500 mr-2 font-mono">GET</span> /targets</div>
        </div></div>
      </div>
      <div className="flex-1 pl-12 space-y-12 pb-32">
        <SectionHeader title="API Documentation" subtitle="High-throughput genomic intelligence interface." />
        <div className="space-y-8">
          <div className="flex items-center space-x-4"><span className="bg-green-500 text-white px-3 py-1 rounded font-mono text-xs font-bold uppercase">GET</span><span className="font-mono text-lg font-bold text-brand-navy">/v1/alerts</span></div>
          <p className="text-brand-gray font-medium">Retrieves a paginated list of all active mutation alerts flagged by the VEWP scoring engine.</p>
          <div className="bg-brand-navy rounded-2xl p-8 shadow-2xl">
            <div className="flex border-b border-white/10 mb-6 space-x-6 pb-2">
              <div className="text-white text-xs font-black uppercase border-b-2 border-brand-blue pb-2 cursor-pointer">cURL</div>
              <div className="text-white/40 text-xs font-black uppercase pb-2 cursor-pointer">Python</div>
            </div>
            <pre className="font-mono text-sm text-brand-blue/80 overflow-x-auto">
              <code>{`curl -X GET "https://api.vewp.io/v1/alerts" \\
  -H "Authorization: Bearer YOUR_API_KEY"`}</code>
            </pre>
          </div>
          <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
            <h4 className="text-xs font-black uppercase text-brand-navy tracking-widest mb-4">Response Example (JSON)</h4>
            <pre className="font-mono text-sm text-brand-gray">
              <code>{`{
  "status": "success",
  "data": [
    {
      "id": "XBB.1.5-C",
      "risk_score": 94.2,
      "detected_at": "2026-05-07T10:42:00Z"
    }
  ]
}`}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  </ViewTransition>
);

const PricingView = () => (
  <ViewTransition>
    <div className="pt-40 px-6 max-w-7xl mx-auto">
      <SectionHeader title="Platform Tiers" subtitle="Scalable genomic intelligence for individual researchers to global pharma." />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { name: "Free Tier", price: "$0", desc: "For individual academic research.", features: ["50 sequence scans /mo", "Basic evasion scoring", "Standard alerts", "Community support"] },
          { name: "Pro Lab", price: "$999", desc: "For professional research labs.", features: ["Unlimited scans", "Advanced adjuvant targeting", "Real-time webhooks", "Priority API access", "Email support"], featured: true },
          { name: "Enterprise", price: "Custom", desc: "For global pharmaceutical companies.", features: ["Custom scoring models", "On-premise deployment", "Dedicated account manager", "SLA guarantees", "SSO & Audit logs"] }
        ].map((tier, i) => (
          <div key={i} className={`rounded-3xl p-10 flex flex-col border ${tier.featured ? 'border-brand-blue bg-white shadow-2xl scale-105 relative z-10' : 'border-gray-100 bg-white shadow-sm hover:shadow-xl'} transition-all`}>
            {tier.featured && <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-blue text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full">Most Popular</div>}
            <div className="text-brand-navy font-black text-2xl mb-2">{tier.name}</div>
            <div className="text-4xl font-black text-brand-blue mb-4">{tier.price}<span className="text-brand-gray text-base font-medium"> / month</span></div>
            <p className="text-brand-gray font-medium mb-8 text-sm">{tier.desc}</p>
            <div className="space-y-4 mb-10 flex-1">
              {tier.features.map((f, j) => (
                <div key={j} className="flex items-center space-x-3 text-sm font-bold text-brand-navy"><CheckCircle2 size={16} className="text-brand-blue" /><span>{f}</span></div>
              ))}
            </div>
            <button className={`w-full py-4 rounded-xl font-black uppercase tracking-widest transition-all ${tier.featured ? 'bg-brand-blue text-white shadow-xl shadow-brand-blue/30' : 'bg-gray-50 text-brand-navy hover:bg-gray-100'}`}>Get Started</button>
          </div>
        ))}
      </div>
    </div>
  </ViewTransition>
);

// --- Main Page Component ---

export default function Home() {
  const [currentView, setCurrentView] = useState("home");
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isAccessOpen, setIsAccessOpen] = useState(false);
  const [promptValue, setPromptValue] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    { id: "home", label: "Home" },
    { id: "data-feeds", label: "Data Feeds" },
    { id: "mutation-engine", label: "Mutation Engine" },
    { id: "alerts", label: "Alerts" },
    { id: "targets", label: "Targets" },
    { id: "webhooks", label: "Webhooks" },
    { id: "api-docs", label: "API Docs" },
    { id: "pricing", label: "Pricing" },
  ];

  if (!mounted) return <div className="min-h-screen bg-white" />;

  const renderContent = () => {
    switch (currentView) {
      case "home": return <LandingView onOpenAccess={() => setIsAccessOpen(true)} onPromptChange={(e: any) => setPromptValue(e.target.value)} promptValue={promptValue} />;
      case "data-feeds": return <DataFeedsView />;
      case "mutation-engine": return <MutationEngineView />;
      case "alerts": return <AlertsView />;
      case "targets": return <TargetsView />;
      case "webhooks": return <WebhooksView />;
      case "api-docs": return <APIDocsView />;
      case "pricing": return <PricingView />;
      default: return <LandingView />;
    }
  };

  return (
    <main className="min-h-screen relative bg-white text-brand-navy selection:bg-brand-blue selection:text-white overflow-x-hidden">
      
      {/* Interactive Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between transition-all duration-300 backdrop-blur-md bg-white/70 border-b border-gray-100/50">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setCurrentView('home')}>
          <Dna className="text-brand-blue" size={32} />
          <span className="text-2xl font-black text-brand-navy tracking-tighter">VEWP</span>
        </div>

        <div className="hidden xl:flex items-center gap-6">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`text-[11px] uppercase tracking-[0.2em] transition-all whitespace-nowrap relative pb-1 ${currentView === item.id ? 'font-black text-brand-blue' : 'font-bold text-brand-navy/60 hover:text-brand-navy'}`}
            >
              {item.label}
              {currentView === item.id && (
                <motion.div layoutId="nav-underline" className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-blue" />
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-6">
          <button className="text-brand-gray hover:text-brand-blue transition-colors"><Headset size={20} /></button>
          <div className="flex items-center space-x-1 cursor-pointer group"><span className="text-lg leading-none" role="img" aria-label="India Flag">🇮🇳</span><ChevronDown size={14} className="text-brand-gray group-hover:text-brand-blue transition-colors" /></div>
          <button onClick={() => setIsLoginOpen(true)} className="text-[11px] font-black text-brand-blue border-2 border-brand-blue/20 px-4 py-2.5 rounded-lg hover:bg-brand-blue/5 transition-colors uppercase tracking-widest">Request API Key</button>
          <button onClick={() => setIsSignupOpen(true)} className="text-[11px] font-black text-white bg-brand-blue px-5 py-3 rounded-lg hover:-translate-y-0.5 hover:shadow-xl hover:shadow-brand-blue/30 transition-all duration-300 uppercase tracking-widest">Sign Up &rarr;</button>
        </div>
      </nav>

      <AnimatePresence mode="wait">
        <div key={currentView}>
          {renderContent()}
        </div>
      </AnimatePresence>

      {/* --- Modals --- */}
      <Modal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} title="Request API Key">
        <p className="text-brand-gray mb-6 font-medium">Gain access to our real-time mutation surveillance API. Our team will review your application within 24 hours.</p>
        <div className="space-y-4">
          <input type="email" placeholder="Institutional Email" className="w-full bg-gray-50 border border-gray-100 p-4 rounded-xl outline-none focus:border-brand-blue transition-colors font-bold" />
          <button className="w-full bg-brand-blue text-white p-4 rounded-xl font-black uppercase tracking-wider hover:bg-brand-blue/90 transition-colors">Submit Request</button>
        </div>
      </Modal>

      <Modal isOpen={isSignupOpen} onClose={() => setIsSignupOpen(false)} title="Sign Up for VEWP">
        <div className="space-y-4">
          <input type="text" placeholder="Full Name" className="w-full bg-gray-50 border border-gray-100 p-4 rounded-xl outline-none focus:border-brand-blue transition-colors font-bold" />
          <input type="email" placeholder="Work Email" className="w-full bg-gray-50 border border-gray-100 p-4 rounded-xl outline-none focus:border-brand-blue transition-colors font-bold" />
          <button className="w-full bg-brand-blue text-white p-4 rounded-xl font-black uppercase tracking-wider hover:bg-brand-blue/90 transition-colors">Create Account</button>
        </div>
      </Modal>

      <Modal isOpen={isAccessOpen} onClose={() => setIsAccessOpen(false)} title="Request Portal Access">
        <p className="text-brand-gray mb-6 font-medium">Configure your early-warning dashboard for pharma-grade monitoring.</p>
        <div className="space-y-4">
          <textarea placeholder="Tell us about your research focus..." className="w-full bg-gray-50 border border-gray-100 p-4 rounded-xl outline-none focus:border-brand-blue transition-colors font-bold h-32" />
          <button className="w-full bg-brand-blue text-white p-4 rounded-xl font-black uppercase tracking-wider hover:bg-brand-blue/90 transition-colors">Initialize Access</button>
        </div>
      </Modal>

    </main>
  );
}

const Modal = ({ isOpen, onClose, title, children }: any) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-brand-navy/40 backdrop-blur-sm" />
        <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
            <h3 className="text-xl font-black text-brand-navy">{title}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-brand-navy transition-colors"><X size={20} /></button>
          </div>
          <div className="p-8">{children}</div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);
