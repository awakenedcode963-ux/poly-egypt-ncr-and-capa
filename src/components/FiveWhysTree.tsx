import React from 'react';
import { FiveWhysAnalysis } from '../types';
import { HelpCircle, CheckCircle2, ArrowDown, Sparkles, Lightbulb, AlertTriangle } from 'lucide-react';

interface FiveWhysTreeProps {
  fiveWhys?: FiveWhysAnalysis;
  onChange?: (updated: FiveWhysAnalysis) => void;
  isEditable?: boolean;
  onAiAutoSuggest?: () => void;
  isAiGenerating?: boolean;
}

export const FiveWhysTree: React.FC<FiveWhysTreeProps> = ({
  fiveWhys = {
    why1: '',
    why2: '',
    why3: '',
    why4: '',
    why5: ''
  },
  onChange,
  isEditable = false,
  onAiAutoSuggest,
  isAiGenerating = false
}) => {
  const steps = [
    {
      num: 1,
      title: 'لماذا 1: المظهر المباشر للرفض (Direct Symptom)',
      desc: 'لماذا حدث العيب أو عدم المطابقة مباشرة عند الفحص أو الاختبار؟',
      key: 'why1' as keyof FiveWhysAnalysis,
      value: fiveWhys.why1,
      bgColor: 'bg-red-50 border-red-200',
      badgeColor: 'bg-red-600 text-white'
    },
    {
      num: 2,
      title: 'لماذا 2: السبب التكتيكي الأول (First Direct Cause)',
      desc: 'لماذا وقع المسبب المباشر الأول بالظروف الحالية؟',
      key: 'why2' as keyof FiveWhysAnalysis,
      value: fiveWhys.why2,
      bgColor: 'bg-orange-50 border-orange-200',
      badgeColor: 'bg-orange-600 text-white'
    },
    {
      num: 3,
      title: 'لماذا 3: الخلل التشغيلي أو الفني (Operational / Technical Cause)',
      desc: 'ما الخلل المعداتي، الخامي، أو الميكانيكي الذي أدى لهذا المسبب؟',
      key: 'why3' as keyof FiveWhysAnalysis,
      value: fiveWhys.why3,
      bgColor: 'bg-amber-50 border-amber-200',
      badgeColor: 'bg-amber-600 text-white'
    },
    {
      num: 4,
      title: 'لماذا 4: ثغرة نظام الرقابة أو الصيانة (Control / System Gap)',
      desc: 'لماذا لم تكتشف أنظمة الرقابة، الفحص الدائم، أو الصيانة هذا الخلل قبل الإنتاج؟',
      key: 'why4' as keyof FiveWhysAnalysis,
      value: fiveWhys.why4,
      bgColor: 'bg-sky-50 border-sky-200',
      badgeColor: 'bg-[#2874A6] text-white'
    },
    {
      num: 5,
      title: 'لماذا 5: السبب الجذر النهائي المنهجي (Root Cause)',
      desc: 'السبب النظامي أو الإداري الأساسي واحتياج التحديث في الـ SOP أوالعمليات',
      key: 'why5' as keyof FiveWhysAnalysis,
      value: fiveWhys.why5,
      bgColor: 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-500/20',
      badgeColor: 'bg-emerald-700 text-white'
    }
  ];

  const handleTextChange = (key: keyof FiveWhysAnalysis, text: string) => {
    if (onChange) {
      onChange({
        ...fiveWhys,
        [key]: text
      });
    }
  };

  return (
    <div className="space-y-4 font-sans dir-rtl">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900 text-white p-4 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#E67E22] text-slate-950 rounded-lg">
            <HelpCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm text-white flex items-center gap-2">
              <span>تحليل الأسباب الجذرية بتقنية 5 Whys المعتمدة (ISO 9001)</span>
            </h4>
            <p className="text-[11px] text-slate-300 mt-0.5">
              تتبع التسلسل المنطقي لـ 5 مستويات وصولاً للسبب الجذر النهائي المنهجي
            </p>
          </div>
        </div>

        {isEditable && onAiAutoSuggest && (
          <button
            type="button"
            onClick={onAiAutoSuggest}
            disabled={isAiGenerating}
            className="flex items-center gap-2 px-3.5 py-2 bg-[#C4A052] hover:bg-amber-600 text-slate-950 text-xs font-black rounded-lg transition-all shadow-md cursor-pointer disabled:opacity-50 shrink-0"
          >
            <Sparkles className={`w-4 h-4 ${isAiGenerating ? 'animate-spin' : ''}`} />
            <span>{isAiGenerating ? 'جاري التحليل بالذكاء الاصطناعي...' : 'اقتراح 5 Whys بالذكاء الاصطناعي'}</span>
          </button>
        )}
      </div>

      {/* 5 Whys Vertical Flow */}
      <div className="space-y-3 relative">
        {steps.map((step, idx) => (
          <div key={step.num} className="relative">
            <div className={`p-4 rounded-xl border ${step.bgColor} transition-all space-y-2`}>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-black ${step.badgeColor}`}>
                    المستوى {step.num}
                  </span>
                  <span className="font-extrabold text-xs text-slate-900">{step.title}</span>
                </div>
                {step.num === 5 && (
                  <span className="text-[11px] bg-emerald-200 text-emerald-900 px-2.5 py-0.5 rounded-md font-black flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>السبب الجذر (Root Cause)</span>
                  </span>
                )}
              </div>

              <p className="text-[11px] text-slate-500 font-medium">{step.desc}</p>

              {isEditable ? (
                <textarea
                  value={step.value || ''}
                  onChange={(e) => handleTextChange(step.key, e.target.value)}
                  placeholder={`اكتب الإجابة على السؤال ${step.num}...`}
                  rows={2}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-800 focus:ring-2 focus:ring-[#1B4F72] focus:outline-none"
                />
              ) : (
                <div className="bg-white/80 p-3 rounded-lg border border-slate-200/60 text-xs font-bold text-slate-800 leading-relaxed">
                  {step.value ? (
                    step.value
                  ) : (
                    <span className="text-slate-400 italic">لم يتم إدخال تفاصيل المستوى {step.num}</span>
                  )}
                </div>
              )}
            </div>

            {/* Downward Arrow Connector */}
            {idx < steps.length - 1 && (
              <div className="flex justify-center my-1">
                <ArrowDown className="w-4 h-4 text-slate-400 animate-bounce" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
