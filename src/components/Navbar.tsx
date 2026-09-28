import React from 'react';
import { Pill, ShieldCheck, Clock, FileText, Store } from 'lucide-react';

interface NavbarProps {
  activeTab: 'search' | 'generics' | 'emergency247' | 'scanner';
  onSelectTab: (tab: 'search' | 'generics' | 'emergency247' | 'scanner') => void;
  activeReservationsCount: number;
  onOpenReservations: () => void;
  isPharmacistMode: boolean;
  onTogglePharmacistMode: () => void;
  onOpenScanner: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  activeReservationsCount,
  onOpenReservations,
  isPharmacistMode,
  onTogglePharmacistMode,
  onOpenScanner,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => {
            if (isPharmacistMode) onTogglePharmacistMode();
            onSelectTab('search');
          }}
          className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <span className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center font-black text-sm">
            Rx
          </span>
          <span>MedLocate</span>
        </button>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <button
            onClick={() => {
              if (isPharmacistMode) onTogglePharmacistMode();
              onSelectTab('search');
            }}
            className={`transition-colors pb-0.5 ${
              activeTab === 'search' && !isPharmacistMode
                ? 'text-teal-700 font-semibold border-b-2 border-teal-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Find Medicine
          </button>

          <button
            onClick={() => {
              if (isPharmacistMode) onTogglePharmacistMode();
              onSelectTab('generics');
            }}
            className={`transition-colors pb-0.5 ${
              activeTab === 'generics' && !isPharmacistMode
                ? 'text-teal-700 font-semibold border-b-2 border-teal-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Generic Substitutes
          </button>

          <button
            onClick={() => {
              if (isPharmacistMode) onTogglePharmacistMode();
              onSelectTab('emergency247');
            }}
            className={`transition-colors pb-0.5 flex items-center gap-1.5 ${
              activeTab === 'emergency247' && !isPharmacistMode
                ? 'text-rose-700 font-semibold border-b-2 border-rose-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            24/7 Emergency Rx
          </button>

          <button
            onClick={onOpenScanner}
            className="text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1.5"
          >
            <FileText className="w-4 h-4 text-slate-400" />
            <span>Scan Prescription</span>
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenReservations}
            className="relative px-3 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1.5"
            title="View current medication holds"
          >
            <Clock className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">Active Holds</span>
            {activeReservationsCount > 0 && (
              <span className="font-mono text-xs font-semibold px-1.5 py-0.2 bg-teal-100 text-teal-800 rounded-md">
                {activeReservationsCount}
              </span>
            )}
          </button>

          <button
            onClick={onTogglePharmacistMode}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-2 whitespace-nowrap shadow-sm ${
              isPharmacistMode
                ? 'bg-amber-600 text-white hover:bg-amber-700 ring-2 ring-amber-300'
                : 'bg-slate-900 text-white hover:bg-slate-800'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>{isPharmacistMode ? 'Exit Pharmacist Portal' : 'Pharmacy Partner Mode'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
