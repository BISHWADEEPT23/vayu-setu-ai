import {
  SYNTHETIC_MONITORING_ZONES,
  SYNTHETIC_POLLUTION_EVENTS,
  SYNTHETIC_CITIZEN_OBSERVATIONS,
  SYNTHETIC_SATELLITE_OBSERVATIONS,
} from './synthetic/index.ts';
import { MonitoringZone, PollutionEvent, KpiCardData } from '../types.ts';
import {
  Activity,
  Flame,
  ShieldAlert,
  Users,
  Satellite,
  TrendingUp,
} from 'lucide-react';

export interface OverviewDerivedMetrics {
  onlineMonitoringStationsCount: number;
  activePollutionEventsCount: number;
  criticalAlertsCount: number;
  citizenReportsCount: number;
  satelliteDetectionsCount: number;
}

export interface NetworkStatusStats {
  normalCount: number;
  watchCount: number;
  warningCount: number;
  criticalCount: number;
  totalZonesCount: number;
  totalRegionsCount: number;
}

/**
 * Returns derived KPI counters computed dynamically from the synthetic datasets.
 */
export function getOverviewDerivedMetrics(): OverviewDerivedMetrics {
  const onlineMonitoringStationsCount = SYNTHETIC_MONITORING_ZONES.filter(
    (zone) => zone.monitoring.groundStationOnline === true
  ).length;

  const activeEvents = SYNTHETIC_POLLUTION_EVENTS.filter(
    (event) => event.lifecycle === 'active'
  );
  const activePollutionEventsCount = activeEvents.length;

  const criticalAlertsCount = activeEvents.filter(
    (event) => event.status === 'critical'
  ).length;

  const citizenReportsCount = SYNTHETIC_CITIZEN_OBSERVATIONS.length;

  const satelliteDetectionsCount = SYNTHETIC_SATELLITE_OBSERVATIONS.length;

  return {
    onlineMonitoringStationsCount,
    activePollutionEventsCount,
    criticalAlertsCount,
    citizenReportsCount,
    satelliteDetectionsCount,
  };
}

/**
 * Returns network status counts categorized by operational status and region totals.
 */
export function getNetworkStatusStats(): NetworkStatusStats {
  let normalCount = 0;
  let watchCount = 0;
  let warningCount = 0;
  let criticalCount = 0;

  const regionsSet = new Set<string>();

  for (const zone of SYNTHETIC_MONITORING_ZONES) {
    regionsSet.add(zone.region);
    switch (zone.status) {
      case 'normal':
        normalCount++;
        break;
      case 'watch':
        watchCount++;
        break;
      case 'warning':
        warningCount++;
        break;
      case 'critical':
        criticalCount++;
        break;
    }
  }

  return {
    normalCount,
    watchCount,
    warningCount,
    criticalCount,
    totalZonesCount: SYNTHETIC_MONITORING_ZONES.length,
    totalRegionsCount: regionsSet.size,
  };
}

/**
 * Retrieves the canonical prototype event VS-E001.
 */
export function getCanonicalPollutionEvent(): PollutionEvent | undefined {
  return SYNTHETIC_POLLUTION_EVENTS.find((event) => event.eventId === 'VS-E001');
}

/**
 * Retrieves the canonical critical prototype monitoring zone VS-Z07.
 */
export function getCanonicalCriticalZone(): MonitoringZone | undefined {
  return SYNTHETIC_MONITORING_ZONES.find((zone) => zone.id === 'VS-Z07');
}

/**
 * Returns the 6 overview KPI cards with dynamically derived metrics from synthetic datasets.
 */
export function getOverviewKpiCards(): KpiCardData[] {
  const metrics = getOverviewDerivedMetrics();

  return [
    {
      id: 'kpi-monitoring-stations',
      title: 'Monitoring Stations',
      value: metrics.onlineMonitoringStationsCount,
      unit: 'nodes',
      status: 'normal',
      icon: Activity,
      subtitle: `${metrics.onlineMonitoringStationsCount} online out of ${SYNTHETIC_MONITORING_ZONES.length} zones`,
    },
    {
      id: 'kpi-active-events',
      title: 'Active Pollution Events',
      value: metrics.activePollutionEventsCount,
      unit: 'events',
      status: metrics.activePollutionEventsCount > 0 ? 'warning' : 'normal',
      icon: Flame,
      subtitle: 'Active synthetic event records',
    },
    {
      id: 'kpi-critical-alerts',
      title: 'Critical Alerts',
      value: metrics.criticalAlertsCount,
      unit: 'active',
      status: metrics.criticalAlertsCount > 0 ? 'critical' : 'normal',
      icon: ShieldAlert,
      subtitle: 'Zone VS-Z07 priority trigger',
    },
    {
      id: 'kpi-citizen-reports',
      title: 'Citizen Observation Records',
      value: metrics.citizenReportsCount,
      unit: 'records',
      status: 'watch',
      icon: Users,
      subtitle: 'Synthetic observation collection',
    },
    {
      id: 'kpi-satellite-detections',
      title: 'Satellite Detections',
      value: metrics.satelliteDetectionsCount,
      unit: 'passes',
      status: 'watch',
      icon: Satellite,
      subtitle: 'Synthetic thermal/aerosol passes',
    },
    {
      id: 'kpi-forecast-risk',
      title: 'Forecast Risk (24h)',
      value: '295',
      unit: 'AQI',
      status: 'critical',
      icon: TrendingUp,
      subtitle: 'Zone VS-Z07 critical risk (demo)',
    },
  ];
}

