import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Doctor, Testimonial, Booking, Lead } from '../types';
import { doctors as initialDoctors, testimonials as initialTestimonials } from '../data';
import { db } from '../lib/firebase';
import { collection, doc, getDoc, getDocs, setDoc, deleteDoc } from 'firebase/firestore';

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
    beforeImg: 'https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&q=80&w=600',
    afterImg: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=600',
    dentist: 'Dra. Beatriz Menezes'
  },
  {
    id: 'clareamento',
    title: 'Clareamento Violeta de Alta Eficácia',
    specialty: 'Estética / Clareamento Premium',
    patientInitials: 'L.A.T, 28 anos',
    beforeImg: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600',
    afterImg: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=600',
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
    imageUrl: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=600',
    caption: 'Consultório odontológico equipado com tecnologia 3D alemã'
  },
  {
    id: 'gal2',
    imageUrl: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=600',
    caption: 'Recepção aconchegante e confortável para nossos pacientes'
  },
  {
    id: 'gal3',
    imageUrl: 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&q=80&w=600',
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
  const isInitialLoadRef = useRef<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem('is_admin_logged') === 'true';
  });

  const [heroDoctorImageUrl, setHeroDoctorImageUrl] = useState<string>(() => {
    return localStorage.getItem('cfg_hero_doctor') || 'https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=600';
  });

  const [doctors, setDoctors] = useState<Doctor[]>(() => {
    try {
      const saved = localStorage.getItem('cfg_doctors');
      const parsed = saved ? JSON.parse(saved) : null;
      return parsed && parsed.length > 0 ? parsed : initialDoctors;
    } catch {
      return initialDoctors;
    }
  });

  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>(() => {
    try {
      const saved = localStorage.getItem('cfg_cases');
      const parsed = saved ? JSON.parse(saved) : null;
      return parsed && parsed.length > 0 ? parsed : initialCaseStudies;
    } catch {
      return initialCaseStudies;
    }
  });

  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => {
    try {
      const saved = localStorage.getItem('cfg_testimonials');
      const parsed = saved ? JSON.parse(saved) : null;
      return parsed && parsed.length > 0 ? parsed : initialTestimonials;
    } catch {
      return initialTestimonials;
    }
  });

  const [gallery, setGallery] = useState<GalleryItem[]>(() => {
    try {
      const saved = localStorage.getItem('cfg_gallery');
      const parsed = saved ? JSON.parse(saved) : null;
      return parsed && parsed.length > 0 ? parsed : initialGallery;
    } catch {
      return initialGallery;
    }
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

  // Load initial database state on mount (Try API server first, fallback directly to Firestore client)
  useEffect(() => {
    const fetchDb = async () => {
      let loadedFromApi = false;
      try {
        const response = await fetch('/api/db');
        if (response.ok) {
          const data = await response.json();
          if (data.heroDoctorImageUrl !== undefined) {
            setHeroDoctorImageUrl(data.heroDoctorImageUrl || 'https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=600');
          }
          if (data.doctors !== undefined && data.doctors.length > 0) setDoctors(data.doctors);
          if (data.caseStudies !== undefined && data.caseStudies.length > 0) setCaseStudies(data.caseStudies);
          if (data.testimonials !== undefined && data.testimonials.length > 0) setTestimonials(data.testimonials);
          if (data.gallery !== undefined && data.gallery.length > 0) setGallery(data.gallery);
          if (data.bookings !== undefined) setBookings(data.bookings);
          if (data.leads !== undefined) setLeads(data.leads);
          loadedFromApi = true;
        }
      } catch {
        // Express backend route not available (e.g. GitHub Pages / Vercel SPA deployment)
      }

      if (!loadedFromApi) {
        try {
          const settingsSnap = await getDoc(doc(db, 'settings', 'global'));
          if (settingsSnap.exists() && settingsSnap.data().heroDoctorImageUrl) {
            setHeroDoctorImageUrl(settingsSnap.data().heroDoctorImageUrl);
          }

          const doctorsSnap = await getDocs(collection(db, 'doctors'));
          if (!doctorsSnap.empty) {
            setDoctors(doctorsSnap.docs.map(d => d.data() as Doctor));
          }

          const casesSnap = await getDocs(collection(db, 'caseStudies'));
          if (!casesSnap.empty) {
            setCaseStudies(casesSnap.docs.map(d => d.data() as CaseStudy));
          }

          const testSnap = await getDocs(collection(db, 'testimonials'));
          if (!testSnap.empty) {
            setTestimonials(testSnap.docs.map(d => d.data() as Testimonial));
          }

          const galSnap = await getDocs(collection(db, 'gallery'));
          if (!galSnap.empty) {
            setGallery(galSnap.docs.map(d => d.data() as GalleryItem));
          }

          const bookSnap = await getDocs(collection(db, 'bookings'));
          if (!bookSnap.empty) {
            setBookings(bookSnap.docs.map(d => d.data() as Booking));
          }

          const leadsSnap = await getDocs(collection(db, 'leads'));
          if (!leadsSnap.empty) {
            setLeads(leadsSnap.docs.map(d => d.data() as Lead));
          }
        } catch (clientFsErr) {
          console.error('Direct Firestore client fetch error:', clientFsErr);
        }
      }

      setIsDbLoaded(true);
    };
    fetchDb();
  }, []);

  // Persistors (Sync both to LocalStorage, Express backend if present, AND Firestore client directly)
  useEffect(() => {
    localStorage.setItem('cfg_hero_doctor', heroDoctorImageUrl);
    if (!isDbLoaded || isInitialLoadRef.current) return;
    setDoc(doc(db, 'settings', 'global'), { heroDoctorImageUrl }, { merge: true }).catch(() => {});
    fetch('/api/db/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ heroDoctorImageUrl })
    }).catch(() => {});
  }, [heroDoctorImageUrl, isDbLoaded]);

  useEffect(() => {
    localStorage.setItem('cfg_doctors', JSON.stringify(doctors));
    if (!isDbLoaded || isInitialLoadRef.current) return;
    doctors.forEach(d => setDoc(doc(db, 'doctors', d.id), d).catch(() => {}));
    fetch('/api/db/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ doctors })
    }).catch(() => {});
  }, [doctors, isDbLoaded]);

  useEffect(() => {
    localStorage.setItem('cfg_cases', JSON.stringify(caseStudies));
    if (!isDbLoaded || isInitialLoadRef.current) return;
    caseStudies.forEach(c => setDoc(doc(db, 'caseStudies', c.id), c).catch(() => {}));
    fetch('/api/db/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ caseStudies })
    }).catch(() => {});
  }, [caseStudies, isDbLoaded]);

  useEffect(() => {
    localStorage.setItem('cfg_testimonials', JSON.stringify(testimonials));
    if (!isDbLoaded || isInitialLoadRef.current) return;
    testimonials.forEach(t => setDoc(doc(db, 'testimonials', t.id), t).catch(() => {}));
    fetch('/api/db/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ testimonials })
    }).catch(() => {});
  }, [testimonials, isDbLoaded]);

  useEffect(() => {
    localStorage.setItem('cfg_gallery', JSON.stringify(gallery));
    if (!isDbLoaded || isInitialLoadRef.current) return;
    gallery.forEach(g => setDoc(doc(db, 'gallery', g.id), g).catch(() => {}));
    fetch('/api/db/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gallery })
    }).catch(() => {});
  }, [gallery, isDbLoaded]);

  useEffect(() => {
    localStorage.setItem('cfg_bookings', JSON.stringify(bookings));
    if (!isDbLoaded || isInitialLoadRef.current) return;
    bookings.forEach(b => setDoc(doc(db, 'bookings', b.id), b).catch(() => {}));
    fetch('/api/db/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookings })
    }).catch(() => {});
  }, [bookings, isDbLoaded]);

  useEffect(() => {
    localStorage.setItem('cfg_leads', JSON.stringify(leads));
    if (!isDbLoaded || isInitialLoadRef.current) return;
    leads.forEach(l => setDoc(doc(db, 'leads', l.id), l).catch(() => {}));
    fetch('/api/db/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ leads })
    }).catch(() => {});
  }, [leads, isDbLoaded]);

  useEffect(() => {
    if (isDbLoaded) {
      const timer = setTimeout(() => {
        isInitialLoadRef.current = false;
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isDbLoaded]);

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
    fetch('/api/db/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ heroDoctorImageUrl: url })
    }).catch(err => console.error('Error syncing heroDoctorImageUrl:', err));
  };

  const updateDoctorImage = (id: string, url: string) => {
    setDoctors(prev => {
      const updated = prev.map(d => d.id === id ? { ...d, imageUrl: url } : d);
      fetch('/api/db/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ doctors: updated })
      }).catch(err => console.error('Error syncing doctor image:', err));
      return updated;
    });
  };

  const addDoctor = (doc: Omit<Doctor, 'id'>) => {
    const newDoc: Doctor = {
      ...doc,
      id: `doc_${Date.now()}`
    };
    setDoctors(prev => {
      const updated = [...prev, newDoc];
      fetch('/api/db/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ doctors: updated })
      }).catch(err => console.error('Error adding doctor:', err));
      return updated;
    });
  };

  const updateDoctor = (id: string, doc: Omit<Doctor, 'id'>) => {
    setDoctors(prev => {
      const updated = prev.map(d => d.id === id ? { ...d, ...doc } : d);
      fetch('/api/db/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ doctors: updated })
      }).catch(err => console.error('Error updating doctor:', err));
      return updated;
    });
  };

  const deleteDoctor = (id: string) => {
    setDoctors(prev => {
      const updated = prev.filter(d => d.id !== id);
      deleteDoc(doc(db, 'doctors', id)).catch(() => {});
      fetch('/api/db/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ doctors: updated })
      }).catch(err => console.error('Error deleting doctor:', err));
      return updated;
    });
  };

  const updateCaseStudyImage = (id: string, field: 'beforeImg' | 'afterImg', url: string) => {
    setCaseStudies(prev => {
      const updated = prev.map(c => c.id === id ? { ...c, [field]: url } : c);
      fetch('/api/db/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caseStudies: updated })
      }).catch(err => console.error('Error updating case study image:', err));
      return updated;
    });
  };

  const addCaseStudy = (study: Omit<CaseStudy, 'id'>) => {
    const newStudy: CaseStudy = {
      ...study,
      id: `case_${Date.now()}`
    };
    setCaseStudies(prev => {
      const updated = [...prev, newStudy];
      fetch('/api/db/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caseStudies: updated })
      }).catch(err => console.error('Error adding case study:', err));
      return updated;
    });
  };

  const updateCaseStudy = (id: string, study: Omit<CaseStudy, 'id'>) => {
    setCaseStudies(prev => {
      const updated = prev.map(c => c.id === id ? { ...c, ...study } : c);
      fetch('/api/db/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caseStudies: updated })
      }).catch(err => console.error('Error updating case study:', err));
      return updated;
    });
  };

  const deleteCaseStudy = (id: string) => {
    setCaseStudies(prev => {
      const updated = prev.filter(c => c.id !== id);
      deleteDoc(doc(db, 'caseStudies', id)).catch(() => {});
      fetch('/api/db/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caseStudies: updated })
      }).catch(err => console.error('Error deleting case study:', err));
      return updated;
    });
  };

  const updateTestimonialImage = (id: string, url: string) => {
    setTestimonials(prev => {
      const updated = prev.map(t => t.id === id ? { ...t, avatarUrl: url } : t);
      fetch('/api/db/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testimonials: updated })
      }).catch(err => console.error('Error updating testimonial image:', err));
      return updated;
    });
  };

  const addTestimonial = (test: Omit<Testimonial, 'id'>) => {
    const newTest: Testimonial = {
      ...test,
      id: `test_${Date.now()}`
    };
    setTestimonials(prev => {
      const updated = [...prev, newTest];
      fetch('/api/db/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testimonials: updated })
      }).catch(err => console.error('Error adding testimonial:', err));
      return updated;
    });
  };

  const deleteTestimonial = (id: string) => {
    setTestimonials(prev => {
      const updated = prev.filter(t => t.id !== id);
      deleteDoc(doc(db, 'testimonials', id)).catch(() => {});
      fetch('/api/db/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testimonials: updated })
      }).catch(err => console.error('Error deleting testimonial:', err));
      return updated;
    });
  };

  const addGalleryItem = (imageUrl: string, caption: string) => {
    const newItem: GalleryItem = {
      id: `gal_${Date.now()}`,
      imageUrl,
      caption
    };
    setGallery(prev => {
      const updated = [...prev, newItem];
      fetch('/api/db/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gallery: updated })
      }).catch(err => console.error('Error adding gallery item:', err));
      return updated;
    });
  };

  const updateGalleryItem = (id: string, imageUrl: string, caption: string) => {
    setGallery(prev => {
      const updated = prev.map(item => item.id === id ? { ...item, imageUrl, caption } : item);
      fetch('/api/db/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gallery: updated })
      }).catch(err => console.error('Error updating gallery item:', err));
      return updated;
    });
  };

  const deleteGalleryItem = (id: string) => {
    setGallery(prev => {
      const updated = prev.filter(item => item.id !== id);
      deleteDoc(doc(db, 'gallery', id)).catch(() => {});
      fetch('/api/db/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gallery: updated })
      }).catch(err => console.error('Error deleting gallery item:', err));
      return updated;
    });
  };

  const addBooking = (booking: Booking) => {
    setBookings(prev => {
      const updated = [booking, ...prev];
      setDoc(doc(db, 'bookings', booking.id), booking).catch(() => {});
      fetch('/api/db/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(booking)
      }).catch(err => console.error('Error adding booking:', err));
      return updated;
    });
  };

  const deleteBooking = (id: string) => {
    setBookings(prev => {
      const updated = prev.filter(b => b.id !== id);
      deleteDoc(doc(db, 'bookings', id)).catch(() => {});
      fetch('/api/db/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'bookings', id })
      }).catch(err => console.error('Error deleting booking:', err));
      return updated;
    });
  };

  const addLead = (lead: Lead) => {
    setLeads(prev => {
      const updated = [lead, ...prev];
      setDoc(doc(db, 'leads', lead.id), lead).catch(() => {});
      fetch('/api/db/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lead)
      }).catch(err => console.error('Error adding lead:', err));
      return updated;
    });
  };

  const deleteLead = (id: string) => {
    setLeads(prev => {
      const updated = prev.filter(l => l.id !== id);
      deleteDoc(doc(db, 'leads', id)).catch(() => {});
      fetch('/api/db/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'leads', id })
      }).catch(err => console.error('Error deleting lead:', err));
      return updated;
    });
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
