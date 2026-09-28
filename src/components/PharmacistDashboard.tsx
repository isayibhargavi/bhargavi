import React, { useState } from 'react';
import {
  Store,
  Package,
  Plus,
  Minus,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RefreshCw,
  Search,
  Filter,
  Check,
  X,
  Phone,
  ArrowRight,
} from 'lucide-react';
import { Pharmacy, PharmacyStockItem, Medicine, ReservationHold } from '../types';

interface PharmacistDashboardProps {
  pharmacy: Pharmacy;
  medicines: Medicine[];
  stockItems: PharmacyStockItem[];
  reservations: ReservationHold[];
  onUpdateStock: (pharmacyId: string, medicineId: string, deltaOrExact: number, isDelta: boolean) => void;
  onUpdateStatus: (pharmacyId: string, medicineId: string, newStatus: PharmacyStockItem['status']) => void;
  onFulfillReservation: (reservationId: string) => void;
  onCancelReservation: (reservationId: string) => void;
  onExitPharmacistMode: () => void;
}

export const PharmacistDashboard: React.FC<PharmacistDashboardProps> = ({
  pharmacy,
  medicines,
  stockItems,
  reservations,
  onUpdateStock,
  onUpdateStatus,
  onFulfillReservation,
  onCancelReservation,
  onExitPharmacistMode,
}) => {
  const [filterSearch, setFilterSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'inventory' | 'holds'>('inventory');

  const pharmacyStock = stockItems.filter((s) => s.pharmacyId === pharmacy.id);
  const pharmacyReservations = reservations.filter((r) => r.pharmacyId === pharmacy.id);

  const filteredItems = pharmacyStock.filter((item) => {
    const med = medicines.find((m) => m.id === item.medicineId);
    if (!med) return false;
    const term = filterSearch.toLowerCase();
    return (
      med.brandName.toLowerCase().includes(term) ||
      med.genericName.toLowerCase().includes(term) ||
      med.category.toLowerCase().includes(term)
    );
  });

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      {/* Top Banner / Mode indicator */}
      <div className="bg-amber-600 text-white px-4 py-2.5 shadow-sm text-xs font-medium">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Store className="w-4 h-4" />
            <span className="font-bold">Pharmacy Partner Portal:</span>
            <span>Managing live stock & holds for {pharmacy.name} ({pharmacy.address})</span>
          </div>

          <button
            onClick={onExitPharmacistMode}
            className="px-2.5 py-1 bg-white/20 hover:bg-white/30 rounded font-semibold transition-colors flex items-center gap-1"
          >
            <span>Return to Patient Finder</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Header stats & actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Inventory & Patient Hold Control Center
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Any changes made here instantly reflect in real-time on patient search results across the city.
            </p>
          </div>

          {/* Tab buttons */}
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 shadow-2xs">
            <button
              onClick={() => setActiveTab('inventory')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 ${
                activeTab === 'inventory'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Shelf Stock ({pharmacyStock.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('holds')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 ${
                activeTab === 'holds'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Active Holds ({pharmacyReservations.filter((r) => r.status === 'active').length})</span>
            </button>
          </div>
        </div>

        {/* Inventory View */}
        {activeTab === 'inventory' && (
          <div className="mt-6 space-y-4">
            {/* Search filter for items */}
            <div className="flex items-center justify-between gap-4">
              <div className="relative max-w-sm w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Filter stock by drug name or category..."
                  value={filterSearch}
                  onChange={(e) => setFilterSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-600"
                />
              </div>

              <div className="text-xs text-slate-500 font-mono">
                Showing {filteredItems.length} formulary items
              </div>
            </div>

            {/* Inventory Table */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Medication & Form</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4 text-center">Shelf Stock</th>
                      <th className="py-3 px-4">Adjust Units</th>
                      <th className="py-3 px-4">Status Override</th>
                      <th className="py-3 px-4 text-right">Cash / Generic Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredItems.map((item) => {
                      const med = medicines.find((m) => m.id === item.medicineId);
                      if (!med) return null;

                      return (
                        <tr key={item.medicineId} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-slate-900 text-sm">{med.brandName}</div>
                            <div className="text-slate-500 font-mono text-2xs">
                              {med.genericName} · {item.strength} ({item.form})
                            </div>
                            <div className="text-slate-400 text-2xs mt-0.5">
                              Batch exp: {item.batchExpiryMonthYear}
                            </div>
                          </td>

                          <td className="py-3.5 px-4 text-slate-600">
                            {med.category}
                          </td>

                          <td className="py-3.5 px-4 text-center">
                            <span
                              className={`font-mono font-bold text-base tabular-nums inline-block px-2.5 py-0.5 rounded-md ${
                                item.unitsAvailable === 0
                                  ? 'bg-rose-50 text-rose-700'
                                  : item.unitsAvailable < 5
                                  ? 'bg-amber-50 text-amber-800'
                                  : 'bg-emerald-50 text-emerald-800'
                              }`}
                            >
                              {item.unitsAvailable}
                            </span>
                            <div className="text-slate-400 text-2xs mt-0.5">
                              {item.unitsAvailable === 0 ? 'Out of stock' : 'units ready'}
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => onUpdateStock(pharmacy.id, item.medicineId, -1, true)}
                                disabled={item.unitsAvailable <= 0}
                                className="w-7 h-7 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-30 text-slate-700 flex items-center justify-center transition-colors"
                                title="Dispense 1 unit"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => onUpdateStock(pharmacy.id, item.medicineId, 1, true)}
                                className="w-7 h-7 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 flex items-center justify-center transition-colors"
                                title="Add 1 received unit"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => onUpdateStock(pharmacy.id, item.medicineId, 10, true)}
                                className="px-2 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-mono text-2xs transition-colors"
                                title="Restock +10 units"
                              >
                                +10
                              </button>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => onUpdateStatus(pharmacy.id, item.medicineId, 'in_stock')}
                                className={`px-2 py-1 rounded text-2xs font-semibold font-mono transition-colors ${
                                  item.status === 'in_stock'
                                    ? 'bg-emerald-700 text-white'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                              >
                                In Stock
                              </button>

                              <button
                                onClick={() => onUpdateStatus(pharmacy.id, item.medicineId, 'low_stock')}
                                className={`px-2 py-1 rounded text-2xs font-semibold font-mono transition-colors ${
                                  item.status === 'low_stock'
                                    ? 'bg-amber-600 text-white'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                              >
                                Low
                              </button>

                              <button
                                onClick={() => onUpdateStatus(pharmacy.id, item.medicineId, 'out_of_stock')}
                                className={`px-2 py-1 rounded text-2xs font-semibold font-mono transition-colors ${
                                  item.status === 'out_of_stock'
                                    ? 'bg-rose-700 text-white'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                              >
                                Zero
                              </button>
                            </div>
                          </td>

                          <td className="py-3.5 px-4 text-right font-mono">
                            <div className="font-bold text-slate-900">${item.price.toFixed(2)}</div>
                            {item.genericEquivalentPrice && (
                              <div className="text-teal-700 text-2xs">
                                Gen: ${item.genericEquivalentPrice.toFixed(2)}
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Holds View */}
        {activeTab === 'holds' && (
          <div className="mt-6 space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
              <h3 className="font-bold text-slate-900 text-sm">
                Incoming Customer Shelf Reservations
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Doses reserved by patients online. They have 3 hours from reservation time to present their Rx and pick up.
              </p>
            </div>

            {pharmacyReservations.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500 text-xs">
                No patient reservations currently recorded for {pharmacy.name}.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pharmacyReservations.map((hold) => (
                  <div
                    key={hold.id}
                    className={`rounded-xl border p-4 transition-all bg-white ${
                      hold.status === 'active'
                        ? 'border-teal-300 ring-1 ring-teal-200 shadow-sm'
                        : 'border-slate-200 opacity-75'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-mono font-bold text-sm text-slate-900 block">
                          {hold.voucherCode}
                        </span>
                        <span className="text-xs text-slate-500">
                          Patient: <strong className="text-slate-800">{hold.patientName}</strong> · {hold.patientPhone}
                        </span>
                      </div>

                      <span
                        className={`text-2xs font-mono font-bold px-2 py-0.5 rounded uppercase ${
                          hold.status === 'active'
                            ? 'bg-teal-100 text-teal-800'
                            : hold.status === 'picked_up'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {hold.status.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-100 text-xs">
                      <div className="font-semibold text-slate-900">{hold.medicineName}</div>
                      <div className="text-slate-500 font-mono">
                        {hold.quantity}x {hold.strength} · Total: ${hold.totalPrice.toFixed(2)}
                      </div>
                    </div>

                    {hold.status === 'active' && (
                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                        <button
                          onClick={() => onCancelReservation(hold.id)}
                          className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-medium transition-colors"
                        >
                          Release Hold
                        </button>

                        <button
                          onClick={() => onFulfillReservation(hold.id)}
                          className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Mark Picked Up & Dispensed</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
