import React from 'react';
import { Menu } from 'lucide-react';

interface HeaderProps {
  title: string;
  onOpenSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, onOpenSidebar }) => {
  return (
    <header
      id="main-top-header"
      className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-8 shadow-2xs"
    >
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          type="button"
          id="header-mobile-menu-btn"
          onClick={onOpenSidebar}
          aria-label="Open navigation sidebar"
          className="rounded-md p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 lg:hidden"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>

        <div className="flex flex-col">
          <h1
            id="header-view-title"
            className="text-base sm:text-lg font-semibold tracking-tight text-slate-900"
          >
            {title}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span
          id="status-mock-badge"
          className="inline-flex items-center gap-1.5 rounded-full border border-amber-300/80 bg-amber-50 px-2.5 py-0.5 text-xs font-semibold font-mono text-amber-900 tracking-wide"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
          DEMO • SYNTHETIC DATA
        </span>
      </div>
    </header>
  );
};
