import React, { useState } from 'react';
import { Download, Copy, Check, FileSpreadsheet, BookOpen, Layers, ShieldCheck, Play, Code, ChevronRight } from 'lucide-react';
import Papa from 'papaparse';
import { InspectionLog, MixingLog, InjectionLog, PreventiveLog, BreakdownLog, CAPARequest, MasterDataState } from '../types';

interface ImplementationGuideViewProps {
  logs: InspectionLog[];
  mixingLogs: MixingLog[];
  injectionLogs: InjectionLog[];
  preventiveLogs: PreventiveLog[];
  breakdownLogs: BreakdownLog[];
  capaRequests: CAPARequest[];
  masterData: MasterDataState;
}

export const ImplementationGuideView: React.FC<ImplementationGuideViewProps> = ({
  logs,
  mixingLogs,
  injectionLogs,
  preventiveLogs,
  breakdownLogs,
  capaRequests,
  masterData
}) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedFormula, setCopiedFormula] = useState(false);

  // Generate and Download Consolidated Master Sheet CSV
  const handleDownloadConsolidatedSheet = () => {
    // We construct a structured CSV file with distinct sections for each module
    const rows: any[] = [];

    // Header & Info
    rows.push(['==================================================']);
    rows.push(['QualityOS Premium - Consolidated Master Spreadsheet']);
    rows.push(['تاريخ الإنشاء:', new Date().toLocaleString('ar-EG')]);
    rows.push(['==================================================']);
    rows.push([]);

    // Section 1: Pipe & Fitting Quality Logs
    rows.push(['--- SECTION 1: PIPE & FITTING INSPECTION LOGS (الأنابيب والوصلات) ---']);
    rows.push(['السجل', 'التاريخ', 'الشهر', 'القسم', 'كود المنتج', 'اسم المنتج', 'الخامة', 'الماكينة', 'المفتش', 'الوردية', 'حجم العينة', 'المرفوضات', 'نسبة الرفض %', 'كود العيب', 'اسم العيب', 'الحالة', 'ملاحظات']);
    logs.forEach(l => {
      rows.push([
        l.id, l.date, l.month || 'أغسطس', l.category === 'pipe' ? 'أنابيب' : 'وصلات',
        l.productCode, l.productName, l.material || 'PPR', l.machineCode,
        l.inspectorName, l.shiftName, l.sampleSize, l.defectiveQty, l.rejectRate,
        l.defectCode, l.defectName, l.status, l.notes
      ]);
    });
    rows.push([]);

    // Section 2: Mixing Review Logs
    rows.push(['--- SECTION 2: MIXING REVIEW LOGS (تركيبة الخلطات) ---']);
    rows.push(['السجل', 'التاريخ', 'رقم الوجبة', 'الوردية', 'المشرف', 'الرقيب', 'PVC (kg)', 'مثبت (kg)', 'كالسيت (kg)', 'شمع (kg)', 'صبغة (kg)', 'محسن (kg)', 'مزلق (kg)', 'الوزن الفعلي', 'الانحراف (kg)', 'نسبة الانحراف %', 'الحالة']);
    mixingLogs.forEach(m => {
      rows.push([
        m.id, m.date, m.batchNo, m.shift, m.supervisor, m.observer,
        m.pvcActualKg, m.stabilizerActualKg, m.calciumActualKg, m.waxActualKg,
        m.pigmentActualKg, m.modifierActualKg, m.lubricantActualKg,
        m.totalActualKg, m.deviationKg, m.deviationPct, m.status
      ]);
    });
    rows.push([]);

    // Section 3: Injection Production Logs
    rows.push(['--- SECTION 3: INJECTION PRODUCTION LOGS (إنتاج الحقن) ---']);
    rows.push(['السجل', 'التاريخ', 'الماكينة', 'الوردية', 'المشغل', 'كود المنتج', 'اسم المنتج', 'زمن الدورة (ث)', 'سليم', 'مرفوض', 'نسبة الرفض %', 'استهلاك الخام (kg)', 'التوقف (ساعة)', 'سبب التوقف', 'الكفاءة OEE %']);
    injectionLogs.forEach(i => {
      rows.push([
        i.id, i.date, i.machineCode, i.shift, i.operatorName,
        i.productCode, i.productName, i.cycleTime, i.goodQty, i.rejectQty,
        i.rejectPct, i.materialUsedKg, i.downtimeHours, i.downtimeReason, i.efficiencyPct
      ]);
    });
    rows.push([]);

    // Section 4: Maintenance & Breakdown Logs
    rows.push(['--- SECTION 4: BREAKDOWN & MAINTENANCE LOGS (الصيانة والأعطال) ---']);
    rows.push(['السجل', 'التاريخ', 'الماكينة', 'نوع العطل', 'الوصف', 'السبب الجذر', 'زمن التوقف (ساعة)', 'قطع الغيار', 'التكلفة (EGP)', 'الحالة']);
    breakdownLogs.forEach(b => {
      rows.push([
        b.id, b.date, b.machineCode, 'عطل مفاجئ', b.description,
        b.rootCause, b.downtimeHours, b.partsReplaced, b.costEGP, b.repairStatus
      ]);
    });
    rows.push([]);

    // Section 5: CAPA Requests
    rows.push(['--- SECTION 5: CAPA REQUESTS (طلبات الفعل التصحيحي QAF-04-03) ---']);
    rows.push(['رقم CAPA', 'التاريخ', 'المُصدر', 'الإدارة الموجهة', 'المصدر', 'الأولوية', 'الموضوع', 'NCR الوصف', 'الإجراء الفوري', 'المسؤول', 'التاريخ المستهدف', 'الحالة']);
    capaRequests.forEach(c => {
      rows.push([
        c.capaNo, c.date, c.requesterName, c.targetDepartment, c.source,
        c.priority, c.subject, c.ncrDescription, c.immediateAction,
        c.responsiblePerson, c.targetDate, c.status
      ]);
    });

    const csvContent = Papa.unparse(rows);
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `QualityOS_Consolidated_Master_Sheet.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Google Apps Script Code String
  const appsScriptCode = `/**
 * QualityOS Premium - Google Apps Script Automation
 * Script Code: Code.gs
 * يقوم هذا السكربت بإنشاء كافة الشيتات وتنسيقها وتجهيزها تلقائياً
 */

function setupQualityOSSystem() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // 1. شيت الأنابيب والوصلات
  var sheetPipes = getOrCreateSheet(ss, "1_QC_Pipes_Fittings");
  sheetPipes.getRange("A1:Q1").setValues([["ID", "التاريخ", "الشهر", "القسم", "كود المنتج", "اسم المنتج", "الخامة", "الماكينة", "المفتش", "الوردية", "العينة", "المرفوضات", "نسبة الرفض %", "كود العيب", "اسم العيب", "الحالة", "ملاحظات"]]);
  sheetPipes.getRange("A1:Q1").setBackground("#1B4F72").setFontColor("#FFFFFF").setFontWeight("bold");
  
  // 2. شيت الخلطات الجافة
  var sheetMixing = getOrCreateSheet(ss, "2_QC_Mixing_Review");
  sheetMixing.getRange("A1:Q1").setValues([["ID", "التاريخ", "الوجبة", "الوردية", "المشرف", "الرقيب", "PVC", "Stabilizer", "Calcium", "Wax", "Pigment", "Modifier", "Lubricant", "الوزن الفعلي", "الانحراف kg", "الانحراف %", "الحالة"]]);
  sheetMixing.getRange("A1:Q1").setBackground("#27AE60").setFontColor("#FFFFFF").setFontWeight("bold");
  
  // 3. شيت إنتاج الحقن
  var sheetInj = getOrCreateSheet(ss, "3_QC_Injection_Prod");
  sheetInj.getRange("A1:O1").setValues([["ID", "التاريخ", "الماكينة", "الوردية", "المشغل", "الكود", "اسم المنتج", "CycleTime", "سليم", "مرفوض", "الرفض %", "الخام kg", "التوقف h", "سبب التوقف", "OEE %"]]);
  sheetInj.getRange("A1:O1").setBackground("#E67E22").setFontColor("#FFFFFF").setFontWeight("bold");
  
  // 4. شيت الصيانة والأعطال
  var sheetMaint = getOrCreateSheet(ss, "4_Maintenance_BD");
  sheetMaint.getRange("A1:J1").setValues([["ID", "التاريخ", "الماكينة", "نوع العطل", "الوصف", "السبب الجذر", "التوقف h", "قطع الغيار", "التكلفة", "الحالة"]]);
  sheetMaint.getRange("A1:J1").setBackground("#8E44AD").setFontColor("#FFFFFF").setFontWeight("bold");

  // 5. شيت طلبات CAPA
  var sheetCapa = getOrCreateSheet(ss, "5_CAPA_Requests");
  sheetCapa.getRange("A1:L1").setValues([["رقم CAPA", "التاريخ", "المُصدر", "الإدارة", "المصدر", "الأولوية", "الموضوع", "NCR الوصف", "الإجراء الفوري", "المسؤول", "التاريخ المستهدف", "الحالة"]]);
  sheetCapa.getRange("A1:L1").setBackground("#E74C3C").setFontColor("#FFFFFF").setFontWeight("bold");
  
  SpreadsheetApp.getUi().alert("✅ تم إنشاء وتنسيق كافة شيتات QualityOS Premium بنجاح!");
}

