/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  INITIAL_MEDICINES,
  INITIAL_PHARMACIES,
  INITIAL_STOCK_ITEMS,
  INITIAL_DEMO_RESERVATION,
} from './data/mockData';
import { Medicine, Pharmacy, PharmacyStockItem, ReservationHold, StockAlertSubscription } from './types';
import { Navbar } from './components/Navbar';
import { HeroSearch } from './components/HeroSearch';
import { ShortageNotice } from './components/ShortageNotice';
import { PharmacyCard } from './components/PharmacyCard';
import { InteractiveMap } from './components/InteractiveMap';
import { GenericComparisonModal } from './components/GenericComparisonModal';
import { PrescriptionScannerModal } from './components/PrescriptionScannerModal';
import { ReservationModal } from './components/ReservationModal';
import { StockAlertModal } from './components/StockAlertModal';
import { DrugSafetyDrawer } from './components/DrugSafetyDrawer';
import { MyReservationsModal } from './components/MyReservationsModal';
import { PharmacistDashboard } from './components/PharmacistDashboard';
import { N8nChatWidget } from './components/N8nChatWidget';
import {
  Map,
  List,
  Columns,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  Building2,
  Clock,
  ArrowRight,
  Info,
  PhoneCall,
  Activity,
  HeartPulse,
} from 'lucide-react';

