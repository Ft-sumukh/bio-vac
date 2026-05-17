from datetime import datetime
from typing import List, Dict, Optional
from pydantic import BaseModel, Field

class ImmunityProfileRequest(BaseModel):
    lineage: str = Field(..., description="Target variant lineage to evaluate (e.g. XEC.1.5, KP.3)")
    region: str = Field("Southeast Asia", description="Geographic target region for population HLA analysis")
    prior_exposure_cohort: str = Field("Omicron-BA.5-Vaccinated", description="Exposure/vaccination cohort (e.g., Omicron-BA.5-Vaccinated, Wildtype-Infected)")
    hla_alleles_custom: Optional[List[str]] = Field(None, description="Optional custom HLA allele set (e.g. HLA-A*02:01, HLA-B*07:02)")

class EpitopeBinding(BaseModel):
    peptide_sequence: str
    mhc_allele: str
    affinity_nanomolar: float
    immunogenicity_score: float
    presentation_probability: float

class WaningCurvePoint(BaseModel):
    days_post_exposure: int
    neutralization_titer_gmt: float
    protective_efficacy_percent: float

class CrossReactivityScore(BaseModel):
    variant: str
    tcrdist_score: float = Field(..., description="TCRdist sequence edit distance to target variant")
    cross_protection_index: float = Field(..., description="Estimated cross-protective coverage (0.0 to 1.0)")

class ImmunityProfileResponse(BaseModel):
    status: str
    profile_id: str
    lineage: str
    target_region: str
    demographic_hla_distribution: Dict[str, float] = Field(..., description="HLA allele population frequencies in target region")
    mhc_i_epitopes: List[EpitopeBinding]
    mhc_ii_epitopes: List[EpitopeBinding]
    waning_projection_180_days: List[WaningCurvePoint]
    cross_reactivity: List[CrossReactivityScore]
    recommended_booster_interval_months: int
    regional_booster_priority_score: float
