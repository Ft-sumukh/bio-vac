import uuid
from datetime import datetime
from fastapi import APIRouter, HTTPException
from schemas.dynamics import SimulationRequest, SimulationResponse, TrajectoryFrame, ThermodynamicDelta
from services.dynamics import molecular_dynamics_engine
from monitoring.logging import logger

router = APIRouter()

@router.post("/simulate", response_model=SimulationResponse)
async def simulate_molecular_dynamics(request: SimulationRequest):
    """
    Triggers local dynamic MD integration (implicit AMBER99SB) to simulate structural
    mutations and calculate the free energy differences (Delta Delta G).
    """
    try:
        logger.info(f"Initiating Molecular Dynamics simulation for PDB: {request.pdb_id}, Mutations: {request.mutations}")
        
        sim_data = molecular_dynamics_engine.run_molecular_dynamics(
            pdb_id=request.pdb_id,
            mutations=request.mutations,
            temp=request.temperature_kelvin,
            steps=request.simulation_steps,
            freq=request.frame_frequency
        )
        
        # Format frames
        frames = []
        for frame in sim_data["frames"]:
            frames.append(TrajectoryFrame(**frame))
            
        # Format thermodynamic deltas
        thermodynamics = []
        for delta in sim_data["thermodynamics"]:
            thermodynamics.append(ThermodynamicDelta(**delta))
            
        return SimulationResponse(
            status="SUCCESS",
            simulation_run_id=f"SIM-{uuid.uuid4().hex[:12].upper()}",
            pdb_id=sim_data["pdb_id"],
            mutations_applied=sim_data["mutations_applied"],
            time_elapsed_ms=sim_data["time_elapsed_ms"],
            thermodynamics=thermodynamics,
            rmsd_trajectory=sim_data["rmsd_trajectory"],
            rmsf_residues=sim_data["rmsf_residues"],
            frames=frames
        )
    except Exception as e:
        logger.error(f"Molecular Dynamics simulation failed: {e}")
        raise HTTPException(status_code=500, detail=f"Molecular dynamics simulation failed: {str(e)}")
