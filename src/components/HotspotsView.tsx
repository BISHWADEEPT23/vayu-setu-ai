/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import {
  AlertOctagon,
  Activity,
  Satellite,
  Wind,
  Users,
  Radio,
  CheckCircle2,
  Clock,
  MapPin,
  Flame,
  ShieldAlert,
  Info,
  Layers,
  Sparkles,
} from 'lucide-react';
import { getCanonicalPollutionEvent, getCanonicalCriticalZone } from '../data/selectors.ts';
import { SYNTHETIC_MONITORING_ZONES } from '../data/synthetic/monitoringZones.ts';
import { VS_E001_EVIDENCE_ASSESSMENTS } from '../data/synthetic/evidenceAssessments.ts';
import {
  calculateEvidenceFusion,
  EvidenceAssessment,
  EvidenceSource,
} from '../domain/evidenceFusion.ts';

const SOURCE_META: Record<
  EvidenceSource,
  {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    accentColor: string;
    description: string;
  }
> = {
  'citizen-report': {
    label: 'Citizen Report',
    icon: Users,
    accentColor: 'text-indigo-600 bg-indigo-50 border-indigo-200',
    description: '14 clustered citizen report signals within 3km radius reporting heavy plumes and sulfurous odors.',
  },
  'ground-sensor': {
    label: 'Ground Sensor',
    icon: Activity,
    accentColor: 'text-rose-600 bg-rose-50 border-rose-200',
    description: 'In-situ continuous optical particulate monitor and sulfur dioxide electrochemical sensor.',
  },
  'satellite': {
    label: 'Satellite',
    icon: Satellite,
    accentColor: 'text-cyan-600 bg-cyan-50 border-cyan-200',
    description: 'Multi-spectral orbital radiometer detection of thermal anomalies and high optical depth.',
  },
  'meteorology': {
    label: 'Meteorology',
    icon: Wind,
    accentColor: 'text-teal-600 bg-teal-50 border-teal-200',
    description: 'Boundary layer wind vectors and atmospheric stability models tracking downwind transport.',
  },
  'ai-image': {
    label: 'AI Image Analysis',
    icon: Radio,
    accentColor: 'text-violet-600 bg-violet-50 border-violet-200',
    description: 'Computer vision analysis of uploaded field evidence photos.',
  },
};

