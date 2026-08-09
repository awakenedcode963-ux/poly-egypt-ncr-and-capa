import React, { useState } from 'react';
import { CAPARequest, FiveWhysAnalysis, MasterDataState } from '../types';
import { PoloEgyptLogo } from './PoloEgyptLogo';
import { FiveWhysTree } from './FiveWhysTree';
import { CapaQrModal } from './CapaQrModal';
import { 
  AlertTriangle, 
  Plus, 
  CheckCircle2, 
  Clock, 
  User, 
  Building, 
  AlertCircle, 
  QrCode, 
  Sparkles, 
  Search, 
  Filter, 
  Printer, 
  ChevronDown, 
  ChevronUp,
  HelpCircle,
  ShieldCheck,
  Check
} from 'lucide-react';

interface CapaViewProps {
  capaRequests: CAPARequest[];
  masterData: MasterDataState;
  onAddCapa: (newCapa: CAPARequest) => void;
}

export const CapaView: React.FC<CapaViewProps> = ({
  capaRequests,
  masterData,
  onAddCapa
}) => {
  const [showForm, setShowForm] = useState(false);
  const [selectedCapaForQr, setSelectedCapaForQr] = useState<CAPARequest | null>(null);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [expandedWhysId, setExpandedWhysId] = useState<string | null>(null);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [sourceFilter, setSourceFilter] = useState<string>('ALL');

  // AI 5-Whys generation state
  const [show5WhysForm, setShow5WhysForm] = useState(false);

  // Form State
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    month: 'أغسطس',
    requesterName: masterData.inspectors[0]?.name || 'م. سامح حسن (توكيد الجودة)',
    targetDepartment: masterData.departments[0] || 'قسم البثق والأنابيب',
    source: 'فحص جودة (QC)' as CAPARequest['source'],
    priority: 'عالي (High)' as CAPARequest['priority'],
    subject: '',
    ncrDescription: '',
    productName: 'أنبوب PPR 32mm PN20',
    machineCode: '101',
    lotNumber: `LOT-${Date.now().toString().slice(-5)}`,
    rootCause: '',
    fiveWhys: {
      why1: '',
      why2: '',
      why3: '',
      why4: '',
      why5: ''
    } as FiveWhysAnalysis,
    immediateAction: '',
    preventiveAction: '',
    responsiblePerson: masterData.supervisors[0] || 'م. محمود سامي',
    targetDate: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString().split('T')[0],
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setIsSubmitting(true);

    const newEntry: CAPARequest = {
      id: `CAPA-${Date.now().toString().slice(-4)}`,
      capaNo: `CAPA-2026-${(capaRequests.length + 1).toString().padStart(3, '0')}`,
      date: form.date,
      month: form.month,
      requesterName: form.requesterName,
      targetDepartment: form.targetDepartment,
      source: form.source,
      priority: form.priority,
      subject: form.subject,
      ncrDescription: form.ncrDescription,
      productName: form.productName,
      machineCode: form.machineCode,
      lotNumber: form.lotNumber,
      rootCause: (show5WhysForm ? form.fiveWhys.why5 : '') || form.rootCause || 'قيد التحليل النهائي',
      fiveWhys: show5WhysForm ? form.fiveWhys : { why1: '', why2: '', why3: '', why4: '', why5: '' },
      status: 'مفتوح (Open)',
      immediateAction: form.immediateAction,
      preventiveAction: form.preventiveAction,
      responsiblePerson: form.responsiblePerson,
      targetDate: form.targetDate,
      delayDays: 0,
      effectivenessEval: 'قيد التقييم (Pending)',
      notes: form.notes
    };

    try {
      const scriptUrl = import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL;
      
      if (!scriptUrl) {
        throw new Error('لم يتم إعداد رابط Web App (VITE_GOOGLE_APPS_SCRIPT_URL) في متغيرات البيئة.');
      }

      const response = await fetch(scriptUrl, {
        method: 'POST',
        body: JSON.stringify(newEntry),
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
      });

      if (!response.ok) {
        throw new Error('فشل الاتصال بالخادم.');
      }

      const result = await response.json();
      if (result.status === 'success') {
        onAddCapa(newEntry);
        setShowForm(false);
      } else {
        throw new Error(result.message || 'حدث خطأ غير معروف أثناء الحفظ.');
      }
    } catch (err: any) {
      setSubmitError(err.message || 'فشل الاتصال بالإنترنت، لم يتم إرسال أو حفظ البلاغ. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtered List
  const filteredRequests = capaRequests.filter((c) => {
    const matchesSearch = 
      c.capaNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.ncrDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.productName && c.productName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      c.responsiblePerson.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || c.status.includes(statusFilter);
    const matchesPriority = priorityFilter === 'ALL' || c.priority.includes(priorityFilter);
    const matchesSource = sourceFilter === 'ALL' || c.source.includes(sourceFilter);

    return matchesSearch && matchesStatus && matchesPriority && matchesSource;
  });

  return (
    <div className="space-y-6 dir-rtl font-sans pb-8 bg-transparent">
      {/* Release Phase 1 Header Banner with Polo Egypt Branding */}
      <div className="bg-white/5 backdrop-blur-3xl border-b border-white/20 text-white pt-8 pb-12 px-6 sm:px-10 lg:px-12 rounded-b-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] relative overflow-hidden flex flex-col items-center text-center space-y-6 -mt-6 z-20">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#C1A67B]/20 via-transparent to-transparent pointer-events-none"></div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white drop-shadow-md relative z-10">
          نظام تسجيل حالات عدم المطابقة (NCR)، الـ CAPA، وتحليل الـ 5 Whys
        </h2>
        <p className="text-slate-300 max-w-3xl leading-relaxed text-sm sm:text-base relative z-10">
          المنظومة الرقمية المعتمدة لشركة <b>بولو إيجيبت للتجارة والصناعة ش.م.م</b> لتتبع عدم المطابقة، إدارة الإجراءات التصحيحية والوقائية، وتحليل المسببات الجذرية بطريقة 5 Whys طبقاً لمواصفة ISO 9001.
        </p>
        <button onClick={() => setShowForm(!showForm)} className="relative z-10 mt-4 px-8 py-4 bg-gradient-to-r from-[#C1A67B] to-yellow-600 text-white font-bold rounded-xl hover:scale-[1.02] transition-transform shadow-[0_4px_20px_rgba(193,166,123,0.4),inset_0_1px_1px_rgba(255,255,255,0.5)] text-base sm:text-lg flex items-center gap-3 cursor-pointer">
          <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
          <span>{showForm ? "إلغاء النموذج" : "إصدار طلب CAPA / NCR جديد"}</span>
        </button>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Creation Form Modal / Card */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl border-2 border-[#E74C3C] shadow-2xl space-y-6">
          <div className="border-b border-white/10 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-[#E74C3C]" />
              <h3 className="font-extrabold text-[#0B3A60] text-sm">
                نموذج إصدار عدم مطابقة وفعل تصحيحي وقائي - ISO QAF-04-03
              </h3>
            </div>
            <span className="text-xs bg-red-500/20 text-red-300 font-extrabold px-3 py-1 rounded-full">
              بولو إيجيبت QA/QC
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-semibold">
            <div>
              <label className="block text-slate-300 mb-1">تاريخ الإصدار</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full p-2.5 bg-white/5 border border-white/10 text-white placeholder-white/50 focus:ring-2 focus:ring-[#C1A67B] focus:bg-white/10 transition-all rounded-xl"
                required
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1">مُصدر البلاغ (مهندس/مفتش الجودة)</label>
              <input
                type="text"
                value={form.requesterName}
                onChange={(e) => setForm({ ...form, requesterName: e.target.value })}
                className="w-full p-2.5 bg-white/5 border border-white/10 text-white placeholder-white/50 focus:ring-2 focus:ring-[#C1A67B] focus:bg-white/10 transition-all rounded-xl font-bold"
                required
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1">الإدارة / القسم الموجه إليه البلاغ</label>
              <select
                value={form.targetDepartment}
                onChange={(e) => setForm({ ...form, targetDepartment: e.target.value })}
                className="w-full p-2.5 bg-white/5 border border-white/10 text-white placeholder-white/50 focus:ring-2 focus:ring-[#C1A67B] focus:bg-white/10 transition-all rounded-xl font-bold"
              >
                {masterData.departments.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 mb-1">مصدر عدم المطابقة</label>
              <select
                value={form.source}
                onChange={(e) => setForm({ ...form, source: e.target.value as any })}
                className="w-full p-2.5 bg-white/5 border border-white/10 text-white placeholder-white/50 focus:ring-2 focus:ring-[#C1A67B] focus:bg-white/10 transition-all rounded-xl font-bold"
              >
                <option value="فحص جودة (QC)">فحص جودة (QC)</option>
                <option value="شكوى عميل (Customer)">شكوى عميل (Customer)</option>
                <option value="تدقيق داخلي (Audit)">تدقيق داخلي (Audit)</option>
                <option value="عطل صيانة (Maint)">عطل صيانة (Maint)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 mb-1">درجة الأولوية والخطورة</label>
              <select
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value as any })}
                className="w-full p-2.5 bg-white/5 border border-white/10 text-white placeholder-white/50 focus:ring-2 focus:ring-[#C1A67B] focus:bg-white/10 transition-all rounded-xl font-bold text-red-600"
              >
                <option value="حرج (Critical)">حرج (Critical)</option>
                <option value="عالي (High)">عالي (High)</option>
                <option value="متوسط (Medium)">متوسط (Medium)</option>
                <option value="منخفض (Low)">منخفض (Low)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 mb-1">المنتج المتأثر</label>
              <input
                type="text"
                value={form.productName}
                onChange={(e) => setForm({ ...form, productName: e.target.value })}
                placeholder="مثال: كوع PPR 20mm أو أنبوب UPVC 110mm"
                className="w-full p-2.5 bg-white/5 border border-white/10 text-white placeholder-white/50 focus:ring-2 focus:ring-[#C1A67B] focus:bg-white/10 transition-all rounded-xl font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1">رقم الماكينة / الخط</label>
              <input
                type="text"
                value={form.machineCode}
                onChange={(e) => setForm({ ...form, machineCode: e.target.value })}
                className="w-full p-2.5 bg-white/5 border border-white/10 text-white placeholder-white/50 focus:ring-2 focus:ring-[#C1A67B] focus:bg-white/10 transition-all rounded-xl font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1">رقم التشغيلة (Lot / Batch No.)</label>
              <input
                type="text"
                value={form.lotNumber}
                onChange={(e) => setForm({ ...form, lotNumber: e.target.value })}
                className="w-full p-2.5 bg-white/5 border border-white/10 text-white placeholder-white/50 focus:ring-2 focus:ring-[#C1A67B] focus:bg-white/10 transition-all rounded-xl font-bold text-[#0B3A60]"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1">التاريخ المستهدف للإغلاق</label>
              <input
                type="date"
                value={form.targetDate}
                onChange={(e) => setForm({ ...form, targetDate: e.target.value })}
                className="w-full p-2.5 bg-white/5 border border-white/10 text-white placeholder-white/50 focus:ring-2 focus:ring-[#C1A67B] focus:bg-white/10 transition-all rounded-xl font-bold text-red-600"
                required
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-slate-300 mb-1">عنوان موضوع عدم المطابقة</label>
              <input
                type="text"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                placeholder="مثال: وجود فقاعات هواء داخلية تؤدي لكسر الكوع PPR 20mm عند اختبار الضغط"
                className="w-full p-2.5 bg-white/5 border border-white/10 text-white placeholder-white/50 focus:ring-2 focus:ring-[#C1A67B] focus:bg-white/10 transition-all rounded-xl font-bold text-white"
                required
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-slate-300 mb-1">وصف حالة عدم المطابقة NCR Description</label>
              <textarea
                value={form.ncrDescription}
                onChange={(e) => setForm({ ...form, ncrDescription: e.target.value })}
                rows={2}
                placeholder="اكتب التفاصيل الرقمية للرفض وعينة الفحص..."
                className="w-full p-2.5 bg-white/5 border border-white/10 text-white placeholder-white/50 focus:ring-2 focus:ring-[#C1A67B] focus:bg-white/10 transition-all rounded-xl font-medium"
                required
              />
            </div>
          </div>

          {/* Interactive 5 Whys Tree Section */}
          <div className="pt-2 mt-2">
            <button
              type="button"
              onClick={() => setShow5WhysForm(!show5WhysForm)}
              className="flex items-center justify-center sm:justify-start gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-[#0B3A60] text-xs font-black rounded-xl transition-all w-full sm:w-auto border border-white/10 shadow-sm cursor-pointer"
            >
              <Plus className={`w-4 h-4 transition-transform ${show5WhysForm ? 'rotate-45' : ''}`} />
              <span>{show5WhysForm ? 'إخفاء تحليل 5 Whys' : 'إضافة تحليل 5 Whys يدوياً (اختياري)'}</span>
            </button>
            
            {show5WhysForm && (
              <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <FiveWhysTree
                  fiveWhys={form.fiveWhys}
                  onChange={(updated) => setForm({ ...form, fiveWhys: updated, rootCause: updated.why5 })}
                  isEditable={true}
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
            <div>
              <label className="block text-slate-300 mb-1">الإجراء التصحيحي الفوري (Immediate Corrective Action)</label>
              <textarea
                value={form.immediateAction}
                onChange={(e) => setForm({ ...form, immediateAction: e.target.value })}
                rows={2}
                placeholder="الإجراء الواجب تنفيذه فوراً للسيطرة على الشحنة والمصنع..."
                className="w-full p-2.5 bg-white/5 border border-white/10 text-white placeholder-white/50 focus:ring-2 focus:ring-[#C1A67B] focus:bg-white/10 transition-all rounded-xl font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1">الإجراء الوقائي الدائم (Preventive Action)</label>
              <textarea
                value={form.preventiveAction}
                onChange={(e) => setForm({ ...form, preventiveAction: e.target.value })}
                rows={2}
                placeholder="الإجراء لمنع تكرار المسبب على المدى البعيد..."
                className="w-full p-2.5 bg-white/5 border border-white/10 text-white placeholder-white/50 focus:ring-2 focus:ring-[#C1A67B] focus:bg-white/10 transition-all rounded-xl font-medium"
              />
            </div>
          </div>

          {submitError && (
            <div className="bg-red-50 border border-red-200 p-3 rounded-xl flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div className="text-red-800 text-xs font-bold leading-relaxed">
                {submitError}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-white/10 text-slate-300 font-bold rounded-xl text-xs disabled:opacity-50"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#E74C3C] text-white font-black rounded-xl text-xs shadow-md hover:bg-red-700 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>جاري الإرسال الحفظ...</span>
                </>
              ) : (
                <span>{submitError ? 'إعادة المحاولة ➔' : 'حفظ وتأكيد طلب CAPA / NCR ➔'}</span>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white/10 backdrop-blur-xl p-4 rounded-2xl border border-white/20 shadow-\[0_8px_32px_0_rgba(0,0,0,0.37)\] space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="بحث برقم CAPA، المكون، العيب، أو المهندس..."
              className="w-full pr-9 pl-4 py-2 bg-white/5 text-white border border-white/10 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0B3A60]"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto text-xs font-bold">
            <div className="flex items-center gap-1 bg-white/10 p-1 rounded-xl">
              <span className="text-slate-400 px-2 text-[10px]">الحالة:</span>
              {['ALL', 'Open', 'Progress', 'Done', 'Closed'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    statusFilter === st ? 'bg-white/20 text-white shadow-md' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {st === 'ALL' ? 'الكل' : st === 'Open' ? 'مفتوح' : st === 'Progress' ? 'قيد التنفيذ' : st === 'Done' ? 'تم' : 'مغلق'}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 bg-white/10 p-1 rounded-xl">
              <span className="text-slate-400 px-2 text-[10px]">الأولوية:</span>
              {['ALL', 'Critical', 'High', 'Medium'].map((pr) => (
                <button
                  key={pr}
                  onClick={() => setPriorityFilter(pr)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    priorityFilter === pr ? 'bg-red-500/40 text-white shadow-md' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {pr === 'ALL' ? 'الكل' : pr === 'Critical' ? 'حرج' : pr === 'High' ? 'عالي' : 'متوسط'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CAPA Request Cards Grid */}
      <div className="grid grid-cols-1 gap-5">
        {filteredRequests.map((capa) => {
          const isWhysExpanded = expandedWhysId === capa.id;

          return (
            <div 
              key={capa.id} 
              className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-xs hover:border-[#0B3A60] transition-all space-y-4"
            >
              {/* Card Top Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-black text-sm bg-[#0B3A60] text-white px-3.5 py-1 rounded-xl shadow-xs">
                    {capa.capaNo}
                  </span>

                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-black ${
                    capa.priority.includes('حرج') ? 'bg-red-500/20 text-red-300 border border-red-300' :
                    capa.priority.includes('عالي') ? 'bg-orange-100 text-orange-800 border border-orange-300' :
                    'bg-amber-100 text-amber-800'
                  }`}>
                    أولوية: {capa.priority}
                  </span>

                  {capa.lotNumber && (
                    <span className="bg-white/10 text-slate-300 text-[11px] font-extrabold px-2.5 py-0.5 rounded-lg border border-white/10">
                      تشغيلة: {capa.lotNumber}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedCapaForQr(capa);
                      setIsQrModalOpen(true);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-[#C4A052] hover:text-white text-slate-300 text-xs font-bold rounded-xl transition-all cursor-pointer border border-white/10"
                    title="طباعة بطاقة QR"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>بطاقة QR</span>
                  </button>

                  <span className={`px-3 py-1 rounded-full text-xs font-black ${
                    capa.status.includes('Done') || capa.status.includes('مغلق') 
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                      : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}>
                    {capa.status}
                  </span>
                </div>
              </div>

              {/* Subject and Description */}
              <div>
                <h3 className="font-extrabold text-[#0B3A60] text-base leading-snug">{capa.subject}</h3>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed bg-white/5 text-white p-3 rounded-xl border border-white/10">
                  <b>وصف عدم المطابقة NCR:</b> {capa.ncrDescription}
                </p>
              </div>

              {/* Product and Responsibilities */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs font-semibold text-slate-300 bg-sky-50/50 p-3.5 rounded-xl border border-sky-100">
                <div><b>القسم المعني:</b> {capa.targetDepartment}</div>
                <div><b>المسؤول التنفيذي:</b> {capa.responsiblePerson}</div>
                <div><b>التاريخ المستهدف:</b> <span className="text-red-600 font-bold">{capa.targetDate}</span></div>
                <div><b>تقييم الفاعلية:</b> <span className="font-black text-emerald-700">{capa.effectivenessEval}</span></div>
              </div>

              {/* Actions & Root Cause summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-200/60">
                  <span className="font-bold text-emerald-900 block mb-1">الإجراء التصحيحي الفوري:</span>
                  <p className="text-slate-300">{capa.immediateAction}</p>
                </div>

                <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200/60">
                  <span className="font-bold text-amber-900 block mb-1">السبب الجذر (Root Cause):</span>
                  <p className="text-slate-300">{capa.rootCause}</p>
                </div>
              </div>

              {/* 5 Whys Tree Toggle */}
              {capa.fiveWhys && (
                <div className="pt-2 border-t border-white/10">
                  <button
                    onClick={() => setExpandedWhysId(isWhysExpanded ? null : capa.id)}
                    className="flex items-center justify-between w-full p-2.5 bg-white/10 hover:bg-white/20/80 rounded-xl text-xs font-extrabold text-[#0B3A60] transition-all cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-[#C4A052]" />
                      <span>{isWhysExpanded ? 'إخفاء مخطط الـ 5 Whys' : 'عرض تحليل الأسباب الجذرية (5 Whys Tree)'}</span>
                    </span>
                    {isWhysExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  {isWhysExpanded && (
                    <div className="mt-3">
                      <FiveWhysTree fiveWhys={capa.fiveWhys} isEditable={false} />
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {filteredRequests.length === 0 && (
          <div className="bg-white/10 backdrop-blur-xl p-12 text-center rounded-2xl border border-white/20 shadow-\[0_8px_32px_0_rgba(0,0,0,0.37)\] space-y-3">
            <AlertCircle className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="font-bold text-slate-300 text-sm">لا توجد طلبات عدم مطابقة تطابق البحث</h4>
            <p className="text-xs text-slate-400">جرب تغيير أسلوب البحث أو إزالة بعض التصفية.</p>
          </div>
        )}
      </div>

      </div>
      {/* QR Code Modal */}
      <CapaQrModal
        capa={selectedCapaForQr}
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
      />
    </div>
  );
};
