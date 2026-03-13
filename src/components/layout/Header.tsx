import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLang } from '../../context/LangContext';
import { Bell, Globe, ChevronDown, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store';

const roleLabels: Record<string, string> = {
  pharma: 'Pharmaceutical Company',
  hospital: 'Hospital / Clinic',
  doctor: 'Doctor',
  rep: 'Sales Representative',
};

export function Header() {
  const { user, logout } = useAuth();
  const { notifications } = useStore();
  const { locale, toggleLocale } = useLang();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const unreadCount = notifications.filter(n => n.userId === user?.id && !n.read).length;

  const now = new Date().toLocaleString('en-SA', {
    timeZone: 'Asia/Riyadh',
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="hidden md:block">
          <p className="text-xs text-slate-400">{now} (AST)</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Language toggle */}
        <button
          onClick={toggleLocale}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <Globe className="h-4 w-4" />
          <span>{locale === 'en' ? 'AR' : 'EN'}</span>
        </button>

        {/* Notification bell */}
        <button
          onClick={() => navigate('/notifications')}
          className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 h-3.5 w-3.5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-[8px] text-white font-bold">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {/* User dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(p => !p)}
            className="flex items-center gap-3 pl-3 border-l border-slate-200 hover:bg-slate-50 rounded-lg py-1.5 pr-2 transition-colors"
          >
            <div className="hidden md:block text-right">
              <p className="text-sm font-semibold text-slate-900 leading-none">{user?.name}</p>
              <p className="text-xs text-slate-400 mt-0.5">{user?.role ? roleLabels[user.role] : ''}</p>
            </div>
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold shadow-sm">
              {user?.name.charAt(0)}
            </div>
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-50">
              <button
                onClick={() => { navigate('/settings'); setShowDropdown(false); }}
                className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                Settings
              </button>
              <button
                onClick={() => { navigate('/notifications'); setShowDropdown(false); }}
                className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                Notifications
              </button>
              <hr className="my-1 border-slate-100" />
              <button
                onClick={() => { logout(); setShowDropdown(false); }}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
