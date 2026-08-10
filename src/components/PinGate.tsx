import React, { useState } from 'react';
import { Lock, ArrowLeft, ShieldCheck } from 'lucide-react';

interface PinGateProps {
  onSuccess: () => void;
}

export const PinGate: React.FC<PinGateProps> = ({ onSuccess }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // NOTE: Fallback to '1234' temporarily if env variable is missing. This must be changed!
    const expectedPin = import.meta.env.VITE_APP_PIN || '1234';
    
    if (pin === expectedPin) {
      setError(false);
      onSuccess();
    } else {
      setError(true);
      setPin('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B3A60] via-[#0f2e4a] to-[#1a365d] flex flex-col items-center justify-center font-sans text-white" dir="rtl">
      <div className="w-full max-w-sm px-6">
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-6 shadow-inner border border-white/5">
            <Lock className="w-8 h-8 text-amber-400" />
          </div>
          
          <h2 className="text-2xl font-black mb-2 text-white">لوحة تحكم الجودة</h2>
          <p className="text-slate-300 text-sm mb-8 font-semibold">
            الرجاء إدخال رمز المرور (PIN) للوصول إلى النظام
          </p>

          <form onSubmit={handleSubmit} className="w-full space-y-6">
            <div className="relative">
              <input
                type="password"
                maxLength={4}
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value.replace(/[^0-9]/g, ''));
                  setError(false);
                }}
                className={`w-full bg-white/5 border ${error ? 'border-red-500' : 'border-white/20'} rounded-xl px-4 py-4 text-center text-3xl font-black tracking-[1em] text-amber-400 placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-amber-400/50 transition-all`}
                placeholder="••••"
                autoFocus
                dir="ltr"
              />
              {error && (
                <div className="absolute -bottom-6 left-0 right-0 text-red-400 text-xs font-bold">
                  رمز المرور غير صحيح
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={pin.length < 4}
              className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:hover:bg-amber-500 text-slate-900 font-black text-sm py-4 rounded-xl flex items-center justify-center gap-2 transition-all"
            >
              دخول
              <ArrowLeft className="w-4 h-4" />
            </button>
          </form>
          
          <div className="mt-8 flex items-center gap-2 text-xs text-slate-500 font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>نظام محمي برمز أمان</span>
          </div>
        </div>
      </div>
    </div>
  );
};
