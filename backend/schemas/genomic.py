from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field

class GenomicObservationBase(BaseModel):
    sequence: str
    location: str
    timestamp: datetime = Field(default_factory=datetime.now)

class GenomicObservationCreate(GenomicObservationBase):
    pass

class GenomicObservation(GenomicObservationBase):
    id: str
    risk_score: float
    lineage: Optional[str] = None
    evasion_potential: float
    unique_features: Optional[dict] = None
    
    class Config:
        from_attributes = True

class Alert(BaseModel):
    id: str
    message: str
    severity: str
    timestamp: datetime
    affected_lineage: str
