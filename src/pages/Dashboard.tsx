import React from 'react';
import { useAuth } from '../context/AuthContext';
import { PharmaDashboard } from './pharma/PharmaDashboard';
import { HospitalDashboard } from './hospital/HospitalDashboard';
import { DoctorDashboard } from './doctor/DoctorDashboard';
import { RepDashboard } from './rep/RepDashboard';

export function Dashboard() {
  const { user } = useAuth();

  switch (user?.role) {
    case 'pharma':
      return <PharmaDashboard />;
    case 'hospital':
      return <HospitalDashboard />;
    case 'doctor':
      return <DoctorDashboard />;
    case 'rep':
      return <RepDashboard />;
    default:
      return <div>Loading...</div>;
  }
}
