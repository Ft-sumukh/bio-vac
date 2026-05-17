import uuid
from datetime import datetime
from fastapi import APIRouter, HTTPException
from schemas.adjuvant import AdjuvantMatchRequest, AdjuvantMatchResponse, AdjuvantCandidate, MLRankingMetrics
from services.adjuvant import adjuvant_matchmaker
from monitoring.logging import logger

router = APIRouter()

@router.post("/match", response_model=AdjuvantMatchResponse)
async def match_adjuvant_formulation(request: AdjuvantMatchRequest):
    """
    Screens compound structures using chemical informatic Morgan fingerprints (Tanimoto coefficients)
    and applies a LightGBM ML ranking engine to suggest safety-cleared adjuvant recipes.
    """
    try:
        logger.info(f"Triggering adjuvant matchmaking for Pathogen: {request.pathogen}, Response focus: {request.target_immune_response}")
        
        match_result = adjuvant_matchmaker.formulate_adjuvant_match(
            pathogen=request.pathogen,
            target_profile=request.target_immune_response,
            vehicle=request.delivery_vehicle,
            max_cost=request.max_cost_per_dose_usd or 5.0
        )
        
        # Format candidates
        adjuvants = []
        for adj in match_result["adjuvants"]:
            ml_metrics = MLRankingMetrics(**adj["ml_metrics"])
            adjuvants.append(AdjuvantCandidate(
                name=adj["name"],
                pubchem_cid=adj["pubchem_cid"],
                chemical_class=adj["chemical_class"],
                tanimoto_similarity=adj["tanimoto_similarity"],
                cost_per_dose_usd=adj["cost_per_dose_usd"],
                target_pathway=adj["target_pathway"],
                ml_metrics=ml_metrics
            ))
            
        return AdjuvantMatchResponse(
            status="SUCCESS",
            matchmaker_run_id=f"MM-{uuid.uuid4().hex[:12].upper()}",
            target_pathogen=match_result["target_pathogen"],
            inferred_immune_profile=match_result["inferred_immune_profile"],
            timestamp=datetime.now(),
            adjuvants=adjuvants,
            formulation_recipe_recommendation=match_result["formulation_recipe_recommendation"]
        )
    except Exception as e:
        logger.error(f"Adjuvant matchmaking failed: {e}")
        raise HTTPException(status_code=500, detail=f"Adjuvant matching analysis failed: {str(e)}")
