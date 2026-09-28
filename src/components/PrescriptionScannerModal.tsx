import React, { useState } from 'react';
import { X, Upload, FileText, CheckCircle2, AlertCircle, Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { SAMPLE_PRESCRIPTIONS } from '../data/mockData';
import { Medicine } from '../types';

interface PrescriptionScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLocatePrescriptionItems: (medicineIds: string[]) => void;
  medicines: Medicine[];
}

export const PrescriptionScannerModal: React.FC<PrescriptionScannerModalProps> = ({
  isOpen,
  onClose,
  onLocatePrescriptionItems,
  medicines,
}) => {
  const [selectedSampleIndex, setSelectedSampleIndex] = useState<number>(0);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [hasScanned, setHasScanned] = useState<boolean>(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentSample = SAMPLE_PRESCRIPTIONS[selectedSampleIndex];

  const handleSimulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setHasScanned(true);
    }, 1200);
  };

  const handleUploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFileName(e.target.files[0].name);
      setIsScanning(true);
      setTimeout(() => {
        setIsScanning(false);
        setHasScanned(true);
      }, 1400);
    }
  };

  const handleApplyPrescription = () => {
    const medIds = currentSample.items
      .map((it) => it.matchedMedicineId)
      .filter((id): id is string => Boolean(id));
    onLocatePrescriptionItems(medIds);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-teal-700 uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4 text-teal-600" />
              <span>Multi-Medication Availability Matcher</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              Prescription Slip Reader
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          <p className="text-xs text-slate-600 leading-relaxed">
            Upload a doctor&apos;s prescription slip or photo. We scan and verify all prescribed medications simultaneously to locate a single pharmacy that has every item in stock today.
          </p>

          {/* Sample Prescriptions Picker */}
          <div>
            <div className="text-xs font-semibold text-slate-700 mb-2">
              Choose a Sample Doctor Script to test:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SAMPLE_PRESCRIPTIONS.map((sample, idx) => (
                <button
                  key={sample.title}
                  onClick={() => {
                    setSelectedSampleIndex(idx);
                    setHasScanned(false);
                    setUploadedFileName(null);
                  }}
                  className={`text-left p-3 rounded-xl border text-xs transition-all ${
                    selectedSampleIndex === idx
                      ? 'border-teal-600 bg-teal-50/50 ring-1 ring-teal-500'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="font-semibold text-slate-900">{sample.title}</div>
                  <div className="text-slate-500 mt-0.5 truncate">{sample.doctor}</div>
                  <div className="text-teal-700 font-mono mt-1">
                    {sample.items.length} prescribed items
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Document Preview & Scan Visual */}
          <div className="relative rounded-xl border border-slate-200 overflow-hidden bg-slate-900">
            <div className="relative h-44 sm:h-52 w-full">
              <img
                src="/src/assets/images/prescription_rx_document_1790579299870.jpg"
                alt="Doctor prescription script on clinical desk"
                className="w-full h-full object-cover opacity-60"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent p-4 flex flex-col justify-end">
                <div className="text-xs font-mono text-teal-400">
                  {uploadedFileName ? `Uploaded: ${uploadedFileName}` : currentSample.clinic}
                </div>
                <div className="text-white font-bold text-sm">
                  {uploadedFileName ? 'Custom Patient Upload' : currentSample.doctor}
                </div>
                <div className="text-xs text-slate-300 font-mono mt-1">
                  Issued: {currentSample.date} · State Rx Registry Verified
                </div>
              </div>

              {/* Scanning laser animation overlay */}
              {isScanning && (
                <div className="absolute inset-x-0 h-1 bg-teal-400 shadow-[0_0_15px_#2dd4bf] animate-[bounce_1.5s_infinite]"></div>
              )}
            </div>

            {/* Scan Action Button */}
            <div className="p-3 bg-slate-950 flex items-center justify-between">
              <label className="cursor-pointer text-xs font-medium text-slate-300 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 transition-colors">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Own File / Photo</span>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  className="hidden"
                  onChange={handleUploadFile}
                />
              </label>

              <button
                type="button"
                onClick={handleSimulateScan}
                disabled={isScanning}
                className="px-4 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                {isScanning ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Extracting Medications...</span>
                  </>
                ) : (
                  <>
                    <FileText className="w-3.5 h-3.5" />
                    <span>Scan Prescription</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Detected Items Panel */}
          {hasScanned && (
            <div className="rounded-xl border border-teal-200 bg-teal-50/40 p-4 space-y-3 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-teal-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" />
                  <span>{currentSample.items.length} Medications Successfully Detected</span>
                </span>
                <span className="text-slate-500 font-mono text-2xs">OCR Confidence: 99.4%</span>
              </div>

              <div className="space-y-2">
                {currentSample.items.map((item, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-lg p-3 border border-slate-200 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{item.detectedName}</div>
                      <div className="text-slate-500 font-mono mt-0.5">
                        {item.detectedStrength} · Sig: {item.instructions} · {item.quantityPrescribed}
                      </div>
                    </div>
                    <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-mono font-semibold text-2xs">
                      Available Nearby
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleApplyPrescription}
                  className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <span>Find Pharmacy with ALL Items</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
