/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CitizenReportSubmissionRecord } from '../types.ts';
import { ImageEvidence } from './imageEvidence.ts';

export type EventCandidateStatus =
  | 'pending-evidence'
  | 'rejected'
  | 'promoted';

export interface EventEvidenceState {
  citizenReport: boolean;
  photoAvailable: boolean;
  groundSensorChecked: boolean;
  satelliteChecked: boolean;
  meteorologyChecked: boolean;
  aiImageAnalysisCompleted: boolean;
}

export interface EventCandidate {
  candidateId: string;
  createdAt: string;
  sourceReportIds: string[];
  evidenceIds: string[];

  zoneId: string;
  category: string;
  observationTime: string;
  description: string;

  selfReportedSensorData: {
    pm25?: number;
    pm10?: number;
  };

  evidenceState: EventEvidenceState;

  status: EventCandidateStatus;
  dataMode: 'synthetic';
  trustLevel: 'unverified';
}

/**
 * Generates a transient, non-PII Candidate ID in format:
 * EC-[timestamp]-[random]
 */
export function generateCandidateId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `EC-${timestamp}-${random}`;
}

/**
 * Transforms a valid CitizenReportSubmissionRecord into an EventCandidate.
 * Does not create or promote to a PollutionEvent.
 * Initial state is strictly 'pending-evidence' and 'unverified'.
 * Initial evidenceIds starts empty until evidence is explicitly linked.
 */
export function createEventCandidate(
  report: CitizenReportSubmissionRecord
): EventCandidate {
  return {
    candidateId: generateCandidateId(),
    createdAt: new Date().toISOString(),
    sourceReportIds: [report.reportId],
    evidenceIds: [],

    zoneId: report.zoneId,
    category: report.category,
    observationTime: report.observationTime,
    description: report.description,

    selfReportedSensorData: {
      ...(report.pm25 !== undefined ? { pm25: report.pm25 } : {}),
      ...(report.pm10 !== undefined ? { pm10: report.pm10 } : {}),
    },

    evidenceState: {
      citizenReport: true,
      photoAvailable: false,
      groundSensorChecked: false,
      satelliteChecked: false,
      meteorologyChecked: false,
      aiImageAnalysisCompleted: false,
    },

    status: 'pending-evidence',
    dataMode: 'synthetic',
    trustLevel: 'unverified',
  };
}

/**
 * Links a validated ImageEvidence record to an EventCandidate.
 * Pure function: returns a new EventCandidate if valid, or original if invalid.
 *
 * Rules:
 * - evidence.sourceReportId must exist in candidate.sourceReportIds
 * - evidence.analysisStatus must not be "rejected"
 * - evidence.evidenceId must not already exist in candidate.evidenceIds
 */
export function linkImageEvidenceToCandidate(
  candidate: EventCandidate,
  evidence: ImageEvidence
): EventCandidate {
  if (!candidate.sourceReportIds.includes(evidence.sourceReportId)) {
    return candidate;
  }

  if (evidence.analysisStatus === 'rejected') {
    return candidate;
  }

  if (candidate.evidenceIds.includes(evidence.evidenceId)) {
    return candidate;
  }

  return {
    ...candidate,
    evidenceIds: [...candidate.evidenceIds, evidence.evidenceId],
    evidenceState: {
      ...candidate.evidenceState,
      photoAvailable: true,
    },
  };
}
