import React, { useState, useEffect } from 'react';
import { Phone, Clock, Smile, Menu, X, CalendarCheck } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setIsOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {/* Top Bar with Contacts info */}
      <div className="bg-slate-900 text-slate-100 text-xs py-2 px-4 flex justify-between items-center hidden md:flex">
        <div className="flex items-center space-x-4 max-w-7xl mx-auto w-full justify-between">
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1">
              <Phone className="w-3 h-3 text-sky-400" />
              <span>(11) 4950-8822</span>
            </span>
            <span className="flex items-center space-x-1">
              <Clock className="w-3 h-3 text-sky-400" />
              <span>Seg a Sex: 08:00 - 20:00 | Sábado: 08:00 - 14:00</span>
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="bg-sky-600/20 text-sky-300 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">
              Plantão de Urgência 24h
            </span>
            <span className="text-sky-400 font-medium">Urgências: (11) 99988-7711</span>
          </div>
        </div>
      </div>

      {/* Main Menu Navbar */}
      <nav 
        id="main-nav-bar"
        className={`transition-all duration-300 px-4 md:px-8 py-3 ${
          scrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-md py-3' 
            : 'bg-white/90 backdrop-blur-sm shadow-sm md:bg-transparent md:backdrop-blur-none md:shadow-none'
        }`}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo */}
          <div 
            id="nav-logo-container"
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => scrollToSection('hero-section')}
          >
            <div className="bg-sky-500 w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold shadow-sky-100 shadow-md">
              D
            </div>
            <div>
              <span className="font-sans font-extrabold text-lg md:text-xl text-slate-800 tracking-tight block leading-none underline decoration-sky-400 decoration-2 underline-offset-4">
                DentalElite
              </span>
              <span className="font-mono text-[9px] uppercase tracking-widest text-sky-600 block mt-0.5">
                Odontologia Integrada
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-6 text-sm font-medium text-slate-600">
            <button 
              id="btn-nav-specialties"
              onClick={() => scrollToSection('specialties-section')} 
              className="hover:text-sky-600 cursor-pointer transition"
            >
              Especialidades
            </button>
            <button 
              id="btn-nav-slider"
              onClick={() => scrollToSection('before-after-section')} 
              className="hover:text-sky-600 cursor-pointer transition"
            >
              Antes & Depois
            </button>
            <button 
              id="btn-nav-quiz"
              onClick={() => scrollToSection('quiz-section')} 
              className="hover:text-sky-600 cursor-pointer transition"
            >
              Simulador de Sorriso
            </button>
            <button 
              id="btn-nav-testimonials"
              onClick={() => scrollToSection('testimonials-section')} 
              className="hover:text-sky-600 cursor-pointer transition"
            >
              Depoimentos
            </button>
            <button 
              id="btn-nav-doctors"
              onClick={() => scrollToSection('doctors-section')} 
              className="hover:text-sky-600 cursor-pointer transition"
            >
              Nossa Equipe
            </button>
            <button 
              id="btn-nav-faq"
              onClick={() => scrollToSection('faq-section')} 
              className="hover:text-sky-600 cursor-pointer transition"
            >
              Dúvidas
            </button>
          </div>

          {/* CTA Action Button */}
          <div className="hidden sm:flex items-center space-x-3">
            <a 
              id="btn-phone-quick-call"
              href="tel:1149508822" 
              className="text-slate-700 hover:text-sky-600 font-semibold text-sm transition flex items-center space-x-1 pr-2"
            >
              <Phone className="w-4 h-4 text-sky-500" />
              <span>Ligar agora</span>
            </a>
            <button
              id="btn-navbar-schedule-cta"
              onClick={() => scrollToSection('booking-section')}
              className="bg-sky-600 hover:bg-sky-700 text-white px-5 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 flex items-center space-x-2 shadow-md hover:shadow-sky-100 hover:-translate-y-0.5 cursor-pointer"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Agendar Online</span>
            </button>
          </div>

          {/* Mobile Menu Icon */}
          <button
            id="btn-mobile-menu-toggle"
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-1 rounded-md text-slate-700 hover:text-sky-600 transition cursor-pointer"
            aria-label="Abrir menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {isOpen && (
          <div 
            id="mobile-drawer-menu"
            className="lg:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-lg border-b border-slate-100 shadow-xl py-6 px-6 space-y-4 flex flex-col items-center animate-fadeIn"
          >
            <button 
              id="btn-mob-nav-specialties"
              onClick={() => scrollToSection('specialties-section')} 
              className="text-slate-800 font-semibold text-base hover:text-sky-600 py-1"
            >
              Especialidades
            </button>
            <button 
              id="btn-mob-nav-slider"
              onClick={() => scrollToSection('before-after-section')} 
              className="text-slate-800 font-semibold text-base hover:text-sky-600 py-1"
            >
              Antes & Depois
            </button>
            <button 
              id="btn-mob-nav-quiz"
              onClick={() => scrollToSection('quiz-section')} 
              className="text-slate-800 font-semibold text-base hover:text-sky-600 py-1"
            >
              Simulador de Sorriso
            </button>
            <button 
              id="btn-mob-nav-testimonials"
              onClick={() => scrollToSection('testimonials-section')} 
              className="text-slate-800 font-semibold text-base hover:text-sky-600 py-1"
            >
              Depoimentos
            </button>
            <button 
              id="btn-mob-nav-doctors"
              onClick={() => scrollToSection('doctors-section')} 
              className="text-slate-800 font-semibold text-base hover:text-sky-600 py-1"
            >
              Equipe Médica
            </button>
            <button 
              id="btn-mob-nav-faq"
              onClick={() => scrollToSection('faq-section')} 
              className="text-slate-800 font-semibold text-base hover:text-sky-600 py-1"
            >
              Dúvidas
            </button>

            <div className="w-full h-[1px] bg-slate-100 my-2"></div>

            <a 
              id="btn-mob-call-cta"
              href="tel:1149508822"
              className="flex items-center space-x-2 text-slate-700 font-bold"
            >
              <Phone className="w-4 h-4 text-sky-500" />
              <span>(11) 4950-8822</span>
            </a>

            <button
              id="btn-mob-schedule-cta"
              onClick={() => scrollToSection('booking-section')}
              className="w-full bg-sky-600 hover:bg-sky-700 text-white py-3 rounded-full font-bold text-center transition shadow-md block"
            >
              Agendar Consulta Grátis
            </button>
          </div>
        )}
      </nav>
    </header>
  );
}
