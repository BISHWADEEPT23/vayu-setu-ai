/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Wind,
  Compass,
  AlertTriangle,
  TrendingDown,
  Activity,
  Calendar,
  ShieldAlert,
  Info,
  Layers,
  ArrowDownRight,
  Gauge,
} from 'lucide-react';
import { getCanonicalCriticalZone } from '../data/selectors.ts';
import { ExposureIntelligencePanel } from './ExposureIntelligencePanel.tsx';

export interface ForecastHorizon {
  horizon: '24h' | '48h' | '72h';
  hours: number;
  label: string;
  predictedAqi: number;
  uncertaintyMin: number;
  uncertaintyMax: number;
  risk: 'critical' | 'high' | 'moderate' | 'low';
  riskLabel: string;
  description: string;
  syntheticFactors: string[];
}

/**
 * Deterministic synthetic demo forecast data for VS-Z07.
 *
 * GOVERNANCE:
 * - Gemini does NOT generate numerical forecasts.
 * - These values are deterministic synthetic benchmark parameters for UI/UX demonstration.
 */
const SYNTHETIC_HORIZONS: ForecastHorizon[] = [
  {
    horizon: '24h',
    hours: 24,
    label: '+24 Hours (Next Day)',
    predictedAqi: 295,
    uncertaintyMin: 270,
    uncertaintyMax: 320,
    risk: 'critical',
    riskLabel: 'Critical Risk',
    description: 'Persistent nocturnal thermal inversion traps surface emissions; severe stagnation anticipated.',
    syntheticFactors: ['Low boundary layer height (<350m)', 'Sustained industrial baseline', 'Dry NW wind flow'],
  },
  {
    horizon: '48h',
    hours: 48,
    label: '+48 Hours (Mid-term)',
    predictedAqi: 235,
    uncertaintyMin: 195,
    uncertaintyMax: 275,
    risk: 'high',
    riskLabel: 'High Risk',
    description: 'Marginal ventilation increase as daytime boundary layer elevates; air quality remains in Very Poor bracket.',
    syntheticFactors: ['Gradual wind velocity increase to 22 km/h', 'Moderate solar radiation mixing'],
  },
  {
    horizon: '72h',
    hours: 72,
    label: '+72 Hours (Extended)',
    predictedAqi: 168,
    uncertaintyMin: 125,
    uncertaintyMax: 215,
    risk: 'moderate',
    riskLabel: 'Moderate Risk',
    description: 'Anticipated regional airmass displacement and frontal passage inducing enhanced atmospheric dispersion.',
    syntheticFactors: ['Wind direction shift toward WNW', 'Upper-tropospheric ventilation corridor'],
  },
];

