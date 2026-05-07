# 🛡️ Vaccine Early-Warning Portal (VEWP)
> **Advanced Bio-Intelligence for Pharmaceutical Surveillance**

VEWP is a high-end, data-dense intelligence platform designed to give pharmaceutical developers a "weeks-ahead" advantage in the race against viral evolution.

## 🔗 Live Access Links
Once the local servers are running, you can access the different layers of the portal here:

- **[Main Intelligence Landing Page](http://localhost:3000)** (React/Next.js) - *High-end landing page, infinite data feed, and functional routing.*
- **[Research Dashboard](http://localhost:5173)** (Vanilla JS/Vite) - *The original surveillance dashboard and global threat map.*
- **[Backend API Documentation](http://localhost:8000/docs)** (FastAPI/Swagger) - *Live endpoint testing and data models.*

---

## 💡 The Idea: "The Pre-emptive Shield"
The core philosophy of VEWP is to move from **reactive** vaccine development to **pre-emptive** surveillance. 

Most genomic surveillance tools simply report what has already spread. **VEWP predicts risk.** By analyzing structural shifts in proteins (like the SARS-CoV-2 Spike Protein) *as they emerge* in regional clusters, our engine calculates the likelihood of "Complement Evasion"—the virus's ability to dodge the human immune response.

### Key Pillars:
1.  **Early Detection**: Identifying mutations (e.g., K417N, E484K) at the moment of first sequence ingestion.
2.  **Structural Simulation**: Calculating the "Evasion Score" (0-100) based on how significantly the mutation alters the binding site.
3.  **Adjuvant Discovery**: Suggesting specific chemical modifications (Adjuvants) to current vaccines to maintain efficacy against new strains.

---

## 📊 Data Model & Intelligence Metrics

The portal tracks and visualizes several critical data points:

### 1. Evasion Score (0-100)
- **40-60 (Monitored)**: Low risk; potential for minor antibody neutralization drop.
- **70-85 (Elevated)**: Significant risk; requires immediate lab validation.
- **85+ (Critical)**: High likelihood of total evasion; immediate adjuvant redesign suggested.

### 2. Adjuvant Recommendations
For every high-risk mutation, the system suggests a matching adjuvant target:
- **Lipid Nanoparticles (LNP)**: Optimized for delivery.
- **TLR7/8 Agonists**: To boost innate immune response.
- **Squalene Emulsions**: To increase antigen stability.

### 3. Global Pulse Data
A real-time stream of genomic sequences processed from global hubs (GISAID, NCBI), visualized as a "Live Surveillance Network" with geographic pulse indicators.

---

## 📂 Repository Structure

- **`/razorpay-hero`**: Next.js 15 App - The primary user-facing intelligence portal.
- **`/vewp`**: FastAPI Backend - The "Brain" of the operation.
- **`/frontend`**: Vite Prototype - The original surveillance dashboard concept.

## 🛠️ Tech Stack
- **Frontend**: React, Next.js, Tailwind CSS v4, Framer Motion.
- **Backend**: Python, FastAPI, Pydantic.
- **Data Visuals**: High-fidelity SVG genomic animations and AI-driven med-tech photography.

## 🏃 Quick Start Guide

1. **Start Backend & Prototype**:
   ```bash
   .\start.bat
   ```
2. **Start Main Intelligence Portal**:
   ```bash
   cd razorpay-hero
   npm run dev
   ```

---
*Developed for the future of rapid pharmaceutical response.*
