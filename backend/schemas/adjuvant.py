from datetime import datetime
from typing import List, Dict, Optional
from pydantic import BaseModel, Field

class AdjuvantMatchRequest(BaseModel):
    pathogen: str = Field("SARS-CoV-2", description="Target pathogen (e.g., SARS-CoV-2, Influenza, RSV)")
    target_immune_response: str = Field("Th1", description="Target response profile: Th1 (cellular), Th2 (humoral), Tfh (germinal), Mucosal")
    delivery_vehicle: str = Field("LNP", description="Delivery vehicle (e.g. LNP, Alum, Emulsion, Saponin)")
    max_cost_per_dose_usd: Optional[float] = Field(5.0, description="Maximum budget threshold per adjuvant dose in USD")

class MLRankingMetrics(BaseModel):
    safety_index: float = Field(..., description="Estimated safety & tolerability profile (0.0 to 1.0)")
    manufacturing_scalability: float = Field(..., description="Scalability metric for commercial production")
    regulatory_clearance_probability: float = Field(..., description="Estimated probability of FDA/EMA clearance")
    ensemble_score: float = Field(..., description="Unified ranking score from gradient boosting (XGBoost/LightGBM)")

class AdjuvantCandidate(BaseModel):
    name: str = Field(..., description="Adjuvant compound name (e.g. CpG-ODN, QS-21, MF59)")
    pubchem_cid: int = Field(..., description="PubChem Chemical Compound ID")
    chemical_class: str
    tanimoto_similarity: float = Field(..., description="Tanimoto Morgan fingerprint similarity score to optimal target molecular profile")
    cost_per_dose_usd: float
    target_pathway: str = Field(..., description="Primary immunological pathway triggered (e.g. TLR9, TLR4, NLRP3)")
    ml_metrics: MLRankingMetrics

class AdjuvantMatchResponse(BaseModel):
    status: str
    matchmaker_run_id: str
    target_pathogen: str
    inferred_immune_profile: str
    timestamp: datetime
    adjuvants: List[AdjuvantCandidate]
    formulation_recipe_recommendation: str
