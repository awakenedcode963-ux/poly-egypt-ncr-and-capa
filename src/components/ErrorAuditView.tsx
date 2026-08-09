import React, { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Wand2, 
  Download, 
  FileCode, 
  Search, 
  Filter, 
  ArrowLeftRight, 
  Lightbulb, 
  Info, 
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { AuditIssue } from '../types';

interface ErrorAuditViewProps {
  issues: AuditIssue[];
  isAutoFixed: boolean;
  onApplyAutoFix: () => void;
  onApplySingleFix: (issueId: string) => void;
  onExportCleanData: () => void;
  onOpenSheetsGuide: () => void;
}

export const ErrorAuditView: React.FC<ErrorAuditViewProps> = ({
  issues,
  isAutoFixed,
  onApplyAutoFix,
  onApplySingleFix,
  onExportCleanData,
  onOpenSheetsGuide
}) => {
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedSection, setSelectedSection] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredIssues = issues.filter(issue => {
    const matchesSeverity = selectedSeverity === 'all' || issue.severity === selectedSeverity;
    const matchesSection = selectedSection === 'all' || issue.section === selectedSection;
    const matchesSearch = issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          issue.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          issue.originalValue.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSeverity && matchesSection && matchesSearch;
  });

  const criticalCount = issues.filter(i => i.severity === 'critical').length;
  const warningCount = issues.filter(i => i.severity === 'warning').length;
  const infoCount = issues.filter(i => i.severity === 'info').length;

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Auto-Fix Hero */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-2xl p-6 text-white border border-slate-700/80 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-3xl space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-amber-500/20 text-amber-300 text-xs font-semibold px-3 py-1 rounded-full border border-amber-500/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                مراجعة وتدقيق بيانات الجودة
              </span>
              {isAutoFixed && (
                <span className="bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  تم تطبيق كافة التصحيحات التلقائية
                </span>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              تقرير فحص وتصحيح أخطاء شيت البيانات الأساسية
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              قمنا بفحص شيت المصنع الخاص بك واكتشفنا مجموعة من الأخطاء التي تؤثر على دقة معادلات الاكسيل (VLOOKUP) واستخراج تقارير الجودة، مثل تكرار الأكواد، الأخطاء الإملائية، وعدم توحيد صيغ المفتشين.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {!isAutoFixed ? (
              <button
                onClick={onApplyAutoFix}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg hover:shadow-amber-500/25 transition-all transform active:scale-95 cursor-pointer"
              >
                <Wand2 className="w-5 h-5 text-slate-950" />
                <span>تصحيح كافة الأخطاء بنقرة واحدة</span>
              </button>
            ) : (
              <button
                onClick={onExportCleanData}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg transition-all cursor-pointer"
              >
                <Download className="w-5 h-5" />
                <span>تحميل الشيت المصحح (CSV)</span>
              </button>
            )}

            <button
              onClick={onOpenSheetsGuide}
              className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 font-medium text-sm transition-all cursor-pointer"
            >
              <FileCode className="w-4 h-4 text-amber-400" />
              <span>دليل التطبيق في Google Sheets</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">إجمالي الأخطاء والملاحظات</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{issues.length}</p>
            <p className="text-xs text-slate-400 mt-0.5">في شيت البيانات الأساسية</p>
          </div>
          <div className="p-3 bg-slate-100 text-slate-700 rounded-xl">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-red-200 bg-red-50/20 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-red-700">أخطاء حرجة (Critical)</p>
            <p className="text-2xl font-black text-red-600 mt-1">{criticalCount}</p>
            <p className="text-xs text-red-500 mt-0.5">تكرار أكواد وأكواد غير قياسية</p>
          </div>
          <div className="p-3 bg-red-100 text-red-600 rounded-xl">
            <ShieldAlert className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-amber-200 bg-amber-50/20 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-amber-800">أخطاء إملائية (Typos)</p>
            <p className="text-2xl font-black text-amber-600 mt-1">{warningCount}</p>
            <p className="text-xs text-amber-600 mt-0.5">أسماء الأصناف والعيوب</p>
          </div>
          <div className="p-3 bg-amber-100 text-amber-700 rounded-xl">
            <Wand2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-blue-200 bg-blue-50/20 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-blue-800">تنسيق وتوحيد الأسماء</p>
            <p className="text-2xl font-black text-blue-600 mt-1">{infoCount}</p>
            <p className="text-xs text-blue-500 mt-0.5">أسماء المفتشين والماكينات</p>
          </div>
          <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
            <Info className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="بحث في وصف الخطأ، اسم المنتج، أو الكود..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-4 pr-10 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1 text-xs font-semibold text-slate-500">
            <Filter className="w-3.5 h-3.5" />
            <span>تصفية حسب الخطورة:</span>
          </div>

          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 bg-slate-50"
          >
            <option value="all">كافة المستويات ({issues.length})</option>
            <option value="critical">حرجة فقط ({criticalCount})</option>
            <option value="warning">تحذيرات إملائية ({warningCount})</option>
            <option value="info">ملاحظات تنسيق ({infoCount})</option>
          </select>

          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 bg-slate-50"
          >
            <option value="all">كافة الأقسام</option>
            <option value="pipes">الأنابيب (Pipes)</option>
            <option value="fittings">الوصلات (Fittings)</option>
            <option value="fitting_defects">عيوب الوصلات</option>
            <option value="inspectors">المفتشين</option>
            <option value="machines">الماكينات</option>
            <option value="sheets_formula">معادلات وتصميم الشيت</option>
          </select>
        </div>
      </div>

      {/* Issues List */}
      <div className="space-y-4">
        {filteredIssues.length === 0 ? (
          <div className="bg-white rounded-xl p-12 border border-slate-200 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800">لا توجد أخطاء ضمن الفلتر المختار</h3>
            <p className="text-sm text-slate-500">تم تصحيح الأخطاء المطابقة أو لا توجد نتائج للبحث.</p>
          </div>
        ) : (
          filteredIssues.map((issue) => (
            <div
              key={issue.id}
              className={`bg-white rounded-xl p-5 border transition-all ${
                issue.applied
                  ? 'border-emerald-300 bg-emerald-50/20'
                  : issue.severity === 'critical'
                  ? 'border-red-200 hover:border-red-300 shadow-sm'
                  : issue.severity === 'warning'
                  ? 'border-amber-200 hover:border-amber-300 shadow-sm'
                  : 'border-blue-200 hover:border-blue-300 shadow-sm'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Severity Badge */}
                    {issue.severity === 'critical' && (
                      <span className="bg-red-100 text-red-700 text-xs font-bold px-2.5 py-0.5 rounded-md border border-red-200 flex items-center gap-1">
                        <ShieldAlert className="w-3.5 h-3.5" /> خطأ حرج
                      </span>
                    )}
                    {issue.severity === 'warning' && (
                      <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-0.5 rounded-md border border-amber-200 flex items-center gap-1">
                        <Wand2 className="w-3.5 h-3.5" /> خطأ إملائي
                      </span>
                    )}
                    {issue.severity === 'info' && (
                      <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-0.5 rounded-md border border-blue-200 flex items-center gap-1">
                        <Info className="w-3.5 h-3.5" /> توحيد تنسيق
                      </span>
                    )}

                    <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-2.5 py-0.5 rounded-md border border-slate-200">
                      قسم: {issue.section === 'pipes' ? 'الأنابيب' : issue.section === 'fittings' ? 'الوصلات' : issue.section === 'inspectors' ? 'المفتشين' : issue.section === 'fitting_defects' ? 'عيوب الوصلات' : issue.section === 'machines' ? 'الماكينات' : 'معادلات الشيت'}
                    </span>

                    {issue.applied && (
                      <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-md border border-emerald-300 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> تم التطبيق
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-slate-900">{issue.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{issue.description}</p>

                  {/* Before vs After comparison */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
                      <span className="text-slate-400 font-semibold block mb-1">القيمة الحالية في الشيت (الخطأ):</span>
                      <code className="text-red-600 font-mono font-bold block break-all bg-red-50 p-1.5 rounded border border-red-100">
                        {issue.originalValue}
                      </code>
                    </div>

                    <div className="bg-emerald-50/60 p-3 rounded-lg border border-emerald-200 text-xs">
                      <span className="text-emerald-700 font-semibold block mb-1">القيمة التصحيحية المقترحة:</span>
                      <code className="text-emerald-800 font-mono font-bold block break-all bg-emerald-100/80 p-1.5 rounded border border-emerald-200">
                        {issue.suggestedValue}
                      </code>
                    </div>
                  </div>

                  {/* Arabic Formula & Sheets Advice */}
                  <div className="bg-amber-50/70 border border-amber-200/80 rounded-lg p-3 text-xs text-amber-900 flex items-start gap-2 mt-2">
                    <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block">طريقة المعالجة في شيت Google Sheets / Excel:</span>
                      <span>{issue.arabicAdvice}</span>
                    </div>
                  </div>
                </div>

                {/* Individual Fix Button */}
                {issue.autoFixable && !issue.applied && (
                  <div className="shrink-0 self-center md:self-start">
                    <button
                      onClick={() => onApplySingleFix(issue.id)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs shadow-sm transition-all cursor-pointer"
                    >
                      <ArrowLeftRight className="w-3.5 h-3.5 text-amber-400" />
                      <span>تطبيق التعديل</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
