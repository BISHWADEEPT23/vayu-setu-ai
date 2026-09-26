import React, { useState, useEffect, useId, useRef } from 'react';
import {
  FileText,
  AlertTriangle,
  Camera,
  CheckCircle2,
  Trash2,
  Clock,
  MapPin,
  Activity,
  ShieldCheck,
  RotateCcw,
  Tag,
  ShieldAlert,
  Database,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { SYNTHETIC_MONITORING_ZONES } from '../data/synthetic/monitoringZones.ts';
import {
  CitizenReportCategory,
  CitizenReportFormValues,
  CitizenReportFormErrors,
  CitizenReportSubmissionRecord,
} from '../types.ts';
import {
  validateCitizenReport,
  generateTransientReportId,
  lookupZoneById,
  ALLOWED_IMAGE_MIME_TYPES,
  MAX_IMAGE_SIZE_BYTES,
  MAX_DESCRIPTION_LENGTH,
} from '../validation/citizenReportValidation.ts';
import {
  createEventCandidate,
  linkImageEvidenceToCandidate,
  EventCandidate,
} from '../domain/eventCandidate.ts';
import {
  createImageEvidence,
  ImageEvidence,
} from '../domain/imageEvidence.ts';
import {
  CitizenImageAnalysis,
} from '../domain/citizenImageAnalysis.ts';

const CATEGORY_OPTIONS: { value: CitizenReportCategory; label: string }[] = [
  { value: 'smoke', label: 'Smoke' },
  { value: 'fire', label: 'Fire' },
  { value: 'industrial', label: 'Industrial' },
  { value: 'traffic', label: 'Traffic' },
  { value: 'agricultural-burning', label: 'Agricultural Burning' },
  { value: 'dust', label: 'Dust' },
  { value: 'unknown', label: 'Unknown' },
];

const getInitialObservationTime = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export const CitizenReportForm: React.FC = () => {
  const formId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form input state (strictly transient React state)
  const [values, setValues] = useState<CitizenReportFormValues>({
    category: '',
    description: '',
    zoneId: '',
    observationTime: getInitialObservationTime(),
    photo: null,
    pm25: '',
    pm10: '',
  });

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errors, setErrors] = useState<CitizenReportFormErrors>({});
  const [submission, setSubmission] =
    useState<CitizenReportSubmissionRecord | null>(null);
  const [imageEvidence, setImageEvidence] = useState<ImageEvidence | null>(null);
  const [imageAnalysis, setImageAnalysis] = useState<CitizenImageAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [eventCandidate, setEventCandidate] = useState<EventCandidate | null>(null);

  // Safely clean up local object URL when a new preview is set or component unmounts
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value as CitizenReportCategory | '';
    setValues((prev) => ({ ...prev, category: val }));
    if (errors.category) {
      setErrors((prev) => ({ ...prev, category: undefined }));
    }
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const text = e.target.value.slice(0, MAX_DESCRIPTION_LENGTH);
    setValues((prev) => ({ ...prev, description: text }));
    if (errors.description) {
      setErrors((prev) => ({ ...prev, description: undefined }));
    }
  };

  const handleZoneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setValues((prev) => ({ ...prev, zoneId: val }));
    if (errors.zoneId) {
      setErrors((prev) => ({ ...prev, zoneId: undefined }));
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValues((prev) => ({ ...prev, observationTime: val }));
    if (errors.observationTime) {
      setErrors((prev) => ({ ...prev, observationTime: undefined }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (errors.photo) {
      setErrors((prev) => ({ ...prev, photo: undefined }));
    }

    if (!files || files.length === 0) {
      return;
    }

    const file = files[0];

    // Validate MIME type
    if (!ALLOWED_IMAGE_MIME_TYPES.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        photo: 'Photo must be an image in JPEG, PNG, or WebP format.',
      }));
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    // Safety check on file size (10 MB)
    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      setErrors((prev) => ({
        ...prev,
        photo: 'Photo size cannot exceed 10 MB.',
      }));
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    // Revoke existing preview if any
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setValues((prev) => ({ ...prev, photo: file }));
  };

  const handleRemovePhoto = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setValues((prev) => ({ ...prev, photo: null }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (errors.photo) {
      setErrors((prev) => ({ ...prev, photo: undefined }));
    }
  };

  const handlePm25Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValues((prev) => ({ ...prev, pm25: val }));
    if (errors.pm25) {
      setErrors((prev) => ({ ...prev, pm25: undefined }));
    }
  };

  const handlePm10Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValues((prev) => ({ ...prev, pm10: val }));
    if (errors.pm10) {
      setErrors((prev) => ({ ...prev, pm10: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate using centralized Gate 2B validation rules
    const validation = validateCitizenReport(
      values,
      SYNTHETIC_MONITORING_ZONES,
      new Date()
    );

    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    // Lookup zone name and region dynamically from canonical synthetic dataset
    const matchedZone = lookupZoneById(values.zoneId, SYNTHETIC_MONITORING_ZONES);
    const categoryOption = CATEGORY_OPTIONS.find(
      (c) => c.value === values.category
    );

    // Build provenanced local submission record
    const submissionRecord: CitizenReportSubmissionRecord = {
      reportId: generateTransientReportId(),
      category: values.category as CitizenReportCategory,
      categoryLabel: categoryOption?.label || values.category,
      // Plain text trim on submission
      description: values.description.trim(),
      zoneId: values.zoneId,
      zoneName: matchedZone?.name || values.zoneId,
      zoneRegion: matchedZone?.region || 'Unknown Region',
      observationTime: values.observationTime,
      photoFileName: values.photo?.name,
      photoPreviewUrl: previewUrl || undefined,
      pm25: values.pm25.trim() !== '' ? Number(values.pm25) : undefined,
      pm10: values.pm10.trim() !== '' ? Number(values.pm10) : undefined,
      submittedAt: new Date().toISOString(),
      dataMode: 'synthetic',
      sourceType: 'citizen-report',
      trustLevel: 'unverified',
    };

    // Stored solely in local React state for prototype review
    setSubmission(submissionRecord);

    // Create ImageEvidence metadata when a valid local image is present
    const imgEvidence = values.photo
      ? createImageEvidence(submissionRecord, values.photo)
      : null;
    setImageEvidence(imgEvidence);
    setImageAnalysis(null);
    setAnalysisError(null);
    setEventCandidate(null);
  };

  const handleCreateCandidate = () => {
    if (!submission || eventCandidate) {
      return;
    }
    let candidate = createEventCandidate(submission);
    if (imageEvidence) {
      candidate = linkImageEvidenceToCandidate(candidate, imageEvidence);
      // If image analysis was already completed, update flag accordingly
      if (imageAnalysis) {
        candidate = {
          ...candidate,
          evidenceState: {
            ...candidate.evidenceState,
            aiImageAnalysisCompleted: true,
          },
        };
      }
    }
    setEventCandidate(candidate);
  };

  const handleAnalyzeImage = async () => {
  if (!imageEvidence || !values.photo || isAnalyzing) {
    return;
  }

  setIsAnalyzing(true);
  setAnalysisError(null);

  try {
    // Read the selected local image for transmission to the
    // server-side Gemini analysis endpoint.
    const base64Data = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (typeof reader.result !== 'string') {
          reject(new Error('Unable to read image evidence.'));
          return;
        }

        resolve(reader.result);
      };

      reader.onerror = () => {
        reject(new Error('Unable to read image evidence.'));
      };

      reader.readAsDataURL(values.photo!);
    });

    const response = await fetch('/api/analyze-image', {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        evidenceId: imageEvidence.evidenceId,
        sourceReportId: imageEvidence.sourceReportId,
        imageBase64: base64Data,
        mimeType: imageEvidence.mimeType,
      }),
    });

    if (!response.ok) {
      const errorPayload = await response
        .json()
        .catch(() => null);

      const errorMessage =
        errorPayload &&
        typeof errorPayload === 'object' &&
        'message' in errorPayload &&
        typeof errorPayload.message === 'string'
          ? errorPayload.message
          : `Image analysis failed with status ${response.status}.`;

      throw new Error(errorMessage);
    }

    const result: unknown = await response.json();

    if (
      !result ||
      typeof result !== 'object' ||
      Array.isArray(result)
    ) {
      throw new Error(
        'Image analysis returned an invalid response.'
      );
    }

    const analysis =
      result as CitizenImageAnalysis;

    /*
     * SUCCESS BOUNDARY
     *
     * State may transition to analysis-complete only after
     * the server has returned a successful structured response.
     */

    setImageAnalysis(analysis);

    setImageEvidence((prev) =>
      prev
        ? {
            ...prev,
            analysisStatus: 'analysis-complete',
          }
        : null
    );

    setEventCandidate((prev) =>
      prev
        ? {
            ...prev,

            evidenceState: {
              ...prev.evidenceState,
              aiImageAnalysisCompleted: true,
            },

            // AI image interpretation alone must never promote
            // or verify the candidate.
            status: 'pending-evidence',
            trustLevel: 'unverified',
          }
        : null
    );
  } catch (err: unknown) {
    /*
     * FAILURE BOUNDARY
     *
     * Do NOT:
     * - mark ImageEvidence analysis-complete
     * - set aiImageAnalysisCompleted true
     * - promote the EventCandidate
     * - change trustLevel
     */

    const message =
      err instanceof Error
        ? err.message
        : 'Failed to complete image analysis.';

    setAnalysisError(message);
  } finally {
    setIsAnalyzing(false);
  }
};

  const handleResetForm = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setValues({
      category: '',
      description: '',
      zoneId: '',
      observationTime: getInitialObservationTime(),
      photo: null,
      pm25: '',
      pm10: '',
    });
    setErrors({});
    setSubmission(null);
    setImageEvidence(null);
    setImageAnalysis(null);
    setIsAnalyzing(false);
    setAnalysisError(null);
    setEventCandidate(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div id="citizen-report-view-container" className="w-full max-w-4xl mx-auto space-y-6">
      {/* View Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="inline-flex items-center gap-2 rounded-md bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-800 border border-teal-200/60 mb-2">
          <span className="h-1.5 w-1.5 rounded-full bg-teal-600" />
          Gate 2B: Validated Citizen Reporting
        </div>
        <h2 id="citizen-report-heading" className="text-2xl font-bold tracking-tight text-slate-900">
          Report Pollution Incident
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Submit observed local smoke, particulate, or industrial emissions. All reports undergo client-side validation and remain in local session memory.
        </p>
      </div>

      {/* Privacy Notice Card */}
      <div
        id="citizen-report-privacy-notice"
        className="rounded-xl border border-amber-200/80 bg-amber-50/70 p-4 text-amber-900 shadow-xs"
        role="region"
        aria-label="Privacy and prototype notice"
      >
        <div className="flex items-start gap-3">
          <ShieldCheck className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" aria-hidden="true" />
          <div className="space-y-1 text-xs sm:text-sm">
            <p className="font-semibold text-amber-950">
              Prototype Reporting Privacy Notice
            </p>
            <p className="text-amber-900/90 leading-relaxed">
              Prototype reporting interface. Do not include names, phone numbers, addresses or other personal information in the description.
            </p>
            <p className="text-amber-900/90 leading-relaxed">
              Images are kept in transient session memory and are not persisted by this prototype. If you choose AI image analysis, the selected image is transmitted to the server-side AI analysis service for processing.
            </p>
          </div>
        </div>
      </div>

      {/* Local Success Confirmation State */}
      {submission ? (
        <div
          id="citizen-report-success-panel"
          className="rounded-xl border border-teal-200 bg-white p-6 shadow-xs space-y-6"
          role="status"
          aria-live="polite"
        >
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-100 pb-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-700">
                <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Report captured locally for prototype validation.
                </h3>
                <p className="mt-0.5 text-xs sm:text-sm text-slate-600">
                  Report ID: <span className="font-mono font-semibold text-slate-900">{submission.reportId}</span> • Recorded at {new Date(submission.submittedAt).toLocaleTimeString()}
                </p>
              </div>
            </div>

            {/* Provenance Badges */}
            <div className="flex flex-wrap items-center gap-1.5 shrink-0 text-[11px]">
              <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-0.5 font-mono text-slate-700 border border-slate-200">
                mode: {submission.dataMode}
              </span>
              <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-0.5 font-mono text-slate-700 border border-slate-200">
                source: {submission.sourceType}
              </span>
              <span className="inline-flex items-center gap-1 rounded bg-amber-50 px-2 py-0.5 font-mono text-amber-800 border border-amber-200">
                trust: {submission.trustLevel}
              </span>
            </div>
          </div>

          {/* Captured Data Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-lg bg-slate-50 p-4 border border-slate-200/80 text-sm">
            <div>
              <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Pollution Category</span>
              <p className="mt-0.5 font-semibold text-slate-900">{submission.categoryLabel}</p>
            </div>

            <div>
              <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Monitoring Zone & Region</span>
              <p className="mt-0.5 font-semibold text-slate-900">
                {submission.zoneId} — {submission.zoneName}
              </p>
              <p className="text-xs text-slate-600 font-medium mt-0.5">
                Region: <span className="text-slate-800">{submission.zoneRegion}</span>
              </p>
            </div>

            <div>
              <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Observation Time</span>
              <p className="mt-0.5 font-mono text-slate-800">{submission.observationTime.replace('T', ' ')}</p>
            </div>

            <div>
              <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Self-Reported Sensor Readings</span>
              <p className="mt-0.5 text-slate-800">
                {submission.pm25 !== undefined || submission.pm10 !== undefined ? (
                  <span className="space-x-3">
                    {submission.pm25 !== undefined && (
                      <span className="font-mono bg-white px-2 py-0.5 rounded border border-slate-200 text-xs">
                        PM2.5: {submission.pm25} µg/m³
                      </span>
                    )}
                    {submission.pm10 !== undefined && (
                      <span className="font-mono bg-white px-2 py-0.5 rounded border border-slate-200 text-xs">
                        PM10: {submission.pm10} µg/m³
                      </span>
                    )}
                  </span>
                ) : (
                  <span className="italic text-slate-400">None provided</span>
                )}
              </p>
              <p className="mt-1 text-[11px] text-slate-500 italic">
                Values are explicitly self-reported and never merged with monitoring-station telemetry.
              </p>
            </div>

            <div className="md:col-span-2 border-t border-slate-200 pt-3">
              <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Description (Plain Text)</span>
              <p className="mt-1 text-slate-800 whitespace-pre-wrap leading-relaxed">{submission.description}</p>
            </div>

            {submission.photoFileName && (
              <div className="md:col-span-2 border-t border-slate-200 pt-3">
                <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Photo Evidence (Local Preview)</span>
                <p className="mt-0.5 text-xs text-slate-600 font-mono">{submission.photoFileName}</p>
                {submission.photoPreviewUrl && (
                  <div className="mt-2 max-w-xs overflow-hidden rounded-lg border border-slate-200">
                    <img
                      src={submission.photoPreviewUrl}
                      alt="Local report preview"
                      className="h-44 w-full object-cover"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="rounded-lg bg-teal-50/70 border border-teal-200/80 p-3 text-xs text-teal-900">
            <span className="font-semibold">Local Session Isolation:</span> This submitted report remains strictly in transient React component state. It has not modified any canonical datasets, triggered background tasks, called external APIs, or persisted to disk.
          </div>

          {/* Event Candidate Section */}
          {eventCandidate && (
            <div
              id="event-candidate-panel"
              className="rounded-xl border border-amber-300 bg-amber-50/50 p-5 space-y-4 text-slate-900 shadow-2xs"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-200 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold tracking-wider text-amber-950 uppercase">
                    EVENT CANDIDATE
                  </span>
                </div>
                {/* Prominent Badge */}
                <span
                  id="event-candidate-pending-badge"
                  className="inline-flex items-center gap-1.5 rounded-md bg-amber-500 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-2xs"
                >
                  PENDING EVIDENCE
                </span>
              </div>

              {/* Exact Explanatory Message */}
              <div className="rounded-lg bg-amber-100 border border-amber-300 px-3.5 py-2 text-xs font-semibold text-amber-950">
                This candidate is not a verified pollution event.
              </div>

              {/* Candidate Metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 text-xs">
                <div className="bg-white p-3 rounded-lg border border-amber-200/80 shadow-2xs">
                  <span className="text-[11px] font-medium uppercase tracking-wider text-slate-500">Candidate ID</span>
                  <p className="mt-0.5 font-mono font-bold text-slate-900">{eventCandidate.candidateId}</p>
                </div>

                <div className="bg-white p-3 rounded-lg border border-amber-200/80 shadow-2xs">
                  <span className="text-[11px] font-medium uppercase tracking-wider text-slate-500">Source Report ID</span>
                  <p className="mt-0.5 font-mono font-semibold text-slate-800">{eventCandidate.sourceReportIds.join(', ')}</p>
                </div>

                <div className="bg-white p-3 rounded-lg border border-amber-200/80 shadow-2xs">
                  <span className="text-[11px] font-medium uppercase tracking-wider text-slate-500">Evidence IDs</span>
                  <p className="mt-0.5 font-mono font-semibold text-slate-800">
                    {eventCandidate.evidenceIds.length > 0 ? eventCandidate.evidenceIds.join(', ') : 'None'}
                  </p>
                </div>

                <div className="bg-white p-3 rounded-lg border border-amber-200/80 shadow-2xs">
                  <span className="text-[11px] font-medium uppercase tracking-wider text-slate-500">Zone</span>
                  <p className="mt-0.5 font-semibold text-slate-900">{eventCandidate.zoneId}</p>
                </div>

                <div className="bg-white p-3 rounded-lg border border-amber-200/80 shadow-2xs">
                  <span className="text-[11px] font-medium uppercase tracking-wider text-slate-500">Category</span>
                  <p className="mt-0.5 font-semibold capitalize text-slate-900">{eventCandidate.category}</p>
                </div>

                <div className="bg-white p-3 rounded-lg border border-amber-200/80 shadow-2xs">
                  <span className="text-[11px] font-medium uppercase tracking-wider text-slate-500">Status</span>
                  <p className="mt-0.5 font-mono font-semibold text-amber-800">{eventCandidate.status}</p>
                </div>

                <div className="bg-white p-3 rounded-lg border border-amber-200/80 shadow-2xs">
                  <span className="text-[11px] font-medium uppercase tracking-wider text-slate-500">Trust Level</span>
                  <p className="mt-0.5 font-mono font-semibold text-slate-700">{eventCandidate.trustLevel}</p>
                </div>
              </div>

              {/* Linked Image Evidence Section */}
              {eventCandidate.evidenceIds.length > 0 && imageEvidence && (
                <div
                  id="event-candidate-image-evidence-section"
                  className="rounded-lg bg-white p-4 border border-amber-200/80 shadow-2xs space-y-2.5"
                >
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-1.5">
                    Image Evidence
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 text-xs">
                    <div className="p-2.5 rounded bg-slate-50 border border-slate-100">
                      <span className="text-[11px] font-medium uppercase tracking-wider text-slate-500 block">Evidence ID</span>
                      <span className="font-mono font-bold text-slate-900 mt-0.5 block">{imageEvidence.evidenceId}</span>
                    </div>

                    <div className="p-2.5 rounded bg-slate-50 border border-slate-100">
                      <span className="text-[11px] font-medium uppercase tracking-wider text-slate-500 block">MIME Type</span>
                      <span className="font-mono text-slate-800 mt-0.5 block">{imageEvidence.mimeType}</span>
                    </div>

                    <div className="p-2.5 rounded bg-slate-50 border border-slate-100">
                      <span className="text-[11px] font-medium uppercase tracking-wider text-slate-500 block">Size</span>
                      <span className="font-mono text-slate-800 mt-0.5 block">
                        {(imageEvidence.sizeBytes / 1024).toFixed(1)} KB ({imageEvidence.sizeBytes.toLocaleString()} bytes)
                      </span>
                    </div>

                    <div className="p-2.5 rounded bg-slate-50 border border-slate-100">
                      <span className="text-[11px] font-medium uppercase tracking-wider text-slate-500 block">Analysis Status</span>
                      <span className="font-mono font-semibold text-amber-800 mt-0.5 block">{imageEvidence.analysisStatus}</span>
                    </div>

                    <div className="p-2.5 rounded bg-slate-50 border border-slate-100">
                      <span className="text-[11px] font-medium uppercase tracking-wider text-slate-500 block">Storage Mode</span>
                      <span className="font-mono text-slate-700 mt-0.5 block">{imageEvidence.storageMode}</span>
                    </div>

                    <div className="p-2.5 rounded bg-slate-50 border border-slate-100">
                      <span className="text-[11px] font-medium uppercase tracking-wider text-slate-500 block">Trust Level</span>
                      <span className="font-mono text-slate-700 mt-0.5 block">{imageEvidence.trustLevel}</span>
                    </div>
                  </div>

                  {/* Gemini Vision Analysis Action & Status */}
                  <div className="border-t border-amber-200/60 pt-3">
                    {!imageAnalysis ? (
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="text-xs text-slate-600">
                          <span className="font-medium text-slate-800">Gemini Vision AI:</span> Run objective multi-spectral visual evaluation to assess particulate emissions and plume characteristics.
                        </div>
                        <button
                          type="button"
                          id="gemini-vision-analyze-btn"
                          onClick={handleAnalyzeImage}
                          disabled={isAnalyzing}
                          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-indigo-700 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-600 disabled:opacity-60 transition-colors cursor-pointer"
                        >
                          {isAnalyzing ? (
                            <>
                              <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                              Evaluating with Gemini...
                            </>
                          ) : (
                            <>
                              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                              Analyze with Gemini Vision
                            </>
                          )}
                        </button>
                      </div>
                    ) : (
                      /* Citizen Image Analysis Result Card */
                      <div
                        id="citizen-image-analysis-card"
                        className="rounded-lg bg-indigo-50/70 border border-indigo-200 p-3.5 space-y-3"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-indigo-200/80 pb-2">
                          <div className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-indigo-700" aria-hidden="true" />
                            <span className="text-xs font-bold uppercase tracking-wider text-indigo-950">
                              Citizen Image Analysis (Gemini Vision)
                            </span>
                          </div>
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${
                              imageAnalysis.pollutionDetected
                                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            }`}
                          >
                            Pollution Detected: {imageAnalysis.pollutionDetected ? 'YES' : 'NO'}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                          <div className="p-2 bg-white rounded border border-indigo-100">
                            <span className="text-[11px] font-medium uppercase tracking-wider text-slate-500 block">Probable Category</span>
                            <span className="font-semibold capitalize text-slate-900 mt-0.5 block">{imageAnalysis.probableCategory}</span>
                          </div>

                          <div className="p-2 bg-white rounded border border-indigo-100">
  <span className="text-[11px] font-medium uppercase tracking-wider text-slate-500 block">
    AI Visual Interpretation Confidence
  </span>

  <span className="font-mono font-bold text-indigo-900 mt-0.5 block">
    {(imageAnalysis.visualConfidence * 100).toFixed(0)}%
  </span>

  <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
    This score reflects confidence in the AI&apos;s visual interpretation only.
    It is not the probability that a pollution event is verified.
  </p>
</div>
                        </div>

                        {/* Observations */}
                        <div className="space-y-1.5 text-xs">
                          <span className="font-semibold text-slate-800 block">Observations</span>
                          <ul className="list-disc list-inside space-y-1 text-slate-700 bg-white p-2.5 rounded border border-indigo-100">
                            {imageAnalysis.observations.map((obs, idx) => (
                              <li key={idx} className="leading-relaxed">
                                {obs}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Required Validations */}
                        <div className="space-y-1.5 text-xs">
                          <span className="font-semibold text-slate-800 block">Required Multi-Source Validations</span>
                          <div className="flex flex-wrap gap-1.5">
                            {imageAnalysis.requiredValidation.map((step, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center gap-1 rounded bg-white px-2 py-1 text-[11px] font-medium text-indigo-900 border border-indigo-200"
                              >
                                <CheckCircle2 className="h-3 w-3 text-indigo-600" aria-hidden="true" />
                                {step}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-indigo-200/60 font-mono">
                          <span>Model: {imageAnalysis.modelUsed}</span>
                          <span>Analyzed: {new Date(imageAnalysis.analyzedAt).toLocaleTimeString()}</span>
                        </div>
                      </div>
                    )}

                    {analysisError && (
                      <div className="mt-2.5 rounded bg-rose-50 border border-rose-200 p-2.5 text-xs text-rose-800 flex items-center justify-between gap-2">
                        <span>{analysisError}</span>
                        <button
                          type="button"
                          onClick={handleAnalyzeImage}
                          className="font-semibold underline hover:no-underline text-rose-900"
                        >
                          Retry
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Evidence State */}
              <div className="rounded-lg bg-white p-4 border border-amber-200/80 shadow-2xs space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-1.5">
                  Evidence State
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-100">
                    <span className="text-slate-600">Citizen Report</span>
                    <span className={`font-semibold ${eventCandidate.evidenceState.citizenReport ? 'text-teal-700' : 'text-slate-500'}`}>
                      {eventCandidate.evidenceState.citizenReport ? 'Yes' : 'No'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-100">
                    <span className="text-slate-600">Photo Available</span>
                    <span className={`font-semibold ${eventCandidate.evidenceState.photoAvailable ? 'text-teal-700' : 'text-slate-500'}`}>
                      {eventCandidate.evidenceState.photoAvailable ? 'Yes' : 'No'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-100">
                    <span className="text-slate-600">Ground Sensor Checked</span>
                    <span className={`font-semibold ${eventCandidate.evidenceState.groundSensorChecked ? 'text-teal-700' : 'text-slate-500'}`}>
                      {eventCandidate.evidenceState.groundSensorChecked ? 'Yes' : 'No'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-100">
                    <span className="text-slate-600">Satellite Checked</span>
                    <span className={`font-semibold ${eventCandidate.evidenceState.satelliteChecked ? 'text-teal-700' : 'text-slate-500'}`}>
                      {eventCandidate.evidenceState.satelliteChecked ? 'Yes' : 'No'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-100">
                    <span className="text-slate-600">Meteorology Checked</span>
                    <span className={`font-semibold ${eventCandidate.evidenceState.meteorologyChecked ? 'text-teal-700' : 'text-slate-500'}`}>
                      {eventCandidate.evidenceState.meteorologyChecked ? 'Yes' : 'No'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-100">
                    <span className="text-slate-600">AI Image Analysis Completed</span>
                    <span className={`font-semibold ${eventCandidate.evidenceState.aiImageAnalysisCompleted ? 'text-teal-700' : 'text-slate-500'}`}>
                      {eventCandidate.evidenceState.aiImageAnalysisCompleted ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
            {!eventCandidate ? (
              <button
                type="button"
                id="create-event-candidate-btn"
                onClick={handleCreateCandidate}
                className="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-amber-700 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2 transition-colors cursor-pointer"
              >
                Create Event Candidate
              </button>
            ) : (
              <button
                type="button"
                id="create-event-candidate-btn"
                disabled
                className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-400 border border-slate-200 cursor-not-allowed"
              >
                Candidate Created
              </button>
            )}

            <button
              type="button"
              id="citizen-report-new-btn"
              onClick={handleResetForm}
              className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-teal-700 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 transition-colors cursor-pointer"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Submit Another Report
            </button>
          </div>
        </div>
      ) : (
        /* Report Form Card */
        <form
          id="citizen-report-form"
          onSubmit={handleSubmit}
          noValidate
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-6"
        >
          {/* Section 1: Core Incident Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <FileText className="h-4 w-4 text-slate-600" aria-hidden="true" />
              Incident Identification
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* 1. Pollution Category */}
              <div>
                <label
                  htmlFor={`${formId}-category`}
                  className="block text-sm font-medium text-slate-800"
                >
                  Pollution Category <span className="text-rose-600 font-bold" aria-hidden="true">*</span>
                </label>
                <select
                  id={`${formId}-category`}
                  name="category"
                  value={values.category}
                  onChange={handleCategoryChange}
                  required
                  aria-required="true"
                  aria-invalid={!!errors.category}
                  aria-describedby={errors.category ? `${formId}-category-error` : undefined}
                  className={`mt-1.5 block w-full rounded-lg border px-3 py-2.5 text-sm text-slate-900 shadow-2xs focus:outline-hidden focus-visible:ring-2 transition-colors ${
                    errors.category
                      ? 'border-rose-300 bg-rose-50/40 text-rose-900 focus-visible:border-rose-500 focus-visible:ring-rose-500'
                      : 'border-slate-300 bg-white hover:border-slate-400 focus-visible:border-teal-500 focus-visible:ring-teal-500'
                  }`}
                >
                  <option value="" disabled>
                    Select pollution category...
                  </option>
                  {CATEGORY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p
                    id={`${formId}-category-error`}
                    role="alert"
                    className="mt-1.5 text-xs text-rose-600 flex items-center gap-1 font-medium"
                  >
                    <AlertTriangle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    {errors.category}
                  </p>
                )}
              </div>

              {/* 3. Monitoring Zone Location */}
              <div>
                <label
                  htmlFor={`${formId}-zone`}
                  className="block text-sm font-medium text-slate-800 flex items-center justify-between"
                >
                  <span>
                    Monitoring Zone <span className="text-rose-600 font-bold" aria-hidden="true">*</span>
                  </span>
                  <span className="text-[11px] font-normal text-slate-500">Canonical Dataset</span>
                </label>
                <select
                  id={`${formId}-zone`}
                  name="zoneId"
                  value={values.zoneId}
                  onChange={handleZoneChange}
                  required
                  aria-required="true"
                  aria-invalid={!!errors.zoneId}
                  aria-describedby={errors.zoneId ? `${formId}-zone-error ${formId}-zone-help` : `${formId}-zone-help`}
                  className={`mt-1.5 block w-full rounded-lg border px-3 py-2.5 text-sm text-slate-900 shadow-2xs focus:outline-hidden focus-visible:ring-2 transition-colors ${
                    errors.zoneId
                      ? 'border-rose-300 bg-rose-50/40 text-rose-900 focus-visible:border-rose-500 focus-visible:ring-rose-500'
                      : 'border-slate-300 bg-white hover:border-slate-400 focus-visible:border-teal-500 focus-visible:ring-teal-500'
                  }`}
                >
                  <option value="" disabled>
                    Select monitoring zone...
                  </option>
                  {SYNTHETIC_MONITORING_ZONES.map((zone) => (
                    <option key={zone.id} value={zone.id}>
                      {zone.id} — {zone.name}
                    </option>
                  ))}
                </select>
                <p id={`${formId}-zone-help`} className="mt-1 text-[11px] text-slate-500">
                  Select the reference monitoring zone. Browser geolocation is disabled.
                </p>
                {errors.zoneId && (
                  <p
                    id={`${formId}-zone-error`}
                    role="alert"
                    className="mt-1 text-xs text-rose-600 flex items-center gap-1 font-medium"
                  >
                    <AlertTriangle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    {errors.zoneId}
                  </p>
                )}
              </div>
            </div>

            {/* 4. Observation Time */}
            <div>
              <label
                htmlFor={`${formId}-time`}
                className="block text-sm font-medium text-slate-800"
              >
                Observation Time <span className="text-rose-600 font-bold" aria-hidden="true">*</span>
              </label>
              <div className="relative mt-1.5 max-w-md">
                <input
                  type="datetime-local"
                  id={`${formId}-time`}
                  name="observationTime"
                  value={values.observationTime}
                  onChange={handleTimeChange}
                  required
                  aria-required="true"
                  aria-invalid={!!errors.observationTime}
                  aria-describedby={errors.observationTime ? `${formId}-time-error` : undefined}
                  className={`block w-full rounded-lg border px-3 py-2.5 text-sm text-slate-900 shadow-2xs focus:outline-hidden focus-visible:ring-2 font-mono transition-colors ${
                    errors.observationTime
                      ? 'border-rose-300 bg-rose-50/40 text-rose-900 focus-visible:border-rose-500 focus-visible:ring-rose-500'
                      : 'border-slate-300 bg-white hover:border-slate-400 focus-visible:border-teal-500 focus-visible:ring-teal-500'
                  }`}
                />
              </div>
              {errors.observationTime && (
                <p
                  id={`${formId}-time-error`}
                  role="alert"
                  className="mt-1.5 text-xs text-rose-600 flex items-center gap-1 font-medium"
                >
                  <AlertTriangle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  {errors.observationTime}
                </p>
              )}
            </div>

            {/* 2. Description */}
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor={`${formId}-description`}
                  className="block text-sm font-medium text-slate-800"
                >
                  Description <span className="text-rose-600 font-bold" aria-hidden="true">*</span>
                </label>
                <span
                  id={`${formId}-char-count`}
                  className={`text-xs font-mono ${
                    values.description.length >= 480
                      ? 'text-amber-600 font-semibold'
                      : 'text-slate-500'
                  }`}
                >
                  {values.description.length} / {MAX_DESCRIPTION_LENGTH} characters
                </span>
              </div>
              <textarea
                id={`${formId}-description`}
                name="description"
                rows={4}
                maxLength={MAX_DESCRIPTION_LENGTH}
                value={values.description}
                onChange={handleDescriptionChange}
                placeholder="Describe observed smoke, odor, density, direction, or duration. Do not include personal contact details."
                required
                aria-required="true"
                aria-invalid={!!errors.description}
                aria-describedby={
                  errors.description
                    ? `${formId}-description-error ${formId}-char-count`
                    : `${formId}-char-count`
                }
                className={`mt-1.5 block w-full rounded-lg border p-3 text-sm text-slate-900 shadow-2xs focus:outline-hidden focus-visible:ring-2 transition-colors ${
                  errors.description
                    ? 'border-rose-300 bg-rose-50/40 text-rose-900 placeholder-rose-400 focus-visible:border-rose-500 focus-visible:ring-rose-500'
                    : 'border-slate-300 bg-white hover:border-slate-400 focus-visible:border-teal-500 focus-visible:ring-teal-500 placeholder-slate-400'
                }`}
              />
              {errors.description && (
                <p
                  id={`${formId}-description-error`}
                  role="alert"
                  className="mt-1.5 text-xs text-rose-600 flex items-center gap-1 font-medium"
                >
                  <AlertTriangle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  {errors.description}
                </p>
              )}
            </div>
          </div>

          {/* Section 2: Photo Evidence */}
          <div className="border-t border-slate-200 pt-5 space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <Camera className="h-4 w-4 text-slate-600" aria-hidden="true" />
              Photo Evidence
            </h3>
            <p className="text-xs text-slate-600">
              Attach a local image file for validation. Accepted formats: <span className="font-mono text-slate-700">JPEG, PNG, WebP</span> (max 10MB).
            </p>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  id={`${formId}-photo`}
                  name="photo"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                  aria-describedby={errors.photo ? `${formId}-photo-error` : undefined}
                  className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 cursor-pointer focus:outline-hidden"
                />
              </div>

              {errors.photo && (
                <p
                  id={`${formId}-photo-error`}
                  role="alert"
                  className="text-xs text-rose-600 flex items-center gap-1 font-medium"
                >
                  <AlertTriangle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  {errors.photo}
                </p>
              )}

              {/* Local Photo Preview */}
              {values.photo && previewUrl && (
                <div
                  id="citizen-report-photo-preview-box"
                  className="relative mt-2 flex items-start gap-4 rounded-lg border border-slate-200 bg-slate-50 p-3 max-w-lg"
                >
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-md border border-slate-200 bg-white">
                    <img
                      src={previewUrl}
                      alt="Selected local photo preview"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1 text-xs">
                    <p className="font-medium text-slate-900 truncate" title={values.photo.name}>
                      {values.photo.name}
                    </p>
                    <p className="text-slate-500">
                      {(values.photo.size / (1024 * 1024)).toFixed(2)} MB • {values.photo.type}
                    </p>
                    <p className="text-slate-500 italic">
                      Stored in transient session memory. Transmitted only if you choose AI image analysis; not persisted by this prototype.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    aria-label="Remove attached photo"
                    className="rounded-md p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-rose-500"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Section 3: Optional Sensor Readings */}
          <div className="border-t border-slate-200 pt-5 space-y-3">
            <div>
              <span className="text-xs font-bold tracking-wider text-slate-700 uppercase bg-slate-100 px-2 py-0.5 rounded-sm">
                OPTIONAL SELF-REPORTED SENSOR DATA
              </span>
              <p className="mt-1 text-xs text-slate-500 italic">
                Do not treat these values as authoritative measurements. Never merged with monitoring-station telemetry.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <label
                  htmlFor={`${formId}-pm25`}
                  className="block text-xs font-medium text-slate-700"
                >
                  PM2.5 (µg/m³) <span className="font-normal text-slate-400">(Optional, ≥ 0)</span>
                </label>
                <input
                  type="number"
                  id={`${formId}-pm25`}
                  name="pm25"
                  min="0"
                  step="0.1"
                  placeholder="e.g. 45.2"
                  value={values.pm25}
                  onChange={handlePm25Change}
                  aria-invalid={!!errors.pm25}
                  aria-describedby={errors.pm25 ? `${formId}-pm25-error` : undefined}
                  className={`mt-1 block w-full rounded-lg border px-3 py-2 text-sm text-slate-900 shadow-2xs focus:outline-hidden focus-visible:ring-2 font-mono transition-colors ${
                    errors.pm25
                      ? 'border-rose-300 bg-rose-50/40 text-rose-900 focus-visible:border-rose-500 focus-visible:ring-rose-500'
                      : 'border-slate-300 bg-white hover:border-slate-400 focus-visible:border-teal-500 focus-visible:ring-teal-500'
                  }`}
                />
                {errors.pm25 && (
                  <p
                    id={`${formId}-pm25-error`}
                    role="alert"
                    className="mt-1 text-xs text-rose-600 flex items-center gap-1 font-medium"
                  >
                    <AlertTriangle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    {errors.pm25}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor={`${formId}-pm10`}
                  className="block text-xs font-medium text-slate-700"
                >
                  PM10 (µg/m³) <span className="font-normal text-slate-400">(Optional, ≥ 0)</span>
                </label>
                <input
                  type="number"
                  id={`${formId}-pm10`}
                  name="pm10"
                  min="0"
                  step="0.1"
                  placeholder="e.g. 92.0"
                  value={values.pm10}
                  onChange={handlePm10Change}
                  aria-invalid={!!errors.pm10}
                  aria-describedby={errors.pm10 ? `${formId}-pm10-error` : undefined}
                  className={`mt-1 block w-full rounded-lg border px-3 py-2 text-sm text-slate-900 shadow-2xs focus:outline-hidden focus-visible:ring-2 font-mono transition-colors ${
                    errors.pm10
                      ? 'border-rose-300 bg-rose-50/40 text-rose-900 focus-visible:border-rose-500 focus-visible:ring-rose-500'
                      : 'border-slate-300 bg-white hover:border-slate-400 focus-visible:border-teal-500 focus-visible:ring-teal-500'
                  }`}
                />
                {errors.pm10 && (
                  <p
                    id={`${formId}-pm10-error`}
                    role="alert"
                    className="mt-1 text-xs text-rose-600 flex items-center gap-1 font-medium"
                  >
                    <AlertTriangle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    {errors.pm10}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="border-t border-slate-200 pt-5 flex items-center justify-between gap-4">
            <button
              type="button"
              id="citizen-report-clear-btn"
              onClick={handleResetForm}
              className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-slate-400 transition-colors cursor-pointer"
            >
              Clear Form
            </button>

            <button
              type="submit"
              id="citizen-report-submit-btn"
              className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-6 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-teal-700 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 transition-colors cursor-pointer"
            >
              Submit Report
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
