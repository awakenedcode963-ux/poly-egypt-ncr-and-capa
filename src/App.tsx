import React, { useState } from 'react';
import { MasterDataState, CAPARequest, FiveWhysAnalysis } from './types';
import { RAW_MASTER_DATA } from './data/initialMasterData';
import { INITIAL_CAPA_REQUESTS } from './data/initialCapaLogs';

import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { CapaView } from './components/CapaView';
import { FiveWhysStudioView } from './components/FiveWhysStudioView';
import { CapaDashboardView } from './components/CapaDashboardView';
import { CapaQrCenterView } from './components/CapaQrCenterView';
import { AiAssistantView } from './components/AiAssistantView';
import { ImplementationGuideView } from './components/ImplementationGuideView';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('capa-records');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // State for Master Data & CAPA Requests
  const [masterData, setMasterData] = useState<MasterDataState>(RAW_MASTER_DATA);
  const [capaRequests, setCapaRequests] = useState<CAPARequest[]>(INITIAL_CAPA_REQUESTS);

  const handleAddCapa = (newCapa: CAPARequest) => {
    setCapaRequests(prev => [newCapa, ...prev]);
  };

  const handleUpdateCapaWhys = (capaId: string, updatedWhys: FiveWhysAnalysis) => {
    setCapaRequests(prev => prev.map(c => {
      if (c.id === capaId) {
        return {
          ...c,
          fiveWhys: updatedWhys,
          rootCause: updatedWhys.why5 || c.rootCause
        };
      }
      return c;
    }));
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col lg:flex-row font-sans text-slate-900" dir="rtl">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Container */}
      <div className="flex-1 lg:mr-[280px] flex flex-col min-h-screen">
        {/* Header */}
        <Header
          onOpenMobile={() => setIsMobileMenuOpen(true)}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          capaCount={capaRequests.length}
          onQuickNewEntry={() => setActiveTab('capa-records')}
          onAddCapa={handleAddCapa}
        />

        {/* View Routing for Standalone CAPA System */}
        <main className="flex-1 pb-12">
          {activeTab === 'capa-records' && (
            <CapaView
              capaRequests={capaRequests}
              masterData={masterData}
              onAddCapa={handleAddCapa}
            />
          )}

          {activeTab === 'five-whys-studio' && (
            <FiveWhysStudioView
              capaRequests={capaRequests}
              onUpdateCapaWhys={handleUpdateCapaWhys}
              onNavigateToRecords={() => setActiveTab('capa-records')}
            />
          )}

          {activeTab === 'capa-dashboard' && (
            <CapaDashboardView
              capaRequests={capaRequests}
              onNavigateToRecords={() => setActiveTab('capa-records')}
              onNavigateToWhys={() => setActiveTab('five-whys-studio')}
            />
          )}

          {activeTab === 'qr-center' && (
            <CapaQrCenterView
              capaRequests={capaRequests}
            />
          )}

          {activeTab === 'ai-consultant' && (
            <AiAssistantView
              masterData={masterData}
              logs={[]}
            />
          )}

          {activeTab === 'sheets-guide' && (
            <ImplementationGuideView
              logs={[]}
              mixingLogs={[]}
              injectionLogs={[]}
              preventiveLogs={[]}
              breakdownLogs={[]}
              capaRequests={capaRequests}
              masterData={masterData}
            />
          )}
        </main>

        {/* Global Footer */}
        <footer className="bg-white border-t border-slate-200 py-4 px-6 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 mt-auto">
          <span>بولو إيجيبت للتجارة والصناعة ش.م.م © {new Date().getFullYear()} - نظام إدارة عدم المطابقة و CAPA و 5 Whys المنفصل</span>
          <div className="flex items-center gap-3 font-semibold text-slate-600">
            <span>ISO 9001 Standard Compliant</span>
            <span>•</span>
            <button 
              onClick={() => setActiveTab('sheets-guide')}
              className="text-[#0B3A60] hover:underline cursor-pointer font-bold"
            >
              تصدير جوجل شيت ودليل الربط
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
