/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { SYNTHETIC_MONITORING_ZONES } from '../data/synthetic/monitoringZones.ts';
import { MonitoringZone, OperationalStatus } from '../types.ts';
import {
  MapPin,
  AlertTriangle,
  Flame,
  Activity,
  Wind,
  Thermometer,
  Layers,
  Compass,
  X,
  Radio,
  CheckCircle2,
  Clock,
} from 'lucide-react';

const STATUS_CONFIG: Record<
  OperationalStatus,
  {
    label: string;
    color: string;
    fillColor: string;
    textColor: string;
    bgBadge: string;
    borderBadge: string;
    ringColor: string;
    dotColor: string;
  }
> = {
  normal: {
    label: 'Normal',
    color: '#10b981',
    fillColor: '#10b981',
    textColor: 'text-emerald-700',
    bgBadge: 'bg-emerald-50',
    borderBadge: 'border-emerald-200',
    ringColor: 'rgba(16, 185, 129, 0.25)',
    dotColor: 'bg-emerald-500',
  },
  watch: {
    label: 'Watch',
    color: '#f59e0b',
    fillColor: '#f59e0b',
    textColor: 'text-amber-700',
    bgBadge: 'bg-amber-50',
    borderBadge: 'border-amber-200',
    ringColor: 'rgba(245, 158, 11, 0.25)',
    dotColor: 'bg-amber-500',
  },
  warning: {
    label: 'Warning',
    color: '#f97316',
    fillColor: '#f97316',
    textColor: 'text-orange-700',
    bgBadge: 'bg-orange-50',
    borderBadge: 'border-orange-200',
    ringColor: 'rgba(249, 115, 22, 0.25)',
    dotColor: 'bg-orange-500',
  },
  critical: {
    label: 'Critical',
    color: '#e11d48',
    fillColor: '#e11d48',
    textColor: 'text-rose-700',
    bgBadge: 'bg-rose-50',
    borderBadge: 'border-rose-200',
    ringColor: 'rgba(225, 29, 72, 0.35)',
    dotColor: 'bg-rose-600',
  },
};

