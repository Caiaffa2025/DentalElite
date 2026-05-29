import React, { useState } from 'react';
import { faqs } from '../data';
import { ChevronDown, HelpCircle, PhoneCall } from 'lucide-react';

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggleFAQ = (idx: number) => {
    if (openIdx === idx) {
      setOpenIdx(null);
    } else {
      setOpenIdx(idx);
    }
  };

  return (
    <section 
      id="faq-section" 
      className="py-20 md:py-24 bg-slate-50"
    >
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        
        {/* Header Block */}
        <div id="faq-header" className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <span className="text-sky-600 uppercase tracking-widest text-xs font-bold block">
            Dúvidas Frequentes
          </span>
          <h2 id="faq-title" className="text-3xl md:text-4xl font-sans font-extrabold text-slate-950 tracking-tight">
            Perguntas & Respostas Clínicas
          </h2>
          <p id="faq-description" className="text-slate-600 text-sm md:text-base leading-relaxed">
            Entenda como funciona o atendimento, convênios de saúde bucal, anestesias e formas de pagamento em nossa clínica associada.
          </p>
        </div>

        {/* Accordion container */}
        <div 
          id="faq-accordion-container"
          className="bg-white rounded-3xl border border-slate-200/40 divide-y divide-slate-100 overflow-hidden shadow-xl"
        >
          {faqs.map((f, idx) => (
            <div 
              key={idx}
              id={`faq-item-${idx}`}
              className="transition duration-300"
            >
              <button
                type="button"
                id={`btn-faq-toggle-${idx}`}
                onClick={() => toggleFAQ(idx)}
                className="w-full text-left py-5 px-6 flex justify-between items-center bg-transparent cursor-pointer hover:bg-slate-50/50 transition duration-300"
              >
                <div className="flex items-start space-x-3 pr-4">
                  <HelpCircle className="w-5 h-5 text-sky-600 mt-0.5 shrink-0" />
                  <span className="font-sans font-bold text-sm md:text-base text-slate-950 leading-snug">
                    {f.question}
                  </span>
                </div>
                <div 
                  className={`w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center shrink-0 transition-transform duration-300 ${
                    openIdx === idx ? 'transform rotate-180 bg-sky-100 text-sky-700' : 'text-slate-500'
                  }`}
                >
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>

              {/* Collapsed view body content */}
              <div 
                className={`transition-all duration-300 overflow-hidden ${
                  openIdx === idx ? 'max-h-[300px] border-t border-slate-100/50' : 'max-h-0'
                }`}
              >
                <div className="p-6 text-xs md:text-sm text-slate-600 leading-relaxed bg-slate-50/50">
                  {f.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Secondary support callback box */}
        <div 
          id="faq-custom-callback-box"
          className="mt-12 bg-gradient-to-r from-slate-950 to-sky-950 rounded-3xl p-6 md:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="space-y-2">
            <h4 className="font-sans font-bold text-lg md:text-xl text-white">Sua dúvida não está na lista acima?</h4>
            <p className="text-xs md:text-sm text-sky-200/80 leading-relaxed">
              Não se preocupe! Fale diretamente com nossa central de triagem bucal por telefone ou WhatsApp e tire suas dúvidas com uma de nossas recepcionistas.
            </p>
          </div>

          <a
            id="faq-btn-whatsapp-direct"
            href="https://wa.me/5511984937529?text=Olá,%20gostaria%20de%20esclarecer%20algumas%20dúvidas!"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm px-6 py-3.5 rounded-xl transition cursor-pointer flex items-center space-x-2 shrink-0 justify-center w-full md:w-auto"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Falar com Atendente</span>
          </a>
        </div>

      </div>
    </section>
  );
}
