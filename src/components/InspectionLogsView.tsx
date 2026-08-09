import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Search, 
  Download, 
  Filter, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle 
} from 'lucide-react';
import { InspectionLog } from '../types';
import Papa from 'papaparse';

interface InspectionLogsViewProps {
  logs: InspectionLog[];
  onDeleteLog: (id: string) => void;
}

export const InspectionLogsView: React.FC<InspectionLogsViewProps> = ({
  logs,
  onDeleteLog
}) => {
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredLogs = logs.filter(log => {
    const matchesCategory = filterCategory === 'all' || log.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'pass' && log.status.includes('Pass')) ||
      (filterStatus === 'fail' && log.status.includes('Fail')) ||
      (filterStatus === 'conditional' && log.status.includes('Conditional'));

    const matchesSearch = log.productName.toLowerCase().includes(search.toLowerCase()) ||
                          log.productCode.includes(search) ||
                          log.inspectorName.toLowerCase().includes(search.toLowerCase()) ||
                          log.defectName.toLowerCase().includes(search.toLowerCase()) ||
                          log.machineCode.includes(search);

    return matchesCategory && matchesStatus && matchesSearch;
  });

  const handleExportCSV = () => {
    const exportData = logs.map(l => ({
      'Log ID': l.id,
      'Date': l.date,
      'Category': l.category === 'pipe' ? 'Pipe (أنبوب)' : 'Fitting (وصلة)',
      'Product Code': l.productCode,
      'Product Name': l.productName,
      'Machine': l.machineCode,
      'Inspector': l.inspectorName,
      'Shift': l.shiftName,
      'Sample Size': l.sampleSize,
      'Defective Qty': l.defectiveQty,
      'Reject Rate %': `${l.rejectRate}%`,
      'Defect Code': l.defectCode,
      'Defect Name': l.defectName,
      'Status': l.status,
      'Notes': l.notes
    }));

    const csv = Papa.unparse(exportData);
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `qc_inspection_logs_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-amber-500" />
            <h2 className="text-xl font-bold text-slate-900">سجل القراءات والفحوصات اليومية (Inspection Logs)</h2>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            استعراض كافة نتائج الفحوصات المسجلة بالمصنع وتصدير التقرير اليومي/الشهري بملف Excel CSV.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>تصدير السجل بالكامل (CSV)</span>
        </button>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="بحث باسم المنتج، الكود، المفتش، رقم الماكينة، أو العيب..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-4 pr-10 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 text-xs font-medium bg-slate-50"
          >
            <option value="all">كافة الأقسام</option>
            <option value="pipe">الأنابيب فقط</option>
            <option value="fitting">الوصلات فقط</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 text-xs font-medium bg-slate-50"
          >
            <option value="all">كافة الحالات</option>
            <option value="pass">مقبول (Pass)</option>
            <option value="fail">مرفوض (Fail)</option>
            <option value="conditional">مقبول بشروط</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse text-sm">
            <thead>
              <tr className="bg-slate-900 text-white text-xs uppercase font-semibold">
                <th className="p-3.5 border-b border-slate-800">التاريخ</th>
                <th className="p-3.5 border-b border-slate-800">القسم</th>
                <th className="p-3.5 border-b border-slate-800">كود/اسم المنتج</th>
                <th className="p-3.5 border-b border-slate-800">الماكينة</th>
                <th className="p-3.5 border-b border-slate-800">المفتش</th>
                <th className="p-3.5 border-b border-slate-800">العينة/المعيب</th>
                <th className="p-3.5 border-b border-slate-800">نسبة الرفض</th>
                <th className="p-3.5 border-b border-slate-800">العيب الرئيسي</th>
                <th className="p-3.5 border-b border-slate-800">النتيجة</th>
                <th className="p-3.5 border-b border-slate-800 w-12">حذف</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 text-xs">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={10} className="p-8 text-center text-slate-400 font-medium">
                    لا توجد فحوصات مسجلة تطابق فلتر البحث
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3.5 font-mono text-slate-500 whitespace-nowrap">{log.date}</td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        log.category === 'pipe' ? 'bg-amber-100 text-amber-800' : 'bg-sky-100 text-sky-800'
                      }`}>
                        {log.category === 'pipe' ? 'أنابيب' : 'وصلات'}
                      </span>
                    </td>
                    <td className="p-3.5 font-medium">
                      <div className="font-mono font-bold text-slate-900">{log.productCode}</div>
                      <div className="text-[11px] text-slate-500 truncate max-w-[180px]">{log.productName}</div>
                    </td>
                    <td className="p-3.5 font-bold font-mono text-slate-800">{log.machineCode}</td>
                    <td className="p-3.5 font-medium text-slate-800">{log.inspectorName}</td>
                    <td className="p-3.5 font-mono">
                      <span className="font-bold text-slate-900">{log.defectiveQty}</span> / {log.sampleSize}
                    </td>
                    <td className="p-3.5 font-mono font-bold text-amber-700">
                      {log.rejectRate}%
                    </td>
                    <td className="p-3.5 text-slate-600">
                      {log.defectName} ({log.defectCode})
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1 w-fit ${
                        log.status.includes('Pass')
                          ? 'bg-emerald-100 text-emerald-800'
                          : log.status.includes('Fail')
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {log.status.includes('Pass') && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                        {log.status.includes('Fail') && <XCircle className="w-3 h-3 text-red-600" />}
                        {log.status.includes('Conditional') && <AlertTriangle className="w-3 h-3 text-amber-600" />}
                        {log.status}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <button
                        onClick={() => onDeleteLog(log.id)}
                        className="text-slate-300 hover:text-red-600 p-1 transition-colors cursor-pointer"
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
