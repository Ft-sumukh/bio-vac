# BI-VAC: Bio Intelligence Vaccine Early-Warning & Analysis Center

BI-VAC is an enterprise-grade genomic surveillance and vaccine evasion analysis platform. It leverages AI-driven structural biology insights to identify high-risk viral mutations and suggest adjuvant targets before clinical data is available.

---

## 🏗️ Project Architecture

The project is organized into a modular, production-ready structure:

```text
bio-vac/
├── backend/                # [Backend Root] Set this as "Root Directory" in Vercel
│   ├── api/                # FastAPI Entry Point (api/main.py)
│   ├── app/                # Core Logic & Modules
│   ├── requirements.txt    # Python dependencies
│   └── vercel.json         # Backend deployment config
├── apps/
│   ├── portal/             # [Frontend] Next.js Portal
│   └── dashboard/          # [Frontend] Vite Dashboard
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
- **Root Directory**: `apps/portal`
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

## 🛡️ Key Features
- **Real-Time Surveillance**: Streaming genomic ingest from GISAID/NCBI.
- **Evasion Scoring**: Proprietary AI scoring based on structural biophysics.
- **Adjuvant Targeting**: Automated chemistry recommendations for mutation escape.
- **Enterprise Webhooks**: Integration for pharmaceutical R&D pipelines.

---

## 📜 License
Proprietary Intelligence - BI-VAC Platform.
Authored by **Antigravity AI**.
