from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from typing import List
from uuid import uuid4
from schemas.genomic import GenomicObservation, GenomicObservationCreate
from services.ai_engine import ai_engine
from monitoring.logging import logger

router = APIRouter()

# In-memory store for now, replaceable with Database repository
database_store = []

@router.post("/analyze", response_model=GenomicObservation)
async def analyze_genomic_sequence(
    observation: GenomicObservationCreate,
    background_tasks: BackgroundTasks
):
    """
    Analyzes a genomic sequence and calculates evasion risk.
    """
    logger.info(f"Analyzing sequence from {observation.location}")
    
    analysis = await ai_engine.analyze_sequence(observation.sequence)
    
    result = GenomicObservation(
        id=str(uuid4()),
        sequence=observation.sequence,
        location=observation.location,
        timestamp=observation.timestamp,
        **analysis
    )
    
    database_store.append(result)
    
    # Example background task: Log to analytics
    background_tasks.add_task(logger.info, f"Result stored: {result.id}")
    
    return result

@router.get("/observations", response_model=List[GenomicObservation])
async def get_observations(limit: int = 10, offset: int = 0):
    return database_store[offset : offset + limit]
