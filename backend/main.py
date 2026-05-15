from __future__ import annotations

from datetime import datetime, timezone
from uuid import uuid4

from fastapi import FastAPI, HTTPException

from app.alerting import emit_alerts
from app.models import ObservationIn, ObservationOut, SubscriptionIn
from app.scoring import RiskScorer
from app.store import MemoryStore


def _utcnow() -> datetime:
    return datetime.now(tz=timezone.utc)


import os
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Vaccine Early-Warning Portal",
    version="0.1.0",
    description="Ingest mutation observations, score complement-evasion risk, and emit alerts + adjuvant target suggestions.",
)

# Deployment logic: Allow the frontend URL from environment variables
frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        frontend_url,
        "http://localhost:3000",
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

store = MemoryStore()
scorer = RiskScorer()


@app.get("/")
def root():
    return {
        "message": "Welcome to the Vaccine Early-Warning Portal (VEWP) Backend API",
        "documentation": "/docs",
        "health_check": "/health",
        "frontend_portal": frontend_url
    }


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/v1/subscriptions")
def create_subscription(sub: SubscriptionIn):
    return store.add_subscription(sub)


@app.get("/v1/subscriptions")
def list_subscriptions():
    return store.list_subscriptions()


@app.post("/v1/observations")
async def create_observation(obs: ObservationIn):
    risk = scorer.score(obs)
    out = ObservationOut(id=str(uuid4()), created_at=_utcnow(), input=obs, risk=risk)
    store.add_observation(obs, out)
    await emit_alerts(store.list_subscriptions(), out)
    return out


@app.get("/v1/observations")
def list_observations(limit: int = 50):
    return store.list_observations(limit=limit)


@app.get("/v1/observations/{obs_id}")
def get_observation(obs_id: str):
    obs = store.get_observation(obs_id)
    if not obs:
        raise HTTPException(status_code=404, detail="Observation not found")
    return obs

