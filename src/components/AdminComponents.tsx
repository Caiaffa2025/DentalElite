import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { specialties } from '../data';
import { Doctor } from '../types';
import { 
  Lock, Unlock, Edit3, Image as ImageIcon, Plus, Trash2, 
  X, Check, LogIn, LogOut, Sparkles, Smile, ShieldCheck, Upload
} from 'lucide-react';

// Preset high quality Unsplash Dental stock images sorted by categories
const PRESET_LIBRARY = [
  {
    category: 'Profissionais (Dentistas)',
    items: [
      { url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400', label: 'Dra. Sorriso (Feminino)' },
      { url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400', label: 'Dr. Executivo (Masculino)' },
      { url: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=400', label: 'Dra. Jovem Clínica' },
      { url: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400', label: 'Dr. Sorridente Jovem' },
      { url: 'https://images.unsplash.com/photo-1579684389782-64d84b5e901a?auto=format&fit=crop&q=80&w=600', label: 'Dra. Mariana (Estúdio)' }
    ]
  },
  {
    category: 'Consultório & Tecnologia',
    items: [
      { url: 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&q=80&w=600', label: 'Cadeira Odontológica 3D' },
      { url: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=600', label: 'Sala de Recepção Premium' },
      { url: 'https://images.unsplash.com/photo-1461344577544-4e5dc948718b?auto=format&fit=crop&q=80&w=600', label: 'Equipe reunida em clínica' },
      { url: 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&q=80&w=600', label: 'Microscópio Endodôntico' }
    ]
  },
  {
    category: 'Procedimentos & Sorridentes',
    items: [
      { url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=600', label: 'Sorriso Natural (Antes)' },
      { url: 'https://images.unsplash.com/photo-1613521140210-b4d98588f58d?auto=format&fit=crop&q=80&w=600', label: 'Sorriso Alinhado (Depois)' },
      { url: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&q=80&w=600', label: 'Expressão Feliz Masculina' },
      { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600', label: 'Sorriso Aberto Homem' },
      { url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=600', label: 'Dentes Alinhados Menina' },
      { url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600', label: 'Jovem Linda Sorrindo' }
    ]
  }
];

// Inline pen wrapper overlay on hovered images
export const EditableImageWrapper: React.FC<{
  src: string;
  alt: string;
  onSave: (newUrl: string) => void;
  className?: string;
  aspectClassName?: string;
  title?: string;
}> = ({ src, alt, onSave, className = '', aspectClassName = 'aspect-auto', title }) => {
  const { isAdmin, openImageEditor } = useAdmin();

  return (
    <div className={`relative group ${className}`}>
      <img 
        src={src} 
        alt={alt} 
        referrerPolicy="no-referrer"
        className={`w-full h-full object-cover ${aspectClassName}`}
      />
      
      {isAdmin && (
        <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              openImageEditor(src, onSave, title || alt);
            }}
            className="bg-sky-500 text-slate-950 font-bold px-4 py-2 rounded-xl flex items-center space-x-2 text-xs hover:bg-sky-450 hover:scale-105 active:scale-95 transition cursor-pointer shadow-lg"
          >
            <Edit3 className="w-4 h-4" />
            <span>Editar Imagem</span>
          </button>
        </div>
      )}
    </div>
  );
};

// Global Image Customizer Dialog
export const ImageEditorModal: React.FC = () => {
  const { imageEditorState, closeImageEditor } = useAdmin();
  const [urlInput, setUrlInput] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Settle internal state on opening
  React.useEffect(() => {
    if (imageEditorState.isOpen) {
      setUrlInput(imageEditorState.currentUrl);
    }
  }, [imageEditorState.isOpen, imageEditorState.currentUrl]);

  if (!imageEditorState.isOpen) return null;

  const handleSave = () => {
    if (urlInput.trim()) {
      imageEditorState.onSave(urlInput.trim());
      closeImageEditor();
    }
  };

  const selectPreset = (url: string) => {
    setUrlInput(url);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileChange = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Por favor, envie um arquivo de imagem válido (PNG, JPG, JPEG, WEBP).');
      return;
    }
    if (file.size > 2.5 * 1024 * 1024) {
      alert('Sua imagem é muito grande! Envie um arquivo com menos de 2.5MB para garantir a persistência em cache.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result && typeof e.target.result === 'string') {
        setUrlInput(e.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn text-slate-800">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ImageIcon className="w-5 h-5 text-sky-400" />
            <h3 className="font-sans font-extrabold text-base md:text-lg">
              {imageEditorState.title}
            </h3>
          </div>
          <button 
            onClick={closeImageEditor}
            className="p-1 rounded-full text-slate-400 hover:text-white transition cursor-pointer"
            aria-label="Declinadores"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
          
          {/* Current / Proposed Preview */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div className="md:col-span-4 flex flex-col items-center justify-center bg-slate-100 rounded-xl p-3 border border-slate-200">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">Visualização</span>
              <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-white shadow-md bg-slate-250 relative">
                <img 
                  src={urlInput || 'https://picsum.photos/seed/test/150/150'} 
                  alt="Previa" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/broken/150/150';
                  }}
                />
              </div>
            </div>
            
            <div className="md:col-span-8 flex flex-col justify-between space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wide text-slate-600 block">
                  Endereço URL da Imagem (Insira qualquer link público)
                </label>
                <input 
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="Insira de forma legível a URL de sua imagem aqui..."
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs md:text-sm focus:outline-hidden focus:border-sky-600 text-slate-800 font-medium"
                />
                <span className="text-[10px] text-slate-400 block leading-relaxed">
                  Insira o link de qualquer imagem pública da internet.
                </span>
              </div>

              <div className="relative my-1">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase">
                  <span className="bg-slate-50 px-2 text-slate-400 font-bold">ou envie o arquivo direto</span>
                </div>
              </div>

              <div>
                <input 
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileChange(e.target.files[0]);
                    }
                  }}
                  accept="image/*"
                  className="hidden"
                />

                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={triggerFileInput}
                  className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition duration-150 flex flex-col items-center justify-center space-y-1 ${
                    isDragging 
                      ? 'border-sky-500 bg-sky-50 text-sky-850' 
                      : 'border-slate-200 bg-white hover:bg-slate-50/50 text-slate-500'
                  }`}
                >
                  <Upload className={`w-5 h-5 ${isDragging ? 'animate-bounce text-sky-600' : 'text-slate-400'}`} />
                  <p className="text-xs font-bold">
                    Arraste sua foto aqui ou <span className="text-sky-600 underline">clique para buscar</span>
                  </p>
                  <span className="text-[9px] text-slate-400">Suporta PNG, JPG ou WebP (Até 2.5MB)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick presets library (Unsplash Categorized) */}
          <div className="space-y-4">
            <h4 className="font-sans font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
              Biblioteca de Amostras Odontológicas Premium
            </h4>
            
            <div className="space-y-5">
              {PRESET_LIBRARY.map((group) => (
                <div key={group.category} className="space-y-2">
                  <span className="text-[10px] font-bold text-sky-600 uppercase tracking-widest block">
                    {group.category}
                  </span>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    {group.items.map((preset, idx) => {
                      const isSelected = urlInput === preset.url;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => selectPreset(preset.url)}
                          className={`group/btn relative text-left rounded-xl overflow-hidden aspect-square border-2 transition-all ${
                            isSelected ? 'border-sky-500 scale-95 shadow-md' : 'border-transparent hover:border-slate-300'
                          }`}
                        >
                          <img 
                            src={preset.url} 
                            alt={preset.label} 
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-x-0 bottom-0 bg-slate-950/80 p-1 text-[8px] text-white font-medium text-center truncate">
                            {preset.label}
                          </div>
                          {isSelected && (
                            <div className="absolute top-1 right-1 bg-sky-500 text-slate-950 rounded-full p-0.5">
                              <Check className="w-3 h-3" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Action button bar */}
        <div className="border-t border-slate-100 p-4 bg-slate-50 flex justify-end space-x-3">
          <button
            onClick={closeImageEditor}
            className="bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 font-bold px-5 py-2.5 rounded-xl text-xs transition cursor-pointer"
          >
            Cancelar
          </button>
          
          <button
            onClick={handleSave}
            disabled={!urlInput.trim()}
            className="bg-sky-600 hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-6 py-2.5 rounded-xl text-xs transition cursor-pointer shadow-md"
          >
            Aplicar Imagem
          </button>
        </div>

      </div>
    </div>
  );
};

// Admin Login Floating/Persistent toggle and Control Drawer Trigger
export const AdminFloatAccess: React.FC = () => {
  const { isAdmin, login, logout } = useAdmin();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(password);
    if (success) {
      setIsLoginOpen(false);
      setPassword('');
      setErrorMsg('');
      setIsPanelOpen(true); // Open the control dashboard automatically!
    } else {
      setErrorMsg('Senha inválida! Tente novamente.');
    }
  };

  return (
    <>
      {/* Tiny Persistent Footer Button */}
      <div className="fixed bottom-4 left-4 z-40">
        {isAdmin ? (
          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => setIsPanelOpen(!isPanelOpen)}
              className="bg-slate-950 text-white hover:bg-slate-900 font-extrabold px-3.5 py-2 rounded-full text-[11px] uppercase tracking-wider flex items-center space-x-1.5 shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer border border-sky-400"
            >
              <Unlock className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
              <span>Painel Admin</span>
            </button>
            <button
              onClick={logout}
              title="Sair do Modo Admin"
              className="bg-red-600 hover:bg-red-700 text-white rounded-full p-2 shadow-xl transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => {
              setIsLoginOpen(true);
              setErrorMsg('');
            }}
            className="bg-slate-900/40 hover:bg-slate-900 text-slate-300 hover:text-white rounded-xl p-2.5 shadow-md hover:shadow-lg transition-all duration-300 flex items-center space-x-1.5 text-xs font-semibold cursor-pointer border border-slate-200/20 backdrop-blur-xs"
          >
            <Lock className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Painel Admin</span>
          </button>
        )}
      </div>

      {/* Login Prompt Dialog */}
      {isLoginOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl border border-slate-200 text-slate-800">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2">
                <Lock className="w-5 h-5 text-sky-600" />
                <h3 className="font-sans font-extrabold text-base md:text-lg">Módulo do Administrador</h3>
              </div>
              <button 
                onClick={() => setIsLoginOpen(false)}
                className="text-slate-400 hover:text-slate-700 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Digite a senha mestra atribuída para entrar no modo de edição em tempo real das imagens e conteúdos.
            </p>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wide block">Senha do Administrador</label>
                <input 
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ex: 1966"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-hidden focus:border-sky-600 focus:bg-white"
                />
              </div>

              {errorMsg && (
                <p className="text-xs text-red-600 font-semibold bg-red-50 p-2.5 rounded-lg border border-red-100 flex items-center space-x-1">
                  <span>⚠️</span>
                  <span>{errorMsg}</span>
                </p>
              )}

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsLoginOpen(false)}
                  className="bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold px-4 py-2 rounded-xl text-xs transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-sky-600 hover:bg-sky-700 text-white font-extrabold px-5 py-2.5 rounded-xl text-xs transition flex items-center space-x-1.5 cursor-pointer shadow-md"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Entrar</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Control Panel Dashboard (Dynamic add elements "incluir imagens") */}
      {isPanelOpen && isAdmin && (
        <AdminControlPanel onClose={() => setIsPanelOpen(false)} />
      )}
    </>
  );
};

// Full Control Dashboard Drawer
interface AdminControlPanelProps {
  onClose: () => void;
}

export const AdminControlPanel: React.FC<AdminControlPanelProps> = ({ onClose }) => {
  const adminState = useAdmin();
  const [activeTab, setActiveTab] = useState<'geral' | 'doctors' | 'cases' | 'testimonials' | 'gallery' | 'leads'>('geral');

  // Input states for inserting new Doctors
  const [newDoc, setNewDoc] = useState({
    name: '',
    role: '',
    cro: '',
    specialtyId: 'implantes',
    imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
    bio: ''
  });

  const [editingDoctorId, setEditingDoctorId] = useState<string | null>(null);

  const startEditDoctor = (d: Doctor) => {
    setEditingDoctorId(d.id);
    setNewDoc({
      name: d.name,
      role: d.role,
      cro: d.cro,
      specialtyId: d.specialtyId,
      imageUrl: d.imageUrl,
      bio: d.bio
    });
    setActiveTab('doctors'); // Ensure we're on the tab
  };

  const cancelEditDoctor = () => {
    setEditingDoctorId(null);
    setNewDoc({
      name: '',
      role: '',
      cro: '',
      specialtyId: 'implantes',
      imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
      bio: ''
    });
  };

  // Input states for inserting new Case Studies
  const [newCase, setNewCase] = useState({
    title: '',
    specialty: '',
    patientInitials: '',
    dentist: '',
    beforeImg: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=600',
    afterImg: 'https://images.unsplash.com/photo-1613521140210-b4d98588f58d?auto=format&fit=crop&q=80&w=600'
  });

  const [editingCaseId, setEditingCaseId] = useState<string | null>(null);

  const startEditCase = (c: any) => {
    setEditingCaseId(c.id);
    setNewCase({
      title: c.title,
      specialty: c.specialty,
      patientInitials: c.patientInitials,
      dentist: c.dentist,
      beforeImg: c.beforeImg,
      afterImg: c.afterImg
    });
    setActiveTab('cases'); // Ensure we're on the tab
  };

  const cancelEditCase = () => {
    setEditingCaseId(null);
    setNewCase({
      title: '',
      specialty: '',
      patientInitials: '',
      dentist: '',
      beforeImg: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=600',
      afterImg: 'https://images.unsplash.com/photo-1613521140210-b4d98588f58d?auto=format&fit=crop&q=80&w=600'
    });
  };

  // Input states for inserting new Testimonials
  const [newTest, setNewTest] = useState({
    name: '',
    age: 30,
    city: 'São Paulo',
    rating: 5,
    text: '',
    treatmentName: '',
    treatmentId: 'implantes',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150'
  });

  // Dynamic gallery input states
  const [newGallery, setNewGallery] = useState({
    imageUrl: 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&q=80&w=600',
    caption: ''
  });

  // Insertion handlers
  const handleAddDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingDoctorId) {
      adminState.updateDoctor(editingDoctorId, newDoc);
      setEditingDoctorId(null);
      alert('Informações do especialista atualizadas com sucesso!');
    } else {
      adminState.addDoctor(newDoc);
      alert('Especialista adicionado com sucesso!');
    }
    setNewDoc({
      name: '',
      role: '',
      cro: '',
      specialtyId: 'implantes',
      imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
      bio: ''
    });
  };

  const handleAddCase = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCaseId) {
      adminState.updateCaseStudy(editingCaseId, newCase);
      setEditingCaseId(null);
      alert('Caso clínico atualizado com sucesso!');
    } else {
      adminState.addCaseStudy(newCase);
      alert('Caso de Antes e Depois adicionado!');
    }
    setNewCase({
      title: '',
      specialty: '',
      patientInitials: '',
      dentist: '',
      beforeImg: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=600',
      afterImg: 'https://images.unsplash.com/photo-1613521140210-b4d98588f58d?auto=format&fit=crop&q=80&w=600'
    });
  };

  const handleAddTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    adminState.addTestimonial(newTest);
    setNewTest({
      name: '',
      age: 30,
      city: 'São Paulo',
      rating: 5,
      text: '',
      treatmentName: '',
      treatmentId: 'implantes',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150'
    });
    alert('Depoimento adicionado!');
  };

  const handleAddGalleryItem = (e: React.FormEvent) => {
    e.preventDefault();
    adminState.addGalleryItem(newGallery.imageUrl, newGallery.caption);
    setNewGallery({
      imageUrl: 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&q=80&w=600',
      caption: ''
    });
    alert('Imagem adicionada à Galeria da Clínica!');
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:max-w-xl bg-white shadow-2xl z-50 flex flex-col border-l border-slate-200 animate-slideOver text-slate-800">
      
      {/* Header bar */}
      <div className="bg-slate-950 text-white px-6 py-4 flex items-center justify-between shadow-md shrink-0">
        <div className="flex items-center space-x-2">
          <Sparkles className="text-sky-400 w-5 h-5 animate-pulse" />
          <div>
            <h3 className="font-sans font-extrabold text-sm uppercase tracking-wide leading-none">Painel de Gerenciamento</h3>
            <span className="text-[10px] text-sky-305 font-mono">Modo de Edição Permanente</span>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-1 rounded-full text-slate-400 hover:text-white transition cursor-pointer"
          aria-label="Contramedidas"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Tabs navigation */}
      <div className="flex overflow-x-auto whitespace-nowrap border-b border-slate-100 bg-slate-50 text-xs font-bold leading-normal shrink-0 md:flex-wrap">
        <button
          onClick={() => setActiveTab('geral')}
          className={`flex-1 min-w-[100px] shrink-0 md:min-w-0 md:shrink-1 py-3 text-center border-b-2 transition ${
            activeTab === 'geral' ? 'border-sky-600 text-sky-600 bg-white' : 'border-transparent text-slate-500 hover:bg-slate-100/50'
          }`}
        >
          Geral (Hero)
        </button>
        <button
          onClick={() => setActiveTab('doctors')}
          className={`flex-1 min-w-[100px] shrink-0 md:min-w-0 md:shrink-1 py-3 text-center border-b-2 transition ${
            activeTab === 'doctors' ? 'border-sky-600 text-sky-600 bg-white' : 'border-transparent text-slate-500 hover:bg-slate-100/50'
          }`}
        >
          Médicos (+Img)
        </button>
        <button
          onClick={() => setActiveTab('cases')}
          className={`flex-1 min-w-[100px] shrink-0 md:min-w-0 md:shrink-1 py-3 text-center border-b-2 transition ${
            activeTab === 'cases' ? 'border-sky-600 text-sky-600 bg-white' : 'border-transparent text-slate-500 hover:bg-slate-100/50'
          }`}
        >
          Antes/Depois
        </button>
        <button
          onClick={() => setActiveTab('gallery')}
          className={`flex-1 min-w-[100px] shrink-0 md:min-w-0 md:shrink-1 py-3 text-center border-b-2 transition ${
            activeTab === 'gallery' ? 'border-sky-600 text-sky-600 bg-white' : 'border-transparent text-slate-500 hover:bg-slate-100/50'
          }`}
        >
          Galeria (+Img)
        </button>
        <button
          onClick={() => setActiveTab('leads')}
          className={`flex-1 min-w-[150px] shrink-0 md:min-w-0 md:shrink-1 py-3 text-center border-b-2 transition ${
            activeTab === 'leads' ? 'border-sky-600 text-sky-600 bg-white' : 'border-transparent text-slate-500 hover:bg-slate-100/50'
          }`}
        >
          Leads & Consultas ({adminState.bookings.length + adminState.leads.length})
        </button>
      </div>

      {/* Dashboard Body Panel */}
      <div className="p-6 overflow-y-auto flex-1 space-y-6">
        
        {/* TAB GERAL: Hero image and global assets */}
        {activeTab === 'geral' && (
          <div className="space-y-6 animate-fadeIn">
            <h4 className="font-sans font-bold text-[13px] uppercase tracking-wider text-slate-900 border-b pb-2">
              Edição da Doutora Principal (Hero)
            </h4>
            
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center space-x-4">
              <img 
                src={adminState.heroDoctorImageUrl} 
                alt="Promo" 
                referrerPolicy="no-referrer"
                className="w-16 h-16 rounded-xl object-cover shrink-0 shadow-sm border border-slate-200"
              />
              <div className="flex-1 space-y-1.5">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">Foto da Dra. Mariana (Hero)</span>
                <button
                  onClick={() => adminState.openImageEditor(adminState.heroDoctorImageUrl, adminState.updateHeroDoctorImage, 'Imagem Doutora Principal')}
                  className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-1.5 px-3 rounded-lg text-[11px] transition cursor-pointer"
                >
                  Alterar Imagem da Hero
                </button>
              </div>
            </div>

            <div className="bg-sky-50 border border-sky-100 p-4 rounded-2xl text-sky-950 space-y-1">
              <h5 className="font-bold text-xs">💡 Dica de Edição Dinâmica!</h5>
              <p className="text-[11px] text-sky-900 leading-normal">
                Você pode passar o mouse diretamente sobre <strong>qualquer imagem</strong> em toda a página e clicar no botão azul que aparece para trocá-la na hora! Todos os dados são salvos em cache de seu navegador (localStorage).
              </p>
            </div>
          </div>
        )}

        {/* TAB DOCTORS: Manage list of doctors & add new specialists */}
        {activeTab === 'doctors' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Form to insert new doctor card with image */}
            <form onSubmit={handleAddDoctor} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-4">
              <h4 className="font-sans font-extrabold text-[12px] uppercase tracking-wider text-slate-800 flex items-center space-x-1">
                {editingDoctorId ? <Edit3 className="w-4 h-4 text-sky-600 animate-pulse" /> : <Plus className="w-4 h-4 text-sky-600" />}
                <span>{editingDoctorId ? 'Editar Informações do Especialista' : 'Incluir Novo Médico / Especialista'}</span>
              </h4>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Nome Completo</label>
                  <input 
                    type="text" 
                    required
                    value={newDoc.name}
                    onChange={e => setNewDoc({...newDoc, name: e.target.value})}
                    placeholder="Ex: Dr. Paulo Souza"
                    className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-hidden focus:border-sky-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">CRO</label>
                  <input 
                    type="text" 
                    required
                    value={newDoc.cro}
                    onChange={e => setNewDoc({...newDoc, cro: e.target.value})}
                    placeholder="Ex: CRO-SP 123.456"
                    className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-hidden focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Cargo / Especialidade de Atuação</label>
                <input 
                  type="text" 
                  required
                  value={newDoc.role}
                  onChange={e => setNewDoc({...newDoc, role: e.target.value})}
                  placeholder="Ex: Especialista em Clínico Geral"
                  className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-hidden focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Filtro de Agenda</label>
                  <select
                    value={newDoc.specialtyId}
                    onChange={e => setNewDoc({...newDoc, specialtyId: e.target.value})}
                    className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-hidden focus:border-sky-500"
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
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Imagem URL (Vinte Opções Prontas)</label>
                  <div className="flex space-x-1">
                    <input 
                      type="text" 
                      required
                      value={newDoc.imageUrl}
                      onChange={e => setNewDoc({...newDoc, imageUrl: e.target.value})}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-[10px] text-slate-700 focus:outline-hidden focus:border-sky-500"
                    />
                    <button
                      type="button"
                      onClick={() => adminState.openImageEditor(newDoc.imageUrl, (url) => setNewDoc({...newDoc, imageUrl: url}), 'Escolher Foto para Cadastrar Especialista')}
                      title="Selecionar da Galeria"
                      className="bg-sky-500 hover:bg-sky-600 text-slate-950 p-1.5 rounded-lg text-xs font-bold shrink-0"
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Biografia Resumida</label>
                <textarea 
                  required
                  rows={2}
                  value={newDoc.bio}
                  onChange={e => setNewDoc({...newDoc, bio: e.target.value})}
                  placeholder="Ex: Formado pela USP com mais de 7 anos de experiência clínica corporativa especializada..."
                  className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-hidden focus:border-sky-500"
                />
              </div>

              <div className="flex space-x-2">
                {editingDoctorId && (
                  <button
                    type="button"
                    onClick={cancelEditDoctor}
                    className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-705 font-bold py-2 rounded-xl text-xs transition cursor-pointer"
                  >
                    Cancelar Edição
                  </button>
                )}
                <button
                  type="submit"
                  className="flex-1 bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 rounded-xl text-xs transition cursor-pointer shadow-sm flex items-center justify-center space-x-1"
                >
                  {editingDoctorId ? <Edit3 className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  <span>{editingDoctorId ? 'Salvar Alterações' : 'Cadastrar Médico'}</span>
                </button>
              </div>
            </form>

            {/* List of registered specialists and options to delete or open inline picture editor */}
            <div className="space-y-3">
              <h4 className="font-sans font-bold text-[12px] uppercase tracking-wider text-slate-900 border-b pb-1">Medicos Cadastrados atuais ({adminState.doctors.length})</h4>
              
              <div className="divide-y divide-slate-100 max-h-[220px] overflow-y-auto pr-1">
                {adminState.doctors.map((d) => (
                  <div key={d.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center space-x-2 min-w-0">
                      <img 
                        src={d.imageUrl} 
                        alt="Foto do Medico" 
                        referrerPolicy="no-referrer"
                        className="w-9 h-9 rounded-lg object-cover shrink-0 border border-slate-200"
                      />
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 truncate">{d.name}</p>
                        <p className="text-[10px] text-slate-500 truncate">{d.cro} • {d.role}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1 shrink-0">
                      <button
                        onClick={() => startEditDoctor(d)}
                        className="text-amber-600 hover:bg-amber-50 p-1.5 rounded-lg transition"
                        title="Editar Informações"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => adminState.openImageEditor(d.imageUrl, (url) => adminState.updateDoctorImage(d.id, url), `Imagem de ${d.name}`)}
                        className="text-sky-600 hover:bg-sky-50 p-1.5 rounded-lg transition"
                        title="Trocar Foto"
                      >
                        <ImageIcon className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Excluir ${d.name} do corpo associado?`)) {
                            adminState.deleteDoctor(d.id);
                          }
                        }}
                        className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition"
                        title="Excluir"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB CASES: Manage Before/After cases list */}
        {activeTab === 'cases' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Form to insert new case */}
            <form onSubmit={handleAddCase} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-4">
              <h4 className="font-sans font-extrabold text-[12px] uppercase tracking-wider text-slate-800 flex items-center space-x-1">
                {editingCaseId ? <Edit3 className="w-4 h-4 text-sky-600" /> : <Plus className="w-4 h-4 text-sky-600" />}
                <span>{editingCaseId ? 'Editar Informações do Caso Clínico' : 'Incluir Novo Caso de Antes e Depois'}</span>
              </h4>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Título da Transformação</label>
                <input 
                  type="text" 
                  required
                  value={newCase.title}
                  onChange={e => setNewCase({...newCase, title: e.target.value})}
                  placeholder="Ex: Nova Cor com Lentes de Porcelana"
                  className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-hidden focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Especialidade</label>
                  <input 
                    type="text" 
                    required
                    value={newCase.specialty}
                    onChange={e => setNewCase({...newCase, specialty: e.target.value})}
                    placeholder="Ex: Estética / Porcelana"
                    className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-hidden focus:border-sky-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Iniciais/Idade do Paciente</label>
                  <input 
                    type="text" 
                    required
                    value={newCase.patientInitials}
                    onChange={e => setNewCase({...newCase, patientInitials: e.target.value})}
                    placeholder="Ex: F.G.S, 34 anos"
                    className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-hidden focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Dente em Desalinho (Antes)</label>
                  <div className="flex space-x-1">
                    <input 
                      type="text" 
                      required
                      value={newCase.beforeImg}
                      onChange={e => setNewCase({...newCase, beforeImg: e.target.value})}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-[10px] text-slate-700"
                    />
                    <button
                      type="button"
                      onClick={() => adminState.openImageEditor(newCase.beforeImg, (url) => setNewCase({...newCase, beforeImg: url}), 'Estética (Antes)')}
                      className="bg-sky-500 hover:bg-sky-600 text-slate-950 p-1 rounded-lg animate-pulse"
                      title="Selecionar imagem para o Antes"
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Sorriso Revitalizado (Depois)</label>
                  <div className="flex space-x-1">
                    <input 
                      type="text" 
                      required
                      value={newCase.afterImg}
                      onChange={e => setNewCase({...newCase, afterImg: e.target.value})}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-[10px] text-slate-700"
                    />
                    <button
                      type="button"
                      onClick={() => adminState.openImageEditor(newCase.afterImg, (url) => setNewCase({...newCase, afterImg: url}), 'Alinhado / Branco (Depois)')}
                      className="bg-sky-500 hover:bg-sky-600 text-slate-950 p-1 rounded-lg animate-pulse"
                      title="Selecionar imagem para o Depois"
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Dentista Responsável</label>
                <input 
                  type="text" 
                  required
                  value={newCase.dentist}
                  onChange={e => setNewCase({...newCase, dentist: e.target.value})}
                  placeholder="Ex: Dra. Beatriz Menezes"
                  className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-hidden focus:border-sky-500"
                />
              </div>

              <div className="flex space-x-2">
                {editingCaseId && (
                  <button
                    type="button"
                    onClick={cancelEditCase}
                    className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-705 font-bold py-2 rounded-xl text-xs transition cursor-pointer"
                  >
                    Cancelar Edição
                  </button>
                )}
                <button
                  type="submit"
                  className="flex-1 bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 rounded-xl text-xs transition cursor-pointer shadow-sm flex items-center justify-center space-x-1"
                >
                  {editingCaseId ? <Edit3 className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  <span>{editingCaseId ? 'Salvar Alterações' : 'Salvar Caso de Sucesso'}</span>
                </button>
              </div>
            </form>

            {/* List of Cases */}
            <div className="space-y-3">
              <h4 className="font-sans font-bold text-[12px] uppercase tracking-wider text-slate-900 border-b pb-1">Casos Clinicos ({adminState.caseStudies.length})</h4>
              <div className="max-h-[220px] overflow-y-auto divide-y divide-slate-100 pr-1">
                {adminState.caseStudies.map((c) => (
                  <div key={c.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="min-w-0 pr-3">
                      <p className="font-bold text-slate-900 truncate">{c.title}</p>
                      <p className="text-[10px] text-slate-500 truncate">{c.patientInitials} • {c.specialty}</p>
                    </div>
                    
                    <div className="flex items-center space-x-1 shrink-0">
                      <button
                        onClick={() => startEditCase(c)}
                        className="text-amber-655 hover:bg-amber-50 p-1.5 rounded-lg transition"
                        title="Editar Informações"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => adminState.openImageEditor(c.beforeImg, (url) => adminState.updateCaseStudyImage(c.id, 'beforeImg', url), 'Editar Foto do ANTES')}
                        className="text-sky-600 hover:bg-sky-50 px-1.5 py-1.5 rounded-lg text-[10px] font-mono font-bold uppercase transition"
                        title="Editar Foto do Antes"
                      >
                        Antes
                      </button>
                      <button
                        onClick={() => adminState.openImageEditor(c.afterImg, (url) => adminState.updateCaseStudyImage(c.id, 'afterImg', url), 'Editar Foto do DEPOIS')}
                        className="text-green-600 hover:bg-green-50 px-1.5 py-1.5 rounded-lg text-[10px] font-mono font-bold uppercase transition"
                        title="Editar Foto do Depois"
                      >
                        Depois
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Tem certeza de que deseja apagar essa comparação?')) {
                            adminState.deleteCaseStudy(c.id);
                          }
                        }}
                        className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition"
                        aria-label="Expulsar"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB GALLERY: Manage dynamic clinical/office gallery items directly */}
        {activeTab === 'gallery' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Form to insert general images with captions */}
            <form onSubmit={handleAddGalleryItem} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-4">
              <h4 className="font-sans font-extrabold text-[12px] uppercase tracking-wider text-slate-800 flex items-center space-x-1">
                <Plus className="w-4 h-4 text-sky-600" />
                <span>Incluir Foto na Galeria de Visitas</span>
              </h4>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase block">Endereço URL da Nova Foto</label>
                <div className="flex space-x-1">
                  <input 
                    type="text" 
                    required
                    value={newGallery.imageUrl}
                    onChange={e => setNewGallery({...newGallery, imageUrl: e.target.value})}
                    placeholder="Selecione abaixo ou cole um link..."
                    className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800"
                  />
                  <button
                    type="button"
                    onClick={() => adminState.openImageEditor(newGallery.imageUrl, (url) => setNewGallery({...newGallery, imageUrl: url}), 'Selecionar Foto para Galeria')}
                    className="bg-sky-500 hover:bg-sky-600 text-slate-950 p-1 rounded-lg"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Legenda / Descrição da Foto</label>
                <input 
                  type="text" 
                  required
                  value={newGallery.caption}
                  onChange={e => setNewGallery({...newGallery, caption: e.target.value})}
                  placeholder="Ex: Consultório moderno com cadeira ergonômica"
                  className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-hidden focus:border-sky-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 rounded-xl text-xs transition cursor-pointer shadow-sm flex items-center justify-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Anexar Nova Foto à Clínica</span>
              </button>
            </form>

            {/* List of customized gallery pics with editing on the fly */}
            <div className="space-y-3">
              <h4 className="font-sans font-bold text-[12px] uppercase tracking-wider text-slate-900 border-b pb-1">Fotos na Galeria ({adminState.gallery.length})</h4>
              <div className="grid grid-cols-2 gap-3 max-h-[220px] overflow-y-auto pr-1">
                {adminState.gallery.map((item) => (
                  <div key={item.id} className="relative group rounded-xl overflow-hidden aspect-video border border-slate-200 bg-slate-100">
                    <img 
                      src={item.imageUrl} 
                      alt={item.caption} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-slate-900/70 p-1.5 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="text-[8px] text-white line-clamp-2 leading-tight">{item.caption}</p>
                      
                      <div className="flex justify-end space-x-1 justify-items-end">
                        <button
                          type="button"
                          onClick={() => adminState.openImageEditor(item.imageUrl, (url) => adminState.updateGalleryItem(item.id, url, item.caption), 'Editar Foto de Visita')}
                          className="bg-sky-500 text-slate-950 p-1 rounded hover:bg-sky-400"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => adminState.deleteGalleryItem(item.id)}
                          className="bg-red-600 text-white p-1 rounded hover:bg-red-500"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB LEADS: Watch and delete dynamically recorded lead entries */}
        {activeTab === 'leads' && (
          <div className="space-y-6 animate-fadeIn pb-6 text-slate-800">
            
            {/* Consultation Appointments Section */}
            <div className="space-y-3">
              <div className="flex justify-between items-center border-b pb-1.5 border-slate-200">
                <h4 className="font-sans font-extrabold text-[12px] uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <span>📅 Consultas Agendadas ({adminState.bookings.length})</span>
                </h4>
                {adminState.bookings.length > 0 && (
                  <button
                    onClick={() => {
                      if (confirm('Deseja limpar todos os agendamentos registrados? Isso irá zerar a lista permanentemente.')) {
                        adminState.bookings.forEach(b => adminState.deleteBooking(b.id));
                      }
                    }}
                    className="text-[10px] font-bold text-red-500 hover:underline cursor-pointer"
                  >
                    Excluir Tudo
                  </button>
                )}
              </div>

              {adminState.bookings.length === 0 ? (
                <div className="bg-slate-50 p-6 rounded-xl text-center border border-dashed border-slate-200">
                  <p className="text-xs text-slate-400 font-semibold">Nenhum agendamento online registrado ainda.</p>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                  {adminState.bookings.map((b) => (
                    <div key={b.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2 relative text-xs text-slate-800">
                      <button
                        onClick={() => adminState.deleteBooking(b.id)}
                        className="absolute top-2 right-2 text-slate-400 hover:text-red-500 transition cursor-pointer"
                        title="Remover Agendamento"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="space-y-0.5 pr-6">
                        <div className="flex items-center space-x-1.5">
                          <span className="font-bold text-slate-900">{b.patientName}</span>
                          <span className="bg-sky-100 text-sky-850 text-[9px] px-1.5 py-0.5 rounded-md font-bold uppercase font-mono">{b.id}</span>
                        </div>
                        <p className="text-slate-500 text-[10px] font-mono leading-relaxed">
                          Telefone: {b.patientPhone} <span className="opacity-40">|</span> Email: {b.patientEmail}
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-1.5 border-t border-slate-200/60 pt-2 text-[11px] text-slate-700 font-medium">
                        <p>📍 {specialties.find(s => s.id === b.specialtyId)?.name || b.specialtyId}</p>
                        <p>👨‍⚕️ {adminState.doctors.find(d => d.id === b.doctorId)?.name || 'Especialista Alocado'}</p>
                        <p>🗓️ {b.date}</p>
                        <p>⏰ {b.timeSlot} ({b.period === 'manha' ? 'Manhã' : b.period === 'tarde' ? 'Tarde' : 'Noite'})</p>
                      </div>
                      {b.patientNotes && (
                        <p className="text-[10px] text-slate-500 bg-white p-2 rounded-md border border-slate-100 block italic leading-normal">
                          " {b.patientNotes} "
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Diagnostic Quiz Leads Section */}
            <div className="space-y-3">
              <div className="flex justify-between items-center border-b pb-1.5 border-slate-200">
                <h4 className="font-sans font-extrabold text-[12px] uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <span>⚡ Respostas do Simulador ({adminState.leads.length})</span>
                </h4>
                {adminState.leads.length > 0 && (
                  <button
                    onClick={() => {
                      if (confirm('Deseja limpar todos os leads capturados do simulador?')) {
                        adminState.leads.forEach(l => adminState.deleteLead(l.id));
                      }
                    }}
                    className="text-[10px] font-bold text-red-500 hover:underline cursor-pointer"
                  >
                    Excluir Tudo
                  </button>
                )}
              </div>

              {adminState.leads.length === 0 ? (
                <div className="bg-slate-50 p-6 rounded-xl text-center border border-dashed border-slate-200">
                  <p className="text-xs text-slate-400 font-semibold">Nenhum lead preenchido via simulador ainda.</p>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                  {adminState.leads.map((l) => (
                    <div key={l.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2 relative text-xs text-slate-800">
                      <button
                        onClick={() => adminState.deleteLead(l.id)}
                        className="absolute top-2 right-2 text-slate-400 hover:text-red-500 transition cursor-pointer"
                        title="Remover Lead"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="space-y-0.5 pr-6">
                        <div className="flex items-center space-x-1.5">
                          <span className="font-bold text-slate-900">{l.name}</span>
                          <span className="bg-emerald-100 text-emerald-850 text-[9px] px-1.5 py-0.5 rounded-md font-bold uppercase font-mono">{l.id}</span>
                        </div>
                        <p className="text-slate-500 text-[10px] font-mono leading-relaxed">
                          Telefone: {l.phone} {l.email ? ` | Email: ${l.email}` : ''}
                        </p>
                      </div>

                      <div className="border-t border-slate-200/60 pt-2">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">Recomendação Gerada</span>
                        <p className="text-[11px] font-bold text-slate-850 mt-0.5">🌟 {l.recommendedTreatment}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

      </div>

      {/* Footer bar */}
      <div className="border-t border-slate-100 p-4 bg-slate-950 shrink-0 flex justify-between items-center text-[10px] text-slate-400 font-mono">
        <span>Pronto para conferir?</span>
        <button
          onClick={onClose}
          className="bg-white/10 hover:bg-white/20 text-white font-extrabold text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-lg transition"
        >
          Fechar Painel
        </button>
      </div>

    </div>
  );
};
