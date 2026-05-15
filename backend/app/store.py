from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime, timezone
from threading import RLock
from uuid import uuid4

from .models import ObservationIn, ObservationOut, SubscriptionIn, SubscriptionOut


def _utcnow() -> datetime:
    return datetime.now(tz=timezone.utc)


@dataclass
class MemoryStore:
    _lock: RLock = field(default_factory=RLock)
    observations: dict[str, ObservationOut] = field(default_factory=dict)
    subscriptions: dict[str, SubscriptionOut] = field(default_factory=dict)

    def add_observation(self, obs_in: ObservationIn, obs_out: ObservationOut) -> ObservationOut:
        with self._lock:
            self.observations[obs_out.id] = obs_out
        return obs_out

    def list_observations(self, limit: int = 50) -> list[ObservationOut]:
        with self._lock:
            return list(self.observations.values())[-limit:][::-1]

    def get_observation(self, obs_id: str) -> ObservationOut | None:
        with self._lock:
            return self.observations.get(obs_id)

    def add_subscription(self, sub_in: SubscriptionIn) -> SubscriptionOut:
        sub_id = str(uuid4())
        out = SubscriptionOut(id=sub_id, created_at=_utcnow(), spec=sub_in)
        with self._lock:
            self.subscriptions[sub_id] = out
        return out

    def list_subscriptions(self) -> list[SubscriptionOut]:
        with self._lock:
            return list(self.subscriptions.values())

    def get_subscription(self, sub_id: str) -> SubscriptionOut | None:
        with self._lock:
            return self.subscriptions.get(sub_id)

