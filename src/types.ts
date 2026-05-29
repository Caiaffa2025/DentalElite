export interface Specialty {
  id: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  benefits: string[];
  duration: string;
  iconName: string;
}

export interface Doctor {
  id: string;
  name: string;
  role: string;
  cro: string;
  specialtyId: string;
  imageUrl: string;
  bio: string;
}

export interface Testimonial {
  id: string;
  name: string;
  age: number;
  city: string;
  rating: number;
  text: string;
  treatmentName: string;
  treatmentId: string;
  avatarUrl: string;
}

export interface Booking {
  id: string;
  specialtyId: string;
  doctorId: string;
  date: string;
  period: 'manha' | 'tarde' | 'noite';
  timeSlot: string;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  patientNotes?: string;
  createdAt: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: {
    text: string;
    value: string;
    resultTreatment: string;
  }[];
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  recommendedTreatment: string;
  recommendedSpecialtyId: string;
  createdAt: string;
  answers?: string[];
}

