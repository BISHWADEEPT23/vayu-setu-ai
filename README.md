# VAYU-SETU AI — Federated Air & Climate Intelligence for BRICS

**Collaborative Environmental Intelligence, Multi-Source Evidence Fusion & Privacy-Preserving Transboundary Airshed Coordination**

---

## 1. Problem Statement
Air pollution transcends municipal and national borders, yet environmental governance remains fragmented. Traditional monitoring relies on isolated ground stations with spatial coverage gaps and delayed reporting. Transboundary industrial plumes and seasonal fires cross jurisdictions without standardized early-warning protocols, while citizen reports lack automated corroboration and cross-border environmental data sharing faces strict sovereignty and privacy constraints.

## 2. Solution
VAYU-SETU AI ("Air Bridge") is a federated climate intelligence prototype that brings together ground monitoring stations, satellite observations, meteorology, and citizen reports into a coordinated operational command interface. By combining deterministic multi-source evidence fusion with a privacy-preserving transboundary federation architecture, VAYU-SETU demonstrates how regional authorities can detect emerging pollution anomalies, track directional transport, and coordinate mitigation actions across borders without compromising citizen privacy or national data sovereignty.

## 3. Key Features
- **Real-Time Operational Overview**: High-level KPIs, network operational status, synthetic active incident tracking (`VS-E001`), and critical hotspot monitoring (`VS-Z07`).
- **Interactive Live Map**: Geospatial visualization across 12 monitoring zones using deterministic synthetic monitoring-zone data, satellite overlays, and a simplified wind-based demo plume (not an atmospheric dispersion model).
- **Multi-Source Evidence Fusion**: Deterministic corroboration combining ground sensors, satellite observations, meteorology, citizen reports, and AI image analysis into a Prototype Evidence Confidence score.
- **Multi-Horizon Scenario Forecast**: Deterministic synthetic 24h, 48h, and 72h prototype forecast logic illustrating forward air quality trends and risk tiers.
- **Population & Asset Exposure Intelligence**: Synthetic demo estimates of downwind population and critical infrastructure counts for operational simulation (not official public-health guidance).
- **Authority Command Centre**: Structured operational response interface with prioritized intervention recommendations, agency assignments, and local alert lifecycle management (Acknowledge, Escalate, Resolve).
- **Simulated BRICS Transboundary Federation**: Simulated demo showing sovereign node coordination (India active prototype node; Brazil, Russia, China, South Africa simulated) demonstrating privacy-scrubbed regional data exchange without citizen PII.
- **Citizen Environmental Reporting & AI Visual Verification**: Citizen reporting workflow supporting real user-uploaded photographs evaluated for visual features via server-side Gemini Vision.

## 4. Architecture
VAYU-SETU AI is implemented as a full-stack web application with a React SPA client, an Express server handling API routing and static asset serving, and server-side integration with the Google Gemini API:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        React SPA Client (Vite + TS)                    │
│  - Shell Navigation       - LiveMap Geospatial     - Hotspots Fusion   │
│  - Command Centre View    - Forecast Prototype     - Simulated BRICS   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Relative /api HTTP Calls
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     Node.js / Express Server Proxy                     │
│  - /api/health (Liveness)      - Static Dist Servicing (SPA Fallback)  │
│  - /api/analyze-image (Gemini Vision Server-Side Proxy)                │
└───────────────────┬────────────────────────────────┬───────────────────┘
                    │                                │
                    ▼                                ▼
┌───────────────────────────────────┐    ┌───────────────────────────────┐
                    │                                │
