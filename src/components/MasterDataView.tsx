import React, { useState } from 'react';
import { 
  Database, 
  Search, 
  Plus, 
  Download, 
  Edit2, 
  Trash2, 
  Check, 
  X,
  Factory,
  Layers,
  Users,
  Wrench,
  Clock,
  Calendar
} from 'lucide-react';
import { MasterDataState, PipeProduct, FittingProduct, Inspector, DefectCode, Machine } from '../types';
import Papa from 'papaparse';

interface MasterDataViewProps {
  masterData: MasterDataState;
  onUpdateMasterData: (newData: MasterDataState) => void;
}

export const MasterDataView: React.FC<MasterDataViewProps> = ({
  masterData,
  onUpdateMasterData
}) => {
  const [subTab, setSubTab] = useState<'pipes' | 'fittings' | 'pipe_defects' | 'fitting_defects' | 'inspectors' | 'machines'>('pipes');
  const [search, setSearch] = useState('');

  // New item modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItemCode, setNewItemCode] = useState('');
  const [newItemName, setNewItemName] = useState('');
  const [newItemMaterial, setNewItemMaterial] = useState('PPR');
  const [newItemType, setNewItemType] = useState<'extrusion' | 'injection'>('extrusion');

  // Edit item state
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editCode, setEditCode] = useState('');
  const [editName, setEditName] = useState('');
  const [editMaterial, setEditMaterial] = useState('');

  // Handle Add New Item
  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName) return;

    const updated = { ...masterData };

    if (subTab === 'pipes') {
      updated.pipes.push({ code: newItemCode || `${Date.now()}`, name: newItemName });
    } else if (subTab === 'fittings') {
      updated.fittings.push({ code: newItemCode || `${Date.now()}`, name: newItemName, material: newItemMaterial });
    } else if (subTab === 'pipe_defects') {
      updated.pipeDefects.push({ code: newItemCode || `${Date.now()}`, name: newItemName, type: 'pipe' });
    } else if (subTab === 'fitting_defects') {
      updated.fittingDefects.push({ code: newItemCode || `${Date.now()}`, name: newItemName, type: 'fitting' });
    } else if (subTab === 'inspectors') {
      updated.inspectors.push({ id: `${updated.inspectors.length + 1}`, name: newItemName });
    } else if (subTab === 'machines') {
      if (newItemType === 'extrusion') {
        updated.extrusionMachines.push({ id: `${updated.extrusionMachines.length + 1}`, code: newItemCode, type: 'extrusion' });
      } else {
        updated.injectionMachines.push({ id: `${updated.injectionMachines.length + 1}`, code: newItemCode, type: 'injection' });
      }
    }

    onUpdateMasterData(updated);
    setShowAddModal(false);
    setNewItemCode('');
    setNewItemName('');
  };

  // Handle Delete
  const handleDeleteItem = (index: number) => {
    if (!confirm('هل أنت تأكد من حذف هذا العنصر من البيانات الأساسية؟')) return;
    const updated = { ...masterData };
    if (subTab === 'pipes') updated.pipes.splice(index, 1);
    if (subTab === 'fittings') updated.fittings.splice(index, 1);
    if (subTab === 'pipe_defects') updated.pipeDefects.splice(index, 1);
    if (subTab === 'fitting_defects') updated.fittingDefects.splice(index, 1);
    if (subTab === 'inspectors') updated.inspectors.splice(index, 1);
    onUpdateMasterData(updated);
  };

  // Handle Export CSV
  const handleExportCSV = () => {
    let exportArray: any[] = [];
    let filename = `master_data_${subTab}.csv`;

    if (subTab === 'pipes') {
      exportArray = masterData.pipes.map(p => ({ 'Pipe Code': p.code, 'Product Name': p.name }));
    } else if (subTab === 'fittings') {
      exportArray = masterData.fittings.map(f => ({ 'Fitting Code': f.code, 'Product Name': f.name, 'Material': f.material }));
    } else if (subTab === 'pipe_defects') {
      exportArray = masterData.pipeDefects.map(d => ({ 'Defect Code': d.code, 'Defect Name': d.name }));
    } else if (subTab === 'fitting_defects') {
      exportArray = masterData.fittingDefects.map(d => ({ 'Defect Code': d.code, 'Defect Name': d.name }));
    } else if (subTab === 'inspectors') {
      exportArray = masterData.inspectors.map(i => ({ 'No.': i.id, 'Inspector Name': i.name }));
    } else if (subTab === 'machines') {
      exportArray = [
        ...masterData.extrusionMachines.map(m => ({ 'Machine Code': m.code, 'Category': 'Extrusion (سحب)' })),
        ...masterData.injectionMachines.map(m => ({ 'Machine Code': m.code, 'Category': 'Injection (حقن)' }))
      ];
    }

    const csv = Papa.unparse(exportArray);
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Database className="w-6 h-6 text-amber-500" />
            <h2 className="text-xl font-bold text-slate-900">إدارة البيانات الأساسية (Master Data)</h2>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            عرض وتحديث جداول منتجات الأنابيب، الوصلات، أكواد العيوب، المفتشين، والماكينات.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة صنف جديد</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs shadow-sm transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>تصدير CSV للجدول الحالى</span>
          </button>
        </div>
      </div>

      {/* Sub tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200">
        <button
          onClick={() => setSubTab('pipes')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            subTab === 'pipes' ? 'bg-slate-900 text-white shadow' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Factory className="w-4 h-4 text-amber-400" />
          <span>الأنابيب ({masterData.pipes.length})</span>
        </button>

        <button
          onClick={() => setSubTab('fittings')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            subTab === 'fittings' ? 'bg-slate-900 text-white shadow' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Layers className="w-4 h-4 text-amber-400" />
          <span>الوصلات ({masterData.fittings.length})</span>
        </button>

        <button
          onClick={() => setSubTab('pipe_defects')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            subTab === 'pipe_defects' ? 'bg-slate-900 text-white shadow' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <span>عيوب الأنابيب ({masterData.pipeDefects.length})</span>
        </button>

        <button
          onClick={() => setSubTab('fitting_defects')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            subTab === 'fitting_defects' ? 'bg-slate-900 text-white shadow' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <span>عيوب الوصلات ({masterData.fittingDefects.length})</span>
        </button>

        <button
          onClick={() => setSubTab('inspectors')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            subTab === 'inspectors' ? 'bg-slate-900 text-white shadow' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4 text-amber-400" />
          <span>المفتشين ({masterData.inspectors.length})</span>
        </button>

        <button
          onClick={() => setSubTab('machines')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            subTab === 'machines' ? 'bg-slate-900 text-white shadow' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Wrench className="w-4 h-4 text-amber-400" />
          <span>الماكينات (حقن/سحب)</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="بحث بالاسم أو الكود..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20"
        />
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse text-sm">
            <thead>
              <tr className="bg-slate-900 text-white text-xs uppercase font-semibold">
                <th className="p-3.5 border-b border-slate-800">#</th>
                {subTab !== 'inspectors' && subTab !== 'machines' && <th className="p-3.5 border-b border-slate-800">الكود</th>}
                <th className="p-3.5 border-b border-slate-800">الاسم / المسمى</th>
                {subTab === 'fittings' && <th className="p-3.5 border-b border-slate-800">الخامة (Material)</th>}
                {subTab === 'machines' && <th className="p-3.5 border-b border-slate-800">النوع</th>}
                <th className="p-3.5 border-b border-slate-800 w-24">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {subTab === 'pipes' && masterData.pipes
                .filter(p => p.code.includes(search) || p.name.toLowerCase().includes(search.toLowerCase()))
                .map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3.5 text-slate-400 text-xs">{idx + 1}</td>
                    <td className="p-3.5 font-mono font-bold text-amber-700">{item.code}</td>
                    <td className="p-3.5 font-medium">{item.name}</td>
                    <td className="p-3.5">
                      <button onClick={() => handleDeleteItem(idx)} className="text-red-500 hover:text-red-700 p-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}

              {subTab === 'fittings' && masterData.fittings
                .filter(f => f.code.includes(search) || f.name.toLowerCase().includes(search.toLowerCase()))
                .map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3.5 text-slate-400 text-xs">{idx + 1}</td>
                    <td className="p-3.5 font-mono font-bold text-amber-700">{item.code}</td>
                    <td className="p-3.5 font-medium">{item.name}</td>
                    <td className="p-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        item.material === 'PPR' ? 'bg-emerald-100 text-emerald-800' : 'bg-sky-100 text-sky-800'
                      }`}>
                        {item.material}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <button onClick={() => handleDeleteItem(idx)} className="text-red-500 hover:text-red-700 p-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}

              {subTab === 'pipe_defects' && masterData.pipeDefects
                .filter(d => d.code.includes(search) || d.name.toLowerCase().includes(search.toLowerCase()))
                .map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3.5 text-slate-400 text-xs">{idx + 1}</td>
                    <td className="p-3.5 font-mono font-bold text-amber-700">{item.code}</td>
                    <td className="p-3.5 font-medium">{item.name}</td>
                    <td className="p-3.5">
                      <button onClick={() => handleDeleteItem(idx)} className="text-red-500 hover:text-red-700 p-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}

              {subTab === 'fitting_defects' && masterData.fittingDefects
                .filter(d => d.code.includes(search) || d.name.toLowerCase().includes(search.toLowerCase()))
                .map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3.5 text-slate-400 text-xs">{idx + 1}</td>
                    <td className="p-3.5 font-mono font-bold text-amber-700">{item.code}</td>
                    <td className="p-3.5 font-medium">{item.name}</td>
                    <td className="p-3.5">
                      <button onClick={() => handleDeleteItem(idx)} className="text-red-500 hover:text-red-700 p-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}

              {subTab === 'inspectors' && masterData.inspectors
                .filter(i => i.name.toLowerCase().includes(search.toLowerCase()))
                .map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3.5 text-slate-400 text-xs">{item.id}</td>
                    <td className="p-3.5 font-bold text-slate-800">{item.name}</td>
                    <td className="p-3.5">
                      <button onClick={() => handleDeleteItem(idx)} className="text-red-500 hover:text-red-700 p-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}

              {subTab === 'machines' && [
                ...masterData.extrusionMachines.map(m => ({ ...m, categoryName: 'سحب (Extrusion)' })),
                ...masterData.injectionMachines.map(m => ({ ...m, categoryName: 'حقن (Injection)' }))
              ].map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3.5 text-slate-400 text-xs">{idx + 1}</td>
                  <td className="p-3.5 font-mono font-bold text-amber-700">{item.code}</td>
                  <td className="p-3.5">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                      {item.categoryName}
                    </span>
                  </td>
                  <td className="p-3.5">-</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-lg text-slate-900">إضافة عنصر جديد لـ {subTab}</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddItem} className="space-y-4">
              {subTab !== 'inspectors' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">كود الصنف / العيب:</label>
                  <input
                    type="text"
                    required
                    placeholder="مثلاً: 16050 أو 1121"
                    value={newItemCode}
                    onChange={(e) => setNewItemCode(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">الاسم / المسمى بالعربي أو الإنجليزي:</label>
                <input
                  type="text"
                  required
                  placeholder="مثلاً: Pipe 160mm PN20"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-amber-500/20"
                />
              </div>

              {subTab === 'fittings' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">الخامة (Material):</label>
                  <select
                    value={newItemMaterial}
                    onChange={(e) => setNewItemMaterial(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm bg-slate-50"
                  >
                    <option value="PPR">PPR</option>
                    <option value="UPVC">UPVC</option>
                  </select>
                </div>
              )}

              {subTab === 'machines' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">نوع الماكينة:</label>
                  <select
                    value={newItemType}
                    onChange={(e) => setNewItemType(e.target.value as any)}
                    className="w-full px-3 py-2 border rounded-lg text-sm bg-slate-50"
                  >
                    <option value="extrusion">ماكينة سحب (Extrusion)</option>
                    <option value="injection">ماكينة حقن (Injection)</option>
                  </select>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg border text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold"
                >
                  حفظ الصنف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
