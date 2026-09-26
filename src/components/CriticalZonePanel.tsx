import React from 'react';
import { MonitoringZone } from '../types.ts';
import { AlertTriangle, Wind, Gauge, Users, Satellite, MapPin } from 'lucide-react';

interface CriticalZonePanelProps {
  zone?: MonitoringZone;
}

export const CriticalZonePanel: React.FC<CriticalZonePanelProps> = ({ zone }) => {
  if (!zone) {
    return null;
  }

  return (
    <section
      id="critical-zone-panel"
      aria-labelledby="critical-zone-heading"
      className="rounded-xl border border-rose-200/80 bg-white p-5 sm:p-6 shadow-2xs"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-700 border border-rose-200/70">
            <AlertTriangle className="h-4 w-4 text-rose-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3
                id="critical-zone-heading"
                className="text-base font-bold tracking-tight text-slate-900"
              >
                Critical Zone Telemetry: {zone.name}
              </h3>
              <span
                id="critical-zone-id"
                className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-mono font-bold text-slate-800"
              >
                {zone.id}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3 text-slate-400" />
                {zone.region}
              </span>
              <span>•</span>
              <span>Coordinates: {zone.latitude.toFixed(3)}°N, {zone.longitude.toFixed(3)}°E</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            id="critical-zone-status-badge"
            className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-2.5 py-0.5 text-xs font-medium text-rose-900"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-rose-600 animate-pulse" />
            Status: {zone.status.toUpperCase()}
          </span>

          <span
            id="critical-zone-synthetic-badge"
            className="inline-flex items-center gap-1.5 rounded-full border border-amber-300/80 bg-amber-50 px-2.5 py-0.5 text-xs font-mono font-semibold text-amber-900 tracking-wide"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            DEMO • SYNTHETIC DATA
          </span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* AQI */}
        <div
          id="critical-zone-aqi"
          className="rounded-lg border border-rose-200 bg-rose-50/40 p-3 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-xs font-medium text-rose-900">
            <span>Air Quality Index</span>
            <Gauge className="h-3.5 w-3.5 text-rose-600" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-rose-950">
            {zone.airQuality.aqi}
          </div>
          <span className="mt-1 text-[11px] font-mono text-rose-800">AQI {zone.airQuality.aqi}</span>
        </div>

        {/* PM2.5 */}
        <div
          id="critical-zone-pm25"
          className="rounded-lg border border-rose-200 bg-rose-50/40 p-3 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-xs font-medium text-rose-900">
            <span>PM2.5</span>
            <span className="text-[10px] text-rose-700">µg/m³</span>
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-rose-950">
            {zone.airQuality.pm25}
          </div>
          <span className="mt-1 text-[11px] text-rose-800">High Concentration</span>
        </div>

        {/* PM10 */}
        <div
          id="critical-zone-pm10"
          className="rounded-lg border border-rose-200 bg-rose-50/40 p-3 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-xs font-medium text-rose-900">
            <span>PM10</span>
            <span className="text-[10px] text-rose-700">µg/m³</span>
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-rose-950">
            {zone.airQuality.pm10}
          </div>
          <span className="mt-1 text-[11px] text-rose-800">Dense Particulate</span>
        </div>

        {/* Wind Speed & Direction */}
        <div
          id="critical-zone-wind"
          className="rounded-lg border border-slate-200/80 bg-slate-50/70 p-3 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-xs font-medium text-slate-700">
            <span>Wind Vector</span>
            <Wind className="h-3.5 w-3.5 text-slate-500" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-slate-900">
            {zone.meteorology.windSpeed}{' '}
            <span className="text-sm font-normal text-slate-500">km/h</span>
          </div>
          <span className="mt-1 text-[11px] font-mono font-medium text-slate-600">
            Direction: {zone.meteorology.windDirection}
          </span>
        </div>

        {/* Reported Signals (24h) */}
        <div
          id="critical-zone-citizen-reports"
          className="rounded-lg border border-slate-200/80 bg-slate-50/70 p-3 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-xs font-medium text-slate-700">
            <span>Reported Signals (24h)</span>
            <Users className="h-3.5 w-3.5 text-slate-500" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-slate-900">
            {zone.monitoring.citizenReports24h}
          </div>
          <span className="mt-1 text-[11px] text-slate-500">Zone-level synthetic aggregate</span>
        </div>

        {/* Satellite Detections 24h */}
        <div
          id="critical-zone-satellite-detections"
          className="rounded-lg border border-slate-200/80 bg-slate-50/70 p-3 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-xs font-medium text-slate-700">
            <span>Satellite Detections</span>
            <Satellite className="h-3.5 w-3.5 text-slate-500" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-slate-900">
            {zone.monitoring.satelliteDetections24h}
          </div>
          <span className="mt-1 text-[11px] text-slate-500">Last 24 hours</span>
        </div>
      </div>
    </section>
  );
};
