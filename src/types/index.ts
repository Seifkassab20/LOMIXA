export type Role = 'pharma' | 'hospital' | 'doctor' | 'rep';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  companyId?: string; // For reps
  hospitalId?: string; // For doctors
  specialty?: string; // For doctors
  experience?: number; // For doctors
}

export type VisitStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';
export type VisitType = 'in-person' | 'video' | 'call' | 'text';

export interface Visit {
  id: string;
  doctorId: string;
  doctorName: string;
  repId: string;
  repName: string;
  date: string;
  time: string;
  type: VisitType;
  status: VisitStatus;
  duration: number; // minutes
}

export interface Bundle {
  id: string;
  name: string;
  credits: number;
  price: number;
  features: string[];
}

export type NotifType = 'booking' | 'confirmed' | 'cancelled' | 'info';

export interface Notification {
  id: string;
  userId: string;
  type: NotifType;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export interface AvailabilitySlot {
  id: string;
  doctorId: string;
  day: string;
  start: string;
  end: string;
  type: VisitType;
  duration: number;
}
