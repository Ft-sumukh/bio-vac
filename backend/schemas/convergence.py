from datetime import datetime
from typing import List, Dict, Optional
from pydantic import BaseModel, Field

class ConvergenceRequest(BaseModel):
    pathogens: List[str] = Field(
        default_factory=lambda: ["SARS-CoV-2", "Influenza-A", "RSV"],
        description="Pathogens to scan for convergent evolutionary trends"
    )
    domain_focus: str = Field("Spike/HA/F-Protein", description="Target structural protein domains")
    minimum_sequence_homology: float = Field(0.35, ge=0.1, le=1.0, description="Minimum sequence identity threshold")
    temporal_window_days: int = Field(90, ge=30, le=365, description="Co-circulation comparison window")

class AlignedDomain(BaseModel):
    pathogen: str
    protein: str
    subregion: str
    coordinates: str
    sequence: str

class ScoreBreakdown(BaseModel):
    sequence_homology: float
    structural_alignment: float
    dnds_correlation: float
    temporal_synchronization: float

class ConvergentHotspot(BaseModel):
    hotspot_id: str
    aligned_domains: List[AlignedDomain]
    convergence_score: float
    score_breakdown: ScoreBreakdown
    shared_mutations: List[str]
    combination_vaccine_feasibility: str

class ConvergenceResponse(BaseModel):
    status: str
    detector_run_id: str
    scanned_pathogens: List[str]
    timestamp: datetime
    hotspots: List[ConvergentHotspot]
    cross_pathogen_efficacy_index: float
