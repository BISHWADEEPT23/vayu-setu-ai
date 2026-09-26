import { CitizenObservation } from '../../types.ts';

export const SYNTHETIC_CITIZEN_OBSERVATIONS: CitizenObservation[] = [
  {
    id: 'CR-SYNTH-101',
    zoneId: 'VS-Z07',
    timestamp: '2026-09-19T23:55:00Z',
    category: 'industrial',
    description:
      'Thick grey plume discharging continuously from heavy industrial stack near eastern boundary.',
    hasImage: true,
    dataMode: 'synthetic',
  },
  {
    id: 'CR-SYNTH-102',
    zoneId: 'VS-Z07',
    timestamp: '2026-09-20T00:05:00Z',
    category: 'smoke',
    description:
      'Dense chemical smoke cloud settling over ground level; severe eye irritation and acrid odor reported.',
    hasImage: true,
    dataMode: 'synthetic',
  },
  {
    id: 'CR-SYNTH-103',
    zoneId: 'VS-Z07',
    timestamp: '2026-09-20T00:12:00Z',
    category: 'fire',
    description:
      'Secondary flare-up or uncontrolled open burning visible behind refinery perimeter wall.',
    hasImage: false,
    dataMode: 'synthetic',
  },
  {
    id: 'CR-SYNTH-104',
    zoneId: 'VS-Z07',
    timestamp: '2026-09-20T00:16:00Z',
    category: 'dust',
    description:
      'Heavy dark soot fallout settling on vehicles and road surfaces across western residential pocket.',
    hasImage: true,
    dataMode: 'synthetic',
  },
  {
    id: 'CR-SYNTH-105',
    zoneId: 'VS-Z08',
    timestamp: '2026-09-20T00:18:00Z',
    category: 'smoke',
    description:
      'Hazy particulate plume drifting rapidly from northwest direction along the highway transit corridor.',
    hasImage: false,
    dataMode: 'synthetic',
  },
];
