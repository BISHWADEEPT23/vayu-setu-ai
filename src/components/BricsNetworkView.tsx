/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Globe2,
  Server,
  ShieldCheck,
  CheckCircle2,
  Activity,
  ArrowRight,
  EyeOff,
  Lock,
  Radio,
  FileCheck,
  AlertTriangle,
  RefreshCw,
  Layers,
  Network,
} from 'lucide-react';
import { VS_E001_EVIDENCE_ASSESSMENTS } from '../data/synthetic/evidenceAssessments.ts';
import { calculateEvidenceFusion } from '../domain/evidenceFusion.ts';
import { CrossBorderScenarioPanel } from './CrossBorderScenarioPanel.tsx';

interface BricsNode {
  country: string;
  code: string;
  flag: string;
  nodeStatus: 'ACTIVE PROTOTYPE NODE' | 'SIMULATED DEMO NODE';
  connectionState: 'Connected' | 'Synchronized';
  activeEventsCount: number;
  sharedRiskSignals: number;
  lastSync: string;
  focusArea: string;
}

const BRICS_NODES: BricsNode[] = [
  {
    country: 'India',
    code: 'IN',
    flag: '🇮🇳',
    nodeStatus: 'ACTIVE PROTOTYPE NODE',
    connectionState: 'Connected',
    activeEventsCount: 2,
    sharedRiskSignals: 5,
    lastSync: '2026-09-20 00:20:00 UTC (Current)',
    focusArea: 'Indo-Gangetic Airshed & Central Industrial Belt',
  },
  {
    country: 'Brazil',
    code: 'BR',
    flag: '🇧🇷',
    nodeStatus: 'SIMULATED DEMO NODE',
    connectionState: 'Synchronized',
    activeEventsCount: 3,
    sharedRiskSignals: 4,
    lastSync: '2026-09-20 00:15:00 UTC',
    focusArea: 'Amazonian Biomass & São Paulo Basin Corridor',
  },
  {
    country: 'Russia',
    code: 'RU',
    flag: '🇷🇺',
    nodeStatus: 'SIMULATED DEMO NODE',
    connectionState: 'Synchronized',
    activeEventsCount: 2,
    sharedRiskSignals: 3,
    lastSync: '2026-09-20 00:12:00 UTC',
    focusArea: 'Boreal Wildfire Aerosols & Ural Industrial Corridor',
  },
  {
    country: 'China',
    code: 'CN',
    flag: '🇨🇳',
    nodeStatus: 'SIMULATED DEMO NODE',
    connectionState: 'Synchronized',
    activeEventsCount: 4,
    sharedRiskSignals: 6,
    lastSync: '2026-09-20 00:18:00 UTC',
    focusArea: 'Fenwei Plains & Beijing-Tianjin-Hebei Airshed',
  },
  {
    country: 'South Africa',
    code: 'ZA',
    flag: '🇿🇦',
    nodeStatus: 'SIMULATED DEMO NODE',
    connectionState: 'Synchronized',
    activeEventsCount: 2,
    sharedRiskSignals: 2,
    lastSync: '2026-09-20 00:08:00 UTC',
    focusArea: 'Highveld Industrial Plateau & Mpumalanga Belt',
  },
];

