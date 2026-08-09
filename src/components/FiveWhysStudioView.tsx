import React, { useState } from 'react';
import { CAPARequest, FiveWhysAnalysis } from '../types';
import { FiveWhysTree } from './FiveWhysTree';
import { PoloEgyptLogo } from './PoloEgyptLogo';
import { 
  HelpCircle, 
  Sparkles, 
  Save, 
  Printer, 
  Copy, 
  Check, 
  AlertTriangle, 
  FileText,
  Lightbulb,
  ArrowRight
} from 'lucide-react';

interface FiveWhysStudioViewProps {
  capaRequests: CAPARequest[];
  onUpdateCapaWhys: (capaId: string, updatedWhys: FiveWhysAnalysis) => void;
  onNavigateToRecords: () => void;
}

export const FiveWhysStudioView: React.FC<FiveWhysStudioViewProps> = ({
  capaRequests,
  onUpdateCapaWhys,
  onNavigateToRecords
}) => {
  const [selectedCapaId, setSelectedCapaId] = useState<string>(capaRequests[0]?.id || '');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const selectedCapa = capaRequests.find(c => c.id === selectedCapaId) || capaRequests[0];

  const [currentWhys, setCurrentWhys] = useState<FiveWhysAnalysis>(
    selectedCapa?.fiveWhys || {
      why1: 'وجود عيب أو انحراف في المنتج أثناء اختبار الفحص.',
      why2: 'عدم انتظام معلمات التشغيل على خط البثق/الحقن.',
      why3: 'انخفاض كفاءة جزء فني بالمعدة أو التبريد.',
      why4: 'تأخر تنفيذ الصيانة الوقائية للفلاتر والحساسات.',
      why5: 'الحاجة لتحديث خطة الصيانة الوقائية والـ SOP للوردية.'
    }
  );

  const handleSelectCapa = (id: string) => {
    setSelectedCapaId(id);
    const target = capaRequests.find(c => c.id === id);
    if (target?.fiveWhys) {
      setCurrentWhys(target.fiveWhys);
    }
  };

  const handleAiSuggest = () => {
    setIsAiGenerating(true);
    setTimeout(() => {
      const subjectText = selectedCapa ? (selectedCapa.subject + ' ' + selectedCapa.ncrDescription) : '';
      const textLower = subjectText.toLowerCase();

      let suggested: FiveWhysAnalysis;

      if (textLower.includes('فقاع') || textLower.includes('ppr') || textLower.includes('كوع')) {
        suggested = {
          why1: 'ظهور فقاعات هوائية ومسامية داخلية بكوع PPR 20mm وتسببه في الكسر عند اختبار 20 بار.',
          why2: 'تمدد الرطوبة المحتبسة بالخام البولي بروبلين (PPR) أثناء صهرها عند 220 درجة مئوية.',
          why3: 'انخفاض قدرة فرن التجفيف الأوتوماتيكي (Dehumidifying Hopper Dryer) على سحب الرطوبة.',
          why4: 'انسداد الفلتر الشبكي لسحب الهواء بالفرن وتراكم الغبار البلاستيكي عليه.',
          why5: 'عدم إدراج تنظيف فلاتر المجففات ضمن شيك لست الصيانة الوقائية الأسبوعية لخطوط الحقن.'
        };
      } else if (textLower.includes('وزن') || textLower.includes('خلط') || textLower.includes('pvc') || textLower.includes('كالسيت')) {
        suggested = {
          why1: 'زيادة نسبة الصلابة والهشاشة بأنابيب UPVC 110mm وتأثرها باختبار الصدمات.',
          why2: 'ارتفاع وزن كربونات الكالسيوم (الكالسيت) بالخلطة الجافة بمقدار +4.5 كجم عن المواصفة.',
          why3: 'انحراف قراءة شاشة الميزان الحساس لإضافات الخلطة وإعطاء وزن أقل من الفعلي.',
          why4: 'اهتزاز قاعدة الميزان وتراكم غبار البودرة على خلايا التحميل (Load Cells).',
          why5: 'غياب تطبيق إلزامية المعايرة اليومية للموازين الحساسة بأوزان معايرة قياسية قبل الوردية.'
        };
      } else {
        suggested = {
          why1: `حدوث عدم مطابقة في منتج ${selectedCapa?.productName || 'البلاستيك'} عند الفحص.`,
          why2: 'انحراف إحدى قيم معايير الضبط التشغيلي (الحرارة/الضغط/السرعة) بالماكينة.',
          why3: 'تغير استجابة الحساسات أو دورة التبريد نتيجة الإجهاد التشغيلي المستمر.',
          why4: 'عدم إجراء الضبط والمعايرة الوقائية للحساسات والصمامات ضمن الجدول الدوري.',
          why5: 'ضرورة تحديث إجراءات العمل القياسية (SOP) وتدريب المشغلين على الفحص الميداني.'
        };
      }

      setCurrentWhys(suggested);
      setIsAiGenerating(false);
    }, 1200);
  };

  const handleSave = () => {
    if (selectedCapa) {
      onUpdateCapaWhys(selectedCapa.id, currentWhys);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    }
  };

  const handleCopySummary = () => {
    const text = `تحليل 5 Whys لطلب ${selectedCapa?.capaNo || 'NCR'}:
1. ${currentWhys.why1}
2. ${currentWhys.why2}
3. ${currentWhys.why3}
4. ${currentWhys.why4}
5. السبب الجذر النهائي: ${currentWhys.why5}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 dir-rtl font-sans">
      {/* Top Banner */}
      <div className="bg-[#0B3A60] text-white p-6 rounded-2xl shadow-xl border border-sky-900 space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <PoloEgyptLogo variant="horizontal" size="md" lightMode={true} />
          
          <span className="bg-[#C4A052] text-slate-950 font-black text-xs px-3.5 py-1.5 rounded-full">
            أداة تحليل الأسباب الجذرية (5 Whys Root Cause Studio)
          </span>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <span>استوديو شجرة الـ 5 Whys وتحليل المسببات الجذرية</span>
            </h2>
            <p className="text-xs text-slate-200 mt-1 max-w-2xl leading-relaxed">
              تتبع التسلسل المنطقي لخمس مستويات من المسببات وصولاً للسبب المنهجي النهائي القابل للإغلاق والوقاية.
            </p>
          </div>

          <button
            onClick={onNavigateToRecords}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition-all cursor-pointer"
          >
            <span>عرض السجل الموحد</span>
            <ArrowRight className="w-4 h-4 rotate-180" />
          </button>
        </div>
      </div>

      {/* Selector & Actions Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <span className="text-xs font-bold text-slate-600 shrink-0">اختر بلاغ عدم المطابقة:</span>
          <select
            value={selectedCapaId}
            onChange={(e) => handleSelectCapa(e.target.value)}
            className="w-full md:w-96 p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-[#0B3A60]"
          >
            {capaRequests.map(c => (
              <option key={c.id} value={c.id}>
                {c.capaNo} - {c.subject}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            onClick={handleCopySummary}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'تم النسخ!' : 'نسخ النص'}</span>
          </button>

          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl shadow-md transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{saveSuccess ? 'تم الحفظ بنجاح!' : 'حفظ التحليل بالطلب'}</span>
          </button>
        </div>
      </div>

      {/* Selected CAPA Context Card */}
      {selectedCapa && (
        <div className="bg-sky-50/80 p-4 rounded-2xl border border-sky-200 text-xs space-y-1">
          <div className="flex items-center justify-between text-[#0B3A60] font-black">
            <span>طلب: {selectedCapa.capaNo} | {selectedCapa.subject}</span>
            <span className="bg-sky-200 text-sky-900 px-2.5 py-0.5 rounded-full text-[10px]">
              {selectedCapa.targetDepartment}
            </span>
          </div>
          <p className="text-slate-600 font-medium"><b>الوصف:</b> {selectedCapa.ncrDescription}</p>
        </div>
      )}

      {/* Interactive 5 Whys Component */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <FiveWhysTree
          fiveWhys={currentWhys}
          onChange={(updated) => setCurrentWhys(updated)}
          isEditable={true}
          onAiAutoSuggest={handleAiSuggest}
          isAiGenerating={isAiGenerating}
        />
      </div>
    </div>
  );
};
