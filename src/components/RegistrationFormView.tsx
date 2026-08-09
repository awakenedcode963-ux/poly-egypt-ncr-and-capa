import React, { useState, useEffect } from 'react';
import { 
  PlusCircle, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Factory, 
  Layers, 
  User, 
  Clock, 
  Wrench, 
  FileText,
  ShieldAlert
} from 'lucide-react';
import { MasterDataState, InspectionLog, ProductCategory } from '../types';

interface RegistrationFormViewProps {
  masterData: MasterDataState;
  onAddInspectionLog: (log: InspectionLog) => void;
  onNavigateToLogs: () => void;
}

export const RegistrationFormView: React.FC<RegistrationFormViewProps> = ({
  masterData,
  onAddInspectionLog,
  onNavigateToLogs
}) => {
  const [category, setCategory] = useState<ProductCategory>('pipe');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [productCode, setProductCode] = useState<string>('');
  const [productName, setProductName] = useState<string>('');
  const [material, setMaterial] = useState<string>('PPR');
  const [machineCode, setMachineCode] = useState<string>('');
  const [inspectorName, setInspectorName] = useState<string>('');
  const [shiftName, setShiftName] = useState<string>('وردية AB');
  const [sampleSize, setSampleSize] = useState<number>(100);
  const [defectiveQty, setDefectiveQty] = useState<number>(0);
  const [defectCode, setDefectCode] = useState<string>('');
  const [defectName, setDefectName] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  const [submittedSuccess, setSubmittedSuccess] = useState<boolean>(false);

  // Auto populate product name when code changes
  useEffect(() => {
    if (category === 'pipe') {
      const match = masterData.pipes.find(p => p.code === productCode);
      if (match) {
        setProductName(match.name);
      }
    } else {
      const match = masterData.fittings.find(f => f.code === productCode);
      if (match) {
        setProductName(match.name);
        setMaterial(match.material);
      }
    }
  }, [productCode, category, masterData]);

  // Auto populate defect name when defect code changes
  useEffect(() => {
    if (category === 'pipe') {
      const match = masterData.pipeDefects.find(d => d.code === defectCode);
      if (match) setDefectName(match.name);
    } else {
      const match = masterData.fittingDefects.find(d => d.code === defectCode);
      if (match) setDefectName(match.name);
    }
  }, [defectCode, category, masterData]);

  // Reset fields on category toggle
  const handleCategoryChange = (cat: ProductCategory) => {
    setCategory(cat);
    setProductCode('');
    setProductName('');
    setDefectCode('');
    setDefectName('');
    if (cat === 'pipe') {
      setMachineCode(masterData.extrusionMachines[0]?.code || '101');
    } else {
      setMachineCode(masterData.injectionMachines[0]?.code || '201');
    }
  };

  // Reject Rate %
  const rejectRate = sampleSize > 0 ? Number(((defectiveQty / sampleSize) * 100).toFixed(2)) : 0;

  // Auto status logic
  const status = defectiveQty === 0 
    ? 'مقبول (Pass)' 
    : rejectRate > 10 
    ? 'مرفوض (Fail)' 
    : 'مقبول بشروط (Conditional)';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productCode || !inspectorName || !defectCode) {
      alert('الرجاء تعبئة كافة الحقول المطلوبة (الكود، المفتش، نوع العيب)');
      return;
    }

    if (defectiveQty > sampleSize) {
      alert('عدد القطع المعيبة لا يمكن أن يتجاوز حجم العينة!');
      return;
    }

    const newLog: InspectionLog = {
      id: `LOG-${Date.now().toString().slice(-4)}`,
      date,
      category,
      productCode,
      productName: productName || productCode,
      material: category === 'fitting' ? material : undefined,
      machineCode,
      inspectorName,
      shiftName,
      sampleSize,
      defectiveQty,
      rejectRate,
      defectCode,
      defectName: defectName || 'غير محدد',
      status,
      notes
    };

    onAddInspectionLog(newLog);
    setSubmittedSuccess(true);
    setTimeout(() => setSubmittedSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Top Banner */}
      <div className="bg-slate-900 rounded-2xl p-6 text-white border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <PlusCircle className="w-6 h-6 text-amber-400" />
            <h2 className="text-xl font-bold">تسجيل فحص جودة يومي (QC Inspection Entry)</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            إدخال قراءات عينات الإنتاج اليومية مع التحقق التلقائي من الصحة وقواعد الجودة.
          </p>
        </div>

        {/* Category Switcher Buttons */}
        <div className="flex items-center p-1 bg-slate-800 rounded-xl border border-slate-700">
          <button
            type="button"
            onClick={() => handleCategoryChange('pipe')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              category === 'pipe' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Factory className="w-4 h-4" />
            <span>قطاع الأنابيب (Extrusion)</span>
          </button>

          <button
            type="button"
            onClick={() => handleCategoryChange('fitting')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              category === 'fitting' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>قطاع الوصلات (Injection)</span>
          </button>
        </div>
      </div>

      {submittedSuccess && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 p-4 rounded-xl flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span className="font-bold text-sm">تم تسجيل قراءة الفحص بنجاح وإضافتها لسجل التقارير!</span>
          </div>
          <button
            onClick={onNavigateToLogs}
            className="text-xs font-bold underline hover:text-emerald-950"
          >
            عرض سجل القراءات ←
          </button>
        </div>
      )}

      {/* Main Form Card */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        
        {/* Section 1: Basic Operational Data */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 border-b pb-2 flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-500" />
            <span>البيانات التشغيلية الأساسية</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">تاريخ الفحص:</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">المفتش القائم بالفحص:</label>
              <select
                required
                value={inspectorName}
                onChange={(e) => setInspectorName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              >
                <option value="">اختر اسم المفتش...</option>
                {masterData.inspectors.map((insp) => (
                  <option key={insp.id} value={insp.name}>{insp.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">الوردية (Shift):</label>
              <select
                required
                value={shiftName}
                onChange={(e) => setShiftName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              >
                {masterData.shifts.map((s) => (
                  <option key={s.code} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Product & Machine Selection */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 border-b pb-2 flex items-center gap-2">
            <Wrench className="w-4 h-4 text-amber-500" />
            <span>المنتج والخط / الماكينة</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                اختر كود أو اسم المنتج ({category === 'pipe' ? 'أنبوب' : 'وصلة'}):
              </label>
              <select
                required
                value={productCode}
                onChange={(e) => setProductCode(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              >
                <option value="">اختر المنتج من قائمة Master Data...</option>
                {category === 'pipe' ? (
                  masterData.pipes.map(p => (
                    <option key={p.code + p.name} value={p.code}>
                      [{p.code}] - {p.name}
                    </option>
                  ))
                ) : (
                  masterData.fittings.map(f => (
                    <option key={f.code + f.name} value={f.code}>
                      [{f.code}] - {f.name} ({f.material})
                    </option>
                  ))
                )}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">اسم المنتج التلقائي:</label>
              <input
                type="text"
                readOnly
                value={productName}
                placeholder="سيتم التعبئة تلقائياً عند اختيار الكود..."
                className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-700 font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">رقم/كود الماكينة:</label>
              <select
                required
                value={machineCode}
                onChange={(e) => setMachineCode(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              >
                <option value="">اختر رقم الماكينة...</option>
                {category === 'pipe' ? (
                  masterData.extrusionMachines.map(m => (
                    <option key={m.id} value={m.code}>خط سحب رقم {m.code}</option>
                  ))
                ) : (
                  masterData.injectionMachines.map(m => (
                    <option key={m.id} value={m.code}>ماكينة حقن رقم {m.code}</option>
                  ))
                )}
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Inspection Results & Defect Details */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 border-b pb-2 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-500" />
            <span>نتائج الفحص والعيوب المرصودة</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">حجم العينة (Sample Size):</label>
              <input
                type="number"
                min="1"
                required
                value={sampleSize}
                onChange={(e) => setSampleSize(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">عدد التالف / المعيب:</label>
              <input
                type="number"
                min="0"
                max={sampleSize}
                required
                value={defectiveQty}
                onChange={(e) => setDefectiveQty(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">نوع العيب الرئيسي:</label>
              <select
                required
                value={defectCode}
                onChange={(e) => setDefectCode(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              >
                <option value="">اختر كود العيب...</option>
                {category === 'pipe' ? (
                  masterData.pipeDefects.map(d => (
                    <option key={d.code} value={d.code}>[{d.code}] - {d.name}</option>
                  ))
                ) : (
                  masterData.fittingDefects.map(d => (
                    <option key={d.code} value={d.code}>[{d.code}] - {d.name}</option>
                  ))
                )}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">نسبة المرفوضات (Reject Rate):</label>
              <div className="px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm font-black font-mono text-amber-700 flex items-center justify-between">
                <span>{rejectRate}%</span>
                <span className={`text-xs px-2 py-0.5 rounded-md font-bold ${
                  defectiveQty === 0 ? 'bg-emerald-100 text-emerald-800' : rejectRate > 10 ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {status}
                </span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">ملاحظات والتوصيات الفنية:</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="اكتب أسباب العيب أو أي توجيهات لمهندس الشفت..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="pt-2 flex items-center justify-end gap-3 border-t">
          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-md transition-all cursor-pointer"
          >
            حفظ الفحص في سجل الجودة
          </button>
        </div>
      </form>
    </div>
  );
};
