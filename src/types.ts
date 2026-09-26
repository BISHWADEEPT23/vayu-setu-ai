export type KpiStatus = 'normal' | 'watch' | 'warning' | 'critical' | 'neutral';

export type DataMode = 'synthetic';

export type OperationalStatus = 'normal' | 'watch' | 'warning' | 'critical';

export type FictionalRegion =
  | 'Northern Corridor'
  | 'Central Industrial Belt'
  | 'Southern Coastal Corridor';

export interface AirQualityReading {
  aqi: number;
  pm25: number;
  pm10: number;
  no2: number;
  so2: number;
  co: number;
  o3: number;
}

export interface MeteorologicalReading {
  temperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: string;
}

export interface MonitoringStats {
  groundStationOnline: boolean;
  citizenReports24h: number;
  satelliteDetections24h: number;
}

export interface MonitoringZone {
  id: string;
  name: string;
  region: FictionalRegion;
  latitude: number;
  longitude: number;
  dataMode: DataMode;
  status: OperationalStatus;
  lastUpdated: string;
  airQuality: AirQualityReading;
  meteorology: MeteorologicalReading;
  monitoring: MonitoringStats;
}

export interface PollutionEventEvidence {
  groundSensor: string;
  citizenReports: string;
  satelliteObservation: string;
  meteorologicalConsistency: string;
}

export type EventLifecycle = 'active' | 'resolved';

export interface PollutionEvent {
  eventId: string;
  zoneId: string;
  type: 'pollution_anomaly';
  status: OperationalStatus;
  lifecycle: EventLifecycle;
  message: string;
  timestamp: string;
  dataMode: DataMode;
  evidence: PollutionEventEvidence;
}

export type CitizenReportCategory =
  | 'smoke'
  | 'fire'
  | 'industrial'
  | 'traffic'
  | 'agricultural-burning'
  | 'dust'
  | 'unknown';

export interface CitizenReportFormValues {
  category: CitizenReportCategory | '';
  description: string;
  zoneId: string;
  observationTime: string;
  photo: File | null;
  pm25: string;
  pm10: string;
}

export interface CitizenReportFormErrors {
  category?: string;
  description?: string;
  zoneId?: string;
  observationTime?: string;
  photo?: string;
  pm25?: string;
  pm10?: string;
}

export interface CitizenReportValidationResult {
  valid: boolean;
  errors: CitizenReportFormErrors;
}

export interface CitizenReportSubmissionRecord {
  reportId: string;
  category: CitizenReportCategory;
  categoryLabel: string;
  description: string;
  zoneId: string;
  zoneName: string;
  zoneRegion: string;
  observationTime: string;
  photoFileName?: string;
  photoPreviewUrl?: string;
  pm25?: number;
  pm10?: number;
  submittedAt: string;
  dataMode: 'synthetic';
  sourceType: 'citizen-report';
  trustLevel: 'unverified';
}

export interface CitizenObservation {
  id: string;
  zoneId: string;
  timestamp: string;
  category: CitizenReportCategory;
  description: string;
  hasImage: boolean;
  dataMode: DataMode;
}

export type SatelliteObservationType =
  | 'thermal-anomaly'
  | 'smoke-indicator'
  | 'aerosol-anomaly';

export type SatelliteConfidenceCategory = 'low' | 'nominal' | 'high';

export interface SatelliteObservation {
  id: string;
  zoneId: string;
  timestamp: string;
  observationType: SatelliteObservationType;
  confidenceCategory: SatelliteConfidenceCategory;
  dataMode: DataMode;
}

export interface KpiCardData {
  id: string;
  title: string;
  value: string | number;
  unit?: string;
  status: KpiStatus;
  icon: React.ComponentType<{ className?: string }>;
  trend?: string;
  subtitle?: string;
}

export type NavSectionId =
  | 'overview'
  | 'live-map'
  | 'report-pollution'
  | 'hotspots'
  | 'forecast'
  | 'command-centre'
  | 'alerts'
  | 'brics-network'
  | 'data-sources'
  | 'settings';

export interface NavItemConfig {
  id: NavSectionId;
  name: string;
  headerTitle: string;
  description: string;
}

export const NAV_ITEMS_CONFIG: NavItemConfig[] = [
  {
    id: 'overview',
    name: 'Overview',
    headerTitle: 'Climate Intelligence Overview',
    description:
      'Real-time environmental intelligence for pollution detection, forecasting and coordinated response.',
  },
  {
    id: 'live-map',
    name: 'Live Map',
    headerTitle: 'Live Geospatial Map',
    description:
      'Geospatial visualization interface for ground monitoring, satellite detections, and wind layers.',
  },
  {
    id: 'report-pollution',
    name: 'Report Pollution',
    headerTitle: 'Report Pollution Incident',
    description:
      'Citizen environmental reporting interface for localized observations, images, and telemetry.',
  },
  {
    id: 'hotspots',
    name: 'Hotspots',
    headerTitle: 'Pollution Hotspots',
    description:
      'Aggregated anomaly clusters, severity ratings, and multi-source telemetry.',
  },
  {
    id: 'forecast',
    name: 'Forecast',
    headerTitle: 'Pollution Forecasts',
    description:
      'Multi-horizon atmospheric dispersion predictions and trajectory simulations.',
  },
  {
    id: 'command-centre',
    name: 'Command Centre',
    headerTitle: 'Authority Command Centre',
    description:
      'Environmental emergency coordination dashboard and action dispatch workflow.',
  },
  {
    id: 'alerts',
    name: 'Alerts',
    headerTitle: 'Early Warning & Alerts',
    description:
      'Tiered environmental alert management across local, provincial, national, and federated levels.',
  },
  {
    id: 'brics-network',
    name: 'BRICS Network',
    headerTitle: 'BRICS Climate Federation',
    description:
      'Multinational climate node registry and transboundary environmental exchange simulation.',
  },
  {
    id: 'data-sources',
    name: 'Data Sources',
    headerTitle: 'Environmental Data Sources',
    description:
      'Catalog of ground stations, satellite constellations, citizen feeds, and meteorological providers.',
  },
  {
    id: 'settings',
    name: 'Settings',
    headerTitle: 'Platform Settings',
    description:
      'System preferences, node federation parameters, threshold calibration, and access management.',
  },
];
