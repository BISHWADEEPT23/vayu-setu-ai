import React, { useState } from 'react';
import { Sidebar } from './Sidebar.tsx';
import { Header } from './Header.tsx';
import { NavSectionId } from '../../types.ts';

interface ShellProps {
  currentSection: NavSectionId;
  onSelectSection: (section: NavSectionId) => void;
  headerTitle: string;
  children: React.ReactNode;
}

export const Shell: React.FC<ShellProps> = ({
  currentSection,
  onSelectSection,
  headerTitle,
  children,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 antialiased font-sans">
      {/* Persistent Left Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        currentSection={currentSection}
        onSelectSection={onSelectSection}
      />

      {/* Main Content Column */}
      <div className="flex flex-1 flex-col min-w-0">
        <Header
          title={headerTitle}
          onOpenSidebar={() => setSidebarOpen(true)}
        />

        <main id="main-content" className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
