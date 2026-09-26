/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  UserCheck,
  Activity,
  Wind,
  Building2,
  GraduationCap,
  Users,
  Radio,
  FileText,
  Clock,
  ArrowRight,
  Compass,
  Check,
  Send,
  BellRing,
} from 'lucide-react';
import { getCanonicalPollutionEvent, getCanonicalCriticalZone } from '../data/selectors.ts';
import { VS_E001_EVIDENCE_ASSESSMENTS } from '../data/synthetic/evidenceAssessments.ts';
import { calculateEvidenceFusion } from '../domain/evidenceFusion.ts';

type IncidentLifecycleState = 'UNACKNOWLEDGED' | 'ACKNOWLEDGED' | 'ASSIGNED' | 'ESCALATED' | 'RESOLVED';

interface IncidentAuditEntry {
  timestamp: string;
  action: string;
  user: string;
  details: string;
}

export function CommandCentreView(): React.JSX.Element {
  const event = getCanonicalPollutionEvent();
  const zone = getCanonicalCriticalZone();
  const fusionResult = calculateEvidenceFusion(VS_E001_EVIDENCE_ASSESSMENTS);

  // Local state for interactive buttons
  const [lifecycleState, setLifecycleState] = useState<IncidentLifecycleState>('UNACKNOWLEDGED');
  const [assignedTo, setAssignedTo] = useState<string>('Unassigned');
  const [auditLog, setAuditLog] = useState<IncidentAuditEntry[]>([
    {
      timestamp: '2026-09-20 00:20:00 UTC',
      action: 'SYSTEM_ALERT',
      user: 'Automated Ingestion Pipeline',
      details: 'Critical anomaly detected across multi-source synthetic telemetry feeds.',
    },
  ]);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  // Helper to add audit record and toast notification
  const logAction = (action: string, newState: IncidentLifecycleState, detail: string, assignee?: string) => {
    const simulatedTimestamps: Record<string, string> = {
      ACKNOWLEDGE: '2026-09-20 00:24:00 UTC',
      ASSIGN: '2026-09-20 00:28:00 UTC',
      ESCALATE: '2026-09-20 00:32:00 UTC',
      RESOLVE: '2026-09-20 00:45:00 UTC',
    };
    const nowStr = simulatedTimestamps[action] || '2026-09-20 00:25:00 UTC';
    setLifecycleState(newState);
    if (assignee) {
      setAssignedTo(assignee);
    }
    setAuditLog((prev) => [
      {
        timestamp: nowStr,
        action,
        user: 'Command Duty Officer (Simulated Session)',
        details: detail,
      },
      ...prev,
    ]);

    setNotificationMsg(`Action applied: ${action} — ${detail}`);
    setTimeout(() => {
      setNotificationMsg(null);
    }, 4500);
  };

  // Button handlers (local UI state only)
  const handleAcknowledge = () => {
    logAction(
      'ACKNOWLEDGE',
      'ACKNOWLEDGED',
      'Incident acknowledged by Regional Environmental Dispatch; monitoring cadence tightened to 5-min intervals.'
    );
  };

  const handleAssign = () => {
    logAction(
      'ASSIGN',
      'ASSIGNED',
      'Dispatched to Central Industrial Corridor Inspection Team #4 (Specialist V. Sharma, Lead).',
      'Team #4 (V. Sharma)'
    );
  };

  const handleEscalate = () => {
    logAction(
      'ESCALATE',
      'ESCALATED',
      'Escalated to State Environmental Protection Bureau & District Disaster Management Cell.'
    );
  };

  const handleResolve = () => {
    logAction(
      'RESOLVE',
      'RESOLVED',
      'Incident marked resolved in local simulation. Industrial boiler load curbed and atmospheric ventilation improved.'
    );
  };

  const currentAqi = zone?.airQuality.aqi ?? 342;
  const currentPm25 = zone?.airQuality.pm25 ?? 248.5;
  const currentPm10 = zone?.airQuality.pm10 ?? 385.0;

  return (
    <div className="space-y-6">
      {/* Top Banner: Synthetic Data & Governance Warning */}
      <div className="rounded-xl border border-rose-500/30 bg-rose-950/20 p-4 sm:p-5 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-3 w-3 rounded-full bg-rose-500 animate-ping" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  DEMO • SYNTHETIC DATA
                </span>
                <span className="text-xs text-slate-400 font-mono">VS-E001 Active Incident</span>
              </div>
              <h1 className="text-xl font-bold text-white mt-1">
                Authority Command Centre — Environmental Emergency Dispatch
              </h1>
            </div>
          </div>
          <div className="text-xs text-slate-400 max-w-sm text-left sm:text-right">
            Command decisions and action triggers operate strictly on local demo state.
          </div>
        </div>
      </div>

      {/* Local Notification Toast */}
      {notificationMsg && (
        <div className="rounded-lg border border-cyan-500/40 bg-cyan-950/80 p-3 text-cyan-200 text-xs sm:text-sm flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>{notificationMsg}</span>
          </div>
          <button
            type="button"
            onClick={() => setNotificationMsg(null)}
            className="text-cyan-400 hover:text-white text-xs underline ml-2"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Primary Incident Header & Action Controls Bar */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wider uppercase bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                STATUS: CRITICAL
              </span>
              <span className="px-2 py-0.5 rounded text-xs font-mono font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                LIFECYCLE: {lifecycleState}
              </span>
              <span className="px-2 py-0.5 rounded text-xs font-mono text-cyan-400 bg-cyan-950/30 border border-cyan-800/40">
                ASSIGNED: {assignedTo}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white">
              {event?.message ?? 'Heavy Industrial Smelter & Refinery Anomaly'}
            </h2>
            <div className="text-xs text-slate-400 font-mono flex items-center gap-2">
              <span>Location: <strong>{zone?.name ?? 'Heavy Smelter & Refinery Complex'}</strong> ({zone?.id ?? 'VS-Z07'})</span>
              <span>•</span>
              <span>Region: <strong>{zone?.region ?? 'Central Industrial Belt'}</strong></span>
              <span>•</span>
              <span>Coordinates: <strong>28.388°N, 77.317°E</strong></span>
            </div>
          </div>

          {/* Action Buttons: Local UI State Only */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleAcknowledge}
              disabled={lifecycleState !== 'UNACKNOWLEDGED'}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold font-mono tracking-wider transition-all flex items-center gap-1.5 ${
                lifecycleState === 'UNACKNOWLEDGED'
                  ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-md shadow-amber-900/40 active:scale-95'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              ACKNOWLEDGE
            </button>

            <button
              type="button"
              onClick={handleAssign}
              disabled={lifecycleState === 'RESOLVED'}
              className="px-3.5 py-2 rounded-lg text-xs font-bold font-mono tracking-wider bg-cyan-700 hover:bg-cyan-600 text-white transition-all shadow-md shadow-cyan-950/40 active:scale-95 flex items-center gap-1.5 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed"
            >
              <UserCheck className="w-3.5 h-3.5" />
              ASSIGN
            </button>

            <button
              type="button"
              onClick={handleEscalate}
              disabled={lifecycleState === 'RESOLVED' || lifecycleState === 'ESCALATED'}
              className="px-3.5 py-2 rounded-lg text-xs font-bold font-mono tracking-wider bg-rose-700 hover:bg-rose-600 text-white transition-all shadow-md shadow-rose-950/40 active:scale-95 flex items-center gap-1.5 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed"
            >
              <BellRing className="w-3.5 h-3.5" />
              ESCALATE
            </button>

            <button
              type="button"
              onClick={handleResolve}
              disabled={lifecycleState === 'RESOLVED'}
              className="px-3.5 py-2 rounded-lg text-xs font-bold font-mono tracking-wider bg-emerald-700 hover:bg-emerald-600 text-white transition-all shadow-md shadow-emerald-950/40 active:scale-95 flex items-center gap-1.5 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              RESOLVE
            </button>
          </div>
        </div>

        {/* Real-time Atmospheric Telemetry KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
          <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800">
            <div className="text-[11px] text-slate-400 font-semibold uppercase">Current AQI</div>
            <div className="text-2xl font-black font-mono text-rose-400 mt-0.5">{currentAqi}</div>
            <div className="text-[10px] text-rose-400/80 font-medium">Hazardous bracket</div>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800">
            <div className="text-[11px] text-slate-400 font-semibold uppercase">PM2.5 Density</div>
            <div className="text-2xl font-black font-mono text-white mt-0.5">{currentPm25}</div>
            <div className="text-[10px] text-slate-500">µg/m³ (16.5x WHO guide)</div>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800">
            <div className="text-[11px] text-slate-400 font-semibold uppercase">PM10 Density</div>
            <div className="text-2xl font-black font-mono text-white mt-0.5">{currentPm10}</div>
            <div className="text-[10px] text-slate-500">µg/m³ coarse fraction</div>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/70 border border-cyan-500/30 bg-cyan-950/10">
            <div className="text-[11px] text-cyan-300 font-semibold uppercase">Prototype Confidence</div>
            <div className="text-2xl font-black font-mono text-cyan-400 mt-0.5">
              {(fusionResult.score * 100).toFixed(1)}%
            </div>
            <div className="text-[10px] text-cyan-300/80 font-medium">Status: {fusionResult.status.toUpperCase()}</div>
          </div>
        </div>
      </div>

      {/* Grid: Evidence Breakdown & Multi-Horizon Dispersion */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Evidence Sources Panel */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Radio className="w-4 h-4 text-cyan-400" />
              Multi-Source Evidence Verification
            </h3>
            <span className="text-[11px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
              4 of 4 Feeds Corroborating
            </span>
          </div>

          <div className="space-y-2.5">
            {VS_E001_EVIDENCE_ASSESSMENTS.map((item) => {
              const titles: Record<string, string> = {
                'citizen-report': 'Citizen Report',
                'ground-sensor': 'Ground Sensor',
                'satellite': 'Satellite Observation',
                'meteorology': 'Meteorology',
              };

              return (
                <div
                  key={item.source}
                  className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      {titles[item.source] ?? item.source}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      Q: {(item.quality * 100).toFixed(0)}% • Agree: {(item.agreement * 100).toFixed(0)}% • Fresh: {(item.freshness * 100).toFixed(0)}%
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    AVAILABLE
                  </span>
                </div>
              );
            })}
          </div>

          <div className="text-[11px] text-slate-500 leading-relaxed pt-1 border-t border-slate-800/60">
            Note: All multi-source inputs are simulated benchmark assessments for prototype workflow demonstration.
          </div>
        </div>

        {/* 24h / 48h / 72h Forecast & Plume Vector */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Compass className="w-4 h-4 text-cyan-400" />
              Forecast Horizon & Plume Trajectory
            </h3>
            <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/40">
              Wind: NW @ 18.5 km/h
            </span>
          </div>

          {/* Plume Direction Box */}
          <div className="p-3 rounded-lg bg-slate-950/70 border border-cyan-500/20 space-y-1">
            <div className="text-xs font-semibold text-cyan-300 flex items-center gap-1.5">
              <Wind className="w-3.5 h-3.5 text-cyan-400" />
              Plume Direction:
            </div>
            <div className="text-sm font-bold text-white pl-5">
              Southeast (SE, ~135°) downwind toward VS-Z08 corridor
            </div>
            <div className="text-[10px] text-slate-400 pl-5">
              Simplified trajectory based on surface wind vector; does not represent 3D dispersion modeling.
            </div>
          </div>

          {/* Forecast Horizons Grid */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            <div className="p-3 rounded-lg bg-slate-950/60 border border-rose-500/30 text-center">
              <div className="text-[11px] font-bold text-rose-400 uppercase font-mono">24h Risk</div>
              <div className="text-xl font-bold font-mono text-white mt-1">AQI 295</div>
              <div className="text-[10px] text-rose-300 font-semibold mt-0.5">CRITICAL</div>
              <div className="text-[9px] text-slate-500 font-mono mt-0.5">[270 – 320]</div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950/60 border border-orange-500/30 text-center">
              <div className="text-[11px] font-bold text-orange-400 uppercase font-mono">48h Risk</div>
              <div className="text-xl font-bold font-mono text-white mt-1">AQI 235</div>
              <div className="text-[10px] text-orange-300 font-semibold mt-0.5">HIGH</div>
              <div className="text-[9px] text-slate-500 font-mono mt-0.5">[195 – 275]</div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950/60 border border-amber-500/30 text-center">
              <div className="text-[11px] font-bold text-amber-400 uppercase font-mono">72h Risk</div>
              <div className="text-xl font-bold font-mono text-white mt-1">AQI 168</div>
              <div className="text-[10px] text-amber-300 font-semibold mt-0.5">MODERATE</div>
              <div className="text-[9px] text-slate-500 font-mono mt-0.5">[125 – 215]</div>
            </div>
          </div>
        </div>
      </div>

      {/* Exposure Summary Panel */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Users className="w-4 h-4 text-cyan-400" />
            Exposure Summary (Direct 24h Downwind Vector)
          </h3>
          <span className="text-xs font-mono text-rose-400 bg-rose-500/10 px-2.5 py-0.5 rounded border border-rose-500/20 font-bold">
            EXPOSURE LEVEL: CRITICAL
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-800 flex items-start gap-3">
            <Users className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs text-slate-400 uppercase font-semibold">Population in Path</div>
              <div className="text-2xl font-black font-mono text-white mt-0.5">~385,000</div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Includes <strong className="text-rose-300 font-mono">~92,400</strong> pediatric & geriatric residents
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-800 flex items-start gap-3">
            <Building2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs text-slate-400 uppercase font-semibold">Hospitals Affected</div>
              <div className="text-2xl font-black font-mono text-white mt-0.5">6 Facilities</div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Trauma & Pulmonary Care Centre, Apex Industrial Hospital + 4 Clinics
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-800 flex items-start gap-3">
            <GraduationCap className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs text-slate-400 uppercase font-semibold">Schools Affected</div>
              <div className="text-2xl font-black font-mono text-white mt-0.5">28 Schools</div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Primary academies, senior secondary, and vocational technical campuses
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Actions: Recommendations Only */}
      <div className="rounded-xl border border-cyan-500/30 bg-slate-900/90 p-5 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-cyan-400" />
              Recommended Operational Actions
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Protocol suggestions generated from multi-source threshold triggers.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
            ⚠️ Actions are recommendations only
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800 flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
              1
            </div>
            <div className="space-y-1">
              <div className="text-sm font-semibold text-white">Increase local monitoring</div>
              <div className="text-xs text-slate-400 leading-relaxed">
                Shorten telemetry telemetry sampling cycle to 5 minutes on VS-Z07 and activate mobile secondary particulate pods downwind in VS-Z08.
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800 flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
              2
            </div>
            <div className="space-y-1">
              <div className="text-sm font-semibold text-white">Request ground verification</div>
              <div className="text-xs text-slate-400 leading-relaxed">
                Dispatch an industrial compliance inspection squad to inspect smelter flue gas desulfurization (FGD) scrubbers and electrostatic precipitators.
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800 flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
              3
            </div>
            <div className="space-y-1">
              <div className="text-sm font-semibold text-white">Review satellite observations</div>
              <div className="text-xs text-slate-400 leading-relaxed">
                Cross-correlate Sentinel-5P TROPOMI NO2 / SO2 tropospheric column passes and MODIS aerosol optical depth overpasses within 4 hours.
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800 flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
              4
            </div>
            <div className="space-y-1">
              <div className="text-sm font-semibold text-white">Notify relevant authority</div>
              <div className="text-xs text-slate-400 leading-relaxed">
                Transmit formal synthetic alert payload to the State Pollution Control Directorate and District Magistrate Disaster Management Cell.
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800 md:col-span-2 flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
              5
            </div>
            <div className="space-y-1">
              <div className="text-sm font-semibold text-white">
                Prepare public advisory if independently verified
              </div>
              <div className="text-xs text-slate-400 leading-relaxed">
                Draft localized advisory recommendations for vulnerable cohorts (pediatric, asthmatic, elderly) in downwind zones pending physical ground officer sign-off.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Incident Audit & Dispatch Activity Log */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg space-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <Clock className="w-4 h-4 text-cyan-400" />
          Command Session Audit Log (Local State)
        </h3>

        <div className="space-y-2">
          {auditLog.map((entry, idx) => (
            <div
              key={idx}
              className="p-3 rounded-lg bg-slate-950/50 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-cyan-400 uppercase">
                    [{entry.action}]
                  </span>
                  <span className="text-slate-300">{entry.details}</span>
                </div>
                <div className="text-slate-500 text-[11px] font-mono">
                  Triggered by: {entry.user}
                </div>
              </div>
              <span className="text-[10px] font-mono text-slate-400 shrink-0">
                {entry.timestamp}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
