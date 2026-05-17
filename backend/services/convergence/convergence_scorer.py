import math
import random
from typing import List, Dict, Any
from monitoring.logging import logger

class ConvergenceScorer:
    """
    Computes evolutionary convergence indices across multiple pathogens.
    Measures sequence homology, structural coordinates overlap, selection correlation (dN/dS),
    and temporal synchronization to calculate combination vaccine target feasibility.
    """

    def calculate_dnds_correlation(self, dnds_profile_1: List[float], dnds_profile_2: List[float]) -> float:
        """
        Calculates Pearson correlation between selection pressures along homologous positions.
        """
        n = min(len(dnds_profile_1), len(dnds_profile_2))
        if n < 2:
            return 0.0
            
        mean1 = sum(dnds_profile_1[:n]) / n
        mean2 = sum(dnds_profile_2[:n]) / n
        
        num = sum((dnds_profile_1[i] - mean1) * (dnds_profile_2[i] - mean2) for i in range(n))
        den1 = sum((dnds_profile_1[i] - mean1)**2 for i in range(n))
        den2 = sum((dnds_profile_2[i] - mean2)**2 for i in range(n))
        
        if den1 == 0.0 or den2 == 0.0:
            return 0.0
            
        return round(num / math.sqrt(den1 * den2), 4)

    def compute_convergence_indices(
        self, 
        homology_records: List[Dict[str, Any]], 
        time_window_days: int = 90
    ) -> List[Dict[str, Any]]:
        """
        Performs structural and evolutionary convergence scoring across mapped pathogen pairs.
        """
        scored_hotspots = []
        
        for idx, record in enumerate(homology_records):
            p1, p2 = record["pathogens"]
            identity = record["identity"]
            
            # Simulate 3D structural coordinate overlap
            # Homologous sequences show correlation with structural fold similarities
            structural_fit = round(min(0.98, identity * 1.15 + random.uniform(-0.05, 0.05)), 2)
            
            # Mock dN/dS profile vectors
            dnds_profile_1 = [random.uniform(0.5, 1.8) for _ in range(record["alignment_length"])]
            dnds_profile_2 = [random.uniform(0.5, 1.8) for _ in range(record["alignment_length"])]
            selection_corr = self.calculate_dnds_correlation(dnds_profile_1, dnds_profile_2)
            
            # Temporal co-circulation overlaps
            temporal_sync = round(0.85 + random.uniform(-0.1, 0.1), 2)
            
            # Weighted overall convergence score calculation
            # Sequence: 30%, Structure: 30%, Selection Pressure: 25%, Temporal: 15%
            w_seq = 0.30 * identity
            w_struct = 0.30 * structural_fit
            w_selection = 0.25 * max(0.0, (selection_corr + 1.0) / 2.0)
            w_temp = 0.15 * temporal_sync
            
            conv_score = round((w_seq + w_struct + w_selection + w_temp) * 100, 2)
            
            # Determine combination vaccine feasibility
            if conv_score >= 70.0:
                feasibility = "HIGH_FEASIBILITY: Ideal multivalent formulation target using shared antigen fold."
            elif conv_score >= 50.0:
                feasibility = "MODERATE_FEASIBILITY: Separate peptide delivery in unified lipid nanoparticle (LNP)."
            else:
                feasibility = "LOW_FEASIBILITY: Recommend decoupled vaccine courses due to distinct immunological niches."

            # Mock shared key mutations
            shared_muts = []
            if "Spike" in record["functional_domain"] or "HA" in record["functional_domain"]:
                if identity > 0.40:
                    shared_muts = ["N501Y-homologue", "L452R-equivalent"]
            
            scored_hotspots.append({
                "hotspot_id": f"HOT-{p1[:3].upper()}-{p2[:3].upper()}-{idx+100}",
                "aligned_domains": [
                    {
                        "pathogen": p1,
                        "protein": "Spike/HA Domain",
                        "subregion": "RBD-homologue Core",
                        "coordinates": "120-250",
                        "sequence": record["aligned_region_1"]
                    },
                    {
                        "pathogen": p2,
                        "protein": "S1/HA1-equivalent Domain",
                        "subregion": "RBD-homologue Loop",
                        "coordinates": "95-225",
                        "sequence": record["aligned_region_2"]
                    }
                ],
                "convergence_score": conv_score,
                "score_breakdown": {
                    "sequence_homology": round(identity, 2),
                    "structural_alignment": structural_fit,
                    "dnds_correlation": round((selection_corr + 1.0)/2.0, 2),
                    "temporal_synchronization": temporal_sync
                },
                "shared_mutations": shared_muts,
                "combination_vaccine_feasibility": feasibility
            })
            
        return sorted(scored_hotspots, key=lambda x: x["convergence_score"], reverse=True)

# Instantiate convergence scorer
convergence_scorer = ConvergenceScorer()
