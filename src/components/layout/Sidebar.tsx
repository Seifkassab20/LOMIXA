import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  Calendar,
  BarChart3,
  Package,
  Settings,
  Stethoscope,
  Clock,
  LogOut,
  Bell,
  BookOpen,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useLang } from '../../context/LangContext';

export function Sidebar() {
  const { user, logout } = useAuth();
  const { t, toggleLocale, locale } = useLang();
  const [collapsed, setCollapsed] = useState(false);

  const getLinks = () => {
    switch (user?.role) {
      case 'pharma':
        return [
          { name: t('dashboard'), path: '/', icon: LayoutDashboard },
          { name: t('subordinates'), path: '/subordinates', icon: Users },
          { name: t('manageDoctors'), path: '/doctors', icon: Stethoscope },
          { name: t('allBookings'), path: '/bookings', icon: BookOpen },
          { name: t('analytics'), path: '/analytics', icon: BarChart3 },
          { name: t('buyBundle'), path: '/bundles', icon: Package },
          { name: t('notifications'), path: '/notifications', icon: Bell },
        ];
      case 'hospital':
        return [
          { name: t('dashboard'), path: '/', icon: LayoutDashboard },
          { name: t('manageDoctors'), path: '/doctors', icon: Stethoscope },
          { name: t('allBookings'), path: '/bookings', icon: BookOpen },
          { name: t('analytics'), path: '/analytics', icon: BarChart3 },
          { name: t('notifications'), path: '/notifications', icon: Bell },
        ];
      case 'doctor':
        return [
          { name: t('dashboard'), path: '/', icon: LayoutDashboard },
          { name: t('myBookings'), path: '/bookings', icon: Calendar },
          { name: t('mySchedule'), path: '/schedule', icon: Clock },
          { name: t('notifications'), path: '/notifications', icon: Bell },
        ];
      case 'rep':
        return [
          { name: t('dashboard'), path: '/', icon: LayoutDashboard },
          { name: t('bookVisit'), path: '/book', icon: Calendar },
          { name: t('myVisits'), path: '/visits', icon: Users },
          { name: t('history'), path: '/history', icon: Clock },
          { name: t('notifications'), path: '/notifications', icon: Bell },
        ];
      default:
        return [];
    }
  };

  const links = getLinks();

  return (
    <aside
      className={cn(
        'relative bg-white border-r border-slate-200 flex flex-col transition-all duration-300 ease-in-out',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-slate-200 gap-3 overflow-hidden">
        <div className="flex-shrink-0 h-9 w-9 rounded-lg bg-emerald-600 flex items-center justify-center">
          <Stethoscope className="h-5 w-5 text-white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <span className="font-bold text-emerald-700 text-base whitespace-nowrap">MedVisit</span>
            <span className="block text-[10px] text-slate-400 whitespace-nowrap">Connect Platform</span>
          </div>
        )}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(p => !p)}
        className="absolute -right-3 top-20 z-10 h-6 w-6 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-emerald-600 shadow-sm transition-colors"
      >
        {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </button>

      {/* Role label */}
      {!collapsed && (
        <div className="px-4 py-3">
          <span className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">
            {user?.role === 'pharma' ? 'Pharma Company' :
             user?.role === 'hospital' ? 'Hospital / Clinic' :
             user?.role === 'doctor' ? 'Doctor' : 'Sales Rep'}
          </span>
        </div>
      )}
      {collapsed && <div className="py-2" />}

      {/* Nav links */}
      <nav className="flex-1 overflow-y-auto px-2">
        <ul className="space-y-0.5">
          {links.map((link) => (
            <li key={link.path}>
              <NavLink
                to={link.path}
                end={link.path === '/'}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group relative',
                    isActive
                      ? 'bg-emerald-50 text-emerald-700 shadow-sm'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  )
                }
                title={collapsed ? link.name : undefined}
              >
                {({ isActive }) => (
                  <>
                    <link.icon className={cn('h-5 w-5 flex-shrink-0 transition-colors', isActive ? 'text-emerald-600' : 'text-slate-400 group-hover:text-slate-600')} />
                    {!collapsed && <span className="whitespace-nowrap">{link.name}</span>}
                    {isActive && !collapsed && (
                      <span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    )}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom actions */}
      <div className="p-2 border-t border-slate-200 space-y-0.5">
        {/* Language Toggle */}
        <button
          onClick={toggleLocale}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors'
          )}
          title={collapsed ? (locale === 'en' ? 'Switch to Arabic' : 'Switch to English') : undefined}
        >
          <span className="flex-shrink-0 text-base">🌐</span>
          {!collapsed && <span>{locale === 'en' ? 'العربية' : 'English'}</span>}
        </button>

        {/* Settings */}
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
              isActive
                ? 'bg-emerald-50 text-emerald-700'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            )
          }
          title={collapsed ? t('settings') : undefined}
        >
          {({ isActive }) => (
            <>
              <Settings className={cn('h-5 w-5 flex-shrink-0', isActive ? 'text-emerald-600' : 'text-slate-400')} />
              {!collapsed && <span>{t('settings')}</span>}
            </>
          )}
        </NavLink>

        {/* Logout */}
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
          title={collapsed ? 'Logout' : undefined}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!collapsed && <span>{t('logout')}</span>}
        </button>

        {/* User info */}
        {!collapsed && (
          <div className="mt-2 mx-1 p-3 bg-slate-50 rounded-lg flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm flex-shrink-0">
              {user?.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-slate-900 truncate">{user?.name}</p>
              <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
