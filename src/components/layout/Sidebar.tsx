import React from 'react';
import {
  LayoutDashboard,
  Map,
  Camera,
  Radio,
  TrendingUp,
  ShieldAlert,
  Bell,
  Globe2,
  Database,
  Settings as SettingsIcon,
  X,
  Wind
} from 'lucide-react';
import { NavSectionId, NAV_ITEMS_CONFIG } from '../../types.ts';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentSection: NavSectionId;
  onSelectSection: (section: NavSectionId) => void;
}

const ICON_MAP: Record<NavSectionId, React.ComponentType<{ className?: string }>> = {
  'overview': LayoutDashboard,
  'live-map': Map,
  'report-pollution': Camera,
  'hotspots': Radio,
  'forecast': TrendingUp,
  'command-centre': ShieldAlert,
  'alerts': Bell,
  'brics-network': Globe2,
  'data-sources': Database,
  'settings': SettingsIcon,
};

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  currentSection,
  onSelectSection,
}) => {
  const handleItemClick = (id: NavSectionId) => {
    onSelectSection(id);
    onClose();
  };

  return (
    <>
      {/* Mobile backdrop overlay */}
      {isOpen && (
        <div
          id="sidebar-mobile-backdrop"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* Main Sidebar */}
      <aside
        id="main-sidebar"
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-slate-900 text-slate-200 border-r border-slate-800 transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand identity header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-500/10 border border-teal-500/30 text-teal-400">
              <Wind className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-bold tracking-tight text-white">
                  VAYU-SETU AI
                </span>
              </div>
              <p className="text-[11px] leading-tight font-medium tracking-wide text-slate-400 uppercase">
                Federated Air &amp; Climate Intelligence
              </p>
            </div>
          </div>
          <button
            type="button"
            id="sidebar-close-btn"
            onClick={onClose}
            aria-label="Close navigation sidebar"
            className="rounded-md p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white focus:outline-hidden focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-1 focus-visible:ring-offset-slate-900 lg:hidden"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* Navigation list */}
        <nav
          id="sidebar-navigation"
          aria-label="Application navigation"
          className="flex-1 overflow-y-auto px-3 py-4 space-y-1"
        >
          <div className="px-3 pb-2 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
            Platform Navigation
          </div>
          {NAV_ITEMS_CONFIG.map((item) => {
            const Icon = ICON_MAP[item.id];
            const isSelected = currentSection === item.id;

            return (
              <button
                key={item.id}
                type="button"
                id={`nav-item-${item.id}`}
                onClick={() => handleItemClick(item.id)}
                aria-current={isSelected ? 'page' : undefined}
                className={`group w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left focus:outline-hidden focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-1 focus-visible:ring-offset-slate-900 ${
                  isSelected
                    ? 'bg-slate-800 text-teal-300 shadow-xs border border-teal-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon
                  aria-hidden="true"
                  className={`h-4 w-4 shrink-0 transition-colors ${
                    isSelected ? 'text-teal-400' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                />
                <span className="truncate">{item.name}</span>
                {isSelected && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-teal-400" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer info badge */}
        <div className="px-5 py-3 border-t border-slate-800/80 bg-slate-950/30 text-[11px] text-slate-400 space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-mono">BRICS Climate Federation</span>
            <span className="text-teal-400/80 font-mono">v1.0-demo</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-mono font-semibold text-amber-400">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
            DEMO • SYNTHETIC DATA
          </div>
        </div>
      </aside>
    </>
  );
};
