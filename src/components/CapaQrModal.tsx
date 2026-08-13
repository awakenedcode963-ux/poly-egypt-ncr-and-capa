import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { CAPARequest } from '../types';
import { PoloEgyptLogo } from './PoloEgyptLogo';
import { X, Printer, Download, Share2, Check, QrCode, ShieldAlert, Sparkles } from 'lucide-react';

interface CapaQrModalProps {
  capa: CAPARequest | null;
  isOpen: boolean;
  onClose: () => void;
  systemMobileUrl?: string;
}

export const CapaQrModal: React.FC<CapaQrModalProps> = ({
  capa,
  isOpen,
  onClose,
  systemMobileUrl = `${window.location.origin}/?view=report`
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Determine QR Payload
  const qrData = capa
    ? JSON.stringify({
        capaNo: capa.capaNo,
        date: capa.date,
        subject: capa.subject,
        status: capa.status,
        product: capa.productName || 'غير محدد',
        priority: capa.priority,
        company: 'POLO EGYPT'
      })
    : systemMobileUrl;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(systemMobileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 z-50 flex items-center justify-center p-4 backdrop-blur-xs font-sans dir-rtl">
      <div className="bg-white text-slate-900 w-full max-w-lg rounded-2xl shadow-2xl border border-white/10 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-[#0B3A60] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-amber-400" />
            <span className="font-black text-sm">
              {capa ? `بطاقة QR Code للتقرير المعياري ${capa.capaNo}` : 'رمز QR Code للتسجيل السريع عبر الموبايل'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Badge Body */}
        <div id="printable-ncr-tag" className="p-6 overflow-y-auto space-y-6 print:p-8 bg-white/5">
          {/* Logo & Company Name */}
          <div className="bg-white/10 backdrop-blur-xl p-4 rounded-xl border border-white/10 shadow-xs flex flex-col items-center text-center">
            <PoloEgyptLogo variant="horizontal" size="md" />
            <div className="mt-2 pt-2 border-t border-white/10 w-full flex items-center justify-between text-[10px] text-slate-400 font-bold">
              <span>قسم توكيد وتقييم الجودة (QA/QC)</span>
              <span>بطاقة ضبط عدم المطابقة QAF-04-03</span>
            </div>
          </div>

          {/* QR Code Container */}
          <div className="bg-white/10 backdrop-blur-xl p-5 rounded-2xl border-2 border-[#C0A46F] shadow-md flex flex-col items-center justify-center text-center space-y-3">
            <div className="p-3 bg-white border border-white/10 rounded-xl shadow-inner">
              <QRCodeSVG
                value={qrData}
                size={180}
                level="H"
                includeMargin={true}
                fgColor="#0B3A60"
              />
            </div>
            <span className="text-xs font-extrabold text-[#0B3A60] bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
              امسح الكود بالكاميرا للوصول الفوري
            </span>
          </div>

          {/* Details Card if specific CAPA */}
          {capa ? (
            <div className="bg-white/10 backdrop-blur-xl p-4 rounded-xl border border-white/10 shadow-xs space-y-2 text-xs">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="font-extrabold text-white text-sm">{capa.capaNo}</span>
                <span className={`px-2.5 py-0.5 rounded-full font-black text-[10px] ${
                  capa.priority.includes('حرج') ? 'bg-red-100 text-red-800' :
                  capa.priority.includes('عالي') ? 'bg-orange-100 text-orange-800' :
                  'bg-amber-100 text-amber-800'
                }`}>
                  الأولوية: {capa.priority}
                </span>
              </div>

              <div>
                <span className="text-slate-400 font-semibold block text-[10px]">الموضوع / العيب:</span>
                <span className="font-bold text-white">{capa.subject}</span>
              </div>

              {capa.productName && (
                <div>
                  <span className="text-slate-400 font-semibold block text-[10px]">المنتج المتأثر:</span>
                  <span className="font-bold text-white">{capa.productName}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10 text-[11px] font-semibold">
                <div><b>الإدارة:</b> {capa.targetDepartment}</div>
                <div><b>المسؤول:</b> {capa.responsiblePerson}</div>
                <div><b>التاريخ:</b> {capa.date}</div>
                <div><b>الحالة:</b> <b className="text-emerald-700">{capa.status}</b></div>
              </div>
            </div>
          ) : (
            <div className="bg-white/10 backdrop-blur-xl p-4 rounded-xl border border-white/10 shadow-xs text-xs space-y-1 text-slate-200 font-semibold text-center">
              <p className="font-bold text-white">رابط تسجيل عدم المطابقة الميداني</p>
              <p className="text-[11px] text-slate-400">
                يمكن لمفتشي الجودة وفنيي الخطوط مسح هذا الكود بواسطة هاتف الموبايل للوصول المباشر إلى نموذج تسجيل NCR والـ 5 Whys.
              </p>
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="p-4 bg-white border-t border-white/10 flex items-center justify-between gap-2">
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            <span>{copied ? 'تم نسخ الرابط!' : 'مشاركة الرابط'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
            >
              إغلاق
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-5 py-2 bg-[#0B3A60] hover:bg-sky-900 text-white font-black text-xs rounded-xl shadow-md cursor-pointer"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span>طباعة بطاقة QR (Print Tag)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
