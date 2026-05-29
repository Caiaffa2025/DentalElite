import React from 'react';
import { Shield, Sparkles, Stethoscope, Star, CheckCircle, ArrowRight } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { EditableImageWrapper } from './AdminComponents';

export default function Hero() {
  const { heroDoctorImageUrl, updateHeroDoctorImage } = useAdmin();

  const scrollToBooking = () => {
    const element = document.getElementById('booking-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section 
      id="hero-section" 
      className="relative pt-32 pb-20 md:pt-44 md:pb-28 bg-gradient-to-b from-slate-50 via-sky-50/20 to-white overflow-hidden"
    >
      {/* Visual background details */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-sky-100/40 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-sky-100/20 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Direct value proposition and triggers */}
        <div id="hero-text-content" className="lg:col-span-7 space-y-6">
          {/* Urgent Social Proof Badge */}
          <div 
            id="badge-social-urgency"
            className="inline-flex items-center space-x-2 bg-sky-100 border border-sky-200 text-sky-800 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider animate-pulse"
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-600" />
            <span>AGENDA DE MAIO COM DESCONTO EM IMPLANTES E INVISALIGN</span>
          </div>

          <h1 
            id="hero-title"
            className="text-4 text-4xl md:text-5.5xl font-sans font-extrabold text-slate-900 tracking-tight leading-tight"
          >
            Seu melhor sorriso começa com <span className="text-sky-600 relative underline decoration-sky-450 decoration-2 underline-offset-4">tecnologia.</span>
          </h1>

          <p 
            id="hero-subtitle"
            className="text-base md:text-lg text-slate-600 max-w-xl leading-relaxed"
          >
            Referência em odontologia moderna. Tratamentos personalizados com as mais modernas técnicas de saúde bucal e odontologia estética. Agende sua consulta hoje mesmo.
          </p>

          {/* Core Conversion Panel */}
          <div id="hero-actions-container" className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-2">
            <button
              id="hero-btn-schedule-primary"
              onClick={scrollToBooking}
              className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-center px-8 py-4 rounded-xl text-base shadow-lg shadow-sky-100 hover:shadow-sky-200/50 hover:-translate-y-0.5 transition duration-300 flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Agendar Avaliação Online</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <a
              id="hero-btn-whatsapp-secondary"
              href="https://wa.me/5511984937529?text=Olá,%20gostaria%20de%20saber%20mais%20sobre%20os%20tratamentos%20da%20Sorriso%20e%20Saúde!"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-center px-6 py-4 rounded-xl text-base shadow-lg transition duration-300 flex items-center justify-center space-x-2"
            >
              <span>Falar Direto no WhatsApp</span>
            </a>
          </div>

          <div id="hero-trust-indicators" className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-slate-700 text-xs font-semibold">
            <div id="trust-indicator-pain" className="flex items-center space-x-2 bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
              <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
              <span>Anestesia Computadorizada (Zero Dor)</span>
            </div>
            <div id="trust-indicator-doctors" className="flex items-center space-x-2 bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
              <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
              <span>Corpo Clínico USP / Mestres</span>
            </div>
            <div id="trust-indicator-tech" className="flex items-center space-x-2 bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
              <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
              <span>Mapeamento 3D Digital Completo</span>
            </div>
          </div>

          {/* Real Google Rating Social Proof Badge */}
          <div id="hero-google-proof-badge" className="flex items-center space-x-3 pt-4 border-t border-slate-100/80">
            <div className="flex bg-amber-50 px-2 py-1 rounded border border-amber-200">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
              ))}
            </div>
            <span className="text-sm text-slate-600 block">
              Nota <strong>4.9 / 5.0</strong> no Google Reviews baseada em mais de <strong>1.450 depoimentos reais</strong> de pacientes.
            </span>
          </div>
        </div>

        {/* Right Column: Dynamic high converting medical showcase image with floating badges */}
        <div id="hero-interactive-showcase" className="lg:col-span-5 relative mt-6 lg:mt-0 flex justify-center">
          {/* Main Portrait Frame with visual shadows */}
          <div className="relative w-full max-w-sm aspect-square md:aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100">
            <EditableImageWrapper
              src={heroDoctorImageUrl}
              alt="Dra Mariana Vasconcellos na DentalElite"
              onSave={updateHeroDoctorImage}
              aspectClassName="aspect-square md:aspect-[4/5]"
              title="Trocar Foto da Doutora Principal (Hero)"
            />
            {/* Dark gradient overlay for modern editorial feel */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent p-6 text-white z-10 pointer-events-none">
              <p id="showcase-doctor-name" className="font-bold text-lg leading-tight">Dra. Mariana Vasconcellos</p>
              <p id="showcase-doctor-desc" className="text-xs text-sky-300 uppercase tracking-wider font-mono font-bold leading-normal">Mestre pela USP • Ortodontia</p>
            </div>
          </div>

          {/* Floating Action Badge 1: 3D Technology */}
          <div 
            id="floating-badge-tech"
            className="absolute top-8 -left-6 md:-left-12 bg-white border border-slate-100 p-4 rounded-2xl shadow-xl flex items-center space-x-3 max-w-[190px] animate-bounce-slow"
          >
            <div className="bg-sky-100 p-2.5 rounded-xl text-sky-700">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800 leading-none">Invisalign®</p>
              <p className="text-[10px] text-slate-500 mt-1">Simulação 3D instantânea</p>
            </div>
          </div>

          {/* Floating Action Badge 2: Complete Rebuilding */}
          <div 
            id="floating-badge-safety"
            className="absolute bottom-8 -right-4 md:-right-6 bg-white border border-slate-100 p-4 rounded-2xl shadow-xl flex items-center space-x-3 max-w-[210px]"
          >
            <div className="bg-sky-100 p-2.5 rounded-xl text-sky-700">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800 leading-none">Segurança Total</p>
              <p className="text-[10px] text-slate-500 mt-1">Materiais com garantia vitalícia</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
