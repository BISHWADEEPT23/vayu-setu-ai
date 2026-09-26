/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Globe,
  Radio,
  ArrowDown,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  TrendingDown,
  Wind,
  FileCheck,
  Server,
  Layers,
  Lock,
} from 'lucide-react';
import { VS_E001_EVIDENCE_ASSESSMENTS } from '../data/synthetic/evidenceAssessments.ts';
import { calculateEvidenceFusion } from '../domain/evidenceFusion.ts';

export type ScenarioFlowStatus = 'LOCAL' | 'FEDERATION ELIGIBLE' | 'SHARED' | 'RECEIVED';

const STATUS_STAGES: ScenarioFlowStatus[] = [
  'LOCAL',
  'FEDERATION ELIGIBLE',
  'SHARED',
  'RECEIVED',
];

export function CrossBorderScenarioPanel(): React.JSX.Element {
  const fusionResult = calculateEvidenceFusion(VS_E001_EVIDENCE_ASSESSMENTS);
  const [activeStatus, setActiveStatus] = useState<ScenarioFlowStatus>('RECEIVED');

  const currentStageIndex = STATUS_STAGES.indexOf(activeStatus);

  // Deterministic alert payload specification
  const federationAlert = {
    eventId: 'VS-E001',
    originCountry: 'India',
    coarseRegion: 'Central Industrial Belt (Economic Freight & Transit Corridor)',
    severity: 'CRITICAL',
    pollutantIndicators: 'AQI: 342 (Hazardous) | PM2.5: 248.5 µg/m³ | PM10: 385.0 µg/m³',
    evidenceConfidence: `${(fusionResult.score * 100).toFixed(1)}% (Status: ${fusionResult.status.toUpperCase()})`,
    forecastHorizon: '24h / 48h / 72h Multi-Tier Dispersion',
    trajectory: 'Southeast (SE, ~135°) downwind drift along primary economic logistics spine (wind NW @ 18.5 km/h)',
    crossRegionRisk: 'High Trans-Corridor Airshed Impact — boundary plume crossing into downwind logistics hubs',
    issuedTime: '2026-09-20 00:20:00 UTC',
  };

  const receivingNodes = [
    { country: 'China', code: 'CN', status: 'ACKNOWLEDGED', syncTime: '00:20:14 UTC' },
    { country: 'Russia', code: 'RU', status: 'ACKNOWLEDGED', syncTime: '00:20:18 UTC' },
    { country: 'South Africa', code: 'ZA', status: 'ACKNOWLEDGED', syncTime: '00:20:22 UTC' },
    { country: 'Brazil', code: 'BR', status: 'ACKNOWLEDGED', syncTime: '00:20:30 UTC' },
  ];

  return (
    <div className="rounded-xl border border-purple-500/40 bg-slate-900/90 p-5 shadow-xl space-y-6">
      {/* Scenario Header & Disclaimers */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded text-xs font-bold tracking-wider uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
              DEMO • SYNTHETIC DATA
            </span>
            <span className="px-2.5 py-0.5 rounded text-xs font-bold tracking-wider uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30">
              SIMULATED CROSS-BORDER SCENARIO
            </span>
            <span className="text-xs font-mono text-slate-400">VS-E001 Transboundary Dispersion</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">
            Cross-Region Economic Corridor Risk Simulation
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Demonstrates deterministic synthetic telemetry exchange from India host node into simulated BRICS registry.
          </p>
        </div>

        {/* Disclaimer Pill */}
        <div className="text-[11px] text-amber-300/90 bg-amber-950/30 border border-amber-500/30 p-2.5 rounded-lg max-w-md">
          ⚠️ <span className="font-semibold">Notice:</span> Do not claim real transboundary forecasting. Plume vector is a simulated demo based on surface wind, not atmospheric-dispersion chemical transport modeling.
        </div>
      </div>

      {/* Interactive Status Stepper: LOCAL → FEDERATION ELIGIBLE → SHARED → RECEIVED */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold uppercase tracking-wider text-slate-400">
            Scenario Transmission Lifecycle:
          </span>
          <span className="font-mono text-cyan-400 font-bold">
            Status: {activeStatus}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {STATUS_STAGES.map((stage, idx) => {
            const isCurrent = stage === activeStatus;
            const isCompleted = idx <= currentStageIndex;

            return (
              <button
                key={stage}
                type="button"
                onClick={() => setActiveStatus(stage)}
                className={`p-3 rounded-lg border text-left transition-all ${
                  isCurrent
                    ? 'bg-purple-500/20 border-purple-500 text-purple-200 ring-2 ring-purple-500/40 shadow-lg'
                    : isCompleted
                      ? 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-slate-600'
                      : 'bg-slate-950/50 border-slate-800 text-slate-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-500 uppercase">Stage {idx + 1}</span>
                  {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />}
                </div>
                <div className="text-xs font-bold font-mono tracking-wider mt-1">{stage}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 7-Step Sequential Pipeline Flow:
          INDIA NODE → VS-E001 DETECTED → EVIDENCE CONFIDENCE → FORECAST TRAJECTORY →
          CROSS-REGION RISK DETECTED → FEDERATION ALERT GENERATED → SIMULATED RECEIVING BRICS NODE
      */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <Layers className="w-4 h-4 text-purple-400" />
          End-to-End Cross-Border Signal Propagation Chain
        </h3>

        <div className="space-y-2">
          {/* Step 1: India Node */}
          <div className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800 flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
              1
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white flex items-center gap-1.5">
                  <span>🇮🇳</span> INDIA NODE
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  ORIGIN HOST
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Central environmental observation node for Indo-Gangetic & Central Industrial airsheds.
              </p>
            </div>
          </div>

          <div className="flex justify-center -my-1 text-slate-600">
            <ArrowDown className="w-4 h-4 text-purple-400/60" />
          </div>

          {/* Step 2: VS-E001 Detected */}
          <div className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800 flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-rose-500/20 text-rose-400 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
              2
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white">VS-E001 DETECTED</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  CRITICAL SEVERITY
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Triggered at VS-Z07 (Heavy Smelter Complex). AQI 342, PM2.5: 248.5 µg/m³, PM10: 385.0 µg/m³.
              </p>
            </div>
          </div>

          <div className="flex justify-center -my-1 text-slate-600">
            <ArrowDown className="w-4 h-4 text-purple-400/60" />
          </div>

          {/* Step 3: Evidence Confidence */}
          <div className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800 flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-cyan-500/20 text-cyan-400 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
              3
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white">EVIDENCE CONFIDENCE</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {(fusionResult.score * 100).toFixed(1)}% HIGH
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Cross-corroboration verified across ground stations, citizen observations, and satellite spectral readings.
              </p>
            </div>
          </div>

          <div className="flex justify-center -my-1 text-slate-600">
            <ArrowDown className="w-4 h-4 text-purple-400/60" />
          </div>

          {/* Step 4: Forecast Trajectory */}
          <div className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800 flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-orange-500/20 text-orange-400 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
              4
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white">FORECAST TRAJECTORY</span>
                <span className="text-xs font-mono text-cyan-400">Wind NW @ 18.5 km/h</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                24h: AQI 295 (Critical) | 48h: AQI 235 (High) | 72h: AQI 168 (Moderate). Plume drifting Southeast (~135°).
              </p>
            </div>
          </div>

          <div className="flex justify-center -my-1 text-slate-600">
            <ArrowDown className="w-4 h-4 text-purple-400/60" />
          </div>

          {/* Step 5: Cross-Region Risk Detected */}
          <div className="p-3.5 rounded-lg bg-slate-950/70 border border-amber-500/30 flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-400 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
              5
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-amber-300">CROSS-REGION RISK DETECTED</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  CORRIDOR BOUNDARY IMPACT
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Atmospheric drift threatens Downwind Logistics Corridor and regional freight transport arteries.
              </p>
            </div>
          </div>

          <div className="flex justify-center -my-1 text-slate-600">
            <ArrowDown className="w-4 h-4 text-purple-400/60" />
          </div>

          {/* Step 6: Federation Alert Generated */}
          <div className="p-3.5 rounded-lg bg-slate-950/70 border border-cyan-500/40 flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-cyan-500/20 text-cyan-400 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
              6
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white">FEDERATION ALERT GENERATED</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  ZERO-PII SCHEMA
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Privacy sanitization scrubs citizen identity, phone, address, and raw media before broadcasting.
              </p>
            </div>
          </div>

          <div className="flex justify-center -my-1 text-slate-600">
            <ArrowDown className="w-4 h-4 text-purple-400/60" />
          </div>

          {/* Step 7: Simulated Receiving BRICS Node */}
          <div className="p-3.5 rounded-lg bg-slate-950/70 border border-purple-500/40 flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-purple-500/20 text-purple-400 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
              7
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-purple-300">SIMULATED RECEIVING BRICS NODE</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  MULTI-NODE REGISTRY SYNC
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
                {receivingNodes.map((rn) => (
                  <div key={rn.country} className="p-2 rounded bg-slate-900 border border-slate-800 text-xs">
                    <div className="font-semibold text-white">{rn.country} ({rn.code})</div>
                    <div className="text-[10px] text-emerald-400 font-mono mt-0.5">✓ {rn.status}</div>
                    <div className="text-[9px] text-slate-500 font-mono">{rn.syncTime}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Federation Alert Payload Card */}
      <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200">
              Standardized Federation Alert Payload
            </h3>
          </div>
          <span className="text-xs font-mono text-purple-300 bg-purple-950/40 px-2 py-0.5 rounded border border-purple-800/40">
            BRICS-FedSchema-v1.2
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800/80">
            <span className="text-slate-400 uppercase font-mono text-[10px]">Event ID:</span>
            <div className="font-mono font-bold text-cyan-400 text-sm mt-0.5">{federationAlert.eventId}</div>
          </div>

          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800/80">
            <span className="text-slate-400 uppercase font-mono text-[10px]">Origin Country:</span>
            <div className="font-mono font-bold text-white text-sm mt-0.5">{federationAlert.originCountry} (India)</div>
          </div>

          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800/80 md:col-span-2">
            <span className="text-slate-400 uppercase font-mono text-[10px]">Coarse Region:</span>
            <div className="font-semibold text-white mt-0.5">{federationAlert.coarseRegion}</div>
          </div>

          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800/80">
            <span className="text-slate-400 uppercase font-mono text-[10px]">Severity:</span>
            <div className="font-mono font-bold text-rose-400 text-sm mt-0.5">{federationAlert.severity}</div>
          </div>

          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800/80">
            <span className="text-slate-400 uppercase font-mono text-[10px]">Evidence Confidence:</span>
            <div className="font-mono font-bold text-cyan-300 text-sm mt-0.5">{federationAlert.evidenceConfidence}</div>
          </div>

          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800/80 md:col-span-2">
            <span className="text-slate-400 uppercase font-mono text-[10px]">Pollutant Indicators:</span>
            <div className="font-mono text-slate-200 mt-0.5">{federationAlert.pollutantIndicators}</div>
          </div>

          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800/80">
            <span className="text-slate-400 uppercase font-mono text-[10px]">Forecast Horizon:</span>
            <div className="font-mono text-slate-200 mt-0.5">{federationAlert.forecastHorizon}</div>
          </div>

          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800/80">
            <span className="text-slate-400 uppercase font-mono text-[10px]">Issued Time:</span>
            <div className="font-mono text-slate-200 mt-0.5">{federationAlert.issuedTime}</div>
          </div>

          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800/80 md:col-span-2">
            <span className="text-slate-400 uppercase font-mono text-[10px]">Trajectory:</span>
            <div className="font-mono text-cyan-300 mt-0.5">{federationAlert.trajectory}</div>
          </div>

          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800/80 md:col-span-2">
            <span className="text-slate-400 uppercase font-mono text-[10px]">Cross-Region Risk:</span>
            <div className="font-semibold text-amber-300 mt-0.5">{federationAlert.crossRegionRisk}</div>
          </div>
        </div>

        {/* Privacy verification notice */}
        <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2">
          <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Zero-PII Compliance Verified: No citizen identity, contact information, private locations, or raw images are shared across the federation boundary.</span>
        </div>
      </div>
    </div>
  );
}
