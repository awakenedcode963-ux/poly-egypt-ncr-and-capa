import React, { useState } from 'react';
import { MasterDataState, CAPARequest, FiveWhysAnalysis } from './types';
import { RAW_MASTER_DATA } from './data/initialMasterData';
import { INITIAL_CAPA_REQUESTS } from './data/initialCapaLogs';

import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { CapaView } from './components/CapaView';
import { FiveWhysStudioView } from './components/FiveWhysStudioView';
import { CapaDashboardView } from './components/CapaDashboardView';
import { PinGate } from './components/PinGate';

import { CapaQrCenterView } from './components/CapaQrCenterView';
import { AiAssistantView } from './components/AiAssistantView';
import { ImplementationGuideView } from './components/ImplementationGuideView';
import { WorkerReportPage } from './components/WorkerReportPage';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => sessionStorage.getItem('polo_qc_authenticated') === 'true');
  const [activeTab, setActiveTab] = useState<string>('capa-records');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // State for Master Data & CAPA Requests
  const [masterData, setMasterData] = useState<MasterDataState>(RAW_MASTER_DATA);
  const [capaRequests, setCapaRequests] = useState<CAPARequest[]>(INITIAL_CAPA_REQUESTS);

  // Simple routing for standalone worker page
  if (new URLSearchParams(window.location.search).get('view') === 'report') {
    return <WorkerReportPage />;
  }

  if (!isAuthenticated) {
    return (
      <PinGate onSuccess={() => {
        sessionStorage.setItem('polo_qc_authenticated', 'true');
        setIsAuthenticated(true);
      }} />
    );
  }

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
    <div className="min-h-screen bg-gradient-to-br from-[#0B3A60] via-[#0f2e4a] to-[#1a365d] flex flex-col lg:flex-row font-sans text-white overflow-x-hidden" dir="rtl">
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
        <footer className="bg-white/5 backdrop-blur-xl border-t border-white/20 py-4 px-6 text-xs text-slate-300 flex flex-col sm:flex-row items-center justify-between gap-2 mt-auto">
          <span>بولو إيجيبت للتجارة والصناعة ش.م.م © {new Date().getFullYear()} - نظام إدارة عدم المطابقة و CAPA و 5 Whys المنفصل</span>
          <div className="flex items-center gap-3 font-semibold text-slate-400">
            <span>ISO 9001 Standard Compliant</span>
            <span>•</span>
            <button 
              onClick={() => setActiveTab('sheets-guide')}
              className="text-sky-300 hover:text-white hover:underline cursor-pointer font-bold"
            >
              تصدير جوجل شيت ودليل الربط
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
