/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Users,
  Building2,
  GraduationCap,
  Route,
  Radio,
  AlertOctagon,
  ShieldAlert,
  ArrowDownRight,
  Info,
  MapPin,
  CheckCircle2,
} from 'lucide-react';
import { SYNTHETIC_MONITORING_ZONES } from '../data/synthetic/monitoringZones.ts';

export type ExposureLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export interface HorizonExposureData {
  horizon: '24h' | '48h' | '72h';
  exposureLevel: ExposureLevel;
  populationEstimate: number;
  vulnerablePopulation: number;
  hospitalsCount: number;
  schoolsCount: number;
  majorRoads: string[];
  keyHospitals: { name: string; distanceKm: number; beds: number; tier: string }[];
  keySchools: { name: string; distanceKm: number; students: number; type: string }[];
  downwindZones: { id: string; name: string; distanceKm: number; status: string; aqi: number }[];
  impactRadiusKm: number;
}

export const SYNTHETIC_EXPOSURE_BY_HORIZON: Record<'24h' | '48h' | '72h', HorizonExposureData> = {
  '24h': {
    horizon: '24h',
    exposureLevel: 'CRITICAL',
    populationEstimate: 385000,
    vulnerablePopulation: 92400, // ~24% children & elderly
    hospitalsCount: 6,
    schoolsCount: 28,
    majorRoads: [
      'National Expressway 2 (Trans-Belt Corridor - 2.1 km SE)',
      'State Industrial Highway 19 (Primary Logistics Spine)',
      'Eastern Ring Freight Bypass Road 4',
    ],
    keyHospitals: [
      { name: 'District Trauma & Pulmonary Care Centre', distanceKm: 4.2, beds: 350, tier: 'Tier-1 Referral' },
      { name: 'Apex Industrial Health & Emergency Hospital', distanceKm: 8.6, beds: 180, tier: 'Emergency Center' },
      { name: 'Riverside Community Health Centre', distanceKm: 14.1, beds: 75, tier: 'Primary Clinic' },
    ],
    keySchools: [
      { name: 'Central Industrial Secondary Academy', distanceKm: 3.8, students: 1450, type: 'Secondary' },
      { name: 'Pragati Model Senior Secondary School', distanceKm: 7.5, students: 2100, type: 'K-12' },
      { name: 'St. Jude Technical & Polytechnic Campus', distanceKm: 11.2, students: 980, type: 'Vocational' },
      { name: 'Green Valley Elementary School', distanceKm: 15.0, students: 640, type: 'Primary' },
    ],
    downwindZones: [
      { id: 'VS-Z08', name: 'Downwind Logistics Corridor', distanceKm: 28.4, status: 'watch', aqi: 112 },
      { id: 'VS-Z05', name: 'Heavy Industrial Cluster', distanceKm: 18.2, status: 'warning', aqi: 188 },
      { id: 'VS-Z06', name: 'Urban High-Density Core', distanceKm: 27.5, status: 'watch', aqi: 142 },
    ],
    impactRadiusKm: 16.5,
  },
  '48h': {
    horizon: '48h',
    exposureLevel: 'HIGH',
    populationEstimate: 820000,
    vulnerablePopulation: 196800,
    hospitalsCount: 14,
    schoolsCount: 64,
    majorRoads: [
      'National Expressway 2 (Trans-Belt Corridor)',
      'State Industrial Highway 19',
      'Southern Agro-Industrial Connector 7',
      'Eastern Ring Freight Bypass Road 4',
    ],
    keyHospitals: [
      { name: 'District Trauma & Pulmonary Care Centre', distanceKm: 4.2, beds: 350, tier: 'Tier-1 Referral' },
      { name: 'Apex Industrial Health & Emergency Hospital', distanceKm: 8.6, beds: 180, tier: 'Emergency Center' },
      { name: 'Metro South Suburban General Hospital', distanceKm: 24.3, beds: 420, tier: 'Tertiary Hospital' },
    ],
    keySchools: [
      { name: 'Central Industrial Secondary Academy', distanceKm: 3.8, students: 1450, type: 'Secondary' },
      { name: 'Pragati Model Senior Secondary School', distanceKm: 7.5, students: 2100, type: 'K-12' },
      { name: 'Metro South Collegiate Institute', distanceKm: 23.8, students: 3400, type: 'Higher Secondary' },
    ],
    downwindZones: [
      { id: 'VS-Z08', name: 'Downwind Logistics Corridor', distanceKm: 28.4, status: 'watch', aqi: 112 },
      { id: 'VS-Z05', name: 'Heavy Industrial Cluster', distanceKm: 18.2, status: 'warning', aqi: 188 },
      { id: 'VS-Z09', name: 'Coastal Petrochemical Terminal', distanceKm: 65.0, status: 'normal', aqi: 62 },
    ],
    impactRadiusKm: 32.0,
  },
  '72h': {
    horizon: '72h',
    exposureLevel: 'MODERATE',
    populationEstimate: 1450000,
    vulnerablePopulation: 348000,
    hospitalsCount: 26,
    schoolsCount: 118,
    majorRoads: [
      'National Expressway 2 & Interstate Freight Arterials',
      'State Highway 19 & 22 Interchanges',
      'Coastal Rail & Logistics Multi-modal Spine',
    ],
    keyHospitals: [
      { name: 'Metro South Suburban General Hospital', distanceKm: 24.3, beds: 420, tier: 'Tertiary Hospital' },
      { name: 'Regional Pulmonary & Environmental Medicine Institute', distanceKm: 38.0, beds: 500, tier: 'Apex Research' },
    ],
    keySchools: [
      { name: 'Metro South Collegiate Institute', distanceKm: 23.8, students: 3400, type: 'Higher Secondary' },
      { name: 'Regional Technical University East Campus', distanceKm: 42.1, students: 5800, type: 'University' },
    ],
    downwindZones: [
      { id: 'VS-Z08', name: 'Downwind Logistics Corridor', distanceKm: 28.4, status: 'watch', aqi: 112 },
      { id: 'VS-Z09', name: 'Coastal Petrochemical Terminal', distanceKm: 65.0, status: 'normal', aqi: 62 },
      { id: 'VS-Z10', name: 'Maritime Shipping Harbor', distanceKm: 74.2, status: 'normal', aqi: 54 },
    ],
    impactRadiusKm: 52.0,
  },
};

