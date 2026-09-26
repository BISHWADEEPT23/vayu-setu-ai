# VAYU-SETU AI — Federated Air & Climate Intelligence for BRICS

**Collaborative Environmental Intelligence, Multi-Source Evidence Fusion & Privacy-Preserving Transboundary Airshed Coordination**

---

## 1. Problem Statement
Air pollution transcends municipal and national borders, yet environmental governance remains fragmented. Traditional monitoring relies on isolated ground stations with severe spatial coverage gaps, delayed reporting, and siloed data formats. Transboundary industrial plumes and seasonal fires routinely cross jurisdictions without coordinated early-warning mechanisms, while citizen reports lack automated corroboration and cross-border data sharing faces strict sovereignty and privacy barriers.

## 2. Solution
VAYU-SETU AI ("Air Bridge") is a federated climate intelligence platform that unites ground monitoring stations, satellite observations, meteorological forecasts, and citizen reports into a unified operational command system. By combining multi-source evidence fusion with privacy-preserving transboundary federation schemas, VAYU-SETU enables municipal and regional authorities to detect emerging pollution anomalies, forecast atmospheric dispersion, and coordinate mitigation actions across borders without compromising citizen privacy or national data sovereignty.

## 3. Key Features
- **Real-Time Operational Overview**: High-level KPIs, network status, active incident tracking (`VS-E001`), and critical hotspot alerts (`VS-Z07`).
- **Interactive Live Map**: Geospatial visualization across 12 monitoring zones with ground telemetry, satellite fire detection overlays, and real-time wind vector plumes.
- **Multi-Source Evidence Fusion**: Deterministic corroboration combining ground sensors (35%), satellite observations (25%), citizen reports (20%), and meteorological consistency (20%) into a weighted confidence index.
- **Multi-Horizon Atmospheric Dispersion Forecasting**: 24h, 48h, and 72h plume trajectory modeling based on meteorological wind vectors and atmospheric boundary-layer dynamics.
- **Population & Asset Exposure Intelligence**: Quantitative downwind impact assessments covering vulnerable demographics, healthcare facilities, schools, and transportation corridors.
- **Authority Command Centre**: Structured emergency dispatch workflows with operational intervention playbooks, inter-agency assignments, and local alert lifecycle management (Acknowledge, Escalate, Resolve).
- **BRICS Transboundary Federation (Simulated Demo)**: Sovereign node registry (India Active Prototype, Brazil, Russia, China, South Africa simulated) demonstrating privacy-scrubbed cross-border incident exchange.
- **Citizen Environmental Reporting & AI Visual Verification**: Structured citizen reporting with server-side multimodal visual corroboration.

