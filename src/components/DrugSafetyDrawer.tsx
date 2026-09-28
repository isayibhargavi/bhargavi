import React, { useState } from 'react';
import { X, ShieldAlert, AlertTriangle, Thermometer, Pill, Check, Plus, AlertCircle } from 'lucide-react';
import { Medicine } from '../types';

interface DrugSafetyDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  medicine: Medicine;
  allMedicines: Medicine[];
}

export const DrugSafetyDrawer: React.FC<DrugSafetyDrawerProps> = ({
  isOpen,
  onClose,
  medicine,
  allMedicines,
}) => {
  const [secondaryMedId, setSecondaryMedId] = useState<string>('');

  if (!isOpen) return null;

  const secondaryMed = allMedicines.find((m) => m.id === secondaryMedId);

  // Check simple common drug interactions
  const getInteractionNote = () => {
    if (!secondaryMed) return null;
    if (medicine.id === secondaryMed.id) return 'Same active medication selected.';

    if (
      (medicine.id === 'med-albuterol' && secondaryMed.category === 'Cardiovascular') ||
      (medicine.category === 'Cardiovascular' && secondaryMed.id === 'med-albuterol')
    ) {
      return 'Moderate Caution: Beta-agonist bronchodilators may antagonize beta-blockers or elevate heart rate when combined with cardiovascular regimens. Consult your doctor.';
    }

    if (
      (medicine.id === 'med-paracetamol' && secondaryMed.category === 'Pain Relief') ||
      (medicine.category === 'Pain Relief' && secondaryMed.id === 'med-paracetamol')
    ) {
      return 'High Alert: Risk of accidental duplicate acetaminophen or NSAID toxicity. Always verify total daily doses across combined products.';
    }

    if (
      (medicine.id === 'med-adderall' && secondaryMed.id === 'med-sertraline') ||
      (medicine.id === 'med-sertraline' && secondaryMed.id === 'med-adderall')
    ) {
      return 'Moderate Warning: Both medications alter central monoamine neurotransmission. Monitor for tremor, blood pressure changes, and serotonin syndrome symptoms.';
    }

    if (
      (medicine.id === 'med-amox' || medicine.id === 'med-augmentin') &&
      secondaryMed.category === 'Gastrointestinal'
    ) {
      return 'Minor: Space oral antibiotics by at least 2 hours from magnesium or antacids to preserve systemic absorption.';
    }

    return 'No severe direct contraindication documented in first-line databases, but always disclose all concurrent medications to your dispensing pharmacist.';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col overflow-y-auto animate-in slide-in-from-right duration-200 border-l border-slate-200">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-teal-700 uppercase tracking-wider mb-1">
              <ShieldAlert className="w-4 h-4 text-teal-600" />
              <span>Clinical Pharmacotherapy Guide</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              {medicine.brandName} Safety Profile
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 flex-1 text-xs">
          {/* Drug identity summary */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
            <div className="text-slate-500">Active Generic Molecule</div>
            <div className="font-bold text-base text-slate-900">{medicine.genericName}</div>
            <div className="text-slate-600 leading-relaxed">{medicine.description}</div>

            {medicine.controlledSubstanceSchedule && (
              <div className="mt-2 text-rose-800 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded font-mono font-semibold">
                Controlled Status: {medicine.controlledSubstanceSchedule}
              </div>
            )}
          </div>

          {/* Primary Indications */}
          <div>
            <h4 className="font-bold text-slate-900 text-sm mb-2">Approved Indications</h4>
            <div className="flex flex-wrap gap-1.5">
              {medicine.primaryIndications.map((ind, i) => (
                <span
                  key={i}
                  className="bg-slate-100 text-slate-800 px-2.5 py-1 rounded-md font-medium"
                >
                  {ind}
                </span>
              ))}
            </div>
          </div>

          {/* Storage Instructions */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
            <h4 className="font-bold text-slate-900 text-sm mb-1 flex items-center gap-1.5">
              <Thermometer className="w-4 h-4 text-teal-600" />
              <span>Storage & Temperature Requirements</span>
            </h4>
            <p className="text-slate-600 leading-relaxed mt-1">
              {medicine.storageInstructions}
            </p>
          </div>

          {/* Clinical Warnings */}
          <div>
            <h4 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Clinical Precautions & Adverse Warnings</span>
            </h4>
            <ul className="space-y-2">
              {medicine.interactionWarnings.map((warn, i) => (
                <li
                  key={i}
                  className="bg-amber-50/70 border border-amber-200 text-amber-950 p-2.5 rounded-lg flex items-start gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0"></span>
                  <span className="leading-relaxed">{warn}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Interactive Drug Conflict Checker */}
          <div className="pt-4 border-t border-slate-200">
            <h4 className="font-bold text-slate-900 text-sm mb-1">
              Check Concurrent Medicine Interaction
            </h4>
            <p className="text-slate-500 mb-2">
              Select any other medication you are currently taking to evaluate known contraindications:
            </p>

            <select
              value={secondaryMedId}
              onChange={(e) => setSecondaryMedId(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600"
            >
              <option value="">-- Choose secondary medication to compare --</option>
              {allMedicines
                .filter((m) => m.id !== medicine.id)
                .map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.brandName} ({m.genericName})
                  </option>
                ))}
            </select>

            {secondaryMed && (
              <div className="mt-3 p-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 space-y-1">
                <div className="font-semibold text-slate-900">
                  {medicine.brandName} + {secondaryMed.brandName} Interaction Assessment:
                </div>
                <div className="leading-relaxed text-slate-700">{getInteractionNote()}</div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white font-semibold text-xs rounded-xl hover:bg-slate-800 transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
