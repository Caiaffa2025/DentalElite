import React, { useState, useRef, useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import { Sparkles, ArrowLeftRight, ThumbsUp, Star, Edit3, Trash2, Plus, X, Image as ImageIcon } from 'lucide-react';

interface CaseStudy {
  id: string;
  title: string;
  specialty: string;
  patientInitials: string;
  beforeImg: string;
  afterImg: string;
  dentist: string;
}

export default function BeforeAfterSlider() {
  const { caseStudies, updateCaseStudyImage, isAdmin, openImageEditor, deleteCaseStudy, addCaseStudy, updateCaseStudy } = useAdmin();
  const [activeCase, setActiveCase] = useState<CaseStudy>(caseStudies[0] || {
    id: 'lentes',
    title: 'Transformação Estética com Lentes de Contato',
    specialty: 'Odontologia Estética / Porcelana',
    patientInitials: 'P.S.M, 32 anos',
    beforeImg: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=600',
    afterImg: 'https://images.unsplash.com/photo-1613521140210-b4d98588f58d?auto=format&fit=crop&q=80&w=600',
    dentist: 'Dra. Beatriz Menezes'
  });
  const [sliderPos, setSliderPos] = useState<number>(50); // 0 to 100
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef<boolean>(false);

  // Form states for creating a new Case Study
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSpecialty, setNewSpecialty] = useState('');
  const [newPatientInitials, setNewPatientInitials] = useState('');
  const [newBeforeImg, setNewBeforeImg] = useState('https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=600');
  const [newAfterImg, setNewAfterImg] = useState('https://images.unsplash.com/photo-1613521140210-b4d98588f58d?auto=format&fit=crop&q=80&w=600');
  const [newDentist, setNewDentist] = useState('');

  // Form states for editing an existing Case Study
  const [showEditForm, setShowEditForm] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editSpecialty, setEditSpecialty] = useState('');
  const [editPatientInitials, setEditPatientInitials] = useState('');
  const [editBeforeImg, setEditBeforeImg] = useState('');
  const [editAfterImg, setEditAfterImg] = useState('');
  const [editDentist, setEditDentist] = useState('');

  const startEditingCurrentCase = () => {
    setEditTitle(currentCase.title);
    setEditSpecialty(currentCase.specialty);
    setEditPatientInitials(currentCase.patientInitials);
    setEditBeforeImg(currentCase.beforeImg);
    setEditAfterImg(currentCase.afterImg);
    setEditDentist(currentCase.dentist);
    setShowEditForm(true);
  };

  const handleUpdateCase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTitle.trim() || !editSpecialty.trim() || !editPatientInitials.trim() || !editDentist.trim()) {
      alert('Por favor, preencha todos os campos obrigatórios!');
      return;
    }
    updateCaseStudy(currentCase.id, {
      title: editTitle,
      specialty: editSpecialty,
      patientInitials: editPatientInitials,
      beforeImg: editBeforeImg,
      afterImg: editAfterImg,
      dentist: editDentist
    });
    setShowEditForm(false);
  };

  // Handle case creation submission
  const handleSubmitNewCase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newSpecialty.trim() || !newPatientInitials.trim() || !newDentist.trim()) {
      alert('Por favor, preencha todos os campos obrigatórios!');
      return;
    }

    addCaseStudy({
      title: newTitle,
      specialty: newSpecialty,
      patientInitials: newPatientInitials,
      beforeImg: newBeforeImg,
      afterImg: newAfterImg,
      dentist: newDentist
    });

    // Reset values & close modal
    setNewTitle('');
    setNewSpecialty('');
    setNewPatientInitials('');
    setNewBeforeImg('https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=600');
    setNewAfterImg('https://images.unsplash.com/photo-1613521140210-b4d98588f58d?auto=format&fit=crop&q=80&w=600');
    setNewDentist('');
    setShowAddForm(false);
  };

  // Sync activeCase when caseStudies updates
  useEffect(() => {
    const current = caseStudies.find(c => c.id === activeCase?.id);
    if (current) {
      setActiveCase(current);
    } else if (caseStudies.length > 0) {
      setActiveCase(caseStudies[0]);
    }
  }, [caseStudies, activeCase?.id]);

  const [containerWidth, setContainerWidth] = useState<number>(600);

  useEffect(() => {
    if (!containerRef.current) return;
    
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.getBoundingClientRect().width);
      }
    };

    updateWidth();

    const resizeObserver = new ResizeObserver(() => {
      updateWidth();
    });
    
    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const currentCase = caseStudies.find(c => c.id === activeCase?.id) || caseStudies[0] || {
    id: 'placeholder',
    title: 'Nenhum Caso Cadastrado',
    specialty: 'Odontologia Integrada',
    patientInitials: 'A.N.O, -- anos',
    beforeImg: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=600',
    afterImg: 'https://images.unsplash.com/photo-1613521140210-b4d98588f58d?auto=format&fit=crop&q=80&w=600',
    dentist: 'Equipe Médica'
  };

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let pos = (x / rect.width) * 100;
    if (pos < 0) pos = 0;
    if (pos > 100) pos = 100;
    setSliderPos(pos);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    handleMove(e.clientX);
    containerRef.current?.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    handleMove(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDragging.current = false;
    containerRef.current?.releasePointerCapture(e.pointerId);
  };

  return (
    <section 
      id="before-after-section" 
      className="py-20 md:py-24 bg-slate-50"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Header Block */}
        <div id="before-after-header" className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span 
            id="before-after-subheading"
            className="text-sky-600 uppercase tracking-widest text-xs font-bold block"
          >
            Sorrisos Reais, Resultados Reais
          </span>
          <h2 
            id="before-after-title"
            className="text-3xl md:text-4xl font-sans font-extrabold text-slate-950 tracking-tight"
          >
            Galeria de Transformações Odontológicas
          </h2>
          <p 
            id="before-after-description"
            className="text-slate-600 text-sm md:text-base leading-relaxed"
          >
            Arraste o botão central para a esquerda ou direita para comparar o resultado do tratamento realizado pela nossa equipe médica associada.
          </p>
        </div>

        {/* Case Switching Buttons */}
        <div 
          id="case-switcher-buttons-container"
          className="flex flex-wrap justify-center gap-3 mb-10"
        >
          {caseStudies.map((cs) => (
            <button
              key={cs.id}
              id={`btn-case-switch-${cs.id}`}
              onClick={() => {
                setActiveCase(cs);
                setSliderPos(50);
              }}
              className={`px-5 py-2.5 rounded-full text-xs md:text-sm font-bold tracking-tight cursor-pointer transition-all duration-300 border ${
                currentCase.id === cs.id
                  ? 'bg-sky-600 text-white border-sky-600 shadow-md shadow-sky-100'
                  : 'bg-white text-slate-600 hover:text-sky-600 border-slate-200'
              }`}
            >
              {cs.title.split(' com ')[1] || cs.title}
            </button>
          ))}

          {isAdmin && (
            <button
              onClick={() => setShowAddForm(true)}
              className="px-5 py-2.5 rounded-full text-xs md:text-sm font-extrabold tracking-tight cursor-pointer transition-all duration-300 border border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100/70 hover:text-emerald-850 flex items-center gap-1 shadow-sm active:scale-95"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-600 inline-block" />
              <span>Incluir Caso</span>
            </button>
          )}
        </div>

        {/* Main Grid: Slider box + testimonial details on side */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Interactive Drag Before After Frame (Takes 7 Cols) */}
          <div className="lg:col-span-7 flex flex-col items-center">
            <div 
              id="slider-root-frame"
              ref={containerRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              className="relative w-full aspect-[4/3] md:aspect-[16/10] max-w-2xl rounded-3xl overflow-hidden shadow-2xl border-4 border-white cursor-ew-resize select-none touch-none bg-slate-200"
            >
              {/* After Image (Full background) */}
              <img 
                src={currentCase.afterImg} 
                alt="Depois do Tratamento" 
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              />
              <span className="absolute bottom-3 right-3 bg-sky-600/95 backdrop-blur-sm text-white px-3 py-1 rounded-md text-[10px] md:text-xs font-bold uppercase tracking-wider font-mono z-20">
                Depois (Dente dos Sonhos)
              </span>

              {/* Before Image (Cropped by width percent dynamically) */}
              <div 
                className="absolute inset-y-0 left-0 overflow-hidden z-10 pointer-events-none"
                style={{ width: `${sliderPos}%` }}
              >
                <img 
                  src={currentCase.beforeImg} 
                  alt="Antes do Tratamento" 
                  className="absolute inset-0 w-full h-full object-cover max-w-none"
                  style={{ width: containerWidth }}
                />
              </div>
              <span className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-sm text-white px-3 py-1 rounded-md text-[10px] md:text-xs font-bold uppercase tracking-wider font-mono z-20">
                Antes (Original)
              </span>

              {/* Slit Divider Line */}
              <div 
                className="absolute top-0 bottom-0 w-[4px] bg-white shadow-xl z-30 cursor-ew-resize pointer-events-none"
                style={{ left: `${sliderPos}%` }}
              >
                {/* Drag Handle Circle Icon */}
                <div className="absolute top-1/2 -left-5 -translate-y-1/2 w-10 h-10 bg-white border border-slate-200 text-sky-600 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition pointer-events-none">
                  <ArrowLeftRight className="w-5 h-5" />
                </div>
              </div>
            </div>

            <p id="slider-helper-hint" className="text-slate-500 font-mono text-[10px] md:text-xs uppercase tracking-widest mt-4">
              ← Toque e arraste para comparar o antes e depois →
            </p>
          </div>

          {/* Right Text Block with metrics & social validation (Takes 5 Cols) */}
          <div 
            id="before-after-testimonials-card"
            className="lg:col-span-5 bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-xl space-y-6"
          >
            <div className="space-y-2">
              <span className="bg-sky-100 text-sky-800 text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md">
                Caso Clínico Real
              </span>
              <h3 className="font-sans font-extrabold text-xl md:text-2xl text-slate-900">
                {currentCase.title}
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                Paciente: {currentCase.patientInitials} • Responsável: {currentCase.dentist}
              </p>
            </div>

            <div className="p-4 bg-sky-50 rounded-2xl border border-sky-100 space-y-3">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-sky-600 text-sky-600" />
                ))}
                <span className="text-xs font-bold text-sky-800 ml-1">5.0 / 5.0</span>
              </div>
              <p className="text-sm text-slate-705 italic leading-relaxed text-slate-600">
                "Estou extremamente realizada! Toda a equipe me deu muita segurança desde a etapa de escaneamento até a cimentação das minhas lentes de porcelana. Valeu cada centavo investido."
              </p>
              <div className="flex items-center space-x-1.5 pt-1 text-sky-800 text-xs font-bold font-mono">
                <ThumbsUp className="w-3.5 h-3.5 mr-1" />
                <span>Tratamento seguro • Resultado natural</span>
              </div>
            </div>

            {isAdmin && currentCase.id !== 'placeholder' && (
              <div className="bg-amber-50 border border-amber-200/60 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-amber-800">
                    Administrador (Antes/Depois)
                  </span>
                  <span className="text-[9px] bg-amber-200/55 text-amber-900 font-mono font-bold px-1.5 py-0.5 rounded">
                    Online
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => openImageEditor(currentCase.beforeImg, (newUrl) => updateCaseStudyImage(currentCase.id, 'beforeImg', newUrl), 'Alterar Imagem do Antes')}
                    className="flex items-center justify-center space-x-1 border border-amber-200 bg-white hover:bg-amber-100/50 text-slate-700 py-2 rounded-lg font-bold transition cursor-pointer"
                  >
                    <Edit3 className="w-3 h-3 text-amber-600" />
                    <span>Editar Antes</span>
                  </button>
                  <button
                    onClick={() => openImageEditor(currentCase.afterImg, (newUrl) => updateCaseStudyImage(currentCase.id, 'afterImg', newUrl), 'Alterar Imagem do Depois')}
                    className="flex items-center justify-center space-x-1 border border-amber-200 bg-white hover:bg-amber-100/50 text-slate-700 py-2 rounded-lg font-bold transition cursor-pointer"
                  >
                    <Edit3 className="w-3 h-3 text-amber-600" />
                    <span>Editar Depois</span>
                  </button>
                  
                  <button
                    onClick={startEditingCurrentCase}
                    className="col-span-2 flex items-center justify-center space-x-1 border border-amber-200 bg-amber-100/50 hover:bg-amber-100 text-amber-900 py-2 rounded-lg font-semibold cursor-pointer transition text-xs"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-amber-700" />
                    <span>Editar Informações (Texto)</span>
                  </button>
                </div>

                <button
                  onClick={() => {
                    if (confirm(`Excluir permanentemente o caso clínico: "${currentCase.title}"?`)) {
                      deleteCaseStudy(currentCase.id);
                    }
                  }}
                  className="w-full flex items-center justify-center space-x-1 bg-red-650 hover:bg-red-700 text-white py-2 rounded-lg font-bold text-xs transition cursor-pointer shadow-xs"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Excluir Caso de Sucesso</span>
                </button>
              </div>
            )}

            <button
              id={`btn-slider-book-treatment-${currentCase.id}`}
              onClick={() => {
                const element = document.getElementById('booking-section');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                  // preselect
                  localStorage.setItem('preselected_specialty', currentCase.id === 'invisalign' ? 'ortodontia' : (currentCase.id === 'clareamento' ? 'clareamento' : 'estetica'));
                  window.dispatchEvent(new Event('specialty_changed'));
                }
              }}
              className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-4 rounded-xl text-sm md:text-base shadow-lg transition duration-300 text-center cursor-pointer block"
            >
              Fazer uma Simulação para Meu Sorriso
            </button>
          </div>

        </div>
      </div>

      {/* Dynamic Modal layout for adding a new Case Study */}
      {showAddForm && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn text-slate-800">
          <div className="bg-white rounded-3xl w-full max-w-xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-150 flex items-center justify-between bg-slate-50">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-sky-600" />
                <h3 className="font-sans font-extrabold text-sm md:text-base text-slate-950 leading-tight">
                  Cadastrar Nova Transformação (Antes & Depois)
                </h3>
              </div>
              <button 
                type="button"
                onClick={() => setShowAddForm(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmitNewCase} className="p-6 overflow-y-auto space-y-4 flex-1 text-slate-800">
              
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wide text-slate-500 block">
                  Título do Caso Clínico <strong className="text-red-500">*</strong>
                </label>
                <input 
                  type="text" 
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="Ex: Alinhamento Estético e Clareamento Total"
                  className="w-full bg-white border border-slate-250 rounded-xl px-4 py-2.5 text-xs focus:outline-hidden focus:border-sky-600 text-slate-900 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wide text-slate-500 block">
                    Categoria / Especialidade <strong className="text-red-500">*</strong>
                  </label>
                  <input 
                    type="text" 
                    required
                    value={newSpecialty}
                    onChange={e => setNewSpecialty(e.target.value)}
                    placeholder="Ex: Estética / Porcelana"
                    className="w-full bg-white border border-slate-250 rounded-xl px-4 py-2.5 text-xs focus:outline-hidden focus:border-sky-600 text-slate-900 font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wide text-slate-500 block">
                    Iniciais/Idade do Paciente <strong className="text-red-500">*</strong>
                  </label>
                  <input 
                    type="text" 
                    required
                    value={newPatientInitials}
                    onChange={e => setNewPatientInitials(e.target.value)}
                    placeholder="Ex: J.K.O, 31 anos"
                    className="w-full bg-white border border-slate-250 rounded-xl px-4 py-2.5 text-xs focus:outline-hidden focus:border-sky-600 text-slate-900 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wide text-slate-500 block">
                  Dentista Responsável <strong className="text-red-500">*</strong>
                </label>
                <input 
                  type="text" 
                  required
                  value={newDentist}
                  onChange={e => setNewDentist(e.target.value)}
                  placeholder="Ex: Dra. Beatriz Menezes"
                  className="w-full bg-white border border-slate-250 rounded-xl px-4 py-2.5 text-xs focus:outline-hidden focus:border-sky-600 text-slate-900 font-medium"
                />
              </div>

              {/* Before/After Images config */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                
                {/* Before configuration */}
                <div className="space-y-2 bg-slate-50 p-3 rounded-2xl border border-slate-100 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-1">
                      Foto do Antes
                    </span>
                    <div className="w-full aspect-[4/3] rounded-xl overflow-hidden border border-slate-200 bg-slate-200 relative mb-2 shadow-xs">
                      <img 
                        src={newBeforeImg} 
                        alt="Previa do antes" 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => openImageEditor(newBeforeImg, (url) => setNewBeforeImg(url), 'Selecionar Imagem do Antes')}
                    className="w-full bg-sky-50 hover:bg-sky-100 text-sky-700 hover:text-sky-800 text-[10px] font-bold py-2 rounded-xl border border-sky-150 flex items-center justify-center space-x-1 cursor-pointer transition text-center"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Upload / Buscar</span>
                  </button>
                </div>

                {/* After configuration */}
                <div className="space-y-2 bg-slate-50 p-3 rounded-2xl border border-slate-100 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-1">
                      Foto do Depois
                    </span>
                    <div className="w-full aspect-[4/3] rounded-xl overflow-hidden border border-slate-200 bg-slate-200 relative mb-2 shadow-xs">
                      <img 
                        src={newAfterImg} 
                        alt="Previa do depois" 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => openImageEditor(newAfterImg, (url) => setNewAfterImg(url), 'Selecionar Imagem do Depois')}
                    className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 hover:text-emerald-800 text-[10px] font-bold py-2 rounded-xl border border-emerald-150 flex items-center justify-center space-x-1 cursor-pointer transition text-center"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Upload / Buscar</span>
                  </button>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex items-center justify-end space-x-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold px-4 py-2.5 rounded-xl text-xs transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-sky-600 hover:bg-sky-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-md transition cursor-pointer flex items-center space-x-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Cadastrar Caso Clínico</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Dynamic Modal layout for editing an existing Case Study */}
      {showEditForm && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn text-slate-800">
          <div className="bg-white rounded-3xl w-full max-w-xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-150 flex items-center justify-between bg-slate-50">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-sky-600" />
                <h3 className="font-sans font-extrabold text-sm md:text-base text-slate-950 leading-tight">
                  Editar Caso Clínico (Antes & Depois)
                </h3>
              </div>
              <button 
                type="button"
                onClick={() => setShowEditForm(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleUpdateCase} className="p-6 overflow-y-auto space-y-4 flex-1 text-slate-800">
              
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wide text-slate-500 block">
                  Título do Caso Clínico <strong className="text-red-500">*</strong>
                </label>
                <input 
                  type="text" 
                  required
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  placeholder="Ex: Alinhamento Estético e Clareamento Total"
                  className="w-full bg-white border border-slate-250 rounded-xl px-4 py-2.5 text-xs focus:outline-hidden focus:border-sky-600 text-slate-900 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wide text-slate-500 block">
                    Categoria / Especialidade <strong className="text-red-500">*</strong>
                  </label>
                  <input 
                    type="text" 
                    required
                    value={editSpecialty}
                    onChange={e => setEditSpecialty(e.target.value)}
                    placeholder="Ex: Estética / Porcelana"
                    className="w-full bg-white border border-slate-250 rounded-xl px-4 py-2.5 text-xs focus:outline-hidden focus:border-sky-600 text-slate-900 font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wide text-slate-500 block">
                    Iniciais/Idade do Paciente <strong className="text-red-500">*</strong>
                  </label>
                  <input 
                    type="text" 
                    required
                    value={editPatientInitials}
                    onChange={e => setEditPatientInitials(e.target.value)}
                    placeholder="Ex: J.K.O, 31 anos"
                    className="w-full bg-white border border-slate-250 rounded-xl px-4 py-2.5 text-xs focus:outline-hidden focus:border-sky-600 text-slate-900 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wide text-slate-500 block">
                  Dentista Responsável <strong className="text-red-500">*</strong>
                </label>
                <input 
                  type="text" 
                  required
                  value={editDentist}
                  onChange={e => setEditDentist(e.target.value)}
                  placeholder="Ex: Dra. Beatriz Menezes"
                  className="w-full bg-white border border-slate-250 rounded-xl px-4 py-2.5 text-xs focus:outline-hidden focus:border-sky-600 text-slate-900 font-medium"
                />
              </div>

              {/* Before/After Images config */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                
                {/* Before configuration */}
                <div className="space-y-2 bg-slate-50 p-3 rounded-2xl border border-slate-100 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-1">
                      Foto do Antes
                    </span>
                    <div className="w-full aspect-[4/3] rounded-xl overflow-hidden border border-slate-200 bg-slate-200 relative mb-2 shadow-xs">
                      <img 
                        src={editBeforeImg} 
                        alt="Previa do antes" 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => openImageEditor(editBeforeImg, (url) => setEditBeforeImg(url), 'Selecionar Imagem do Antes')}
                    className="w-full bg-sky-50 hover:bg-sky-100 text-sky-700 hover:text-sky-800 text-[10px] font-bold py-2 rounded-xl border border-sky-150 flex items-center justify-center space-x-1 cursor-pointer transition text-center"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Upload / Buscar</span>
                  </button>
                </div>

                {/* After configuration */}
                <div className="space-y-2 bg-slate-50 p-3 rounded-2xl border border-slate-100 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-1">
                      Foto do Depois
                    </span>
                    <div className="w-full aspect-[4/3] rounded-xl overflow-hidden border border-slate-200 bg-slate-200 relative mb-2 shadow-xs">
                      <img 
                        src={editAfterImg} 
                        alt="Previa do depois" 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => openImageEditor(editAfterImg, (url) => setEditAfterImg(url), 'Selecionar Imagem do Depois')}
                    className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 hover:text-emerald-800 text-[10px] font-bold py-2 rounded-xl border border-emerald-150 flex items-center justify-center space-x-1 cursor-pointer transition text-center"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Upload / Buscar</span>
                  </button>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex items-center justify-end space-x-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowEditForm(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold px-4 py-2.5 rounded-xl text-xs transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-sky-600 hover:bg-sky-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-md transition cursor-pointer flex items-center space-x-1"
                >
                  <span>Salvar Alterações</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </section>
  );
}
