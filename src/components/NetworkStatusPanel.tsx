import React from 'react';
import { NetworkStatusStats } from '../data/selectors.ts';
import { Radio, ShieldCheck, Eye, AlertTriangle, AlertOctagon, Layers, MapPin } from 'lucide-react';

interface NetworkStatusPanelProps {
  stats: NetworkStatusStats;
}

export const NetworkStatusPanel: React.FC<NetworkStatusPanelProps> = ({ stats }) => {
  return (
    <section
      id="network-status-panel"
      aria-labelledby="network-status-heading"
      className="rounded-xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-2xs"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 text-teal-700 border border-teal-200/60">
            <Radio className="h-4 w-4" />
          </div>
          <div>
            <h3
              id="network-status-heading"
              className="text-base font-bold tracking-tight text-slate-900"
            >
              Network Status
            </h3>
            <p className="text-xs text-slate-500">
              Federated node operational readiness and zone distribution
            </p>
          </div>
        </div>

        <span
          id="network-status-synthetic-badge"
          className="inline-flex items-center gap-1.5 rounded-full border border-amber-300/80 bg-amber-50 px-2.5 py-0.5 text-xs font-mono font-semibold text-amber-900 tracking-wide"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
          SYNTHETIC NETWORK
        </span>
      </div>

      <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Normal */}
        <div
          id="network-stat-normal"
          className="flex flex-col justify-between rounded-lg border border-emerald-200/70 bg-emerald-50/40 p-3.5"
        >
          <div className="flex items-center justify-between text-xs font-medium text-emerald-800">
            <span>Normal</span>
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-emerald-950">
            {stats.normalCount}
          </div>
          <span className="mt-1 text-[11px] text-emerald-700/80">Within thresholds</span>
        </div>

        {/* Watch */}
        <div
          id="network-stat-watch"
          className="flex flex-col justify-between rounded-lg border border-sky-200/70 bg-sky-50/40 p-3.5"
        >
          <div className="flex items-center justify-between text-xs font-medium text-sky-800">
            <span>Watch</span>
            <Eye className="h-4 w-4 text-sky-600" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-sky-950">
            {stats.watchCount}
          </div>
          <span className="mt-1 text-[11px] text-sky-700/80">Elevated attention</span>
        </div>

        {/* Warning */}
        <div
          id="network-stat-warning"
          className="flex flex-col justify-between rounded-lg border border-amber-200/70 bg-amber-50/40 p-3.5"
        >
          <div className="flex items-center justify-between text-xs font-medium text-amber-900">
            <span>Warning</span>
            <AlertTriangle className="h-4 w-4 text-amber-600" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-amber-950">
            {stats.warningCount}
          </div>
          <span className="mt-1 text-[11px] text-amber-800/80">Approaching limit</span>
        </div>

        {/* Critical */}
        <div
          id="network-stat-critical"
          className="flex flex-col justify-between rounded-lg border border-rose-200/80 bg-rose-50/50 p-3.5"
        >
          <div className="flex items-center justify-between text-xs font-medium text-rose-900">
            <span>Critical</span>
            <AlertOctagon className="h-4 w-4 text-rose-600 animate-pulse" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-rose-950">
            {stats.criticalCount}
          </div>
          <span className="mt-1 text-[11px] text-rose-800/80 font-medium">Incident triggered</span>
        </div>

        {/* Total Monitoring Zones */}
        <div
          id="network-stat-total-zones"
          className="flex flex-col justify-between rounded-lg border border-slate-200/80 bg-slate-50/70 p-3.5"
        >
          <div className="flex items-center justify-between text-xs font-medium text-slate-700">
            <span>Monitoring Zones</span>
            <Layers className="h-4 w-4 text-slate-500" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-slate-900">
            {stats.totalZonesCount}
          </div>
          <span className="mt-1 text-[11px] text-slate-500">Active telemetry</span>
        </div>

        {/* Total Prototype Regions */}
        <div
          id="network-stat-total-regions"
          className="flex flex-col justify-between rounded-lg border border-slate-200/80 bg-slate-50/70 p-3.5"
        >
          <div className="flex items-center justify-between text-xs font-medium text-slate-700">
            <span>Prototype Regions</span>
            <MapPin className="h-4 w-4 text-slate-500" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-slate-900">
            {stats.totalRegionsCount}
          </div>
          <span className="mt-1 text-[11px] text-slate-500">Synthetic corridors</span>
        </div>
      </div>
    </section>
  );
};
