from datetime import datetime
from typing import List, Dict, Optional
from pydantic import BaseModel, Field

class ForecastRequest(BaseModel):
    lineage: str = Field(..., description="Target lineage or clade to forecast from (e.g. XEC.1.5, JN.1)")
    pathogen: str = Field("SARS-CoV-2", description="The target pathogen under surveillance (e.g., SARS-CoV-2, Influenza A)")
    forecast_horizon_months: int = Field(12, ge=1, le=24, description="Forecast timeline in months (6 to 24)")
    include_confidence_intervals: bool = Field(True, description="Whether to compute 95% Bayesian credible intervals")
    regional_focus: List[str] = Field(default_factory=lambda: ["Global"], description="Target geographical regions")
    mutation_interest: Optional[List[str]] = Field(None, description="Specific mutations to score (e.g. S:K417N, S:L452R)")

class DateRange(BaseModel):
    mean: str
    lower_bound: str
    upper_bound: str

class RegionForecast(BaseModel):
    region: str
    probability: float
    emergence_timeline: str

class FitnessImpact(BaseModel):
    binding_affinity: float
    immune_escape_potential: float
    overall_fitness: float

class ForecastPrediction(BaseModel):
    mutation: str
    emergence_date: DateRange
    probability: float
    geographic_hotspots: List[RegionForecast]
    fitness_impact: FitnessImpact
    recommended_vaccine_target: str

class EnsembleWeights(BaseModel):
    selection_pressure: float
    fitness_model: float
    growth_rate: float
    environmental: float

class ForecastResponse(BaseModel):
    status: str
    forecast_id: str
    lineage: str
    forecast_generated_timestamp: datetime
    predictions: List[ForecastPrediction]
    ensemble_weights: EnsembleWeights
    model_confidence: float
