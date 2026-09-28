import React, { useState } from 'react';
import { X, Bell, CheckCircle2, MessageSquare, Mail, ShieldCheck } from 'lucide-react';
import { Pharmacy, Medicine, StockAlertSubscription } from '../types';

interface StockAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  pharmacy: Pharmacy | null;
  medicine: Medicine | null;
  onSubscribeAlert: (sub: StockAlertSubscription) => void;
}

export const StockAlertModal: React.FC<StockAlertModalProps> = ({
  isOpen,
  onClose,
  pharmacy,
  medicine,
  onSubscribeAlert,
}) => {
  const [method, setMethod] = useState<'sms' | 'email'>('sms');
  const [contactValue, setContactValue] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen || !pharmacy || !medicine) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactValue.trim()) return;

    const sub: StockAlertSubscription = {
      id: `sub-${Date.now()}`,
      medicineId: medicine.id,
      medicineName: medicine.brandName,
      strength: medicine.defaultStrength,
      contactMethod: method,
      contactValue: contactValue.trim(),
      maxDistanceMiles: pharmacy.distanceMiles + 5,
      createdAt: new Date().toISOString(),
    };

    onSubscribeAlert(sub);
    setIsSubmitted(true);
  };

  const handleClose = () => {
    setIsSubmitted(false);
    setContactValue('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-teal-700 uppercase tracking-wider mb-1">
              <Bell className="w-4 h-4 text-teal-600" />
              <span>Real-Time Stock Watch</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              Notify When In Stock
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs">
                <div className="font-semibold text-slate-900">{medicine.brandName} ({medicine.genericName})</div>
                <div className="text-slate-500 mt-0.5">{pharmacy.name} · {pharmacy.address}</div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                As soon as the distributor delivery truck is checked in or a new batch is registered via EDI, you will receive an automated ping so you can hold your unit before stock depletes.
              </p>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Preferred Alert Channel
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setMethod('sms')}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 border transition-all ${
                      method === 'sms'
                        ? 'border-teal-600 bg-teal-50 text-teal-900'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-teal-600" />
                    <span>SMS Text Alert</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMethod('email')}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 border transition-all ${
                      method === 'email'
                        ? 'border-teal-600 bg-teal-50 text-teal-900'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5 text-teal-600" />
                    <span>Email Notification</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {method === 'sms' ? 'Mobile Phone Number *' : 'Email Address *'}
                </label>
                <input
                  type={method === 'sms' ? 'tel' : 'email'}
                  required
                  placeholder={method === 'sms' ? '(415) 555-0182' : 'alex@example.com'}
                  value={contactValue}
                  onChange={(e) => setContactValue(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl transition-colors shadow-sm flex items-center justify-center gap-1.5"
              >
                <Bell className="w-4 h-4" />
                <span>Set Free Stock Alert</span>
              </button>
            </form>
          ) : (
            <div className="space-y-4 text-center animate-in fade-in">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 text-lg">Alert Activated</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                We will notify <strong className="font-mono text-slate-900">{contactValue}</strong> the moment {medicine.brandName} restocks at {pharmacy.name}.
              </p>

              <button
                type="button"
                onClick={handleClose}
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