┌───────────────────┴───────────────┐    ┌───────────┴───────────────────┐
│     @google/genai SDK Proxy       │    │     Synthetic Engine Data     │
│   (Server-Side API Key Only)      │    │  (12 Zones, Canonical Event, │
│  - Qualitative Image Analysis     │    │   Deterministic Telemetry)    │
└───────────────────────────────────┘    └───────────────────────────────┘
```

## 5. End-to-End Data Flow & Information Taxonomy

To ensure scientific transparency, VAYU-SETU explicitly categorizes all platform information:

| Taxonomy Category | Data Source & Flow | Representation in VAYU-SETU |
| :--- | :--- | :--- |
| **Synthetic Monitoring Telemetry** | Pre-configured monitoring zone definitions | Deterministic synthetic sensor values (PM2.5, PM10, NO2, SO2, CO, O3) across 12 zones |
| **Real User-Uploaded Images** | User submissions via citizen reporting interface | User-provided photos submitted in real time for qualitative visual inspection |
| **AI Visual Interpretation** | Backend Gemini Vision model via `@google/genai` | Qualitative visual descriptors (smoke density, plume type, visible flame) and visual confidence score |
| **Simplified Plume & Forecast** | Synthetic prototype logic and wind-vector offsets | Simplified wind-based demo plume and deterministic synthetic 24/48/72h forecast horizons |
| **Synthetic Exposure Estimates** | Synthetic demographic model linked to incident zone | Demo counts of downwind population and facilities (not clinical or public-health guidance) |
| **Simulated Federation** | Synthetic cross-border node exchange | Coarse regional airshed records exchanged between simulated BRICS member nodes |

## 6. Gemini's Role & Strict Safety Boundaries
- **Visual Interpretation Only**: Gemini is used exclusively on the server side (`/api/analyze-image`) to extract qualitative visual features from user-uploaded images (e.g., identifying dark smoke plumes, visible flames, or industrial chimney emissions).
- **Does NOT Verify Pollution**: Gemini provides visual interpretation only; it does **not** verify ground-truth pollution, confirm legal violations, or replace official environmental inspections.
- **Does NOT Generate Pollutant Measurements or Forecasts**: Gemini **never** generates numerical pollutant concentrations (e.g., PM2.5 in µg/m³) or atmospheric dispersion forecasts. All quantitative values displayed in the app are deterministic prototype data.
- **Prototype Evidence Confidence vs. Probability**: Gemini's `visualConfidence` score reflects how clearly visual features match recognized visual categories in the submitted image. It is **never** presented as an environmental violation probability or ground-truth event probability.

## 7. Evidence Fusion Methodology
VAYU-SETU corroborates multi-source observations using a deterministic Evidence Fusion algorithm:

### Evidence Source Weights
- **Citizen Reports ($w = 0.10$)**: 10%
- **AI Image Interpretation ($w = 0.15$)**: 15%
- **Ground Sensor Telemetry ($w = 0.30$)**: 30%
- **Satellite Observations ($w = 0.25$)**: 25%
- **Meteorological Consistency ($w = 0.20$)**: 20%

### Scoring Formulation
For each available evidence source, an individual source score is computed from quality, cross-source agreement, and observation freshness:

$$\text{sourceScore} = \text{quality} \times 0.4 + \text{agreement} \times 0.4 + \text{freshness} \times 0.2$$

The composite score is the weighted average across all currently available sources:

$$\text{Final Score} = \frac{\sum_{\text{available}} (\text{sourceScore}_i \times w_i)}{\sum_{\text{available}} w_i}$$

### Confidence Thresholds
- **Insufficient Evidence**: Fewer than 2 independent evidence sources available.
- **Low**: Score $< 0.30$
- **Moderate**: Score $< 0.60$
- **High**: Score $\ge 0.60$

*Note: This metric represents **Prototype Evidence Confidence** (concordance across available data streams) for prototype demonstration, and is **not** a statistical pollution probability.*

## 8. BRICS Federation & Privacy Model
The transboundary federation architecture demonstrates cross-border environmental intelligence sharing with strict privacy guarantees:
- **Simulated Federation Network**: The BRICS federation network is **simulated for demonstration**. India serves as the active prototype node, while Brazil, Russia, China, and South Africa nodes are simulated endpoints.
- **Zero Citizen PII**: Citizen names, phone numbers, contact details, free-text remarks, personal GPS coordinates, and uploaded photos are **never** shared across borders or included in federation payloads.
- **Coarse Regional Airshed Envelopes**: Shared records contain only coarse regional summaries (e.g., "Central Industrial Belt Airshed"), aggregate severity tiers, primary chemical species, and general downwind transport direction.
- **Sovereign Node Governance**: Each member state retains complete custody of local raw sensor streams, citizen submissions, and municipal records.

## 9. Synthetic & Demo Data Disclosure
- **Synthetic Monitoring & Scenarios**: All 12 monitoring zones, sensor metrics, satellite detection overlays, 24/48/72h forecast horizons, and cross-border scenario events (`VS-E001` at `VS-Z07`) are **deterministic synthetic demo data**.
- **Real User Inputs**: Real inputs are limited to user-uploaded images and form fields submitted through the Citizen Report interface during active sessions.
- **Plume Visualization**: The map plume display is a **simplified wind-based demo**, not an atmospheric dispersion model.
- **Exposure Estimates**: Population and facility exposure figures are **synthetic demo estimates** for scenario exploration, not verified public-health guidance.

## 10. Tech Stack
- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons, Vite
- **Backend**: Node.js, Express, esbuild
- **AI / Multimodal**: Google Gemini API via `@google/genai` (server-side proxy with fallback ladder)
- **Deployment**: Google Cloud Run, Secret Manager

---

## 11. Environment Variables

Define the following environment variables in `.env` (or pass via Cloud Run / Secret Manager):

| Variable | Required | Description |
| :--- | :--- | :--- |
| `GEMINI_API_KEY` | Optional / Recommended | Google Gemini API key for server-side visual image corroboration |
| `PORT` | Optional | HTTP port for the Express server (defaults to `3000`; dynamically assigned on Cloud Run) |
| `NODE_ENV` | Optional | Set to `production` in production deployment |

*(See `.env.example` for variable declarations).*

---

## 12. Local Setup & Commands

```bash
# 1. Install dependencies
npm install

