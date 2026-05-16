import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface BIVACState {
  selectedRegion: string | null;
  selectedVariant: string | null;
  timeRange: '24h' | '7d' | '30d' | 'all';
  theme: 'cyberpunk' | 'biotech' | 'mono';
  alertThreshold: number;
  
  setSelectedRegion: (region: string | null) => void;
  setSelectedVariant: (variant: string | null) => void;
  setTimeRange: (range: '24h' | '7d' | '30d' | 'all') => void;
  setTheme: (theme: 'cyberpunk' | 'biotech' | 'mono') => void;
  setAlertThreshold: (threshold: number) => void;
}

export const useBIVACStore = create<BIVACState>()(
  persist(
    (set) => ({
      selectedRegion: null,
      selectedVariant: null,
      timeRange: '7d',
      theme: 'cyberpunk',
      alertThreshold: 75,
      
      setSelectedRegion: (region) => set({ selectedRegion: region }),
      setSelectedVariant: (variant) => set({ selectedVariant: variant }),
      setTimeRange: (range) => set({ timeRange: range }),
      setTheme: (theme) => set({ theme }),
      setAlertThreshold: (threshold) => set({ alertThreshold: threshold }),
    }),
    {
      name: 'bivac-storage',
    }
  )
);