export default function App() {
  // Core Data State
  const [medicines] = useState<Medicine[]>(INITIAL_MEDICINES);
  const [pharmacies] = useState<Pharmacy[]>(INITIAL_PHARMACIES);
  
  // Stock and Reservations persisted to localStorage
  const [stockItems, setStockItems] = useState<PharmacyStockItem[]>(() => {
    try {
      const saved = localStorage.getItem('medlocate_stock');
      return saved ? JSON.parse(saved) : INITIAL_STOCK_ITEMS;
    } catch {
      return INITIAL_STOCK_ITEMS;
    }
  });

  const [reservations, setReservations] = useState<ReservationHold[]>(() => {
    try {
      const saved = localStorage.getItem('medlocate_reservations');
      return saved ? JSON.parse(saved) : [INITIAL_DEMO_RESERVATION];
    } catch {
      return [INITIAL_DEMO_RESERVATION];
    }
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('medlocate_stock', JSON.stringify(stockItems));
    } catch (e) {
      console.warn('Storage sync failed', e);
    }
  }, [stockItems]);

  useEffect(() => {
    try {
      localStorage.setItem('medlocate_reservations', JSON.stringify(reservations));
    } catch (e) {
      console.warn('Storage sync failed', e);
    }
  }, [reservations]);

  // Search & Filter State
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine>(INITIAL_MEDICINES[0]); // Amoxil
  const [selectedStrength, setSelectedStrength] = useState<string>(INITIAL_MEDICINES[0].defaultStrength);
  const [locationQuery, setLocationQuery] = useState<string>('San Francisco, CA 94108');
  const [isDetectingLocation, setIsDetectingLocation] = useState<boolean>(false);
  const [radiusMiles, setRadiusMiles] = useState<number>(5);
  
  // Toggles
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [onlyOpenNow, setOnlyOpenNow] = useState<boolean>(false);
  const [onlyDriveThru, setOnlyDriveThru] = useState<boolean>(false);
  const [onlyDelivery, setOnlyDelivery] = useState<boolean>(false);
  const [onlyHospital, setOnlyHospital] = useState<boolean>(false);

  // View state
  const [viewMode, setViewMode] = useState<'split' | 'list' | 'map'>('split');
  const [selectedPharmacyId, setSelectedPharmacyId] = useState<string | null>(INITIAL_PHARMACIES[0].id);
  const [navTab, setNavTab] = useState<'search' | 'generics' | 'emergency247' | 'scanner'>('search');

  // Modals state
  const [isGenericModalOpen, setIsGenericModalOpen] = useState(false);
  const [isScannerModalOpen, setIsScannerModalOpen] = useState(false);
  const [isSafetyDrawerOpen, setIsSafetyDrawerOpen] = useState(false);
  const [isReservationsModalOpen, setIsReservationsModalOpen] = useState(false);
  const [isPharmacistMode, setIsPharmacistMode] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Reservation & Alert modal targets
  const [targetReservationPharmacy, setTargetReservationPharmacy] = useState<Pharmacy | null>(null);
  const [targetReservationStock, setTargetReservationStock] = useState<PharmacyStockItem | null>(null);
  const [targetAlertPharmacy, setTargetAlertPharmacy] = useState<Pharmacy | null>(null);

  // Handle medicine switch
  const handleSelectMedicine = (med: Medicine) => {
    setSelectedMedicine(med);
    setSelectedStrength(med.defaultStrength);
  };

  // Switch to generic
  const handleSwitchToGeneric = (genericName: string) => {
    const matched = medicines.find(
      (m) =>
        m.genericName.toLowerCase().includes(genericName.toLowerCase()) ||
        m.brandName.toLowerCase().includes(genericName.toLowerCase())
    );
    if (matched) {
      setSelectedMedicine(matched);
      setSelectedStrength(matched.defaultStrength);
    }
  };

  // Prescription scanner callback
  const handleLocatePrescriptionItems = (medicineIds: string[]) => {
    if (medicineIds.length > 0) {
      const primary = medicines.find((m) => m.id === medicineIds[0]);
      if (primary) {
        setSelectedMedicine(primary);
        setSelectedStrength(primary.defaultStrength);
      }
    }
    setNavTab('search');
  };

  // Nav Tab handler
  const handleSelectNavTab = (tab: 'search' | 'generics' | 'emergency247' | 'scanner') => {
    setNavTab(tab);
    if (tab === 'generics') {
      setIsGenericModalOpen(true);
    } else if (tab === 'emergency247') {
      setOnlyOpenNow(true);
    } else if (tab === 'scanner') {
      setIsScannerModalOpen(true);
    }
  };

  // GPS Location detector simulation with real navigator.geolocation fallback
  const handleDetectLocation = () => {
    setIsDetectingLocation(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setLocationQuery('Downtown Metro, San Francisco (94108)');
          setIsDetectingLocation(false);
        },
        () => {
          // Graceful fallback
          setLocationQuery('Downtown Metro, San Francisco (94108)');
          setIsDetectingLocation(false);
        },
        { timeout: 3000 }
      );
    } else {
      setTimeout(() => {
        setLocationQuery('Downtown Metro, San Francisco (94108)');
        setIsDetectingLocation(false);
      }, 500);
    }
  };

  // Handle user starting a hold
  const handleStartHold = (pharmacy: Pharmacy, stockItem: PharmacyStockItem) => {
    setTargetReservationPharmacy(pharmacy);
    setTargetReservationStock(stockItem);
  };

  // Confirm hold callback
  const handleConfirmReservation = (newHold: ReservationHold) => {
    setReservations((prev) => [newHold, ...prev]);
    // Decrement stock in real time
    setStockItems((prev) =>
      prev.map((item) => {
        if (item.pharmacyId === newHold.pharmacyId && item.medicineId === newHold.medicineId) {
          const updatedUnits = Math.max(0, item.unitsAvailable - newHold.quantity);
          return {
            ...item,
            unitsAvailable: updatedUnits,
            status: updatedUnits === 0 ? 'out_of_stock' : updatedUnits < 5 ? 'low_stock' : 'in_stock',
          };
        }
        return item;
      })
    );
  };

  // Cancel reservation callback
  const handleCancelReservation = (id: string) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'cancelled' as const } : r))
    );
  };

  // Pharmacist actions
  const handlePharmacistUpdateStock = (
    pharmacyId: string,
    medicineId: string,
    deltaOrExact: number,
    isDelta: boolean
  ) => {
    setStockItems((prev) =>
      prev.map((item) => {
        if (item.pharmacyId === pharmacyId && item.medicineId === medicineId) {
          const newUnits = isDelta
            ? Math.max(0, item.unitsAvailable + deltaOrExact)
            : Math.max(0, deltaOrExact);
          const newStatus =
            newUnits === 0 ? 'out_of_stock' : newUnits < 5 ? 'low_stock' : 'in_stock';
          return {
            ...item,
            unitsAvailable: newUnits,
            status: newStatus,
            lastVerifiedMinutesAgo: 0,
          };
        }
        return item;
      })
    );
  };

  const handlePharmacistUpdateStatus = (
    pharmacyId: string,
    medicineId: string,
    newStatus: PharmacyStockItem['status']
  ) => {
    setStockItems((prev) =>
      prev.map((item) => {
        if (item.pharmacyId === pharmacyId && item.medicineId === medicineId) {
          return {
            ...item,
            status: newStatus,
            unitsAvailable:
              newStatus === 'out_of_stock'
                ? 0
                : item.unitsAvailable === 0
                ? 10
                : item.unitsAvailable,
            lastVerifiedMinutesAgo: 0,
          };
        }
        return item;
      })
    );
  };

  const handleFulfillReservation = (id: string) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'picked_up' as const } : r))
    );
  };

  // Filtered Pharmacies according to search criteria
  const filteredPharmacies = useMemo(() => {
    return pharmacies.filter((pharmacy) => {
      // Distance filter
      if (pharmacy.distanceMiles > radiusMiles) return false;

      // Find stock item for this medicine
      const stock = stockItems.find(
        (s) => s.pharmacyId === pharmacy.id && s.medicineId === selectedMedicine.id
      );

      // In stock filter
      if (onlyInStock) {
        if (!stock || stock.status === 'out_of_stock' || stock.unitsAvailable === 0) {
          return false;
        }
      }

      // Open now filter
      if (onlyOpenNow && !pharmacy.isOpenNow && !pharmacy.isOpen24Hours) {
        return false;
      }

      // Drive thru filter
      if (onlyDriveThru && !pharmacy.hasDriveThru) {
        return false;
      }

      // Delivery filter
      if (onlyDelivery && !pharmacy.hasHomeDelivery) {
        return false;
      }

      // Hospital only filter
      if (onlyHospital && pharmacy.chainOrIndependent !== 'hospital') {
        return false;
      }

      return true;
    });
  }, [
    pharmacies,
    stockItems,
    selectedMedicine.id,
    radiusMiles,
    onlyInStock,
    onlyOpenNow,
    onlyDriveThru,
    onlyDelivery,
    onlyHospital,
  ]);

  // Counts for summary
  const inStockCount = useMemo(() => {
    return filteredPharmacies.filter((p) => {
      const stock = stockItems.find(
        (s) => s.pharmacyId === p.id && s.medicineId === selectedMedicine.id
      );
      return stock && stock.status === 'in_stock' && stock.unitsAvailable > 0;
    }).length;
  }, [filteredPharmacies, stockItems, selectedMedicine.id]);

  const activeReservationsCount = useMemo(() => {
    return reservations.filter((r) => r.status === 'active').length;
  }, [reservations]);

  // If in pharmacist mode, render pharmacist dashboard
  if (isPharmacistMode) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
        <Navbar
          activeTab={navTab}
          onSelectTab={handleSelectNavTab}
          activeReservationsCount={activeReservationsCount}
          onOpenReservations={() => setIsReservationsModalOpen(true)}
          isPharmacistMode={isPharmacistMode}
          onTogglePharmacistMode={() => setIsPharmacistMode(false)}
          onOpenScanner={() => setIsScannerModalOpen(true)}
          onOpenChat={() => setIsChatOpen(true)}
        />
        <PharmacistDashboard
          pharmacy={pharmacies[0]} // default partner: WellCare Central 24/7
          medicines={medicines}
          stockItems={stockItems}
          reservations={reservations}
          onUpdateStock={handlePharmacistUpdateStock}
          onUpdateStatus={handlePharmacistUpdateStatus}
          onFulfillReservation={handleFulfillReservation}
          onCancelReservation={handleCancelReservation}
          onExitPharmacistMode={() => setIsPharmacistMode(false)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      {/* 1. Strict Top Bar Contract */}
      <Navbar
        activeTab={navTab}
        onSelectTab={handleSelectNavTab}
        activeReservationsCount={activeReservationsCount}
        onOpenReservations={() => setIsReservationsModalOpen(true)}
        isPharmacistMode={isPharmacistMode}
        onTogglePharmacistMode={() => setIsPharmacistMode(!isPharmacistMode)}
        onOpenScanner={() => setIsScannerModalOpen(true)}
        onOpenChat={() => setIsChatOpen(true)}
      />

      {/* 2. Emergency Quick Alert Strip */}
      <aside aria-label="Emergency Services" className="bg-slate-900 text-white text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
            <span className="font-semibold text-rose-300">Urgent Prescription Need?</span>
            <span className="hidden sm:inline text-slate-400">
              Two 24-hour pharmacies are currently open within 1.5 miles of Downtown SF.
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setOnlyOpenNow(true);
                setRadiusMiles(5);
              }}
              className="text-teal-300 hover:text-white font-semibold underline underline-offset-2 transition-colors"
            >
              Show Open 24/7 Only
            </button>
            <span className="text-slate-600">·</span>
            <a
              href="tel:911"
              className="text-rose-300 hover:text-rose-200 font-mono font-bold flex items-center gap-1"
            >
              <PhoneCall className="w-3 h-3" />
              <span>Life Emergency: Call 911</span>
            </a>
          </div>
        </div>
      </aside>

      {/* 3. Hero Search & Filter Controls */}
      <HeroSearch
        medicines={medicines}
        selectedMedicine={selectedMedicine}
        onSelectMedicine={handleSelectMedicine}
        selectedStrength={selectedStrength}
        onChangeStrength={setSelectedStrength}
        locationQuery={locationQuery}
        onChangeLocation={setLocationQuery}
        onDetectLocation={handleDetectLocation}
        isDetectingLocation={isDetectingLocation}
        radiusMiles={radiusMiles}
        onChangeRadius={setRadiusMiles}
        onlyInStock={onlyInStock}
        onToggleOnlyInStock={() => setOnlyInStock(!onlyInStock)}
        onlyOpenNow={onlyOpenNow}
        onToggleOnlyOpenNow={() => setOnlyOpenNow(!onlyOpenNow)}
        onlyDriveThru={onlyDriveThru}
        onToggleOnlyDriveThru={() => setOnlyDriveThru(!onlyDriveThru)}
        onlyDelivery={onlyDelivery}
        onToggleOnlyDelivery={() => setOnlyDelivery(!onlyDelivery)}
        onOpenSafetyDrawer={() => setIsSafetyDrawerOpen(true)}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full space-y-6">
        {/* Shortage Advisory Banner if active */}
        <ShortageNotice
          medicine={selectedMedicine}
          onViewGenerics={() => setIsGenericModalOpen(true)}
          onViewHospitalPharmacies={() => setOnlyHospital(true)}
        />

        {/* Results Header & Layout Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>Search results for</span>
              <strong className="text-slate-900 font-semibold">{selectedMedicine.brandName}</strong>
              <span>({selectedStrength})</span>
              <span>·</span>
              <span className="font-mono tabular-nums">{filteredPharmacies.length} pharmacies found</span>
              <span>·</span>
              <span className="text-emerald-700 font-semibold font-mono tabular-nums">
                {inStockCount} currently in stock
              </span>
            </div>
          </div>

          {/* View Mode Switcher (Split, List, Map) */}
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-1 self-start sm:self-auto shadow-2xs">
            <button
              onClick={() => setViewMode('split')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                viewMode === 'split'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Side-by-side Map and Pharmacy Cards"
            >
              <Columns className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Split View</span>
            </button>

            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                viewMode === 'list'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Pharmacy cards full width"
            >
              <List className="w-3.5 h-3.5" />
              <span>List</span>
            </button>

            <button
              onClick={() => setViewMode('map')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                viewMode === 'map'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Interactive Radar Map full width"
            >
              <Map className="w-3.5 h-3.5" />
              <span>Radar Map</span>
            </button>
          </div>
        </div>

        {/* Dynamic Layout Based on View Mode */}
        {viewMode === 'split' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Pharmacy Cards Column */}
            <div className="lg:col-span-7 space-y-4">
              {filteredPharmacies.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                  <AlertCircle className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                  <h3 className="font-bold text-slate-800 text-base">No Pharmacies Match These Filters</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 leading-relaxed">
                    Try expanding your search radius beyond {radiusMiles} miles or disabling the &quot;In-Stock Only&quot; toggle to view pending restocks.
                  </p>
                  <button
                    onClick={() => {
                      setRadiusMiles(25);
                      setOnlyInStock(false);
                      setOnlyOpenNow(false);
                      setOnlyDriveThru(false);
                      setOnlyDelivery(false);
                      setOnlyHospital(false);
                    }}
                    className="mt-4 px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    Reset All Filters (25mi Radius)
                  </button>
                </div>
              ) : (
                filteredPharmacies.map((pharmacy) => {
                  const stock = stockItems.find(
                    (s) => s.pharmacyId === pharmacy.id && s.medicineId === selectedMedicine.id
                  );
                  return (
                    <PharmacyCard
                      key={pharmacy.id}
                      pharmacy={pharmacy}
                      stockItem={stock}
                      medicine={selectedMedicine}
                      onHoldMedication={(p, s) => handleStartHold(p, s)}
                      onOpenStockAlert={(p) => setTargetAlertPharmacy(p)}
                      onSelectForMap={(p) => setSelectedPharmacyId(p.id)}
                      isSelected={selectedPharmacyId === pharmacy.id}
                    />
                  );
                })
              )}
            </div>

            {/* Interactive Radar Map Column (Sticky on desktop) */}
            <div className="lg:col-span-5 lg:sticky lg:top-20">
              <InteractiveMap
                pharmacies={filteredPharmacies}
                stockItems={stockItems}
                medicine={selectedMedicine}
                selectedPharmacyId={selectedPharmacyId}
                onSelectPharmacy={(p) => setSelectedPharmacyId(p.id)}
                onHoldMedication={(p, s) => handleStartHold(p, s)}
              />

              {/* Informational Tip beneath Map */}
              <div className="mt-4 bg-teal-50/70 border border-teal-200 rounded-xl p-3.5 text-xs text-teal-950 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <strong className="text-teal-900">Hospital Pharmacy Advantage: </strong>
                  During manufacturer drug shortages, hospital outpatient pharmacies (like St. Mary Regional) typically maintain priority emergency inventories for acute patient discharges.
                </div>
              </div>
            </div>
          </div>
        )}

        {viewMode === 'list' && (
          <div className="space-y-4 max-w-4xl mx-auto">
            {filteredPharmacies.map((pharmacy) => {
              const stock = stockItems.find(
                (s) => s.pharmacyId === pharmacy.id && s.medicineId === selectedMedicine.id
              );
              return (
                <PharmacyCard
                  key={pharmacy.id}
                  pharmacy={pharmacy}
                  stockItem={stock}
                  medicine={selectedMedicine}
                  onHoldMedication={(p, s) => handleStartHold(p, s)}
                  onOpenStockAlert={(p) => setTargetAlertPharmacy(p)}
                  onSelectForMap={(p) => setSelectedPharmacyId(p.id)}
                  isSelected={selectedPharmacyId === pharmacy.id}
                />
              );
            })}
          </div>
        )}

        {viewMode === 'map' && (
          <div className="space-y-4">
            <InteractiveMap
              pharmacies={filteredPharmacies}
              stockItems={stockItems}
              medicine={selectedMedicine}
              selectedPharmacyId={selectedPharmacyId}
              onSelectPharmacy={(p) => setSelectedPharmacyId(p.id)}
              onHoldMedication={(p, s) => handleStartHold(p, s)}
            />
          </div>
        )}

        {/* Educational / Trust Footer Section */}
        <section className="pt-8 border-t border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <div className="bg-white rounded-xl p-5 border border-slate-200">
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center mb-3">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm mb-1">
              Direct EDI Inventory Feeds
            </h4>
            <p className="text-slate-600 leading-relaxed">
              Stock quantities reflect real-time electronic data interchange (EDI 852) transmitted directly from pharmacy inventory databases every 10–15 minutes.
            </p>
          </div>

          <div className="bg-white rounded-xl p-5 border border-slate-200">
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center mb-3">
              <Clock className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm mb-1">
              Guaranteed 3-Hour Shelf Holds
            </h4>
            <p className="text-slate-600 leading-relaxed">
              Reserving a dose places an active electronic hold tag at the pharmacy dispensing queue, giving you time to travel without risk of sold-out disappointment.
            </p>
          </div>

          <div className="bg-white rounded-xl p-5 border border-slate-200">
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center mb-3">
              <Building2 className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm mb-1">
              Generic Bioequivalence Standard
            </h4>
            <p className="text-slate-600 leading-relaxed">
              All listed generic alternatives comply with the FDA Orange Book AB-rating standard, confirming clinical equivalence at substantial cost savings.
            </p>
          </div>
        </section>
      </main>

      {/* Quiet Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 text-xs text-slate-500 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">MedLocate</span>
            <span>·</span>
            <span>Healthcare Availability Engine</span>
            <span>·</span>
            <span className="font-mono">HIPAA & FDA Standards Compliant</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setIsPharmacistMode(true)}
              className="hover:text-slate-900 transition-colors font-medium"
            >
              Pharmacist Portal Login
            </button>
            <button
              onClick={() => setIsGenericModalOpen(true)}
              className="hover:text-slate-900 transition-colors"
            >
              Generic Savings Index
            </button>
            <button
              onClick={() => setIsReservationsModalOpen(true)}
              className="hover:text-slate-900 transition-colors"
            >
              Manage My Holds ({activeReservationsCount})
            </button>
          </div>
        </div>
      </footer>

      {/* Modals & Overlays */}
      <GenericComparisonModal
        isOpen={isGenericModalOpen}
        onClose={() => setIsGenericModalOpen(false)}
        medicine={selectedMedicine}
        onSwitchToGeneric={handleSwitchToGeneric}
      />

      <PrescriptionScannerModal
        isOpen={isScannerModalOpen}
        onClose={() => setIsScannerModalOpen(false)}
        onLocatePrescriptionItems={handleLocatePrescriptionItems}
        medicines={medicines}
      />

      <ReservationModal
        isOpen={Boolean(targetReservationPharmacy && targetReservationStock)}
        onClose={() => {
          setTargetReservationPharmacy(null);
          setTargetReservationStock(null);
        }}
        pharmacy={targetReservationPharmacy}
        stockItem={targetReservationStock}
        medicine={selectedMedicine}
        onConfirmReservation={handleConfirmReservation}
      />

      <StockAlertModal
        isOpen={Boolean(targetAlertPharmacy)}
        onClose={() => setTargetAlertPharmacy(null)}
        pharmacy={targetAlertPharmacy}
        medicine={selectedMedicine}
        onSubscribeAlert={() => {}}
      />

      <DrugSafetyDrawer
        isOpen={isSafetyDrawerOpen}
        onClose={() => setIsSafetyDrawerOpen(false)}
        medicine={selectedMedicine}
        allMedicines={medicines}
      />

      <MyReservationsModal
        isOpen={isReservationsModalOpen}
        onClose={() => setIsReservationsModalOpen(false)}
        reservations={reservations}
        onCancelReservation={handleCancelReservation}
      />

      {/* Floating n8n Chat Concierge Widget */}
      <N8nChatWidget
        isOpen={isChatOpen}
        onToggle={() => setIsChatOpen((prev) => !prev)}
      />
    </div>
  );
}
