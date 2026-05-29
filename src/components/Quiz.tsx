import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { quizQuestions } from '../data';
import { Lead } from '../types';
import { Sparkles, ArrowRight, CircleAlert, Trophy, ShieldCheck, Mail, Phone, User, CalendarDays } from 'lucide-react';

export default function Quiz() {
  const { addLead } = useAdmin();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  
  // Lead Capture info
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [submittedLead, setSubmittedLead] = useState(false);

  const handleSelectOption = (value: string) => {
    const updated = [...answers, value];
    setAnswers(updated);
    
    if (currentStep < quizQuestions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsFinished(true);
    }
  };

  const currentQuestion = quizQuestions[currentStep];

  const handleReset = () => {
    setCurrentStep(0);
    setAnswers([]);
    setIsFinished(false);
    setSubmittedLead(false);
    setLeadName('');
    setLeadPhone('');
    setLeadEmail('');
  };

  const getTreatmentRecommendation = () => {
    // Basic logic mapping answers to recommended category
    // Based on first answer mainly
    const firstAns = answers[0];
    if (firstAns === 'ortodontia') {
      return {
        title: 'Alinhadores Invisíveis Invisalign®',
        info: 'O tratamento perfeito para alinhar seus dentes com discrição, rapidez e tecnologia 3D. Totalmente removíveis e livres de dores.',
        badge: 'Ortodontia Avançada',
        specialtyId: 'ortodontia'
      };
    } else if (firstAns === 'implantes') {
      return {
        title: 'Implante Dentário Tecnológico de Carga Imediata',
        info: 'Recuperação impecável de 100% da sua força de mordida em prazo mínimo. Tecnologia alemã sem cortes com bisturi.',
        badge: 'Implantodontia Segura',
        specialtyId: 'implantes'
      };
    } else if (firstAns === 'estetica') {
      return {
        title: 'Lentes de Contato ou Clareamento Violeta Premium',
        info: 'Indicado para reconstruir a simetria, cor branca e formato impecável dos dentes com desgaste mínimo.',
        badge: 'Odontologia Estética',
        specialtyId: 'estetica'
      };
    } else {
      return {
        title: 'Check-up Preventivo Preventivo & Limpeza Ultrassônica',
        info: 'Tratamento imediato contra dores, cáries ou sensibilidades com profilaxia profunda e polimento coronário.',
        badge: 'Clínica Geral / Endodontia',
        specialtyId: 'canal-estetica'
      };
    }
  };

  const handleRegisterLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName || !leadPhone) {
      alert('Por favor, preencha nome e telefone de contato.');
      return;
    }
    setSubmittedLead(true);
    
    // Create lead object and submit to persistent global state
    const newLead: Lead = {
      id: 'LD-' + Date.now().toString().slice(-6),
      name: leadName,
      phone: leadPhone,
      email: leadEmail || undefined,
      recommendedTreatment: getTreatmentRecommendation().title,
      recommendedSpecialtyId: getTreatmentRecommendation().specialtyId,
      createdAt: new Date().toISOString(),
      answers: answers
    };
    addLead(newLead);

    // Persist lead details to local storage so other components (like booking form) can load them!
    localStorage.setItem('temp_lead_name', leadName);
    localStorage.setItem('temp_lead_phone', leadPhone);
    localStorage.setItem('temp_lead_email', leadEmail);
    localStorage.setItem('preselected_specialty', getTreatmentRecommendation().specialtyId);
    window.dispatchEvent(new Event('specialty_changed'));
  };

  const scrollToBooking = () => {
    const element = document.getElementById('booking-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      id="quiz-section" 
      className="py-20 md:py-24 bg-gradient-to-tr from-slate-950 via-sky-950 to-slate-900 text-white relative overflow-hidden"
    >
      {/* Background vectors */}
      <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-sky-550/10 rounded-full blur-3xl -translate-y-1/2 pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-4 md:px-8">
        
        {/* Header Block */}
        <div id="quiz-heading-block" className="text-center mb-12 space-y-4">
          <span className="bg-sky-800 text-sky-300 font-mono text-[10px] md:text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full inline-block">
            Simulador Clínico Inteligente
          </span>
          <h2 id="quiz-title" className="text-2xl md:text-3.5xl font-sans font-extrabold tracking-tight">
            Descubra o Tratamento Ideal para o seu Sorriso
          </h2>
          <p id="quiz-subtitle" className="text-sky-100/70 text-xs md:text-sm max-w-xl mx-auto">
            Responda a estas 3 perguntas simples em menos de 1 minuto para receber uma recomendação personalizada dos nossos especialistas.
          </p>
        </div>

        {/* Dynamic Quiz Card */}
        <div 
          id="quiz-card-root"
          className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/10 p-6 md:p-10 shadow-2xl relative"
        >
          {!isFinished ? (
            /* Active Progress Questions Block */
            <div id="quiz-step-active-content" className="space-y-6 md:space-y-8 animate-fadeIn">
              {/* Step counter bar */}
              <div className="flex justify-between items-center text-xs text-sky-300 font-bold font-mono">
                <span>Passo {currentQuestion.id} de {quizQuestions.length}</span>
                <span className="bg-sky-500/20 px-2.5 py-1 rounded-md border border-sky-500/20">
                  {Math.round(((currentQuestion.id - 1) / quizQuestions.length) * 100)}% concluído
                </span>
              </div>
              <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-sky-400 h-full transition-all duration-300"
                  style={{ width: `${(currentQuestion.id / quizQuestions.length) * 100}%` }}
                ></div>
              </div>

              {/* Title Question */}
              <h3 className="font-sans font-bold text-lg md:text-xl text-white tracking-normal mt-4">
                {currentQuestion.question}
              </h3>

              {/* Radio options container */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    id={`btn-quiz-option-${currentQuestion.id}-${index}`}
                    onClick={() => handleSelectOption(option.value)}
                    className="w-full text-left bg-white/5 hover:bg-sky-650/30 border border-white/10 hover:border-sky-500/40 p-4 rounded-2xl cursor-pointer transition-all duration-300 text-sm font-medium hover:scale-[1.01]"
                  >
                    <span className="inline-flex items-center justify-center bg-white/10 w-6 h-6 rounded-lg text-sky-300 font-mono text-xs font-bold mr-3">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="text-sky-50">{option.text}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Finished quiz - Leads and recommendation result block */
            <div id="quiz-recommendation-block" className="space-y-8 animate-fadeIn">
              {!submittedLead ? (
                /* Form capturing details */
                <form id="lead-capturing-form" onSubmit={handleRegisterLead} className="space-y-6 max-w-md mx-auto">
                  <div className="text-center space-y-2">
                    <div className="mx-auto w-12 h-12 bg-sky-500/20 text-sky-400 rounded-full flex items-center justify-center">
                      <Trophy className="w-6 h-6" />
                    </div>
                    <h3 className="font-sans font-extrabold text-xl">Resultado Pronto!</h3>
                    <p className="text-xs text-sky-100/70">
                      Preencha os campos abaixo para desbloquear seu parecer clínico e ganhar 15% de desconto na primeira avaliação de diagnóstico digital.
                    </p>
                  </div>

                  <div className="space-y-4 pt-2">
                    <div className="relative">
                      <label className="text-xs text-sky-200 block mb-1 font-semibold">Nome Completo</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-300/65" />
                        <input 
                          type="text" 
                          id="input-lead-name"
                          required
                          value={leadName}
                          onChange={(e) => setLeadName(e.target.value)}
                          placeholder="Ex: Carlos Alberto Silva"
                          className="w-full bg-white/5 border border-white/15 rounded-xl pl-12 pr-4 py-3 placeholder-sky-200/30 text-white text-sm focus:outline-hidden focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
                        />
                      </div>
                    </div>

                    <div className="relative">
                      <label className="text-xs text-sky-200 block mb-1 font-semibold">WhatsApp de Contato</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-300/65" />
                        <input 
                          type="tel" 
                          id="input-lead-phone"
                          required
                          value={leadPhone}
                          onChange={(e) => setLeadPhone(e.target.value)}
                          placeholder="Ex: (11) 99999-5522"
                          className="w-full bg-white/5 border border-white/15 rounded-xl pl-12 pr-4 py-3 placeholder-sky-200/30 text-white text-sm focus:outline-hidden focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
                        />
                      </div>
                    </div>

                    <div className="relative">
                      <label className="text-xs text-sky-200 block mb-1 font-semibold">E-mail para confirmação (Opcional)</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-300/65" />
                        <input 
                          type="email" 
                          id="input-lead-email"
                          value={leadEmail}
                          onChange={(e) => setLeadEmail(e.target.value)}
                          placeholder="Ex: carlos@seuemail.com"
                          className="w-full bg-white/5 border border-white/15 rounded-xl pl-12 pr-4 py-3 placeholder-sky-200/30 text-white text-sm focus:outline-hidden focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    id="btn-submit-lead-quiz"
                    className="w-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold py-3.5 rounded-xl transition duration-300 text-center text-sm shadow-lg cursor-pointer"
                  >
                    Ver Meu Tratamento Recomendado
                  </button>
                </form>
              ) : (
                /* Display Result */
                <div id="final-quiz-recommendation-display" className="space-y-6 max-w-2xl mx-auto text-center font-sans">
                  <div className="inline-flex bg-sky-500 text-slate-950 rounded-full px-4 py-1.5 text-xs font-bold items-center space-x-1">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Incompatibilidade bucal descartada</span>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sky-200 text-xs font-mono font-bold uppercase tracking-widest">Recomendação Diagnóstica:</p>
                    <h3 className="text-2xl md:text-3xl font-sans font-extrabold text-white">
                      {getTreatmentRecommendation().title}
                    </h3>
                    <p className="text-sm text-sky-100/85 bg-white/5 px-6 py-4 rounded-xl max-w-xl mx-auto border border-white/10 leading-relaxed">
                      {getTreatmentRecommendation().info}
                    </p>
                  </div>

                  {/* Coupon card */}
                  <div className="bg-sky-900 border-2 border-dashed border-sky-400/50 p-6 rounded-2xl max-w-md mx-auto space-y-3">
                    <p className="text-[10px] text-sky-300 font-mono font-bold uppercase tracking-widest">Bônus Exclusivo desbloqueado</p>
                    <p className="text-2xl font-bold bg-slate-950 inline-block px-4 py-1.5 rounded-lg border border-slate-800">
                      CUPOM: SORRISODIGITAL15
                    </p>
                    <p className="text-xs text-sky-200">
                      <strong>15% de Desconto Real</strong> garantido no seu check-up odontológico com fotos e escaneamento digital 3D.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
                    <button
                      id="btn-quiz-jump-direct-booking"
                      onClick={scrollToBooking}
                      className="w-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold py-3 px-6 rounded-xl flex items-center justify-center space-x-2 transition cursor-pointer"
                    >
                      <CalendarDays className="w-4 h-4" />
                      <span>Agendar Próxima Data</span>
                    </button>
                    <button
                      id="btn-quiz-restart"
                      onClick={handleReset}
                      className="w-full bg-transparent hover:bg-white/5 border border-white/20 text-sky-100 py-3 px-6 rounded-xl text-sm font-semibold transition cursor-pointer"
                    >
                      Refazer Teste
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
