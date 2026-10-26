/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { Language, UserProfile } from './types';
import { PERSONAS } from './data/researchData';
import { Header } from './components/Header';
import { LandingPage } from './components/pages/LandingPage';
import { OnboardingPage } from './components/pages/OnboardingPage';
import { AuthPage } from './components/pages/AuthPage';
import { ResumeBuilderPage } from './components/pages/ResumeBuilderPage';
import { AssessmentPage } from './components/pages/AssessmentPage';
import { GapReportPage } from './components/pages/GapReportPage';
import { CoursesPage } from './components/pages/CoursesPage';
import { JobsPage } from './components/pages/JobsPage';
import { DashboardPage } from './components/pages/DashboardPage';
import { AboutImpactPage } from './components/pages/AboutImpactPage';
import { DesignSpecsView } from './components/DesignSpecsView';
import { PrintableDossier } from './components/PrintableDossier';
import { ChatbotWidget } from './components/ChatbotWidget';

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('landing');
  const [lang, setLang] = useState<Language>('en');
  const [selectedPersonaId, setSelectedPersonaId] = useState<string>('priya');

  // Candidate Profile State with localStorage persistence
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('ks_active_user');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading user profile', e);
    }
    // Default initial profile for immediate testability
    return {
      name: 'Priya Sharma',
      phone: '9839048261',
      email: 'priya.sharma@gmail.com',
      location: 'Lucknow',
      targetRole: 'Junior GST & Accounts Executive',
      education: 'B.Com (Accounts & Taxation) · Lucknow University (2024)',
      experienceYears: 1,
      skills: ['Tally Prime 4.0', 'Advanced Excel', 'GST Filing', 'E-Way Bills', 'TDS Reconciliation'],
      bio: 'Goal-oriented commerce graduate with hands-on proficiency in Tally Prime, GSTR-2B reconciliation, and financial analytics. Looking to accelerate local MSME financial growth.',
      resumeBuilt: true,
      atsScore: 88,
    };
  });

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

  const handleAuthSuccess = (profile: UserProfile) => {
    setUserProfile(profile);
    try {
      localStorage.setItem('ks_active_user', JSON.stringify(profile));
    } catch (e) {
      console.error(e);
    }
  };

  const handleSignOut = () => {
    setUserProfile(null);
    try {
      localStorage.removeItem('ks_active_user');
    } catch (e) {
      console.error(e);
    }
    handleNavigate('landing');
  };

  const handleAssessmentComplete = (scores: Record<string, number>) => {
    handleNavigate('gap-report');
  };

  const handleUpdateProfile = (updatedProfile: UserProfile) => {
    setUserProfile(updatedProfile);
    try {
      localStorage.setItem('ks_active_user', JSON.stringify(updatedProfile));
    } catch (e) {
      console.error(e);
    }
  };

  const handlePersonaSwitch = (personaId: string) => {
    setSelectedPersonaId(personaId);
    const p = PERSONAS.find(item => item.id === personaId);
    if (p) {
      const newProf: UserProfile = {
        name: p.name,
        phone: '98390' + Math.floor(10000 + Math.random() * 90000),
        email: `${p.id}.kaushal@gmail.com`,
        location: p.location.split('(')[0].trim(),
        targetRole: p.targetRole,
        education: p.id === 'priya' 
          ? 'B.Com (Accounts & Taxation) · Lucknow University'
          : p.id === 'rahul'
            ? 'ITI Electrician Diploma (NCVT) · Govt ITI Kanpur'
            : 'Senior Secondary (12th Pass) · UP State Board',
        experienceYears: 1,
        skills: p.id === 'priya'
          ? ['Tally Prime 4.0', 'Advanced Excel', 'GST Filing', 'E-Way Bills']
          : p.id === 'rahul'
            ? ['Solar Inverter Diagnostics', '3-Phase Wiring', 'Multimeter Testing', 'Electrical PPE']
            : ['CSC e-District Portal', 'Hindi Typing', 'Micro-ATM AePS Operations'],
        bio: p.primaryGoal,
        resumeBuilt: true,
        atsScore: p.baselineScore + 18,
      };
      setUserProfile(newProf);
      try {
        localStorage.setItem('ks_active_user', JSON.stringify(newProf));
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900 relative">
      
      {/* Top Bar Header with Full Navigation & User Profile */}
      <Header
        currentPage={currentPage}
        onNavigate={handleNavigate}
        lang={lang}
        setLang={setLang}
        onOpenPdfExport={handleOpenPdfExport}
        userProfile={userProfile}
        onSignOut={handleSignOut}
      />

      {/* Hairline Scroll Progress Indicator */}
      <div className="sticky top-[49px] inset-x-0 h-[2.5px] bg-transparent z-30 pointer-events-none no-print">
        <div
          className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-amber-500 transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Main Viewport Routing across all Screens */}
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
              setSelectedPersonaId={handlePersonaSwitch}
              onNavigate={handleNavigate}
            />
          )}

          {/* 3. Sign In / Register (Dual Mode with 2 Quick Test Accounts) */}
          {currentPage === 'auth' && (
            <AuthPage
              lang={lang}
              selectedPersonaId={selectedPersonaId}
              onNavigate={handleNavigate}
              onAuthSuccess={handleAuthSuccess}
            />
          )}

          {/* 4. AI Resume Studio & Direct HR Dispatch */}
          {currentPage === 'resume' && (
            <ResumeBuilderPage
              lang={lang}
              selectedPersonaId={selectedPersonaId}
              userProfile={userProfile}
              onUpdateProfile={handleUpdateProfile}
              onNavigate={handleNavigate}
            />
          )}

          {/* 5. Skill Assessment (Targeted 3-Minute Scenario Diagnostic) */}
          {currentPage === 'assessment' && (
            <AssessmentPage
              lang={lang}
              selectedPersonaId={selectedPersonaId}
              onNavigate={handleNavigate}
              onAssessmentComplete={handleAssessmentComplete}
            />
          )}

          {/* 6. Post-Resume Skill Gap Report */}
          {currentPage === 'gap-report' && (
            <GapReportPage
              lang={lang}
              selectedPersonaId={selectedPersonaId}
              onNavigate={handleNavigate}
            />
          )}

          {/* 7. Course Recommendations */}
          {currentPage === 'courses' && (
            <CoursesPage
              lang={lang}
              selectedPersonaId={selectedPersonaId}
              onNavigate={handleNavigate}
            />
          )}

          {/* 8. Hyperlocal Jobs & Direct HR Push */}
          {currentPage === 'jobs' && (
            <JobsPage
              lang={lang}
              selectedPersonaId={selectedPersonaId}
              onNavigate={handleNavigate}
            />
          )}

          {/* 9. Profile / Dashboard */}
          {currentPage === 'dashboard' && (
            <DashboardPage
              lang={lang}
              selectedPersonaId={selectedPersonaId}
              onNavigate={handleNavigate}
            />
          )}

          {/* 10. About / Social Impact */}
          {currentPage === 'about' && (
            <AboutImpactPage
              lang={lang}
              onNavigate={handleNavigate}
            />
          )}

          {/* 11. Design Specs & Research Tokens */}
          {currentPage === 'specs' && (
            <DesignSpecsView
              lang={lang}
            />
          )}

          {/* 12. Printable Research Dossier (Vector jsPDF Exporter) */}
          {currentPage === 'pdf' && (
            <div className="space-y-4">
              <button
                onClick={() => handleNavigate('landing')}
                className="text-xs text-blue-700 hover:text-blue-800 font-semibold mb-2 inline-flex items-center gap-1 transition-colors cursor-pointer"
              >
                ← Back to Main Dashboard
              </button>
              <PrintableDossier lang={lang} />
            </div>
          )}

        </div>
      </main>

      {/* Floating Vernacular AI Career Copilot ("Kaushal Saarthi") with Mascot Logo */}
      <ChatbotWidget
        lang={lang}
        userProfile={userProfile}
        selectedPersonaId={selectedPersonaId}
        onNavigate={handleNavigate}
      />

      {/* Floating Smooth Scroll-to-Top Button */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 left-6 z-40 p-2.5 rounded-full bg-white/95 backdrop-blur-md border border-slate-200 text-slate-700 shadow-md hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 hover:shadow-lg transition-all duration-200 active:scale-95 flex items-center justify-center group no-print cursor-pointer"
          aria-label="Scroll smoothly to top"
          title="Scroll to top"
        >
          <ArrowUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      )}

    </div>
  );
}
