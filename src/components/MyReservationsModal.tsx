import React, { useState, useEffect } from 'react';
import { X, Clock, MapPin, Phone, CheckCircle2, AlertCircle, Copy, Check, Trash2, ArrowUpRight } from 'lucide-react';
import { ReservationHold } from '../types';

interface MyReservationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservations: ReservationHold[];
  onCancelReservation: (id: string) => void;
}

export const MyReservationsModal: React.FC<MyReservationsModalProps> = ({
  isOpen,
  onClose,
  reservations,
  onCancelReservation,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [now, setNow] = useState(Date.now());

  // Update timer every 10 seconds for clean countdowns
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 10000);
    return () => clearInterval(timer);
  }, []);

  if (!isOpen) return null;

  const handleCopy = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getRemainingTime = (expiresAt: string) => {
    const diffMs = new Date(expiresAt).getTime() - now;
    if (diffMs <= 0) return 'Expired';
    const totalMinutes = Math.floor(diffMs / (60 * 1000));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}m remaining`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-teal-700 uppercase tracking-wider mb-1">
              <Clock className="w-4 h-4 text-teal-600" />
              <span>Pharmacy Counter Hold Passes</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              My Active Reservations ({reservations.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of reservations */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {reservations.length === 0 ? (
            <div className="text-center py-10 bg-slate-50 rounded-xl border border-slate-200">
              <Clock className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <div className="font-bold text-slate-700 text-sm">No Active Holds</div>
              <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">
                When you reserve an in-stock medication at a pharmacy, your 3-hour pickup voucher will appear here.
              </p>
            </div>
          ) : (
            reservations.map((hold) => {
              const isExpired = new Date(hold.expiresAt).getTime() <= now;
              const isActive = hold.status === 'active' && !isExpired;

              return (
                <div
                  key={hold.id}
                  className={`rounded-xl border p-4 transition-all ${
                    isActive
                      ? 'border-teal-300 bg-teal-50/20 shadow-2xs'
                      : 'border-slate-200 bg-slate-50 opacity-80'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-black text-slate-900">
                          {hold.voucherCode}
                        </span>
                        <button
                          onClick={() => handleCopy(hold.id, hold.voucherCode)}
                          className="text-slate-400 hover:text-slate-600 p-0.5"
                          title="Copy voucher code"
                        >
                          {copiedId === hold.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>

                      <div className="font-bold text-slate-900 text-base mt-1">
                        {hold.medicineName}
                      </div>
                      <div className="text-xs text-slate-500 font-mono">
                        {hold.quantity} unit(s) · {hold.strength} · Est: ${hold.totalPrice.toFixed(2)}
                      </div>
                    </div>

                    <div className="text-right">
                      {isActive ? (
                        <div className="inline-flex items-center gap-1 font-mono text-xs font-semibold text-teal-800 bg-teal-100 px-2.5 py-1 rounded-md">
                          <Clock className="w-3 h-3 text-teal-600 animate-pulse" />
                          <span>{getRemainingTime(hold.expiresAt)}</span>
                        </div>
                      ) : (
                        <span className="text-2xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-200 text-slate-600">
                          {hold.status === 'picked_up' ? 'Picked Up' : 'Expired'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Pharmacy location & direct call */}
                  <div className="mt-3 pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-600 flex-wrap gap-2">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-medium text-slate-900">{hold.pharmacyName}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      {isActive && (
                        <button
                          onClick={() => onCancelReservation(hold.id)}
                          className="text-slate-400 hover:text-rose-600 text-2xs flex items-center gap-1 transition-colors"
                          title="Cancel hold if not needed"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Cancel Hold</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white font-semibold text-xs rounded-xl hover:bg-slate-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
