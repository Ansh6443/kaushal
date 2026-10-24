/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
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

  const handleOpenPdfExport = () => {
    setCurrentPage('pdf');
  };

  const handleAuthSuccess = (profile: { name: string; phone: string; location: string }) => {
    setUserProfile(profile);
  };

  const handleAssessmentComplete = (scores: Record<string, number>) => {
    setCurrentPage('gap-report');
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* Top Bar Header with Full 11-Screen Sitemap Navigation & Language Toggle */}
      <Header
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        lang={lang}
        setLang={setLang}
        onOpenPdfExport={handleOpenPdfExport}
      />

      {/* Main Viewport Routing across all 11 Screens */}
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-6">
        
        {/* 1. Landing / Home */}
        {currentPage === 'landing' && (
          <LandingPage lang={lang} onNavigate={setCurrentPage} />
        )}

        {/* 2. Onboarding (Language & Role Selection) */}
        {currentPage === 'onboarding' && (
          <OnboardingPage
            lang={lang}
            setLang={setLang}
            selectedPersonaId={selectedPersonaId}
            setSelectedPersonaId={setSelectedPersonaId}
            onNavigate={setCurrentPage}
          />
        )}

        {/* 3. Sign Up / Log In */}
        {currentPage === 'auth' && (
          <AuthPage
            lang={lang}
            selectedPersonaId={selectedPersonaId}
            onNavigate={setCurrentPage}
            onAuthSuccess={handleAuthSuccess}
          />
        )}

        {/* 4. Skill Assessment (Diagnostic Questionnaire) */}
        {currentPage === 'assessment' && (
          <AssessmentPage
            lang={lang}
            selectedPersonaId={selectedPersonaId}
            onNavigate={setCurrentPage}
            onAssessmentComplete={handleAssessmentComplete}
          />
        )}

        {/* 5. Skill Gap Report (Personalized Results) */}
        {currentPage === 'gap-report' && (
          <GapReportPage
            lang={lang}
            selectedPersonaId={selectedPersonaId}
            onNavigate={setCurrentPage}
          />
        )}

        {/* 6. Course Recommendations (with 6a Syllabus Detail Modal) */}
        {currentPage === 'courses' && (
          <CoursesPage
            lang={lang}
            selectedPersonaId={selectedPersonaId}
            onNavigate={setCurrentPage}
          />
        )}

        {/* 7. Hyperlocal Jobs & Apprenticeships (with 7a Opportunity Detail) */}
        {currentPage === 'jobs' && (
          <JobsPage
            lang={lang}
            selectedPersonaId={selectedPersonaId}
            onNavigate={setCurrentPage}
          />
        )}

        {/* 8. Profile / Dashboard (Longitudinal Persistence) */}
        {currentPage === 'dashboard' && (
          <DashboardPage
            lang={lang}
            selectedPersonaId={selectedPersonaId}
            onNavigate={setCurrentPage}
          />
        )}

        {/* 9. About / Social Impact */}
        {currentPage === 'about' && (
          <AboutImpactPage
            lang={lang}
            onNavigate={setCurrentPage}
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
              onClick={() => setCurrentPage('landing')}
              className="text-xs text-blue-700 hover:text-blue-800 font-semibold mb-2 inline-flex items-center gap-1"
            >
              ← Back to Main Dashboard
            </button>
            <PrintableDossier lang={lang} />
          </div>
        )}

      </main>

    </div>
  );
}