export function BricsNetworkView(): React.JSX.Element {
  const fusionResult = calculateEvidenceFusion(VS_E001_EVIDENCE_ASSESSMENTS);
  const [selectedNode, setSelectedNode] = useState<string>('India');

  // Standardized federation payload derived strictly from VS-E001
  const federationPayload = {
    eventId: 'VS-E001',
    country: 'India',
    coarseRegion: 'Central Industrial Belt (Aggregated Airshed Zone)',
    pollutantIndicators: {
      aqiCategory: 'Hazardous (342)',
      pm25Level: '248.5 µg/m³ (Severe Alert Tier)',
      pm10Level: '385.0 µg/m³ (Severe Alert Tier)',
    },
    severity: 'CRITICAL',
    evidenceConfidence: `${(fusionResult.score * 100).toFixed(1)}% (${fusionResult.status.toUpperCase()})`,
    forecastTrajectory: '24h: AQI 295 (Critical) | 48h: AQI 235 (High) | 72h: AQI 168 (Moderate); Plume downwind SE',
    crossRegionRisk: 'Elevated — Surface boundary plume drifting towards Downwind Logistics Corridor',
    metadata: {
      schemaVersion: 'BRICS-FedEnv-Schema/v1.2',
      modelDigest: 'FusionCore-Deterministic-SHA256:7f9a2b',
      timestampUtc: '2026-09-20T00:20:00Z',
      anonymizationTier: 'STRICT_DIFFERENTIAL_PRIVACY_AGGREGATED',
    },
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Federation Prototype & Simulated Network */}
      <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/20 p-4 sm:p-5 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-3 w-3 rounded-full bg-cyan-400 animate-ping" />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  DEMO • SYNTHETIC DATA
                </span>
                <span className="text-xs font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  FEDERATION PROTOTYPE
                </span>
                <span className="text-xs font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  SIMULATED NETWORK
                </span>
              </div>
              <h1 className="text-xl font-bold text-white mt-1">
                BRICS Climate Federation — Multi-Node Environmental Exchange
              </h1>
            </div>
          </div>
          <div className="text-xs text-slate-400 max-w-sm text-left sm:text-right">
            Privacy-preserving environmental intelligence protocol for cross-border airshed monitoring.
          </div>
        </div>
      </div>

      {/* Federation Flow Visualization: INDIA NODE → STANDARDIZED EVENT → BRICS FEDERATION */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Network className="w-4 h-4 text-cyan-400" />
            Federation Pipeline: Privacy-Preserving Transboundary Flow
          </h2>
          <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/40">
            Zero PII Broadcast Guarantee
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
          {/* Step 1: India Node */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-emerald-500/40 relative space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-mono text-emerald-400 uppercase tracking-wider">
                Stage 1
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                ACTIVE PROTOTYPE
              </span>
            </div>
            <div className="text-base font-bold text-white flex items-center gap-2">
              <span>🇮🇳</span> INDIA NODE
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Local telemetry ingestion, multi-source evidence fusion (85.1%), and local emergency dispatch evaluation.
            </p>
            <div className="pt-2 border-t border-slate-800/80 text-[11px] text-emerald-400 flex items-center gap-1.5 font-mono">
              <ShieldCheck className="w-3.5 h-3.5" /> Privacy Sanitization Gate Engaged
            </div>
          </div>

          {/* Arrow Step 1 -> 2 (Desktop only) */}
          <div className="hidden md:flex absolute left-1/3 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 w-8 h-8 rounded-full bg-slate-800 border border-cyan-500/50 items-center justify-center text-cyan-400 shadow-md">
            <ArrowRight className="w-4 h-4" />
          </div>

          {/* Step 2: Standardized Event */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-cyan-500/40 relative space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-mono text-cyan-400 uppercase tracking-wider">
                Stage 2
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                SCHEMA CONFORMANT
              </span>
            </div>
            <div className="text-base font-bold text-white flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-cyan-400" /> STANDARDIZED EVENT
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Transformation into coarse-region telemetry payload. Raw citizen identities, addresses, and images are strictly scrubbed.
            </p>
            <div className="pt-2 border-t border-slate-800/80 text-[11px] text-cyan-300 flex items-center gap-1.5 font-mono">
              <Lock className="w-3.5 h-3.5" /> Schema: BRICS-FedEnv-Schema/v1.2
            </div>
          </div>

          {/* Arrow Step 2 -> 3 (Desktop only) */}
          <div className="hidden md:flex absolute left-2/3 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 w-8 h-8 rounded-full bg-slate-800 border border-cyan-500/50 items-center justify-center text-cyan-400 shadow-md">
            <ArrowRight className="w-4 h-4" />
          </div>

          {/* Step 3: BRICS Federation */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-purple-500/40 relative space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-mono text-purple-400 uppercase tracking-wider">
                Stage 3
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                SIMULATED REGISTRY
              </span>
            </div>
            <div className="text-base font-bold text-white flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-purple-400" /> BRICS FEDERATION
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Shared environmental risk signal accessible by Brazil, Russia, China, and South Africa peer nodes for cross-boundary modeling.
            </p>
            <div className="pt-2 border-t border-slate-800/80 text-[11px] text-purple-300 flex items-center gap-1.5 font-mono">
              <RefreshCw className="w-3.5 h-3.5" /> 5 of 5 Nodes In Synchronization
            </div>
          </div>
        </div>
      </div>

      {/* 5 Federation Nodes Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Server className="w-4 h-4 text-cyan-400" />
            Federation Node Registry (5 Member States)
          </h2>
          <span className="text-xs text-slate-400">
            Click node card to review operational attributes
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {BRICS_NODES.map((node) => {
            const isIndia = node.country === 'India';
            const isSelected = selectedNode === node.country;

            return (
              <button
                key={node.country}
                type="button"
                onClick={() => setSelectedNode(node.country)}
                className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden ${
                  isSelected
                    ? 'bg-slate-800/90 border-cyan-500/70 shadow-lg ring-1 ring-cyan-500/40'
                    : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{node.flag}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold tracking-tight border ${
                      isIndia
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {isIndia ? 'ACTIVE PROTOTYPE' : 'SIMULATED DEMO'}
                  </span>
                </div>

                <div className="text-base font-bold text-white">{node.country}</div>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5 truncate">
                  {node.focusArea}
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-800/80 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Events:</span>
                    <strong className="text-white font-mono">{node.activeEventsCount} active</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Risk Signals:</span>
                    <strong className="text-cyan-400 font-mono">{node.sharedRiskSignals} shared</strong>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono truncate pt-1">
                    Sync: {node.lastSync}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Shared Synthetic Federation Event: VS-E001 Standardized Payload */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                STANDARDIZED FEDERATION PAYLOAD
              </span>
              <span className="text-xs font-mono text-slate-400">Derived from VS-E001</span>
            </div>
            <h3 className="text-lg font-bold text-white mt-1">
              Transboundary Risk Signal Broadcast (India → BRICS)
            </h3>
          </div>
          <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 self-start sm:self-center">
            SEVERITY: CRITICAL
          </span>
        </div>

        {/* Payload Grid: Shared Attributes Only */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800 space-y-1">
              <div className="text-[11px] uppercase font-semibold text-slate-400 font-mono">Event Identification</div>
              <div className="text-sm font-bold text-white flex items-center justify-between">
                <span>Event ID: <strong className="text-cyan-400 font-mono">{federationPayload.eventId}</strong></span>
                <span>Country: <strong className="text-white font-mono">{federationPayload.country}</strong></span>
              </div>
              <div className="text-xs text-slate-300 pt-1">
                Coarse Region: <span className="font-semibold text-white">{federationPayload.coarseRegion}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800 space-y-1">
              <div className="text-[11px] uppercase font-semibold text-slate-400 font-mono">Pollutant Indicators</div>
              <div className="grid grid-cols-3 gap-2 pt-1">
                <div className="p-2 rounded bg-slate-900 border border-slate-800 text-center">
                  <div className="text-[10px] text-slate-400">AQI</div>
                  <div className="text-sm font-bold font-mono text-rose-400">342</div>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800 text-center">
                  <div className="text-[10px] text-slate-400">PM2.5</div>
                  <div className="text-sm font-bold font-mono text-white">248.5 µg/m³</div>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800 text-center">
                  <div className="text-[10px] text-slate-400">PM10</div>
                  <div className="text-sm font-bold font-mono text-white">385.0 µg/m³</div>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800 space-y-1">
              <div className="text-[11px] uppercase font-semibold text-slate-400 font-mono">Evidence Confidence</div>
              <div className="text-lg font-bold font-mono text-cyan-300">
                {federationPayload.evidenceConfidence}
              </div>
              <div className="text-[11px] text-slate-400">
                Deterministic multi-source evidence fusion corroboration score.
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800 space-y-1">
              <div className="text-[11px] uppercase font-semibold text-slate-400 font-mono">Forecast Trajectory</div>
              <div className="text-xs font-mono text-white leading-relaxed">
                {federationPayload.forecastTrajectory}
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800 space-y-1">
              <div className="text-[11px] uppercase font-semibold text-slate-400 font-mono">Cross-Region Risk Assessment</div>
              <div className="text-xs text-amber-300 leading-relaxed font-semibold">
                {federationPayload.crossRegionRisk}
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800 space-y-1">
              <div className="text-[11px] uppercase font-semibold text-slate-400 font-mono">Model / Version Metadata</div>
              <div className="text-[11px] font-mono text-slate-300 space-y-0.5">
                <div>Schema: <span className="text-cyan-400">{federationPayload.metadata.schemaVersion}</span></div>
                <div>Digest: <span className="text-slate-400">{federationPayload.metadata.modelDigest}</span></div>
                <div>Ingest: <span className="text-slate-400">{federationPayload.metadata.timestampUtc}</span></div>
                <div>Privacy Tier: <span className="text-emerald-400">{federationPayload.metadata.anonymizationTier}</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* Privacy & Anti-Leakage Boundary Card */}
        <div className="p-4 rounded-xl bg-slate-950/90 border border-emerald-500/30 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
            <EyeOff className="w-4 h-4 text-emerald-400" />
            Strict Privacy Guarantees — Data Excluded From Federation Broadcast
          </div>
          <p className="text-xs text-slate-400">
            In compliance with sovereign data governance and citizen privacy standards, the following attributes are stripped prior to federation:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 text-xs">
            <div className="flex items-center gap-2 p-2 rounded bg-slate-900 border border-slate-800/80 text-rose-300/90">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              <span>❌ Citizen identity</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded bg-slate-900 border border-slate-800/80 text-rose-300/90">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              <span>❌ Citizen images / photos</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded bg-slate-900 border border-slate-800/80 text-rose-300/90">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              <span>❌ Free-text descriptions</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded bg-slate-900 border border-slate-800/80 text-rose-300/90">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              <span>❌ Contact details (email/phone)</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded bg-slate-900 border border-slate-800/80 text-rose-300/90">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              <span>❌ Exact personal location</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded bg-slate-900 border border-slate-800/80 text-rose-300/90">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              <span>❌ Raw private observations</span>
            </div>
          </div>
        </div>
      </div>

      {/* Deterministic Synthetic Cross-Border Scenario */}
      <CrossBorderScenarioPanel />
    </div>
  );
}