interface ExposureIntelligencePanelProps {
  horizonKey?: '24h' | '48h' | '72h';
  plumeDirectionSummary?: string;
}

export function ExposureIntelligencePanel({
  horizonKey = '24h',
  plumeDirectionSummary = 'Southeast (SE, ~135°) downwind toward VS-Z08 corridor',
}: ExposureIntelligencePanelProps): React.JSX.Element {
  const data = SYNTHETIC_EXPOSURE_BY_HORIZON[horizonKey];

  const getExposureBadge = (level: ExposureLevel) => {
    switch (level) {
      case 'CRITICAL':
        return {
          bg: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
          dot: 'bg-rose-500',
          label: 'CRITICAL EXPOSURE',
        };
      case 'HIGH':
        return {
          bg: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
          dot: 'bg-orange-500',
          label: 'HIGH EXPOSURE',
        };
      case 'MODERATE':
        return {
          bg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          dot: 'bg-amber-500',
          label: 'MODERATE EXPOSURE',
        };
      case 'LOW':
      default:
        return {
          bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          dot: 'bg-emerald-500',
          label: 'LOW EXPOSURE',
        };
    }
  };

  const badge = getExposureBadge(data.exposureLevel);

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/90 shadow-xl overflow-hidden space-y-6 p-5 sm:p-6">
      {/* Header with Mandatory Prototype & Synthetic Labels */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              DEMO • SYNTHETIC DATA
            </span>
            <span className="text-xs text-slate-400 font-mono">VS-Z07 Focus ({data.horizon} Horizon)</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white mt-1.5 flex items-center gap-2">
            <Users className="w-5 h-5 text-cyan-400" />
            Vulnerable Population & Infrastructure Exposure Intelligence
          </h2>
        </div>

        {/* Exposure Level Badge */}
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono font-bold text-xs uppercase tracking-wider ${badge.bg}`}>
            <span className={`w-2.5 h-2.5 rounded-full ${badge.dot} animate-pulse`} />
            {badge.label}
          </div>
        </div>
      </div>

      {/* Mandatory Public Health Disclaimer Banner */}
      <div className="rounded-lg bg-amber-950/30 border border-amber-500/30 p-3.5 text-xs text-amber-200/90 flex items-start gap-3 leading-relaxed">
        <AlertOctagon className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-amber-300">Public Health & Governance Notice:</span>{' '}
          "Exposure estimates are simulated for demonstration and are not operational public-health guidance."{' '}
          <span className="text-slate-400 block sm:inline mt-1 sm:mt-0">
            Gemini is NOT used for numerical exposure estimates. All exposure figures are deterministic synthetic demo calculations.
          </span>
        </div>
      </div>

      {/* Connection to Plume Direction */}
      <div className="p-3.5 rounded-lg bg-slate-950/80 border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-cyan-300 font-medium">
          <ArrowDownRight className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>Connected Plume Vector ({data.horizon}):</span>
          <span className="text-white font-semibold">{plumeDirectionSummary}</span>
        </div>
        <div className="text-slate-400 font-mono flex items-center gap-2">
          <span>Downwind Dispersion Radius:</span>
          <strong className="text-cyan-400 font-bold">~{data.impactRadiusKm} km</strong>
        </div>
      </div>

      {/* 4 Main Numerical Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Estimated Population */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold uppercase tracking-wider">Affected Population</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black font-mono text-white">
            {data.populationEstimate.toLocaleString()}
          </div>
          <div className="text-[11px] text-rose-400 font-mono mt-1">
            ~{data.vulnerablePopulation.toLocaleString()} vulnerable (elderly/pediatric)
          </div>
        </div>

        {/* Hospitals Count */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold uppercase tracking-wider">Hospitals in Path</span>
            <Building2 className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-black font-mono text-rose-300">
            {data.hospitalsCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Healthcare facilities within downwind swath
          </div>
        </div>

        {/* Schools Count */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold uppercase tracking-wider">Schools in Path</span>
            <GraduationCap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black font-mono text-amber-300">
            {data.schoolsCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Educational institutions at risk
          </div>
        </div>

        {/* Exposure Severity Level */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold uppercase tracking-wider">Exposure Level</span>
            <ShieldAlert className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black font-mono text-rose-400">
            {data.exposureLevel}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Horizon impact severity tier
          </div>
        </div>
      </div>

      {/* Detailed Downwind Infrastructure Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
        {/* Hospitals & Healthcare Swath */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-rose-400" />
              Critical Healthcare Facilities in Plume Corridor
            </h3>
            <span className="text-[11px] font-mono text-slate-400">Top Facilities</span>
          </div>

          <div className="space-y-2">
            {data.keyHospitals.map((h, i) => (
              <div
                key={i}
                className="p-3 rounded-lg bg-slate-950/50 border border-slate-800/80 flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="font-semibold text-white">{h.name}</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">
                    {h.tier} • Capacity: <span className="text-slate-300 font-mono">{h.beds} beds</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-cyan-400 font-mono font-bold">{h.distanceKm} km SE</div>
                  <span className="text-[10px] text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20">
                    High Vulnerability
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Schools & Educational Facilities Swath */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-amber-400" />
              Educational Facilities in Plume Corridor
            </h3>
            <span className="text-[11px] font-mono text-slate-400">Top Campuses</span>
          </div>

          <div className="space-y-2">
            {data.keySchools.map((s, i) => (
              <div
                key={i}
                className="p-3 rounded-lg bg-slate-950/50 border border-slate-800/80 flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="font-semibold text-white">{s.name}</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">
                    {s.type} • Enrollment: <span className="text-slate-300 font-mono">{s.students.toLocaleString()} students</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-cyan-400 font-mono font-bold">{s.distanceKm} km SE</div>
                  <span className="text-[10px] text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                    Vulnerable Group
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Major Roads & Downwind Monitoring Zones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2 border-t border-slate-800/80">
        {/* Major Roads */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Route className="w-4 h-4 text-cyan-400" />
            Impacted Major Arterials & Transportation Corridors
          </h3>
          <ul className="space-y-2">
            {data.majorRoads.map((road, idx) => (
              <li
                key={idx}
                className="p-3 rounded-lg bg-slate-950/50 border border-slate-800/80 flex items-center gap-2.5 text-xs text-slate-200"
              >
                <Route className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="font-medium">{road}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Nearby & Downwind Monitoring Zones */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Radio className="w-4 h-4 text-purple-400" />
              Connected Downwind Monitoring Zones
            </h3>
            <span className="text-[11px] font-mono text-slate-400">Ground Telemetry</span>
          </div>

          <div className="space-y-2">
            {data.downwindZones.map((zone) => {
              const statusBadge =
                zone.status === 'critical'
                  ? 'text-rose-400 bg-rose-500/10 border-rose-500/30'
                  : zone.status === 'warning'
                    ? 'text-orange-400 bg-orange-500/10 border-orange-500/30'
                    : zone.status === 'watch'
                      ? 'text-amber-400 bg-amber-500/10 border-amber-500/30'
                      : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';

              return (
                <div
                  key={zone.id}
                  className="p-3 rounded-lg bg-slate-950/50 border border-slate-800/80 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-cyan-400 font-bold">{zone.id}</span>
                    <span className="text-white font-medium">{zone.name}</span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-slate-400 font-mono">{zone.distanceKm} km</span>
                    <span className="text-white font-mono font-bold">AQI {zone.aqi}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${statusBadge}`}>
                      {zone.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
