from __future__ import annotations

from dataclasses import dataclass

from vewp.models import ObservationIn, RiskBand, RiskScore


@dataclass(frozen=True)
class RiskScorer:
    """
    Deterministic placeholder scorer.

    Replace with ML/biophysics models once you have labeled outcomes + structural priors.
    """

    def score(self, obs: ObservationIn) -> RiskScore:
        muts = {m.strip() for m in obs.mutations}

        # Heuristic "signals" buckets
        complement_evasion_like = {
            # Placeholder examples: charge/epitope shifts historically associated with immune escape
            "S:E484K",
            "S:K417N",
            "S:N501Y",
            "S:L452R",
            "S:F486V",
        }
        glycan_shielding_like = {
            # Placeholder: mutations that may introduce/alter glycosylation motifs in some proteins
            "S:T20N",
            "S:N370S",
        }

        signals: list[str] = []
        score = 0.15

        hit1 = len(muts & complement_evasion_like)
        if hit1:
            score += min(0.55, 0.18 * hit1)
            signals.append(f"escape_associated_mutations:{hit1}")

        hit2 = len(muts & glycan_shielding_like)
        if hit2:
            score += min(0.25, 0.12 * hit2)
            signals.append(f"glycan_shielding_like:{hit2}")

        # Evidence confidence gates the score upward/downward
        score *= 0.6 + 0.4 * float(obs.evidence.confidence)
        score = max(0.0, min(1.0, score))

        if score >= 0.9:
            band = RiskBand.critical
        elif score >= 0.75:
            band = RiskBand.high
        elif score >= 0.45:
            band = RiskBand.medium
        else:
            band = RiskBand.low

        return RiskScore(score=score, band=band, signals=signals)

