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
  const [isAiGenerating, setIsAiGenerating] = useState(false);

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

  // AI Auto-Suggest 5 Whys based on description
  const handleAiSuggest5Whys = () => {
    setIsAiGenerating(true);
    setTimeout(() => {
      const subjectLower = (form.subject + ' ' + form.ncrDescription).toLowerCase();

      let suggested: FiveWhysAnalysis;

      if (subjectLower.includes('فقاع') || subjectLower.includes('bubble') || subjectLower.includes('كوع') || subjectLower.includes('ppr')) {
        suggested = {
          why1: 'وجود جيوب وفقاعات هواء داخل جدار الوصلات المحقونة عند اختبار الضغط.',
          why2: 'تمدد الرطوبة المحتبسة داخل حبيبات خام PPR أثناء انصهارها بالاسطوانة عند 220°C.',
          why3: 'انخفاض كفاءة وسرعة هواء فرن تجفيف الخام الأوتوماتيكي (Hopper Dryer).',
          why4: 'تراكم الغبار وانسداد الفلتر الهوائي لسحب مجفف الهوبر وعدم تنظيفه.',
          why5: 'عدم وجود شيك لست صيانة أسبوعية لفلتر المجفف ضمن نموذج الصيانة الوقائية.'
        };
      } else if (subjectLower.includes('وزن') || subjectLower.includes('كالسيت') || subjectLower.includes('خلط') || subjectLower.includes('pvc')) {
        suggested = {
          why1: 'زيادة نسبة هشاشة وسهولة كسر أنابيب UPVC عند اختبار الانحناء والصدمة.',
          why2: 'زيادة كمية كربونات الكالسيوم (الكالسيت) في خلطة البودرة عن النسبة المعتمدة.',
          why3: 'قراءة ميزان الإضافات الحساس يعطي وزناً أقل من الحقيقي بـ +4.5kg.',
          why4: 'اهتزاز قاعدة الميزان وتراكم بودرة الـ PVC على خلايا التحميل (Load Cells).',
          why5: 'غياب تطبيق المعايرة اليومية للموازين الحساسة بأوزان معايرة قياسية قبل بداية الوردية.'
        };
      } else {
        suggested = {
          why1: `حدوث عدم مطابقة في المنتج (${form.subject || 'العيب المذكور'}) أثناء الفحص.`,
          why2: 'انحراف أحد معايير التشغيل الفنية عن المدى المسموح به في بطاقة المواصفة.',
          why3: 'تغير استجابة الحساسات أو التبريد أثناء التشغيل بسبب الإجهاد التشغيلي.',
          why4: 'تأخر تنفيذ معايرة الحساسات ومراجعة ضغوط التشغيل بجدول الصيانة الوقائية.',
          why5: 'الحاجة لتحديث خطة الفحص الدوري والـ SOP المعياري للوردية لمنع تكرار الانحراف.'
        };
      }

      setForm(prev => ({
        ...prev,
        rootCause: suggested.why5,
        fiveWhys: suggested
      }));
      setIsAiGenerating(false);
    }, 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

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
      rootCause: form.fiveWhys.why5 || form.rootCause || 'قيد التحليل النهائي',
      fiveWhys: form.fiveWhys,
      status: 'مفتوح (Open)',
      immediateAction: form.immediateAction,
      preventiveAction: form.preventiveAction,
      responsiblePerson: form.responsiblePerson,
      targetDate: form.targetDate,
      delayDays: 0,
      effectivenessEval: 'قيد التقييم (Pending)',
      notes: form.notes
    };

    onAddCapa(newEntry);
    setShowForm(false);
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
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 dir-rtl font-sans">
      {/* Release Phase 1 Header Banner with Polo Egypt Branding */}
      <div className="bg-[#0B3A60] text-white p-6 rounded-2xl shadow-xl border border-[#1E4E79] space-y-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <PoloEgyptLogo variant="horizontal" size="md" lightMode={true} />

          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-[#C4A052] text-slate-950 text-xs font-black px-3.5 py-1.5 rounded-full shadow-sm flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>الإطلاق الرسمي: النسخة الأولى (Phase 1)</span>
            </span>

            <button
              onClick={() => {
                setSelectedCapaForQr(null);
                setIsQrModalOpen(true);
              }}
              className="flex items-center gap-2 px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-full border border-white/20 transition-all cursor-pointer"
            >
              <QrCode className="w-4 h-4 text-[#C4A052]" />
              <span>QR Code للوصول عبر الهاتف بالمصنع</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <span>نظام تسجيل حالات عدم المطابقة (NCR)، الـ CAPA، وتحليل الـ 5 Whys</span>
            </h2>
            <p className="text-xs text-slate-200 mt-1 max-w-3xl leading-relaxed">
              المنظومة الرقمية المعتمدة لشركة <b>بولو إيجيبت للتجارة والصناعة ش.م.م</b> لتتبع عدم المطابقة، إدارة الإجراءات التصحيحية والوقائية، وتحليل المسببات الجذرية بطريقة 5 Whys طبقاً لمواصفة ISO 9001.
            </p>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-5 py-3 bg-[#E74C3C] hover:bg-red-700 text-white text-xs font-black rounded-xl transition-all shadow-md cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>{showForm ? 'إلغاء النموذج' : '+ إصدار طلب CAPA / NCR جديد'}</span>
          </button>
        </div>
      </div>

      {/* Creation Form Modal / Card */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border-2 border-[#E74C3C] shadow-2xl space-y-6">
          <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-[#E74C3C]" />
              <h3 className="font-extrabold text-[#0B3A60] text-sm">
                نموذج إصدار عدم مطابقة وفعل تصحيحي وقائي - ISO QAF-04-03
              </h3>
            </div>
            <span className="text-xs bg-red-100 text-red-800 font-extrabold px-3 py-1 rounded-full">
              بولو إيجيبت QA/QC
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-semibold">
            <div>
              <label className="block text-slate-700 mb-1">تاريخ الإصدار</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 mb-1">مُصدر البلاغ (مهندس/مفتش الجودة)</label>
              <input
                type="text"
                value={form.requesterName}
                onChange={(e) => setForm({ ...form, requesterName: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 mb-1">الإدارة / القسم الموجه إليه البلاغ</label>
              <select
                value={form.targetDepartment}
                onChange={(e) => setForm({ ...form, targetDepartment: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold"
              >
                {masterData.departments.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 mb-1">مصدر عدم المطابقة</label>
              <select
                value={form.source}
                onChange={(e) => setForm({ ...form, source: e.target.value as any })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold"
              >
                <option value="فحص جودة (QC)">فحص جودة (QC)</option>
                <option value="شكوى عميل (Customer)">شكوى عميل (Customer)</option>
                <option value="تدقيق داخلي (Audit)">تدقيق داخلي (Audit)</option>
                <option value="عطل صيانة (Maint)">عطل صيانة (Maint)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 mb-1">درجة الأولوية والخطورة</label>
              <select
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value as any })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-red-600"
              >
                <option value="حرج (Critical)">حرج (Critical)</option>
                <option value="عالي (High)">عالي (High)</option>
                <option value="متوسط (Medium)">متوسط (Medium)</option>
                <option value="منخفض (Low)">منخفض (Low)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 mb-1">المنتج المتأثر</label>
              <input
                type="text"
                value={form.productName}
                onChange={(e) => setForm({ ...form, productName: e.target.value })}
                placeholder="مثال: كوع PPR 20mm أو أنبوب UPVC 110mm"
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-700 mb-1">رقم الماكينة / الخط</label>
              <input
                type="text"
                value={form.machineCode}
                onChange={(e) => setForm({ ...form, machineCode: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-700 mb-1">رقم التشغيلة (Lot / Batch No.)</label>
              <input
                type="text"
                value={form.lotNumber}
                onChange={(e) => setForm({ ...form, lotNumber: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-[#0B3A60]"
              />
            </div>

            <div>
              <label className="block text-slate-700 mb-1">التاريخ المستهدف للإغلاق</label>
              <input
                type="date"
                value={form.targetDate}
                onChange={(e) => setForm({ ...form, targetDate: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-red-600"
                required
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-slate-700 mb-1">عنوان موضوع عدم المطابقة</label>
              <input
                type="text"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                placeholder="مثال: وجود فقاعات هواء داخلية تؤدي لكسر الكوع PPR 20mm عند اختبار الضغط"
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
                required
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-slate-700 mb-1">وصف حالة عدم المطابقة NCR Description</label>
              <textarea
                value={form.ncrDescription}
                onChange={(e) => setForm({ ...form, ncrDescription: e.target.value })}
                rows={2}
                placeholder="اكتب التفاصيل الرقمية للرفض وعينة الفحص..."
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                required
              />
            </div>
          </div>

          {/* Interactive 5 Whys Tree Section */}
          <div className="pt-2">
            <FiveWhysTree
              fiveWhys={form.fiveWhys}
              onChange={(updated) => setForm({ ...form, fiveWhys: updated, rootCause: updated.why5 })}
              isEditable={true}
              onAiAutoSuggest={handleAiSuggest5Whys}
              isAiGenerating={isAiGenerating}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
            <div>
              <label className="block text-slate-700 mb-1">الإجراء التصحيحي الفوري (Immediate Corrective Action)</label>
              <textarea
                value={form.immediateAction}
                onChange={(e) => setForm({ ...form, immediateAction: e.target.value })}
                rows={2}
                placeholder="الإجراء الواجب تنفيذه فوراً للسيطرة على الشحنة والمصنع..."
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 mb-1">الإجراء الوقائي الدائم (Preventive Action)</label>
              <textarea
                value={form.preventiveAction}
                onChange={(e) => setForm({ ...form, preventiveAction: e.target.value })}
                rows={2}
                placeholder="الإجراء لمنع تكرار المسبب على المدى البعيد..."
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-5 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#E74C3C] text-white font-black rounded-xl text-xs shadow-md hover:bg-red-700"
            >
              حفظ وتأكيد طلب CAPA / NCR ➔
            </button>
          </div>
        </form>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="بحث برقم CAPA، المكون، العيب، أو المهندس..."
              className="w-full pr-9 pl-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0B3A60]"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto text-xs font-bold">
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              <span className="text-slate-500 px-2 text-[10px]">الحالة:</span>
              {['ALL', 'Open', 'Progress', 'Done', 'Closed'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    statusFilter === st ? 'bg-[#0B3A60] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {st === 'ALL' ? 'الكل' : st === 'Open' ? 'مفتوح' : st === 'Progress' ? 'قيد التنفيذ' : st === 'Done' ? 'تم' : 'مغلق'}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              <span className="text-slate-500 px-2 text-[10px]">الأولوية:</span>
              {['ALL', 'Critical', 'High', 'Medium'].map((pr) => (
                <button
                  key={pr}
                  onClick={() => setPriorityFilter(pr)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    priorityFilter === pr ? 'bg-[#E74C3C] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
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
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:border-[#0B3A60] transition-all space-y-4"
            >
              {/* Card Top Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-black text-sm bg-[#0B3A60] text-white px-3.5 py-1 rounded-xl shadow-xs">
                    {capa.capaNo}
                  </span>

                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-black ${
                    capa.priority.includes('حرج') ? 'bg-red-100 text-red-800 border border-red-300' :
                    capa.priority.includes('عالي') ? 'bg-orange-100 text-orange-800 border border-orange-300' :
                    'bg-amber-100 text-amber-800'
                  }`}>
                    أولوية: {capa.priority}
                  </span>

                  {capa.lotNumber && (
                    <span className="bg-slate-100 text-slate-700 text-[11px] font-extrabold px-2.5 py-0.5 rounded-lg border border-slate-200">
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
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-[#C4A052] hover:text-slate-950 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer border border-slate-200"
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
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <b>وصف عدم المطابقة NCR:</b> {capa.ncrDescription}
                </p>
              </div>

              {/* Product and Responsibilities */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs font-semibold text-slate-700 bg-sky-50/50 p-3.5 rounded-xl border border-sky-100">
                <div><b>القسم المعني:</b> {capa.targetDepartment}</div>
                <div><b>المسؤول التنفيذي:</b> {capa.responsiblePerson}</div>
                <div><b>التاريخ المستهدف:</b> <span className="text-red-600 font-bold">{capa.targetDate}</span></div>
                <div><b>تقييم الفاعلية:</b> <span className="font-black text-emerald-700">{capa.effectivenessEval}</span></div>
              </div>

              {/* Actions & Root Cause summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-200/60">
                  <span className="font-bold text-emerald-900 block mb-1">الإجراء التصحيحي الفوري:</span>
                  <p className="text-slate-700">{capa.immediateAction}</p>
                </div>

                <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200/60">
                  <span className="font-bold text-amber-900 block mb-1">السبب الجذر (Root Cause):</span>
                  <p className="text-slate-700">{capa.rootCause}</p>
                </div>
              </div>

              {/* 5 Whys Tree Toggle */}
              {capa.fiveWhys && (
                <div className="pt-2 border-t border-slate-100">
                  <button
                    onClick={() => setExpandedWhysId(isWhysExpanded ? null : capa.id)}
                    className="flex items-center justify-between w-full p-2.5 bg-slate-100 hover:bg-slate-200/80 rounded-xl text-xs font-extrabold text-[#0B3A60] transition-all cursor-pointer"
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
          <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 space-y-3">
            <AlertCircle className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="font-bold text-slate-700 text-sm">لا توجد طلبات عدم مطابقة تطابق البحث</h4>
            <p className="text-xs text-slate-400">جرب تغيير أسلوب البحث أو إزالة بعض التصفية.</p>
          </div>
        )}
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
