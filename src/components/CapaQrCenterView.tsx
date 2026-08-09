import React, { useState } from 'react';
import { CAPARequest } from '../types';
import { PoloEgyptLogo } from './PoloEgyptLogo';
import { QRCodeSVG } from 'qrcode.react';
import { 
  QrCode, 
  Printer, 
  ShieldAlert, 
  Download, 
  Share2, 
  Check, 
  Search, 
  AlertTriangle,
  Smartphone,
  Tag
} from 'lucide-react';

interface CapaQrCenterViewProps {
  capaRequests: CAPARequest[];
}

export const CapaQrCenterView: React.FC<CapaQrCenterViewProps> = ({ capaRequests }) => {
  const [selectedCapaId, setSelectedCapaId] = useState<string>(capaRequests[0]?.id || '');
  const [copied, setCopied] = useState(false);

  // Custom QR tag form state if generating on the fly
  const [customLot, setCustomLot] = useState('LOT-PPR-2026-99');
  const [customProduct, setCustomProduct] = useState('كوع PPR 20mm (إعادة فحص)');
  const [customReason, setCustomReason] = useState('حجز مؤقت لحين ظهور نتيجة اختبار الضغط المائي');

  const selectedCapa = capaRequests.find(c => c.id === selectedCapaId);

  const qrPayload = selectedCapa
    ? JSON.stringify({
        capaNo: selectedCapa.capaNo,
        date: selectedCapa.date,
        subject: selectedCapa.subject,
        status: selectedCapa.status,
        product: selectedCapa.productName || 'غير محدد',
        priority: selectedCapa.priority,
        company: 'POLO EGYPT S.A.E'
      })
    : JSON.stringify({
        lot: customLot,
        product: customProduct,
        reason: customReason,
        company: 'POLO EGYPT S.A.E'
      });

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(qrPayload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 dir-rtl font-sans">
      {/* Banner */}
      <div className="bg-[#0B3A60] text-white p-6 rounded-2xl shadow-xl border border-sky-900 space-y-3">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <PoloEgyptLogo variant="horizontal" size="md" lightMode={true} />
          
          <div className="flex items-center gap-2">
            <span className="bg-[#C4A052] text-slate-950 font-black text-xs px-3.5 py-1.5 rounded-full">
              بطاقات فحص الموبايل والـ Hold Tags
            </span>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <span>مركز بطاقات QR Code والمسح الميداني بصالة الإنتاج</span>
          </h2>
          <p className="text-xs text-slate-200 mt-1 max-w-2xl leading-relaxed">
            طباعة بطاقات حجز الشحنات غير المطابقة (Reject / Quality Hold Tags) والملصقات المزامنة مع الموبايل لفنيي ومفتشي خطوط البثق والحقن بالمصنع.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Selector / Controls */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
            <Tag className="w-5 h-5 text-[#0B3A60]" />
            <h3 className="font-extrabold text-sm text-[#0B3A60]">اختر طلب عدم المطابقة للطباعة</h3>
          </div>

          <div className="space-y-3 text-xs">
            <label className="block text-slate-700 font-bold">قائمة طلبات CAPA المسجلة:</label>
            <select
              value={selectedCapaId}
              onChange={(e) => setSelectedCapaId(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-800"
            >
              {capaRequests.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.capaNo} - {c.subject.slice(0, 35)}...
                </option>
              ))}
            </select>
          </div>

          <div className="border-t border-slate-100 pt-4 space-y-3 text-xs">
            <span className="font-extrabold text-[#0B3A60] block">أو إنشاء ملصق حجز جودة سريع (Custom Tag):</span>
            
            <div>
              <label className="block text-slate-600 mb-1 font-semibold">رقم اللوط / التشغيلة:</label>
              <input
                type="text"
                value={customLot}
                onChange={(e) => setCustomLot(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-800"
              />
            </div>

            <div>
              <label className="block text-slate-600 mb-1 font-semibold">اسم الصنف / المنتج:</label>
              <input
                type="text"
                value={customProduct}
                onChange={(e) => setCustomProduct(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-800"
              />
            </div>

            <div>
              <label className="block text-slate-600 mb-1 font-semibold">سبب الحجز / عدم المطابقة:</label>
              <textarea
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                rows={2}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-800"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={handlePrint}
              className="w-full flex items-center justify-center gap-2 p-3 bg-[#0B3A60] hover:bg-sky-900 text-white font-black text-xs rounded-xl shadow-md cursor-pointer transition-all"
            >
              <Printer className="w-4 h-4 text-[#C4A052]" />
              <span>طباعة بطاقة الحجز المعتمدة (Print Tag)</span>
            </button>
          </div>
        </div>

        {/* Right Column: Printable Badge Preview */}
        <div className="lg:col-span-2 bg-slate-100 p-6 rounded-2xl border border-slate-200 flex flex-col items-center justify-center">
          <div id="printable-ncr-tag" className="bg-white w-full max-w-md p-6 rounded-2xl border-4 border-[#0B3A60] shadow-2xl space-y-5 font-sans dir-rtl">
            {/* Header with Polo Egypt */}
            <div className="border-b-2 border-slate-200 pb-3 flex flex-col items-center text-center">
              <PoloEgyptLogo variant="horizontal" size="md" />
              <div className="mt-2 bg-red-600 text-white px-4 py-1 rounded-full text-xs font-black tracking-wider uppercase">
                بطاقة حجز شحنة عدم مطابقة (QUALITY HOLD)
              </div>
            </div>

            {/* QR Code Container */}
            <div className="flex flex-col items-center justify-center space-y-2 py-2">
              <div className="p-3 bg-white border-2 border-[#C4A052] rounded-xl shadow-inner">
                <QRCodeSVG
                  value={qrPayload}
                  size={190}
                  level="H"
                  includeMargin={true}
                  fgColor="#0B3A60"
                />
              </div>
              <span className="text-[11px] font-black text-[#0B3A60]">
                {selectedCapa ? selectedCapa.capaNo : customLot}
              </span>
            </div>

            {/* Content Details */}
            {selectedCapa ? (
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-2">
                <div className="flex justify-between border-b border-slate-200 pb-1.5 font-extrabold text-[#0B3A60]">
                  <span>رقم الطلب: {selectedCapa.capaNo}</span>
                  <span className="text-red-600">{selectedCapa.priority}</span>
                </div>
                <div><b>الموضوع:</b> {selectedCapa.subject}</div>
                <div><b>المنتج:</b> {selectedCapa.productName || 'غير محدد'}</div>
                <div><b>رقم التشغيلة:</b> <b className="text-slate-900">{selectedCapa.lotNumber || 'N/A'}</b></div>
                <div><b>الإدارة المعنية:</b> {selectedCapa.targetDepartment}</div>
                <div><b>المسؤول المتابِع:</b> {selectedCapa.responsiblePerson}</div>
              </div>
            ) : (
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-2">
                <div><b>المنتج:</b> {customProduct}</div>
                <div><b>اللوط:</b> <b className="text-[#0B3A60]">{customLot}</b></div>
                <div><b>السبب:</b> {customReason}</div>
              </div>
            )}

            {/* Signatures */}
            <div className="pt-3 border-t border-slate-200 grid grid-cols-2 gap-2 text-[10px] text-slate-600 font-bold text-center">
              <div>
                <span>توقيع مهندس الجودة:</span>
                <div className="h-6 border-b border-slate-300 mt-1" />
              </div>
              <div>
                <span>توقيع مشرف الإنتاج:</span>
                <div className="h-6 border-b border-slate-300 mt-1" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
