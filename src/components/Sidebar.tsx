import React from 'react';
import { 
  AlertTriangle, 
  HelpCircle, 
  BarChart3, 
  QrCode, 
  Bot, 
  BookOpen, 
  X, 
  ShieldCheck, 
  Layers
} from 'lucide-react';
import { PoloEgyptLogo } from './PoloEgyptLogo';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  onCloseMobile: () => void;
  issueCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpen,
  onCloseMobile
}) => {
  const navItems = [
    {
      id: 'capa-records',
      label: 'سجل عدم المطابقة والـ CAPA',
      desc: 'نماذج NCR، الإجراءات التصحيحية والوقائية',
      icon: AlertTriangle,
      badge: 'النموذج المعتمد',
      color: 'text-red-400'
    },
    {
      id: 'five-whys-studio',
      label: 'استوديو شجرة الـ 5 Whys',
      desc: 'تحليل الأسباب الجذرية التفاعلي + AI',
      icon: HelpCircle,
      badge: 'تفاعلي + AI',
      color: 'text-amber-400'
    },
    {
      id: 'capa-dashboard',
      label: 'داشبورد تحليلات عدم المطابقة',
      desc: 'مؤشرات الأداء ومعدل فاعلية الإجراءات',
      icon: BarChart3,
      badge: 'مباشر',
      color: 'text-sky-400'
    },
    {
      id: 'qr-center',
      label: 'مركز بطاقات QR والحجز',
      desc: 'طباعة Hold Tags ومسح الموبايل',
      icon: QrCode,
      color: 'text-emerald-400'
    },
    {
      id: 'ai-consultant',
      label: 'مستشار الجودة والـ 5 Whys الذكي',
      desc: 'مراجعة البلاغات وتوجيهات ISO 9001',
      icon: Bot,
      color: 'text-amber-300'
    },
    {
      id: 'sheets-guide',
      label: 'تصدير جوجل شيت ودليل ISO',
      desc: 'ربط البيانات وإرسال التنبيهات',
      icon: BookOpen,
      color: 'text-purple-300'
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-950/60 z-40 lg:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed top-0 right-0 h-full w-[280px] bg-[#0B3A60] text-white z-50 flex flex-col justify-between
        transition-transform duration-300 ease-in-out shadow-2xl  font-sans dir-rtl
        ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
      `}>
        <div>
          {/* Brand Header with Polo Egypt Branding & Logo Icon */}
          <div className="sidebar-brand px-5 py-5 sm:px-6 sm:py-5.5 border-b border-white/10 bg-white/5 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3.5">
                {/* Primary Visual Logo Icon - On the right in RTL with accessibility alt tag & title */}
                <div 
                  className="p-2.5 bg-gradient-to-br from-[#0B3A60] to-[#082C4A] rounded-xl border border-[#C0A46F]/50 shadow-md shrink-0 flex items-center justify-center transition-transform hover:scale-105"
                  title="شعار شركة بولو إيجيبت للتجارة والصناعة - POLO EGYPT S.A.E"
                  aria-label="شعار شركة بولو إيجيبت للتجارة والصناعة"
                >
                  <PoloEgyptLogo 
                    variant="iconOnly" 
                    size="sm" 
                    lightMode={true} 
                    alt="شعار شركة بولو إيجيبت للتجارة والصناعة"
                  />
                </div>

                <div className="flex flex-col text-right">
                  <div className="flex items-center gap-1.5">
                    <span className="font-black text-base text-white leading-tight tracking-wide">
                      بولو إيجيبت
                    </span>
                    <span className="bg-[#C0A46F]/20 text-[#C0A46F] border border-[#C0A46F]/40 text-[9px] font-black px-1.5 py-0.5 rounded-md">
                      ش.م.م
                    </span>
                  </div>
                  <span className="text-[10px] font-extrabold text-[#C0A46F] leading-tight tracking-wider mt-0.5">
                    POLO EGYPT FOR TRADE & INDUSTRY
                  </span>
                  <span className="text-[11px] font-bold text-slate-200 mt-1 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
                    نظام CAPA و NCR المنفصل
                  </span>
                </div>
              </div>

              <button 
                onClick={onCloseMobile}
                className="lg:hidden text-slate-300 hover:text-white p-1.5 rounded-lg transition-colors"
                title="إغلاق القائمة"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-[#C0A46F]/15 border border-[#C0A46F]/35 rounded-xl p-2.5 px-3 flex items-center justify-between text-xs shadow-xs">
              <span className="font-extrabold text-[#C0A46F] text-[11px]">إدارة الجودة وتحليل 5 Whys</span>
              <span className="bg-[#C0A46F] text-white px-2.5 py-0.5 rounded-md font-black text-[10px] tracking-wider shadow-xs">
                ISO 9001
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1.5 max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar">
            <div className="px-3 py-1.5 text-[11px] font-extrabold uppercase text-amber-400 tracking-wider">
              وحدات النظام المنفصلة
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    onCloseMobile();
                  }}
                  className={`
                    w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold
                    transition-all duration-200 cursor-pointer text-right group
                    ${isActive 
                      ? 'bg-white/20 text-white border-r-4 border-[#C0A46F] shadow-[0_4px_12px_rgba(0,0,0,0.1)] pr-3 backdrop-blur-md' 
                      : 'text-slate-200 hover:bg-white/10 hover:text-white'
                    }
                  `}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className={`w-4.5 h-4.5 shrink-0 ${item.color}`} />
                    <div className="truncate text-right">
                      <div className="truncate leading-tight font-extrabold">{item.label}</div>
                      <div className="text-[10px] text-slate-300 font-medium truncate mt-0.5">{item.desc}</div>
                    </div>
                  </div>

                  {item.badge && (
                    <span className={`text-[9px] px-2 py-0.5 rounded-md font-extrabold shrink-0 ${
                      item.id === 'capa-records' ? 'bg-[#E74C3C] text-white animate-pulse' : 'bg-[#C0A46F] text-white'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer info inside sidebar */}
        <div className="p-4 border-t border-white/10 bg-[#082C4A] text-xs text-slate-300 space-y-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-extrabold text-white text-[11px]">نظام معتمد لإدارة الجودة والـ CAPA</span>
          </div>
          <p className="text-[10px] text-slate-300 font-semibold leading-tight">
            بولو إيجيبت للتجارة والصناعة ش.م.م
          </p>
        </div>
      </aside>
    </>
  );
};