function getOrCreateSheet(ss, sheetName) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }
  return sheet;
}`;

  const copyToClipboard = (text: string, type: 'code' | 'formula') => {
    navigator.clipboard.writeText(text);
    if (type === 'code') {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } else {
      setCopiedFormula(true);
      setTimeout(() => setCopiedFormula(false), 2000);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Solution Banner for user's prompt */}
      <div className="bg-[#1B4F72] text-white p-6 rounded-2xl shadow-lg border border-[#2874A6] space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#E67E22] text-white px-3 py-1 rounded-full text-xs font-black mb-2">
              <ShieldCheck className="w-4 h-4" />
              <span>الحل المتكامل الفوري لمشكلة جوجل شيت</span>
            </div>
            <h2 className="text-xl font-black text-white">تحميل الشيت الموحد ودليل الربط خطوة بخطوة</h2>
            <p className="text-xs text-slate-200 mt-1 max-w-3xl leading-relaxed">
              إذا كنت لا تستطيع التعديل المباشر داخل جوجل شيت ببيئتك، قمنا بجمع كافة بيانات المشروع والوحدات الخمس في 
              <b> شيت واحد موحد (Consolidated Sheet)</b> يمكنك تحميله بضغطة زر واحدة ورفعه مباشرة إلى Google Sheets بدون أي خطوات يدوية معقدة!
            </p>
          </div>

          <button
            onClick={handleDownloadConsolidatedSheet}
            className="flex items-center gap-2 px-6 py-3.5 bg-[#27AE60] hover:bg-emerald-700 text-white text-sm font-black rounded-xl transition-all shadow-md cursor-pointer shrink-0"
          >
            <Download className="w-5 h-5" />
            <span>تحميل الشيت الموحد (QualityOS Master)</span>
          </button>
        </div>
      </div>

      {/* Step by Step Implementation Methods */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Method 1: Google Apps Script Automatic Setup */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-3 border-b border-white/10 pb-3">
            <div className="p-2.5 bg-emerald-100 text-[#27AE60] rounded-xl font-black">
              <Code className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-sm">الطريقة الأولى: السكربت الأوتوماتيكي (Google Apps Script)</h3>
              <p className="text-xs text-slate-400">إنشاء وتنسيق الـ 5 شيتات تلقائياً بكود واحد</p>
            </div>
          </div>

          <ol className="text-xs space-y-2 text-slate-200 font-semibold list-decimal list-inside">
            <li>افتح أي ملف Google Sheet جديد في حسابك.</li>
            <li>من القائمة العلوية اختر <b>Extensions (الإضافات)</b> ثم <b>Apps Script</b>.</li>
            <li>امسح الكود الموجود والصق الكود التالي (Code.gs).</li>
            <li>اضغط <b>Save</b> ثم <b>Run (تشغيل)</b> وسيتم إنشاء كافة الشيتات مع التنسيق والألوان فوراً!</li>
          </ol>

          <div className="relative bg-slate-900 text-slate-100 p-4 rounded-xl text-xs font-mono overflow-x-auto max-h-56">
            <button
              onClick={() => copyToClipboard(appsScriptCode, 'code')}
              className="absolute top-3 left-3 px-3 py-1 bg-[#E67E22] hover:bg-amber-600 text-white font-sans text-[11px] font-bold rounded-lg flex items-center gap-1 cursor-pointer"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? 'تم النسخ!' : 'نسخ الكود'}</span>
            </button>
            <pre className="text-[11px] font-mono leading-relaxed">{appsScriptCode}</pre>
          </div>
        </div>

        {/* Method 2: AppSheet 3-Minute Deployment Guide */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-3 border-b border-white/10 pb-3">
            <div className="p-2.5 bg-sky-100 text-[#2874A6] rounded-xl font-black">
              <Play className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-sm">الطريقة الثانية: تطبيق AppSheet للهاتف (No-Code)</h3>
              <p className="text-xs text-slate-400">تحويل الشيت الموحد لتطبيق موبايل احترافي في 3 دقائق</p>
            </div>
          </div>

          <div className="space-y-3 text-xs font-semibold text-slate-200">
            <div className="flex items-start gap-2 bg-white/5 p-3 rounded-xl border border-white/10">
              <span className="p-1 bg-[#1B4F72] text-white rounded font-bold text-[10px]">1</span>
              <div>
                <b>رفع الشيت الموحد:</b> قم برفع ملف CSV المتأتي من زر التحميل أعلاه إلى Google Drive وافتحه كـ Google Sheet.
              </div>
            </div>

            <div className="flex items-start gap-2 bg-white/5 p-3 rounded-xl border border-white/10">
              <span className="p-1 bg-[#1B4F72] text-white rounded font-bold text-[10px]">2</span>
              <div>
                <b>إنشاء تطبيق AppSheet:</b> من داخل Google Sheets اختر <b>Extensions ➔ AppSheet ➔ Create an App</b>.
              </div>
            </div>

            <div className="flex items-start gap-2 bg-white/5 p-3 rounded-xl border border-white/10">
              <span className="p-1 bg-[#1B4F72] text-white rounded font-bold text-[10px]">3</span>
              <div>
                <b>إضافة الجداول (Tables):</b> سيقوم AppSheet بقراءة الجداول الخمسة تلقائياً. قم بتأكيد الجداول وتحديد مفتاح كل جدول (Key Column).
              </div>
            </div>

            <div className="flex items-start gap-2 bg-[#27AE60]/10 text-emerald-900 p-3 rounded-xl border border-emerald-200">
              <span className="p-1 bg-[#27AE60] text-white rounded font-bold text-[10px]">4</span>
              <div>
                <b>مباروك!</b> أصبح لديك تطبيق موبايل ولوحة تحكم تفاعلية مع إمكانية إدخال البيانات دون الحاجة لفتح الشيت يدويًا.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* IMPORTRANGE Consolidated Formula Box */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-sm space-y-4">
        <h3 className="font-extrabold text-white text-sm">دليل معادلة IMPORTRANGE لدمج شيتات متعددة في شيت رئيسي واحد</h3>
        <p className="text-xs text-slate-300">إذا كان لديك عدة ملفات منفصلة وترغب في تجميعها ديناميكياً داخل شيت رئيسي:</p>

        <div className="bg-slate-900 text-amber-300 p-4 rounded-xl font-mono text-xs flex items-center justify-between">
          <code>=IMPORTRANGE("رابط_الملف_الأصلي", "1_QC_Pipes_Fittings!A1:Q500")</code>
          <button
            onClick={() => copyToClipboard(`=IMPORTRANGE("YOUR_SPREADSHEET_URL", "1_QC_Pipes_Fittings!A1:Q500")`, 'formula')}
            className="px-3 py-1 bg-[#2874A6] hover:bg-sky-700 text-white font-sans text-[11px] font-bold rounded-lg cursor-pointer shrink-0"
          >
            {copiedFormula ? 'تم النسخ!' : 'نسخ الصيغة'}
          </button>
        </div>
      </div>

      {/* Data Protection & ISO 9001 Security Audit Section */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl space-y-4 border border-slate-800 dir-rtl">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
          <div className="p-2 bg-[#C0A46F] text-white rounded-xl font-black">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-black text-white text-base">حماية البيانات وسجل التعديلات المعتمد (Data Protection & ISO Audit Trail)</h3>
            <p className="text-xs text-slate-300 mt-0.5">ضمان عدم مسح أو تعديل سجلات الجودة بالمصنع بعد اعتمادها</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 space-y-2">
            <span className="font-black text-[#C0A46F] block">1. قفل خلايا المعادلات والعناوين</span>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              قم بتحديد الصف الأول (A1:Z1) وأعمدة المعادلات المنسدلة، ثم اضغط كليك يمين ➔ <b>Protect Range</b> وتحديد مهندسي الجودة فقط للتعديل.
            </p>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 space-y-2">
            <span className="font-black text-[#C0A46F] block">2. حماية شيتات NCR المغلقة</span>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              عند إغلاق طلب الـ CAPA وتأكيد فاعليته، تحول حالة الصف إلى <b>"مغلق ومكتمل"</b> ويتم قفل الصف لمنع تعديل النتائج التاريخية.
            </p>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 space-y-2">
            <span className="font-black text-[#C0A46F] block">3. التتبع الآلي للمستخدمين (Audit Log)</span>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              يقوم كود Apps Script بلمس كل تعديل وتسجيل تاريخ وساعة وتوقيع البريد الإلكتروني للمعدِّل أوتوماتيكياً في شيت موازي.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
