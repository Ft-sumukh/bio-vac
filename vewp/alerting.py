from __future__ import annotations

import asyncio
from datetime import datetime, timezone
from typing import Iterable

import httpx

from vewp.models import AlertEvent, ObservationOut, SubscriptionOut
from vewp.recommendations import suggest_adjuvant_targets


def _utcnow() -> datetime:
    return datetime.now(tz=timezone.utc)


def _subscription_matches(sub: SubscriptionOut, obs: ObservationOut) -> bool:
    if not sub.spec.enabled:
        return False
    if obs.risk.score < sub.spec.min_risk:
        return False
    if sub.spec.pathogens and obs.input.pathogen not in set(sub.spec.pathogens):
        return False
    return True


async def _deliver_webhook(client: httpx.AsyncClient, endpoint: str, event: AlertEvent) -> None:
    # For MVP: best-effort delivery with short timeout.
    await client.post(endpoint, json=event.model_dump(mode="json"), timeout=10.0)


async def emit_alerts(subscriptions: Iterable[SubscriptionOut], observation: ObservationOut) -> list[AlertEvent]:
    """
    Emits alerts for matching subscriptions.

    MVP behavior:
    - webhooks: POST JSON payload
    - email: no-op placeholder (returns event as if sent)
    """

    matched: list[SubscriptionOut] = [s for s in subscriptions if _subscription_matches(s, observation)]
    if not matched:
        return []

    recs = suggest_adjuvant_targets(observation)
    events = [
        AlertEvent(
            emitted_at=_utcnow(),
            subscription_id=s.id,
            org=s.spec.org,
            observation=observation,
            recommendations=recs,
        )
        for s in matched
    ]

    async with httpx.AsyncClient() as client:
        tasks = []
        for s, ev in zip(matched, events, strict=False):
            if s.spec.channel == "webhook":
                tasks.append(_deliver_webhook(client, str(s.spec.endpoint), ev))
            else:
                # Email channel is intentionally a placeholder in MVP.
                pass
        if tasks:
            # Best-effort: collect exceptions but don't crash the ingest path.
            results = await asyncio.gather(*tasks, return_exceptions=True)
            _ = results

    return events

