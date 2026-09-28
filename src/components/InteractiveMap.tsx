import React, { useState } from 'react';
import { Pharmacy, PharmacyStockItem, Medicine } from '../types';
import { Navigation, ZoomIn, ZoomOut, CheckCircle2, AlertCircle, XCircle, MapPin, Phone } from 'lucide-react';

interface InteractiveMapProps {
  pharmacies: Pharmacy[];
  stockItems: PharmacyStockItem[];
  medicine: Medicine;
  selectedPharmacyId: string | null;
  onSelectPharmacy: (pharmacy: Pharmacy) => void;
  onHoldMedication: (pharmacy: Pharmacy, stockItem: PharmacyStockItem) => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  pharmacies,
  stockItems,
  medicine,
  selectedPharmacyId,
  onSelectPharmacy,
  onHoldMedication,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const selectedPharmacy = pharmacies.find((p) => p.id === selectedPharmacyId);
  const selectedStock = stockItems.find(
    (s) => s.pharmacyId === selectedPharmacyId && s.medicineId === medicine.id
  );

  return (
    <div className="relative bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-inner h-[460px] flex flex-col">
      {/* Map Header Overlay */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-xs text-slate-300">
        <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping"></span>
        <span className="font-semibold text-white">Live Pharmacy Radar</span>
        <span className="text-slate-600">·</span>
        <span className="font-mono text-slate-400">Centered on Metro Downtown (94108)</span>
      </div>

      {/* Map Control Buttons */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-1.5">
        <button
          onClick={() => setZoomLevel((z) => Math.min(z + 0.2, 1.6))}
          className="w-8 h-8 rounded-lg bg-slate-950/85 hover:bg-slate-800 text-white flex items-center justify-center border border-slate-800 transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoomLevel((z) => Math.max(z - 0.2, 0.8))}
          className="w-8 h-8 rounded-lg bg-slate-950/85 hover:bg-slate-800 text-white flex items-center justify-center border border-slate-800 transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
      </div>

      {/* Interactive SVG Radar Map Canvas */}
      <div className="relative flex-1 w-full h-full overflow-hidden bg-radial from-slate-900 via-slate-950 to-slate-950">
        <svg
          viewBox="0 0 1000 600"
          className="w-full h-full object-cover transition-transform duration-300 ease-out"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <defs>
            {/* Grid Pattern */}
            <pattern id="cityGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="1" />
            </pattern>
            {/* Radar gradient */}
            <radialGradient id="radarSweep" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#0d9488" stopOpacity="0.15" />
              <stop offset="60%" stopColor="#0d9488" stopOpacity="0.04" />
              <stop offset="100%" stopColor="#0d9488" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Background Grid */}
          <rect width="1000" height="600" fill="url(#cityGrid)" />

          {/* Radial distance rings from user center (500, 300) */}
          <circle cx="500" cy="300" r="300" fill="none" stroke="rgba(148, 163, 184, 0.08)" strokeDasharray="4 4" />
          <circle cx="500" cy="300" r="200" fill="none" stroke="rgba(148, 163, 184, 0.12)" strokeDasharray="4 4" />
          <circle cx="500" cy="300" r="100" fill="url(#radarSweep)" stroke="rgba(13, 148, 136, 0.25)" />

          {/* Distance labels */}
          <text x="505" y="205" fill="#64748b" fontSize="10" fontFamily="JetBrains Mono">1.0 mi</text>
          <text x="505" y="105" fill="#64748b" fontSize="10" fontFamily="JetBrains Mono">2.5 mi</text>
          <text x="505" y="25" fill="#64748b" fontSize="10" fontFamily="JetBrains Mono">5.0 mi</text>

          {/* Stylized road arteries */}
          <path d="M 100 120 Q 400 240 900 210" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="3" />
          <path d="M 220 500 Q 500 350 780 80" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="3" />
          <path d="M 490 50 L 510 550" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="2" />
          <path d="M 50 300 L 950 300" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="2" />

          {/* User Location Pulse Center (Market St / Downtown) */}
          <g transform="translate(500, 300)">
            <circle r="12" fill="rgba(13, 148, 136, 0.2)" className="animate-ping" />
            <circle r="6" fill="#0d9488" stroke="#ffffff" strokeWidth="2" />
            <text x="12" y="4" fill="#5eead4" fontSize="11" fontWeight="600" fontFamily="Plus Jakarta Sans">
              You are here
            </text>
          </g>

          {/* Pharmacy Markers */}
          {pharmacies.map((pharmacy) => {
            const stock = stockItems.find(
              (s) => s.pharmacyId === pharmacy.id && s.medicineId === medicine.id
            );
            const inStock = stock && stock.status === 'in_stock' && stock.unitsAvailable > 0;
            const lowStock = stock && stock.status === 'low_stock';
            const isSelected = selectedPharmacyId === pharmacy.id;

            // Map coordinates relative to 1000x600 viewBox
            const posX = (pharmacy.coordinates.mapXPercent / 100) * 1000;
            const posY = (pharmacy.coordinates.mapYPercent / 100) * 600;

            const pinColor = inStock ? '#10b981' : lowStock ? '#f59e0b' : '#64748b';

            return (
              <g
                key={pharmacy.id}
                transform={`translate(${posX}, ${posY})`}
                onClick={() => onSelectPharmacy(pharmacy)}
                className="cursor-pointer transition-transform hover:scale-125"
              >
                {/* Selection indicator ring */}
                {isSelected && (
                  <circle r="22" fill="none" stroke="#2dd4bf" strokeWidth="2.5" strokeDasharray="3 3" />
                )}

                {/* Pin shadow */}
                <ellipse cx="0" cy="14" rx="8" ry="3" fill="rgba(0,0,0,0.4)" />

                {/* Marker body */}
                <circle r="13" fill={pinColor} stroke="#ffffff" strokeWidth="2.5" />

                {/* Mini icon text */}
                <text
                  x="0"
                  y="4"
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="10"
                  fontWeight="bold"
                  fontFamily="JetBrains Mono"
                >
                  {inStock ? '✓' : lowStock ? '!' : '×'}
                </text>

                {/* Pharmacy brief label */}
                <text
                  x="16"
                  y="4"
                  fill={isSelected ? '#2dd4bf' : '#e2e8f0'}
                  fontSize="11"
                  fontWeight="600"
                  fontFamily="Plus Jakarta Sans"
                  className="pointer-events-none"
                >
                  {pharmacy.name.split(' ')[0]} {pharmacy.distanceMiles}mi
                </text>
              </g>
            );
          })}
        </svg>

        {/* Selected Pharmacy Bottom Card Preview Overlay */}
        {selectedPharmacy && (
          <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md z-30 bg-slate-900/95 backdrop-blur-md rounded-xl p-4 border border-slate-700 text-white shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                  <span className="font-semibold text-teal-400">
                    {selectedPharmacy.chainOrIndependent === 'hospital' ? 'Hospital Rx' : 'Retail Rx'}
                  </span>
                  <span>·</span>
                  <span className="font-mono text-slate-300">{selectedPharmacy.distanceMiles} miles away</span>
                </div>
                <h4 className="font-bold text-sm sm:text-base text-white">{selectedPharmacy.name}</h4>
                <p className="text-xs text-slate-400 mt-0.5">{selectedPharmacy.address}</p>
              </div>

              <div className="text-right shrink-0">
                {selectedStock?.status === 'in_stock' ? (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{selectedStock.unitsAvailable} in stock</span>
                  </span>
                ) : selectedStock?.status === 'low_stock' ? (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800">
                    <AlertCircle className="w-3 h-3" />
                    <span>{selectedStock?.unitsAvailable} left</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                    <XCircle className="w-3 h-3" />
                    <span>Out of stock</span>
                  </span>
                )}
                {selectedStock && (
                  <div className="mt-1 font-mono text-xs text-teal-300 font-bold">
                    ${selectedStock.price.toFixed(2)}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
              <a
                href={`tel:${selectedPharmacy.phone.replace(/[^0-9]/g, '')}`}
                className="text-xs text-slate-300 hover:text-white flex items-center gap-1 font-mono"
              >
                <Phone className="w-3 h-3 text-slate-400" />
                <span>{selectedPharmacy.phone}</span>
              </a>

              {selectedStock && selectedStock.unitsAvailable > 0 && (
                <button
                  type="button"
                  onClick={() => onHoldMedication(selectedPharmacy, selectedStock)}
                  className="px-3 py-1 bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs rounded-lg transition-colors"
                >
                  Hold Dose (3 Hours)
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Map Legend */}
      <div className="bg-slate-950 px-4 py-2.5 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 flex-wrap gap-2">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>In Stock ({'>'}5 units)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span>Low Stock (&le;4 units)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-500"></span>
            <span>Out of Stock</span>
          </span>
        </div>
        <div className="font-mono text-2xs text-slate-500">
          Click any pharmacy pin to view stock & hold medication
        </div>
      </div>
    </div>
  );
};
