import React, { useState, useEffect } from 'react';
import { specialties } from '../data';
import { Specialty } from '../types';
import { useAdmin } from '../context/AdminContext';
import { ShieldCheck, Sparkles, Activity, Baby, HeartPulse, Sun, Check, ArrowRight, User, Search, X } from 'lucide-react';
import { motion } from 'motion/react';

export default function Specialties() {
  const { doctors } = useAdmin();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty>(specialties[0]);

  // Filter specialties based on search input (name, short description, full description or benefits)
  const filteredSpecialties = specialties.filter((spec) => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;
    return (
      spec.name.toLowerCase().includes(term) ||
      spec.shortDescription.toLowerCase().includes(term) ||
      spec.fullDescription.toLowerCase().includes(term) ||
      spec.benefits.some(benefit => benefit.toLowerCase().includes(term))
    );
  });

  // Automatically update the selected specialty if the current one gets filtered out
  useEffect(() => {
    if (filteredSpecialties.length > 0) {
      const isCurrentlySelectedStillVisible = filteredSpecialties.some(
        (spec) => spec.id === selectedSpecialty.id
      );
      if (!isCurrentlySelectedStillVisible) {
        setSelectedSpecialty(filteredSpecialties[0]);
      }
    }
  }, [searchTerm, filteredSpecialties, selectedSpecialty.id]);

  // Helper to map icon name from DB to Lucide Component
  const renderIcon = (name: string, className: string) => {
    switch (name) {
      case 'ShieldCheck': return <ShieldCheck className={className} />;
      case 'Sparkles': return <Sparkles className={className} />;
      case 'Activity': return <Activity className={className} />;
      case 'Baby': return <Baby className={className} />;
      case 'HeartPulse': return <HeartPulse className={className} />;
      case 'Sun': return <Sun className={className} />;
      default: return <ShieldCheck className={className} />;
    }
  };

  const getDoctorForSpecialty = (specialtyId: string) => {
    return doctors.find(doc => doc.specialtyId === specialtyId);
  };

  const scrollToBooking = (specialtyId: string) => {
    // Select the specialty inside our booking component or direct scroll
    const element = document.getElementById('booking-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // We will also use custom event or local storage to pre-select, let's store it
      localStorage.setItem('preselected_specialty', specialtyId);
      // Dispatch a storage event or direct function call so the wizard updates
      window.dispatchEvent(new Event('specialty_changed'));
    }
  };

  return (
    <section 
      id="specialties-section" 
      className="py-20 md:py-24 bg-white"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header Section */}
        <motion.div 
          id="specialties-header" 
          className="text-center max-w-3xl mx-auto mb-16 space-y-4"
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <span 
            id="specialties-subheading"
            className="text-sky-600 uppercase tracking-widest text-xs font-bold block"
          >
            Tratamentos de Referência
          </span>
          <h2 
            id="specialties-title"
            className="text-3xl md:text-4xl font-sans font-extrabold text-slate-950 tracking-tight"
          >
            Especialidades Odontológicas Integradas
          </h2>
          <p 
            id="specialties-description"
            className="text-slate-600 text-sm md:text-base leading-relaxed"
          >
            Oferecemos cuidados odontológicos completos de forma integrada. Clique nas especialidades abaixo para entender como transformamos o seu sorriso com tecnologia avançada.
          </p>
        </motion.div>

        {/* Dynamic Interactive Panel Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Vertical button tabs for specialties (Takes 4 columns) */}
          <motion.div 
            id="specialties-navigation-tabs"
            className="lg:col-span-4 space-y-4"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Search Input Field */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                <Search className="w-4.5 h-4.5" />
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar especialidade..."
                className="w-full pl-10 pr-10 py-3 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-600 transition duration-150 text-slate-800 placeholder-slate-400 font-medium"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  title="Limpar busca"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              )}
            </div>

            {/* List of Specialty Tabs */}
            <div className="space-y-3">
              {filteredSpecialties.length === 0 ? (
                <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-6 text-center text-slate-500 space-y-1">
                  <p className="text-sm font-bold">Nenhuma especialidade encontrada</p>
                  <p className="text-xs text-slate-400">Tente buscar por outras palavras-chave.</p>
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="text-xs text-sky-600 font-bold hover:underline cursor-pointer mt-2"
                  >
                    Ver Todas
                  </button>
                </div>
              ) : (
                filteredSpecialties.map((spec, idx) => (
                  <motion.button
                    key={spec.id}
                    id={`btn-specialty-tab-${spec.id}`}
                    onClick={() => setSelectedSpecialty(spec)}
                    className={`w-full text-left p-4 rounded-xl border transition-all duration-350 flex items-center space-x-3 cursor-pointer ${
                      selectedSpecialty.id === spec.id
                        ? 'bg-sky-600 border-sky-600 text-white shadow-lg shadow-sky-100/50'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-100 text-slate-800'
                    }`}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ 
                      duration: 0.6, 
                      delay: Math.min(idx * 0.08, 0.4), 
                      ease: [0.16, 1, 0.3, 1] 
                    }}
                    whileHover={{ scale: selectedSpecialty.id === spec.id ? 1.01 : 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div 
                      className={`p-2 rounded-lg shrink-0 ${
                        selectedSpecialty.id === spec.id 
                          ? 'bg-sky-500/30 text-white' 
                          : 'bg-sky-50 text-sky-600'
                      }`}
                    >
                      {renderIcon(spec.iconName, 'w-5 h-5')}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-sm md:text-base leading-tight truncate">{spec.name}</p>
                      <p 
                        className={`text-xs mt-0.5 leading-normal truncate ${
                          selectedSpecialty.id === spec.id ? 'text-sky-100' : 'text-slate-500'
                        }`}
                      >
                        {spec.shortDescription}
                      </p>
                    </div>
                  </motion.button>
                ))
              )}
            </div>
          </motion.div>

          {/* Right Column: In-depth content card (Takes 8 columns) */}
          {filteredSpecialties.length > 0 ? (
            <motion.div 
              key={selectedSpecialty.id}
              id="specialty-details-card"
              className="lg:col-span-8 bg-slate-50 rounded-3xl border border-slate-100 p-6 md:p-8 space-y-6 md:space-y-8"
              initial={{ opacity: 0, x: 30, y: 10 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
            {/* Top row with Title and Icon */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/60 pb-6">
              <div className="flex items-center space-x-4">
                <div className="bg-sky-600/10 text-sky-600 p-3 rounded-2xl">
                  {renderIcon(selectedSpecialty.iconName, 'w-8 h-8')}
                </div>
                <div>
                  <h3 className="font-sans font-extrabold text-2xl text-slate-900 leading-tight">
                    {selectedSpecialty.name}
                  </h3>
                  <span className="font-mono text-xs uppercase tracking-wider text-sky-600 font-bold mt-1 inline-block">
                    Duração média: {selectedSpecialty.duration}
                  </span>
                </div>
              </div>
              
              {/* Quick Contact CTA */}
              <button
                id={`btn-book-specialty-top-${selectedSpecialty.id}`}
                onClick={() => scrollToBooking(selectedSpecialty.id)}
                className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs px-5 py-3 rounded-full shadow-md transition duration-300 self-start sm:self-center cursor-pointer whitespace-nowrap"
              >
                Solicitar Orçamento
              </button>
            </div>

            {/* In-depth descriptions & Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column of inside block: Narrative */}
              <div className="space-y-4">
                <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider">O que é o tratamento?</h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {selectedSpecialty.fullDescription}
                </p>
              </div>

              {/* Right Column of inside block: Benefits Checklist */}
              <div className="bg-white p-5 rounded-2xl border border-slate-100/80 space-y-4 shadow-xs">
                <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider">Principais Benefícios</h4>
                <ul className="space-y-2.5 text-sm text-slate-700">
                  {selectedSpecialty.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Specialist Doctor Assignment section */}
            {getDoctorForSpecialty(selectedSpecialty.id) && (
              <div 
                id="assigned-doctor-info"
                className="bg-slate-900 text-white rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-6"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-slate-800">
                    <img 
                      src={getDoctorForSpecialty(selectedSpecialty.id)?.imageUrl} 
                      alt={getDoctorForSpecialty(selectedSpecialty.id)?.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="text-sky-300 font-mono text-[10px] uppercase font-bold tracking-widest leading-none">Especialista Responsável</span>
                    <h5 className="font-extrabold text-base md:text-lg text-white mt-0.5">
                      {getDoctorForSpecialty(selectedSpecialty.id)?.name}
                    </h5>
                    <p className="text-xs text-slate-300 mt-0.5">
                      {getDoctorForSpecialty(selectedSpecialty.id)?.role} • {getDoctorForSpecialty(selectedSpecialty.id)?.cro}
                    </p>
                  </div>
                </div>

                <button
                  id={`btn-book-specialty-doctor-${selectedSpecialty.id}`}
                  onClick={() => scrollToBooking(selectedSpecialty.id)}
                  className="bg-sky-500 hover:bg-sky-600 text-slate-950 hover:text-white font-bold text-sm px-6 py-3.5 rounded-xl flex items-center space-x-2 transition cursor-pointer shrink-0 w-full md:w-auto justify-center"
                >
                  <span>Agendar Consulta</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

          </motion.div>
          ) : (
            <div className="lg:col-span-8 bg-slate-50 border border-dashed border-slate-200 rounded-3xl p-12 text-center flex flex-col items-center justify-center space-y-4 min-h-[400px] w-full">
              <div className="bg-sky-50 text-sky-600 p-4 rounded-full">
                <Search className="w-8 h-8" />
              </div>
              <h4 className="font-sans font-extrabold text-lg text-slate-800">Sem correspondências para "{searchTerm}"</h4>
              <p className="text-slate-500 text-xs max-w-sm leading-relaxed mx-auto">
                Tente ajustar os termos buscados para localizar outros procedimentos clínicos, cirúrgicos ou tratamentos estéticos.
              </p>
              <button
                onClick={() => setSearchTerm('')}
                className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs px-5 py-3 rounded-full shadow-md transition duration-300 cursor-pointer"
              >
                Limpar Filtro de Busca
              </button>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
