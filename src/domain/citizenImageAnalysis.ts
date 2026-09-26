/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Categories that Gemini is permitted to return when interpreting
 * citizen-submitted image evidence.
 *
 * These categories describe visual interpretation only and do not
 * represent a verified pollution source or pollution event.
 */
export const CITIZEN_IMAGE_CATEGORIES = [
  'smoke',
  'fire',
  'industrial',
  'traffic',
  'agricultural-burning',
  'dust',
  'unknown',
] as const;

export type CitizenImageCategory =
  (typeof CITIZEN_IMAGE_CATEGORIES)[number];

/**
 * Additional evidence sources that may be required before an
 * EventCandidate can progress through the verification pipeline.
 *
 * Presence in this list does NOT mean that validation has occurred.
 */
export const REQUIRED_VALIDATION_TYPES = [
  'ground-sensor',
  'satellite',
  'meteorology',
  'additional-citizen-report',
  'manual-review',
] as const;

export type RequiredValidationType =
  (typeof REQUIRED_VALIDATION_TYPES)[number];

/**
 * Structured result of AI interpretation of citizen-submitted
 * image evidence.
 *
 * IMPORTANT:
 * - This is NOT a verified pollution event.
 * - visualConfidence is confidence in visual interpretation only.
 * - It must not be treated as event confidence.
 * - trustLevel remains "unverified".
 */
export interface CitizenImageAnalysis {
  analysisId: string;
  evidenceId: string;
  sourceReportId: string;

  pollutionDetected: boolean;
  probableCategory: CitizenImageCategory;

  /**
   * AI confidence in its visual interpretation.
   * Runtime validation must enforce the range 0.0–1.0.
   */
  visualConfidence: number;

  /**
   * Plain-language observations limited to visually observable
   * characteristics of the submitted image.
   */
  observations: string[];

  /**
   * Evidence sources still required for further validation.
   * These values do not indicate that those checks have occurred.
   */
  requiredValidation: RequiredValidationType[];

  analyzedAt: string;

  /**
   * Exact Gemini model that produced this analysis.
   */
  modelUsed: string;

  dataMode: 'synthetic';
  trustLevel: 'unverified';
}

/**
 * Generates a transient non-PII Analysis ID:
 * CIA-[timestamp]-[random]
 */
export function generateAnalysisId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random()
    .toString(36)
    .substring(2, 6)
    .toUpperCase();

  return `CIA-${timestamp}-${random}`;
}