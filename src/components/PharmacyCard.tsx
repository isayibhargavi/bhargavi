import React from 'react';
import {
  MapPin,
  Phone,
  Clock,
  Car,
  Truck,
  CheckCircle2,
  AlertCircle,
  XCircle,
  ExternalLink,
  ShieldCheck,
  Snowflake,
  Star,
  BookmarkCheck,
} from 'lucide-react';
import { Pharmacy, PharmacyStockItem, Medicine } from '../types';

interface PharmacyCardProps {
  pharmacy: Pharmacy;
  stockItem?: PharmacyStockItem;
  medicine: Medicine;
  onHoldMedication: (pharmacy: Pharmacy, stockItem: PharmacyStockItem) => void;
  onOpenStockAlert: (pharmacy: Pharmacy) => void;
  onSelectForMap: (pharmacy: Pharmacy) => void;
  isSelected: boolean;
}

export const PharmacyCard: React.FC<PharmacyCardProps> = ({
  pharmacy,
  stockItem,
  medicine,
  onHoldMedication,
  onOpenStockAlert,
  onSelectForMap,
  isSelected,
}) => {
  const isOutOfStock = !stockItem || stockItem.status === 'out_of_stock' || stockItem.unitsAvailable === 0;
  const isLowStock = stockItem?.status === 'low_stock';
  const isInStock = stockItem?.status === 'in_stock' && stockItem.unitsAvailable > 0;

  return (
    <div
      onClick={() => onSelectForMap(pharmacy)}
      className={`bg-white rounded-xl border transition-all cursor-pointer relative ${
        isSelected
          ? 'border-teal-600 ring-2 ring-teal-500/20 shadow-md'
          : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
      }`}
    >
      <div className="p-4 sm:p-5">
        {/* Top Header: Pharmacy Identity & Distance */}
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap text-xs text-slate-500 mb-1">
              <span className="font-semibold text-slate-700 capitalize">
                {pharmacy.chainOrIndependent === 'hospital'
                  ? 'Hospital Pharmacy'
                  : pharmacy.chainOrIndependent === 'independent'
                  ? 'Independent Pharmacy'
                  : 'Retail Pharmacy Chain'}
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums font-semibold text-slate-900">
                {pharmacy.distanceMiles} miles away
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-0.5 text-amber-700 font-mono">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span className="font-semibold">{pharmacy.rating}</span>
                <span className="text-slate-400">({pharmacy.reviewCount})</span>
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
              {pharmacy.name}
            </h3>

            <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{pharmacy.address}, {pharmacy.city}</span>
            </div>
          </div>

          {/* Stock Status Badge */}
          <div className="shrink-0 text-right">
            {isInStock && (
              <div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>In Stock</span>
                </span>
                <div className="mt-1 font-mono text-xs text-slate-600 tabular-nums">
                  <strong className="text-slate-900 font-bold">{stockItem?.unitsAvailable}</strong> boxes left
                </div>
              </div>
            )}

            {isLowStock && (
              <div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Low Stock</span>
                </span>
                <div className="mt-1 font-mono text-xs text-amber-700 tabular-nums font-semibold">
                  Only {stockItem?.unitsAvailable} left
                </div>
              </div>
            )}

            {isOutOfStock && (
              <div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                  <XCircle className="w-3.5 h-3.5 text-slate-400" />
                  <span>Out of Stock</span>
                </span>
                <div className="mt-1 text-xs text-slate-400">
                  Restock pending
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Price & Pricing Breakdown */}
        {stockItem && (
          <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-100">
              <span className="text-slate-500 block">Brand Price ({medicine.brandName})</span>
              <span className="font-mono text-sm font-bold text-slate-900 tabular-nums">
                ${stockItem.price.toFixed(2)}
              </span>
            </div>

            {stockItem.genericEquivalentPrice ? (
              <div className="bg-teal-50/70 rounded-lg p-2.5 border border-teal-100">
                <div className="flex items-center justify-between">
                  <span className="text-teal-900 block font-medium">Generic Substitute</span>
                  <span className="text-teal-700 font-mono text-2xs font-semibold">SAVE ~75%</span>
                </div>
                <span className="font-mono text-sm font-bold text-teal-800 tabular-nums">
                  ${stockItem.genericEquivalentPrice.toFixed(2)}
                </span>
              </div>
            ) : (
              <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-100">
                <span className="text-slate-500 block">Generic Equivalent</span>
                <span className="text-slate-400 italic">None currently FDA-approved</span>
              </div>
            )}

            <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-100">
              <span className="text-slate-500 block">Est. Commercial Copay</span>
              <span className="font-mono text-sm font-semibold text-slate-800 tabular-nums">
                ${(stockItem.insuranceCopayEstimate ?? 10).toFixed(2)}
              </span>
            </div>
          </div>
        )}

        {/* Operating Hours & Services */}
        <div className="mt-3 flex items-center justify-between flex-wrap gap-2 text-xs text-slate-600">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 font-medium">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span className={pharmacy.isOpenNow ? 'text-emerald-700' : 'text-rose-600'}>
                {pharmacy.isOpen24Hours
                  ? 'Open 24 Hours'
                  : pharmacy.isOpenNow
                  ? `Open now (closes ${pharmacy.closesAt})`
                  : 'Closed now'}
              </span>
            </div>

            {pharmacy.hasDriveThru && (
              <div className="flex items-center gap-1 text-slate-500">
                <Car className="w-3.5 h-3.5 text-slate-400" />
                <span>Drive-Thru</span>
              </div>
            )}

            {pharmacy.hasHomeDelivery && (
              <div className="flex items-center gap-1 text-slate-500 font-mono">
                <Truck className="w-3.5 h-3.5 text-slate-400" />
                <span>Delivery (~{pharmacy.deliveryEstimatedMins}m)</span>
              </div>
            )}

            {pharmacy.hasColdStorageCert && medicine.category === 'Diabetes' && (
              <div className="flex items-center gap-1 text-sky-700 bg-sky-50 px-2 py-0.5 rounded font-medium">
                <Snowflake className="w-3 h-3 text-sky-600" />
                <span>Certified Cold Chain</span>
              </div>
            )}
          </div>

          {/* Verification Timestamp */}
          {stockItem && (
            <div className="text-slate-400 font-mono text-2xs tabular-nums">
              Verified {stockItem.lastVerifiedMinutesAgo}m ago via Live EDI
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <a
              href={`tel:${pharmacy.phone.replace(/[^0-9]/g, '')}`}
              onClick={(e) => e.stopPropagation()}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-slate-500" />
              <span>{pharmacy.phone}</span>
            </a>

            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(`${pharmacy.name}, ${pharmacy.address}, ${pharmacy.city}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors"
            >
              <span>Map / Route</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          </div>

          <div className="flex items-center gap-2">
            {isOutOfStock ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenStockAlert(pharmacy);
                }}
                className="px-3.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <span>Notify When In Stock</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (stockItem) {
                    onHoldMedication(pharmacy, stockItem);
                  }
                }}
                className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs whitespace-nowrap"
              >
                <BookmarkCheck className="w-3.5 h-3.5" />
                <span>Reserve for Pickup (3h Hold)</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
