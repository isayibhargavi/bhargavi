import React from 'react';
import { AlertTriangle, Info, ArrowRight, ShieldAlert } from 'lucide-react';
import { Medicine } from '../types';

interface ShortageNoticeProps {
  medicine: Medicine;
  onViewGenerics: () => void;
  onViewHospitalPharmacies: () => void;
}

export const ShortageNotice: React.FC<ShortageNoticeProps> = ({
  medicine,
  onViewGenerics,
  onViewHospitalPharmacies,
}) => {
  if (medicine.shortageStatus === 'normal') return null;

  const isCritical = medicine.shortageStatus === 'critical_shortage';

  return (
    <div
      className={`rounded-xl border p-4 transition-all ${
        isCritical
          ? 'bg-rose-50/80 border-rose-200 text-rose-950'
          : 'bg-amber-50/80 border-amber-200 text-amber-950'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="shrink-0 mt-0.5">
          {isCritical ? (
            <ShieldAlert className="w-5 h-5 text-rose-600" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-amber-600" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 flex-wrap text-sm font-semibold">
            <span>{isCritical ? 'FDA National Supply Advisory' : 'Regional Supply Constraint'}</span>
            <span className="text-xs font-normal opacity-80">·</span>
            <span className="text-xs font-normal opacity-80">Updated 6 hours ago via Health Supply Network</span>
          </div>

          <p className="mt-1 text-xs leading-relaxed opacity-90">
            {medicine.shortageNotes ||
              `${medicine.brandName} (${medicine.genericName}) is experiencing distribution delays across regional retail chains.`}
          </p>

          <div className="mt-3 flex items-center gap-3 flex-wrap">
            {medicine.genericAlternatives.length > 0 && (
              <button
                onClick={onViewGenerics}
                className="text-xs font-semibold inline-flex items-center gap-1.5 underline underline-offset-2 hover:opacity-80"
              >
                <span>View {medicine.genericAlternatives.length} Bioequivalent Generic Substitutes</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              onClick={onViewHospitalPharmacies}
              className="text-xs font-medium inline-flex items-center gap-1 text-slate-700 hover:text-slate-900 bg-white/70 px-2.5 py-1 rounded-md border border-slate-200"
            >
              <span>Check Hospital Outpatient Pharmacies</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
