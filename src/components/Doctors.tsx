import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { EditableImageWrapper } from './AdminComponents';
import { Doctor } from '../types';
import { 
  Award, CheckCircle, GraduationCap, Plus, Trash2, Edit3, X, Sparkles, Image as ImageIcon 
} from 'lucide-react';

export default function Doctors() {
  const { 
    doctors, 
    updateDoctorImage, 
    isAdmin, 
    addDoctor, 
    updateDoctor, 
    deleteDoctor, 
    openImageEditor 
  } = useAdmin();

  // Form states for creating a new Doctor
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newCro, setNewCro] = useState('');
  const [newBio, setNewBio] = useState('');
  const [newSpecialtyId, setNewSpecialtyId] = useState('implantes');
  const [newImageUrl, setNewImageUrl] = useState('https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400');

  // Form states for editing an existing Doctor
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingDocId, setEditingDocId] = useState('');
  const [editName, setEditName] = useState('');
  const [editRole, setEditRole] = useState('');
  const [editCro, setEditCro] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editSpecialtyId, setEditSpecialtyId] = useState('implantes');
  const [editImageUrl, setEditImageUrl] = useState('');

  const scrollToBooking = (doctorId: string, specialtyId: string) => {
    const element = document.getElementById('booking-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      
      // Save choices so Booking wizard loads them automatically!
      localStorage.setItem('preselected_specialty', specialtyId);
      // Give calendar wizard a small event hint so it resets doctors options
      window.dispatchEvent(new Event('specialty_changed'));
    }
  };

  const handleCreateDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newRole.trim() || !newCro.trim() || !newBio.trim()) {
      alert('Por favor, preencha todos os campos obrigatórios!');
      return;
    }
    addDoctor({
      name: newName,
      role: newRole,
      cro: newCro,
      bio: newBio,
      specialtyId: newSpecialtyId,
      imageUrl: newImageUrl
    });
    // Reset state
    setNewName('');
    setNewRole('');
    setNewCro('');
    setNewBio('');
    setNewSpecialtyId('implantes');
    setNewImageUrl('https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400');
    setShowAddForm(false);
    alert('Especialista cadastrado com sucesso!');
  };

  const handleUpdateDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim() || !editRole.trim() || !editCro.trim() || !editBio.trim()) {
      alert('Por favor, preencha todos os campos obrigatórios!');
      return;
    }
    updateDoctor(editingDocId, {
      name: editName,
      role: editRole,
      cro: editCro,
      bio: editBio,
      specialtyId: editSpecialtyId,
      imageUrl: editImageUrl
    });
    setShowEditForm(false);
    alert('Especialista atualizado com sucesso!');
  };

  const startEditingCurrentDoctor = (doc: Doctor) => {
    setEditingDocId(doc.id);
    setEditName(doc.name);
    setEditRole(doc.role);
    setEditCro(doc.cro);
    setEditBio(doc.bio);
    setEditSpecialtyId(doc.specialtyId);
    setEditImageUrl(doc.imageUrl);
    setShowEditForm(true);
  };

  return (
    <section 
      id="doctors-section" 
      className="py-20 md:py-24 bg-slate-50"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Header Block */}
        <div id="doctors-header" className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-sky-600 uppercase tracking-widest text-xs font-bold block">
            Corpo Clínico Premium
          </span>
          <h2 id="doctors-title" className="text-3xl md:text-4xl font-sans font-extrabold text-slate-950 tracking-tight">
            Nossos Especialistas Associados
          </h2>
          <p id="doctors-description" className="text-slate-600 text-sm md:text-base leading-relaxed">
            Profissionais mestres de destaque formados pelas melhores instituições do país, dedicados a realizar tratamentos seguros e lúdicos.
          </p>

          {isAdmin && (
            <button
              type="button"
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center space-x-1.5 bg-sky-600 hover:bg-sky-700 text-white font-bold px-5 py-2.5 rounded-full text-xs shadow-md transition cursor-pointer mt-4 hover:scale-105 duration-200"
            >
              <Plus className="w-4 h-4" />
              <span>Incluir Novo Especialista</span>
            </button>
          )}
        </div>

        {/* Doctor profiles Grid */}
        <div 
          id="doctors-grid-container"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {doctors.map((doc) => (
            <div
              key={doc.id}
              id={`doctor-card-${doc.id}`}
              className="bg-white rounded-3xl border border-slate-200/50 overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col justify-between"
            >
              {/* Doctor portrait frame */}
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-slate-100">
                <EditableImageWrapper
                  src={doc.imageUrl}
                  alt={doc.name}
                  onSave={(newUrl) => updateDoctorImage(doc.id, newUrl)}
                  aspectClassName="aspect-[4/5]"
                  title={`Foto de ${doc.name}`}
                />
                
                {/* Floating badge for qualifications */}
                <div className="absolute top-3 left-3 bg-slate-950/85 backdrop-blur-xs text-white px-3 py-1 rounded-lg text-[9px] uppercase tracking-wider font-bold font-mono z-10">
                  {doc.cro}
                </div>
              </div>

              {/* Text explanations */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="font-sans font-extrabold text-base md:text-lg text-slate-950 leading-tight">
                    {doc.name}
                  </h3>
                  <p className="text-xs text-sky-600 font-bold font-mono uppercase tracking-wide">
                    {doc.role.replace('Especialista em ', '')}
                  </p>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                    {doc.bio}
                  </p>
                </div>

                {/* Micro credentials indicators */}
                <div className="space-y-1.5 border-t border-slate-100 pt-3 text-[11px] text-slate-600 font-medium">
                  <div className="flex items-center space-x-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                    <span>Graduação / Especialização USP</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Award className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                    <span>Membro da Sociedade Brasileira</span>
                  </div>
                </div>

                {/* Inline admin shortcuts */}
                {isAdmin && (
                  <div className="bg-amber-50 border border-amber-200/60 rounded-2xl p-3.5 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-amber-800">
                        Administração
                      </span>
                      <span className="text-[9px] bg-amber-200/50 text-amber-900 font-mono font-bold px-1.5 py-0.5 rounded">
                        Online
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => startEditingCurrentDoctor(doc)}
                        className="flex items-center justify-center space-x-1 border border-amber-250 bg-white hover:bg-amber-100/30 text-slate-700 py-1.5 rounded-lg font-bold transition cursor-pointer text-[10px]"
                        title="Editar Informações (Texto)"
                      >
                        <Edit3 className="w-3 h-3 text-amber-600" />
                        <span>Editar Info</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Excluir permanentemente o especialista: "${doc.name}"?`)) {
                            deleteDoctor(doc.id);
                          }
                        }}
                        className="flex items-center justify-center space-x-1 bg-red-600 hover:bg-red-700 text-white py-1.5 rounded-lg font-bold transition cursor-pointer text-[10px]"
                        title="Excluir do Corpo Clínico"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Excluir</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Direct scheduler button CTA */}
                <button
                  type="button"
                  id={`btn-doctor-book-${doc.id}`}
                  onClick={() => scrollToBooking(doc.id, doc.specialtyId)}
                  className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-2.5 rounded-xl text-xs transition cursor-pointer text-center block shadow-xs"
                >
                  Agendar com {doc.name.split(' ').slice(0, 2).join(' ')}
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Modal layout for adding a new Doctor */}
      {showAddForm && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn text-slate-800">
          <div className="bg-white rounded-3xl w-full max-w-xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-150 flex items-center justify-between bg-slate-50">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-sky-600" />
                <h3 className="font-sans font-extrabold text-sm md:text-base text-slate-950 leading-tight">
                  Cadastrar Novo Médico / Especialista
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
            <form onSubmit={handleCreateDoctor} className="p-6 overflow-y-auto space-y-4 flex-1 text-slate-800">
              
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wide text-slate-500 block">
                  Nome Completo <strong className="text-red-500">*</strong>
                </label>
                <input 
                  type="text" 
                  required
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder="Ex: Dra. Juliana G. Ribeiro"
                  className="w-full bg-white border border-slate-250 rounded-xl px-4 py-2.5 text-xs focus:outline-hidden focus:border-sky-600 text-slate-900 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wide text-slate-500 block">
                    Cargo / Especialidade <strong className="text-red-500">*</strong>
                  </label>
                  <input 
                    type="text" 
                    required
                    value={newRole}
                    onChange={e => setNewRole(e.target.value)}
                    placeholder="Ex: Especialista em Clinica Geral"
                    className="w-full bg-white border border-slate-250 rounded-xl px-4 py-2.5 text-xs focus:outline-hidden focus:border-sky-600 text-slate-900 font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wide text-slate-500 block">
                    CRO <strong className="text-red-500">*</strong>
                  </label>
                  <input 
                    type="text" 
                    required
                    value={newCro}
                    onChange={e => setNewCro(e.target.value)}
                    placeholder="Ex: CRO-SP 124.961"
                    className="w-full bg-white border border-slate-250 rounded-xl px-4 py-2.5 text-xs focus:outline-hidden focus:border-sky-600 text-slate-900 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wide text-slate-500 block">
                    Filtro de Agenda
                  </label>
                  <select
                    value={newSpecialtyId}
                    onChange={e => setNewSpecialtyId(e.target.value)}
                    className="w-full bg-white border border-slate-250 rounded-xl px-4 py-2.5 text-xs focus:outline-hidden focus:border-sky-500 text-slate-900 font-medium"
                  >
                    <option value="implantes">Implantes</option>
                    <option value="ortodontia">Ortodontia</option>
                    <option value="estetica">Estética</option>
                    <option value="odontopediatria">Odontopediatria</option>
                    <option value="canal-estetica">Canal</option>
                    <option value="clareamento">Clareamento</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wide text-slate-500 block">
                    Foto do Médico
                  </label>
                  <div className="flex space-x-1.5">
                    <input 
                      type="text" 
                      required
                      value={newImageUrl}
                      onChange={e => setNewImageUrl(e.target.value)}
                      className="w-full bg-white border border-slate-250 rounded-xl px-3 py-2.5 text-xs focus:outline-hidden focus:border-sky-500 text-slate-900 font-medium truncate"
                    />
                    <button
                      type="button"
                      onClick={() => openImageEditor(newImageUrl, (url) => setNewImageUrl(url), 'Escolher Foto para Cadastrar Especialista')}
                      className="bg-sky-500 hover:bg-sky-600 text-slate-950 p-2.5 rounded-xl text-xs font-bold shrink-0 shadow-xs"
                      title="Escolher Foto da Galeria"
                    >
                      <ImageIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wide text-slate-500 block">
                  Biografia Resumida <strong className="text-red-500">*</strong>
                </label>
                <textarea 
                  required
                  rows={3}
                  value={newBio}
                  onChange={e => setNewBio(e.target.value)}
                  placeholder="Ex: Formada pela USP com ampla experiência em reabilitações e estética do sorriso..."
                  className="w-full bg-white border border-slate-250 rounded-xl px-4 py-2.5 text-xs focus:outline-hidden focus:border-sky-600 text-slate-900 font-medium"
                />
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
                  className="bg-sky-600 hover:bg-sky-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-md transition cursor-pointer"
                >
                  Cadastrar Especialista
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Modal layout for editing an existing Doctor */}
      {showEditForm && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn text-slate-800">
          <div className="bg-white rounded-3xl w-full max-w-xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-150 flex items-center justify-between bg-slate-50">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-sky-600" />
                <h3 className="font-sans font-extrabold text-sm md:text-base text-slate-950 leading-tight">
                  Editar Especialista ({editName})
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
            <form onSubmit={handleUpdateDoctor} className="p-6 overflow-y-auto space-y-4 flex-1 text-slate-800">
              
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wide text-slate-500 block">
                  Nome Completo <strong className="text-red-500">*</strong>
                </label>
                <input 
                  type="text" 
                  required
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  placeholder="Ex: Dra. Mariana G. Neves"
                  className="w-full bg-white border border-slate-250 rounded-xl px-4 py-2.5 text-xs focus:outline-hidden focus:border-sky-600 text-slate-900 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wide text-slate-500 block">
                    Cargo / Especialidade <strong className="text-red-500">*</strong>
                  </label>
                  <input 
                    type="text" 
                    required
                    value={editRole}
                    onChange={e => setEditRole(e.target.value)}
                    placeholder="Ex: Especialitsta em Ortodontia"
                    className="w-full bg-white border border-slate-250 rounded-xl px-4 py-2.5 text-xs focus:outline-hidden focus:border-sky-600 text-slate-900 font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wide text-slate-500 block">
                    CRO <strong className="text-red-500">*</strong>
                  </label>
                  <input 
                    type="text" 
                    required
                    value={editCro}
                    onChange={e => setEditCro(e.target.value)}
                    placeholder="Ex: CRO-SP 124.562"
                    className="w-full bg-white border border-slate-250 rounded-xl px-4 py-2.5 text-xs focus:outline-hidden focus:border-sky-600 text-slate-900 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wide text-slate-500 block">
                    Filtro de Agenda
                  </label>
                  <select
                    value={editSpecialtyId}
                    onChange={e => setEditSpecialtyId(e.target.value)}
                    className="w-full bg-white border border-slate-250 rounded-xl px-4 py-2.5 text-xs focus:outline-hidden focus:border-sky-500 text-slate-900 font-medium"
                  >
                    <option value="implantes">Implantes</option>
                    <option value="ortodontia">Ortodontia</option>
                    <option value="estetica">Estética</option>
                    <option value="odontopediatria">Odontopediatria</option>
                    <option value="canal-estetica">Canal</option>
                    <option value="clareamento">Clareamento</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wide text-slate-500 block">
                    Foto do Médico
                  </label>
                  <div className="flex space-x-1.5">
                    <input 
                      type="text" 
                      required
                      value={editImageUrl}
                      onChange={e => setEditImageUrl(e.target.value)}
                      className="w-full bg-white border border-slate-250 rounded-xl px-3 py-2.5 text-xs focus:outline-hidden focus:border-sky-500 text-slate-900 font-medium truncate"
                    />
                    <button
                      type="button"
                      onClick={() => openImageEditor(editImageUrl, (url) => setEditImageUrl(url), `Selecionar foto de ${editName}`)}
                      className="bg-sky-500 hover:bg-sky-600 text-slate-950 p-2.5 rounded-xl text-xs font-bold shrink-0 shadow-xs"
                      title="Escolher Foto da Galeria"
                    >
                      <ImageIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wide text-slate-500 block">
                  Biografia Resumida <strong className="text-red-500">*</strong>
                </label>
                <textarea 
                  required
                  rows={3}
                  value={editBio}
                  onChange={e => setEditBio(e.target.value)}
                  placeholder="Ex: Formado pela USP com ampla experiência clínica..."
                  className="w-full bg-white border border-slate-250 rounded-xl px-4 py-2.5 text-xs focus:outline-hidden focus:border-sky-600 text-slate-900 font-medium"
                />
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
                  className="bg-sky-600 hover:bg-sky-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-md transition cursor-pointer"
                >
                  Salvar Alterações
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </section>
  );
}