## 4. Architecture
VAYU-SETU AI is built on a unified full-stack architecture running Node.js / Express with Vite middleware in development and a compiled CommonJS server serving static client bundles in production:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        React SPA Client (Vite + TS)                    │
│  - Shell Navigation       - LiveMap Geospatial     - Hotspots Fusion   │
│  - Command Centre View    - Forecast Trajectory    - BRICS Federation  │
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
│     @google/genai SDK Proxy       │    │     Synthetic Engine Data     │
│   (Server-Side API Key Only)      │    │  (12 Zones, Canonical Event, │
│  - Visual Image Feature Detection │    │   Deterministic Telemetry)    │
└───────────────────────────────────┘    └───────────────────────────────┘
```

## 5. End-to-End Data Flow & Information Taxonomy

To ensure scientific integrity and operational trust, VAYU-SETU explicitly categorizes all platform data:

| Taxonomy Category | Data Source & Flow | Representation in VAYU-SETU |
| :--- | :--- | :--- |
| **Observed Telemetry** | Fixed continuous ambient air quality monitoring stations (CAAQMS) | Calibrated microgram concentrations (PM2.5, PM10, NO2, SO2, CO, O3) and weather readings |
| **Citizen-Reported Data** | Citizen observation submissions via structured reporting interface | Unverified reports, observed odor/plume types, and uploaded scene photographs |
| **AI-Inferred Analysis** | Backend Gemini Vision model via `@google/genai` | Qualitative visual descriptors (plume type, density, visible ignition) and visual interpretation confidence |
| **Predicted Forecasts** | Atmospheric dispersion trajectory modeling | 24h/48h/72h forward dispersion horizons and downwind population exposure estimates |
| **Simulated Federation** | Synthetic cross-border node exchange | Coarse regional airshed payloads shared between simulated BRICS member nodes |

## 6. Gemini's Role & Strict Safety Boundaries
- **Qualitative Visual Assessment Only**: Gemini is utilized exclusively on the server side (`/api/analyze-image`) to extract qualitative features from citizen-submitted photographs (e.g., detecting visible black smoke, open field burning, or industrial stack emissions).
- **No Numerical Generation**: Gemini **never** invents, hallucinates, or generates numerical pollutant concentrations (e.g., PM2.5 in µg/m³) or atmospheric dispersion forecasts. All quantitative values are derived strictly from calibrated telemetry sensors and atmospheric physics models.
- **Visual Confidence vs. Event Probability**: Gemini's `visualConfidence` score indicates only how clearly visible features match visual categories in the photograph. It is **never** presented as an environmental violation probability or ground-truth pollution measurement.

## 7. Evidence Fusion Methodology
Rather than relying on single-point sensors or unverified citizen reports, VAYU-SETU calculates an Evidence Fusion Score:

$$\text{Fusion Score} = w_{\text{sensor}} \cdot S_{\text{sensor}} + w_{\text{sat}} \cdot S_{\text{sat}} + w_{\text{citizen}} \cdot S_{\text{citizen}} + w_{\text{met}} \cdot S_{\text{met}}$$

- **Ground Sensors ($w = 0.35$)**: Multi-pollutant threshold exceedance ($> 200\ \mu\text{g/m}^3\ \text{PM2.5}$).
- **Satellite Detections ($w = 0.25$)**: Optical depth and thermal anomaly confirmation (e.g., Sentinel-5P / INSAT-3DR).
- **Citizen Reports ($w = 0.20$)**: Clustered, corroborated citizen reports in the affected grid within 6 hours.
- **Meteorological Consistency ($w = 0.20$)**: Stability index, wind alignment, and temperature inversion trapping.

A composite score above 75% triggers an automated **HIGH CORROBORATION** classification, escalating the incident to the Command Centre.

## 8. BRICS Federation & Privacy-Preserving Model
The cross-border federation architecture is designed for transboundary airshed governance without privacy or sovereignty compromises:
- **Zero Citizen PII**: Citizen identities, phone numbers, free-text remarks, personal coordinates, and uploaded photos are **never** shared across borders or federated.
- **Aggregated Airshed Envelopes**: Federation packets contain only high-level regional boundaries (e.g., "Central Industrial Belt Airshed"), composite severity tiers, dominant chemical species, and downwind dispersion vectors.
- **Sovereign Node Governance**: Each member state retains complete data custody. Nodes exchange standardized, cryptographically signed JSON telemetry summaries.
- **Simulated Prototype Disclosure**: In this release, the India node functions as the active prototype, while Brazil, Russia, China, and South Africa nodes are **simulated for demonstration purposes**.

## 9. Synthetic & Demo Data Disclosure
All sensor readings, monitoring zone coordinates, citizen submissions, satellite detection overlays, and multinational federation events displayed in the user interface are **synthetic demo data** calibrated to realistic atmospheric thresholds. They are designed to showcase operational coordination workflows and do not reflect real-time active environmental hazards.

## 10. Tech Stack
- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons, Vite
- **Backend**: Node.js, Express, tsx, esbuild
- **AI / Multimodal**: Google Gemini API via `@google/genai` (server-side proxy with fallback ladder)
- **Deployment**: Google Cloud Run, Secret Manager, Cloud Firestore

---

## 11. Environment Variables

Define the following environment variables in `.env` (or pass via Cloud Run / Secret Manager):

| Variable | Required | Description |
| :--- | :--- | :--- |
| `GEMINI_API_KEY` | Optional / Recommended | Google Gemini API key for server-side visual image corroboration |
| `PORT` | Optional | HTTP port for the Express server (defaults to `3000`; Cloud Run supplies dynamic port) |
| `NODE_ENV` | Optional | Set to `production` in production deployment |

*(See `.env.example` for variable declarations).*

---

## 12. Local Setup & Commands

```bash
# 1. Install dependencies
npm install

# 2. Configure environment (optional: add GEMINI_API_KEY for real AI image analysis)
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

## 13. Cloud Run Deployment & Security Configuration

### Prerequisites
```bash
# Authenticate with Google Cloud
gcloud auth login
gcloud config set project YOUR_PROJECT_ID

# Enable required Google Cloud services
gcloud services enable \
  run.googleapis.com \
  secretmanager.googleapis.com \
  firestore.googleapis.com \
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

### Database Security Configuration (Cloud Firestore)
When persisting user accounts or report interactions, enforce user-bound isolation in `firestore.rules`:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/interactions/{interactionId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
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

### Mandatory Verification Labeling
```bash
# Apply campaign tracking label for automated challenge verification
gcloud run services update vayu-setu-ai \
  --update-labels=dev-tutorial=cloud-run-ai-challenge \
  --region=asia-east1
```

---

## 14. Current MVP Limitations
1. **Synthetic Telemetry Baseline**: Current monitoring stations and regional airshed readings are pre-calibrated synthetic models rather than live IoT feeds.
2. **Simulated Node Network**: Foreign BRICS nodes operate on deterministic simulation engines rather than live inter-governmental REST/gRPC gateways.
3. **Plume Dispersion Geometry**: Trajectory plumes use analytical Gaussian dispersion approximations rather than high-order numerical Weather Research and Forecasting with Chemistry (WRF-Chem) supercomputer models.
4. **Local Alert Dispatch State**: Alert status changes (Acknowledge, Escalate, Resolve) persist in the local operational session.

## 15. Future Roadmap
- **Live CAAQMS / CPCB IoT Integration**: Real-time MQTT/REST ingestion from national central pollution control board sensor grids.
- **Direct Sentinel-5P Level 2 Data Pipeline**: Automated daily satellite swath processing via Google Earth Engine.
- **Secure Multi-Party Computation (SMPC)**: Cryptographic differential privacy and zero-knowledge proofs for transboundary chemical transport attribution.
- **Mobile Citizen Progressive Web App (PWA)**: Offline-first localized push notifications for vulnerable populations in downwind dispersion zones.
