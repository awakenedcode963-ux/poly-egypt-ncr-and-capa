import React, { useState } from 'react';
import { Menu, Download, QrCode, PlusCircle, ShieldCheck, Smartphone, AlertTriangle } from 'lucide-react';
import { PoloEgyptLogo } from './PoloEgyptLogo';
import { CapaQrModal } from './CapaQrModal';
import { WorkerFloorScanModal } from './WorkerFloorScanModal';
import { CAPARequest } from '../types';

interface HeaderProps {
  onOpenMobile: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onQuickNewEntry?: () => void;
  capaCount: number;
  onAddCapa: (newCapa: CAPARequest) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMobile,
  activeTab,
  setActiveTab,
  onQuickNewEntry,
  capaCount,
  onAddCapa
}) => {
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isWorkerScanOpen, setIsWorkerScanOpen] = useState(false);

  const titles: Record<string, { title: string; subtitle: string }> = {
    'capa-records': { 
      title: 'سجل عدم المطابقة والـ CAPA القابل للتخصيص', 
      subtitle: 'إصدار ومتابعة طلبات NCR والإجراءات التصحيحية والوقائية طبقاً لـ ISO 9001' 
    },
    'five-whys-studio': { 
      title: 'استوديو شجرة الـ 5 Whys وتحليل المسببات الجذرية', 
      subtitle: 'أداة تفاعلية مدعومة بالذكاء الاصطناعي لبناء تسلسل الـ 5 Whys' 
    },
    'capa-dashboard': { 
      title: 'لوحة تحليلات ومؤشرات أداء الجودة والـ CAPA', 
      subtitle: 'متابعة معدلات الإغلاق، الأقسام الأكثر بلاغات، وفاعلية الإجراءات الوقائية' 
    },
    'qr-center': { 
      title: 'مركز بطاقات QR Code وحجز الشحنات غير المطابقة', 
      subtitle: 'طباعة ملصقات Hold Tags ومحاكاة مسح الكود بالموبايل بالمصنع' 
    },
    'ai-consultant': { 
      title: 'مستشار الجودة والـ 5 Whys الذكي (Gemini AI)', 
      subtitle: 'مراجعة وتقييم طلبات عدم المطابقة والتوصيات الوقائية المعيارية' 
    },
    'sheets-guide': { 
      title: 'تصدير جوجل شيت ودليل ربط التنبيهات مع ISO', 
      subtitle: 'تحميل الشيت الموحد، كود Apps Script، وتنفيذ الربط الآلي' 
    }
  };

  const current = titles[activeTab] || { 
    title: 'نظام بولو إيجيبت لـ CAPA و NCR وتحليل 5 Whys', 
    subtitle: 'النظام المنفصل لإدارة عدم المطابقة والجودة الشاملة' 
  };

  return (
    <>
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs dir-rtl font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Left / Mobile Toggle & Page Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenMobile}
              className="lg:hidden p-2 text-slate-600 hover:text-[#0B3A60] hover:bg-slate-100 rounded-lg transition-colors"
              title="القائمة"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="hidden xl:block border-l border-slate-200 pl-3 ml-1">
              <PoloEgyptLogo variant="horizontal" size="sm" />
            </div>

            <div>
              <h1 className="text-base sm:text-lg font-black text-[#0B3A60] flex items-center gap-2">
                <span>{current.title}</span>
                <span className="text-[10px] bg-red-100 text-red-800 px-2.5 py-0.5 rounded-full font-extrabold hidden md:inline-block">
                  نظام منفصل معتمد
                </span>
              </h1>
              <p className="text-xs font-medium text-slate-500 hidden sm:block">
                {current.subtitle}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Worker Mobile Scan Button for Production Floor */}
            <button
              onClick={() => setIsWorkerScanOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-[#0B3A60] hover:bg-sky-900 text-white text-xs font-black rounded-xl transition-all shadow-sm cursor-pointer border border-sky-800"
              title="مسح QR بالصالة وتسجيل عيب سريع بواسطة الفني"
            >
              <Smartphone className="w-4 h-4 text-[#C0A46F]" />
              <span className="hidden sm:inline">مسح QR صالة الإنتاج</span>
              <span className="sm:hidden">مسح QR</span>
            </button>

            {/* Quick QR Code for Mobile Floor Access */}
            <button
              onClick={() => setIsQrModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-[#C0A46F] hover:text-slate-950 text-slate-800 text-xs font-extrabold rounded-xl transition-all cursor-pointer border border-slate-200"
              title="رمز QR Code للوصول عبر الهاتف"
            >
              <QrCode className="w-4 h-4 text-[#0B3A60]" />
              <span className="hidden md:inline">QR Code الموبايل</span>
            </button>

            {/* Quick Direct Sheet Download Button */}
            <button
              onClick={() => setActiveTab('sheets-guide')}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-[#27AE60] hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl transition-all shadow-sm hover:shadow-md cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span className="hidden lg:inline">تصدير Google Sheets</span>
              <span className="lg:hidden">تصدير</span>
            </button>

            {/* New Record Quick Action */}
            {onQuickNewEntry && (
              <button
                onClick={onQuickNewEntry}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-[#E74C3C] hover:bg-red-700 text-white text-xs font-extrabold rounded-xl transition-all shadow-sm hover:shadow-md cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span className="hidden sm:inline">+ إصدار NCR جديد</span>
                <span className="sm:hidden">+ NCR</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* QR Code Quick Modal */}
      <CapaQrModal
        capa={null}
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
      />

      {/* Worker Floor Scan & Mobile Incident Entry Modal */}
      <WorkerFloorScanModal
        isOpen={isWorkerScanOpen}
        onClose={() => setIsWorkerScanOpen(false)}
        onAddCapa={onAddCapa}
      />
    </>
  );
};
