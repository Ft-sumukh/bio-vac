from datetime import datetime
from typing import List, Dict, Optional
from pydantic import BaseModel, Field

class SimulationRequest(BaseModel):
    pdb_id: str = Field("7T9K", description="Target PDB Structural ID (e.g. 7T9K for Spike RBD)")
    mutations: List[str] = Field(default_factory=lambda: ["N501Y"], description="List of mutations to simulate (e.g. ['N501Y', 'E484K'])")
    force_field: str = Field("AMBER99SB", description="Force field to use for Molecular Dynamics (e.g., AMBER99SB, CHARMM36)")
    temperature_kelvin: float = Field(300.0, ge=100.0, le=450.0, description="Simulation temperature in Kelvin")
    simulation_steps: int = Field(1000, ge=100, le=10000, description="Molecular dynamics integration steps")
    frame_frequency: int = Field(10, description="Frequency to save coordinates/energy frames")

class AtomCoordinate(BaseModel):
    atom_id: int
    element: str
    residue_name: str
    residue_index: int
    chain: str
    x: float
    y: float
    z: float
    b_factor: float

class TrajectoryFrame(BaseModel):
    frame_index: int
    potential_energy_kcal: float
    kinetic_energy_kcal: float
    total_energy_kcal: float
    temperature_k: float
    coordinates: List[AtomCoordinate]

class ThermodynamicDelta(BaseModel):
    mutation: str
    delta_g_wildtype_kcal: float
    delta_g_mutant_kcal: float
    delta_delta_g_kcal: float
    binding_affinity_change_percent: float

class SimulationResponse(BaseModel):
    status: str
    simulation_run_id: str
    pdb_id: str
    mutations_applied: List[str]
    time_elapsed_ms: float
    thermodynamics: List[ThermodynamicDelta]
    rmsd_trajectory: List[float] = Field(..., description="Root-Mean-Square Deviation over simulation frames")
    rmsf_residues: Dict[str, float] = Field(..., description="Root-Mean-Square Fluctuation per residue")
    frames: List[TrajectoryFrame]
