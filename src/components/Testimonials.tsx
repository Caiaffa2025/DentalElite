import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { EditableImageWrapper } from './AdminComponents';
import { specialties } from '../data';
import { Star, Quote, ShieldCheck, Filter } from 'lucide-react';
import { motion } from 'motion/react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1]
    }
  }
};

export default function Testimonials() {
  const { testimonials, updateTestimonialImage } = useAdmin();
  const [selectedFilter, setSelectedFilter] = useState<string>('todos');

  const filteredTestimonials = selectedFilter === 'todos'
    ? testimonials
    : testimonials.filter(t => t.treatmentId === selectedFilter);

  return (
    <section 
      id="testimonials-section" 
      className="py-20 md:py-24 bg-white"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Header Block */}
        <motion.div 
          id="testimonials-header" 
          className="text-center max-w-3xl mx-auto mb-12 space-y-4"
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="text-sky-600 uppercase tracking-widest text-xs font-bold block">
            Satisfação Comprovada
          </span>
          <h2 id="testimonials-title" className="text-3xl md:text-4xl font-sans font-extrabold text-slate-950 tracking-tight">
            Depoimentos de Nossos Pacientes
          </h2>
          <p id="testimonials-description" className="text-slate-600 text-sm md:text-base leading-relaxed">
            Nada fala mais alto do que a felicidade de quem já passou pelo tratamento. Filtre os relatos abaixo pela especialidade que você busca.
          </p>
        </motion.div>

        {/* Filter categories tabs selector */}
        <motion.div 
          id="testimonials-filters"
          className="flex flex-wrap justify-center items-center gap-2 mb-10"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center space-x-1 bg-slate-100 px-4 py-2 rounded-full text-slate-500 text-xs font-bold mr-2">
            <Filter className="w-3.5 h-3.5" />
            <span className="uppercase tracking-wider">Filtrar por:</span>
          </div>

          <button
            id="btn-filter-testimonial-all"
            type="button"
            onClick={() => setSelectedFilter('todos')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition cursor-pointer border ${
              selectedFilter === 'todos'
                ? 'bg-sky-600 text-white border-sky-600 shadow-md shadow-sky-100'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            Todos os Relatos
          </button>

          {specialties.slice(0, 4).map((spec) => (
            <button
              key={spec.id}
              id={`btn-filter-testimonial-${spec.id}`}
              type="button"
              onClick={() => setSelectedFilter(spec.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition cursor-pointer border ${
                selectedFilter === spec.id
                  ? 'bg-sky-600 text-white border-sky-600 shadow-md shadow-sky-100'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
              }`}
            >
              {spec.name.replace('Aparelhos Alinhadores ', '')}
            </button>
          ))}
        </motion.div>

        {/* Testimonials Grid output */}
        {filteredTestimonials.length > 0 ? (
          <motion.div 
            key={selectedFilter}
            id="testimonials-cards-grid"
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {filteredTestimonials.map((item) => (
              <motion.div
                key={item.id}
                id={`testimonial-card-${item.id}`}
                variants={cardVariants}
                className="bg-slate-50/75 hover:bg-slate-50 hover:scale-[1.01] transition duration-300 p-6 md:p-8 rounded-3xl border border-slate-200/45 flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  {/* Top line review rating and Quote icon */}
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-1 bg-amber-50 border border-amber-200/50 px-2 py-0.5 rounded">
                      {[...Array(item.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                      ))}
                    </div>
                    <div className="text-sky-200 shrink-0">
                      <Quote className="w-10 h-10 transform scale-x-[-1]" />
                    </div>
                  </div>

                  {/* Body textual reviews */}
                  <p className="text-sm md:text-base text-slate-700 italic leading-relaxed">
                    "{item.text}"
                  </p>
                </div>

                {/* Profile row */}
                <div className="flex items-center space-x-3.5 border-t border-slate-200/50 pt-5 mt-auto">
                  <div className="w-12 h-12 rounded-2xl overflow-hidden shrink-0 border border-slate-300/30">
                    <EditableImageWrapper
                      src={item.avatarUrl}
                      alt={item.name}
                      onSave={(newUrl) => updateTestimonialImage(item.id, newUrl)}
                      aspectClassName="aspect-square"
                      title={`Foto de avatar de ${item.name}`}
                    />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm md:text-base text-slate-900 leading-tight flex items-center space-x-1.5">
                      <span>{item.name}</span>
                      <ShieldCheck className="w-4 h-4 text-sky-500 shrink-0" aria-label="Verificado" />
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      {item.age} anos • {item.city} • <span className="text-sky-600 font-semibold">{item.treatmentName}</span>
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-10">
            <p className="text-slate-500 text-sm italic">Nenhum depoimento encontrado para este filtro.</p>
          </div>
        )}

      </div>
    </section>
  );
}
