import React from 'react';
import { X, FileSpreadsheet, CheckCircle2, ArrowRight, Lightbulb, Code2 } from 'lucide-react';

interface GoogleSheetsGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownloadCleanCSV: () => void;
}

export const GoogleSheetsGuideModal: React.FC<GoogleSheetsGuideModalProps> = ({
  isOpen,
  onClose,
  onDownloadCleanCSV
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-white/10 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                دليل أسهل طريقة لتصحيح شيت Google Sheets / Excel
              </h3>
              <p className="text-xs text-slate-400">
                خطوات عملية سهلة لتنظيف البيانات وإلغاء الأخطاء نهائياً في نظام الجودة بالمصنع.
              </p>
            </div>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-slate-300 p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps List */}
        <div className="space-y-4 text-sm text-slate-200">
          
          {/* Step 1 */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white flex items-center gap-2">
                <span className="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs font-black">1</span>
                تنزيل واستبدال جدول البيانات الأساسية (Master Data):
              </span>
              <button
                onClick={onDownloadCleanCSV}
                className="text-xs bg-emerald-600 text-white font-bold px-3 py-1.5 rounded-lg hover:bg-emerald-500 transition-colors"
              >
                تنزيل الشيت المصحح (CSV)
              </button>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              انقر على زر "تنزيل الشيت المصحح"، وقم بلصقه داخل تبويب <code>البيانات الأساسية MASTER DATA</code> في Google Sheets الخاص بك بدلاً من الجدول القديم المتضمن تكرار الأكواد والأخطاء الإملائية.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
            <span className="font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs font-black">2</span>
              إنشاء القوائم المنسدلة (Data Validation):
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">
              لمنع إدخال أي كود أو اسم مفتش بشكل خاطئ يدوياً في المستقبل:
            </p>
            <ul className="list-disc list-inside text-xs text-slate-300 space-y-1 pr-4">
              <li>حدد عمود "كود المنتج" في شيت التسجيل اليومي.</li>
              <li>من القائمة العلوية اختر <strong>Data ← Data Validation (التحقق من صحة البيانات)</strong>.</li>
              <li>اختر <strong>List from a range</strong> وحدد عمود أكواد الأنابيب أو الوصلات من شيت MASTER DATA.</li>
            </ul>
          </div>

          {/* Step 3 */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
            <span className="font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs font-black">3</span>
              استخدام معادلة البحث الذكية (XLOOKUP) لجلب الاسم تلقائياً:
            </span>
            <div className="bg-slate-900 text-amber-300 p-3 rounded-lg font-mono text-xs text-left dir-ltr break-all">
              =XLOOKUP(C2, 'MASTER DATA'!A:A, 'MASTER DATA'!B:B, "كود غير معرف")
            </div>
            <p className="text-xs text-slate-300">
              حيث <code>C2</code> هي الخلية التي تحتوي على كود المنتج المدخل، والمعادلة ستقوم بجلب مسمى المنتج تلقائياً بدون أخطاء.
            </p>
          </div>

          {/* Step 4 */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
            <span className="font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs font-black">4</span>
              معادلة حساب نسبة المرفوضات % تلقائياً:
            </span>
            <div className="bg-slate-900 text-amber-300 p-3 rounded-lg font-mono text-xs text-left dir-ltr break-all">
              =IF(F2&gt;0, (G2 / F2) * 100, 0)
            </div>
            <p className="text-xs text-slate-300">
              حيث F2 حجم العينة، و G2 عدد القطع المعيبة.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-end border-t pt-4">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors cursor-pointer"
          >
            فهمت، إغلاق الدليل
          </button>
        </div>

      </div>
    </div>
  );
};
