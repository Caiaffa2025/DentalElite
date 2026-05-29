import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Smile, Info, ArrowRight, User } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export default function FloatingAssistant() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial welcome message
    setMessages([
      {
        id: 'welcome',
        sender: 'assistant',
        text: 'Olá! Sou a Nina, assistente virtual da Sorriso & Saúde. Como posso ajudar você a conquistar o seu sorriso perfeito hoje?',
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, []);

  // Scroll to bottom whenever messages increase
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Simulate smart responses based on keywords in Portuguese
    setTimeout(() => {
      let responseText = '';
      const lower = textToSend.toLowerCase();

      if (lower.includes('invisalign') || lower.includes('aparelho') || lower.includes('alinhador')) {
        responseText = 'Os alinhadores Invisalign® são totalmente transparentes e removíveis! O tempo médio de tratamento é super rápido (entre 6 e 18 meses). Gostaria de agendar uma simulação 3D grátis para ver como ficaria o seu sorriso?';
      } else if (lower.includes('implante') || lower.includes('dente') || lower.includes('ausente') || lower.includes('falha')) {
        responseText = 'Trabalhamos com implantes importados de titânio de carga rápida e cirurgia computadorizada sem cortes. O pós-operatório é excelente e indolor! Gostaria de falar com o Dr. Roberto na consulta de avaliação?';
      } else if (lower.includes('lente') || lower.includes('faceta') || lower.includes('estetica') || lower.includes('estética')) {
        responseText = 'As lentes de contato dental de porcelana corrigem a cor, o formato e o tamanho dos dentes em apenas 2 sessões clínicas. O resultado fica extremamente natural. Quer agendar uma avaliação com a Dra. Beatriz?';
      } else if (lower.includes('valor') || lower.includes('preço') || lower.includes('preco') || lower.includes('custo') || lower.includes('quanto')) {
        responseText = 'Cada sorriso é único, por isso precisamos realizar um escaneamento digital e fotografias na avaliação para montar seu orçamento. Mas facilitamos muito: parcelamos em até 12x sem juros no cartão de crédito! Vamos agendar sua avaliação para esta semana?';
      } else if (lower.includes('agenda') || lower.includes('marcar') || lower.includes('agendar') || lower.includes('consulta') || lower.includes('horario') || lower.includes('horário')) {
        responseText = 'Excelente escolha! Você pode usar o nosso "Agendador Online" logo acima de forma super prática, ou preencher seus dados aqui que nossa equipe liga para você imediatamente.';
      } else if (lower.includes('endereco') || lower.includes('endereço') || lower.includes('onde') || lower.includes('localizacao') || lower.includes('localização')) {
        responseText = 'Nossa clínica fica na Av. Paulista, 1000 - Cerqueira César, São Paulo - SP, a apenas 100 metros do metrô Brigadeiro! Possuímos estacionamento conveniado para sua comodidade.';
      } else {
        responseText = 'Ótima pergunta! Para darmos um parecer exato sobre o seu caso, recomendo agendarmos uma avaliação clínica com nossos dentistas USP. Podemos reservar um horário para você esta semana?';
      }

      setMessages(prev => [...prev, {
        id: Math.random().toString(),
        sender: 'assistant',
        text: responseText,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      }]);
      setIsTyping(false);
    }, 1500);
  };

  const selectSuggestedQuestion = (question: string) => {
    handleSendMessage(question);
  };

  const scrollToBooking = () => {
    setIsOpen(false);
    const element = document.getElementById('booking-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div id="virtual-assistant-container" className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          id="btn-trigger-assistant-chat"
          type="button"
          onClick={() => setIsOpen(true)}
          className="bg-sky-600 hover:bg-sky-700 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 relative cursor-pointer"
          aria-label="Abrir assistente virtual"
        >
          {/* Symmetrical active beacon */}
          <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-sky-400 border-2 border-white rounded-full flex items-center justify-center text-[10px] text-slate-950 font-bold">1</span>
          <MessageCircle className="w-6 h-6 animate-pulse" />
        </button>
      )}

      {/* Main Chatbox panel */}
      {isOpen && (
        <div 
          id="assistant-chatbox-panel"
          className="bg-white rounded-3xl shadow-2xl border border-slate-200/50 w-[350px] md:w-[380px] max-h-[500px] flex flex-col z-50 overflow-hidden animate-scaleUp"
        >
          {/* Header block with Doctor bio details */}
          <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-sky-450 shrink-0">
                <Smile className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-sans font-bold text-sm leading-tight">Suporte Sorriso & Saúde</h4>
                <div className="flex items-center space-x-1.5 mt-0.5">
                  <span className="w-2.5 h-2.5 bg-sky-400 rounded-full inline-block animate-pulse"></span>
                  <span className="text-[10px] text-sky-200 font-mono uppercase font-bold tracking-wider">Nina • Online</span>
                </div>
              </div>
            </div>

            <button
              id="btn-close-assistant-chat"
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-slate-300 hover:text-white p-1 rounded-full transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick clinical recommendation info banner */}
          <div className="bg-sky-50 text-sky-800 text-[11px] p-2.5 font-medium px-4 inline-flex items-center space-x-2 border-b border-sky-100">
            <Info className="w-4 h-4 shrink-0 text-sky-750" />
            <span>Respostas instantâneas sobre tratamentos e dúvidas.</span>
          </div>

          {/* Scrollable messages container */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50 min-h-[220px] max-h-[300px]">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div 
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs md:text-sm leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-sky-600 text-white rounded-tr-none'
                      : 'bg-white text-slate-800 border border-slate-200/50 rounded-tl-none shadow-xs'
                  }`}
                >
                  <p>{m.text}</p>
                </div>
                <span className="text-[9px] text-slate-400 mt-1 font-mono">{m.timestamp}</span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-start space-x-2">
                <div className="bg-white border border-slate-200/50 p-3 rounded-2xl rounded-tl-none flex space-x-1 items-center">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Preloaded suggested topics */}
          {messages.length === 1 && (
            <div className="p-3 bg-slate-100 flex flex-wrap gap-2 justify-center border-t border-slate-200/50 pb-2">
              <button
                id="btn-suggest-invisalign"
                onClick={() => selectSuggestedQuestion('Como funciona o Invisalign?')}
                className="bg-white hover:bg-sky-50 text-[10px] md:text-xs font-semibold px-2.5 py-1.5 rounded-full border border-slate-200 text-slate-700 transition cursor-pointer"
              >
                🦷 Invisalign®
              </button>
              <button
                id="btn-suggest-implantes"
                onClick={() => selectSuggestedQuestion('Quanto tempo demora o Implante?')}
                className="bg-white hover:bg-sky-50 text-[10px] md:text-xs font-semibold px-2.5 py-1.5 rounded-full border border-slate-200 text-slate-700 transition cursor-pointer"
              >
                🔩 Implantes
              </button>
              <button
                id="btn-suggest-lentes"
                onClick={() => selectSuggestedQuestion('O que são Lentes de Contato?')}
                className="bg-white hover:bg-sky-50 text-[10px] md:text-xs font-semibold px-2.5 py-1.5 rounded-full border border-slate-200 text-slate-700 transition cursor-pointer"
              >
                ✨ Lentes de Porcelana
              </button>
            </div>
          )}

          {/* Interactive footer actions to redirect */}
          <div className="p-2 bg-slate-950 flex justify-between items-center text-[11px] font-bold text-sky-305">
            <span>Prefere marcar direto?</span>
            <button
              onClick={scrollToBooking}
              className="bg-sky-500 hover:bg-sky-400 text-slate-950 px-2.5 py-1 rounded-lg flex items-center space-x-1 cursor-pointer"
            >
              <span>Abrir Agenda</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Messenger input line */}
          <div className="p-3 bg-white border-t border-slate-150 flex items-center space-x-2">
            <input
              type="text"
              id="input-assistant-user-text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendMessage(inputValue);
              }}
              placeholder="Digite sua dúvida aqui..."
              className="flex-1 text-slate-800 placeholder-slate-400 border border-slate-200 rounded-xl px-3 py-2 text-xs md:text-sm focus:outline-hidden focus:border-sky-600"
            />
            <button
              id="btn-send-message-assistant"
              onClick={() => handleSendMessage(inputValue)}
              className="bg-sky-600 hover:bg-sky-700 text-white p-2 rounded-xl transition cursor-pointer shrink-0"
              aria-label="Enviar mensagem"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