# 2. Configure environment (optional: add GEMINI_API_KEY for live AI image analysis)
cp .env.example .env

# 3. Start unified full-stack dev server (Vite + Express on port 3000)
npm run dev

# 4. Type check / lint codebase
npx tsc --noEmit

# 5. Build production bundle (client assets + server CJS bundle)
npm run build

# 6. Start production server locally
npm start
```

---

## 13. Cloud Run Deployment

### Prerequisites
```bash
# Authenticate with Google Cloud
gcloud auth login
gcloud config set project YOUR_PROJECT_ID

# Enable required Google Cloud services
gcloud services enable \
  run.googleapis.com \
  secretmanager.googleapis.com \
  cloudbuild.googleapis.com
```

### Secret Management Bindings
```bash
# 1. Store API key in Secret Manager
gcloud secrets create GEMINI_API_KEY --replication-policy="automatic"
echo -n "YOUR_API_KEY" | gcloud secrets versions add GEMINI_API_KEY --data-file=-

# 2. Grant Cloud Run runtime service account access
gcloud secrets add-iam-policy-binding GEMINI_API_KEY \
  --member="serviceAccount:YOUR_PROJECT_NUMBER-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

### Cloud Run Deployment Command
```bash
# Deploy container to Cloud Run
gcloud run deploy vayu-setu-ai \
  --source . \
  --platform managed \
  --region asia-east1 \
  --allow-unauthenticated \
  --set-env-vars="NODE_ENV=production" \
  --set-secrets="GEMINI_API_KEY=GEMINI_API_KEY:latest"
```

### Verification Labeling
```bash
# Apply challenge verification label
gcloud run services update vayu-setu-ai \
  --update-labels=dev-tutorial=cloud-run-ai-challenge \
  --region=asia-east1
```

---

## 14. Current MVP Limitations
1. **Deterministic Synthetic Baseline**: Monitoring stations, baseline telemetry, and regional airshed readings are deterministic synthetic models rather than live sensor feeds.
2. **Simplified Plume Demonstration**: The plume layer is a simplified wind-direction geometric overlay, not a numerical atmospheric dispersion model.
3. **Prototype Forecast Logic**: The 24h, 48h, and 72h forecasts use deterministic synthetic projection logic rather than numerical weather prediction or chemical transport simulation.
4. **Synthetic Exposure Assessments**: Downwind population and infrastructure counts are synthetic estimates designed to demonstrate decision-support workflows, not calibrated epidemiological or public-health guidance.
5. **Simulated BRICS Federation**: Foreign nodes operate on a simulated exchange engine rather than live inter-governmental networks.
6. **Local Alert Dispatch State**: Incident lifecycle actions (Acknowledge, Escalate, Resolve) persist in the local operational browser session.

## 15. Future Roadmap
- **Live CAAQMS / Sensor Grid Ingestion**: Standardized MQTT/REST connectors for live environmental station feeds.
- **Satellite Data Ingestion**: Automated ingestion of daily atmospheric composition products (e.g., Sentinel-5P).
- **Advanced Dispersion Modeling**: Integration with validated atmospheric dispersion engines for complex terrain and weather dynamics.
- **Federated Node Network**: Inter-agency API protocols for authenticated, distributed cross-border airshed intelligence exchange.
- **Mobile Citizen App**: Lightweight offline-first citizen reporting with local exposure advisories.
