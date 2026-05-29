import React from 'react';
import { Smile, Phone, Mail, MapPin, Clock, ArrowUp, CalendarDays } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer 
      id="footer-section" 
      className="bg-slate-900 text-slate-400 py-16 md:py-20 border-t border-slate-800"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-12 gap-12">
        
        {/* Col 1: Brand & Bio (4 columns) */}
        <div id="footer-brand" className="md:col-span-4 space-y-5">
          <div className="flex items-center space-x-2">
            <div className="bg-sky-600 p-2 rounded-xl text-white shadow-md">
              <Smile className="w-5 h-5" />
            </div>
            <div>
              <span className="font-sans font-bold text-base text-white tracking-tight block leading-none">
                Sorriso & Saúde
              </span>
              <span className="font-mono text-[9px] uppercase tracking-widest text-sky-400 block mt-0.5">
                Odontologia Integrada
              </span>
            </div>
          </div>
          
          <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
            Nossa missão é prestar um atendimento humanizado, odontologia especializada de alto padrão e tratamentos com tecnologia de ponta para que você volte a sorrir com plenitude e segurança.
          </p>

          <div className="text-[10px] text-slate-500 font-mono space-y-1">
            <p>Clínica Registrada: CRO-SP 14.522</p>
            <p>Diretor Técnico: Dr. Roberto Takahashi • CRO-SP 98.711</p>
          </div>
        </div>

        {/* Col 2: Useful Links (3 columns) */}
        <div id="footer-middle-links" className="md:col-span-3 space-y-4">
          <h4 className="font-sans font-bold text-sm text-white uppercase tracking-wider">Acesso Rápido</h4>
          <ul className="space-y-2.5 text-xs text-slate-400 font-medium">
            <li>
              <a href="#specialties-section" className="hover:text-sky-400 transition">Especialidades Médicas</a>
            </li>
            <li>
              <a href="#before-after-section" className="hover:text-sky-400 transition">Antes e Depois</a>
            </li>
            <li>
              <a href="#quiz-section" className="hover:text-sky-400 transition">Simulador de Tratamento</a>
            </li>
            <li>
              <a href="#testimonials-section" className="hover:text-sky-400 transition">Avaliação dos Pacientes</a>
            </li>
            <li>
              <a href="#doctors-section" className="hover:text-sky-400 transition">Corpo Clínico Associado</a>
            </li>
            <li>
              <a href="#faq-section" className="hover:text-sky-400 transition">Dúvidas Gerais</a>
            </li>
          </ul>
        </div>

        {/* Col 3: Contacts & Hours of operation (5 columns) */}
        <div id="footer-contacts" className="md:col-span-5 space-y-6">
          <h4 className="font-sans font-bold text-sm text-white uppercase tracking-wider">Contato & Localização</h4>
          
          <div className="space-y-3 text-xs md:text-sm text-slate-400">
            <div className="flex items-start space-x-2.5">
              <MapPin className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
              <span>Av. Paulista, 1000 - Cerqueira César, São Paulo - SP, 01310-100 (Ao lado do metrô Brigadeiro com estacionamento conveniado)</span>
            </div>

            <div className="flex items-center space-x-2.5">
              <Phone className="w-4 h-4 text-sky-500 shrink-0" />
              <span>PABX: (11) 4950-8822 • Urgências: (11) 99988-7711</span>
            </div>

            <div className="flex items-center space-x-2.5">
              <Mail className="w-4 h-4 text-sky-500 shrink-0" />
              <span>contato@sorrisosaudelanding.com.br</span>
            </div>

            <div className="flex items-start space-x-2.5 pt-2 border-t border-slate-800">
              <Clock className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-300">Horário de Funcionamento:</p>
                <p className="mt-0.5">Segunda a Sexta: 08:00h - 20:00h</p>
                <p>Sábados: 08:00h - 14:00h</p>
                <p className="text-sky-400 font-bold mt-1 max-w-xs">Plantão Odontológico de Urgência 24h via WhatsApp</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Extreme bottom layer with copyright & Scroll to high conversion key */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 gap-4">
        <div>
          <p>© {currentYear} Sorriso & Saúde. Todos os direitos reservados / Agencia Stc Mobile / Sydney Caiaffa.</p>
          <p className="mt-1">Feito de acordo com as diretrizes éticas do CFO (Conselho Federal de Odontologia).</p>
        </div>

        <div className="flex items-center space-x-4">
          <button
            id="footer-btn-scroll-top"
            onClick={scrollToTop}
            className="bg-slate-800 hover:bg-slate-750 text-slate-300 p-2.5 rounded-full transition cursor-pointer flex items-center justify-center border border-slate-700 hover:border-slate-500"
            aria-label="Voltar ao início"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}
