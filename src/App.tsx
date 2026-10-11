/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ToastProvider } from './components/ui/Toast';
import { SkipLink } from './components/layout/SkipLink';
import { SetupBanner } from './components/ui/SetupBanner';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';

// Pages
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Features } from './pages/Features';
import { Events } from './pages/Events';
import { Leaderboards } from './pages/Leaderboards';
import { Rules } from './pages/Rules';
import { Community } from './pages/Community';
import { Status } from './pages/Status';
import { Setup } from './pages/Setup';
import { Assistant } from './pages/Assistant';
import { NotFound } from './pages/NotFound';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <HashRouter>
      <ToastProvider>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen bg-[#0A0910] text-[#ECE9F5]">
          <SkipLink />
          <SetupBanner />
          <Header />
          <main id="main-content" className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/features" element={<Features />} />
              <Route path="/events" element={<Events />} />
              <Route path="/leaderboards" element={<Leaderboards />} />
              <Route path="/rules" element={<Rules />} />
              <Route path="/community" element={<Community />} />
              <Route path="/status" element={<Status />} />
              <Route path="/setup" element={<Setup />} />
              <Route path="/assistant" element={<Assistant />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </ToastProvider>
    </HashRouter>
  );
}
