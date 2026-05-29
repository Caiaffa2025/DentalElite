import React from 'react';
import { Shield, Cpu, RefreshCw, Layers, CheckCircle } from 'lucide-react';

export default function Technology() {
  const items = [
    {
      id: 'anestesia-zero-dor',
      icon: Cpu,
      title: 'Anestesia Sem Agulhas e Computadorizada',
      desc: 'O refluxo de soro fisiológico e anestésico é controlado gota a gota de forma eletrônica, eliminando totalmente a dor e a pressão tradicionais da picada de agulha.'
    },
    {
      id: 'scanner-3d',
      icon: Layers,
      title: 'Escaneamento Intraoral 3D',
      desc: 'Substituímos aquela massa de moldagem desconfortável por uma câmera filmadora 3D de alta definição que copia seus dentes na tela do computador em 2 minutos.'
    },
    {
      id: 'biosseguranca',
      icon: Shield,
      title: 'Biossegurança Rigorosa Nível Hospitalar',
      desc: 'Processos automatizados de lavagem térmica, esterilização monitorada quimicamente e lacres datados com rastreabilidade total de cada broca ou espelho.'
    },
    {
      id: 'laboratorio',
      icon: RefreshCw,
      title: 'Fresadora 3D e Laboratório Digital',
      desc: 'Produzimos coroas e restaurações estéticas de porcelana provisórias ou definitivas em poucas horas por meio de impressoras e tornos odontológicos 3D.'
    }
  ];

  return (
    <section id="technology-section" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Layout Side-by-side: Big visual on left, cards list on right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Visual copy of advanced tech clinic (Takes 5 columns) */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-sky-600 uppercase tracking-widest text-xs font-bold block">Tecnologia Premium</span>
            <h2 id="tech-title" className="text-3xl md:text-4xl font-sans font-extrabold text-slate-950 tracking-tight leading-tight">
              Equipamentos de Última Geração de Nossos Consultórios
            </h2>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed">
              Investimos constantemente em inovação para que você desfrute de procedimentos muito mais silenciosos, extremamente rápidos, indolores e altamente previsíveis.
            </p>

            <div className="p-5 bg-sky-50/50 rounded-2xl border border-sky-100 space-y-3">
              <h4 className="font-bold text-sky-950 text-sm">Por que isso melhora sua experiência?</h4>
              <ul className="space-y-2 text-xs text-sky-900 font-medium font-sans">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-sky-600 shrink-0" />
                  <span>Tratamentos até 2x mais rápidos que antigamente</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-sky-600 shrink-0" />
                  <span>Carga de dor e ansiedade reduzida para zero</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-sky-600 shrink-0" />
                  <span>Resultados simulados em tela antes da cirurgia</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: Grid list of cards (Takes 7 columns) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {items.map((it) => {
              const Icon = it.icon;
              return (
                <div
                  key={it.id}
                  id={`tech-card-${it.id}`}
                  className="bg-slate-50/70 p-5 rounded-3xl border border-slate-100 flex flex-col justify-between hover:bg-slate-50 transition duration-300"
                >
                  <div className="space-y-4">
                    <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-sans font-bold text-slate-900 text-sm md:text-base leading-tight">
                      {it.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {it.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
