import React, { createContext, useContext, useState, useEffect } from 'react';
import { Doctor, Testimonial, Booking, Lead } from '../types';
import { doctors as initialDoctors, testimonials as initialTestimonials } from '../data';

export interface CaseStudy {
  id: string;
  title: string;
  specialty: string;
  patientInitials: string;
  beforeImg: string;
  afterImg: string;
  dentist: string;
}

export interface GalleryItem {
  id: string;
  imageUrl: string;
  caption: string;
}

const initialCaseStudies: CaseStudy[] = [
  {
    id: 'lentes',
    title: 'Transformação Estética com Lentes de Contato',
    specialty: 'Odontologia Estética / Porcelana',
    patientInitials: 'P.S.M, 32 anos',
    beforeImg: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=600',
    afterImg: 'https://images.unsplash.com/photo-1613521140210-b4d98588f58d?auto=format&fit=crop&q=80&w=600',
    dentist: 'Dra. Beatriz Menezes'
  },
  {
    id: 'clareamento',
    title: 'Clareamento Violeta de Alta Eficácia',
    specialty: 'Estética / Clareamento Premium',
    patientInitials: 'L.A.T, 28 anos',
    beforeImg: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&q=80&w=600',
    afterImg: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600',
    dentist: 'Dra. Beatriz Menezes'
  },
  {
    id: 'invisalign',
    title: 'Alinhamento com Invisalign®',
    specialty: 'Ortodontia Digital / Invisível',
    patientInitials: 'G.H.O, 24 anos',
    beforeImg: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=600',
    afterImg: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
    dentist: 'Dra. Mariana Vasconcellos'
  }
];

const initialGallery: GalleryItem[] = [
  {
    id: 'gal1',
    imageUrl: 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&q=80&w=600',
    caption: 'Consultório odontológico equipado com tecnologia 3D alemã'
  },
  {
    id: 'gal2',
    imageUrl: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=600',
    caption: 'Recepção aconchegante e confortável para nossos pacientes'
  },
  {
    id: 'gal3',
    imageUrl: 'https://images.unsplash.com/photo-1461344577544-4e5dc948718b?auto=format&fit=crop&q=80&w=600',
    caption: 'Nossa equipe unida focada em cuidar do seu sorriso'
  }
];

