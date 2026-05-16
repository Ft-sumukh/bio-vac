export const MOCK_ALERTS = [
  { id: "XBB.1.5-C", date: "2026-05-07", location: "Berlin, DE", risk: 94, status: "Critical", trend: "+12%", details: "Dominant in EU clusters with increased mAB resistance." },
  { id: "BA.2.86-D", date: "2026-05-06", location: "New York, US", risk: 82, status: "Elevated", trend: "+5%", details: "High number of mutations in the Spike protein receptor-binding domain." },
  { id: "JN.1-V5", date: "2026-05-05", location: "Tokyo, JP", risk: 65, status: "Monitored", trend: "-2%", details: "Sub-lineage of BA.2.86 showing steady growth in Southeast Asia." },
  { id: "H5N1-MOD", date: "2026-05-04", location: "Mumbai, IN", risk: 89, status: "Critical", trend: "+18%", details: "Avian influenza variant showing mammalian adaptation markers." },
  { id: "FLU-A-S", date: "2026-05-03", location: "London, UK", risk: 45, status: "Stable", trend: "0%", details: "Standard seasonal strain with low vaccine evasion potential." },
];

export const MOCK_TARGETS = [
  { name: "Lipid Nanoparticle A", confidence: 92, type: "Delivery System", efficiency: "High" },
  { name: "TLR7/8 Agonist V2", confidence: 88, type: "Immune Response", efficiency: "Optimal" },
  { name: "Squalene Emulsion", confidence: 74, type: "Adjuvant", efficiency: "Baseline" },
  { name: "Matrix-M Complex", confidence: 95, type: "Delivery System", efficiency: "Elite" },
];

export const VARIANT_TRACKING_DATA = [
  { name: 'Jan', Omicron: 4000, Delta: 2400, JN1: 2400 },
  { name: 'Feb', Omicron: 3000, Delta: 1398, JN1: 2210 },
  { name: 'Mar', Omicron: 2000, Delta: 9800, JN1: 2290 },
  { name: 'Apr', Omicron: 2780, Delta: 3908, JN1: 2000 },
  { name: 'May', Omicron: 1890, Delta: 4800, JN1: 2181 },
  { name: 'Jun', Omicron: 2390, Delta: 3800, JN1: 2500 },
  { name: 'Jul', Omicron: 3490, Delta: 4300, JN1: 2100 },
];

export const EVOLUTIONARY_DRIFT = [
  { time: 0, divergence: 0.1, label: 'Wildtype' },
  { time: 10, divergence: 0.25, label: 'Alpha' },
  { time: 20, divergence: 0.45, label: 'Delta' },
  { time: 30, divergence: 0.88, label: 'Omicron' },
  { time: 40, divergence: 1.12, label: 'XBB' },
  { time: 50, divergence: 1.45, label: 'JN.1' },
];

export const GENOMIC_LIBRARY = [
  { id: "EPI_ISL_1827361", clade: "GRA", date: "2026-05-12", location: "South Africa", host: "Human", submissions: 1420 },
  { id: "EPI_ISL_9918273", clade: "GKA", date: "2026-05-11", location: "Brazil", host: "Human", submissions: 890 },
  { id: "EPI_ISL_4452312", clade: "VRA", date: "2026-05-10", location: "USA", host: "Human", submissions: 3100 },
  { id: "EPI_ISL_2210984", clade: "GRA", date: "2026-05-09", location: "India", host: "Human", submissions: 2150 },
];

export const REGIONAL_RISK = [
  { region: 'North America', score: 82, color: '#FF1744', lat: 40, lng: -100, variant: 'XBB.1.5' },
  { region: 'Europe', score: 94, color: '#D50000', lat: 50, lng: 10, variant: 'XBB.1.16' },
  { region: 'Asia Pacific', score: 65, color: '#FF9100', lat: 20, lng: 100, variant: 'JN.1' },
  { region: 'Africa', score: 45, color: '#00E5FF', lat: 0, lng: 20, variant: 'BA.2.86' },
  { region: 'South America', score: 58, color: '#00B0FF', lat: -20, lng: -60, variant: 'Gamma-2' },
];
