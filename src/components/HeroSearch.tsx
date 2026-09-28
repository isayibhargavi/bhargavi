import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Crosshair, ChevronDown, Check, Sparkles, Filter, ShieldCheck, AlertCircle } from 'lucide-react';
import { Medicine } from '../types';

interface HeroSearchProps {
  medicines: Medicine[];
  selectedMedicine: Medicine;
  onSelectMedicine: (medicine: Medicine) => void;
  selectedStrength: string;
  onChangeStrength: (strength: string) => void;
  locationQuery: string;
  onChangeLocation: (query: string) => void;
  onDetectLocation: () => void;
  isDetectingLocation: boolean;
  radiusMiles: number;
  onChangeRadius: (radius: number) => void;
  onlyInStock: boolean;
  onToggleOnlyInStock: () => void;
  onlyOpenNow: boolean;
  onToggleOnlyOpenNow: () => void;
  onlyDriveThru: boolean;
  onToggleOnlyDriveThru: () => void;
  onlyDelivery: boolean;
  onToggleOnlyDelivery: () => void;
  onOpenSafetyDrawer: () => void;
}

export const HeroSearch: React.FC<HeroSearchProps> = ({
  medicines,
  selectedMedicine,
  onSelectMedicine,
  selectedStrength,
  onChangeStrength,
  locationQuery,
  onChangeLocation,
  onDetectLocation,
  isDetectingLocation,
  radiusMiles,
  onChangeRadius,
  onlyInStock,
  onToggleOnlyInStock,
  onlyOpenNow,
  onToggleOnlyOpenNow,
  onlyDriveThru,
  onToggleOnlyDriveThru,
  onlyDelivery,
  onToggleOnlyDelivery,
  onOpenSafetyDrawer,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Filter medicines matching query
  const filteredMedicines = medicines.filter((m) => {
    if (!searchTerm.trim()) return false;
    const term = searchTerm.toLowerCase();
    return (
      m.brandName.toLowerCase().includes(term) ||
      m.genericName.toLowerCase().includes(term) ||
      m.category.toLowerCase().includes(term) ||
      m.primaryIndications.some((ind) => ind.toLowerCase().includes(term))
    );
  });

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectMed = (med: Medicine) => {
    onSelectMedicine(med);
    setSearchTerm('');
    setIsDropdownOpen(false);
  };

  const POPULAR_SEARCHES = [
    { label: 'Amoxicillin 500mg', id: 'med-amox' },
    { label: 'Ventolin Inhaler', id: 'med-albuterol' },
    { label: 'Ozempic Pen', id: 'med-ozempic' },
    { label: 'Metformin ER', id: 'med-metformin' },
    { label: 'Adderall XR', id: 'med-adderall' },
    { label: 'Tylenol 500mg', id: 'med-paracetamol' },
  ];

  return (
    <div className="bg-white border-b border-slate-200 pt-8 pb-7">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Title & Editorial Headline */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-6">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-700 mb-2">
              <span className="w-2 h-2 rounded-full bg-teal-500"></span>
              <span>Live Pharmacy Inventory Network</span>
              <span className="text-slate-300">/</span>
              <span>Direct EDI Verification</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 text-balance">
              Find in-stock prescription & OTC medicines near you
            </h1>
            <p className="mt-2 text-sm text-slate-600 max-w-2xl leading-relaxed">
              Verify real-time shelf counts, compare transparent pharmacy prices, discover bioequivalent generic substitutes, and hold urgent doses for pickup.
            </p>
          </div>

          {/* Quick Stats / Trust Indicators */}
          <div className="flex items-center gap-6 text-xs text-slate-500 pb-1 shrink-0">
            <div>
              <span className="block font-mono font-semibold text-slate-900 text-sm tabular-nums">7 Pharmacies</span>
              <span>Monitored in Metro SF</span>
            </div>
            <div className="h-7 w-px bg-slate-200"></div>
            <div>
              <span className="block font-mono font-semibold text-teal-700 text-sm tabular-nums">Real-Time</span>
              <span>Automated EDI Sync</span>
            </div>
            <div className="h-7 w-px bg-slate-200"></div>
            <div>
              <span className="block font-mono font-semibold text-slate-900 text-sm tabular-nums">100% Free</span>
              <span>No Surcharges</span>
            </div>
          </div>
        </div>

        {/* Primary Search Bar Container */}
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-3 sm:p-4 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
            {/* Medicine Input with Auto-complete */}
            <div className="lg:col-span-6 relative" ref={searchContainerRef}>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Medicine Name or Active Molecule
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="e.g. Amoxicillin, Ventolin, Ozempic, Metformin..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setIsDropdownOpen(true);
                  }}
                  onFocus={() => setIsDropdownOpen(true)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600 transition-all"
                />
              </div>

              {/* Auto-suggest dropdown */}
              {isDropdownOpen && filteredMedicines.length > 0 && (
                <div className="absolute left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-200 z-50 max-h-80 overflow-y-auto divide-y divide-slate-100">
                  <div className="p-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Matching Medications
                  </div>
                  {filteredMedicines.map((med) => (
                    <button
                      key={med.id}
                      onClick={() => handleSelectMed(med)}
                      className="w-full text-left px-4 py-3 hover:bg-teal-50/70 transition-colors flex items-center justify-between group"
                    >
                      <div>
                        <div className="font-semibold text-slate-900 text-sm group-hover:text-teal-900">
                          {med.brandName}
                        </div>
                        <div className="text-xs text-slate-500">
                          {med.genericName} · {med.category}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-mono text-slate-400">
                          {med.availableStrengths.length} strengths
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dosage Strength Dropdown */}
            <div className="lg:col-span-3">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Strength / Dosage
              </label>
              <div className="relative">
                <select
                  value={selectedStrength}
                  onChange={(e) => onChangeStrength(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-medium text-slate-900 appearance-none focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600 transition-all cursor-pointer"
                >
                  {selectedMedicine.availableStrengths.map((str) => (
                    <option key={str} value={str}>
                      {str}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Location & Radius Input */}
            <div className="lg:col-span-3">
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                <span>Near Location</span>
                <button
                  type="button"
                  onClick={onDetectLocation}
                  disabled={isDetectingLocation}
                  className="text-xs font-medium text-teal-700 hover:text-teal-900 flex items-center gap-1 transition-colors"
                  title="Detect GPS"
                >
                  <Crosshair className={`w-3 h-3 ${isDetectingLocation ? 'animate-spin' : ''}`} />
                  <span>{isDetectingLocation ? 'Locating...' : 'Use My GPS'}</span>
                </button>
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={locationQuery}
                  onChange={(e) => onChangeLocation(e.target.value)}
                  placeholder="ZIP or City, e.g. 94108"
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Selected Medicine Info Banner */}
          <div className="mt-3 pt-3 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="font-semibold text-slate-900 text-sm">
                {selectedMedicine.brandName}
              </span>
              <span className="text-slate-400">/</span>
              <span className="text-slate-600">
                {selectedMedicine.genericName}
              </span>
              <span className="text-slate-400">·</span>
              <span className="text-slate-600 font-mono">
                {selectedStrength} ({selectedMedicine.defaultForm})
              </span>
              {selectedMedicine.requiresPrescription ? (
                <span className="text-slate-700 bg-slate-200/80 px-2 py-0.5 rounded font-mono font-medium">
                  Rx Required
                </span>
              ) : (
                <span className="text-teal-800 bg-teal-100 px-2 py-0.5 rounded font-mono font-medium">
                  OTC Non-Prescription
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onOpenSafetyDrawer}
                className="text-teal-700 hover:text-teal-900 font-medium hover:underline inline-flex items-center gap-1 text-xs"
              >
                <span>Safety & Interactions ({selectedMedicine.interactionWarnings.length})</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Suggestion Buttons */}
        <div className="mt-3 flex items-center gap-2 flex-wrap text-xs">
          <span className="text-slate-500 font-medium">Frequent searches:</span>
          {POPULAR_SEARCHES.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                const target = medicines.find((m) => m.id === item.id);
                if (target) onSelectMedicine(target);
              }}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                selectedMedicine.id === item.id
                  ? 'bg-teal-100 text-teal-900 font-semibold'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Filter Controls Row */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-slate-700 flex items-center gap-1.5 mr-1">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span>Filters:</span>
            </span>

            {/* In Stock toggle */}
            <button
              onClick={onToggleOnlyInStock}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
                onlyInStock
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
            >
              {onlyInStock && <Check className="w-3.5 h-3.5" />}
              <span>In-Stock Only</span>
            </button>

            {/* Open Now toggle */}
            <button
              onClick={onToggleOnlyOpenNow}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
                onlyOpenNow
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
            >
              {onlyOpenNow && <Check className="w-3.5 h-3.5" />}
              <span>Open Right Now</span>
            </button>

            {/* Drive-thru toggle */}
            <button
              onClick={onToggleOnlyDriveThru}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
                onlyDriveThru
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
            >
              {onlyDriveThru && <Check className="w-3.5 h-3.5" />}
              <span>Drive-Thru Window</span>
            </button>

            {/* Home delivery toggle */}
            <button
              onClick={onToggleOnlyDelivery}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
                onlyDelivery
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
            >
              {onlyDelivery && <Check className="w-3.5 h-3.5" />}
              <span>Home Delivery</span>
            </button>
          </div>

          {/* Radius selector */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg p-1">
            <span className="text-slate-500 px-2 font-medium">Distance:</span>
            {[1, 3, 5, 10, 25].map((rad) => (
              <button
                key={rad}
                onClick={() => onChangeRadius(rad)}
                className={`px-2 py-0.5 rounded font-mono font-medium transition-colors ${
                  radiusMiles === rad
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {rad}mi
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