interface AdminContextType {
  isAdmin: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  // Dynamic Content States
  heroDoctorImageUrl: string;
  updateHeroDoctorImage: (url: string) => void;
  doctors: Doctor[];
  updateDoctorImage: (id: string, url: string) => void;
  addDoctor: (doc: Omit<Doctor, 'id'>) => void;
  updateDoctor: (id: string, doc: Omit<Doctor, 'id'>) => void;
  deleteDoctor: (id: string) => void;
  caseStudies: CaseStudy[];
  updateCaseStudyImage: (id: string, field: 'beforeImg' | 'afterImg', url: string) => void;
  addCaseStudy: (study: Omit<CaseStudy, 'id'>) => void;
  updateCaseStudy: (id: string, study: Omit<CaseStudy, 'id'>) => void;
  deleteCaseStudy: (id: string) => void;
  testimonials: Testimonial[];
  updateTestimonialImage: (id: string, url: string) => void;
  addTestimonial: (test: Omit<Testimonial, 'id'>) => void;
  deleteTestimonial: (id: string) => void;
  gallery: GalleryItem[];
  addGalleryItem: (imageUrl: string, caption: string) => void;
  updateGalleryItem: (id: string, imageUrl: string, caption: string) => void;
  deleteGalleryItem: (id: string) => void;
  // General Image Editor Handler modal state helper
  openImageEditor: (currentUrl: string, onSave: (newUrl: string) => void, title?: string) => void;
  imageEditorState: {
    isOpen: boolean;
    currentUrl: string;
    onSave: (newUrl: string) => void;
    title: string;
  };
  closeImageEditor: () => void;
  // Saved Leads & Bookings
  bookings: Booking[];
  addBooking: (booking: Booking) => void;
  deleteBooking: (id: string) => void;
  leads: Lead[];
  addLead: (lead: Lead) => void;
  deleteLead: (id: string) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem('is_admin_logged') === 'true';
  });

  const [heroDoctorImageUrl, setHeroDoctorImageUrl] = useState<string>(() => {
    return localStorage.getItem('cfg_hero_doctor') || 'https://images.unsplash.com/photo-1579684389782-64d84b5e901a?auto=format&fit=crop&q=80&w=600';
  });

  const [doctors, setDoctors] = useState<Doctor[]>(() => {
    const saved = localStorage.getItem('cfg_doctors');
    return saved ? JSON.parse(saved) : initialDoctors;
  });

  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>(() => {
    const saved = localStorage.getItem('cfg_cases');
    return saved ? JSON.parse(saved) : initialCaseStudies;
  });

  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => {
    const saved = localStorage.getItem('cfg_testimonials');
    return saved ? JSON.parse(saved) : initialTestimonials;
  });

  const [gallery, setGallery] = useState<GalleryItem[]>(() => {
    const saved = localStorage.getItem('cfg_gallery');
    return saved ? JSON.parse(saved) : initialGallery;
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('cfg_bookings');
    return saved ? JSON.parse(saved) : [];
  });

  const [leads, setLeads] = useState<Lead[]>(() => {
    const saved = localStorage.getItem('cfg_leads');
    return saved ? JSON.parse(saved) : [];
  });

  const [isDbLoaded, setIsDbLoaded] = useState<boolean>(false);

  // Modal selector helpers
  const [imageEditorState, setImageEditorState] = useState<{
    isOpen: boolean;
    currentUrl: string;
    onSave: (newUrl: string) => void;
    title: string;
  }>({
    isOpen: false,
    currentUrl: '',
    onSave: () => {},
    title: 'Editar Imagem'
  });

  const openImageEditor = (currentUrl: string, onSave: (newUrl: string) => void, title = 'Editar Imagem') => {
    setImageEditorState({
      isOpen: true,
      currentUrl,
      onSave,
      title
    });
  };

  const closeImageEditor = () => {
    setImageEditorState(prev => ({ ...prev, isOpen: false }));
  };

  // Load initial database state on mount
  useEffect(() => {
    const fetchDb = async () => {
      try {
        const response = await fetch('/api/db');
        if (response.ok) {
          const data = await response.json();
          if (data.heroDoctorImageUrl !== undefined) setHeroDoctorImageUrl(data.heroDoctorImageUrl);
          if (data.doctors !== undefined) setDoctors(data.doctors);
          if (data.caseStudies !== undefined) setCaseStudies(data.caseStudies);
          if (data.testimonials !== undefined) setTestimonials(data.testimonials);
          if (data.gallery !== undefined) setGallery(data.gallery);
          if (data.bookings !== undefined) setBookings(data.bookings);
          if (data.leads !== undefined) setLeads(data.leads);
        }
      } catch (err) {
        console.error('Failed to load database from server:', err);
      } finally {
        setIsDbLoaded(true);
      }
    };
    fetchDb();
  }, []);

  // Persistors (with Cloud Database synchronization guards)
  useEffect(() => {
    localStorage.setItem('cfg_hero_doctor', heroDoctorImageUrl);
    if (!isDbLoaded) return;
    fetch('/api/db/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ heroDoctorImageUrl })
    }).catch(err => console.error('Error syncing heroDoctorImageUrl to server:', err));
  }, [heroDoctorImageUrl, isDbLoaded]);

  useEffect(() => {
    localStorage.setItem('cfg_doctors', JSON.stringify(doctors));
    if (!isDbLoaded) return;
    fetch('/api/db/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ doctors })
    }).catch(err => console.error('Error syncing doctors to server:', err));
  }, [doctors, isDbLoaded]);

  useEffect(() => {
    localStorage.setItem('cfg_cases', JSON.stringify(caseStudies));
    if (!isDbLoaded) return;
    fetch('/api/db/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ caseStudies })
    }).catch(err => console.error('Error syncing caseStudies to server:', err));
  }, [caseStudies, isDbLoaded]);

  useEffect(() => {
    localStorage.setItem('cfg_testimonials', JSON.stringify(testimonials));
    if (!isDbLoaded) return;
    fetch('/api/db/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ testimonials })
    }).catch(err => console.error('Error syncing testimonials to server:', err));
  }, [testimonials, isDbLoaded]);

  useEffect(() => {
    localStorage.setItem('cfg_gallery', JSON.stringify(gallery));
    if (!isDbLoaded) return;
    fetch('/api/db/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gallery })
    }).catch(err => console.error('Error syncing gallery to server:', err));
  }, [gallery, isDbLoaded]);

  useEffect(() => {
    localStorage.setItem('cfg_bookings', JSON.stringify(bookings));
    if (!isDbLoaded) return;
    fetch('/api/db/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookings })
    }).catch(err => console.error('Error syncing bookings to server:', err));
  }, [bookings, isDbLoaded]);

  useEffect(() => {
    localStorage.setItem('cfg_leads', JSON.stringify(leads));
    if (!isDbLoaded) return;
    fetch('/api/db/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ leads })
    }).catch(err => console.error('Error syncing leads to server:', err));
  }, [leads, isDbLoaded]);

  const login = (password: string) => {
    if (password === '1966') {
      setIsAdmin(true);
      localStorage.setItem('is_admin_logged', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    localStorage.setItem('is_admin_logged', 'false');
  };

  const updateHeroDoctorImage = (url: string) => {
    setHeroDoctorImageUrl(url);
  };

  const updateDoctorImage = (id: string, url: string) => {
    setDoctors(prev => prev.map(d => d.id === id ? { ...d, imageUrl: url } : d));
  };

  const addDoctor = (doc: Omit<Doctor, 'id'>) => {
    const newDoc: Doctor = {
      ...doc,
      id: `doc_${Date.now()}`
    };
    setDoctors(prev => [...prev, newDoc]);
  };

  const updateDoctor = (id: string, doc: Omit<Doctor, 'id'>) => {
    setDoctors(prev => prev.map(d => d.id === id ? { ...d, ...doc } : d));
  };

  const deleteDoctor = (id: string) => {
    setDoctors(prev => prev.filter(d => d.id !== id));
  };

  const updateCaseStudyImage = (id: string, field: 'beforeImg' | 'afterImg', url: string) => {
    setCaseStudies(prev => prev.map(c => c.id === id ? { ...c, [field]: url } : c));
  };

  const addCaseStudy = (study: Omit<CaseStudy, 'id'>) => {
    const newStudy: CaseStudy = {
      ...study,
      id: `case_${Date.now()}`
    };
    setCaseStudies(prev => [...prev, newStudy]);
  };

  const updateCaseStudy = (id: string, study: Omit<CaseStudy, 'id'>) => {
    setCaseStudies(prev => prev.map(c => c.id === id ? { ...c, ...study } : c));
  };

  const deleteCaseStudy = (id: string) => {
    setCaseStudies(prev => prev.filter(c => c.id !== id));
  };

  const updateTestimonialImage = (id: string, url: string) => {
    setTestimonials(prev => prev.map(t => t.id === id ? { ...t, avatarUrl: url } : t));
  };

  const addTestimonial = (test: Omit<Testimonial, 'id'>) => {
    const newTest: Testimonial = {
      ...test,
      id: `test_${Date.now()}`
    };
    setTestimonials(prev => [...prev, newTest]);
  };

  const deleteTestimonial = (id: string) => {
    setTestimonials(prev => prev.filter(t => t.id !== id));
  };

  const addGalleryItem = (imageUrl: string, caption: string) => {
    const newItem: GalleryItem = {
      id: `gal_${Date.now()}`,
      imageUrl,
      caption
    };
    setGallery(prev => [...prev, newItem]);
  };

  const updateGalleryItem = (id: string, imageUrl: string, caption: string) => {
    setGallery(prev => prev.map(item => item.id === id ? { ...item, imageUrl, caption } : item));
  };

  const deleteGalleryItem = (id: string) => {
    setGallery(prev => prev.filter(item => item.id !== id));
  };

  const addBooking = (booking: Booking) => {
    setBookings(prev => [booking, ...prev]);
  };

  const deleteBooking = (id: string) => {
    setBookings(prev => prev.filter(b => b.id !== id));
  };

  const addLead = (lead: Lead) => {
    setLeads(prev => [lead, ...prev]);
  };

  const deleteLead = (id: string) => {
    setLeads(prev => prev.filter(l => l.id !== id));
  };

  return (
    <AdminContext.Provider value={{
      isAdmin,
      login,
      logout,
      heroDoctorImageUrl,
      updateHeroDoctorImage,
      doctors,
      updateDoctorImage,
      addDoctor,
      updateDoctor,
      deleteDoctor,
      caseStudies,
      updateCaseStudyImage,
      addCaseStudy,
      updateCaseStudy,
      deleteCaseStudy,
      testimonials,
      updateTestimonialImage,
      addTestimonial,
      deleteTestimonial,
      gallery,
      addGalleryItem,
      updateGalleryItem,
      deleteGalleryItem,
      openImageEditor,
      imageEditorState,
      closeImageEditor,
      bookings,
      addBooking,
      deleteBooking,
      leads,
      addLead,
      deleteLead
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
