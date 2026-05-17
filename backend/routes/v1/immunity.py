import uuid
from datetime import datetime
from fastapi import APIRouter, HTTPException
from schemas.immunity import ImmunityProfileRequest, ImmunityProfileResponse, EpitopeBinding, WaningCurvePoint, CrossReactivityScore
from services.immunity import immunology_memory_atlas
from monitoring.logging import logger

router = APIRouter()

@router.post("/profile", response_model=ImmunityProfileResponse)
async def profiles_immunological_memory(request: ImmunityProfileRequest):
    """
    Simulates population immune parameters, NetMHCpan HLA-epitope binders,
    T-cell TCRdist distances, and neutralization half-life waning curves.
    """
    try:
        logger.info(f"Initiating immunological profile mapping for Lineage: {request.lineage}, Region: {request.region}")
        
        profile = immunology_memory_atlas.profile_immunology_and_waning(
            lineage=request.lineage,
            region=request.region,
            cohort=request.prior_exposure_cohort,
            custom_hla=request.hla_alleles_custom
        )
        
        # Format MHC-I
        mhc_i_epitopes = []
        for epitope in profile["mhc_i_epitopes"]:
            mhc_i_epitopes.append(EpitopeBinding(**epitope))
            
        # Format MHC-II
        mhc_ii_epitopes = []
        for epitope in profile["mhc_ii_epitopes"]:
            mhc_ii_epitopes.append(EpitopeBinding(**epitope))
            
        # Format waning curve
        waning_curve = []
        for pt in profile["waning_projection_180_days"]:
            waning_curve.append(WaningCurvePoint(**pt))
            
        # Format TCRdist
        cross_reactivity = []
        for cross in profile["cross_reactivity"]:
            cross_reactivity.append(CrossReactivityScore(**cross))
            
        return ImmunityProfileResponse(
            status="SUCCESS",
            profile_id=f"IM-{uuid.uuid4().hex[:12].upper()}",
            lineage=profile["lineage"],
            target_region=profile["target_region"],
            demographic_hla_distribution=profile["demographic_hla_distribution"],
            mhc_i_epitopes=mhc_i_epitopes,
            mhc_ii_epitopes=mhc_ii_epitopes,
            waning_projection_180_days=waning_curve,
            cross_reactivity=cross_reactivity,
            recommended_booster_interval_months=profile["recommended_booster_interval_months"],
            regional_booster_priority_score=profile["regional_booster_priority_score"]
        )
    except Exception as e:
        logger.error(f"Immunological memory profiling failed: {e}")
        raise HTTPException(status_code=500, detail=f"Immunological memory mapping failed: {str(e)}")
