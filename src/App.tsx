/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { Language } from './types';
import { Header } from './components/Header';
import { LandingPage } from './components/pages/LandingPage';
import { OnboardingPage } from './components/pages/OnboardingPage';
import { AuthPage } from './components/pages/AuthPage';
import { AssessmentPage } from './components/pages/AssessmentPage';
import { GapReportPage } from './components/pages/GapReportPage';
import { CoursesPage } from './components/pages/CoursesPage';
import { JobsPage } from './components/pages/JobsPage';
import { DashboardPage } from './components/pages/DashboardPage';
import { AboutImpactPage } from './components/pages/AboutImpactPage';
import { DesignSpecsView } from './components/DesignSpecsView';
import { PrintableDossier } from './components/PrintableDossier';

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('landing');
  const [lang, setLang] = useState<Language>('en');
  const [selectedPersonaId, setSelectedPersonaId] = useState<string>('priya');
  const [userProfile, setUserProfile] = useState<{ name: string; phone: string; location: string } | null>(null);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);

  // Monitor scroll for smooth reading progress bar & floating scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = windowHeight > 0 ? (totalScroll / windowHeight) * 100 : 0;
      setScrollProgress(progress);
      setShowScrollTop(totalScroll > 320);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenPdfExport = () => {
    handleNavigate('pdf');
  };

  const handleAuthSuccess = (profile: { name: string; phone: string; location: string }) => {
    setUserProfile(profile);
  };

  const handleAssessmentComplete = (scores: Record<string, number>) => {
    handleNavigate('gap-report');
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900 relative">
      
      {/* Top Bar Header with Full Navigation & Language Toggle */}
      <Header
        currentPage={currentPage}
        onNavigate={handleNavigate}
        lang={lang}
        setLang={setLang}
        onOpenPdfExport={handleOpenPdfExport}
      />

      {/* Hairline Scroll Progress Indicator (Smooth Easing) */}
      <div className="sticky top-[49px] inset-x-0 h-[2.5px] bg-transparent z-30 pointer-events-none no-print">
        <div
          className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-amber-500 transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Main Viewport Routing across all 11 Screens with Smooth View Entrance */}
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-6">
        <div key={currentPage} className="smooth-view">
        
          {/* 1. Landing / Home */}
          {currentPage === 'landing' && (
            <LandingPage lang={lang} onNavigate={handleNavigate} />
          )}

          {/* 2. Onboarding (Language & Role Selection) */}
          {currentPage === 'onboarding' && (
            <OnboardingPage
              lang={lang}
              setLang={setLang}
              selectedPersonaId={selectedPersonaId}
              setSelectedPersonaId={setSelectedPersonaId}
              onNavigate={handleNavigate}
            />
          )}

          {/* 3. Sign Up / Log In */}
          {currentPage === 'auth' && (
            <AuthPage
              lang={lang}
              selectedPersonaId={selectedPersonaId}
              onNavigate={handleNavigate}
              onAuthSuccess={handleAuthSuccess}
            />
          )}

          {/* 4. Skill Assessment (Diagnostic Questionnaire) */}
          {currentPage === 'assessment' && (
            <AssessmentPage
              lang={lang}
              selectedPersonaId={selectedPersonaId}
              onNavigate={handleNavigate}
              onAssessmentComplete={handleAssessmentComplete}
            />
          )}

          {/* 5. Skill Gap Report (Personalized Results) */}
          {currentPage === 'gap-report' && (
            <GapReportPage
              lang={lang}
              selectedPersonaId={selectedPersonaId}
              onNavigate={handleNavigate}
            />
          )}

          {/* 6. Course Recommendations (with 6a Syllabus Detail Modal) */}
          {currentPage === 'courses' && (
            <CoursesPage
              lang={lang}
              selectedPersonaId={selectedPersonaId}
              onNavigate={handleNavigate}
            />
          )}

          {/* 7. Hyperlocal Jobs & Apprenticeships (with 7a Opportunity Detail) */}
          {currentPage === 'jobs' && (
            <JobsPage
              lang={lang}
              selectedPersonaId={selectedPersonaId}
              onNavigate={handleNavigate}
            />
          )}

          {/* 8. Profile / Dashboard (Longitudinal Persistence) */}
          {currentPage === 'dashboard' && (
            <DashboardPage
              lang={lang}
              selectedPersonaId={selectedPersonaId}
              onNavigate={handleNavigate}
            />
          )}

          {/* 9. About / Social Impact */}
          {currentPage === 'about' && (
            <AboutImpactPage
              lang={lang}
              onNavigate={handleNavigate}
            />
          )}

          {/* 10. Design Specs & Research Tokens */}
          {currentPage === 'specs' && (
            <DesignSpecsView
              lang={lang}
            />
          )}

          {/* 11. Printable Research Dossier (Vector jsPDF Exporter) */}
          {currentPage === 'pdf' && (
            <div className="space-y-4">
              <button
                onClick={() => handleNavigate('landing')}
                className="text-xs text-blue-700 hover:text-blue-800 font-semibold mb-2 inline-flex items-center gap-1 transition-colors"
              >
                ← Back to Main Dashboard
              </button>
              <PrintableDossier lang={lang} />
            </div>
          )}

        </div>
      </main>

      {/* Floating Smooth Scroll-to-Top Button */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-40 p-2.5 rounded-full bg-white/95 backdrop-blur-md border border-slate-200 text-slate-700 shadow-md hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 hover:shadow-lg transition-all duration-200 active:scale-95 flex items-center justify-center group no-print cursor-pointer"
          aria-label="Scroll smoothly to top"
          title="Scroll to top"
        >
          <ArrowUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      )}

    </div>
  );
}
