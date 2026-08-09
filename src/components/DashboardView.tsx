import React, { useState } from 'react';
import { 
  InspectionLog, 
  MixingLog, 
  InjectionLog, 
  PreventiveLog, 
  BreakdownLog, 
  CAPARequest 
} from '../types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend,
  AreaChart,
  Area
} from 'recharts';
import { 
  Pipette, 
  FlaskConical, 
  Flame, 
  Wrench, 
  AlertTriangle, 
  TrendingUp, 
  CheckCircle2, 
  AlertOctagon, 
  Clock, 
  Zap,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

interface DashboardViewProps {
  logs: InspectionLog[];
  mixingLogs: MixingLog[];
  injectionLogs: InjectionLog[];
  preventiveLogs: PreventiveLog[];
  breakdownLogs: BreakdownLog[];
  capaRequests: CAPARequest[];
  setActiveTab: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  logs,
  mixingLogs,
  injectionLogs,
  preventiveLogs,
  breakdownLogs,
  capaRequests,
  setActiveTab
}) => {
  // KPI Calculations
  const totalSamples = logs.reduce((acc, log) => acc + log.sampleSize, 0);
  const totalDefective = logs.reduce((acc, log) => acc + log.defectiveQty, 0);
  const overallRejectRate = totalSamples > 0 ? ((totalDefective / totalSamples) * 100).toFixed(1) : '0';

  const totalBatches = mixingLogs.reduce((acc, log) => acc + log.totalBatches, 0);
  const rejectedBatches = mixingLogs.filter(m => m.status === 'Reject').length;
  const mixingQualityRate = mixingLogs.length > 0 ? (((mixingLogs.length - rejectedBatches) / mixingLogs.length) * 100).toFixed(1) : '100';

  const avgInjectionEff = injectionLogs.length > 0
    ? (injectionLogs.reduce((acc, i) => acc + i.efficiencyPct, 0) / injectionLogs.length).toFixed(1)
    : '90';

  const totalDowntimeHours = breakdownLogs.reduce((acc, b) => acc + b.downtimeHours, 0);
  const overdueMaintenance = preventiveLogs.filter(p => p.status.includes('Overdue') || p.status.includes('متأخرة')).length;

  const openCapas = capaRequests.filter(c => c.status.includes('Open') || c.status.includes('In Progress') || c.status.includes('مفتوح') || c.status.includes('تنفيذ')).length;
  const criticalCapas = capaRequests.filter(c => c.priority.includes('Critical') || c.priority.includes('حرج')).length;

  // Chart 1: Defect Distribution Pareto Data
  const defectCounts: Record<string, number> = {};
  logs.forEach(l => {
    if (l.defectiveQty > 0) {
      defectCounts[l.defectName] = (defectCounts[l.defectName] || 0) + l.defectiveQty;
    }
  });

  const defectChartData = Object.keys(defectCounts)
    .map(name => ({ name, count: defectCounts[name] }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  // Chart 2: CAPA Status Distribution
  const capaByPriority = [
    { name: 'حرج (Critical)', value: capaRequests.filter(c => c.priority.includes('حرج') || c.priority.includes('Critical')).length, color: '#E74C3C' },
    { name: 'عالي (High)', value: capaRequests.filter(c => c.priority.includes('عالي') || c.priority.includes('High')).length, color: '#E67E22' },
    { name: 'متوسط (Medium)', value: capaRequests.filter(c => c.priority.includes('متوسط') || c.priority.includes('Medium')).length, color: '#F39C12' },
    { name: 'منخفض (Low)', value: capaRequests.filter(c => c.priority.includes('منخفض') || c.priority.includes('Low')).length, color: '#27AE60' }
  ];

  // Chart 3: Production & Reject Trend Simulation/Actual
  const trendData = [
    { day: 'السبت', rejectPct: 2.1, efficiency: 95 },
    { day: 'الأحد', rejectPct: 3.4, efficiency: 91 },
    { day: 'الإثنين', rejectPct: 1.8, efficiency: 96 },
    { day: 'الثلاثاء', rejectPct: 4.2, efficiency: 88 },
    { day: 'الأربعاء', rejectPct: 2.5, efficiency: 94 },
    { day: 'الخميس', rejectPct: 1.9, efficiency: 97 }
  ];

  return (
    <div className="space-[#1B4F72] p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Top Banner Alert */}
      <div className="bg-[#1B4F72] text-white rounded-2xl p-6 shadow-md border border-[#2874A6] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-[#E67E22] rounded-xl font-bold text-white shadow-inner">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white">نظام إدارة الجودة الذكي - QualityOS Premium</h2>
            <p className="text-xs text-slate-200 mt-1">
              مراقبة آنية لمصانع الأنابيب، الوصلات، خلطات UPVC/PPR، إنتاج الحقن، وأعطال الصيانة
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('guide')}
          className="px-5 py-2.5 bg-[#27AE60] hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer whitespace-nowrap shrink-0"
        >
          تحميل الشيت الموحد ودليل الربط ➔
        </button>
      </div>

      {/* KPI Grid - 5 Modules Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Module 1: Pipe & Fitting */}
        <div 
          onClick={() => setActiveTab('pipe-fitting')}
          className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 shadow-sm border border-white/10 hover:border-[#2874A6] transition-all cursor-pointer group hover:shadow-md"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400">1️⃣ الأنابيب والوصلات</span>
            <div className="p-2 bg-sky-100 text-[#1B4F72] rounded-xl group-hover:scale-110 transition-transform">
              <Pipette className="w-5 h-5 text-[#2874A6]" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#1B4F72]">{overallRejectRate}%</div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-amber-600 mt-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>معدل الرفض الكلي</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-2 border-t border-white/10 pt-1.5">
            إجمالي العينات: {totalSamples} عينة
          </div>
        </div>

        {/* Module 2: Mixing */}
        <div 
          onClick={() => setActiveTab('mixing')}
          className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 shadow-sm border border-white/10 hover:border-[#27AE60] transition-all cursor-pointer group hover:shadow-md"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400">2️⃣ جودة الخلطات</span>
            <div className="p-2 bg-emerald-100 text-[#27AE60] rounded-xl group-hover:scale-110 transition-transform">
              <FlaskConical className="w-5 h-5 text-[#27AE60]" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#27AE60]">{mixingQualityRate}%</div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 mt-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>مطابقة الأوزان المسموحة</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-2 border-t border-white/10 pt-1.5">
            الخلطات المفحوصة: {mixingLogs.length} خلطة
          </div>
        </div>

        {/* Module 3: Injection */}
        <div 
          onClick={() => setActiveTab('injection')}
          className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 shadow-sm border border-white/10 hover:border-[#E67E22] transition-all cursor-pointer group hover:shadow-md"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400">3️⃣ إنتاج الحقن</span>
            <div className="p-2 bg-orange-100 text-[#E67E22] rounded-xl group-hover:scale-110 transition-transform">
              <Flame className="w-5 h-5 text-[#E67E22]" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#E67E22]">{avgInjectionEff}%</div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-orange-600 mt-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>كفاءة التشغيل OEE</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-2 border-t border-white/10 pt-1.5">
            السجلات: {injectionLogs.length} ورديات
          </div>
        </div>

        {/* Module 4: Maintenance */}
        <div 
          onClick={() => setActiveTab('maintenance')}
          className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 shadow-sm border border-white/10 hover:border-[#E74C3C] transition-all cursor-pointer group hover:shadow-md"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400">4️⃣ أوقات التوقف</span>
            <div className="p-2 bg-purple-100 text-purple-700 rounded-xl group-hover:scale-110 transition-transform">
              <Wrench className="w-5 h-5 text-purple-700" />
            </div>
          </div>
          <div className="text-2xl font-black text-purple-900">{totalDowntimeHours} <span className="text-xs font-bold text-slate-400">ساعة</span></div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-red-600 mt-1">
            <Clock className="w-3.5 h-3.5" />
            <span>تأخير صيانة: {overdueMaintenance}</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-2 border-t border-white/10 pt-1.5">
            بلاغات الأعطال: {breakdownLogs.length}
          </div>
        </div>

        {/* Module 5: CAPA */}
        <div 
          onClick={() => setActiveTab('capa')}
          className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 shadow-sm border border-white/10 hover:border-red-500 transition-all cursor-pointer group hover:shadow-md"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400">5️⃣ طلبات CAPA</span>
            <div className="p-2 bg-red-100 text-[#E74C3C] rounded-xl group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-5 h-5 text-[#E74C3C]" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#E74C3C]">{openCapas} <span className="text-xs font-bold text-slate-400">مفتوح</span></div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-red-600 mt-1">
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>طلبات حرجة: {criticalCapas}</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-2 border-t border-white/10 pt-1.5">
            إجمالي CAPA: {capaRequests.length} طلب
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pareto Defects Bar Chart */}
        <div className="lg:col-span-2 bg-white/10 backdrop-blur-xl rounded-2xl p-5 shadow-sm border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-[#1B4F72] text-sm">تحليل العيوب الشائعة (Pareto Defects Chart)</h3>
              <p className="text-xs text-slate-400">أكثر العيوب تكراراً بالمصنع لحلها جذرياً</p>
            </div>
            <span className="text-xs font-bold bg-[#1B4F72]/10 text-[#1B4F72] px-2.5 py-1 rounded-lg">
              الأنابيب والوصلات
            </span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={defectChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#475569' }} />
                <YAxis tick={{ fontSize: 11, fill: '#475569' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1B4F72', borderRadius: '12px', color: '#fff', fontSize: '12px', border: 'none' }} 
                  formatter={(val: any) => [`${val} قطعة مرفوضة`, 'الكمية']}
                />
                <Bar dataKey="count" fill="#E67E22" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CAPA Priority Donut Chart */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-5 shadow-sm border border-white/10 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-[#1B4F72] text-sm mb-1">أولويات طلبات CAPA</h3>
            <p className="text-xs text-slate-400 mb-4">تصنيف طلبات الفعل التصحيحي حسب الأهمية</p>

            <div className="h-52 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={capaByPriority}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {capaByPriority.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val: any) => [`${val} طلبات`, 'العدد']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Custom Legend */}
          <div className="grid grid-cols-2 gap-2 border-t border-white/10 pt-3">
            {capaByPriority.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="truncate">{item.name}: <b>{item.value}</b></span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Production Trend Area Chart */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-5 shadow-sm border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-[#1B4F72] text-sm">معدل الرفض ومؤشر الكفاءة الأسبوعي</h3>
            <p className="text-xs text-slate-400">تتبع استقرار جودة الإنتاج وكفاءة التشغيل اليومية</p>
          </div>
        </div>

        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748B' }} />
              <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#2C3E50', borderRadius: '10px', color: '#fff', fontSize: '12px' }}
              />
              <Area type="monotone" dataKey="efficiency" name="كفاءة التشغيل %" stroke="#27AE60" fill="#27AE60" fillOpacity={0.15} />
              <Area type="monotone" dataKey="rejectPct" name="نسبة المرفوضات %" stroke="#E74C3C" fill="#E74C3C" fillOpacity={0.2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
