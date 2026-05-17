# BI-VAC: Bio Intelligence Vaccine Early-Warning & Analysis Center

BI-VAC is an enterprise-grade genomic surveillance and vaccine evasion analysis platform. It leverages AI-driven structural biology insights to identify high-risk viral mutations and suggest adjuvant targets before clinical data is available.

---

## 🏗️ Project Architecture

The project is organized into a modular, production-ready structure:

```text
bio-vac/
├── frontend/               # [Frontend] Next.js Portal (Main UI)
├── dashboard/              # [Frontend] Vite Dashboard (Research UI)
├── backend/                # [Backend Root] Set this as "Root Directory" in Vercel
│   ├── api/                # FastAPI Entry Point (api/main.py)
│   ├── app/                # Core Logic & Modules
│   ├── requirements.txt    # Python dependencies
│   └── vercel.json         # Backend deployment config
├── docs/                   # Documentation & Research
├── scripts/                # Orchestration scripts
└── README.md               # You are here
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)
- Git

### Local Development
1. **Clone the repository**:
   ```bash
   git clone https://github.com/Ft-sumukh/bio-vac.git
   cd bio-vac
   ```

2. **Run the Orchestration Script**:
   Navigate to the `scripts` folder and run the start script:
   ```powershell
   ./scripts/start.bat
   ```
   This will automatically launch the Backend, the Portal, and the Dashboard in separate terminal windows.

---

## 🌍 Deployment

### Frontend (Next.js Portal)
- **Service**: Vercel
- **Root Directory**: `frontend`
- **Environment Variables**:
  - `NEXT_PUBLIC_API_URL`: Your deployed backend URL.

### Backend (FastAPI)
- **Service**: Vercel
- **Root Directory**: `backend`  <-- **CRITICAL: Set this in Vercel Settings**
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: Managed by `vercel.json`
- **Environment Variables**:
  - `FRONTEND_URL`: Your deployed portal URL.

---

## 🏆 The 5 Game-Winning Features

BI-VAC positions itself as a 10x strategic moat for pandemic-scale vaccine optimization by bridging genomic surveillance, structural biology, immunology, and vaccine formulation:

1. **[Viral Evolution Forecasting Engine](file:///d:/bio%20vac/docs/architecture.md#feature-1-viral-evolution-forecasting-engine)**: Predicts high-probability viral variants 6-24 months in advance using selection pressure (dN/dS), deep protein language models (ESM-2), and climate/mobility nowcasting.
2. **[Multi-Pathogen Convergence Detector](file:///d:/bio%20vac/docs/architecture.md#feature-2-multi-pathogen-convergence-detector)**: Identifies cross-pathogen evolutionary hotspots (e.g. RSV, Influenza, SARS-CoV-2) under synchronized selective pressure for multi-valent "combo vaccine" opportunities.
3. **[Interactive Structural Dynamics Sandbox](file:///d:/bio%20vac/docs/architecture.md#feature-3-interactive-structural-dynamics-sandbox)**: Browser-based, GPU-accelerated molecular dynamics (OpenMM + WebGL + Three.js) allowing real-time mutation simulation and direct binding energy calculation ($\Delta\Delta G$).
4. **[Immunological Memory Atlas](file:///d:/bio%20vac/docs/architecture.md#feature-4-immunological-memory-atlas)**: Models trained T-cell immunity and cross-reactivity (TCRdist + NetMHCpan 4.1) stratified by population genetics (HLA allele frequencies) and exposure history to optimize regional dosing.
5. **[AI-Powered Adjuvant Matchmaker](file:///d:/bio%20vac/docs/architecture.md#feature-5-ai-powered-adjuvant-matchmaker)**: Automated formulation recommendation engine utilizing gradient boosting (XGBoost/LightGBM) to match adjuvant properties to target immune profiles (Th1 vs. Th2 vs. Tfh).

For a deep-dive into the technical specifications, REST APIs, database schemas, and mathematical foundations, view the **[BI-VAC Complete Architecture Documentation](file:///d:/bio%20vac/docs/architecture.md)**.

---

## 📜 License
Proprietary Intelligence - BI-VAC Platform.
Authored by **Antigravity AI**.

