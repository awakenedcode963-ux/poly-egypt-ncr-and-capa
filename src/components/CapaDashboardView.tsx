import React from 'react';
import { CAPARequest } from '../types';
import { PoloEgyptLogo } from './PoloEgyptLogo';
import { 
  BarChart3, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  PieChart as PieIcon, 
  HelpCircle, 
  TrendingUp, 
  ShieldCheck, 
  Activity,
  Layers,
  Sparkles
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell, 
  PieChart, 
  Pie, 
  Legend 
} from 'recharts';

interface CapaDashboardViewProps {
  capaRequests: CAPARequest[];
  onNavigateToRecords: () => void;
  onNavigateToWhys: () => void;
}

export const CapaDashboardView: React.FC<CapaDashboardViewProps> = ({
  capaRequests,
  onNavigateToRecords,
  onNavigateToWhys
}) => {
  // Metrics Calculation
  const totalCount = capaRequests.length;
  const openCount = capaRequests.filter(c => c.status.includes('Open')).length;
  const inProgressCount = capaRequests.filter(c => c.status.includes('Progress')).length;
  const closedCount = capaRequests.filter(c => c.status.includes('Done') || c.status.includes('Closed')).length;
  const criticalCount = capaRequests.filter(c => c.priority.includes('Critical') || c.priority.includes('حرج')).length;
  const effectiveCount = capaRequests.filter(c => c.effectivenessEval.includes('Effective') || c.effectivenessEval.includes('فعال')).length;

  const closureRate = totalCount > 0 ? Math.round((closedCount / totalCount) * 100) : 0;
  const effectivenessRate = closedCount > 0 ? Math.round((effectiveCount / closedCount) * 100) : 100;

  // Recharts Data: Distribution by Department
  const deptMap: Record<string, number> = {};
  capaRequests.forEach(c => {
    const dept = c.targetDepartment.replace('قسم ', '');
    deptMap[dept] = (deptMap[dept] || 0) + 1;
  });

  const deptData = Object.keys(deptMap).map(d => ({
    name: d,
    count: deptMap[d]
  }));

  // Recharts Data: Priority Distribution
  const priorityMap: Record<string, number> = {
    'حرج (Critical)': 0,
    'عالي (High)': 0,
    'متوسط (Medium)': 0,
    'منخفض (Low)': 0
  };

  capaRequests.forEach(c => {
    if (c.priority.includes('حرج')) priorityMap['حرج (Critical)']++;
    else if (c.priority.includes('عالي')) priorityMap['عالي (High)']++;
    else if (c.priority.includes('متوسط')) priorityMap['متوسط (Medium)']++;
    else priorityMap['منخفض (Low)']++;
  });

  const priorityData = Object.keys(priorityMap)
    .filter(k => priorityMap[k] > 0)
    .map(k => ({
      name: k.split(' ')[0],
      value: priorityMap[k]
    }));

  const PRIORITY_COLORS = ['#E74C3C', '#E67E22', '#F1C40F', '#3498DB'];
  const DEPT_COLORS = ['#0B3A60', '#C0A46F', '#27AE60', '#8E44AD', '#2980B9'];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 dir-rtl font-sans">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#0B3A60] via-[#092B48] to-[#1E4E79] text-white p-6 rounded-2xl shadow-xl border border-sky-900/40 space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <PoloEgyptLogo variant="horizontal" size="md" lightMode={true} />
          
          <div className="flex items-center gap-2">
            <span className="bg-[#C0A46F] text-white font-black text-xs px-3.5 py-1.5 rounded-full shadow-sm flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>نظام منفصل معتمد ISO 9001</span>
            </span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-black text-white flex flex-wrap items-center gap-2">
              <span>لوحة تحليلات ومؤشرات أداء عدم المطابقة والـ CAPA</span>
            </h2>
            <p className="text-xs text-slate-200 mt-1 max-w-2xl leading-relaxed">
              تحليل مباشر لطلبات عدم المطابقة (NCR)، مؤشرات سرعة الإغلاق، معدل فاعلية الإجراءات الوقائية، وتوزيع المسببات الجذرية لشركة <b>بولو إيجيبت</b>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0 w-full sm:w-auto">
            <button
              onClick={onNavigateToRecords}
              className="px-4 py-2.5 bg-[#E74C3C] hover:bg-red-700 text-white font-black text-xs rounded-xl transition-all shadow-md cursor-pointer"
            >
              + إضافة / عرض سجل البلاغات
            </button>
            <button
              onClick={onNavigateToWhys}
              className="px-4 py-2.5 bg-[#C0A46F] hover:bg-amber-600 text-white font-black text-xs rounded-xl transition-all shadow-md cursor-pointer"
            >
              استوديو 5 Whys
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total NCRs */}
        <div className="bg-white/10 backdrop-blur-xl p-5 rounded-2xl border border-white/10 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400">إجمالي طلبات NCR / CAPA</span>
            <div className="text-2xl font-black text-white">{totalCount} طلب</div>
            <span className="text-[11px] text-slate-400 font-semibold">{criticalCount} بلاغ بدرجة حرجة</span>
          </div>
          <div className="p-3 bg-sky-50 text-[#0B3A60] rounded-2xl border border-sky-100">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        {/* In Progress */}
        <div className="bg-white/10 backdrop-blur-xl p-5 rounded-2xl border border-white/10 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400">قيد التحليل والتنفيذ</span>
            <div className="text-2xl font-black text-orange-400">{openCount + inProgressCount} طلب</div>
            <span className="text-[11px] text-amber-600 font-bold">{openCount} مفتوح / {inProgressCount} قيد المتابعة</span>
          </div>
          <div className="p-3 bg-amber-50 text-[#E67E22] rounded-2xl border border-amber-100">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Closure Rate */}
        <div className="bg-white/10 backdrop-blur-xl p-5 rounded-2xl border border-white/10 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400">نسبة الإغلاق والتنفيذ</span>
            <div className="text-2xl font-black text-emerald-600">{closureRate}%</div>
            <span className="text-[11px] text-emerald-700 font-bold">{closedCount} طلب مغلق بنجاح</span>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Effectiveness Rate */}
        <div className="bg-white/10 backdrop-blur-xl p-5 rounded-2xl border border-white/10 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400">فاعلية الإجراء الوقائي</span>
            <div className="text-2xl font-black text-amber-400">{effectivenessRate}%</div>
            <span className="text-[11px] text-slate-400 font-semibold">استناداً إلى تقييمات ISO</span>
          </div>
          <div className="p-3 bg-amber-50 text-[#C0A46F] rounded-2xl border border-amber-100">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dept Bar Chart */}
        <div className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-white" />
              <h3 className="font-extrabold text-sm text-white">توزيع عدم المطابقة حسب الأقسام</h3>
            </div>
            <span className="text-xs text-slate-400 font-bold">بولو إيجيبت</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                <XAxis dataKey="name" tick={{ fontSize: 11, fontWeight: 'bold', fill: '#E2E8F0' }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#E2E8F0' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0B3A60', color: '#fff', borderRadius: '12px', fontSize: '12px' }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {deptData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={DEPT_COLORS[index % DEPT_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Priority Pie Chart */}
        <div className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <PieIcon className="w-5 h-5 text-[#E74C3C]" />
              <h3 className="font-extrabold text-sm text-white">تصنيف الطلبات حسب درجة الأولوية</h3>
            </div>
            <span className="text-xs text-slate-400 font-bold">حرج / عالي / متوسط</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {priorityData.map((_, index) => (
                    <Cell key={`cell-p-${index}`} fill={PRIORITY_COLORS[index % PRIORITY_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0B3A60', color: '#fff', borderRadius: '12px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 'bold', color: '#E2E8F0' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Latest CAPAs Table Summary */}
      <div className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-white" />
            <h3 className="font-extrabold text-sm text-white">آخر طلبات عدم المطابقة المفتوحة</h3>
          </div>
          <button
            onClick={onNavigateToRecords}
            className="text-xs font-bold text-sky-200 hover:text-white underline"
          >
            عرض الكل ➔
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-right">
            <thead>
              <tr className="bg-white/5 text-slate-300 border-b border-white/10">
                <th className="p-3">رقم الطلب</th>
                <th className="p-3">تاريخ البلاغ</th>
                <th className="p-3">الموضوع / العيب</th>
                <th className="p-3">القسم المعني</th>
                <th className="p-3">الأولوية</th>
                <th className="p-3">السبب الجذر (Root Cause)</th>
                <th className="p-3">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-semibold">
              {capaRequests.slice(0, 5).map((capa) => (
                <tr key={capa.id} className="hover:bg-white/5/80">
                  <td className="p-3 font-black text-white">{capa.capaNo}</td>
                  <td className="p-3 text-slate-400">{capa.date}</td>
                  <td className="p-3 text-white font-bold max-w-xs truncate">{capa.subject}</td>
                  <td className="p-3 text-slate-200">{capa.targetDepartment}</td>
                  <td className="p-3">
                    <span className={`whitespace-nowrap px-2 py-0.5 rounded-full text-[10px] font-black ${
                      capa.priority.includes('حرج') ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {capa.priority}
                    </span>
                  </td>
                  <td className="p-3 text-slate-300 max-w-xs truncate">{capa.rootCause}</td>
                  <td className="p-3">
                    <span className={`whitespace-nowrap px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      capa.status.includes('Done') || capa.status.includes('مغلق')
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {capa.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