export function ForecastView(): React.JSX.Element {
  const [selectedHorizon, setSelectedHorizon] = useState<ForecastHorizon>(SYNTHETIC_HORIZONS[0]);

  // Retrieve canonical critical zone VS-Z07
  const zone = getCanonicalCriticalZone();

  const currentAqi = zone?.airQuality.aqi ?? 342;
  const currentPm25 = zone?.airQuality.pm25 ?? 248.5;
  const currentPm10 = zone?.airQuality.pm10 ?? 385.0;
  const windSpeed = zone?.meteorology.windSpeed ?? 18.5;
  const windDir = zone?.meteorology.windDirection ?? 'NW';
  const temperature = zone?.meteorology.temperature ?? 32.8;
  const humidity = zone?.meteorology.humidity ?? 33;

  // Simplified plume direction based on wind direction
  // Wind from NW blows downwind toward SE
  const plumeDirection = 'Southeast (SE, ~135°) downwind toward VS-Z08 corridor';

  return (
    <div className="space-y-6">
      {/* Top Banner: Synthetic Disclaimer & Governance */}
      <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 sm:p-5 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-3 w-3 rounded-full bg-amber-400 animate-ping" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  DEMO • SYNTHETIC DATA
                </span>
                <span className="text-xs text-slate-400 font-mono">VS-Z07 Focus</span>
              </div>
              <h1 className="text-xl font-bold text-white mt-1">
                Deterministic Atmospheric Forecast & Risk Trajectory
              </h1>
            </div>
          </div>
          <div className="text-xs text-slate-400 max-w-md text-left sm:text-right">
            <span className="font-semibold text-slate-300">Scientific Governance:</span> Gemini AI must NOT generate numerical forecasts. All values are deterministic synthetic demo projections.
          </div>
        </div>
      </div>

      {/* Primary Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Current Station Telemetry & Wind/Plume Vectors */}
        <div className="space-y-6">
          {/* Current Status Card */}
          <div className="rounded-xl border border-rose-500/30 bg-slate-900/80 p-5 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                <Activity className="w-4 h-4" /> Current Station State
              </span>
              <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                CRITICAL
              </span>
            </div>

            <div className="mb-4">
              <div className="text-2xl font-bold text-white">{zone?.name ?? 'Heavy Smelter & Refinery Complex'}</div>
              <div className="text-xs text-slate-400 font-mono mt-0.5">
                {zone?.id ?? 'VS-Z07'} • {zone?.region ?? 'Central Industrial Belt'}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-center">
              <div>
                <div className="text-[11px] text-slate-400 uppercase font-semibold">Current AQI</div>
                <div className="text-2xl font-extrabold text-rose-400 font-mono">{currentAqi}</div>
                <div className="text-[10px] text-rose-300/80">Hazardous</div>
              </div>
              <div className="border-x border-slate-800">
                <div className="text-[11px] text-slate-400 uppercase font-semibold">PM2.5</div>
                <div className="text-lg font-bold text-white font-mono mt-1">{currentPm25}</div>
                <div className="text-[10px] text-slate-500">µg/m³</div>
              </div>
              <div>
                <div className="text-[11px] text-slate-400 uppercase font-semibold">PM10</div>
                <div className="text-lg font-bold text-white font-mono mt-1">{currentPm10}</div>
                <div className="text-[10px] text-slate-500">µg/m³</div>
              </div>
            </div>
          </div>

          {/* Meteorology & Plume Dynamics Card */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Compass className="w-4 h-4 text-cyan-400" /> Meteorology & Plume Vector
              </h3>
              <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/40">
                Ground Telemetry
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Wind className="w-3.5 h-3.5 text-cyan-400" /> Wind Direction
                </div>
                <div className="text-lg font-bold font-mono text-white mt-1 flex items-baseline gap-1">
                  <span>{windDir}</span>
                  <span className="text-xs text-slate-400 font-normal">(315° NW)</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">Blowing from Northwest</div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Gauge className="w-3.5 h-3.5 text-cyan-400" /> Wind Speed
                </div>
                <div className="text-lg font-bold font-mono text-cyan-300 mt-1">
                  {windSpeed} <span className="text-xs font-normal text-slate-400">km/h</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">Moderate breeze</div>
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-950/80 border border-cyan-500/20 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-cyan-300">
                <ArrowDownRight className="w-4 h-4 text-cyan-400 shrink-0" />
                Simplified Plume Direction
              </div>
              <div className="text-sm font-semibold text-white pl-6">
                {plumeDirection}
              </div>
              <div className="text-[11px] text-amber-300/90 pl-6 leading-relaxed bg-amber-950/30 p-2 rounded border border-amber-500/20">
                ⚠️ <span className="font-semibold">Plume direction is a simplified demo based on wind, not atmospheric-dispersion modelling.</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 px-1 pt-1 border-t border-slate-800/60">
              <span>Ambient Temp: <strong className="text-slate-300">{temperature}°C</strong></span>
              <span>Relative Humidity: <strong className="text-slate-300">{humidity}%</strong></span>
            </div>
          </div>
        </div>

        {/* Center & Right Columns: 24/48/72h Horizons & Trend Visualization */}
        <div className="lg:col-span-2 space-y-6">
          {/* Horizon Selection Tabs */}
          <div className="grid grid-cols-3 gap-3">
            {SYNTHETIC_HORIZONS.map((h) => {
              const isSelected = selectedHorizon.horizon === h.horizon;
              const badgeColor =
                h.risk === 'critical'
                  ? 'text-rose-400 bg-rose-500/10 border-rose-500/30'
                  : h.risk === 'high'
                    ? 'text-orange-400 bg-orange-500/10 border-orange-500/30'
                    : 'text-amber-400 bg-amber-500/10 border-amber-500/30';

              return (
                <button
                  key={h.horizon}
                  type="button"
                  onClick={() => setSelectedHorizon(h)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-slate-800/90 border-cyan-500/60 shadow-lg shadow-cyan-950/30 ring-1 ring-cyan-500/40'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/90'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold font-mono text-cyan-400 uppercase tracking-wider">
                      {h.horizon} Risk
                    </span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${badgeColor}`}>
                      {h.riskLabel}
                    </span>
                  </div>
                  <div className="text-xl sm:text-2xl font-black font-mono text-white">
                    AQI {h.predictedAqi}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono mt-1">
                    Range: [{h.uncertaintyMin} – {h.uncertaintyMax}]
                  </div>
                </button>
              );
            })}
          </div>

          {/* Trend Visualization & Uncertainty Envelope */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-cyan-400" />
                  Deterministic 24h / 48h / 72h AQI Trend & Uncertainty Range
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Visualizes baseline forecast trajectory with upper and lower synthetic uncertainty bounds.
                </p>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-slate-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-cyan-400 inline-block" /> Predicted AQI
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-2 bg-cyan-500/20 border border-cyan-500/40 rounded-sm inline-block" /> Uncertainty Band
                </span>
              </div>
            </div>

            {/* SVG Trend Chart */}
            <div className="w-full bg-slate-950/70 rounded-lg p-4 border border-slate-800 relative">
              <svg viewBox="0 0 600 220" className="w-full h-48 sm:h-56 overflow-visible">
                {/* Horizontal Grid lines */}
                <line x1="40" y1="20" x2="570" y2="20" stroke="#334155" strokeDasharray="3 3" opacity="0.4" />
                <line x1="40" y1="65" x2="570" y2="65" stroke="#334155" strokeDasharray="3 3" opacity="0.4" />
                <line x1="40" y1="110" x2="570" y2="110" stroke="#334155" strokeDasharray="3 3" opacity="0.4" />
                <line x1="40" y1="155" x2="570" y2="155" stroke="#334155" strokeDasharray="3 3" opacity="0.4" />
                <line x1="40" y1="200" x2="570" y2="200" stroke="#475569" opacity="0.8" />

                {/* Y-axis Labels */}
                <text x="32" y="24" fill="#94a3b8" fontSize="10" textAnchor="end" fontFamily="monospace">400</text>
                <text x="32" y="69" fill="#94a3b8" fontSize="10" textAnchor="end" fontFamily="monospace">300</text>
                <text x="32" y="114" fill="#94a3b8" fontSize="10" textAnchor="end" fontFamily="monospace">200</text>
                <text x="32" y="159" fill="#94a3b8" fontSize="10" textAnchor="end" fontFamily="monospace">100</text>
                <text x="32" y="204" fill="#94a3b8" fontSize="10" textAnchor="end" fontFamily="monospace">0</text>

                {/* Hazardous threshold line (AQI 300) */}
                <line x1="40" y1="65" x2="570" y2="65" stroke="#f43f5e" strokeWidth="1" strokeDasharray="4 2" opacity="0.6" />
                <text x="565" y="60" fill="#f43f5e" fontSize="9" textAnchor="end" fontWeight="bold">Hazardous Threshold (300)</text>

                {/* Points:
                    Now: x=70, aqi=342 -> y = 200 - (342/400)*180 = 200 - 153.9 = 46.1
                    24h: x=230, aqi=295 (min: 270, max: 320)
                         y_pred = 200 - (295/400)*180 = 67.25
                         y_min = 200 - (270/400)*180 = 78.5
                         y_max = 200 - (320/400)*180 = 56.0
                    48h: x=390, aqi=235 (min: 195, max: 275)
                         y_pred = 200 - (235/400)*180 = 94.25
                         y_min = 200 - (195/400)*180 = 112.25
                         y_max = 200 - (275/400)*180 = 76.25
                    72h: x=540, aqi=168 (min: 125, max: 215)
                         y_pred = 200 - (168/400)*180 = 124.4
                         y_min = 200 - (125/400)*180 = 143.75
                         y_max = 200 - (215/400)*180 = 103.25
                */}

                {/* Uncertainty Polygon Area */}
                <polygon
                  points="70,46 230,56 390,76.25 540,103.25 540,143.75 390,112.25 230,78.5 70,46"
                  fill="rgba(6, 182, 212, 0.15)"
                  stroke="rgba(6, 182, 212, 0.4)"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                />

                {/* Connecting Trend Line */}
                <polyline
                  points="70,46.1 230,67.25 390,94.25 540,124.4"
                  fill="none"
                  stroke="#06b6d4"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Data Points */}
                {/* Now */}
                <circle cx="70" cy="46.1" r="5" fill="#f43f5e" stroke="#fff" strokeWidth="2" />
                <text x="70" y="34" fill="#f43f5e" fontSize="10" textAnchor="middle" fontWeight="bold">342</text>
                <text x="70" y="215" fill="#94a3b8" fontSize="10" textAnchor="middle">Current</text>

                {/* 24h */}
                <circle cx="230" cy="67.25" r="5" fill="#f43f5e" stroke="#fff" strokeWidth="2" />
                <text x="230" y="52" fill="#f43f5e" fontSize="10" textAnchor="middle" fontWeight="bold">295</text>
                <text x="230" y="215" fill="#94a3b8" fontSize="10" textAnchor="middle">+24h</text>
                <line x1="230" y1="56" x2="230" y2="78.5" stroke="#f43f5e" strokeWidth="1.5" />

                {/* 48h */}
                <circle cx="390" cy="94.25" r="5" fill="#fb923c" stroke="#fff" strokeWidth="2" />
                <text x="390" y="70" fill="#fb923c" fontSize="10" textAnchor="middle" fontWeight="bold">235</text>
                <text x="390" y="215" fill="#94a3b8" fontSize="10" textAnchor="middle">+48h</text>
                <line x1="390" y1="76.25" x2="390" y2="112.25" stroke="#fb923c" strokeWidth="1.5" />

                {/* 72h */}
                <circle cx="540" cy="124.4" r="5" fill="#fbbf24" stroke="#fff" strokeWidth="2" />
                <text x="540" y="98" fill="#fbbf24" fontSize="10" textAnchor="middle" fontWeight="bold">168</text>
                <text x="540" y="215" fill="#94a3b8" fontSize="10" textAnchor="middle">+72h</text>
                <line x1="540" y1="103.25" x2="540" y2="143.75" stroke="#fbbf24" strokeWidth="1.5" />
              </svg>
            </div>
          </div>

          {/* Selected Horizon Deep Dive Details */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-cyan-400" />
                Horizon Profile: {selectedHorizon.label}
              </h3>
              <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold uppercase ${
                selectedHorizon.risk === 'critical'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  : selectedHorizon.risk === 'high'
                    ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}>
                {selectedHorizon.riskLabel}
              </span>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              {selectedHorizon.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                <div className="text-[11px] text-slate-400 font-semibold uppercase">Predicted AQI</div>
                <div className="text-xl font-bold font-mono text-cyan-300 mt-1">{selectedHorizon.predictedAqi}</div>
                <div className="text-[10px] text-slate-500">Deterministic benchmark</div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                <div className="text-[11px] text-slate-400 font-semibold uppercase">Uncertainty Envelope</div>
                <div className="text-xl font-bold font-mono text-white mt-1">
                  ±{Math.round((selectedHorizon.uncertaintyMax - selectedHorizon.uncertaintyMin) / 2)}
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  [{selectedHorizon.uncertaintyMin} – {selectedHorizon.uncertaintyMax}]
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                <div className="text-[11px] text-slate-400 font-semibold uppercase">Risk Classification</div>
                <div className="text-lg font-bold font-mono text-amber-300 mt-1 uppercase">
                  {selectedHorizon.risk}
                </div>
                <div className="text-[10px] text-slate-500">Advisory impact tier</div>
              </div>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-slate-500" /> Synthetic Atmospheric Drivers
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                {selectedHorizon.syntheticFactors.map((factor, idx) => (
                  <li key={idx} className="flex items-center gap-2 p-2 rounded bg-slate-950/40 border border-slate-800/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                    <span>{factor}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Gate 4B: Connected Exposure Intelligence Panel */}
      <ExposureIntelligencePanel
        horizonKey={selectedHorizon.horizon}
        plumeDirectionSummary={plumeDirection}
      />
    </div>
  );
}