export const HotspotsView: React.FC = () => {
  const canonicalEvent = useMemo(() => getCanonicalPollutionEvent(), []);
  const canonicalZone = useMemo(() => getCanonicalCriticalZone(), []);

  // Compute deterministic evidence fusion result
  const fusionResult = useMemo(() => {
    return calculateEvidenceFusion(VS_E001_EVIDENCE_ASSESSMENTS);
  }, []);

  // Secondary anomaly zones (watch / warning)
  const secondaryHotspots = useMemo(() => {
    return SYNTHETIC_MONITORING_ZONES.filter(
      (z) => z.id !== 'VS-Z07' && (z.status === 'warning' || z.status === 'watch')
    );
  }, []);

  const eventTimestampFormatted = useMemo(() => {
    if (!canonicalEvent?.timestamp) return '2026-09-20 00:20:00 UTC';
    try {
      const d = new Date(canonicalEvent.timestamp);
      return `${d.toISOString().replace('T', ' ').slice(0, 19)} UTC`;
    } catch {
      return canonicalEvent.timestamp;
    }
  }, [canonicalEvent]);

  // Order sources: Citizen Report, Ground Sensor, Satellite, Meteorology
  const orderedSources: EvidenceSource[] = [
    'citizen-report',
    'ground-sensor',
    'satellite',
    'meteorology',
  ];

  const assessmentMap = useMemo(() => {
    const map = new Map<EvidenceSource, EvidenceAssessment>();
    for (const a of VS_E001_EVIDENCE_ASSESSMENTS) {
      map.set(a.source, a);
    }
    return map;
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Banner: Synthetic Data Disclaimer */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-amber-300/80 bg-amber-50/70 p-4 sm:p-5 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-800 border border-amber-300">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400 bg-amber-200/60 px-2.5 py-0.5 text-xs font-mono font-bold uppercase tracking-wider text-amber-950">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-700 animate-pulse" />
                DEMO • SYNTHETIC DATA
              </span>
              <span className="text-xs font-medium text-amber-900">
                Deterministic Fusion Simulation
              </span>
            </div>
            <p className="mt-1 text-xs sm:text-sm text-amber-900/90 leading-relaxed">
              All telemetry, anomalies, and multi-source evidence assessments on this page are
              simulated illustrative values for testing multi-source fusion algorithms.
            </p>
          </div>
        </div>
      </div>

      {/* Primary Critical Hotspot Hero Panel */}
      <section
        aria-labelledby="primary-hotspot-heading"
        className="rounded-xl border border-rose-200 bg-white p-5 sm:p-8 shadow-xs"
      >
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 rounded-md border border-rose-300 bg-rose-50 px-2.5 py-1 text-xs font-mono font-bold text-rose-800">
                <span className="h-2 w-2 rounded-full bg-rose-600 animate-ping" />
                PRIMARY CRITICAL HOTSPOT
              </span>
              <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-mono font-semibold text-slate-800">
                {canonicalEvent?.eventId ?? 'VS-E001'}
              </span>
              <span className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-mono font-semibold text-slate-700">
                {canonicalZone?.id ?? 'VS-Z07'}
              </span>
            </div>
            <h2
              id="primary-hotspot-heading"
              className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900"
            >
              {canonicalZone?.name ?? 'Heavy Smelter & Refinery Complex'}
            </h2>
            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-600">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-slate-400" />
                Region: <strong className="font-semibold text-slate-800">{canonicalZone?.region ?? 'Central Industrial Belt'}</strong>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-slate-400" />
                Event Timestamp: <strong className="font-mono font-semibold text-slate-800">{eventTimestampFormatted}</strong>
              </span>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <div className="inline-flex items-center gap-2 rounded-lg border-2 border-rose-600 bg-rose-600/10 px-4 py-2 text-rose-800 font-extrabold tracking-wider text-sm sm:text-base">
              <AlertOctagon className="h-5 w-5 text-rose-600" />
              STATUS: CRITICAL
            </div>
            <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">
              Autonomous Alert Tier 1
            </span>
          </div>
        </div>

        {/* Real-time Telemetry Grid: AQI, PM2.5, PM10 */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-4">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-500">
              <span>Air Quality Index</span>
              <span className="rounded bg-rose-100 px-1.5 py-0.5 text-[10px] font-bold text-rose-800">Hazardous</span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-extrabold text-rose-700">
                {canonicalZone?.airQuality.aqi ?? 312}
              </span>
              <span className="text-xs font-medium text-slate-500">AQI</span>
            </div>
            <p className="mt-1 text-xs text-slate-500">Threshold baseline: 50 (Good)</p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-4">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-500">
              <span>Fine Particulate (PM2.5)</span>
              <span className="rounded bg-rose-100 px-1.5 py-0.5 text-[10px] font-bold text-rose-800">+180% Surge</span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                {canonicalZone?.airQuality.pm25.toFixed(1) ?? '248.5'}
              </span>
              <span className="text-xs font-medium text-slate-500">µg/m³</span>
            </div>
            <p className="mt-1 text-xs text-slate-500">24-hour guideline: 15 µg/m³</p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-4">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-500">
              <span>Coarse Particulate (PM10)</span>
              <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-800">Severe</span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                {canonicalZone?.airQuality.pm10.toFixed(1) ?? '380.2'}
              </span>
              <span className="text-xs font-medium text-slate-500">µg/m³</span>
            </div>
            <p className="mt-1 text-xs text-slate-500">24-hour guideline: 45 µg/m³</p>
          </div>
        </div>

        {/* Evidence Fusion Score Panel */}
        <div className="mt-6 rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 to-slate-800 p-5 sm:p-6 text-white shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                <span className="text-xs font-mono uppercase tracking-wider text-slate-300">
                  Algorithmic Multi-Source Fusion
                </span>
              </div>
              <h3 className="mt-1 text-lg sm:text-xl font-bold tracking-tight text-white">
                Prototype Evidence Confidence
              </h3>
            </div>

            <div className="flex items-baseline gap-3">
              <div className="text-right">
                <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">
                  {(fusionResult.score * 100).toFixed(1)}%
                </div>
                <div className="text-[11px] font-mono text-slate-300">
                  raw score: {fusionResult.score.toFixed(4)}
                </div>
              </div>

              <div className="rounded-md border border-emerald-500/40 bg-emerald-500/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-300">
                Status: {fusionResult.status}
              </div>
            </div>
          </div>

          {/* Meter Bar */}
          <div className="mt-4">
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-700">
              <div
                className="h-full rounded-full bg-gradient-to-r from-teal-400 to-emerald-400 transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(0, fusionResult.score * 100))}%` }}
              />
            </div>
            <div className="mt-1.5 flex justify-between text-[11px] font-mono text-slate-400">
              <span>0.00 (Insufficient)</span>
              <span>0.30 (Low)</span>
              <span>0.60 (Moderate)</span>
              <span>1.00 (High Confidence)</span>
            </div>
          </div>

          {/* Mandatory Disclaimer */}
          <div className="mt-5 rounded-lg border border-slate-700 bg-slate-800/80 p-3 sm:p-4 text-xs text-slate-300">
            <div className="flex items-start gap-2.5">
              <Info className="h-4 w-4 shrink-0 text-cyan-400 mt-0.5" />
              <p className="leading-relaxed">
                <strong className="font-semibold text-white">Disclaimer: </strong>
                This is a deterministic prototype evidence score, not a calibrated probability of pollution.
              </p>
            </div>
          </div>
        </div>

        {/* Evidence Sources Breakdown */}
        <div className="mt-8 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-slate-600" />
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                Multi-Source Evidence Assessment Breakdown
              </h4>
            </div>
            <span className="text-xs font-mono text-slate-500">
              4 of 4 independent sources active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {orderedSources.map((sourceKey) => {
              const assessment = assessmentMap.get(sourceKey);
              const meta = SOURCE_META[sourceKey];
              const Icon = meta.icon;

              const isAvailable = assessment?.available ?? false;
              const quality = assessment ? assessment.quality : 0;
              const agreement = assessment ? assessment.agreement : 0;
              const freshness = assessment ? assessment.freshness : 0;

              return (
                <div
                  key={sourceKey}
                  className="rounded-xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-2xs hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${meta.accentColor}`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <h5 className="text-sm font-bold text-slate-900">{meta.label}</h5>
                        <p className="text-xs text-slate-500 leading-tight">
                          {sourceKey === 'ground-sensor'
                            ? 'Weight: 30% in fusion calculation'
                            : sourceKey === 'satellite'
                            ? 'Weight: 25% in fusion calculation'
                            : sourceKey === 'meteorology'
                            ? 'Weight: 20% in fusion calculation'
                            : 'Weight: 10% in fusion calculation'}
                        </p>
                      </div>
                    </div>

                    {isAvailable ? (
                      <span className="inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-800">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                        Available
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-semibold text-slate-500">
                        Unavailable
                      </span>
                    )}
                  </div>

                  <p className="mt-3 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-2.5">
                    {meta.description}
                  </p>

                  {/* 3 Normalized Metrics: Quality, Agreement, Freshness */}
                  <div className="mt-4 grid grid-cols-3 gap-2 rounded-lg bg-slate-50 p-2.5 border border-slate-100">
                    <div className="text-center">
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        Quality
                      </span>
                      <span className="mt-0.5 block font-mono text-sm font-extrabold text-slate-900">
                        {quality.toFixed(2)}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {(quality * 100).toFixed(0)}%
                      </span>
                    </div>

                    <div className="text-center border-x border-slate-200/80">
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        Agreement
                      </span>
                      <span className="mt-0.5 block font-mono text-sm font-extrabold text-slate-900">
                        {agreement.toFixed(2)}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {(agreement * 100).toFixed(0)}%
                      </span>
                    </div>

                    <div className="text-center">
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        Freshness
                      </span>
                      <span className="mt-0.5 block font-mono text-sm font-extrabold text-slate-900">
                        {freshness.toFixed(2)}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {(freshness * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Secondary Anomaly Zones Summary */}
      <section
        aria-labelledby="secondary-hotspots-heading"
        className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-2xs"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Flame className="h-4 w-4 text-amber-500" />
            <h3
              id="secondary-hotspots-heading"
              className="text-base font-bold tracking-tight text-slate-900"
            >
              Secondary Anomaly Zones (Warning / Watch)
            </h3>
          </div>
          <span className="rounded-md bg-slate-100 px-2.5 py-0.5 text-xs font-mono text-slate-600 font-medium">
            {secondaryHotspots.length} Zones under surveillance
          </span>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {secondaryHotspots.map((zone) => (
            <div
              key={zone.id}
              className="rounded-lg border border-slate-200 bg-slate-50/50 p-3.5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-bold text-slate-800">{zone.id}</span>
                  <span
                    className={`rounded px-1.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide ${
                      zone.status === 'warning'
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                    }`}
                  >
                    {zone.status}
                  </span>
                </div>
                <h4 className="mt-1 text-xs font-semibold text-slate-900 line-clamp-1">
                  {zone.name}
                </h4>
                <p className="text-[11px] text-slate-500">{zone.region}</p>
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-slate-200/80 pt-2 text-xs">
                <span className="text-slate-600 font-medium">AQI: <strong>{zone.airQuality.aqi}</strong></span>
                <span className="text-slate-600 font-mono text-[11px]">PM2.5: {zone.airQuality.pm25} µg/m³</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
