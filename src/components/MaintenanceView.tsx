import React, { useState } from 'react';
import { PreventiveLog, BreakdownLog, MachineLife, MasterDataState } from '../types';
import { Wrench, AlertTriangle, Activity, Calendar, Clock, DollarSign, CheckCircle2, ShieldAlert } from 'lucide-react';

interface MaintenanceViewProps {
  preventiveLogs: PreventiveLog[];
  breakdownLogs: BreakdownLog[];
  machineLifeList: MachineLife[];
  masterData: MasterDataState;
  onAddBreakdown: (newBreakdown: BreakdownLog) => void;
}

export const MaintenanceView: React.FC<MaintenanceViewProps> = ({
  preventiveLogs,
  breakdownLogs,
  machineLifeList,
  masterData,
  onAddBreakdown
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'preventive' | 'breakdowns' | 'life'>('breakdowns');
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    month: 'أغسطس',
    machineCode: '202',
    description: '',
    rootCause: '',
    downtimeHours: 2.0,
    technicianName: masterData.technicians[0] || 'م. خالد الصيانة',
    shift: masterData.shifts[0]?.name || 'وردية AB',
    partsReplaced: '',
    costEGP: 1500,
    repairStatus: 'مكتمل (Fixed)' as 'مكتمل (Fixed)' | 'قيد الإصلاح (In Progress)' | 'في انتظار قطع غيار (Waiting Parts)',
    notes: ''
  });

  const handleSubmitBreakdown = (e: React.FormEvent) => {
    e.preventDefault();

    const newLog: BreakdownLog = {
      id: `BD-${Date.now().toString().slice(-4)}`,
      date: form.date,
      month: form.month,
      machineCode: form.machineCode,
      description: form.description,
      rootCause: form.rootCause,
      downtimeHours: Number(form.downtimeHours),
      technicianName: form.technicianName,
      shift: form.shift,
      partsReplaced: form.partsReplaced,
      costEGP: Number(form.costEGP),
      repairStatus: form.repairStatus,
      closeDate: form.repairStatus.includes('Fixed') ? form.date : undefined,
      notes: form.notes
    };

    onAddBreakdown(newLog);
    setShowForm(false);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/10 backdrop-blur-xl p-5 rounded-2xl border border-white/10 shadow-xs">
        <div>
          <h2 className="text-lg font-black text-[#1B4F72] flex items-center gap-2">
            <span>الوحدة 4: إدارة الصيانة الوقائية والأعطال وحياة الماكينات</span>
            <span className="text-xs bg-purple-100 text-purple-800 px-2.5 py-0.5 rounded-full font-extrabold">
              Maintenance OS
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">تتبع الخطط الوقائية، بلاغات الأعطال المفاجئة، وساعات العمر الافتراضي</p>
        </div>

        {/* Sub-tabs */}
        <div className="flex items-center gap-2 bg-white/10 p-1 rounded-xl">
          <button
            onClick={() => setActiveSubTab('breakdowns')}
            className={`px-3 py-1.5 text-xs font-black rounded-lg transition-all cursor-pointer ${
              activeSubTab === 'breakdowns' ? 'bg-[#1B4F72] text-white shadow-xs' : 'text-slate-300 hover:text-white'
            }`}
          >
            بلاغات الأعطال ({breakdownLogs.length})
          </button>
          <button
            onClick={() => setActiveSubTab('preventive')}
            className={`px-3 py-1.5 text-xs font-black rounded-lg transition-all cursor-pointer ${
              activeSubTab === 'preventive' ? 'bg-[#1B4F72] text-white shadow-xs' : 'text-slate-300 hover:text-white'
            }`}
          >
            الصيانة الوقائية ({preventiveLogs.length})
          </button>
          <button
            onClick={() => setActiveSubTab('life')}
            className={`px-3 py-1.5 text-xs font-black rounded-lg transition-all cursor-pointer ${
              activeSubTab === 'life' ? 'bg-[#1B4F72] text-white shadow-xs' : 'text-slate-300 hover:text-white'
            }`}
          >
            حياة الماكينات ({machineLifeList.length})
          </button>
        </div>
      </div>

      {/* Sub-tab 1: Breakdown Reports */}
      {activeSubTab === 'breakdowns' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-extrabold text-[#1B4F72] text-sm">سجل بلاغات الأعطال والتوقفات الفنية</h3>
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-4 py-2 bg-[#E74C3C] hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
            >
              {showForm ? 'إلغاء' : '+ تسجيل بلاغ عطل مفاجئ'}
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleSubmitBreakdown} className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl border-2 border-red-500 shadow-lg space-y-4">
              <h4 className="font-extrabold text-red-700 text-xs border-b border-white/10 pb-2">نموذج بلاغ عطل ميكانيكي / كهربائي</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-semibold">
                <div>
                  <label className="block text-slate-200 mb-1">تاريخ العطل</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full p-2.5 bg-white/5 border border-white/20 rounded-xl"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-200 mb-1">الماكينة المتوقفة</label>
                  <select
                    value={form.machineCode}
                    onChange={(e) => setForm({ ...form, machineCode: e.target.value })}
                    className="w-full p-2.5 bg-white/5 border border-white/20 rounded-xl font-bold"
                  >
                    {[...masterData.extrusionMachines, ...masterData.injectionMachines].map(m => (
                      <option key={m.id} value={m.code}>ماكينة رقم {m.code} ({m.type === 'extrusion' ? 'بثق' : 'حقن'})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-200 mb-1">وصف العطل</label>
                  <input
                    type="text"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="مثال: توقف الهيدروليك أو انكسار النوزل..."
                    className="w-full p-2.5 bg-white/5 border border-white/20 rounded-xl"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-200 mb-1">السبب الجذر الفعلي (Root Cause)</label>
                  <input
                    type="text"
                    value={form.rootCause}
                    onChange={(e) => setForm({ ...form, rootCause: e.target.value })}
                    placeholder="سبب العطل من الفحص..."
                    className="w-full p-2.5 bg-white/5 border border-white/20 rounded-xl"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-200 mb-1">زمن التوقف Downtime (ساعة)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={form.downtimeHours}
                    onChange={(e) => setForm({ ...form, downtimeHours: Number(e.target.value) })}
                    className="w-full p-2.5 bg-white/5 border border-white/20 rounded-xl font-bold text-red-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-200 mb-1">قطع الغيار المستبدلة</label>
                  <input
                    type="text"
                    value={form.partsReplaced}
                    onChange={(e) => setForm({ ...form, partsReplaced: e.target.value })}
                    placeholder="أو اكتب: لا يوجد"
                    className="w-full p-2.5 bg-white/5 border border-white/20 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-slate-200 mb-1">تكلفة الإصلاح (جنيه EGP)</label>
                  <input
                    type="number"
                    value={form.costEGP}
                    onChange={(e) => setForm({ ...form, costEGP: Number(e.target.value) })}
                    className="w-full p-2.5 bg-white/5 border border-white/20 rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-200 mb-1">حالة الإصلاح</label>
                  <select
                    value={form.repairStatus}
                    onChange={(e) => setForm({ ...form, repairStatus: e.target.value as any })}
                    className="w-full p-2.5 bg-white/5 border border-white/20 rounded-xl font-bold"
                  >
                    <option value="مكتمل (Fixed)">مكتمل وتم التشغيل</option>
                    <option value="قيد الإصلاح (In Progress)">قيد الإصلاح</option>
                    <option value="في انتظار قطع غيار (Waiting Parts)">في انتظار قطع غيار</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="submit"
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-black text-xs rounded-xl shadow-md"
                >
                  حفظ بلاغ العطل ➔
                </button>
              </div>
            </form>
          )}

          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 shadow-xs overflow-hidden">
            <table className="w-full text-right text-xs">
              <thead className="bg-[#1B4F72] text-white font-bold">
                <tr>
                  <th className="p-3.5">الكود والماكينة</th>
                  <th className="p-3.5">التاريخ والوردية</th>
                  <th className="p-3.5">وصف العطل والسبب الجذر</th>
                  <th className="p-3.5 text-center">زمن التوقف</th>
                  <th className="p-3.5 text-center">قطع الغيار والتكلفة</th>
                  <th className="p-3.5 text-center">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {breakdownLogs.map((b) => (
                  <tr key={b.id} className="hover:bg-white/5">
                    <td className="p-3.5 font-extrabold text-[#1B4F72]">
                      ماكينة {b.machineCode}
                      <span className="block text-[10px] text-slate-400">{b.id}</span>
                    </td>
                    <td className="p-3.5">
                      <div>{b.date}</div>
                      <span className="text-[10px] text-slate-400">{b.shift}</span>
                    </td>
                    <td className="p-3.5">
                      <div className="font-bold text-white">{b.description}</div>
                      <span className="text-[10px] text-red-600">السبب: {b.rootCause}</span>
                    </td>
                    <td className="p-3.5 text-center font-black text-red-600">{b.downtimeHours} ساعة</td>
                    <td className="p-3.5 text-center">
                      <div className="font-semibold text-white">{b.partsReplaced || 'لا يوجد'}</div>
                      <span className="text-[10px] font-bold text-emerald-700">{b.costEGP} EGP</span>
                    </td>
                    <td className="p-3.5 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold ${
                        b.repairStatus.includes('Fixed') ? 'bg-emerald-100 text-emerald-800' :
                        b.repairStatus.includes('In Progress') ? 'bg-amber-100 text-amber-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {b.repairStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sub-tab 2: Preventive Maintenance */}
      {activeSubTab === 'preventive' && (
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 shadow-xs overflow-hidden p-5 space-y-4">
          <h3 className="font-extrabold text-[#1B4F72] text-sm">خطط وسجلات الصيانة الوقائية (Preventive Maintenance)</h3>
          <table className="w-full text-right text-xs">
            <thead className="bg-[#1B4F72] text-white font-bold">
              <tr>
                <th className="p-3.5">الماكينة</th>
                <th className="p-3.5">نوع الصيانة</th>
                <th className="p-3.5">الوصف والإجراء</th>
                <th className="p-3.5">الفني المسؤول</th>
                <th className="p-3.5 text-center">التاريخ القادم</th>
                <th className="p-3.5 text-center">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {preventiveLogs.map((p) => (
                <tr key={p.id} className="hover:bg-white/5">
                  <td className="p-3.5 font-bold text-[#1B4F72]">ماكينة {p.machineCode}</td>
                  <td className="p-3.5 font-bold text-purple-700">{p.maintType}</td>
                  <td className="p-3.5">{p.description}</td>
                  <td className="p-3.5">{p.technicianName}</td>
                  <td className="p-3.5 text-center font-bold">{p.nextDueDate}</td>
                  <td className="p-3.5 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-black ${
                      p.status.includes('Completed') ? 'bg-emerald-100 text-emerald-800' :
                      p.status.includes('Overdue') ? 'bg-red-100 text-red-800' :
                      'bg-sky-100 text-sky-800'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Sub-tab 3: Machine Life Analysis */}
      {activeSubTab === 'life' && (
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 shadow-xs p-5 space-y-4">
          <h3 className="font-extrabold text-[#1B4F72] text-sm">تقييم العمر الافتراضي والهلاك للماكينات</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {machineLifeList.map((m) => (
              <div key={m.machineCode} className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="font-black text-[#1B4F72] text-sm">{m.machineName}</span>
                  <span className={`px-2 py-0.5 text-[10px] font-black rounded-full ${
                    m.currentStatus === 'ممتازة' ? 'bg-emerald-100 text-emerald-800' :
                    m.currentStatus === 'تحتاج صيانة' ? 'bg-amber-100 text-amber-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {m.currentStatus}
                  </span>
                </div>
                <div className="text-xs space-y-1 font-semibold text-slate-300">
                  <div className="flex justify-between"><span>ساعات التشغيل الكلية:</span> <b>{m.totalOperatingHours} ساعة</b></div>
                  <div className="flex justify-between"><span>إجمالي الأعطال:</span> <b className="text-red-600">{m.totalBreakdowns} عطل</b></div>
                  <div className="flex justify-between"><span>تكلفة الصيانة التراكمية:</span> <b className="text-emerald-700">{m.totalMaintCostEGP} EGP</b></div>
                </div>
                <div>
                  <div className="flex justify-between text-[11px] font-bold text-slate-200 mb-1">
                    <span>الكفاءة المتبقية:</span>
                    <span>{m.efficiencyRemainingPct}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${m.efficiencyRemainingPct > 70 ? 'bg-emerald-500' : m.efficiencyRemainingPct > 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                      style={{ width: `${m.efficiencyRemainingPct}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
