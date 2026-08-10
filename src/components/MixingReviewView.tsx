import React, { useState } from 'react';
import { MixingLog, MasterDataState } from '../types';
import { FlaskConical, Plus, CheckCircle, AlertTriangle, XCircle, Calculator, Info } from 'lucide-react';

interface MixingReviewViewProps {
  mixingLogs: MixingLog[];
  masterData: MasterDataState;
  onAddLog: (newLog: MixingLog) => void;
}

export const MixingReviewView: React.FC<MixingReviewViewProps> = ({
  mixingLogs,
  masterData,
  onAddLog
}) => {
  const [showForm, setShowForm] = useState(false);

  // Standards for 1 Mix batch (e.g. UPVC Standard = 293.2kg total)
  const STANDARDS = {
    pvc: 200.0,
    stabilizer: 4.5,
    calcium: 75.0,
    wax: 1.2,
    pigment: 0.5,
    modifier: 8.0,
    lubricant: 4.0,
    total: 293.2
  };

  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    month: 'أغسطس',
    shift: masterData.shifts[0]?.name || 'وردية AB',
    supervisor: masterData.supervisors[0] || 'م. أحمد علي',
    observer: 'محمود سامي',
    batchNo: `B26-${Date.now().toString().slice(-4)}`,
    totalBatches: 10,
    pvcActualKg: 200.0,
    stabilizerActualKg: 4.5,
    calciumActualKg: 75.0,
    waxActualKg: 1.2,
    pigmentActualKg: 0.5,
    modifierActualKg: 8.0,
    lubricantActualKg: 4.0,
    notes: ''
  });

  // Calculate live totals and deviations
  const currentTotalKg = Number((
    form.pvcActualKg +
    form.stabilizerActualKg +
    form.calciumActualKg +
    form.waxActualKg +
    form.pigmentActualKg +
    form.modifierActualKg +
    form.lubricantActualKg
  ).toFixed(2));

  const deviationKg = Number((currentTotalKg - STANDARDS.total).toFixed(2));
  const deviationPct = Number(((Math.abs(deviationKg) / STANDARDS.total) * 100).toFixed(2));

  let status: 'OK' | 'Warning' | 'Reject' = 'OK';
  if (deviationPct > 3) status = 'Reject';
  else if (deviationPct > 1) status = 'Warning';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newLog: MixingLog = {
      id: `MIX-${Date.now().toString().slice(-4)}`,
      date: form.date,
      month: form.month,
      shift: form.shift,
      supervisor: form.supervisor,
      observer: form.observer,
      batchNo: form.batchNo,
      totalBatches: Number(form.totalBatches),
      pvcActualKg: Number(form.pvcActualKg),
      stabilizerActualKg: Number(form.stabilizerActualKg),
      calciumActualKg: Number(form.calciumActualKg),
      waxActualKg: Number(form.waxActualKg),
      pigmentActualKg: Number(form.pigmentActualKg),
      modifierActualKg: Number(form.modifierActualKg),
      lubricantActualKg: Number(form.lubricantActualKg),
      totalActualKg: currentTotalKg,
      deviationKg: deviationKg,
      deviationPct: deviationPct,
      status: status,
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
            <span>الوحدة 2: مراجعة تركيبة الخلطات الجافة (Mixing Review)</span>
            <span className="text-xs bg-emerald-100 text-[#27AE60] px-2.5 py-0.5 rounded-full font-extrabold">
              7 مكونات خامات
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">مقارنة أوزان المكونات بالمعيار واحتساب انحراف التركيبة تلقائياً</p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#27AE60] hover:bg-emerald-700 text-white text-xs font-black rounded-xl transition-all shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{showForm ? 'إلغاء النموذج' : 'تسجيل مراجعة خلطة جديدة'}</span>
        </button>
      </div>

      {/* Formulas Standard Card */}
      <div className="bg-[#1B4F72] text-white p-5 rounded-2xl shadow-md border border-[#2874A6] grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 text-center">
        <div className="p-2 bg-white/10 rounded-xl">
          <span className="text-[10px] text-slate-300 block">راتنج PVC</span>
          <span className="font-extrabold text-sm">{STANDARDS.pvc} kg</span>
        </div>
        <div className="p-2 bg-white/10 rounded-xl">
          <span className="text-[10px] text-slate-300 block">مثبت حراري</span>
          <span className="font-extrabold text-sm">{STANDARDS.stabilizer} kg</span>
        </div>
        <div className="p-2 bg-white/10 rounded-xl">
          <span className="text-[10px] text-slate-300 block">كربونات كالسيوم</span>
          <span className="font-extrabold text-sm">{STANDARDS.calcium} kg</span>
        </div>
        <div className="p-2 bg-white/10 rounded-xl">
          <span className="text-[10px] text-slate-300 block">شمع PE Wax</span>
          <span className="font-extrabold text-sm">{STANDARDS.wax} kg</span>
        </div>
        <div className="p-2 bg-white/10 rounded-xl">
          <span className="text-[10px] text-slate-300 block">صبغة Titanium</span>
          <span className="font-extrabold text-sm">{STANDARDS.pigment} kg</span>
        </div>
        <div className="p-2 bg-white/10 rounded-xl">
          <span className="text-[10px] text-slate-300 block">محسن صدمات</span>
          <span className="font-extrabold text-sm">{STANDARDS.modifier} kg</span>
        </div>
        <div className="p-2 bg-white/10 rounded-xl">
          <span className="text-[10px] text-slate-300 block">مزلق خارجي</span>
          <span className="font-extrabold text-sm">{STANDARDS.lubricant} kg</span>
        </div>
        <div className="p-2 bg-[#E67E22] rounded-xl text-white font-extrabold">
          <span className="text-[10px] block opacity-90">المعيار الموحد</span>
          <span className="text-sm">{STANDARDS.total} kg</span>
        </div>
      </div>

      {/* New Mixing Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl border-2 border-[#27AE60] shadow-lg space-y-6">
          <div className="border-b border-white/10 pb-3 flex items-center justify-between">
            <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
              <Calculator className="w-5 h-5 text-emerald-400" />
              <span>نموذج فحص ومراجعة أوزان الخلطة الجافة</span>
            </h3>
            <span className="text-xs font-bold text-slate-400">قائمة المكونات الـ 7</span>
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
              <label className="block text-slate-200 mb-1">مشرف الخلطة</label>
              <select
                value={form.supervisor}
                onChange={(e) => setForm({ ...form, supervisor: e.target.value })}
                className="w-full p-2.5 bg-white/5 border border-white/20 rounded-xl font-bold text-white placeholder-white/50"
              >
                {masterData.supervisors.map(sup => <option key={sup} value={sup}>{sup}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-slate-200 mb-1">رقم الوجبة / التشغيلة (Batch No)</label>
              <input
                type="text"
                value={form.batchNo}
                onChange={(e) => setForm({ ...form, batchNo: e.target.value })}
                className="w-full p-2.5 bg-white/5 border border-white/20 rounded-xl font-bold text-white placeholder-white/50"
                required
              />
            </div>

            {/* Component Inputs */}
            <div>
              <label className="block text-slate-200 mb-1">1. PVC Resin (kg)</label>
              <input
                type="number"
                step="0.1"
                value={form.pvcActualKg}
                onChange={(e) => setForm({ ...form, pvcActualKg: Number(e.target.value) })}
                className="w-full p-2.5 bg-white/5 border border-white/20 rounded-xl font-bold text-white placeholder-white/50"
                required
              />
            </div>

            <div>
              <label className="block text-slate-200 mb-1">2. Stabilizer (kg)</label>
              <input
                type="number"
                step="0.1"
                value={form.stabilizerActualKg}
                onChange={(e) => setForm({ ...form, stabilizerActualKg: Number(e.target.value) })}
                className="w-full p-2.5 bg-white/5 border border-white/20 rounded-xl font-bold text-white placeholder-white/50"
                required
              />
            </div>

            <div>
              <label className="block text-slate-200 mb-1">3. Calcium Carbonate (kg)</label>
              <input
                type="number"
                step="0.1"
                value={form.calciumActualKg}
                onChange={(e) => setForm({ ...form, calciumActualKg: Number(e.target.value) })}
                className="w-full p-2.5 bg-white/5 border border-white/20 rounded-xl font-bold text-white placeholder-white/50"
                required
              />
            </div>

            <div>
              <label className="block text-slate-200 mb-1">4. PE Wax (kg)</label>
              <input
                type="number"
                step="0.1"
                value={form.waxActualKg}
                onChange={(e) => setForm({ ...form, waxActualKg: Number(e.target.value) })}
                className="w-full p-2.5 bg-white/5 border border-white/20 rounded-xl font-bold text-white placeholder-white/50"
                required
              />
            </div>

            <div>
              <label className="block text-slate-200 mb-1">5. Pigment TiO2 (kg)</label>
              <input
                type="number"
                step="0.1"
                value={form.pigmentActualKg}
                onChange={(e) => setForm({ ...form, pigmentActualKg: Number(e.target.value) })}
                className="w-full p-2.5 bg-white/5 border border-white/20 rounded-xl font-bold text-white placeholder-white/50"
                required
              />
            </div>

            <div>
              <label className="block text-slate-200 mb-1">6. Acrylic Modifier (kg)</label>
              <input
                type="number"
                step="0.1"
                value={form.modifierActualKg}
                onChange={(e) => setForm({ ...form, modifierActualKg: Number(e.target.value) })}
                className="w-full p-2.5 bg-white/5 border border-white/20 rounded-xl font-bold text-white placeholder-white/50"
                required
              />
            </div>

            <div>
              <label className="block text-slate-200 mb-1">7. Internal Lubricant (kg)</label>
              <input
                type="number"
                step="0.1"
                value={form.lubricantActualKg}
                onChange={(e) => setForm({ ...form, lubricantActualKg: Number(e.target.value) })}
                className="w-full p-2.5 bg-white/5 border border-white/20 rounded-xl font-bold text-white placeholder-white/50"
                required
              />
            </div>

            {/* Calculated Result Badge */}
            <div className="bg-white/5 p-3 rounded-2xl border border-white/10 flex flex-col justify-center text-center">
              <span className="text-[11px] text-slate-400 font-bold block">إجمالي الوزن الفعلي والنتيجة</span>
              <div className="text-lg font-black text-white">{currentTotalKg} kg</div>
              <div className={`text-xs font-extrabold mt-1 ${
                status === 'OK' ? 'text-emerald-600' : status === 'Warning' ? 'text-amber-600' : 'text-red-600'
              }`}>
                الانحراف: {deviationKg > 0 ? `+${deviationKg}` : deviationKg} kg ({deviationPct}%)
              </div>
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
              className="px-6 py-2.5 bg-[#27AE60] text-white font-black rounded-xl text-xs shadow-md hover:bg-emerald-700"
            >
              اعتماد فحص الخلطة ➔
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
                <th className="p-3.5">رقم الخلطة</th>
                <th className="p-3.5">التاريخ والوردية</th>
                <th className="p-3.5">المشرف والرقيب</th>
                <th className="p-3.5 text-center">PVC (kg)</th>
                <th className="p-3.5 text-center">الكالسيت (kg)</th>
                <th className="p-3.5 text-center">المكونات الأُخرى</th>
                <th className="p-3.5 text-center">الوزن الفعلي</th>
                <th className="p-3.5 text-center">نسبة الانحراف</th>
                <th className="p-3.5 text-center">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {mixingLogs.map((log) => (
                <tr key={log.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-3.5 font-extrabold text-white">
                    {log.batchNo}
                    <span className="block text-[10px] text-slate-400">{log.id}</span>
                  </td>
                  <td className="p-3.5">
                    <div>{log.date}</div>
                    <span className="text-[10px] text-slate-400">{log.shift}</span>
                  </td>
                  <td className="p-3.5">
                    <div className="font-bold text-white">{log.supervisor}</div>
                    <span className="text-[10px] text-slate-400">{log.observer}</span>
                  </td>
                  <td className="p-3.5 text-center font-bold text-white">{log.pvcActualKg}</td>
                  <td className="p-3.5 text-center font-bold text-white">{log.calciumActualKg}</td>
                  <td className="p-3.5 text-center text-[11px] text-slate-300">
                    مستقر: {log.stabilizerActualKg} | شمع: {log.waxActualKg}
                  </td>
                  <td className="p-3.5 text-center font-black text-white">{log.totalActualKg} kg</td>
                  <td className="p-3.5 text-center">
                    <span className={`font-bold ${log.deviationPct > 3 ? 'text-red-600' : 'text-emerald-600'}`}>
                      {log.deviationKg > 0 ? `+${log.deviationKg}` : log.deviationKg} kg ({log.deviationPct}%)
                    </span>
                  </td>
                  <td className="p-3.5 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold inline-flex items-center gap-1 ${
                      log.status === 'OK' ? 'bg-emerald-100 text-emerald-800' :
                      log.status === 'Warning' ? 'bg-amber-100 text-amber-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {log.status === 'OK' && <CheckCircle className="w-3 h-3" />}
                      {log.status === 'Warning' && <AlertTriangle className="w-3 h-3" />}
                      {log.status === 'Reject' && <XCircle className="w-3 h-3" />}
                      {log.status === 'OK' ? 'مطابق' : log.status === 'Warning' ? 'إنذار انحراف' : 'مرفوض'}
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
