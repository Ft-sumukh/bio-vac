export const MOCK_ALERTS = [
  { id: "XBB.1.5-C", date: "2026-05-07", location: "Berlin, DE", risk: 94, status: "Critical", trend: "+12%" },
  { id: "BA.2.86-D", date: "2026-05-06", location: "New York, US", risk: 82, status: "Elevated", trend: "+5%" },
  { id: "JN.1-V5", date: "2026-05-05", location: "Tokyo, JP", risk: 65, status: "Monitored", trend: "-2%" },
  { id: "H5N1-MOD", date: "2026-05-04", location: "Mumbai, IN", risk: 89, status: "Critical", trend: "+18%" },
  { id: "FLU-A-S", date: "2026-05-03", location: "London, UK", risk: 45, status: "Stable", trend: "0%" },
];

export const MOCK_TARGETS = [
  { name: "Lipid Nanoparticle A", confidence: 92, type: "Delivery System", efficiency: "High" },
  { name: "TLR7/8 Agonist V2", confidence: 88, type: "Immune Response", efficiency: "Optimal" },
  { name: "Squalene Emulsion", confidence: 74, type: "Adjuvant", efficiency: "Baseline" },
  { name: "Matrix-M Complex", confidence: 95, type: "Delivery System", efficiency: "Elite" },
  { name: "Alum-CpG Binder", confidence: 62, type: "Adjuvant", efficiency: "Low" },
  { name: "Saponin Q-21", confidence: 81, type: "Immune Response", efficiency: "Stable" },
];

export const ANALYTICS_DATA = [
  { month: 'Jan', risk: 45, detections: 120 },
  { month: 'Feb', risk: 52, detections: 150 },
  { month: 'Mar', risk: 61, detections: 210 },
  { month: 'Apr', risk: 78, detections: 340 },
  { month: 'May', risk: 89, detections: 480 },
  { month: 'Jun', risk: 94, detections: 620 },
];

export const REGIONAL_RISK = [
  { region: 'North America', score: 82, color: '#FF1744' },
  { region: 'Europe', score: 94, color: '#D50000' },
  { region: 'Asia Pacific', score: 65, color: '#FF9100' },
  { region: 'Africa', score: 45, color: '#00E5FF' },
  { region: 'Latin America', score: 58, color: '#00B0FF' },
];
