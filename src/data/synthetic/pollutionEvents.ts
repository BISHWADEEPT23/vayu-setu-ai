import { PollutionEvent } from '../../types.ts';

export const SYNTHETIC_POLLUTION_EVENTS: PollutionEvent[] = [
  {
    eventId: 'VS-E001',
    zoneId: 'VS-Z07',
    type: 'pollution_anomaly',
    status: 'critical',
    lifecycle: 'active',
    message: 'Potential high-impact pollution event detected at VS-Z07.',
    timestamp: '2026-09-20T00:20:00Z',
    dataMode: 'synthetic',
    evidence: {
      groundSensor:
        'Rapid spike detected at VS-Z07: PM2.5 reached 248.5 µg/m³ (+180% in 2h) with concurrent SO2 surge to 94.2 µg/m³.',
      citizenReports:
        '14 citizen report signals registered within a 3km radius reporting heavy dense particulate plumes and strong sulfurous odors.',
      satelliteObservation:
        'Orbital thermal-anomaly detection registered at 28.388°N, 77.317°E with dense smoke-indicator aerosol signature.',
      meteorologicalConsistency:
        'Sustained NW wind vector at 18.5 km/h accelerating transport of the particulate plume towards downwind corridor VS-Z08.',
    },
  },
];
