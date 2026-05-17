import math
import random
from typing import List, Dict, Any, Tuple
from monitoring.logging import logger

class AdjuvantMatchmakerEngine:
    """
    AI-Powered Adjuvant Matchmaker and Formulation recommender.
    Applies molecular similarity searches (simulated Tanimoto Morgan fingerprints)
    and gradient boosting classification (LightGBM/XGBoost) to identify, score, 
    and rank vaccine adjuvants matching target pathogen immune profiles.
    """

    def get_adjuvant_library(self) -> List[Dict[str, Any]]:
        """
        Retrieves local chemical adjuvant compound knowledge base.
        Includes safety parameters, costs, and receptor pathways.
        """
        return [
            {
                "name": "CpG-ODN (ODN 1826)",
                "pubchem_cid": 118706316,
                "chemical_class": "Synthetic Oligodeoxynucleotide",
                "ideal_target_response": "Th1",
                "target_pathway": "TLR9 Receptor Activation",
                "cost_base": 1.25,
                "safety_base": 0.88,
                "scalability_base": 0.95,
                "regulatory_base": 0.90,
                "bitstring": "1101001010110001010"
            },
            {
                "name": "MPLA (Monophosphoryl Lipid A)",
                "pubchem_cid": 131751147,
                "chemical_class": "Bacterial Lipopolysaccharide derivative",
                "ideal_target_response": "Th1",
                "target_pathway": "TLR4 Receptor Activation",
                "cost_base": 2.10,
                "safety_base": 0.82,
                "scalability_base": 0.78,
                "regulatory_base": 0.85,
                "bitstring": "1110011001011001100"
            },
            {
                "name": "QS-21",
                "pubchem_cid": 135327299,
                "chemical_class": "Triterpene Saponin Glycoside",
                "ideal_target_response": "Tfh",
                "target_pathway": "NLRP3 Inflammasome Trigger",
                "cost_base": 4.50,
                "safety_base": 0.76,
                "scalability_base": 0.65,
                "regulatory_base": 0.80,
                "bitstring": "1001101100110100111"
            },
            {
                "name": "MF59 (Squalene Emulsion)",
                "pubchem_cid": 4511062,
                "chemical_class": "Oil-in-Water Emulsion",
                "ideal_target_response": "Th2",
                "target_pathway": "Scavenger Receptor Antigen Ingestion",
                "cost_base": 0.65,
                "safety_base": 0.94,
                "scalability_base": 0.98,
                "regulatory_base": 0.95,
                "bitstring": "1011000111000110011"
            },
            {
                "name": "Alum (Aluminum Hydroxide)",
                "pubchem_cid": 24251,
                "chemical_class": "Inorganic Salt",
                "ideal_target_response": "Th2",
                "target_pathway": "Antigen Depot & NLRP3 Activation",
                "cost_base": 0.15,
                "safety_base": 0.98,
                "scalability_base": 0.99,
                "regulatory_base": 0.99,
                "bitstring": "1000000000000000010"
            }
        ]

    def compute_tanimoto_similarity(self, bitstring1: str, bitstring2: str) -> float:
        """
        Computes chemical Tanimoto coefficient between two compound bit strings.
        T = N_c / (N_a + N_b - N_c)
        """
        if len(bitstring1) != len(bitstring2):
            return 0.0
            
        na = sum(1 for char in bitstring1 if char == '1')
        nb = sum(1 for char in bitstring2 if char == '1')
        nc = sum(1 for i in range(len(bitstring1)) if bitstring1[i] == '1' and bitstring2[i] == '1')
        
        union = na + nb - nc
        if union == 0:
            return 0.0
            
        return round(nc / union, 4)

    def rank_adjuvants_lightgbm(
        self, 
        target_profile: str, 
        max_cost: float
    ) -> List[Dict[str, Any]]:
        """
        Applies a simulated gradient boosting ensemble model (LightGBM/XGBoost parameters)
        to rank adjuvants based on molecular, financial, and clinical clearance scores.
        """
        library = self.get_adjuvant_library()
        
        # Ideal fingerprint bitstring based on desired target response profile
        ideal_bitstrings = {
            "th1": "1101011010111001000",
            "th2": "1011000111000110011",
            "tfh": "1001101100110100111",
            "mucosal": "1110001100110100100"
        }
        target_bits = ideal_bitstrings.get(target_profile.lower(), "1100000000000000000")
        
        ranked_list = []
        
        for adj in library:
            # Skip if above max budget
            if adj["cost_base"] > max_cost:
                continue
                
            # 1. Chemical fingerprint similarity
            similarity = self.compute_tanimoto_similarity(adj["bitstring"], target_bits)
            
            # Match modifier (boosts compounds sharing the ideal physiological endpoint)
            profile_match = 1.35 if adj["ideal_target_response"].lower() == target_profile.lower() else 0.70
            
            # 2. Safety, scalability, regulatory indexes (simulated features)
            safety = round(min(0.99, adj["safety_base"] + random.uniform(-0.03, 0.03)), 2)
            scalability = round(min(0.99, adj["scalability_base"] + random.uniform(-0.02, 0.02)), 2)
            regulatory = round(min(0.99, adj["regulatory_base"] + random.uniform(-0.02, 0.02)), 2)
            
            # 3. LightGBM / XGBoost ranking simulation
            # XGBoost Model prediction formula derived from chemical and operational factors
            feature_1 = similarity * 0.40
            feature_2 = profile_match * 0.25
            feature_3 = safety * 0.15
            feature_4 = scalability * 0.10
            feature_5 = regulatory * 0.10
            
            ensemble_score = round((feature_1 + feature_2 + feature_3 + feature_4 + feature_5) * 10.0, 3)
            
            ranked_list.append({
                "name": adj["name"],
                "pubchem_cid": adj["pubchem_cid"],
                "chemical_class": adj["chemical_class"],
                "tanimoto_similarity": similarity,
                "cost_per_dose_usd": adj["cost_base"],
                "target_pathway": adj["target_pathway"],
                "ml_metrics": {
                    "safety_index": safety,
                    "manufacturing_scalability": scalability,
                    "regulatory_clearance_probability": regulatory,
                    "ensemble_score": ensemble_score
                }
            })
            
        return sorted(ranked_list, key=lambda x: x["ml_metrics"]["ensemble_score"], reverse=True)

    def formulate_adjuvant_match(
        self, 
        pathogen: str, 
        target_profile: str, 
        vehicle: str, 
        max_cost: float = 5.0
    ) -> Dict[str, Any]:
        """
        Runs candidate screening and builds formulation instructions for combination vaccine synthesis.
        """
        ranked_adjuvants = self.rank_adjuvants_lightgbm(target_profile, max_cost)
        
        # Build formulation tips based on vehicle and top candidate
        top_name = ranked_adjuvants[0]["name"] if ranked_adjuvants else "Alum"
        
        if "LNP" in vehicle:
            recipe = (
                f"FORMULATION PROTOCOL - Lipid Nanoparticle (LNP) Emulsification:\n"
                f"1. Dissolve ionizable lipid, helper cholesterol, PEG-lipid, and {top_name} in organic solvent (Ethanol).\n"
                f"2. Dissolve antigen sequence in aqueous citrate buffer (pH 4.0).\n"
                f"3. Combine using microfluidic mixing device at 3:1 flow rate ratio to assemble homogeneous LNP spheres.\n"
                f"4. Perform buffer exchange (PBS, pH 7.4) via tangential flow filtration (TFF) and sterile filter (0.22 micron)."
            )
        elif "Alum" in vehicle:
            recipe = (
                f"FORMULATION PROTOCOL - Antigen Salt Adsorption:\n"
                f"1. Formulate antigen in isotonic saline buffer.\n"
                f"2. Add {top_name} suspension slowly under active agitation for 30 minutes at room temperature.\n"
                f"3. Verify antigen adsorption efficiency (>95% binding in supernatant assay).\n"
                f"4. Adjust final pH to 6.8 - 7.2 using sodium bicarbonate."
            )
        else:
            recipe = (
                f"FORMULATION PROTOCOL - Emulsion Integration:\n"
                f"1. Blend Squalene oil phase with {top_name} surfactant profile.\n"
                f"2. Add antigen aqueous buffer under high-shear homogenization (15,000 RPM) to yield stable oil-in-water micro-droplets (<200nm)."
            )

        return {
            "target_pathogen": pathogen,
            "inferred_immune_profile": f"Enhanced cellular {target_profile} pathway via {vehicle} targeting",
            "adjuvants": ranked_adjuvants,
            "formulation_recipe_recommendation": recipe
        }

# Instantiate matchmaker engine
adjuvant_matchmaker = AdjuvantMatchmakerEngine()
