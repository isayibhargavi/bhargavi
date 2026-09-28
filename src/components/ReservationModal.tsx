import React, { useState } from 'react';
import { X, CheckCircle2, Clock, MapPin, Phone, ShieldCheck, QrCode, AlertCircle, Copy, Check } from 'lucide-react';
import { Pharmacy, PharmacyStockItem, Medicine, ReservationHold } from '../types';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  pharmacy: Pharmacy | null;
  stockItem: PharmacyStockItem | null;
  medicine: Medicine | null;
  onConfirmReservation: (newReservation: ReservationHold) => void;
}

export const ReservationModal: React.FC<ReservationModalProps> = ({
  isOpen,
  onClose,
  pharmacy,
  stockItem,
  medicine,
  onConfirmReservation,
}) => {
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [pharmacistNote, setPharmacistNote] = useState('');
  const [confirmedHold, setConfirmedHold] = useState<ReservationHold | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  if (!isOpen || !pharmacy || !stockItem || !medicine) return null;

  const maxSelectable = Math.min(3, stockItem.unitsAvailable);
  const calculatedPrice = (stockItem.genericEquivalentPrice ?? stockItem.price) * quantity;

  const handleCreateReservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim() || !patientPhone.trim()) return;

    const voucherCode = `HOLD-${Math.floor(1000 + Math.random() * 9000)}-${pharmacy.postalCode}`;
    const newHold: ReservationHold = {
      id: `hold-${Date.now()}`,
      voucherCode,
      medicineId: medicine.id,
      medicineName: `${medicine.brandName} (${medicine.genericName})`,
      strength: stockItem.strength,
      quantity,
      pharmacyId: pharmacy.id,
      pharmacyName: pharmacy.name,
      pharmacyAddress: `${pharmacy.address}, ${pharmacy.city}`,
      patientName: patientName.trim(),
      patientPhone: patientPhone.trim(),
      reservedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      requiresPrescription: medicine.requiresPrescription,
      totalPrice: calculatedPrice,
    };

    onConfirmReservation(newHold);
    setConfirmedHold(newHold);
  };

  const handleCopyCode = () => {
    if (confirmedHold) {
      navigator.clipboard.writeText(confirmedHold.voucherCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleResetAndClose = () => {
    setConfirmedHold(null);
    setPatientName('');
    setPatientPhone('');
    setPharmacistNote('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-teal-700 uppercase tracking-wider mb-1">
              <Clock className="w-4 h-4 text-teal-600" />
              <span>3-Hour Guaranteed Shelf Hold</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              {confirmedHold ? 'Medication Held Successfully' : 'Hold Medication for Pickup'}
            </h3>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {!confirmedHold ? (
            /* Reservation Form */
            <form onSubmit={handleCreateReservation} className="space-y-4">
              {/* Summary box */}
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-3.5 text-xs space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-bold text-slate-900 text-sm">{medicine.brandName}</div>
                    <div className="text-slate-500">{medicine.genericName} · {stockItem.strength}</div>
                  </div>
                  <span className="font-mono text-xs font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    {stockItem.unitsAvailable} Available
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-slate-600">
                  <span className="font-semibold text-slate-800">{pharmacy.name}</span>
                  <span className="font-mono">{pharmacy.distanceMiles} mi away</span>
                </div>
              </div>

              {medicine.requiresPrescription && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-900 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Prescription Required at Counter: </strong>
                    Please bring your physical doctor prescription or ensure your physician sent an e-script to this pharmacy.
                  </div>
                </div>
              )}

              {/* Form fields */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Patient Full Name (matching ID or Rx) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Morgan"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mobile Phone for SMS Hold Confirmation *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="(415) 555-0199"
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Quantity to Hold
                  </label>
                  <select
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600"
                  >
                    {Array.from({ length: maxSelectable }, (_, i) => i + 1).map((qty) => (
                      <option key={qty} value={qty}>
                        {qty} {stockItem.form}(s)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Estimated Pickup Cost
                  </label>
                  <div className="px-3.5 py-2 bg-slate-100 rounded-lg text-sm font-mono font-bold text-slate-900 tabular-nums">
                    ${calculatedPrice.toFixed(2)}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Optional Note for Dispensing Pharmacist
                </label>
                <input
                  type="text"
                  placeholder="e.g. Bringing written script; prefer generic if possible"
                  value={pharmacistNote}
                  onChange={(e) => setPharmacistNote(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm 3-Hour Reservation (Free)</span>
                </button>
              </div>
            </form>
          ) : (
            /* Hold Voucher Confirmation */
            <div className="space-y-5 animate-in fade-in">
              <div className="text-center">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-2">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-900 text-lg">Dose Held on Shelf</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  The pharmacy team has been alerted to set aside your package.
                </p>
              </div>

              {/* Printable Voucher Card */}
              <div className="border-2 border-dashed border-teal-300 bg-teal-50/40 rounded-2xl p-4 text-xs space-y-3">
                <div className="flex items-center justify-between border-b border-teal-100 pb-2">
                  <span className="font-semibold text-slate-500 uppercase tracking-wider text-2xs">
                    Official Pharmacy Pickup Pass
                  </span>
                  <span className="font-mono font-bold text-teal-800 text-xs">
                    Valid for 3 Hours
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 block text-2xs uppercase">Voucher Code</span>
                    <span className="font-mono text-base font-black text-slate-900 tracking-wider">
                      {confirmedHold.voucherCode}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="px-2.5 py-1 bg-white border border-slate-200 hover:bg-slate-50 rounded text-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-teal-100">
                  <div>
                    <span className="text-slate-400 block text-2xs">Patient Name</span>
                    <span className="font-semibold text-slate-900">{confirmedHold.patientName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-2xs">Held Items</span>
                    <span className="font-semibold text-slate-900 font-mono">
                      {confirmedHold.quantity}x {confirmedHold.strength}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-teal-100">
                  <span className="text-slate-400 block text-2xs">Pharmacy Location</span>
                  <span className="font-semibold text-slate-900 block">{confirmedHold.pharmacyName}</span>
                  <span className="text-slate-600">{confirmedHold.pharmacyAddress}</span>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs text-slate-600 space-y-1">
                <div className="font-semibold text-slate-900">What to do upon arrival:</div>
                <ul className="list-disc list-inside space-y-0.5 text-slate-600">
                  <li>Walk up to the pickup or drive-thru window.</li>
                  <li>Show voucher code <code className="font-mono font-bold text-slate-900">{confirmedHold.voucherCode}</code> to the technician.</li>
                  <li>Present your government ID and doctor prescription slip.</li>
                </ul>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href={`tel:${pharmacy.phone.replace(/[^0-9]/g, '')}`}
                  className="flex-1 py-2 text-center bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl transition-colors"
                >
                  Call Pharmacy
                </a>
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="flex-1 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl transition-colors"
                >
                  Done & Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
