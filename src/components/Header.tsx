import React, { useState } from 'react';
import { Menu, Download, QrCode, PlusCircle, ShieldCheck, Smartphone, AlertTriangle } from 'lucide-react';
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
      <header className="bg-[#0B3A60] sticky top-0 z-30 shadow-none dir-rtl font-sans text-white relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#C1A67B]/20 via-transparent to-transparent pointer-events-none"></div>
        
        {/* Navbar (Glassmorphism) */}
        <div className="relative bg-white/5 backdrop-blur-md border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[5rem] py-3 flex flex-col sm:flex-row items-center sm:justify-between gap-3 sm:gap-4">
            
            {/* Left / Mobile Toggle & Page Title */}
            <div className="flex items-center justify-between sm:justify-start gap-4 w-full sm:w-auto">
              <button
                onClick={onOpenMobile}
                className="lg:hidden p-2 text-white hover:text-sky-100 hover:bg-white/10 rounded-lg transition-colors"
                title="القائمة"
              >
                <Menu className="w-6 h-6" />
              </button>
              
              <div className="bg-white/10 backdrop-blur-xl p-1.5 rounded-xl shadow-lg border border-white/20 shrink-0">
                <img src="/assets/polo-egypt-logo.png" alt="Polo Egypt" className="h-10 sm:h-12 w-auto object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
              </div>
              
              <div className="hidden sm:block">
                <h1 className="text-base sm:text-lg font-black text-white flex items-center gap-2 drop-shadow-md">
                  <span>{current.title}</span>
                </h1>
                <p className="text-xs font-bold text-slate-300 drop-shadow-sm">
                  {current.subtitle}
                </p>
              </div>
            </div>

            {/* Action Buttons (Glass Pills) */}
            <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2 sm:gap-3 w-full sm:w-auto">
              <button
                onClick={() => setIsWorkerScanOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm rounded-full transition-all text-xs font-black shadow-sm"
              >
                <Smartphone className="w-4 h-4 text-[#C0A46F]" />
                <span className="hidden sm:inline">مسح QR صالة الإنتاج</span>
                <span className="sm:hidden">مسح QR</span>
              </button>
              
              <button
                onClick={() => setIsQrModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm rounded-full transition-all text-xs font-extrabold shadow-sm"
              >
                <QrCode className="w-4 h-4 text-[#C0A46F]" />
                <span className="hidden md:inline">QR Code</span>
              </button>
              
              <button
                onClick={() => setActiveTab('sheets-guide')}
                className="flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm rounded-full transition-all text-xs font-extrabold shadow-sm"
              >
                <Download className="w-4 h-4 text-[#C0A46F]" />
                <span className="hidden lg:inline">تصدير Sheets</span>
                <span className="lg:hidden">تصدير</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* QR Code Quick Modal */}
      <CapaQrModal
        capa={null}
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
      />

      {/* Worker Floor Scan Modal */}
      <WorkerFloorScanModal
        isOpen={isWorkerScanOpen}
        onClose={() => setIsWorkerScanOpen(false)}
        onAddCapa={onAddCapa}
      />
    </>
  );
};
