import React, { useState, useEffect, useRef } from 'react';
import { CAPARequest } from '../types';
import { PoloEgyptLogo } from './PoloEgyptLogo';
import {
  CheckCircle2,
  AlertTriangle,
  Send,
  Factory,
  Camera,
  QrCode,
  Image as ImageIcon
} from 'lucide-react';

export const WorkerReportPage: React.FC = () => {
  const [step, setStep] = useState<'scan' | 'form' | 'review' | 'success'>('scan');
  const [scannedLine, setScannedLine] = useState<string>('');
  const [machineFromUrl, setMachineFromUrl] = useState<string>('');

  const getInitialShift = () => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 14) return 'الوردية الأولى (صباحية)';
    if (hour >= 14 && hour < 22) return 'الوردية الثانية (مسائية)';
    return 'الوردية الثالثة (ليلية)';
  };

  // Form state
  const [operatorName, setOperatorName] = useState('');
  const [shift, setShift] = useState(getInitialShift());
  const [productName, setProductName] = useState('');
  const [lotNumber, setLotNumber] = useState('');
  const [defectType, setDefectType] = useState('');
  const [severity, setSeverity] = useState('');
  const [immediateAction, setImmediateAction] = useState('');
  const [correctiveAction, setCorrectiveAction] = useState('');
  const [preventiveAction, setPreventiveAction] = useState('');
  const [notes, setNotes] = useState('');
  const [attachmentBase64, setAttachmentBase64] = useState('');

  const [submittedCapaNo, setSubmittedCapaNo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const sampleMachines = [
    { code: 'EXT-PPR-01', name: 'خط بثق أنابيب PPR رقم 1', dept: 'قسم البثق PPR' },
    { code: 'EXT-UPVC-02', name: 'خط بثق أنابيب UPVC 110mm', dept: 'قسم البثق UPVC' },
    { code: 'INJ-FITT-03', name: 'ماكينة حقن الوصلات INJ-03', dept: 'قسم الحقن' },
    { code: 'MIX-PVC-01', name: 'خلاط الخلطات الجافة UPVC 500L', dept: 'قسم الخلطات' },
    { code: 'QC-LAB-01', name: 'معمل اختبارات الضغط المائي', dept: 'المختبر والجودة' }
  ];

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const machineCode = searchParams.get('machine');
    if (machineCode) {
      const foundMachine = sampleMachines.find(m => m.code === machineCode);
      const machineName = foundMachine ? foundMachine.name : 'ماكينة غير محددة';
      setScannedLine(`${machineCode} - ${machineName}`);
      setMachineFromUrl(machineCode);
      setStep('form');
    }
  }, []);

  const handleSimulateScan = (machineCode: string, machineName: string) => {
    setScannedLine(`${machineCode} - ${machineName}`);
    setStep('form');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachmentBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const proceedToReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!operatorName || !productName || !lotNumber || !defectType || !severity || !immediateAction) {
      setErrorMsg('يرجى تعبئة جميع الحقول الإلزامية قبل المتابعة.');
      return;
    }
    setErrorMsg('');
    setStep('review');
  };

  const handleSubmitReport = async () => {
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
      subject: `بلاغ عيب ميداني: ${defectType.split('(')[0].trim()} - ${scannedLine}`,
      ncrDescription: `تم تسجيل البلاغ بواسطة: ${operatorName} (${shift}). ملاحظات: ${notes || 'لا توجد ملاحظات إضافية'}.`,
      immediateAction: immediateAction,
      correctiveAction: correctiveAction,
      preventiveAction: preventiveAction,
      priority: severity.includes('حرج') ? 'حرج (Critical)' : severity.includes('عالي') ? 'عالي (High)' : 'متوسط (Medium)',
      status: 'مفتوح (Open)',
      requesterName: operatorName,
      responsiblePerson: 'مهندس الجودة المناظر',
      targetDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      delayDays: 0,
      productName: productName,
      machineCode: machineCodeVal,
      lotNumber: lotNumber,
      attachmentBase64: attachmentBase64, attachmentUrl: attachmentBase64 ? 'صورة مرفقة' : '', // Fallback indicator if apps script doesn't handle base64
      fiveWhys: {
        why1: `حدوث عيب (${defectType.split('(')[0].trim()}) بمنتج ${productName} باللوط ${lotNumber}.`,
        why2: 'جاري فحص معايير التشغيل بالخط مع فني الوردية.',
        why3: 'قيد التحليل الفني والبحث الميداني.',
        why4: 'قيد التحقيق الميداني بواسطة مهندس الجودة.',
        why5: 'سيتحدد الإجراء الوقائي النهائي بعد إغلاق التحقيق.'
      },
      rootCause: 'جاري استكمال تحليل 5 Whys من قبل إدارة الجودة',
      effectivenessEval: 'قيد التقييم (Pending)'
    };

    try {
      const scriptUrl = import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL;
      
      if (!scriptUrl) {
        throw new Error('لم يتم إعداد رابط Web App (VITE_GOOGLE_APPS_SCRIPT_URL) في متغيرات البيئة.');
      }

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
      
      if (result.status !== 'success') {
        throw new Error(result.message || 'حدث خطأ أثناء حفظ البيانات.');
      }

      setStep('success');
      
    } catch (err: any) {
      console.error('Error submitting form:', err);
      setErrorMsg(err.message || 'حدث خطأ غير متوقع أثناء الاتصال بالخادم.');
      setStep('form'); // go back to form on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setStep(machineFromUrl ? 'form' : 'scan');
    if (!machineFromUrl) {
      setScannedLine('');
    }
    setOperatorName('');
    setProductName('');
    setLotNumber('');
    setDefectType('');
    setSeverity('');
    setImmediateAction('');
    setCorrectiveAction('');
    setPreventiveAction('');
    setNotes('');
    setAttachmentBase64('');
    setSubmittedCapaNo('');
    setErrorMsg('');
    setShift(getInitialShift());
  };

  const targetDeptLabel = scannedLine.includes('PPR') ? 'قسم البثق PPR'
                     : scannedLine.includes('UPVC') ? 'قسم البثق UPVC'
                     : scannedLine.includes('حقن') ? 'قسم الحقن'
                     : scannedLine.includes('خلط') ? 'قسم الخلطات'
                     : 'إدارة الجودة والإنتاج';

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-10" dir="rtl">
      {/* Global Header */}
      <div className="bg-white shadow-sm border-b border-slate-200 w-full py-6 px-4 sticky top-0 z-10 flex flex-col items-center justify-center">
        <PoloEgyptLogo size="lg" className="mb-4" />
        <h1 className="text-xl font-black text-[#0B3A60] text-center mt-2">بوابة تسجيل بلاغات الجودة الميدانية</h1>
        <p className="text-xs font-bold text-slate-500 mt-1">تطبيق الجوال للفنيين والمشرفين بالصالة</p>
      </div>

      <div className="max-w-2xl mx-auto p-4 mt-4">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
          
          {/* STEP 1: SCAN OR SELECT MACHINE */}
          {step === 'scan' && (
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-100 shadow-sm shadow-blue-100">
                  <QrCode className="w-10 h-10" />
                </div>
                <h3 className="font-black text-xl text-[#0B3A60] mb-2">تحديد موقع البلاغ (الماكينة)</h3>
                <p className="text-sm font-bold text-slate-600">
                  للبدء، يرجى تحديد خط الإنتاج أو الماكينة التي سيتم تسجيل البلاغ عليها.
                </p>
              </div>

              <div className="space-y-4">
                <button className="w-full bg-[#0B3A60] hover:bg-sky-900 text-white font-black p-4 rounded-xl flex items-center justify-center gap-3 shadow-md transition-all active:scale-95">
                  <Camera className="w-6 h-6" />
                  <span>مسح كود QR للماكينة (قريباً)</span>
                </button>
                
                <div className="relative py-4 flex items-center">
                  <div className="flex-grow border-t border-slate-200"></div>
                  <span className="shrink-0 px-4 text-slate-400 text-sm font-bold">أو اختر من القائمة يدوياً</span>
                  <div className="flex-grow border-t border-slate-200"></div>
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
                  {sampleMachines.map(machine => (
                    <button
                      key={machine.code}
                      onClick={() => handleSimulateScan(machine.code, machine.name)}
                      className="w-full flex items-center gap-3 p-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-right transition-colors active:bg-slate-200"
                    >
                      <Factory className="w-6 h-6 text-slate-400" />
                      <div>
                        <div className="font-black text-[#0B3A60]">{machine.name}</div>
                        <div className="text-xs font-bold text-slate-500 mt-1">{machine.code} • {machine.dept}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: FILL THE FORM */}
          {step === 'form' && (
            <form onSubmit={proceedToReview} className="p-4 sm:p-6 space-y-6">
              
              <div className="bg-sky-50 border border-sky-100 rounded-xl p-4 flex items-start gap-3">
                <Factory className="w-6 h-6 text-sky-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-sky-600 mb-1">الموقع المحدد (تلقائياً)</div>
                  <div className="font-black text-sky-900 leading-tight">{scannedLine}</div>
                </div>
              </div>

              {/* Operator Name & Shift */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-extrabold mb-2 text-sm">اسم مقدم البلاغ:</label>
                  <input
                    type="text"
                    required
                    value={operatorName}
                    onChange={(e) => setOperatorName(e.target.value)}
                    placeholder="اسم الفني أو المشرف"
                    className="w-full p-3.5 bg-slate-50 border border-slate-300 rounded-xl font-bold focus:ring-2 focus:ring-[#0B3A60] focus:border-[#0B3A60] outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-extrabold mb-2 text-sm">الوردية الحالية:</label>
                  <select
                    value={shift}
                    onChange={(e) => setShift(e.target.value)}
                    className="w-full p-3.5 bg-slate-50 border border-slate-300 rounded-xl font-bold focus:ring-2 focus:ring-[#0B3A60] focus:border-[#0B3A60] outline-none transition-all"
                  >
                    <option value="الوردية الأولى (صباحية)">الوردية الأولى (صباحية)</option>
                    <option value="الوردية الثانية (مسائية)">الوردية الثانية (مسائية)</option>
                    <option value="الوردية الثالثة (ليلية)">الوردية الثالثة (ليلية)</option>
                  </select>
                </div>
              </div>

              {/* Product & Lot */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-extrabold mb-2 text-sm">اسم المنتج / الصنف:</label>
                  <input
                    type="text"
                    required
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="مثال: وصلة PPR 32mm"
                    className="w-full p-3.5 bg-slate-50 border border-slate-300 rounded-xl font-bold focus:ring-2 focus:ring-[#0B3A60] focus:border-[#0B3A60] outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-extrabold mb-2 text-sm">رقم اللوط / التشغيلة:</label>
                  <input
                    type="text"
                    required
                    value={lotNumber}
                    onChange={(e) => setLotNumber(e.target.value)}
                    placeholder="مثال: LOT-123"
                    className="w-full p-3.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-[#0B3A60] focus:ring-2 focus:ring-[#0B3A60] focus:border-[#0B3A60] outline-none transition-all"
                  />
                </div>
              </div>

              {/* Defect Selection */}
              <div>
                <label className="block text-slate-700 font-extrabold mb-2 text-sm">نوع العيب / الانحراف المشهود:</label>
                <select
                  required
                  value={defectType}
                  onChange={(e) => setDefectType(e.target.value)}
                  className="w-full p-3.5 bg-slate-50 border border-slate-300 rounded-xl font-black text-red-700 focus:ring-2 focus:ring-[#0B3A60] focus:border-[#0B3A60] outline-none transition-all overflow-hidden text-ellipsis whitespace-normal"
                >
                  <option value="" disabled>-- اختر نوع العيب --</option>
                  <option value="فقاعات هوائية ومسامية داخلية">فقاعات هوائية ومسامية داخلية (Air Bubbles)</option>
                  <option value="انحراف بالسمك والقطر خارجي">انحراف بالسمك والقطر الخارجي (Dimensional Defect)</option>
                  <option value="كسر أو تسريب عند اختبار الضغط المائي">كسر أو تسريب عند اختبار الضغط المائي (Pressure Failure)</option>
                  <option value="عدم تجانس الخلطة أو تغير اللون">عدم تجانس الخلطة أو تغير اللون (Color/Mixing Issue)</option>
                  <option value="خدوش وعيوب ظاهرية بالطول">خدوش وعيوب ظاهرية بالطول (Surface Scratches)</option>
                  <option value="ارتفاع درجة حرارة الماكينة وتوقف صيانة">ارتفاع درجة حرارة الماكينة وتوقف صيانة (Overheating)</option>
                </select>
              </div>

              {/* Priority & Immediate Action */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-extrabold mb-2 text-sm">الأولوية والخطورة:</label>
                  <select
                    required
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value)}
                    className="w-full p-3.5 bg-slate-50 border border-slate-300 rounded-xl font-bold focus:ring-2 focus:ring-[#0B3A60] focus:border-[#0B3A60] outline-none transition-all"
                  >
                    <option value="" disabled>-- حدد الأولوية --</option>
                    <option value="حرج (Critical)">حرج (Critical) - إيقاف كلي للإنتاج</option>
                    <option value="عالي (High)">عالي (High) - تحذير وإلزام بالتعديل</option>
                    <option value="متوسط (Medium)">متوسط (Medium) - حجز المنتج كمعيب</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-extrabold mb-2 text-sm">الإجراء الفوري المتخذ:</label>
                  <textarea
                    required
                    value={immediateAction}
                    onChange={(e) => setImmediateAction(e.target.value)}
                    placeholder="مثال: إيقاف الماكينة وحجز اللوط"
                    rows={2}
                    className="w-full p-3.5 bg-slate-50 border border-slate-300 rounded-xl font-bold focus:ring-2 focus:ring-[#0B3A60] focus:border-[#0B3A60] outline-none transition-all break-words"
                  />
                </div>
              </div>

              {/* Corrective & Preventive Suggestions (Optional) */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-4">
                <div className="text-amber-800 text-xs font-bold flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>اقتراحات اختيارية: سيتم تأكيدها لاحقاً بعد تحليل السبب الجذري من قبل مهندس الجودة.</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-amber-900 font-extrabold mb-2 text-sm">الإجراء التصحيحي المقترح:</label>
                    <textarea
                      value={correctiveAction}
                      onChange={(e) => setCorrectiveAction(e.target.value)}
                      placeholder="كيف يمكن إصلاح العيب الحالي؟ (اختياري)"
                      rows={2}
                      className="w-full p-3 bg-white border border-amber-300 rounded-xl font-medium focus:ring-2 focus:ring-amber-500 outline-none transition-all break-words text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-amber-900 font-extrabold mb-2 text-sm">الإجراء الوقائي المقترح:</label>
                    <textarea
                      value={preventiveAction}
                      onChange={(e) => setPreventiveAction(e.target.value)}
                      placeholder="كيف نمنع تكرار هذا العيب؟ (اختياري)"
                      rows={2}
                      className="w-full p-3 bg-white border border-amber-300 rounded-xl font-medium focus:ring-2 focus:ring-amber-500 outline-none transition-all break-words text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Photo Attachment */}
              <div>
                <label className="block text-slate-700 font-extrabold mb-2 text-sm">إرفاق صورة للعيب (اختياري):</label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full p-4 bg-slate-50 border-2 border-dashed border-slate-300 hover:border-[#0B3A60] rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <input 
                    type="file" 
                    accept="image/*" 
                    capture="environment"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                  />
                  {attachmentBase64 ? (
                    <div className="text-emerald-600 font-bold flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5" />
                      <span>تم إرفاق الصورة بنجاح</span>
                    </div>
                  ) : (
                    <>
                      <ImageIcon className="w-8 h-8 text-slate-400" />
                      <span className="text-slate-600 font-bold text-sm text-center">التقط صورة بالكاميرا أو اختر ملف</span>
                    </>
                  )}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-slate-700 font-extrabold mb-2 text-sm">ملاحظات إضافية (اختياري):</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="أدخل أي ملاحظات فنية حول حالة الماكينة..."
                  className="w-full p-3.5 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-[#0B3A60] focus:border-[#0B3A60] outline-none transition-all resize-none break-words"
                />
              </div>

              {/* Error Message */}
              {errorMsg && (
                <div className="bg-red-50 border border-red-200 p-4 rounded-xl flex items-start gap-3">
                  <AlertTriangle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
                  <div className="text-red-800 text-sm font-bold leading-relaxed">
                    {errorMsg}
                  </div>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="submit"
                  className="w-full sm:w-auto flex-1 flex justify-center items-center gap-2 p-4 bg-[#0B3A60] hover:bg-sky-900 text-white font-black rounded-xl shadow-lg cursor-pointer transition-all active:scale-95"
                >
                  مراجعة البيانات قبل الإرسال
                </button>
                {!machineFromUrl && (
                  <button
                    type="button"
                    onClick={() => setStep('scan')}
                    className="w-full sm:w-auto px-6 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer active:bg-slate-300 transition-colors"
                  >
                    تغيير الماكينة
                  </button>
                )}
              </div>
            </form>
          )}

          {/* STEP 3: REVIEW BEFORE SUBMIT */}
          {step === 'review' && (
            <div className="p-6 space-y-6">
              <h2 className="font-black text-xl text-[#0B3A60] border-b border-slate-200 pb-3">مراجعة البلاغ الميداني</h2>
              
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 text-sm space-y-3">
                <div className="grid grid-cols-2 gap-2 border-b border-slate-200 pb-2">
                  <span className="text-slate-500 font-bold">الماكينة:</span>
                  <span className="font-black text-slate-800">{scannedLine}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 border-b border-slate-200 pb-2">
                  <span className="text-slate-500 font-bold">مقدم البلاغ:</span>
                  <span className="font-black text-slate-800">{operatorName} ({shift})</span>
                </div>
                <div className="grid grid-cols-2 gap-2 border-b border-slate-200 pb-2">
                  <span className="text-slate-500 font-bold">المنتج واللوط:</span>
                  <span className="font-black text-slate-800">{productName} - {lotNumber}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 border-b border-slate-200 pb-2">
                  <span className="text-slate-500 font-bold">نوع العيب:</span>
                  <span className="font-black text-red-700">{defectType}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 border-b border-slate-200 pb-2">
                  <span className="text-slate-500 font-bold">الأولوية:</span>
                  <span className="font-black text-slate-800">{severity}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 pb-2">
                  <span className="text-slate-500 font-bold">الإجراء الفوري:</span>
                  <span className="font-black text-slate-800">{immediateAction}</span>
                </div>
                {attachmentBase64 && (
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200">
                    <span className="text-slate-500 font-bold">المرفقات:</span>
                    <span className="font-black text-emerald-600">تم إرفاق صورة</span>
                  </div>
                )}
              </div>

              {errorMsg && (
                <div className="bg-red-50 border border-red-200 p-4 rounded-xl flex items-start gap-3">
                  <AlertTriangle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
                  <div className="text-red-800 text-sm font-bold leading-relaxed">
                    {errorMsg}
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={handleSubmitReport}
                  disabled={isLoading}
                  className="w-full sm:w-auto flex-1 flex justify-center items-center gap-2 p-4 bg-[#E74C3C] hover:bg-red-700 text-white font-black rounded-xl shadow-lg cursor-pointer transition-all disabled:opacity-70 disabled:cursor-not-allowed active:scale-95"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span className="text-lg">جاري الإرسال...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span className="text-lg">إرسال البلاغ الآن</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => setStep('form')}
                  disabled={isLoading}
                  className="w-full sm:w-auto px-6 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer disabled:opacity-50 active:bg-slate-300 transition-colors"
                >
                  تعديل البيانات
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: SUCCESS CONFIRMATION */}
          {step === 'success' && (
            <div className="p-8 text-center space-y-6">
              <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto border-4 border-emerald-200 shadow-md">
                <CheckCircle2 className="w-14 h-14" />
              </div>
              
              <div className="space-y-2">
                <h2 className="font-black text-2xl text-[#0B3A60]">تم تسجيل البلاغ بنجاح!</h2>
                <p className="text-slate-600 font-bold text-lg">
                  رقم طلب المطابقة: <span className="text-red-600 font-black px-2 py-1 bg-red-50 rounded-lg">{submittedCapaNo}</span>
                </p>
              </div>

              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-right space-y-3">
                <div className="font-extrabold text-[#0B3A60] text-lg border-b border-slate-200 pb-2">تفاصيل البلاغ المسجل:</div>
                <div className="text-sm sm:text-base"><b className="text-slate-700">الماكينة:</b> {scannedLine}</div>
                <div className="text-sm sm:text-base"><b className="text-slate-700">التوجيه:</b> تم التوجيه إلى: {targetDeptLabel}</div>
                <div className="text-sm sm:text-base"><b className="text-slate-700">الحالة:</b> <span className="text-amber-700 font-bold">مفتوح (Open) - جديد</span></div>
              </div>

              <button
                onClick={handleReset}
                className="w-full p-4 bg-[#0B3A60] hover:bg-sky-900 text-white font-black text-lg rounded-xl shadow-lg cursor-pointer transition-all active:scale-95"
              >
                تسجيل بلاغ جديد
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
