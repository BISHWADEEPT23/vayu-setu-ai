import React from 'react';

interface PlaceholderViewProps {
  title: string;
  description: string;
  sectionId: string;
}

export const PlaceholderView: React.FC<PlaceholderViewProps> = ({
  title,
  description,
  sectionId,
}) => {
  return (
    <section
      id={`page-section-${sectionId}`}
      aria-labelledby={`placeholder-title-${sectionId}`}
      className="rounded-xl border border-slate-200/80 bg-white p-6 sm:p-8 lg:p-10 shadow-2xs"
    >
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 rounded-md bg-amber-50 px-2.5 py-1 text-xs font-mono font-semibold text-amber-900 border border-amber-200/80">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
          MODULE NOT YET IMPLEMENTED
        </div>

        <h2
          id={`placeholder-title-${sectionId}`}
          className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900"
        >
          {title}
        </h2>

        <p
          id={`placeholder-desc-${sectionId}`}
          className="text-base sm:text-lg text-slate-600 leading-relaxed"
        >
          {description}
        </p>
      </div>
    </section>
  );
};
