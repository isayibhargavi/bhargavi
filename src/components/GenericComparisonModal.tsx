import React from 'react';
import { X, Check, ArrowRight, ShieldCheck, DollarSign, Pill, Info } from 'lucide-react';
import { Medicine } from '../types';

interface GenericComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  medicine: Medicine;
  onSwitchToGeneric: (genericName: string) => void;
}

export const GenericComparisonModal: React.FC<GenericComparisonModalProps> = ({
  isOpen,
  onClose,
  medicine,
  onSwitchToGeneric,
}) => {
  if (!isOpen) return null;

  const hasGenerics = medicine.genericAlternatives.length > 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-teal-700 uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>FDA Orange Book Bioequivalence Guide</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              Generic Equivalents for {medicine.brandName}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* Clinical Equivalence Note */}
          <div className="bg-teal-50/60 rounded-xl p-4 border border-teal-100 flex items-start gap-3 text-xs text-teal-950">
            <Info className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong className="font-semibold text-teal-900">Therapeutic Equivalence Fact: </strong>
              Generic medications contain the identical active ingredient, dosage form, safety profile, strength, and route of administration as their brand-name counterparts. State pharmacy law permits automatic generic substitution unless your doctor marks &quot;Dispense as Written&quot; (DAW).
            </div>
          </div>

          {/* Side-by-side or List of Generic Options */}
          {hasGenerics ? (
            <div className="space-y-4">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                FDA-Approved Bioequivalent Formulations
              </div>

              {medicine.genericAlternatives.map((generic) => (
                <div
                  key={generic.id}
                  className="rounded-xl border border-slate-200 p-4 hover:border-teal-400 transition-all bg-white shadow-2xs"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-base text-slate-900">
                        {generic.name}
                      </h4>
                      <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                        <span>Active: {generic.genericName}</span>
                        <span>·</span>
                        <span>Mfg: {generic.manufacturer}</span>
                        <span>·</span>
                        <span className="font-mono">{generic.strength}</span>
                      </div>
                      <div className="mt-2 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md inline-flex items-center gap-1 font-mono">
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span>Rating: {generic.fdaEquivalentCode}</span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs text-slate-400">Average Cash Price</div>
                      <div className="text-lg font-bold font-mono text-teal-700 tabular-nums">
                        ${generic.averagePrice.toFixed(2)}
                      </div>
                      <div className="text-xs font-semibold text-emerald-700 font-mono">
                        Save {generic.savingsPercentage}% vs Brand
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-mono">
                      Stocked in {generic.inStockCount} nearby network pharmacies
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        onSwitchToGeneric(generic.genericName);
                        onClose();
                      }}
                      className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
                    >
                      <span>Check Local Stock for This Generic</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-slate-50 rounded-xl border border-slate-200">
              <Pill className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <h4 className="font-bold text-slate-800 text-sm">No Generic Version Available Yet</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 leading-relaxed">
                {medicine.brandName} is currently patent-protected or biologic. No generic equivalent has received FDA approval at this time.
              </p>
            </div>
          )}

          {/* Visual reference footer */}
          <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50 p-4 flex items-center gap-4">
            <img
              src="/src/assets/images/medicine_packaging_bottles_1790579314823.jpg"
              alt="Pharmaceutical bottles and blister packaging"
              className="w-20 h-16 object-cover rounded-lg shrink-0 border border-slate-200"
              referrerPolicy="no-referrer"
            />
            <div className="text-xs text-slate-600 leading-relaxed">
              <strong className="text-slate-900 block font-semibold mb-0.5">Pharmacist Tip:</strong>
              When picking up your prescription, ask the dispensing pharmacist if a generic substitution is available. Most insurance formularies prefer Tier-1 generics with co-pays as low as $0 - $5.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded-lg transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
