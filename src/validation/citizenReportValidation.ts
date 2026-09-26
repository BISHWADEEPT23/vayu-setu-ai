import {
  CitizenReportCategory,
  CitizenReportFormValues,
  CitizenReportFormErrors,
  CitizenReportValidationResult,
  MonitoringZone,
} from '../types.ts';
import { SYNTHETIC_MONITORING_ZONES } from '../data/synthetic/monitoringZones.ts';

export const VALID_CITIZEN_REPORT_CATEGORIES: readonly CitizenReportCategory[] = [
  'smoke',
  'fire',
  'industrial',
  'traffic',
  'agricultural-burning',
  'dust',
  'unknown',
] as const;

export const ALLOWED_IMAGE_MIME_TYPES: readonly string[] = [
  'image/jpeg',
  'image/png',
  'image/webp',
] as const;

export const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB maximum
export const MAX_DESCRIPTION_LENGTH = 500;
export const MAX_FUTURE_TIME_BUFFER_MS = 5 * 60 * 1000; // 5 minutes in the future

/**
 * Validates citizen pollution report form values against strict business rules.
 * Business rules:
 * - Category must be one of the 7 supported categories
 * - Zone ID must exist in canonical SYNTHETIC_MONITORING_ZONES
 * - Description is required and must not exceed 500 characters
 * - Observation time is required and cannot exceed 5 minutes in the future
 * - PM2.5 is optional; if provided, must be numeric and >= 0 (no arbitrary upper limits)
 * - PM10 is optional; if provided, must be numeric and >= 0 (no arbitrary upper limits)
 * - Photo is optional; if provided, must be JPEG, PNG, or WebP format
 * - Photo size cannot exceed 10 MB
 */
export function validateCitizenReport(
  values: CitizenReportFormValues,
  zones: readonly MonitoringZone[] = SYNTHETIC_MONITORING_ZONES,
  referenceNow: Date = new Date()
): CitizenReportValidationResult {
  const errors: CitizenReportFormErrors = {};

  // 1. Category validation
  if (!values.category) {
    errors.category = 'Pollution Category is required.';
  } else if (!VALID_CITIZEN_REPORT_CATEGORIES.includes(values.category as CitizenReportCategory)) {
    errors.category = 'Invalid category. Must be one of the 7 supported classifications.';
  }

  // 2. Zone ID validation
  if (!values.zoneId) {
    errors.zoneId = 'Please select a reference monitoring zone.';
  } else {
    const matchedZone = zones.find((z) => z.id === values.zoneId);
    if (!matchedZone) {
      errors.zoneId = 'Invalid monitoring zone ID. Must exist in canonical network.';
    }
  }

  // 3. Description validation
  if (!values.description || values.description.trim() === '') {
    errors.description = 'Incident description is required.';
  } else if (values.description.length > MAX_DESCRIPTION_LENGTH) {
    errors.description = `Description cannot exceed ${MAX_DESCRIPTION_LENGTH} characters.`;
  }

  // 4. Observation Time validation
  if (!values.observationTime) {
    errors.observationTime = 'Observation date and time is required.';
  } else {
    const obsTime = new Date(values.observationTime).getTime();
    if (isNaN(obsTime)) {
      errors.observationTime = 'Invalid observation date and time format.';
    } else {
      const maxAllowedTime = referenceNow.getTime() + MAX_FUTURE_TIME_BUFFER_MS;
      if (obsTime > maxAllowedTime) {
        errors.observationTime =
          'Observation time cannot be more than 5 minutes in the future.';
      }
    }
  }

  // 5. PM2.5 validation (Optional, numeric, >= 0, NO arbitrary upper limit)
  if (values.pm25 !== undefined && values.pm25 !== null && values.pm25.trim() !== '') {
    const pm25Num = Number(values.pm25);
    if (isNaN(pm25Num) || pm25Num < 0) {
      errors.pm25 = 'PM2.5 must be a valid non-negative number (≥ 0 µg/m³).';
    }
  }

  // 6. PM10 validation (Optional, numeric, >= 0, NO arbitrary upper limit)
  if (values.pm10 !== undefined && values.pm10 !== null && values.pm10.trim() !== '') {
    const pm10Num = Number(values.pm10);
    if (isNaN(pm10Num) || pm10Num < 0) {
      errors.pm10 = 'PM10 must be a valid non-negative number (≥ 0 µg/m³).';
    }
  }

  // 7. Photo Evidence validation
  if (values.photo) {
    if (!ALLOWED_IMAGE_MIME_TYPES.includes(values.photo.type)) {
      errors.photo = 'Photo must be an image in JPEG, PNG, or WebP format.';
    } else if (values.photo.size > MAX_IMAGE_SIZE_BYTES) {
      errors.photo = 'Photo size cannot exceed 10 MB.';
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Generates a transient, non-PII report ID for local prototype session validation.
 * Format: CR-[timestamp]-[randomHex]
 */
export function generateTransientReportId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `CR-${timestamp}-${randomSuffix}`;
}

/**
 * Look up canonical zone from synthetic dataset.
 * Does not hard-code zone names or regions.
 */
export function lookupZoneById(
  zoneId: string,
  zones: readonly MonitoringZone[] = SYNTHETIC_MONITORING_ZONES
): MonitoringZone | undefined {
  return zones.find((z) => z.id === zoneId);
}
