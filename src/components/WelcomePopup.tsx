import React, { useState, useEffect } from 'react';
import { X, Phone, ShieldCheck, ExternalLink, Sparkles } from 'lucide-react';

export default function WelcomePopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Show the popup on load after a brief delay for a smoother entrance animation
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-fadeIn"
      style={{ animationDuration: '300ms' }}
    >
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 transform translate-y-0 scale-100 transition-all duration-300 md:max-w-md"
        id="welcome-popup-container"
      >
        {/* Decorative Top Accent */}
        <div className="h-2 bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600" />

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-full transition cursor-pointer z-10"
          title="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8 pb-7">
          {/* Developer Identity / Badge */}
          <div className="flex items-center space-x-2 text-sky-600 mb-6 bg-sky-50 py-1.5 px-3.5 rounded-full w-fit">
            <Sparkles className="w-4 h-4 text-sky-500 animate-pulse" />
            <span className="text-[10px] font-extrabold uppercase tracking-widest">
              Desenvolvedor Oficial
            </span>
          </div>

          {/* Main Title */}
          <h3 className="font-sans font-extrabold text-xl text-slate-950 tracking-tight leading-snug mb-4">
            Seja bem-vindo ao nosso Portal!
          </h3>

          {/* Content Message */}
          <div className="space-y-4 text-slate-600 text-sm leading-relaxed font-normal">
            <p className="text-slate-700 bg-slate-50/80 border border-slate-100 p-4 rounded-2xl italic font-medium text-center shadow-xs">
              "Olá, este Portal de Clínica Odontológica foi desenvolvido pela{' '}
              <strong className="text-slate-950 font-bold">Agência Stc Mobile</strong> /{' '}
              <strong className="text-slate-950 font-bold">Sydney Caiaffa</strong> /{' '}
              <span className="text-sky-600 font-bold whitespace-nowrap">WhatsApp: 11-98493-7529</span>."
            </p>

            <p className="text-xs text-slate-500">
              Sinta-se à vontade para navegar, simular tratamentos em nosso quiz de sorriso, ver históricos de resultados Reais (Antes e Depois) e fazer agendamentos diretos em tempo real!
            </p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8 pt-4 border-t border-slate-150">
            <button
              onClick={handleClose}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold py-3 px-4 rounded-xl text-xs transition cursor-pointer text-center"
            >
              Navegar no Portal
            </button>
            <a
              href="https://wa.me/5511984937529?text=Ol%C3%A1%20Sydney%2C%20vi%20o%20portal%20odontol%C3%B3gico%20e%20gostaria%20de%20falar%20sobre%20um%20projeto."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-extrabold py-3 px-4 rounded-xl text-xs transition cursor-pointer text-center flex items-center justify-center space-x-1.5 shadow-md shadow-green-100"
            >
              <Phone className="w-3.5 h-3.5 shrink-0" />
              <span>Falar pelo WhatsApp</span>
              <ExternalLink className="w-3 h-3 opacity-80 shrink-0" />
            </a>
          </div>

          {/* Footer Watermark */}
          <div className="mt-5 text-center flex items-center justify-center space-x-1.5 text-[10px] text-slate-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-sky-500" />
            <span>Código Homologado & Seguro - Stc Mobile</span>
          </div>
        </div>
      </div>
    </div>
  );
}
