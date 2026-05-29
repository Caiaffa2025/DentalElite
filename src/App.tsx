/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Specialties from './components/Specialties';
import BeforeAfterSlider from './components/BeforeAfterSlider';
import Quiz from './components/Quiz';
import BookingWizard from './components/BookingWizard';
import Testimonials from './components/Testimonials';
import Doctors from './components/Doctors';
import Technology from './components/Technology';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import FloatingAssistant from './components/FloatingAssistant';
import BookingNotifications from './components/BookingNotifications';
import { AdminProvider } from './context/AdminContext';
import { ImageEditorModal, AdminFloatAccess } from './components/AdminComponents';
import Gallery from './components/Gallery';
import WelcomePopup from './components/WelcomePopup';

export default function App() {
  return (
    <AdminProvider>
      <WelcomePopup />
      <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased">
        {/* Dynamic Header Navbar Section */}
        <Navbar />

        <main>
          {/* Hero Section */}
          <Hero />

          {/* Dynamic Specialties Panel */}
          <Specialties />

          {/* Interactive Before & After comparison slider */}
          <BeforeAfterSlider />

          {/* Interactive Quiz diagnostic simulator */}
          <Quiz />

          {/* Dynamic appointments scheduler agenda */}
          <BookingWizard />

          {/* New Dynamic Live Clinical Gallery Section */}
          <Gallery />

          {/* Filterable patient testimonials list */}
          <Testimonials />

          {/* Doctors and specialists team */}
          <Doctors />

          {/* Advanced Clinical tech highlights */}
          <Technology />

          {/* FAQ Accordion list */}
          <FAQ />
        </main>

        {/* Footer Block */}
        <Footer />

        {/* Dynamic urgency notification toaster */}
        <BookingNotifications />

        {/* Interactive Virtual Assistant Chatbot */}
        <FloatingAssistant />

        {/* Global Admin Overlays & Image customization tool */}
        <AdminFloatAccess />
        <ImageEditorModal />
      </div>
    </AdminProvider>
  );
}


