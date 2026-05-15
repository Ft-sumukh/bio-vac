from __future__ import annotations

from .models import ObservationOut


def suggest_adjuvant_targets(observation: ObservationOut) -> list[str]:
    """
    Stub recommendations engine.

    In a real system this would map:
    - mutation cluster → expected immune phenotype (e.g., reduced neutralization, altered complement sensitivity)
    - pathogen/protein context → known innate pathways
    - developer's vaccine platform constraints
    """

    # Simple rule placeholders to make the API useful end-to-end.
    if observation.risk.score >= 0.9:
        return [
            "Consider stronger Th1-biasing adjuvant (e.g., TLR agonist class) pending platform fit",
            "Evaluate mucosal delivery/adjuvant strategies if transmission advantage suspected",
            "Prioritize epitope-broadening antigen design updates",
        ]
    if observation.risk.score >= 0.75:
        return [
            "Consider adjuvant strategy that increases breadth (e.g., balanced innate activation)",
            "Plan rapid neutralization + complement assays for confirmatory triage",
        ]
    return []

