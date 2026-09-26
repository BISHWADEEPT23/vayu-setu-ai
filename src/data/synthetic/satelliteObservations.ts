import { SatelliteObservation } from '../../types.ts';

export const SYNTHETIC_SATELLITE_OBSERVATIONS: SatelliteObservation[] = [
  {
    id: 'SAT-SYNTH-801',
    zoneId: 'VS-Z07',
    timestamp: '2026-09-19T23:50:00Z',
    observationType: 'thermal-anomaly',
    confidenceCategory: 'high',
    dataMode: 'synthetic',
  },
  {
    id: 'SAT-SYNTH-802',
    zoneId: 'VS-Z07',
    timestamp: '2026-09-20T00:02:00Z',
    observationType: 'smoke-indicator',
    confidenceCategory: 'high',
    dataMode: 'synthetic',
  },
  {
    id: 'SAT-SYNTH-803',
    zoneId: 'VS-Z07',
    timestamp: '2026-09-20T00:15:00Z',
    observationType: 'aerosol-anomaly',
    confidenceCategory: 'high',
    dataMode: 'synthetic',
  },
  {
    id: 'SAT-SYNTH-804',
    zoneId: 'VS-Z06',
    timestamp: '2026-09-19T23:45:00Z',
    observationType: 'aerosol-anomaly',
    confidenceCategory: 'nominal',
    dataMode: 'synthetic',
  },
  {
    id: 'SAT-SYNTH-805',
    zoneId: 'VS-Z08',
    timestamp: '2026-09-20T00:18:00Z',
    observationType: 'smoke-indicator',
    confidenceCategory: 'nominal',
    dataMode: 'synthetic',
  },
];
