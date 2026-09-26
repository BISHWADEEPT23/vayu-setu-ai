/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Bell,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Radio,
  Users,
  Check,
  Building,
  Globe,
  Share2,
} from 'lucide-react';
import { getCanonicalPollutionEvent, getCanonicalCriticalZone } from '../data/selectors.ts';
import { VS_E001_EVIDENCE_ASSESSMENTS } from '../data/synthetic/evidenceAssessments.ts';
import { calculateEvidenceFusion } from '../domain/evidenceFusion.ts';

type EscalationLevel = 'LOCAL' | 'DISTRICT' | 'STATE' | 'NATIONAL' | 'BRICS';
type AlertStatus = 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED';

interface TimelineEvent {
  id: string;
  time: string;
  level: EscalationLevel;
  title: string;
  description: string;
  badge?: string;
}

const ESCALATION_STAGES: EscalationLevel[] = ['LOCAL', 'DISTRICT', 'STATE', 'NATIONAL', 'BRICS'];

export function AlertsView(): React.JSX.Element {
  const event = getCanonicalPollutionEvent();
  const zone = getCanonicalCriticalZone();
  const fusionResult = calculateEvidenceFusion(VS_E001_EVIDENCE_ASSESSMENTS);

  // Local state
  const [alertStatus, setAlertStatus] = useState<AlertStatus>('ACTIVE');
  const [currentLevel, setCurrentLevel] = useState<EscalationLevel>('DISTRICT');
  const [timeline, setTimeline] = useState<TimelineEvent[]>([
    {
      id: 't-3',
      time: '2026-09-20 00:25:00 UTC',
      level: 'DISTRICT',
      title: 'District Environmental Cell Notified',
      description: 'Triggered by multi-source cross-validation (85.1% prototype evidence confidence).',
      badge: 'Escalation',
    },
    {
      id: 't-2',
      time: '2026-09-20 00:22:00 UTC',
      level: 'LOCAL',
      title: 'Local Hotspot Threshold Exceeded',
      description: 'Ground sensor VS-Z07 recorded AQI 342 with PM2.5 > 240 µg/m³ for 3 consecutive cycles.',
      badge: 'Threshold Alert',
    },
    {
      id: 't-1',
      time: '2026-09-20 00:20:00 UTC',
      level: 'LOCAL',
      title: 'Initial Anomaly Incident Detected',
      description: 'Event VS-E001 logged by automated synthetic telemetry ingestion pipeline.',
      badge: 'System Ingest',
    },
  ]);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const showFeedback = (msg: string) => {
    setActionFeedback(msg);
    setTimeout(() => setActionFeedback(null), 4000);
  };

  // Action handlers with deterministic scenario progression
  const handleAcknowledge = () => {
    setAlertStatus('ACKNOWLEDGED');
    const newEntry: TimelineEvent = {
      id: 't-ack-deterministic',
      time: '2026-09-20 00:27:00 UTC',
      level: currentLevel,
      title: 'Alert Acknowledged by District Officer',
      description: 'Local responder team confirmed alert reception and activated monitoring protocol.',
      badge: 'Acknowledged',
    };
    setTimeline((prev) => [newEntry, ...prev.filter((e) => e.id !== 't-ack-deterministic')]);
    showFeedback('Alert status updated to ACKNOWLEDGED (Local UI state).');
  };

  const handleEscalate = () => {
    const currentIndex = ESCALATION_STAGES.indexOf(currentLevel);
    if (currentIndex < ESCALATION_STAGES.length - 1) {
      const nextLevel = ESCALATION_STAGES[currentIndex + 1];
      const escalationTimestamps: Record<EscalationLevel, string> = {
        LOCAL: '2026-09-20 00:22:00 UTC',
        DISTRICT: '2026-09-20 00:25:00 UTC',
        STATE: '2026-09-20 00:30:00 UTC',
        NATIONAL: '2026-09-20 00:35:00 UTC',
        BRICS: '2026-09-20 00:40:00 UTC',
      };
      setCurrentLevel(nextLevel);
      const newEntry: TimelineEvent = {
        id: `t-esc-${nextLevel.toLowerCase()}`,
        time: escalationTimestamps[nextLevel] || '2026-09-20 00:30:00 UTC',
        level: nextLevel,
        title: `Alert Escalated to ${nextLevel} Tier`,
        description: `Operational command forwarded to ${nextLevel} environmental response coordination unit.`,
        badge: 'Escalation Step',
      };
      setTimeline((prev) => [newEntry, ...prev.filter((e) => e.id !== `t-esc-${nextLevel.toLowerCase()}`)]);
      showFeedback(`Alert escalated to ${nextLevel} tier (Local UI state).`);
    } else {
      showFeedback('Alert is already at the highest federation tier (BRICS).');
    }
  };

  const handleResolve = () => {
    setAlertStatus('RESOLVED');
    const newEntry: TimelineEvent = {
      id: 't-resolve-deterministic',
      time: '2026-09-20 00:50:00 UTC',
      level: currentLevel,
      title: 'Alert Marked Resolved',
      description: 'Atmospheric conditions stabilized below emergency thresholds; incident closed.',
      badge: 'Closed',
    };
    setTimeline((prev) => [newEntry, ...prev.filter((e) => e.id !== 't-resolve-deterministic')]);
    showFeedback('Alert marked RESOLVED in local prototype session.');
  };

  const currentLevelIndex = ESCALATION_STAGES.indexOf(currentLevel);

  return (
    <div className="space-y-6">
      {/* Top Banner: Synthetic Governance */}
      <div className="rounded-xl border border-rose-500/30 bg-rose-950/20 p-4 sm:p-5 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-3 w-3 rounded-full bg-rose-500 animate-ping" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  DEMO • SYNTHETIC DATA
                </span>
                <span className="text-xs text-slate-400 font-mono">Tiered Alerts Matrix</span>
              </div>
              <h1 className="text-xl font-bold text-white mt-1">
                Early Warning & Tiered Escalation Management
              </h1>
            </div>
          </div>
          <div className="text-xs text-slate-400 max-w-sm text-left sm:text-right">
            Dispatches operate strictly in prototype mode. No external SMS, push, or email channels are triggered.
          </div>
        </div>
      </div>

      {/* Action Feedback Banner */}
      {actionFeedback && (
        <div className="rounded-lg border border-cyan-500/40 bg-cyan-950/80 p-3 text-cyan-200 text-xs sm:text-sm flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>{actionFeedback}</span>
          </div>
          <button
            type="button"
            onClick={() => setActionFeedback(null)}
            className="text-cyan-400 hover:text-white text-xs underline ml-2"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Primary Active Alert Card */}
      <div className="rounded-xl border border-rose-500/40 bg-slate-900/90 p-5 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Header with Event ID, Status & Action Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wider uppercase bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                SEVERITY: CRITICAL
              </span>
              <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
                EVENT ID: {event?.eventId ?? 'VS-E001'}
              </span>
              <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${
                alertStatus === 'ACTIVE'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  : alertStatus === 'ACKNOWLEDGED'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              }`}>
                STATUS: {alertStatus}
              </span>
            </div>

            <h2 className="text-xl font-bold text-white mt-1">
              Industrial Corridor Severe Atmospheric Inversion Alert
            </h2>

            <div className="text-xs text-slate-400 font-mono flex items-center gap-2 flex-wrap">
              <span>Zone: <strong className="text-slate-200">{zone?.id ?? 'VS-Z07'}</strong> ({zone?.name ?? 'Heavy Smelter & Refinery Complex'})</span>
              <span>•</span>
              <span>Region: <strong className="text-slate-200">{zone?.region ?? 'Central Industrial Belt'}</strong></span>
              <span>•</span>
              <span>Created: <strong className="text-slate-200">{event?.timestamp ?? '2026-09-20T00:20:00Z'}</strong></span>
            </div>
          </div>

          {/* Interactive Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={handleAcknowledge}
              disabled={alertStatus !== 'ACTIVE'}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold font-mono tracking-wider transition-all flex items-center gap-1.5 ${
                alertStatus === 'ACTIVE'
                  ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-md shadow-amber-900/40 active:scale-95'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              ACKNOWLEDGE
            </button>

            <button
              type="button"
              onClick={handleEscalate}
              disabled={alertStatus === 'RESOLVED' || currentLevel === 'BRICS'}
              className="px-3.5 py-2 rounded-lg text-xs font-bold font-mono tracking-wider bg-rose-700 hover:bg-rose-600 text-white transition-all shadow-md shadow-rose-950/40 active:scale-95 flex items-center gap-1.5 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              ESCALATE
            </button>

            <button
              type="button"
              onClick={handleResolve}
              disabled={alertStatus === 'RESOLVED'}
              className="px-3.5 py-2 rounded-lg text-xs font-bold font-mono tracking-wider bg-emerald-700 hover:bg-emerald-600 text-white transition-all shadow-md shadow-emerald-950/40 active:scale-95 flex items-center gap-1.5 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              RESOLVE
            </button>
          </div>
        </div>

        {/* Escalation Path: LOCAL → DISTRICT → STATE → NATIONAL → BRICS */}
        <div className="py-4 border-b border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold uppercase tracking-wider text-slate-400">
              Escalation Pathway:
            </span>
            <span className="font-mono text-cyan-400 font-bold">
              Current Tier: {currentLevel}
            </span>
          </div>

          <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
            {ESCALATION_STAGES.map((lvl, idx) => {
              const isPast = idx < currentLevelIndex;
              const isCurrent = idx === currentLevelIndex;
              const isFuture = idx > currentLevelIndex;

              return (
                <div
                  key={lvl}
                  className={`p-2.5 rounded-lg border text-center transition-all ${
                    isCurrent
                      ? 'bg-rose-500/20 border-rose-500 text-rose-200 ring-2 ring-rose-500/40 shadow-lg'
                      : isPast
                        ? 'bg-slate-800/80 border-slate-700 text-slate-300'
                        : 'bg-slate-950/50 border-slate-800/60 text-slate-600'
                  }`}
                >
                  <div className="text-[10px] font-mono text-slate-500 uppercase">Stage {idx + 1}</div>
                  <div className="text-xs sm:text-sm font-bold font-mono tracking-wide mt-0.5">
                    {lvl}
                  </div>
                  {isCurrent && (
                    <div className="text-[9px] font-bold text-rose-400 uppercase tracking-tighter mt-0.5">
                      ● Active
                    </div>
                  )}
                  {isPast && (
                    <div className="text-[9px] text-slate-400 font-mono mt-0.5">
                      ✓ Cleared
                    </div>
                  )}
                  {isFuture && (
                    <div className="text-[9px] text-slate-600 font-mono mt-0.5">
                      Pending
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Core Alert Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
          <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800">
            <div className="text-[11px] text-slate-400 font-semibold uppercase">Evidence Confidence</div>
            <div className="text-2xl font-black font-mono text-cyan-400 mt-0.5">
              {(fusionResult.score * 100).toFixed(1)}%
            </div>
            <div className="text-[10px] text-cyan-300 font-mono uppercase">Status: {fusionResult.status}</div>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800">
            <div className="text-[11px] text-slate-400 font-semibold uppercase">Forecast Risk</div>
            <div className="text-2xl font-black font-mono text-rose-400 mt-0.5">CRITICAL</div>
            <div className="text-[10px] text-slate-400 font-mono">24h Predicted: AQI 295</div>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800">
            <div className="text-[11px] text-slate-400 font-semibold uppercase">Exposure Level</div>
            <div className="text-2xl font-black font-mono text-amber-300 mt-0.5">CRITICAL</div>
            <div className="text-[10px] text-slate-400 font-mono">~385,000 residents</div>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800">
            <div className="text-[11px] text-slate-400 font-semibold uppercase">Active Telemetry</div>
            <div className="text-2xl font-black font-mono text-white mt-0.5">AQI 342</div>
            <div className="text-[10px] text-slate-500 font-mono">PM2.5: 248.5 µg/m³</div>
          </div>
        </div>
      </div>

      {/* Alert Timeline / History */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            Alert Escalation & Dispatch History
          </h3>
          <span className="text-[11px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
            {timeline.length} Entries Recorded
          </span>
        </div>

        <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
          {timeline.map((item) => (
            <div key={item.id} className="relative group">
              <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-cyan-400 border-2 border-slate-900 group-hover:scale-125 transition-transform" />
              <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{item.title}</span>
                    {item.badge && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-cyan-950/60 text-cyan-300 border border-cyan-800/40">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">{item.time}</span>
                </div>
                <div className="text-xs text-slate-400 leading-relaxed">{item.description}</div>
                <div className="text-[10px] font-mono text-slate-500 mt-1">Tier: {item.level}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