export const LiveMap: React.FC = () => {
  // Highlight VS-Z07 by default as the canonical critical hotspot
  const [selectedZoneId, setSelectedZoneId] = useState<string>('VS-Z07');
  const [hoveredZoneId, setHoveredZoneId] = useState<string | null>(null);

  const zones = SYNTHETIC_MONITORING_ZONES;

  const selectedZone = useMemo(
    () => zones.find((z) => z.id === selectedZoneId) || zones[0],
    [zones, selectedZoneId]
  );

  // Geographic bounds for responsive projection
  // Lat: ~17.5 to ~31.5 -> Map range 16.5 to 32.5
  // Lon: ~72.8 to ~77.5 -> Map range 71.5 to 78.5
  const geoBounds = {
    minLat: 16.5,
    maxLat: 32.5,
    minLon: 71.5,
    maxLon: 78.5,
  };

  const svgWidth = 840;
  const svgHeight = 620;
  const paddingX = 70;
  const paddingY = 60;
  const usableWidth = svgWidth - paddingX * 2;
  const usableHeight = svgHeight - paddingY * 2;

  const projectToSvg = (lat: number, lon: number) => {
    const x =
      paddingX +
      ((lon - geoBounds.minLon) / (geoBounds.maxLon - geoBounds.minLon)) *
        usableWidth;
    // Invert Y axis: higher latitude is North (towards top)
    const y =
      paddingY +
      ((geoBounds.maxLat - lat) / (geoBounds.maxLat - geoBounds.minLat)) *
        usableHeight;
    return { x, y };
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Clear Synthetic Data Notice */}
      <section
        aria-label="Live Map Header"
        className="rounded-xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-2xs"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-900 border border-amber-200">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                DEMO • SYNTHETIC DATA
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-slate-500 font-mono">
                <Radio className="h-3 w-3 text-slate-400" />
                12 Monitored Zones
              </span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Live Geospatial Monitoring Map
            </h2>
            <p className="text-sm text-slate-600 max-w-3xl">
              Geographic telemetry across 12 synthetic monitoring zones covering
              the Northern Corridor, Central Industrial Belt, and Southern
              Coastal Corridor.
            </p>
          </div>

          {/* Critical Hotspot Quick Jump Button */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSelectedZoneId('VS-Z07')}
              className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg transition-all border ${
                selectedZoneId === 'VS-Z07'
                  ? 'bg-rose-50 text-rose-800 border-rose-300 ring-2 ring-rose-400/40'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-rose-200'
              }`}
            >
              <Flame className="h-4 w-4 text-rose-600 animate-pulse" />
              Focus Critical Hotspot (VS-Z07)
            </button>
          </div>
        </div>
      </section>

      {/* Main Map & Detail Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Geospatial Map Canvas (8 cols) */}
        <section
          aria-label="Geospatial Map Canvas"
          className="lg:col-span-8 rounded-xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-2xs overflow-hidden flex flex-col"
        >
          {/* Map Controls & Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3 mb-3">
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <Compass className="h-4 w-4 text-slate-400" />
              <span>Coverage: 16.5°N–32.5°N • 71.5°E–78.5°E</span>
            </div>
            <div className="text-xs text-slate-400 font-mono">
              Click marker to inspect telemetry
            </div>
          </div>

          {/* Interactive SVG Geographic Map */}
          <div className="relative w-full aspect-[4/3] sm:aspect-[16/11] bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 rounded-lg overflow-hidden border border-slate-800 shadow-inner flex items-center justify-center">
            {/* Ambient Background Grid & Water/Land Styling */}
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-full select-none"
              aria-label="Geographic map of 12 monitoring zones"
            >
              <defs>
                {/* Hotspot Radial Glow */}
                <radialGradient id="hotspotGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.45" />
                  <stop offset="70%" stopColor="#e11d48" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#e11d48" stopOpacity="0" />
                </radialGradient>

                {/* Corridor Region Glow */}
                <radialGradient id="corridorGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Geographic Grid Lines (Parallels & Meridians) */}
              {[18, 22, 26, 30].map((lat) => {
                const { y } = projectToSvg(lat, geoBounds.minLon);
                return (
                  <g key={`lat-${lat}`}>
                    <line
                      x1={paddingX - 20}
                      y1={y}
                      x2={svgWidth - paddingX + 20}
                      y2={y}
                      stroke="#334155"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                      strokeOpacity="0.4"
                    />
                    <text
                      x={paddingX - 25}
                      y={y + 4}
                      fill="#64748b"
                      fontSize="10"
                      fontFamily="monospace"
                      textAnchor="end"
                    >
                      {lat}°N
                    </text>
                  </g>
                );
              })}

              {[73, 75, 77].map((lon) => {
                const { x } = projectToSvg(geoBounds.minLat, lon);
                return (
                  <g key={`lon-${lon}`}>
                    <line
                      x1={x}
                      y1={paddingY - 20}
                      x2={x}
                      y2={svgHeight - paddingY + 20}
                      stroke="#334155"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                      strokeOpacity="0.4"
                    />
                    <text
                      x={x}
                      y={svgHeight - paddingY + 36}
                      fill="#64748b"
                      fontSize="10"
                      fontFamily="monospace"
                      textAnchor="middle"
                    >
                      {lon}°E
                    </text>
                  </g>
                );
              })}

              {/* Stylized Regional Corridors Backdrop */}
              {/* Northern Corridor Region Envelope */}
              <path
                d="M 520,70 Q 640,90 620,180 Q 500,160 520,70 Z"
                fill="#0ea5e9"
                fillOpacity="0.04"
                stroke="#0284c7"
                strokeWidth="1"
                strokeDasharray="2 4"
                strokeOpacity="0.3"
              />
              <text
                x="480"
                y="85"
                fill="#38bdf8"
                fontSize="11"
                fontWeight="600"
                letterSpacing="0.05em"
                fillOpacity="0.7"
              >
                NORTHERN CORRIDOR
              </text>

              {/* Central Industrial Belt Region Envelope */}
              <path
                d="M 560,190 Q 690,210 680,290 Q 540,270 560,190 Z"
                fill="#f43f5e"
                fillOpacity="0.05"
                stroke="#e11d48"
                strokeWidth="1"
                strokeDasharray="2 4"
                strokeOpacity="0.35"
              />
              <text
                x="470"
                y="215"
                fill="#fb7185"
                fontSize="11"
                fontWeight="600"
                letterSpacing="0.05em"
                fillOpacity="0.8"
              >
                CENTRAL INDUSTRIAL BELT
              </text>

              {/* Southern Coastal Corridor Region Envelope */}
              <path
                d="M 140,430 Q 300,430 330,550 Q 150,560 140,430 Z"
                fill="#10b981"
                fillOpacity="0.04"
                stroke="#059669"
                strokeWidth="1"
                strokeDasharray="2 4"
                strokeOpacity="0.3"
              />
              <text
                x="145"
                y="435"
                fill="#34d399"
                fontSize="11"
                fontWeight="600"
                letterSpacing="0.05em"
                fillOpacity="0.7"
              >
                SOUTHERN COASTAL CORRIDOR
              </text>

              {/* Regional connection inter-links */}
              <path
                d="M 590,140 L 630,230 L 250,500"
                fill="none"
                stroke="#475569"
                strokeWidth="1.5"
                strokeDasharray="6 6"
                strokeOpacity="0.25"
              />

              {/* VS-Z07 Dedicated Critical Hotspot Aura */}
              {(() => {
                const z07 = zones.find((z) => z.id === 'VS-Z07');
                if (!z07) return null;
                const { x, y } = projectToSvg(z07.latitude, z07.longitude);
                return (
                  <g key="vs-z07-hotspot-aura">
                    {/* Outer Ambient Glow */}
                    <circle
                      cx={x}
                      cy={y}
                      r="65"
                      fill="url(#hotspotGlow)"
                      className="animate-pulse"
                    />

                    {/* Animated Concentric Radar Pulse Rings */}
                    <circle
                      cx={x}
                      cy={y}
                      r="28"
                      fill="none"
                      stroke="#f43f5e"
                      strokeWidth="1.5"
                      strokeOpacity="0.6"
                      className="animate-ping origin-center"
                      style={{ transformOrigin: `${x}px ${y}px` }}
                    />
                    <circle
                      cx={x}
                      cy={y}
                      r="44"
                      fill="none"
                      stroke="#f43f5e"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                      strokeOpacity="0.5"
                    />

                    {/* Prominent Hotspot Badge Indicator */}
                    <g transform={`translate(${x + 22}, ${y - 20})`}>
                      <rect
                        x="0"
                        y="0"
                        width="132"
                        height="24"
                        rx="4"
                        fill="#881337"
                        stroke="#f43f5e"
                        strokeWidth="1"
                        fillOpacity="0.95"
                      />
                      <text
                        x="8"
                        y="16"
                        fill="#ffe4e6"
                        fontSize="10"
                        fontWeight="700"
                        letterSpacing="0.04em"
                      >
                        ⚡ CRITICAL HOTSPOT
                      </text>
                    </g>
                  </g>
                );
              })()}

              {/* 12 Synthetic Monitoring Zone Markers */}
              {zones.map((zone) => {
                const { x, y } = projectToSvg(zone.latitude, zone.longitude);
                const isSelected = selectedZoneId === zone.id;
                const isHovered = hoveredZoneId === zone.id;
                const isCriticalHotspot = zone.id === 'VS-Z07';
                const statusCfg = STATUS_CONFIG[zone.status];

                const markerRadius = isCriticalHotspot
                  ? 14
                  : isSelected
                    ? 12
                    : 9;

                return (
                  <g
                    key={zone.id}
                    id={`marker-${zone.id}`}
                    className="cursor-pointer transition-transform group"
                    onClick={() => setSelectedZoneId(zone.id)}
                    onMouseEnter={() => setHoveredZoneId(zone.id)}
                    onMouseLeave={() => setHoveredZoneId(null)}
                    role="button"
                    tabIndex={0}
                    aria-label={`${zone.name} (${zone.id}) - Status: ${zone.status}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        setSelectedZoneId(zone.id);
                      }
                    }}
                  >
                    {/* Selection Ring */}
                    {isSelected && (
                      <circle
                        cx={x}
                        cy={y}
                        r={markerRadius + 8}
                        fill="none"
                        stroke={statusCfg.color}
                        strokeWidth="2.5"
                        strokeDasharray={isCriticalHotspot ? 'none' : '3 3'}
                        strokeOpacity="0.9"
                      />
                    )}

                    {/* Hover Pulse Ring */}
                    {isHovered && !isSelected && (
                      <circle
                        cx={x}
                        cy={y}
                        r={markerRadius + 6}
                        fill="none"
                        stroke={statusCfg.color}
                        strokeWidth="1.5"
                        strokeOpacity="0.6"
                      />
                    )}

                    {/* Marker Base Drop Shadow */}
                    <circle
                      cx={x}
                      cy={y + 1}
                      r={markerRadius}
                      fill="#000000"
                      fillOpacity="0.4"
                    />

                    {/* Main Marker Circle */}
                    <circle
                      cx={x}
                      cy={y}
                      r={markerRadius}
                      fill={statusCfg.color}
                      stroke="#ffffff"
                      strokeWidth={isSelected ? '2.5' : '2'}
                      strokeOpacity="0.95"
                    />

                    {/* Marker Inner Indicator */}
                    {isCriticalHotspot ? (
                      <circle
                        cx={x}
                        cy={y}
                        r={5}
                        fill="#ffffff"
                        className="animate-pulse"
                      />
                    ) : (
                      <circle cx={x} cy={y} r={3.5} fill="#ffffff" />
                    )}

                    {/* Label Tag on Map */}
                    <g
                      transform={`translate(${x}, ${
                        y + (isCriticalHotspot ? 22 : 16)
                      })`}
                    >
                      <rect
                        x="-30"
                        y="0"
                        width="60"
                        height="16"
                        rx="3"
                        fill="#0f172a"
                        fillOpacity="0.88"
                        stroke={isSelected ? statusCfg.color : '#334155'}
                        strokeWidth={isSelected ? '1.5' : '1'}
                      />
                      <text
                        x="0"
                        y="11"
                        fill="#f8fafc"
                        fontSize="9"
                        fontWeight="600"
                        fontFamily="monospace"
                        textAnchor="middle"
                      >
                        {zone.id}
                      </text>
                    </g>
                  </g>
                );
              })}
            </svg>

            {/* Corner Stamp */}
            <div className="absolute top-3 left-3 bg-slate-900/85 backdrop-blur-xs border border-slate-700/80 px-2.5 py-1 rounded-md text-[11px] font-mono text-slate-300">
              DEMO • SYNTHETIC DATA
            </div>
          </div>

          {/* Map Footer Legend */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <span className="font-semibold text-slate-700">Status Legend:</span>

              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-emerald-500 border border-white shadow-xs" />
                <span className="text-slate-600">Normal (AQI ≤ 50)</span>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-amber-500 border border-white shadow-xs" />
                <span className="text-slate-600">Watch (AQI 51–100)</span>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-orange-500 border border-white shadow-xs" />
                <span className="text-slate-600">Warning (AQI 101–200)</span>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-rose-600 border border-white shadow-xs animate-pulse" />
                <span className="text-slate-600 font-medium">
                  Critical (AQI &gt; 200)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full font-medium">
              <Flame className="h-3.5 w-3.5 text-rose-600" />
              <span>VS-Z07 Highlighted Hotspot</span>
            </div>
          </div>
        </section>

        {/* Right: Selected Zone Telemetry Card (4 cols) */}
        <section
          aria-label="Zone Details and Telemetry"
          className="lg:col-span-4 space-y-4"
        >
          {/* Detail Card */}
          <div
            id="zone-detail-panel"
            className={`rounded-xl border bg-white p-5 sm:p-6 shadow-2xs transition-all ${
              selectedZone.id === 'VS-Z07'
                ? 'border-rose-300 ring-1 ring-rose-300/50'
                : 'border-slate-200/80'
            }`}
          >
            {/* Header with Zone ID & Status Badge */}
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-mono font-bold text-slate-800">
                    {selectedZone.id}
                  </span>
                  {selectedZone.id === 'VS-Z07' && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-rose-100 px-2 py-0.5 text-xs font-bold text-rose-800 border border-rose-300">
                      <Flame className="h-3 w-3 text-rose-600" />
                      CRITICAL HOTSPOT
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold tracking-tight text-slate-900 mt-1.5">
                  {selectedZone.name}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                  <MapPin className="h-3.5 w-3.5 text-slate-400" />
                  <span>{selectedZone.region}</span>
                </div>
              </div>

              {/* Status Badge */}
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold border ${
                  STATUS_CONFIG[selectedZone.status].bgBadge
                } ${STATUS_CONFIG[selectedZone.status].borderBadge} ${
                  STATUS_CONFIG[selectedZone.status].textColor
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    STATUS_CONFIG[selectedZone.status].dotColor
                  } ${
                    selectedZone.status === 'critical' ? 'animate-pulse' : ''
                  }`}
                />
                {STATUS_CONFIG[selectedZone.status].label.toUpperCase()}
              </span>
            </div>

            {/* Core Metrics: AQI, PM2.5, PM10 */}
            <div className="py-4 space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Air Quality Telemetry
              </h4>

              <div className="grid grid-cols-3 gap-2">
                {/* AQI */}
                <div className="rounded-lg bg-slate-50 border border-slate-200/80 p-3 text-center">
                  <span className="text-[11px] font-medium text-slate-500 block">
                    AQI
                  </span>
                  <span
                    className={`text-2xl font-bold tracking-tight block ${
                      selectedZone.airQuality.aqi > 200
                        ? 'text-rose-600'
                        : selectedZone.airQuality.aqi > 100
                          ? 'text-orange-600'
                          : selectedZone.airQuality.aqi > 50
                            ? 'text-amber-600'
                            : 'text-emerald-600'
                    }`}
                  >
                    {selectedZone.airQuality.aqi}
                  </span>
                  <span className="text-[10px] text-slate-400">Index</span>
                </div>

                {/* PM2.5 */}
                <div className="rounded-lg bg-slate-50 border border-slate-200/80 p-3 text-center">
                  <span className="text-[11px] font-medium text-slate-500 block">
                    PM2.5
                  </span>
                  <span className="text-xl font-bold tracking-tight text-slate-900 block">
                    {selectedZone.airQuality.pm25}
                  </span>
                  <span className="text-[10px] text-slate-400">µg/m³</span>
                </div>

                {/* PM10 */}
                <div className="rounded-lg bg-slate-50 border border-slate-200/80 p-3 text-center">
                  <span className="text-[11px] font-medium text-slate-500 block">
                    PM10
                  </span>
                  <span className="text-xl font-bold tracking-tight text-slate-900 block">
                    {selectedZone.airQuality.pm10}
                  </span>
                  <span className="text-[10px] text-slate-400">µg/m³</span>
                </div>
              </div>

              {/* Secondary Gases */}
              <div className="grid grid-cols-4 gap-2 pt-1">
                <div className="bg-white border border-slate-200 rounded p-2 text-center">
                  <span className="text-[10px] text-slate-400 block">NO2</span>
                  <span className="text-xs font-semibold text-slate-700">
                    {selectedZone.airQuality.no2}
                  </span>
                </div>
                <div className="bg-white border border-slate-200 rounded p-2 text-center">
                  <span className="text-[10px] text-slate-400 block">SO2</span>
                  <span className="text-xs font-semibold text-slate-700">
                    {selectedZone.airQuality.so2}
                  </span>
                </div>
                <div className="bg-white border border-slate-200 rounded p-2 text-center">
                  <span className="text-[10px] text-slate-400 block">CO</span>
                  <span className="text-xs font-semibold text-slate-700">
                    {selectedZone.airQuality.co}
                  </span>
                </div>
                <div className="bg-white border border-slate-200 rounded p-2 text-center">
                  <span className="text-[10px] text-slate-400 block">O3</span>
                  <span className="text-xs font-semibold text-slate-700">
                    {selectedZone.airQuality.o3}
                  </span>
                </div>
              </div>
            </div>

            {/* Geographical & Weather Metadata */}
            <div className="border-t border-slate-100 pt-3 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span className="text-slate-400">Coordinates:</span>
                <span className="font-mono text-slate-700">
                  {selectedZone.latitude.toFixed(3)}°N,{' '}
                  {selectedZone.longitude.toFixed(3)}°E
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span className="text-slate-400">Weather:</span>
                <span className="text-slate-700">
                  {selectedZone.meteorology.temperature}°C •{' '}
                  {selectedZone.meteorology.humidity}% RH
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span className="text-slate-400">Wind:</span>
                <span className="text-slate-700">
                  {selectedZone.meteorology.windSpeed} km/h (
                  {selectedZone.meteorology.windDirection})
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span className="text-slate-400">Ground Station:</span>
                <span
                  className={
                    selectedZone.monitoring.groundStationOnline
                      ? 'text-emerald-700 font-medium'
                      : 'text-rose-700 font-medium'
                  }
                >
                  {selectedZone.monitoring.groundStationOnline
                    ? '● Online'
                    : '○ Offline'}
                </span>
              </div>
            </div>

            {/* Critical Hotspot Warning Box */}
            {selectedZone.id === 'VS-Z07' && (
              <div className="mt-4 rounded-lg bg-rose-50 border border-rose-200 p-3 text-xs text-rose-900 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-rose-800">
                  <AlertTriangle className="h-4 w-4 text-rose-600" />
                  Hazardous Anomaly Detected
                </div>
                <p className="text-[11px] text-rose-700 leading-relaxed">
                  Heavy Smelter & Refinery Complex exceeds regulatory PM2.5 and
                  PM10 alert thresholds. Multi-source evidence fusion active.
                </p>
              </div>
            )}

            {/* Synthetic Data Notice */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span className="font-mono">DEMO • SYNTHETIC DATA</span>
              <span>Updated 2026-09-20</span>
            </div>
          </div>

          {/* Quick Zone Picker Table */}
          <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              All 12 Monitored Zones
            </h4>
            <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 pr-1 text-xs">
              {zones.map((z) => {
                const isSelected = selectedZoneId === z.id;
                const statusCfg = STATUS_CONFIG[z.status];
                return (
                  <button
                    key={z.id}
                    type="button"
                    onClick={() => setSelectedZoneId(z.id)}
                    className={`w-full py-2 px-2 flex items-center justify-between text-left rounded transition-colors ${
                      isSelected
                        ? 'bg-slate-100 text-slate-900 font-semibold'
                        : 'hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span
                        className={`h-2 w-2 rounded-full flex-shrink-0 ${statusCfg.dotColor}`}
                      />
                      <span className="font-mono text-[11px] text-slate-500">
                        {z.id}
                      </span>
                      <span className="truncate">{z.name}</span>
                    </div>
                    <div className="flex items-center gap-2 pl-2 flex-shrink-0">
                      <span className="font-bold text-slate-700">
                        AQI {z.airQuality.aqi}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
