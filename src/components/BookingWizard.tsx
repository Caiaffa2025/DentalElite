import React, { useState, useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import { specialties } from '../data';
import { Specialty, Doctor, Booking } from '../types';
import { 
  Calendar, Clock, User, CheckCircle2, ChevronRight, ChevronLeft, 
  Stethoscope, Smartphone, Sparkles, Smile, ShieldCheck, ExternalLink, CalendarDays
} from 'lucide-react';

export default function BookingWizard() {
  const { doctors, addBooking } = useAdmin();
  const [step, setStep] = useState<number>(1);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('');
  const [selectedDoctor, setSelectedDoctor] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedPeriod, setSelectedPeriod] = useState<'manha' | 'tarde' | 'noite'>('manha');
  const [selectedHour, setSelectedHour] = useState<string>('');

  
  // Lead info
  const [patientName, setPatientName] = useState<string>('');
  const [patientPhone, setPatientPhone] = useState<string>('');
  const [patientEmail, setPatientEmail] = useState<string>('');
  const [patientNotes, setPatientNotes] = useState<string>('');

  const [bookingConfirmed, setBookingConfirmed] = useState<Booking | null>(null);

  // Sync with preselected specialties in Specialties.tsx or Quiz.tsx
  useEffect(() => {
    const checkPreselection = () => {
      const storedSpec = localStorage.getItem('preselected_specialty');
      if (storedSpec) {
        setSelectedSpecialty(storedSpec);
        // Pre-fill doctor for that specialty automatically
        const docForSpec = doctors.find(d => d.specialtyId === storedSpec);
        if (docForSpec) {
          setSelectedDoctor(docForSpec.id);
        }
      }
      
      // Pre-fill student leads if available in localStorage
      const tempName = localStorage.getItem('temp_lead_name');
      const tempPhone = localStorage.getItem('temp_lead_phone');
      const tempEmail = localStorage.getItem('temp_lead_email');
      
      if (tempName) setPatientName(tempName);
      if (tempPhone) setPatientPhone(tempPhone);
      if (tempEmail) setPatientEmail(tempEmail);
    };

    checkPreselection();
    window.addEventListener('specialty_changed', checkPreselection);
    return () => window.removeEventListener('specialty_changed', checkPreselection);
  }, []);

  // Filter doctors based on selected specialty
  const availableDoctors = doctors.filter(doc => !selectedSpecialty || doc.specialtyId === selectedSpecialty);

  // Pick suitable dates (simulating business days)
  const getNextAvailableDates = () => {
    const dates = [];
    const today = new Date();
    let count = 0;
    while (count < 6) {
      today.setDate(today.getDate() + 1);
      // Skip Sundays (0)
      if (today.getDay() !== 0) {
        dates.push({
          formattedDisplay: today.toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' }),
          rawDate: today.toISOString().split('T')[0],
          dayOfWeek: today.getDay()
        });
        count++;
      }
    }
    return dates;
  };

  const datesList = getNextAvailableDates();

  // Simulated live available hours based on selected period
  const getHoursForPeriod = () => {
    if (selectedPeriod === 'manha') {
      return ['08:30', '09:00', '09:45', '10:30', '11:15'];
    } else if (selectedPeriod === 'tarde') {
      return ['13:30', '14:15', '15:00', '16:15', '17:00'];
    } else {
      return ['18:00', '18:45', '19:15'];
    }
  };

  const hoursList = getHoursForPeriod();

  const handleNextStep = () => {
    if (step === 1 && !selectedSpecialty) {
      alert('Selecione uma especialidade para continuar.');
      return;
    }
    if (step === 2 && !selectedDoctor) {
      alert('Por favor, selecione seu médico especialista.');
      return;
    }
    if (step === 3 && (!selectedDate || !selectedHour)) {
      alert('Selecione a data e o horário desejados.');
      return;
    }
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const handleFinalizeBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !patientPhone || !patientEmail) {
      alert('Favor preencher todos os campos obrigatórios.');
      return;
    }

    const uniqueId = 'BO-' + Math.floor(100000 + Math.random() * 900000);
    const mockBooking: Booking = {
      id: uniqueId,
      specialtyId: selectedSpecialty,
      doctorId: selectedDoctor,
      date: selectedDate,
      period: selectedPeriod,
      timeSlot: selectedHour,
      patientName,
      patientPhone,
      patientEmail,
      patientNotes,
      createdAt: new Date().toISOString()
    };

    setBookingConfirmed(mockBooking);
    addBooking(mockBooking);
    setStep(5);

    // Add to simulated booking notifications stream so user gets a real sense of dynamic clinic interaction!
    const customNotificationEvent = new CustomEvent('new_booking_event', {
      detail: {
        name: patientName,
        treatment: specialties.find(s => s.id === selectedSpecialty)?.name || 'Tratamento Estético'
      }
    });
    window.dispatchEvent(customNotificationEvent);
  };

  const handleReset = () => {
    setStep(1);
    setSelectedSpecialty('');
    setSelectedDoctor('');
    setSelectedDate('');
    setSelectedHour('');
    setPatientName('');
    setPatientPhone('');
    setPatientEmail('');
    setPatientNotes('');
    setBookingConfirmed(null);
  };

  // Get info for summary
  const selectedSpecObj = specialties.find(s => s.id === selectedSpecialty);
  const selectedDocObj = doctors.find(d => d.id === selectedDoctor);

  // Generate WhatsApp text for direct scheduling sync
  const getWhatsAppURL = () => {
    if (!bookingConfirmed) return '';
    const text = `Perfeito! Confirmação de Agendamento Online *Sorriso & Saúde*:\n\n` +
      `📌 *ID:* ${bookingConfirmed.id}\n` +
      `👤 *Paciente:* ${bookingConfirmed.patientName}\n` +
      `🩺 *Especialidade:* ${selectedSpecObj?.name}\n` +
      `👨‍⚕️ *Especialista:* ${selectedDocObj?.name}\n` +
      `📅 *Data:* ${new Date(bookingConfirmed.date).toLocaleDateString('pt-BR', {day: 'numeric', month: 'long', year: 'numeric'})}\n` +
      `⏰ *Horário:* ${bookingConfirmed.timeSlot}\n\n` +
      `Gostaria de formalizar meu pré-agendamento no sistema.`;
    return `https://wa.me/5511984937529?text=${encodeURIComponent(text)}`;
  };

  return (
    <section 
      id="booking-section" 
      className="py-20 md:py-24 bg-slate-50 scroll-mt-12"
    >
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        
        {/* Header Title */}
        <div id="booking-header" className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="text-sky-600 uppercase tracking-widest text-xs font-bold block">
            Praticidade Absoluta
          </span>
          <h2 id="booking-title" className="text-3xl md:text-4xl font-sans font-extrabold text-slate-950 tracking-tight">
            Consulte a Agenda e Agende Online
          </h2>
          <p id="booking-subtitle" className="text-slate-600 text-sm md:text-base">
            Selecione a especialidade, o especialista de sua preferência e agende sua consulta imediatamente, sem filas ou burocracia.
          </p>
        </div>

        {/* Wizard Panel */}
        <div 
          id="booking-wizard-card"
          className="bg-white rounded-3xl border border-slate-100 shadow-2xl p-6 md:p-10 relative overflow-hidden"
        >
          {/* Progress bar and indicators */}
          {step <= 4 && (
            <div id="booking-progress-section" className="mb-10">
              <div className="flex justify-between items-center text-xs text-slate-500 font-bold uppercase tracking-wider font-mono mb-4">
                <span>Passo {step} de 4</span>
                <span className="text-sky-600">
                  {step === 1 ? 'Especialidade' : step === 2 ? 'Especialista' : step === 3 ? 'Data e Hora' : 'Dados Pessoais'}
                </span>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full flex overflow-hidden">
                <div 
                  className="bg-sky-600 h-full transition-all duration-500"
                  style={{ width: `${(step / 4) * 100}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* STEP 1: Specialty Selection */}
          {step === 1 && (
            <div id="booking-step-1" className="space-y-6 animate-fadeIn">
              <h3 className="font-sans font-bold text-lg md:text-xl text-slate-900 border-l-4 border-sky-500 pl-3">
                Qual especialidade ou tratamento você busca?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {specialties.map((spec) => (
                  <label
                    key={spec.id}
                    id={`label-booking-specialty-${spec.id}`}
                    className={`p-4 rounded-2xl border transition-all duration-300 flex items-start space-x-3 cursor-pointer ${
                      selectedSpecialty === spec.id
                        ? 'bg-sky-50 border-sky-500 ring-2 ring-sky-500/20'
                        : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  >
                    <input
                      type="radio"
                      name="specialty"
                      value={spec.id}
                      checked={selectedSpecialty === spec.id}
                      onChange={() => {
                        setSelectedSpecialty(spec.id);
                        // Auto pre-fill default doctor for that specialty
                        const firstDoc = doctors.find(doc => doc.specialtyId === spec.id);
                        if (firstDoc) setSelectedDoctor(firstDoc.id);
                      }}
                      className="accent-sky-600 h-4 w-4 mt-1"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-slate-950 text-sm md:text-base leading-tight">{spec.name}</p>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{spec.shortDescription}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Specialist selection */}
          {step === 2 && (
            <div id="booking-step-2" className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between">
                <h3 className="font-sans font-bold text-lg md:text-xl text-slate-900 border-l-4 border-sky-500 pl-3">
                  Escolha o especialista responsável:
                </h3>
                <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-md font-medium">
                  {selectedSpecObj?.name}
                </span>
              </div>

              {availableDoctors.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {availableDoctors.map((doc) => (
                    <label
                      key={doc.id}
                      id={`label-booking-doctor-${doc.id}`}
                      className={`p-5 rounded-3xl border transition-all duration-300 flex flex-col md:flex-row items-center gap-4 cursor-pointer text-center md:text-left ${
                        selectedDoctor === doc.id
                          ? 'bg-sky-50 border-sky-500 ring-2 ring-sky-500/20'
                          : 'bg-white hover:bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center space-x-3 w-full self-start md:w-auto">
                        <input
                          type="radio"
                          name="doctor"
                          value={doc.id}
                          checked={selectedDoctor === doc.id}
                          onChange={() => setSelectedDoctor(doc.id)}
                          className="accent-sky-600 h-4 w-4 shrink-0"
                        />
                        <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 border-2 border-white shadow-md mx-auto md:mx-0">
                          <img 
                            src={doc.imageUrl} 
                            alt={doc.name} 
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-900 text-sm md:text-base leading-tight">{doc.name}</p>
                        <p className="text-xs text-sky-600 font-bold mt-1 font-mono">{doc.cro}</p>
                        <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">{doc.bio}</p>
                      </div>
                    </label>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-sm italic">Nenhum especialista cadastrado para esta modalidade.</p>
              )}
            </div>
          )}

          {/* STEP 3: Date & hour list picker */}
          {step === 3 && (
            <div id="booking-step-3" className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h3 className="font-sans font-bold text-lg md:text-xl text-slate-900 border-l-4 border-sky-500 pl-3">
                  Selecione Data e Horário sugeridos:
                </h3>
                <span className="text-xs text-slate-650 bg-sky-50 px-3 py-1 rounded-md font-mono font-bold">
                  Com Dr(a). {selectedDocObj?.name.split(' ').slice(1,3).join(' ')}
                </span>
              </div>

              {/* Day selection grid */}
              <div className="space-y-3">
                <p className="text-xs text-slate-500 font-semibold mb-1 uppercase tracking-wider font-mono">Dias disponíveis na próxima semana:</p>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {datesList.map((dt) => (
                    <button
                      key={dt.rawDate}
                      id={`btn-booking-date-${dt.rawDate}`}
                      type="button"
                      onClick={() => {
                        setSelectedDate(dt.rawDate);
                        setSelectedHour(''); // reset hour to force selection
                      }}
                      className={`py-3 px-2 rounded-xl border text-center transition cursor-pointer flex flex-col justify-center items-center ${
                        selectedDate === dt.rawDate
                          ? 'bg-sky-600 border-sky-600 text-white shadow-md shadow-sky-100'
                          : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      <span className="text-[10px] md:text-xs uppercase font-mono tracking-widest font-bold opacity-85">
                        {dt.formattedDisplay.split(' ')[0]}
                      </span>
                      <span className="text-sm md:text-base font-sans font-extrabold mt-1">
                        {dt.formattedDisplay.split(' ')[1]} {dt.formattedDisplay.split(' ')[2]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Hour periods and slots selection */}
              {selectedDate && (
                <div className="space-y-4 pt-2 border-t border-slate-100 animate-fadeIn">
                  <div className="flex space-x-2">
                    {(['senha', 'tarde', 'noite'] as const).map((p) => {
                      const computedLabel = p === 'senha' ? 'manha' : p;
                      return (
                        <button
                          key={computedLabel}
                          id={`btn-booking-period-${computedLabel}`}
                          type="button"
                          onClick={() => {
                            setSelectedPeriod(computedLabel === 'manha' ? 'manha' : computedLabel);
                            setSelectedHour('');
                          }}
                          className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition cursor-pointer ${
                            selectedPeriod === computedLabel
                              ? 'bg-slate-900 text-white'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {computedLabel === 'manha' ? 'Manhã' : computedLabel === 'tarde' ? 'Tarde' : 'Noite'}
                        </button>
                      );
                    })}
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider font-mono">Pesquisa de horários de atendimento:</p>
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                      {hoursList.map((hr) => (
                        <button
                          key={hr}
                          id={`btn-booking-hour-${hr}`}
                          type="button"
                          onClick={() => setSelectedHour(hr)}
                          className={`py-2 px-3 rounded-lg border text-center font-mono font-bold text-sm transition cursor-pointer ${
                            selectedHour === hr
                              ? 'bg-sky-500 border-sky-500 text-slate-950 ring-2 ring-sky-500/20'
                              : 'bg-white hover:bg-sky-50 border-slate-200 text-slate-700'
                          }`}
                        >
                          {hr}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 4: Personal Information & Form Inputs */}
          {step === 4 && (
            <form id="booking-finalize-form" onSubmit={handleFinalizeBooking} className="space-y-6 animate-fadeIn">
              <h3 className="font-sans font-bold text-lg md:text-xl text-slate-900 border-l-4 border-sky-500 pl-3">
                Preencha seus dados para finalizar o agendamento:
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Nome Completo *</label>
                  <input
                    type="text"
                    required
                    id="input-booking-name"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="Ex: Carlos Alberto Silva"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 placeholder-slate-400 text-sm focus:outline-hidden focus:border-sky-650 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Celular / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    id="input-booking-phone"
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    placeholder="Ex: (11) 99999-5566"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 placeholder-slate-400 text-sm focus:outline-hidden focus:border-sky-600 focus:bg-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-700 block mb-1">E-mail de Confirmação *</label>
                  <input
                    type="email"
                    required
                    id="input-booking-email"
                    value={patientEmail}
                    onChange={(e) => setPatientEmail(e.target.value)}
                    placeholder="Ex: carlos@email.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 placeholder-slate-400 text-sm focus:outline-hidden focus:border-sky-600 focus:bg-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Observações Clínicas ou Sintomas (Opcional)</label>
                  <textarea
                    rows={3}
                    id="input-booking-notes"
                    value={patientNotes}
                    onChange={(e) => setPatientNotes(e.target.value)}
                    placeholder="Ex: Sinto sensibilidade ao beber água fria, etc."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 placeholder-slate-400 text-sm focus:outline-hidden focus:border-sky-600 focus:bg-white"
                  ></textarea>
                </div>
              </div>

              {/* Data Safety warning */}
              <div className="flex items-start space-x-2.5 p-3.5 bg-sky-50 rounded-xl border border-sky-100 text-[11px] text-sky-800 leading-normal">
                <ShieldCheck className="w-4 h-4 shrink-0 text-sky-600 mt-0.5" />
                <span>Seus dados pessoais estão protegidos de acordo com a LGPD. O seu agendamento é sincronizado de forma segura com nosso sistema interno.</span>
              </div>
            </form>
          )}

          {/* STEP 5: Completion and Receipt */}
          {step === 5 && bookingConfirmed && (
            <div id="booking-step-5-receipt" className="text-center space-y-8 animate-scaleUp">
              <div className="mx-auto w-16 h-16 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center shadow-md">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <p className="text-sky-600 text-xs font-mono font-bold uppercase tracking-widest">Procedimento Registrado com Sucesso!</p>
                <h3 className="font-sans font-extrabold text-2xl md:text-3xl text-slate-900">
                  Sua Consulta está Pré-agendada
                </h3>
                <p className="text-xs md:text-sm text-slate-500 max-w-md mx-auto">
                  Enviamos as orientações de preparo para o email <strong>{bookingConfirmed.patientEmail}</strong>. Verifique sua caixa de entrada.
                </p>
              </div>

              {/* Rich Simulated Receipt card */}
              <div className="bg-slate-50 rounded-3xl p-6 md:p-8 border border-slate-100 max-w-md mx-auto text-left relative divide-y divide-slate-200 space-y-4">
                <div className="pb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs opacity-65 text-slate-600 uppercase font-mono font-bold">Código do agendamento</span>
                    <span className="font-mono text-sm font-extrabold bg-sky-100 text-sky-800 px-3 py-1 rounded-md border border-sky-200">{bookingConfirmed.id}</span>
                  </div>
                  <h4 className="font-extrabold text-slate-900 font-sans text-base mt-3">
                    {bookingConfirmed.patientName}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5 font-sans font-semibold">Contato: {bookingConfirmed.patientPhone}</p>
                </div>

                <div className="py-4 space-y-2.5 text-xs text-slate-700">
                  <div className="flex justify-between">
                    <span className="font-medium text-slate-500">Tratamento:</span>
                    <span className="font-bold text-slate-900">{selectedSpecObj?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-slate-500">Médico Especialista:</span>
                    <span className="font-bold text-slate-900">{selectedDocObj?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-slate-500">Data Agendada:</span>
                    <span className="font-bold text-slate-900">
                      {new Date(bookingConfirmed.date).toLocaleDateString('pt-BR', {weekday: 'long', day: 'numeric', month: 'long'})}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-slate-500">Horário da consulta:</span>
                    <span className="font-bold text-sky-700 font-mono text-sm">{bookingConfirmed.timeSlot}h</span>
                  </div>
                </div>

                <div className="pt-4 text-center">
                  <span className="text-[10px] text-slate-500 italic block leading-relaxed">
                    * Recomendamos chegar com 15 minutos de antecedência para preenchimento de ficha de anamnese bucal.
                  </span>
                </div>
              </div>

              {/* Symmetrical Dual CTAs representing WhatsApp validation and standard Google calendar */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto pt-4">
                <a
                  key="confirm-whatsapp"
                  id="btn-receipt-confirm-whatsapp"
                  href={getWhatsAppURL()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-sky-650 hover:bg-sky-700 text-white font-bold py-3.5 px-6 rounded-xl flex items-center justify-center space-x-2 transition shadow-lg cursor-pointer text-sm"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Confirmar pelo WhatsApp</span>
                </a>
                <button
                  type="button"
                  id="btn-receipt-reset"
                  onClick={handleReset}
                  className="w-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold py-3.5 text-center rounded-xl text-sm transition cursor-pointer"
                >
                  Agendar Outra Consulta
                </button>
              </div>
            </div>
          )}

          {/* Footer Controls for step transitions */}
          {step <= 4 && (
            <div id="booking-footer-controls" className="flex items-center justify-between border-t border-slate-100 pt-8 mt-10">
              {step > 1 ? (
                <button
                  type="button"
                  id="btn-booking-prev"
                  onClick={handlePrevStep}
                  className="py-2.5 px-5 bg-white text-slate-705 hover:text-sky-600 font-bold border border-slate-200 hover:border-sky-500 rounded-xl transition cursor-pointer flex items-center space-x-1.5 text-sm"
                >
                  <ChevronLeft className="w-4 h-4 pr-0.5" />
                  <span>Voltar</span>
                </button>
              ) : (
                <div></div> /* spacing spacer */
              )}

              {step < 4 ? (
                <button
                  type="button"
                  id="btn-booking-next"
                  onClick={handleNextStep}
                  className="py-2.5 px-6 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl transition shadow-lg cursor-pointer flex items-center space-x-1.5 text-sm"
                >
                  <span>Continuar</span>
                  <ChevronRight className="w-4 h-4 pl-0.5" />
                </button>
              ) : (
                <button
                  type="button"
                  id="btn-booking-submit"
                  onClick={handleFinalizeBooking}
                  className="py-3 px-8 bg-sky-600 hover:bg-sky-700 text-white font-extrabold rounded-xl transition shadow-xl cursor-pointer text-sm"
                >
                  Finalizar Agendamento
                </button>
              )}
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
