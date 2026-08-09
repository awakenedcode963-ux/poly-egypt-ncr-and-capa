import React, { useState } from 'react';
import { InspectionLog, MasterDataState } from '../types';
import { 
  Plus, 
  Search, 
  Download, 
  Filter, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  FileSpreadsheet,
  Trash2,
  SlidersHorizontal
} from 'lucide-react';
import Papa from 'papaparse';

interface PipeFittingViewProps {
  logs: InspectionLog[];
  masterData: MasterDataState;
  onAddLog: (newLog: InspectionLog) => void;
  onDeleteLog: (id: string) => void;
}

export const PipeFittingView: React.FC<PipeFittingViewProps> = ({
  logs,
  masterData,
  onAddLog,
  onDeleteLog
}) => {
  const [showForm, setShowForm] = useState(false);
  const [filterCategory, setFilterCategory] = useState<'all' | 'pipe' | 'fitting'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // New Log Form State
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    month: 'أغسطس',
    category: 'pipe' as 'pipe' | 'fitting',
    productCode: '',
    productName: '',
    material: 'PPR',
    machineCode: '',
    inspectorName: masterData.inspectors[0]?.name || '',
    shiftName: masterData.shifts[0]?.name || '',
    sampleSize: 100,
    defectiveQty: 0,
    defectCode: '',
    defectName: '',
    cycleTime: 20,
    weightPerUnit: 0.25,
    materialBatch: 'BATCH-2026-01',
    status: 'مقبول (Pass)' as 'مقبول (Pass)' | 'مرفوض (Fail)' | 'مقبول بشروط (Conditional)',
    notes: ''
  });

  // Handle Product Select
  const handleProductChange = (code: string) => {
    if (formData.category === 'pipe') {
      const prod = masterData.pipes.find(p => p.code === code);
      if (prod) {
        setFormData(prev => ({ ...prev, productCode: code, productName: prod.name }));
      }
    } else {
      const prod = masterData.fittings.find(f => f.code === code);
      if (prod) {
        setFormData(prev => ({ ...prev, productCode: code, productName: prod.name, material: prod.material }));
      }
    }
  };

  // Handle Defect Select
  const handleDefectChange = (code: string) => {
    const defectList = formData.category === 'pipe' ? masterData.pipeDefects : masterData.fittingDefects;
    const defect = defectList.find(d => d.code === code);
    if (defect) {
      setFormData(prev => ({ ...prev, defectCode: code, defectName: defect.name }));
    }
  };

  // Auto Status & Reject Rate calculation
  const handleDefectiveQtyChange = (defQty: number) => {
    const rate = formData.sampleSize > 0 ? (defQty / formData.sampleSize) * 100 : 0;
    let autoStatus: 'مقبول (Pass)' | 'مرفوض (Fail)' | 'مقبول بشروط (Conditional)' = 'مقبول (Pass)';
    if (rate > 5) autoStatus = 'مرفوض (Fail)';
    else if (rate > 2) autoStatus = 'مقبول بشروط (Conditional)';

    setFormData(prev => ({
      ...prev,
      defectiveQty: defQty,
      status: autoStatus
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rejectRate = formData.sampleSize > 0 ? (formData.defectiveQty / formData.sampleSize) * 100 : 0;

    const newEntry: InspectionLog = {
      id: `LOG-${Date.now().toString().slice(-4)}`,
      date: formData.date,
      month: formData.month,
      category: formData.category,
      productCode: formData.productCode || 'N/A',
      productName: formData.productName || 'منتج غير محدد',
      material: formData.material,
      machineCode: formData.machineCode || '101',
      inspectorName: formData.inspectorName,
      shiftName: formData.shiftName,
      sampleSize: Number(formData.sampleSize),
      defectiveQty: Number(formData.defectiveQty),
      rejectRate: Number(rejectRate.toFixed(2)),
      defectCode: formData.defectCode || '1001',
      defectName: formData.defectName || 'لا يوجد عيب',
      status: formData.status,
      cycleTime: Number(formData.cycleTime),
      weightPerUnit: Number(formData.weightPerUnit),
      materialBatch: formData.materialBatch,
      notes: formData.notes
    };

    onAddLog(newEntry);
    setShowForm(false);
  };

  // Export CSV
  const handleExportCSV = () => {
    const csv = Papa.unparse(filteredLogs.map(l => ({
      'رقم السجل': l.id,
      'التاريخ': l.date,
      'الشهر': l.month || 'أغسطس',
      'القسم': l.category === 'pipe' ? 'أنبوب' : 'وصلة',
      'كود المنتج': l.productCode,
      'اسم المنتج': l.productName,
      'الخامة': l.material || 'PPR',
      'الماكينة': l.machineCode,
      'المفتش': l.inspectorName,
      'الوردية': l.shiftName,
      'حجم العينة': l.sampleSize,
      'المرفوضات': l.defectiveQty,
      'نسبة الرفض %': l.rejectRate,
      'كود العيب': l.defectCode,
      'اسم العيب': l.defectName,
      'حالة القبول': l.status,
      'ملاحظات': l.notes
    })));

    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `QualityOS_PipeFitting_Logs_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered Logs
  const filteredLogs = logs.filter(log => {
    const matchesCategory = filterCategory === 'all' || log.category === filterCategory;
    const matchesSearch = log.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          log.productCode.includes(searchQuery) ||
                          log.inspectorName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/10 backdrop-blur-xl p-5 rounded-2xl border border-white/10 shadow-xs">
        <div>
          <h2 className="text-lg font-black text-[#1B4F72] flex items-center gap-2">
            <span>الوحدة 1: جودة الأنابيب والوصلات</span>
            <span className="text-xs bg-sky-100 text-[#2874A6] px-2.5 py-0.5 rounded-full font-extrabold">
              54 عمود تفصيلي
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">تسجيل الفحوصات بقطاع الأنابيب (Extrusion) والوصلات (Injection)</p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 bg-[#E67E22] hover:bg-amber-700 text-white text-xs font-black rounded-xl transition-all shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{showForm ? 'إلغاء النموذج' : 'تسجيل فحص جديد'}</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-[#1B4F72] text-xs font-extrabold rounded-xl transition-all cursor-pointer border border-white/20"
          >
            <Download className="w-4 h-4" />
            <span>تصدير CSV</span>
          </button>
        </div>
      </div>

      {/* Entry Form Modal/Dropdown */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl border-2 border-[#2874A6] shadow-lg space-y-6 animate-fadeIn">
          <div className="border-b border-white/10 pb-3 flex items-center justify-between">
            <h3 className="font-extrabold text-[#1B4F72] text-sm">نموذج تسجيل فحص الجودة الموحد</h3>
            <span className="text-xs font-bold text-slate-400">قسم الأنابيب والوصلات</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-semibold">
            {/* Category */}
            <div>
              <label className="block text-slate-200 mb-1">القسم</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as 'pipe' | 'fitting', productCode: '' })}
                className="w-full p-2.5 bg-white/5 border border-white/20 rounded-xl font-bold"
              >
                <option value="pipe">بثق الأنابيب (Extrusion)</option>
                <option value="fitting">حقن الوصلات (Injection)</option>
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="block text-slate-200 mb-1">تاريخ الفحص</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full p-2.5 bg-white/5 border border-white/20 rounded-xl font-bold"
                required
              />
            </div>

            {/* Shift */}
            <div>
              <label className="block text-slate-200 mb-1">الوردية</label>
              <select
                value={formData.shiftName}
                onChange={(e) => setFormData({ ...formData, shiftName: e.target.value })}
                className="w-full p-2.5 bg-white/5 border border-white/20 rounded-xl font-bold"
              >
                {masterData.shifts.map(s => (
                  <option key={s.code} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>

            {/* Inspector */}
            <div>
              <label className="block text-slate-200 mb-1">فني الجودة / المفتش</label>
              <select
                value={formData.inspectorName}
                onChange={(e) => setFormData({ ...formData, inspectorName: e.target.value })}
                className="w-full p-2.5 bg-white/5 border border-white/20 rounded-xl font-bold"
              >
                {masterData.inspectors.map(ins => (
                  <option key={ins.id} value={ins.name}>{ins.name}</option>
                ))}
              </select>
            </div>

            {/* Product Selection */}
            <div>
              <label className="block text-slate-200 mb-1">اختيار المنتج (الكود)</label>
              <select
                value={formData.productCode}
                onChange={(e) => handleProductChange(e.target.value)}
                className="w-full p-2.5 bg-white/5 border border-white/20 rounded-xl font-bold"
                required
              >
                <option value="">-- اختر المنتج --</option>
                {formData.category === 'pipe' ? (
                  masterData.pipes.map(p => (
                    <option key={p.code} value={p.code}>[{p.code}] {p.name}</option>
                  ))
                ) : (
                  masterData.fittings.map(f => (
                    <option key={f.code} value={f.code}>[{f.code}] {f.name} ({f.material})</option>
                  ))
                )}
              </select>
            </div>

            {/* Machine */}
            <div>
              <label className="block text-slate-200 mb-1">رقم الماكينة / الخط</label>
              <select
                value={formData.machineCode}
                onChange={(e) => setFormData({ ...formData, machineCode: e.target.value })}
                className="w-full p-2.5 bg-white/5 border border-white/20 rounded-xl font-bold"
              >
                <option value="">-- اختر الماكينة --</option>
                {(formData.category === 'pipe' ? masterData.extrusionMachines : masterData.injectionMachines).map(m => (
                  <option key={m.id} value={m.code}>ماكينة رقم {m.code}</option>
                ))}
              </select>
            </div>

            {/* Sample Size */}
            <div>
              <label className="block text-slate-200 mb-1">حجم العينة المفحوصة (قطعة)</label>
              <input
                type="number"
                value={formData.sampleSize}
                onChange={(e) => setFormData({ ...formData, sampleSize: Number(e.target.value) })}
                className="w-full p-2.5 bg-white/5 border border-white/20 rounded-xl font-bold"
                min={1}
                required
              />
            </div>

            {/* Defective Quantity */}
            <div>
              <label className="block text-slate-200 mb-1">عدد المرفوضات (قطعة)</label>
              <input
                type="number"
                value={formData.defectiveQty}
                onChange={(e) => handleDefectiveQtyChange(Number(e.target.value))}
                className="w-full p-2.5 bg-white/5 border border-white/20 rounded-xl font-bold text-red-600"
                min={0}
                required
              />
            </div>

            {/* Defect Code */}
            <div>
              <label className="block text-slate-200 mb-1">نوع العيب المرصود</label>
              <select
                value={formData.defectCode}
                onChange={(e) => handleDefectChange(e.target.value)}
                className="w-full p-2.5 bg-white/5 border border-white/20 rounded-xl font-bold"
              >
                <option value="">-- اختر العيب --</option>
                {(formData.category === 'pipe' ? masterData.pipeDefects : masterData.fittingDefects).map(d => (
                  <option key={d.code} value={d.code}>[{d.code}] {d.name}</option>
                ))}
              </select>
            </div>

            {/* Auto Status */}
            <div>
              <label className="block text-slate-200 mb-1">النتيجة التلقائية</label>
              <input
                type="text"
                value={formData.status}
                readOnly
                className={`w-full p-2.5 border rounded-xl font-black text-center ${
                  formData.status.includes('Pass') ? 'bg-emerald-50 text-emerald-700 border-emerald-300' :
                  formData.status.includes('Fail') ? 'bg-red-50 text-red-700 border-red-300' :
                  'bg-amber-50 text-amber-700 border-amber-300'
                }`}
              />
            </div>

            {/* Notes */}
            <div className="sm:col-span-2 lg:col-span-2">
              <label className="block text-slate-200 mb-1">ملاحظات الفحص</label>
              <input
                type="text"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="أضف أي ملحوظة كالمواد الخام المستخدمة أو ظروف التشغيل..."
                className="w-full p-2.5 bg-white/5 border border-white/20 rounded-xl font-medium"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-slate-200 font-bold rounded-xl text-xs"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#27AE60] hover:bg-emerald-700 text-white font-black rounded-xl text-xs shadow-md"
            >
              حفظ سجل الفحص ➔
            </button>
          </div>
        </form>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white/10 backdrop-blur-xl p-4 rounded-2xl border border-white/10 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث باسم المنتج، الكود، أو الفني..."
            className="w-full pr-9 pl-3 py-2 bg-white/5 border border-white/20 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#2874A6]"
          />
        </div>

        {/* Filter Category */}
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-bold text-slate-400 whitespace-nowrap">التصفية:</span>
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-3 py-1.5 text-xs font-extrabold rounded-lg transition-all cursor-pointer ${
              filterCategory === 'all' ? 'bg-[#1B4F72] text-white' : 'bg-white/10 text-slate-300 hover:bg-white/20'
            }`}
          >
            الكل ({logs.length})
          </button>
          <button
            onClick={() => setFilterCategory('pipe')}
            className={`px-3 py-1.5 text-xs font-extrabold rounded-lg transition-all cursor-pointer ${
              filterCategory === 'pipe' ? 'bg-[#2874A6] text-white' : 'bg-white/10 text-slate-300 hover:bg-white/20'
            }`}
          >
            أنابيب ({logs.filter(l => l.category === 'pipe').length})
          </button>
          <button
            onClick={() => setFilterCategory('fitting')}
            className={`px-3 py-1.5 text-xs font-extrabold rounded-lg transition-all cursor-pointer ${
              filterCategory === 'fitting' ? 'bg-[#E67E22] text-white' : 'bg-white/10 text-slate-300 hover:bg-white/20'
            }`}
          >
            وصلات ({logs.filter(l => l.category === 'fitting').length})
          </button>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-[#1B4F72] text-white font-bold">
              <tr>
                <th className="p-3.5">الكود والسجل</th>
                <th className="p-3.5">المنتج والخامة</th>
                <th className="p-3.5">التاريخ والوردية</th>
                <th className="p-3.5">الماكينة والمفتش</th>
                <th className="p-3.5 text-center">العينة / الرفض</th>
                <th className="p-3.5">نسبة الرفض %</th>
                <th className="p-3.5">العيب المرصود</th>
                <th className="p-3.5 text-center">الحالة</th>
                <th className="p-3.5 text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-200">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-400 font-semibold">
                    لا توجد سجلات فحص مطابقة للبحث
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-3.5">
                      <span className="font-extrabold text-[#1B4F72] block">{log.id}</span>
                      <span className="text-[10px] text-slate-400">[{log.productCode}]</span>
                    </td>
                    <td className="p-3.5">
                      <div className="font-bold text-white">{log.productName}</div>
                      <span className="text-[10px] bg-white/10 text-slate-300 px-1.5 py-0.5 rounded font-semibold">
                        {log.category === 'pipe' ? 'أنبوب B' : `وصلة (${log.material || 'PPR'})`}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <div className="font-semibold text-white">{log.date}</div>
                      <span className="text-[10px] text-slate-400">{log.shiftName}</span>
                    </td>
                    <td className="p-3.5">
                      <div className="font-bold text-[#2874A6]">م {log.machineCode}</div>
                      <span className="text-[10px] text-slate-400">{log.inspectorName}</span>
                    </td>
                    <td className="p-3.5 text-center">
                      <span className="font-bold text-white">{log.sampleSize}</span> / <span className="font-bold text-red-600">{log.defectiveQty}</span>
                    </td>
                    <td className="p-3.5">
                      <span className={`font-black px-2 py-0.5 rounded-full text-[11px] ${
                        log.rejectRate > 5 ? 'bg-red-100 text-red-700' :
                        log.rejectRate > 2 ? 'bg-amber-100 text-amber-700' :
                        'bg-emerald-100 text-emerald-700'
                      }`}>
                        {log.rejectRate}%
                      </span>
                    </td>
                    <td className="p-3.5">
                      <div className="font-bold text-white">{log.defectName}</div>
                      <span className="text-[10px] text-slate-400">كود: {log.defectCode}</span>
                    </td>
                    <td className="p-3.5 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold inline-flex items-center gap-1 ${
                        log.status.includes('Pass') ? 'bg-emerald-100 text-emerald-800' :
                        log.status.includes('Fail') ? 'bg-red-100 text-red-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {log.status.includes('Pass') && <CheckCircle className="w-3 h-3" />}
                        {log.status.includes('Fail') && <XCircle className="w-3 h-3" />}
                        {log.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => onDeleteLog(log.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="حذف السجل"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
