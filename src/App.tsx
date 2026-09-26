/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { Shell } from './components/layout/Shell.tsx';
import { PlaceholderView } from './components/PlaceholderView.tsx';
import { KpiCard } from './components/KpiCard.tsx';
import { NetworkStatusPanel } from './components/NetworkStatusPanel.tsx';
import { ActivePollutionEventPanel } from './components/ActivePollutionEventPanel.tsx';
import { CriticalZonePanel } from './components/CriticalZonePanel.tsx';
import { CitizenReportForm } from './components/CitizenReportForm.tsx';
import { LiveMap } from './components/LiveMap.tsx';
import { HotspotsView } from './components/HotspotsView.tsx';
import { ForecastView } from './components/ForecastView.tsx';
import { CommandCentreView } from './components/CommandCentreView.tsx';
import { AlertsView } from './components/AlertsView.tsx';
import { BricsNetworkView } from './components/BricsNetworkView.tsx';
import {
  getOverviewKpiCards,
  getNetworkStatusStats,
  getCanonicalPollutionEvent,
  getCanonicalCriticalZone,
} from './data/selectors.ts';
import { NavSectionId, NAV_ITEMS_CONFIG } from './types.ts';

export default function App() {
  const [currentSection, setCurrentSection] = useState<NavSectionId>('overview');

  const activeConfig =
    NAV_ITEMS_CONFIG.find((item) => item.id === currentSection) || NAV_ITEMS_CONFIG[0];

  // Derived datasets and metrics computed via pure selectors
  const overviewKpis = useMemo(() => getOverviewKpiCards(), []);
  const networkStats = useMemo(() => getNetworkStatusStats(), []);
  const canonicalEvent = useMemo(() => getCanonicalPollutionEvent(), []);
  const canonicalCriticalZone = useMemo(() => getCanonicalCriticalZone(), []);

  return (
    <Shell
      currentSection={currentSection}
      onSelectSection={setCurrentSection}
      headerTitle={activeConfig.headerTitle}
    >
      {currentSection === 'overview' ? (
        <div className="space-y-6">
          <section
            id="overview-content-section"
            aria-labelledby="overview-title"
            className="rounded-xl border border-slate-200/80 bg-white p-6 sm:p-8 lg:p-10 shadow-2xs"
          >
            <div className="max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-2 rounded-md bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-800 border border-teal-200/60">
                <span className="h-1.5 w-1.5 rounded-full bg-teal-600" />
                Gate 1F: Hardened Prototype
              </div>
              <h2
                id="overview-title"
                className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900"
              >
                Climate Intelligence Overview
              </h2>
              <p
                id="overview-subtitle"
                className="text-base sm:text-lg text-slate-600 leading-relaxed"
              >
                Real-time environmental intelligence for pollution detection,
                forecasting and coordinated response.
              </p>
            </div>
          </section>

          {/* 6 Reusable KPI Cards Grid with derived counts */}
          <section
            id="overview-kpi-grid-section"
            aria-label="Environmental Intelligence Key Performance Indicators"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {overviewKpis.map((kpi) => (
                <KpiCard
                  key={kpi.id}
                  id={kpi.id}
                  title={kpi.title}
                  value={kpi.value}
                  unit={kpi.unit}
                  status={kpi.status}
                  icon={kpi.icon}
                  subtitle={kpi.subtitle}
                />
              ))}
            </div>
          </section>

          {/* Network Status Panel */}
          <NetworkStatusPanel stats={networkStats} />

          {/* Active Pollution Event Panel */}
          <ActivePollutionEventPanel event={canonicalEvent} />

          {/* Critical Zone Panel */}
          <CriticalZonePanel zone={canonicalCriticalZone} />
        </div>
      ) : currentSection === 'live-map' ? (
        <LiveMap />
      ) : currentSection === 'hotspots' ? (
        <HotspotsView />
      ) : currentSection === 'forecast' ? (
        <ForecastView />
      ) : currentSection === 'command-centre' ? (
        <CommandCentreView />
      ) : currentSection === 'alerts' ? (
        <AlertsView />
      ) : currentSection === 'brics-network' ? (
        <BricsNetworkView />
      ) : currentSection === 'report-pollution' ? (
        <CitizenReportForm />
      ) : (
        <PlaceholderView
          title={activeConfig.name}
          description={activeConfig.description}
          sectionId={activeConfig.id}
        />
      )}
    </Shell>
  );
}
