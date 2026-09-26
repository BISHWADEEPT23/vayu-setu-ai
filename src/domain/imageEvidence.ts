/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CitizenReportSubmissionRecord } from '../types.ts';
import {
  ALLOWED_IMAGE_MIME_TYPES,
  MAX_IMAGE_SIZE_BYTES,
} from '../validation/citizenReportValidation.ts';

export type ImageEvidenceStatus =
  | 'local-only'
  | 'ready-for-analysis'
  | 'analysis-complete'
  | 'rejected';

export interface ImageEvidence {
  evidenceId: string;
  sourceReportId: string;

  fileName: string;
  mimeType: string;
  sizeBytes: number;

  createdAt: string;

  dataMode: 'synthetic';
  sourceType: 'citizen-image';
  trustLevel: 'unverified';

  storageMode: 'memory-only';
  analysisStatus: ImageEvidenceStatus;

  exifRead: false;
  uploaded: false;
}

export interface ImageFileDescriptor {
  name: string;
  type: string;
  size: number;
}

/**
 * Generates a transient non-PII identifier in format:
 * IMG-[timestamp]-[random]
 * Does not derive from filename, description, location, or sensor values.
 */
export function generateImageEvidenceId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `IMG-${timestamp}-${random}`;
}

/**
 * Creates an ImageEvidence metadata record only when a valid local image exists.
 * Reuses Gate 2B validation rules:
 * - Allowed MIME types: image/jpeg, image/png, image/webp
 * - Maximum size: 10 MB (10 * 1024 * 1024 bytes)
 *
 * Privacy Boundaries:
 * - EXIF metadata is NOT read
 * - GPS coordinates are NOT extracted
 * - Raw image data is NOT uploaded or persisted
 * - Image is NOT converted to base64
 * - Contains metadata only; raw File object is NOT stored
 * - Initial analysisStatus is strictly 'ready-for-analysis'
 */
export function createImageEvidence(
  report: CitizenReportSubmissionRecord,
  file?: ImageFileDescriptor | File | null
): ImageEvidence | null {
  if (!file || !file.name || typeof file.size !== 'number' || typeof file.type !== 'string') {
    return null;
  }

  // Reused Gate 2B MIME type validation
  if (!ALLOWED_IMAGE_MIME_TYPES.includes(file.type)) {
    return null;
  }

  // Reused Gate 2B file size threshold (max 10 MB)
  if (file.size <= 0 || file.size > MAX_IMAGE_SIZE_BYTES) {
    return null;
  }

  return {
    evidenceId: generateImageEvidenceId(),
    sourceReportId: report.reportId,

    fileName: file.name,
    mimeType: file.type,
    sizeBytes: file.size,

    createdAt: new Date().toISOString(),

    dataMode: 'synthetic',
    sourceType: 'citizen-image',
    trustLevel: 'unverified',

    storageMode: 'memory-only',
    analysisStatus: 'ready-for-analysis',

    exifRead: false,
    uploaded: false,
  };
}
