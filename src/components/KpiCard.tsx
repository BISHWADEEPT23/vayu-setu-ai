import React from 'react';
import { KpiStatus } from '../types.ts';

export interface KpiCardProps {
  id?: string;
  title: string;
  value: string | number;
  unit?: string;
  status: KpiStatus;
  icon: React.ComponentType<{ className?: string }>;
  trend?: string;
  subtitle?: string;
}

const STATUS_THEMES: Record<
  KpiStatus,
  {
    badgeClass: string;
    dotClass: string;
    iconBoxClass: string;
    label: string;
  }
> = {
  normal: {
    badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
    dotClass: 'bg-emerald-500',
    iconBoxClass: 'bg-emerald-50/70 text-emerald-700 border-emerald-200/60',
    label: 'Normal',
  },
  watch: {
    badgeClass: 'bg-sky-50 text-sky-800 border-sky-200/80',
    dotClass: 'bg-sky-500',
    iconBoxClass: 'bg-sky-50/70 text-sky-700 border-sky-200/60',
    label: 'Watch',
  },
  warning: {
    badgeClass: 'bg-amber-50 text-amber-900 border-amber-200/80',
    dotClass: 'bg-amber-500',
    iconBoxClass: 'bg-amber-50/70 text-amber-800 border-amber-200/60',
    label: 'Warning',
  },
  critical: {
    badgeClass: 'bg-rose-50 text-rose-900 border-rose-200/80',
    dotClass: 'bg-rose-600 animate-pulse',
    iconBoxClass: 'bg-rose-50/70 text-rose-700 border-rose-200/60',
    label: 'Critical',
  },
  neutral: {
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
    dotClass: 'bg-slate-400',
    iconBoxClass: 'bg-slate-100/70 text-slate-600 border-slate-200/80',
    label: 'Standby',
  },
};

export const KpiCard: React.FC<KpiCardProps> = ({
  id,
  title,
  value,
  unit,
  status,
  icon: Icon,
  trend,
  subtitle,
}) => {
  const theme = STATUS_THEMES[status] || STATUS_THEMES.neutral;
  const elementId = id || `kpi-card-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

  return (
    <div
      id={elementId}
      className="flex flex-col justify-between rounded-xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-2xs transition-shadow hover:shadow-xs"
    >
      {/* Top row: Title and Icon */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p
            id={`${elementId}-title`}
            className="text-xs font-semibold uppercase tracking-wider text-slate-500"
          >
            {title}
          </p>
        </div>
        <div
          id={`${elementId}-icon-box`}
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${theme.iconBoxClass}`}
        >
          <Icon className="h-4.5 w-4.5" aria-hidden="true" />
        </div>
      </div>

      {/* Middle row: Large Value & Unit */}
      <div className="my-4 flex items-baseline gap-2">
        <span
          id={`${elementId}-value`}
          className="text-3xl sm:text-4xl font-bold font-mono tracking-tight text-slate-900"
        >
          {value}
        </span>
        {unit && (
          <span
            id={`${elementId}-unit`}
            className="text-sm font-medium text-slate-500"
          >
            {unit}
          </span>
        )}
      </div>

      {/* Bottom row: Status badge, optional trend, and optional subtitle */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
        <span
          id={`${elementId}-status-badge`}
          className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium ${theme.badgeClass}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${theme.dotClass}`} />
          {theme.label}
        </span>

        {trend && (
          <span
            id={`${elementId}-trend`}
            className="text-xs font-medium text-slate-500"
          >
            {trend}
          </span>
        )}

        {subtitle && (
          <span
            id={`${elementId}-subtitle`}
            className="w-full text-xs text-slate-400 mt-1 truncate"
          >
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
};
