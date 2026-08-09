import React, { useState } from 'react';
import { CAPARequest } from '../types';
import { PoloEgyptLogo } from './PoloEgyptLogo';
import { 
  QrCode, 
  Smartphone, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  Send, 
  Tag, 
  Factory, 
  ShieldCheck, 
  Sparkles,
  Camera
} from 'lucide-react';

interface WorkerFloorScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCapa: (newCapa: CAPARequest) => void;
}

export const WorkerFloorScanModal: React.FC<WorkerFloorScanModalProps> = ({
  isOpen,
  onClose,
  onAddCapa
}) => {
  const [step, setStep] = useState<'scan' | 'form' | 'success'>('scan');
  const [scannedLine, setScannedLine] = useState<string>('EXT-PPR-01 (خط بثق أنابيب PPR)');

  // Form state
  const [operatorName, setOperatorName] = useState('');
  const [shift, setShift] = useState('الوردية الأولى (صباحية)');
  const [productName, setProductName] = useState('أنبوبة PPR قطر 25mm');
  const [lotNumber, setLotNumber] = useState(`LOT-PPR-${new Date().getMonth() + 1}-0${Math.floor(Math.random() * 89 + 10)}`);
  const [defectType, setDefectType] = useState('فقاعات هوائية ومسامية داخلية');
  const [severity, setSeverity] = useState('عالي (High)');
  const [immediateAction, setImmediateAction] = useState('إيقاف الخط فوراً وضع ملصق Quality Hold وحجز اللوط');
  const [notes, setNotes] = useState('');
  const [submittedCapaNo, setSubmittedCapaNo] = useState('');

  if (!isOpen) return null;

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const sampleMachines = [
    { code: 'EXT-PPR-01', name: 'خط بثق أنابيب PPR رقم 1', dept: 'قسم البثق PPR' },
    { code: 'EXT-UPVC-02', name: 'خط بثق أنابيب UPVC 110mm', dept: 'قسم البثق UPVC' },
    { code: 'INJ-FITT-03', name: 'ماكينة حقن الوصلات INJ-03', dept: 'قسم الحقن' },
    { code: 'MIX-PVC-01', name: 'خلاط الخلطات الجافة UPVC 500L', dept: 'قسم الخلطات' },
    { code: 'QC-LAB-01', name: 'معمل اختبارات الضغط المائي', dept: 'المختبر والجودة' }
  ];

  const handleSimulateScan = (machineCode: string, machineName: string) => {
    setScannedLine(`${machineCode} - ${machineName}`);
    setStep('form');
  };

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    const newId = `NCR-2026-${Math.floor(Math.random() * 899 + 100)}`;
    setSubmittedCapaNo(newId);

    const targetDept = scannedLine.includes('PPR') ? 'قسم البثق PPR' 
                     : scannedLine.includes('UPVC') ? 'قسم البثق UPVC'
                     : scannedLine.includes('حقن') ? 'قسم الحقن'
                     : scannedLine.includes('خلط') ? 'قسم الخلطات'
                     : 'إدارة الجودة والإنتاج';

    const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
    const currentMonthName = months[new Date().getMonth()];

    const machineCodeVal = scannedLine.split(' - ')[0] || scannedLine;

    const newCapa: CAPARequest = {
      id: `capa-${Date.now()}`,
      capaNo: newId,
      date: new Date().toISOString().split('T')[0],
      month: currentMonthName,
      source: 'فحص جودة (QC)',
      targetDepartment: targetDept,
      subject: `بلاغ عيب ميداني: ${defectType} - ${scannedLine}`,
      ncrDescription: `تم تسجيل البلاغ بواسطة الفني/المشرف: ${operatorName || 'فني الوردية'} (${shift}). ملاحظات: ${notes || 'لا توجد ملاحظات إضافية'}.`,
      immediateAction: immediateAction,
      priority: severity.includes('حرج') ? 'حرج (Critical)' : severity.includes('عالي') ? 'عالي (High)' : 'متوسط (Medium)',
      status: 'مفتوح (Open)',
      requesterName: operatorName || 'فني الوردية',
      responsiblePerson: 'مهندس الجودة المناظر',
      targetDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      delayDays: 0,
      productName: productName,
      machineCode: machineCodeVal,
      lotNumber: lotNumber,
      fiveWhys: {
        why1: `حدوث عيب (${defectType}) بمنتج ${productName} باللوط ${lotNumber}.`,
        why2: 'جاري فحص معايير التشغيل بالخط مع فني الوردية.',
        why3: 'قيد التحليل الفني والبحث الميداني.',
        why4: 'قيد التحقيق الميداني بواسطة مهندس الجودة.',
        why5: 'سيتحدد الإجراء الوقائي النهائي بعد إغلاق التحقيق.'
      },
      rootCause: 'جاري استكمال تحليل 5 Whys من قبل إدارة الجودة',
      preventiveAction: 'جاري التقييم والاعتماد',
      effectivenessEval: 'قيد التقييم (Pending)'
    };

    try {
      const scriptUrl = import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL;
      
      if (!scriptUrl) {
        throw new Error('لم يتم إعداد رابط Web App (VITE_GOOGLE_APPS_SCRIPT_URL) في متغيرات البيئة.');
      }

      // Send the data to the Google Apps Script Web App
      const response = await fetch(scriptUrl, {
        method: 'POST',
        body: JSON.stringify(newCapa),
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
      });

      if (!response.ok) {
        throw new Error('فشل الاتصال بالخادم.');
      }

      const result = await response.json();
      if (result.status === 'success') {
        onAddCapa(newCapa);
        setStep('success');
      } else {
        throw new Error(result.message || 'حدث خطأ غير معروف أثناء الحفظ.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'فشل الاتصال بالإنترنت، لم يتم إرسال أو حفظ البلاغ. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setStep('scan');
    setOperatorName('');
    setNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 dir-rtl font-sans animate-fade-in">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header Banner */}
        <div className="bg-[#0B3A60] text-white p-4 sm:p-5 flex items-center justify-between border-b border-sky-900 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#C0A46F] text-slate-950 rounded-xl font-black">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-white flex items-center gap-2">
                <span>مسح الـ QR والتسجيل السريع بأقسام الإنتاج</span>
              </h3>
              <p className="text-[11px] text-slate-200 font-medium">
                واجهة الفنيين والعمال لبلاغات عدم المطابقة المباشرة بالمصنع
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 custom-scrollbar">

          {/* STEP 1: SCAN OR SELECT MACHINE */}
          {step === 'scan' && (
            <div className="space-y-5 text-center py-2">
              <div className="p-5 bg-sky-50 border-2 border-dashed border-[#0B3A60]/30 rounded-2xl flex flex-col items-center justify-center space-y-3">
                <div className="w-16 h-16 bg-[#0B3A60] text-[#C0A46F] rounded-2xl flex items-center justify-center shadow-lg animate-bounce">
                  <Smartphone className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-black text-sm text-[#0B3A60]">قم بتوجيه كاميرا الموبايل نحو ملصق QR بالماكينة</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-md">
                    كل خط إنتاج أو خلاط بـ <b>بولو إيجيبت</b> يحمل باركود QR مثبت على لوحة التحكم للتسجيل الفوري.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <span className="text-xs font-black text-slate-700 block text-right border-r-4 border-[#C0A46F] pr-2">
                  أو اختر الماكينة / الخط محاكاةً للمسح الميداني:
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-right">
                  {sampleMachines.map((m) => (
                    <button
                      key={m.code}
                      onClick={() => handleSimulateScan(m.code, m.name)}
                      className="p-3 bg-slate-50 hover:bg-sky-100/70 border border-slate-200 hover:border-[#0B3A60] rounded-xl text-xs flex flex-col text-right transition-all cursor-pointer group"
                    >
                      <span className="font-black text-[#0B3A60] group-hover:text-sky-900">{m.code}</span>
                      <span className="font-bold text-slate-700 mt-0.5">{m.name}</span>
                      <span className="text-[10px] text-slate-400 mt-0.5">{m.dept}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: FILL QUICK FLOOR REPORT */}
          {step === 'form' && (
            <form onSubmit={handleSubmitReport} className="space-y-4 text-xs text-slate-800">
              {/* Scanned Badge */}
              <div className="bg-sky-50 p-3 rounded-xl border border-sky-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 block">الخط / الماكينة الممسوحة:</span>
                  <span className="font-black text-[#0B3A60]">{scannedLine}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setStep('scan')}
                  className="text-[11px] font-bold text-sky-700 hover:underline cursor-pointer"
                >
                  تغيير
                </button>
              </div>

              {/* Operator & Shift */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-extrabold mb-1">اسم الفني / المفتش:</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: أحمد محمود"
                    value={operatorName}
                    onChange={(e) => setOperatorName(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold focus:ring-2 focus:ring-[#0B3A60]"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-extrabold mb-1">الوردية:</label>
                  <select
                    value={shift}
                    onChange={(e) => setShift(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold focus:ring-2 focus:ring-[#0B3A60]"
                  >
                    <option value="الوردية الأولى (صباحية)">الوردية الأولى (صباحية)</option>
                    <option value="الوردية الثانية (مسائية)">الوردية الثانية (مسائية)</option>
                    <option value="الوردية الثالثة (ليلية)">الوردية الثالثة (ليلية)</option>
                  </select>
                </div>
              </div>

              {/* Product & Lot */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-extrabold mb-1">اسم المنتج / الصنف:</label>
                  <input
                    type="text"
                    required
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-extrabold mb-1">رقم اللوط / التشغيلة:</label>
                  <input
                    type="text"
                    required
                    value={lotNumber}
                    onChange={(e) => setLotNumber(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-[#0B3A60]"
                  />
                </div>
              </div>

              {/* Defect Selection */}
              <div>
                <label className="block text-slate-700 font-extrabold mb-1">نوع العيب / الانحراف المشهود:</label>
                <select
                  value={defectType}
                  onChange={(e) => setDefectType(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-black text-red-700"
                >
                  <option value="فقاعات هوائية ومسامية داخلية">فقاعات هوائية ومسامية داخلية (Air Bubbles)</option>
                  <option value="انحراف بالسمك والقطر خارجي">انحراف بالسمك والقطر الخارجي (Dimensional Defect)</option>
                  <option value="كسر أو تسريب عند اختبار الضغط المائي">كسر أو تسريب عند اختبار الضغط المائي (Pressure Failure)</option>
                  <option value="عدم تجانس الخلطة أو تغير اللون">عدم تجانس الخلطة أو تغير اللون (Color/Mixing Issue)</option>
                  <option value="خدوش وعيوب ظاهرية بالطول">خدوش وعيوب ظاهرية بالطول (Surface Scratches)</option>
                  <option value="ارتفاع درجة حرارة الماكينة وتوقف صيانة">ارتفاع درجة حرارة الماكينة وتوقف صيانة (Overheating)</option>
                </select>
              </div>

              {/* Priority & Immediate Action */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-extrabold mb-1">الأولوية:</label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                  >
                    <option value="حرج (Critical)">حرج (Critical) - إيقاف كلي</option>
                    <option value="عالي (High)">عالي (High) - تحذير وتعديل</option>
                    <option value="متوسط (Medium)">متوسط (Medium) - حجز مؤقت</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-extrabold mb-1">الإجراء الفوري المتخذ بالصالة:</label>
                  <input
                    type="text"
                    value={immediateAction}
                    onChange={(e) => setImmediateAction(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-slate-700 font-extrabold mb-1">ملاحظات إضافية للفني:</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="أدخل أي ملاحظات فنية حول حالة الماكينة أو عينات الاختبار..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                />
              </div>

              {/* Error Message */}
              {errorMsg && (
                <div className="bg-red-50 border border-red-200 p-3 rounded-xl flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div className="text-red-800 text-xs font-bold leading-relaxed">
                    {errorMsg}
                  </div>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setStep('scan')}
                  disabled={isLoading}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer disabled:opacity-50"
                >
                  إلغاء
                </button>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center gap-2 px-6 py-2.5 bg-[#E74C3C] hover:bg-red-700 text-white font-black rounded-xl shadow-md cursor-pointer transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>جاري الإرسال الحفظ...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>{errorMsg ? 'إعادة المحاولة' : 'إرسال البلاغ فوراً لإدارة الجودة'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: SUCCESS CONFIRMATION */}
          {step === 'success' && (
            <div className="text-center py-6 space-y-4 dir-rtl">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto border-4 border-emerald-200 shadow-md">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-1">
                <h4 className="font-black text-lg text-[#0B3A60]">تم تسجيل البلاغ وإرساله لقاعدة البيانات بنجاح!</h4>
                <p className="text-xs text-slate-600 font-bold">
                  رقم طلب عدم المطابقة المولد: <span className="text-red-600 font-black text-sm">{submittedCapaNo}</span>
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-right space-y-1">
                <div className="font-extrabold text-[#0B3A60]">تفاصيل البلاغ الميداني:</div>
                <div><b>الماكينة:</b> {scannedLine}</div>
                <div><b>المستلم:</b> مهندس الجودة المناظر (إشعار فوري)</div>
                <div><b>الحالة الحالية:</b> <span className="text-amber-700 font-bold">مفتوح (Open) - بلاغ ميداني جديد</span></div>
              </div>

              <button
                onClick={handleReset}
                className="w-full py-3 bg-[#0B3A60] hover:bg-sky-900 text-white font-black rounded-xl shadow-md cursor-pointer transition-all"
              >
                إنهاء وإغلاق النافذة
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
