from __future__ import annotations

from datetime import date, datetime
from enum import Enum
from typing import Any, Literal

from pydantic import BaseModel, Field, HttpUrl


class Evidence(BaseModel):
    source: str = Field(..., examples=["genomic_feed", "preprint", "lab", "literature"])
    confidence: float = Field(..., ge=0.0, le=1.0)
    extra: dict[str, Any] = Field(default_factory=dict)


class ObservationIn(BaseModel):
    pathogen: str = Field(..., examples=["SARS-CoV-2", "influenza-A"])
    protein: str = Field(..., examples=["S", "HA"])
    lineage: str | None = Field(default=None, examples=["XBB.1.5"])
    mutations: list[str] = Field(..., min_length=1, examples=[["S:K417N", "S:E484K"]])
    region: str | None = Field(default=None, examples=["IN", "US-CA"])
    collection_date: date | None = None
    evidence: Evidence


class RiskBand(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"
    critical = "critical"


class RiskScore(BaseModel):
    score: float = Field(..., ge=0.0, le=1.0)
    band: RiskBand
    signals: list[str] = Field(default_factory=list)


class ObservationOut(BaseModel):
    id: str
    created_at: datetime
    input: ObservationIn
    risk: RiskScore


class SubscriptionChannel(str, Enum):
    webhook = "webhook"
    email = "email"


class SubscriptionIn(BaseModel):
    org: str = Field(..., min_length=2)
    channel: SubscriptionChannel
    endpoint: HttpUrl | str = Field(
        ...,
        description="Webhook URL for channel=webhook, or email address for channel=email.",
    )
    pathogens: list[str] | None = Field(default=None, description="If set, only match these pathogens.")
    min_risk: float = Field(default=0.7, ge=0.0, le=1.0)
    enabled: bool = True


class SubscriptionOut(BaseModel):
    id: str
    created_at: datetime
    spec: SubscriptionIn


class AlertEvent(BaseModel):
    type: Literal["mutation.alert"] = "mutation.alert"
    emitted_at: datetime
    subscription_id: str
    org: str
    observation: ObservationOut
    recommendations: list[str] = Field(default_factory=list)

