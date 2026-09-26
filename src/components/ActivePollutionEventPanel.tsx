import React from 'react';
import { PollutionEvent } from '../types.ts';
import { AlertOctagon, Activity, Users, Satellite, Compass } from 'lucide-react';

interface ActivePollutionEventPanelProps {
  event?: PollutionEvent;
}

export const ActivePollutionEventPanel: React.FC<ActivePollutionEventPanelProps> = ({ event }) => {
  if (!event) {
    return null;
  }

  // Ensure evidence is presented neutrally without endorsing verification or confirmation
  const sanitizeNeutralText = (text: string): string => {
    return text
      .replace(/corroborated\s+/gi, '')
      .replace(/confirmed\s+/gi, 'recorded ');
  };

  return (
    <section
      id="active-pollution-event-panel"
      aria-labelledby="active-event-heading"
      className="rounded-xl border border-rose-200/90 bg-white p-5 sm:p-6 shadow-2xs"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-700 border border-rose-200/70">
            <AlertOctagon className="h-4 w-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3
                id="active-event-heading"
                className="text-base font-bold tracking-tight text-slate-900"
              >
                Active Pollution Event
              </h3>
              <span
                id="active-event-id"
                className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-mono font-semibold text-slate-800"
              >
                {event.eventId}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              High-priority atmospheric disturbance requiring automated multi-tier logging
            </p>
          </div>
        </div>

        <span
          id="active-event-synthetic-badge"
          className="inline-flex items-center gap-1.5 rounded-full border border-amber-300/80 bg-amber-50 px-2.5 py-0.5 text-xs font-mono font-semibold text-amber-900 tracking-wide"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
          DEMO • SYNTHETIC DATA
        </span>
      </div>

      {/* Event Details Overview */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 rounded-lg bg-slate-50 p-3.5 border border-slate-200/70 text-xs">
        <div>
          <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px]">
            Target Zone
          </span>
          <div id="event-zone-display" className="mt-0.5 text-sm font-bold font-mono text-slate-900">
            {event.zoneId}
          </div>
        </div>

        <div>
          <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px]">
            Incident Status
          </span>
          <div className="mt-0.5">
            <span
              id="event-status-display"
              className="inline-flex items-center gap-1 rounded-md bg-rose-100 px-2 py-0.5 text-xs font-semibold text-rose-900 uppercase tracking-wide"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-rose-600 animate-pulse" />
              {event.status}
            </span>
          </div>
        </div>

        <div>
          <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px]">
            Event Type
          </span>
          <div id="event-type-display" className="mt-0.5 text-sm font-mono text-slate-800">
            {event.type}
          </div>
        </div>
      </div>

      {/* Event Message */}
      <div className="mt-3 rounded-lg border border-rose-200/80 bg-rose-50/40 p-3.5 text-sm text-rose-950">
        <span className="font-semibold">Message:</span> {event.message}
      </div>

      {/* Evidence Categories */}
      <div className="mt-5 space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
          Supporting Evidence Categories
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Ground Sensor Evidence */}
          <div
            id="evidence-ground-sensor"
            className="flex flex-col rounded-lg border border-slate-200/70 bg-white p-3.5 text-xs shadow-2xs"
          >
            <div className="flex items-center gap-2 font-semibold text-slate-800 pb-1.5 border-b border-slate-100">
              <Activity className="h-3.5 w-3.5 text-teal-600" />
              <span>Ground Sensor</span>
            </div>
            <p className="mt-2 text-slate-600 leading-relaxed">
              {sanitizeNeutralText(event.evidence.groundSensor)}
            </p>
          </div>

          {/* Citizen Reports Evidence */}
          <div
            id="evidence-citizen-reports"
            className="flex flex-col rounded-lg border border-slate-200/70 bg-white p-3.5 text-xs shadow-2xs"
          >
            <div className="flex items-center gap-2 font-semibold text-slate-800 pb-1.5 border-b border-slate-100">
              <Users className="h-3.5 w-3.5 text-sky-600" />
              <span>Citizen Reports</span>
            </div>
            <p className="mt-2 text-slate-600 leading-relaxed">
              {sanitizeNeutralText(event.evidence.citizenReports)}
            </p>
          </div>

          {/* Satellite Observation Evidence */}
          <div
            id="evidence-satellite-observation"
            className="flex flex-col rounded-lg border border-slate-200/70 bg-white p-3.5 text-xs shadow-2xs"
          >
            <div className="flex items-center gap-2 font-semibold text-slate-800 pb-1.5 border-b border-slate-100">
              <Satellite className="h-3.5 w-3.5 text-indigo-600" />
              <span>Satellite Observation</span>
            </div>
            <p className="mt-2 text-slate-600 leading-relaxed">
              {sanitizeNeutralText(event.evidence.satelliteObservation)}
            </p>
          </div>

          {/* Meteorological Consistency Evidence */}
          <div
            id="evidence-meteorological-consistency"
            className="flex flex-col rounded-lg border border-slate-200/70 bg-white p-3.5 text-xs shadow-2xs"
          >
            <div className="flex items-center gap-2 font-semibold text-slate-800 pb-1.5 border-b border-slate-100">
              <Compass className="h-3.5 w-3.5 text-amber-600" />
              <span>Meteorological Consistency</span>
            </div>
            <p className="mt-2 text-slate-600 leading-relaxed">
              {sanitizeNeutralText(event.evidence.meteorologicalConsistency)}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
