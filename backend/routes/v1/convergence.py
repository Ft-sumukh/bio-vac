import uuid
from datetime import datetime
from fastapi import APIRouter, HTTPException
from schemas.convergence import ConvergenceRequest, ConvergenceResponse, ConvergentHotspot
from services.convergence import pathogen_aligner, convergence_scorer
from monitoring.logging import logger

router = APIRouter()

# High-fidelity mock reference domains for scan alignment
MOCK_REFERENCE_DOMAINS = {
    "sars-cov-2": "ATGTTTGTTTTTCTTGTTTTATTGCCACTAGTCTCTAGTCAGTGTGTTAATCTTACAACCAGAACTCAATTACCCCCTGCATACACTAATTCTTTCACACGTGGTGTTTATTACCCTGACAAAGTTTTCAGATCCTCAGTTTTACATTCAACTCAGGACTTGTTCTTACCTTTCTTTTCCAATGTTACTTGGTTCCATGCTATACATGTCTCTGGGACCAATGGTACTAAG",
    "influenza-a": "ATGGAGAAAATAGTGCTTCTTCTTGCAATAGTCAGTCTTGTTAAAAGTGATCAGATTTGCATTGGTTACCATGCAAACAATTCAACAGAGCAGGTTGACACAATAATGGAAAAGAACGTTACTGTTACACATGCCCAAGACATACTGGAAAAGACACACAACGGGAAGCTCTGCGATCTAGATGGAGTGAAGCCTCTAATTTTAAGAGATTGTAGTGTAGCTGGATGGCTCCTCGGG",
    "rsv": "ATGGGGAAATACAAAATACTTCTTCAAAATGTCAGTCTTCTTAAAAGTGATCAAATTTGCATTGGTTACCAAGCAAACAATTCAACAGAGAAGGTTGACACAATAATGGAAAAGAACGTTACTGTTACACATGCACAAGACATACTGGAAAAGACACACAACGGGAAGCTCTGCGATCTAGATGGAGTGAAGCCTCTAATTTTAAGAGATTGTAGTGTAGCTGGATGGCTCCTCGGG"
}

@router.post("/detect", response_model=ConvergenceResponse)
async def detect_multi_pathogen_convergence(request: ConvergenceRequest):
    """
    Scans different respiratory pathogens (e.g. Influenza, RSV, SARS-CoV-2)
    to find convergent, overlapping evolutionary mutations for combo-vaccine targeting.
    """
    try:
        logger.info(f"Triggering multi-pathogen convergence detection for: {request.pathogens}")
        
        # Build dictionary of protein sequences for pathogens specified in request
        active_sequences = {}
        for pathogen in request.pathogens:
            key = pathogen.lower().replace(" ", "-")
            if key in MOCK_REFERENCE_DOMAINS:
                active_sequences[pathogen] = MOCK_REFERENCE_DOMAINS[key]
                
        if len(active_sequences) < 2:
            raise HTTPException(
                status_code=400, 
                detail="At least 2 supported pathogens with valid structural profiles are required for convergence analysis"
            )

        # 1. Run local alignments
        homologous_regions = pathogen_aligner.align_pathogen_domains(
            pathogen_data=active_sequences,
            min_homology=request.minimum_sequence_homology
        )
        
        # 2. Run convergence scoring
        hotspots_data = convergence_scorer.compute_convergence_indices(
            homology_records=homologous_regions,
            time_window_days=request.temporal_window_days
        )
        
        # Form response model objects
        hotspots = [ConvergentHotspot(**spot) for spot in hotspots_data]
        
        # Calculate a cumulative cross-pathogen efficacy index
        if hotspots:
            efficacy_index = round(sum(h.convergence_score for h in hotspots) / len(hotspots) / 100.0, 3)
        else:
            efficacy_index = 0.0
            
        return ConvergenceResponse(
            status="SUCCESS",
            detector_run_id=f"DET-{uuid.uuid4().hex[:12].upper()}",
            scanned_pathogens=list(active_sequences.keys()),
            timestamp=datetime.now(),
            hotspots=hotspots,
            cross_pathogen_efficacy_index=efficacy_index
        )
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Multi-pathogen convergence detection failed: {e}")
        raise HTTPException(status_code=500, detail=f"Convergence scan execution failed: {str(e)}")
