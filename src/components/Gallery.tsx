import React from 'react';
import { useAdmin } from '../context/AdminContext';
import { EditableImageWrapper } from './AdminComponents';
import { Plus, Sparkles, Image as ImageIcon, Trash2 } from 'lucide-react';

export default function Gallery() {
  const { gallery, isAdmin, addGalleryItem, deleteGalleryItem, openImageEditor } = useAdmin();

  const handleAddQuickImage = () => {
    openImageEditor('', (newUrl) => {
      addGalleryItem(newUrl, 'Nova foto exclusiva de nossa clínica integrada');
    }, 'Adicionar Nova Imagem à Galeria');
  };

  return (
    <section 
      id="gallery-section" 
      className="py-20 md:py-24 bg-white"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Header Block */}
        <div id="gallery-header" className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-sky-600 uppercase tracking-widest text-xs font-bold block">
            Nossos Bastidores Premium
          </span>
          <h2 id="gallery-title" className="text-3xl md:text-4xl font-sans font-extrabold text-slate-950 tracking-tight">
            Galeria de Fotos da Clínica
          </h2>
          <p id="gallery-description" className="text-slate-600 text-sm md:text-base leading-relaxed">
            Nossos consultórios são modernos, limpos, equipados com instrumentos avançados de ponta para fornecer um ambiente relaxante e seguro. {isAdmin && <strong className="text-sky-600">Você está logado! Clique em qualquer foto abaixo para alterá-la ou inclua novas fotos em tempo real.</strong>}
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {gallery.map((item) => (
            <div 
              key={item.id}
              className="group/card relative rounded-3xl overflow-hidden border border-slate-200/50 shadow-md hover:shadow-xl transition-all duration-300 bg-slate-50 flex flex-col h-full"
            >
              <div className="aspect-video relative overflow-hidden bg-slate-100 flex-1">
                <EditableImageWrapper 
                  src={item.imageUrl}
                  alt={item.caption}
                  onSave={(newUrl) => {
                    // Update this item
                    const savedGallery = localStorage.getItem('cfg_gallery');
                    const arr = savedGallery ? JSON.parse(savedGallery) : gallery;
                    const next = arr.map((g: any) => g.id === item.id ? { ...g, imageUrl: newUrl } : g);
                    localStorage.setItem('cfg_gallery', JSON.stringify(next));
                    window.dispatchEvent(new Event('storage'));
                    // We can also trigger reload or context handles
                    window.location.reload();
                  }}
                  aspectClassName="aspect-video"
                  title="Editar Foto da Galeria"
                />
              </div>

              {/* Caption */}
              <div className="p-4 flex justify-between items-center bg-white border-t border-slate-100 shrink-0">
                <p className="text-xs md:text-sm text-slate-700 font-medium line-clamp-1">
                  {item.caption}
                </p>
                {isAdmin && (
                  <button
                    onClick={() => {
                      if (confirm('Deseja excluir esta imagem da galeria?')) {
                        deleteGalleryItem(item.id);
                      }
                    }}
                    className="p-1 text-red-500 hover:bg-red-50 rounded-lg transition"
                    title="Excluir Imagem"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Admin "incluir imagens" Card trigger */}
          {isAdmin && (
            <button
              onClick={handleAddQuickImage}
              className="border-2 border-dashed border-sky-300 hover:border-sky-500 hover:bg-sky-50/20 rounded-3xl flex flex-col items-center justify-center p-8 text-center transition min-h-[220px] cursor-pointer group"
            >
              <div className="bg-sky-100 group-hover:bg-sky-200 text-sky-700 p-4 rounded-full transition mb-3">
                <Plus className="w-6 h-6" />
              </div>
              <span className="font-bold text-sm text-sky-800">Incluir Nova Foto</span>
              <span className="text-[11px] text-slate-500 mt-1 max-w-[200px]">
                Adicione uma imagem com link direto para se destacar na galeria principal.
              </span>
            </button>
          )}
        </div>

      </div>
    </section>
  );
}
