"use client";

import { faker } from '@faker-js/faker';

export interface Mutation {
  id: string;
  gene: string;
  position: number;
  substitution: string;
  frequency: number;
  impact: 'Critical' | 'High' | 'Moderate' | 'Low';
  effect: string;
  color: string;
}

export interface Sequence {
  id: string;
  gisaidAccession: string;
  viralFamily: string;
  clade: string;
  collectionDate: string;
  location: string;
  lab: string;
  qcScore: number;
  mutations: string[];
  submissions: number;
}

export const VIRAL_FAMILIES = ["SARS-CoV-2", "Influenza A", "Mpox", "RSV", "Dengue"];
export const CLADES = {
  "SARS-CoV-2": ["JN.1", "XBB.1.5", "BA.2.86", "EG.5"],
  "Influenza A": ["H1N1", "H3N2", "H5N1"],
  "Mpox": ["Clade I", "Clade IIb"],
  "RSV": ["Lineage A", "Lineage B"],
  "Dengue": ["DENV-1", "DENV-2", "DENV-3", "DENV-4"]
};

// Generate 5000 mock sequences
export const generateLibraryData = (count: number = 5000): Sequence[] => {
  return Array.from({ length: count }, (_, i) => {
    const family = VIRAL_FAMILIES[Math.floor(Math.random() * VIRAL_FAMILIES.length)] as keyof typeof CLADES;
    const familyClades = CLADES[family] || ["Unknown"];
    const clade = familyClades[Math.floor(Math.random() * familyClades.length)];
    
    return {
      id: `SEQ_${i + 1000}`,
      gisaidAccession: `EPI_ISL_${Math.floor(Math.random() * 10000000)}`,
      viralFamily: family,
      clade: clade,
      collectionDate: new Date(Date.now() - Math.random() * 10000000000).toISOString().split('T')[0],
      location: `${faker.location.city()}, ${faker.location.countryCode()}`,
      lab: `${faker.company.name()} Genomic Lab`,
      qcScore: Math.floor(Math.random() * 20) + 80,
      mutations: ["S:E484K", "S:N501Y", "P681R"],
      submissions: Math.floor(Math.random() * 5000)
    };
  });
};

export const MOCK_LIBRARY = generateLibraryData(500); // 500 for performance in UI, but scalable

export const THREAT_CARDS = [
  {
    id: "XBB.1.5-C",
    family: "SARS-CoV-2",
    risk: 78,
    transmissibility: 8.4,
    prevalence: 14,
    status: "Critical",
    color: "#FF1744",
    basis: "Disrupts salt-bridge in RBD domain, increasing ACE2 affinity.",
    forecast: "Predicted expansion to 22 countries in 14 days."
  },
  {
    id: "H5N1-MOD",
    family: "Influenza A",
    risk: 45,
    transmissibility: 3.2,
    prevalence: 2,
    status: "Elevated",
    color: "#FF9100",
    basis: "Zoonotic spillover marker Q226L detected in mammalian clusters.",
    forecast: "Monitoring cattle-to-human transmission vectors."
  },
  {
    id: "JN.1-V5",
    family: "SARS-CoV-2",
    risk: 72,
    transmissibility: 9.1,
    prevalence: 38,
    status: "Critical",
    color: "#A855F7",
    basis: "Antigenic drift significantly evades XBB-based boosters.",
    forecast: "Becoming the global dominant strain by end of Q2."
  },
  {
    id: "Mpox-G2",
    family: "Mpox",
    risk: 58,
    transmissibility: 6.2,
    prevalence: 8,
    status: "Monitored",
    color: "#00E5FF",
    basis: "APOBEC3 mutation patterns indicate sustained human-to-human spread.",
    forecast: "Stabilizing in urban hubs; monitoring rural spillback."
  }
];

export const EVOLUTIONARY_DATA = [
  { time: '2025 Q1', divergence: 0.2, label: 'Ancestral' },
  { time: '2025 Q2', divergence: 0.4, label: 'Alpha/Delta' },
  { time: '2025 Q3', divergence: 0.8, label: 'Omicron' },
  { time: '2025 Q4', divergence: 1.2, label: 'XBB' },
  { time: '2026 Q1', divergence: 1.5, label: 'JN.1' },
];
