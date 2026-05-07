# Vaccine Early-Warning Portal (VEWP)

An API-driven platform that ingests emerging mutation signals and **alerts vaccine/pharma developers** about **high-risk complement-evading variants**, with **adjuvant target suggestions** ahead of lab confirmation.

## What’s in this repo (MVP scaffold)

- **FastAPI backend** with OpenAPI docs
- **Ingest API** for mutation observations (from internal pipelines, GISAID-derived feeds, literature, etc.)
- **Risk scoring pipeline** (stubbed with a deterministic scorer you can replace with ML/biophysics)
- **Alerting** via webhooks (email stub included)
- **Recommendations** endpoint for “adjuvant target” suggestions (rules-based stub)

## Quickstart

Prereqs: Python 3.11+ recommended (works on newer too)

```bash
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
uvicorn vewp.main:app --reload
```

Then open:
- Swagger UI: `http://127.0.0.1:8000/docs`
- Health: `http://127.0.0.1:8000/health`

## Minimal workflow (example)

1) Create a subscription (webhook):

```bash
curl -X POST http://127.0.0.1:8000/v1/subscriptions \
  -H "Content-Type: application/json" \
  -d "{\"org\":\"AcmeVax\",\"channel\":\"webhook\",\"endpoint\":\"https://example.com/hook\",\"min_risk\":0.75}"
```

2) Ingest a mutation observation:

```bash
curl -X POST http://127.0.0.1:8000/v1/observations \
  -H "Content-Type: application/json" \
  -d "{\"pathogen\":\"SARS-CoV-2\",\"protein\":\"S\",\"lineage\":\"XBB.1.5\",\"mutations\":[\"S:K417N\",\"S:E484K\"],\"region\":\"IN\",\"collection_date\":\"2026-05-01\",\"evidence\":{\"source\":\"genomic_feed\",\"confidence\":0.8}}"
```

The server scores risk, stores it, and emits alerts to matching subscriptions.

## Notes / next steps

- Replace the stub scorer in `vewp/scoring.py` with:
  - complement evasion features (glycan shielding, charge patches, epitope disruption)
  - antibody escape / antigenic distance
  - growth advantage / prevalence trajectory
  - structural priors (e.g., RBD exposure changes)
- Wire real alert delivery (email/SMS/Slack) and durable storage (Postgres).

