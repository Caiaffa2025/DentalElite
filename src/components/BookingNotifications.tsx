import React, { useState, useEffect } from 'react';
import { Sparkles, CalendarDays, CheckCircle, Smile } from 'lucide-react';

interface ToastData {
  name: string;
  treatment: string;
  timeAgo: string;
}

const mockUpdates: ToastData[] = [
  { name: 'Ana Carolina S.', treatment: 'Alinhadores Invisalign®', timeAgo: 'às 14:30h' },
  { name: 'Filipe de Souza', treatment: 'Implante Dentário', timeAgo: 'há 3 minutos' },
  { name: 'Juliane Mendes', treatment: 'Lentes de Porcelana', timeAgo: 'há 12 minutos' },
  { name: 'Dr. Roberto Takahashi', treatment: 'Liberou 2 novos horários para Implantes', timeAgo: 'nesta sexta' },
  { name: 'Lucas H. Oliveira', treatment: 'Clareamento Dental Violeta', timeAgo: 'há 18 minutos' },
  { name: 'Beatriz Cavalcante', treatment: 'Tratamento de Canal Estético', timeAgo: 'há 1 hora' }
];

export default function BookingNotifications() {
  const [currentNotification, setCurrentNotification] = useState<ToastData | null>(null);
  const [show, setShow] = useState<boolean>(false);

  useEffect(() => {
    // Show first update after 6 seconds
    const initialTimer = setTimeout(() => {
      triggerNotification(mockUpdates[0]);
    }, 6000);

    // Loop through updates
    let index = 1;
    const interval = setInterval(() => {
      const nextIndex = index % mockUpdates.length;
      triggerNotification(mockUpdates[nextIndex]);
      index++;
    }, 32000); // Trigger every 32 seconds

    // Add listner for actual patient bookings
    const handleNewBooking = (e: Event) => {
      const customEvent = e as CustomEvent<{ name: string; treatment: string }>;
      if (customEvent.detail) {
        // Delay slightly for real feel
        setTimeout(() => {
          triggerNotification({
            name: customEvent.detail.name,
            treatment: customEvent.detail.treatment,
            timeAgo: 'agora mesmo!'
          });
        }, 1200);
      }
    };

    window.addEventListener('new_booking_event', handleNewBooking);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
      window.removeEventListener('new_booking_event', handleNewBooking);
    };
  }, []);

  const triggerNotification = (data: ToastData) => {
    setCurrentNotification(data);
    setShow(true);

    // Hide after 6 seconds
    setTimeout(() => {
      setShow(false);
    }, 6000);
  };

  if (!currentNotification) return null;

  return (
    <div 
      id="floating-notification-toast"
      className={`fixed bottom-6 left-6 z-50 bg-slate-900/95 max-w-sm text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-800 transition-all duration-500 flex items-start space-x-3 backdrop-blur-md ${
        show 
          ? 'translate-y-0 opacity-100 scale-100' 
          : 'translate-y-8 opacity-0 scale-95 pointer-events-none'
      }`}
    >
      <div className="bg-sky-500 p-2 rounded-xl text-slate-950 shrink-0">
        <Sparkles className="w-4 h-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-sky-400 font-bold">
          <span>Nova Confirmação</span>
          <span className="opacity-70">{currentNotification.timeAgo}</span>
        </div>
        <p className="text-xs text-slate-100 font-semibold mt-1">
          {currentNotification.name}
        </p>
        <p className="text-xs text-slate-300 mt-0.5 font-medium leading-tight">
          Agendou o procedimento: <span className="text-sky-350 font-bold">{currentNotification.treatment}</span>
        </p>
      </div>
    </div>
  );
}
