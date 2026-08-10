import React, { useState } from 'react';
import { InjectionLog, MasterDataState } from '../types';
import { Flame, Plus, Clock, TrendingUp, CheckCircle2, AlertOctagon } from 'lucide-react';

interface InjectionProductionViewProps {
  injectionLogs: InjectionLog[];
  masterData: MasterDataState;
  onAddLog: (newLog: InjectionLog) => void;
}

export const InjectionProductionView: React.FC<InjectionProductionViewProps> = ({
  injectionLogs,
  masterData,
  onAddLog
}) => {
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    month: 'أغسطس',
    shift: masterData.shifts[0]?.name || 'وردية AB',
    machineCode: masterData.injectionMachines[0]?.code || '201',
    operatorName: masterData.operators[0] || 'علي عبد الله',
    productCode: '17042',
    productName: 'Welding Elbow 90° 20mm (PPR)',
    cycleTime: 22,
    goodQty: 1000,
    rejectQty: 20,
    materialUsedKg: 75.0,
    masterbatchUsedKg: 1.5,
    downtimeHours: 0.5,
    downtimeReason: 'فحص جودة دوري وتنظيف قالب الحقن',
    scrapWeightKg: 1.0,
    runnerWeightKg: 2.5,
    flashWeightKg: 0.3,
    notes: ''
  });

  // Calculations
  const totalProduced = form.goodQty + form.rejectQty;
  const rejectPct = totalProduced > 0 ? Number(((form.rejectQty / totalProduced) * 100).toFixed(2)) : 0;
  const efficiencyPct = Number((100 - (form.downtimeHours / 8) * 100 - rejectPct).toFixed(1));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newLog: InjectionLog = {
      id: `INJ-${Date.now().toString().slice(-4)}`,
      date: form.date,
      month: form.month,
      shift: form.shift,
      machineCode: form.machineCode,
      operatorName: form.operatorName,
      productCode: form.productCode,
      productName: form.productName,
      cycleTime: Number(form.cycleTime),
      goodQty: Number(form.goodQty),
      rejectQty: Number(form.rejectQty),
      rejectPct: rejectPct,
      materialUsedKg: Number(form.materialUsedKg),
      masterbatchUsedKg: Number(form.masterbatchUsedKg),
      efficiencyPct: efficiencyPct > 0 ? efficiencyPct : 70,
      downtimeHours: Number(form.downtimeHours),
      downtimeReason: form.downtimeReason,
      scrapWeightKg: Number(form.scrapWeightKg),
      runnerWeightKg: Number(form.runnerWeightKg),
      flashWeightKg: Number(form.flashWeightKg),
      notes: form.notes
    };

    onAddLog(newLog);
    setShowForm(false);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/10 backdrop-blur-xl p-5 rounded-2xl border border-white/10 shadow-xs">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <span>الوحدة 3: مراقبة إنتاج ومعدلات حقن الوصلات (Injection)</span>
            <span className="text-xs bg-orange-100 text-[#E67E22] px-2.5 py-0.5 rounded-full font-extrabold">
              25 عمود تحليلي
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">زمن الدورة (Cycle Time)، استهلاك الخامات، الأعطال والهالك السائل/الصلب</p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#E67E22] hover:bg-amber-700 text-white text-xs font-black rounded-xl transition-all shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{showForm ? 'إلغاء النموذج' : 'تسجيل إنتاج وردية حقن'}</span>
        </button>
      </div>

      {/* Entry Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl border-2 border-[#E67E22] shadow-lg space-y-6">
          <div className="border-b border-white/10 pb-3 flex items-center justify-between">
            <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-400" />
              <span>تسجيل متابعة وردية إنتاج ماكينة الحقن</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-semibold">
            <div>
              <label className="block text-slate-200 mb-1">التاريخ</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full p-2.5 bg-white/5 border border-white/20 rounded-xl font-bold text-white placeholder-white/50"
                required
              />
            </div>

            <div>
              <label className="block text-slate-200 mb-1">الوردية</label>
              <select
                value={form.shift}
                onChange={(e) => setForm({ ...form, shift: e.target.value })}
                className="w-full p-2.5 bg-white/5 border border-white/20 rounded-xl font-bold text-white placeholder-white/50"
              >
                {masterData.shifts.map(s => <option key={s.code} value={s.name}>{s.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-slate-200 mb-1">رقم الماكينة</label>
              <select
                value={form.machineCode}
                onChange={(e) => setForm({ ...form, machineCode: e.target.value })}
                className="w-full p-2.5 bg-white/5 border border-white/20 rounded-xl font-bold text-white placeholder-white/50"
              >
                {masterData.injectionMachines.map(m => (
                  <option key={m.id} value={m.code}>ماكينة رقم {m.code}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-200 mb-1">اسم المشغل / الفني</label>
              <select
                value={form.operatorName}
                onChange={(e) => setForm({ ...form, operatorName: e.target.value })}
                className="w-full p-2.5 bg-white/5 border border-white/20 rounded-xl font-bold text-white placeholder-white/50"
              >
                {masterData.operators.map(op => <option key={op} value={op}>{op}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-slate-200 mb-1">زمن الدورة Cycle Time (ثانية)</label>
              <input
                type="number"
                value={form.cycleTime}
                onChange={(e) => setForm({ ...form, cycleTime: Number(e.target.value) })}
                className="w-full p-2.5 bg-white/5 border border-white/20 rounded-xl font-bold text-white placeholder-white/50"
                required
              />
            </div>

            <div>
              <label className="block text-slate-200 mb-1">الإنتاج السليم Good Qty (قطعة)</label>
              <input
                type="number"
                value={form.goodQty}
                onChange={(e) => setForm({ ...form, goodQty: Number(e.target.value) })}
                className="w-full p-2.5 bg-white/5 border border-white/20 rounded-xl font-bold text-emerald-700 text-white placeholder-white/50"
                required
              />
            </div>

            <div>
              <label className="block text-slate-200 mb-1">المرفوضات Reject Qty (قطعة)</label>
              <input
                type="number"
                value={form.rejectQty}
                onChange={(e) => setForm({ ...form, rejectQty: Number(e.target.value) })}
                className="w-full p-2.5 bg-white/5 border border-white/20 rounded-xl font-bold text-red-600 text-white placeholder-white/50"
                required
              />
            </div>

            <div>
              <label className="block text-slate-200 mb-1">استهلاك الخام الكلي (kg)</label>
              <input
                type="number"
                value={form.materialUsedKg}
                onChange={(e) => setForm({ ...form, materialUsedKg: Number(e.target.value) })}
                className="w-full p-2.5 bg-white/5 border border-white/20 rounded-xl font-bold text-white placeholder-white/50"
                required
              />
            </div>

            <div>
              <label className="block text-slate-200 mb-1">أوقات التوقف Downtime (ساعة)</label>
              <input
                type="number"
                step="0.1"
                value={form.downtimeHours}
                onChange={(e) => setForm({ ...form, downtimeHours: Number(e.target.value) })}
                className="w-full p-2.5 bg-white/5 border border-white/20 rounded-xl font-bold text-amber-700 text-white placeholder-white/50"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-200 mb-1">سبب التوقف الرئيسي</label>
              <input
                type="text"
                value={form.downtimeReason}
                onChange={(e) => setForm({ ...form, downtimeReason: e.target.value })}
                className="w-full p-2.5 bg-white/5 border border-white/20 rounded-xl font-medium text-white placeholder-white/50"
              />
            </div>

            <div className="bg-white/5 p-3 rounded-xl border border-white/10 flex flex-col justify-center text-center">
              <span className="text-[10px] text-slate-400 font-bold">كفاءة التشغيل OEE</span>
              <span className="text-lg font-black text-orange-400">{efficiencyPct}%</span>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-5 py-2.5 bg-white/10 text-slate-200 font-bold rounded-xl text-xs"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#E67E22] text-white font-black rounded-xl text-xs shadow-md hover:bg-amber-700"
            >
              حفظ بيانات وردية الحقن ➔
            </button>
          </div>
        </form>
      )}

      {/* Table */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-[#1B4F72] text-white font-bold">
              <tr>
                <th className="p-3.5">الماكينة</th>
                <th className="p-3.5">التاريخ والوردية</th>
                <th className="p-3.5">المشغل والمنتج</th>
                <th className="p-3.5 text-center">زمن الدورة</th>
                <th className="p-3.5 text-center">الإنتاج (سليم / مرفوض)</th>
                <th className="p-3.5 text-center">نسبة الرفض</th>
                <th className="p-3.5 text-center">التوقف وسببه</th>
                <th className="p-3.5 text-center">الكفاءة OEE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {injectionLogs.map((log) => (
                <tr key={log.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-3.5 font-extrabold text-orange-400">
                    ماكينة {log.machineCode}
                    <span className="block text-[10px] text-slate-400">{log.id}</span>
                  </td>
                  <td className="p-3.5">
                    <div>{log.date}</div>
                    <span className="text-[10px] text-slate-400">{log.shift}</span>
                  </td>
                  <td className="p-3.5">
                    <div className="font-bold text-white">{log.productName}</div>
                    <span className="text-[10px] text-slate-400">فني: {log.operatorName}</span>
                  </td>
                  <td className="p-3.5 text-center font-bold text-white">{log.cycleTime} ثانية</td>
                  <td className="p-3.5 text-center font-bold">
                    <span className="text-emerald-700">{log.goodQty}</span> / <span className="text-red-600">{log.rejectQty}</span>
                  </td>
                  <td className="p-3.5 text-center font-black text-red-600">{log.rejectPct}%</td>
                  <td className="p-3.5 text-center">
                    <div className="font-bold text-amber-700">{log.downtimeHours} ساعة</div>
                    <span className="text-[10px] text-slate-400">{log.downtimeReason}</span>
                  </td>
                  <td className="p-3.5 text-center">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-emerald-100 text-emerald-800">
                      {log.efficiencyPct}%
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
