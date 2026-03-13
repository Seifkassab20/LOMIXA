import React, { createContext, useContext, useState, ReactNode } from 'react';

type Locale = 'en' | 'ar';

const translations: Record<Locale, Record<string, string>> = {
  en: {
    dashboard: 'Dashboard',
    subordinates: 'Subordinates',
    manageDoctors: 'Manage Doctors',
    analytics: 'Analytics',
    buyBundle: 'Buy Bundle',
    allBookings: 'All Bookings',
    myBookings: 'My Bookings',
    mySchedule: 'My Schedule',
    bookVisit: 'Book Visit',
    myVisits: 'My Visits',
    history: 'History',
    settings: 'Settings',
    notifications: 'Notifications',
    logout: 'Logout',
    pending: 'Pending',
    confirmed: 'Confirmed',
    completed: 'Completed',
    cancelled: 'Cancelled',
    all: 'All',
    search: 'Search',
    save: 'Save Changes',
    cancel: 'Cancel',
    accept: 'Accept',
    reject: 'Reject',
    credits: 'Credits',
    visitsToday: 'Visits Today',
    totalVisits: 'Total Visits',
    earnings: 'Earnings',
    pharmaPortal: 'Pharma Company Portal',
    hospitalPortal: 'Hospital / Clinic Portal',
    doctorPortal: 'Doctor Portal',
    repPortal: 'Sales Rep Portal',
  },
  ar: {
    dashboard: 'لوحة التحكم',
    subordinates: 'المندوبون',
    manageDoctors: 'إدارة الأطباء',
    analytics: 'التحليلات',
    buyBundle: 'شراء باقة',
    allBookings: 'جميع الحجوزات',
    myBookings: 'حجوزاتي',
    mySchedule: 'جدولي',
    bookVisit: 'حجز زيارة',
    myVisits: 'زياراتي',
    history: 'السجل',
    settings: 'الإعدادات',
    notifications: 'الإشعارات',
    logout: 'تسجيل الخروج',
    pending: 'قيد الانتظار',
    confirmed: 'مؤكد',
    completed: 'مكتمل',
    cancelled: 'ملغى',
    all: 'الكل',
    search: 'بحث',
    save: 'حفظ التغييرات',
    cancel: 'إلغاء',
    accept: 'قبول',
    reject: 'رفض',
    credits: 'رصيد',
    visitsToday: 'زيارات اليوم',
    totalVisits: 'إجمالي الزيارات',
    earnings: 'الأرباح',
    pharmaPortal: 'بوابة الشركة الدوائية',
    hospitalPortal: 'بوابة المستشفى / العيادة',
    doctorPortal: 'بوابة الطبيب',
    repPortal: 'بوابة المندوب',
  },
};

interface LangContextType {
  locale: Locale;
  toggleLocale: () => void;
  t: (key: string) => string;
  isRtl: boolean;
}

const LangContext = createContext<LangContextType | undefined>(undefined);

export function LangProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('en');

  const toggleLocale = () => setLocale(prev => (prev === 'en' ? 'ar' : 'en'));

  const t = (key: string): string => translations[locale][key] ?? key;

  const isRtl = locale === 'ar';

  return (
    <LangContext.Provider value={{ locale, toggleLocale, t, isRtl }}>
      <div dir={isRtl ? 'rtl' : 'ltr'} className={isRtl ? 'font-[system-ui]' : ''}>
        {children}
      </div>
    </LangContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used within LangProvider');
  return ctx;
}
