import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Role } from '../types';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Stethoscope, Building2, User, Briefcase, Activity, ArrowRight, Eye, EyeOff } from 'lucide-react';



const roles: { id: Role; title: string; subtitle: string; icon: React.ElementType; color: string; bg: string }[] = [
  { id: 'pharma', title: 'Pharma Company', subtitle: 'Manage reps, bundles & analytics', icon: Building2, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' },
  { id: 'hospital', title: 'Hospital / Clinic', subtitle: 'Manage doctors & bookings', icon: Activity, color: 'text-purple-600', bg: 'bg-purple-50 border-purple-200' },
  { id: 'doctor', title: 'Doctor', subtitle: 'Control schedule & accept visits', icon: Stethoscope, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' },
  { id: 'rep', title: 'Sales Representative', subtitle: 'Book visits with doctors', icon: Briefcase, color: 'text-orange-600', bg: 'bg-orange-50 border-orange-200' },
];

export function Login() {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;

    if (isLogin) {
      login(email, selectedRole);
    } else {
      register({
        id: `u-${Date.now()}`,
        name,
        email,
        role: selectedRole,
      });
    }
  };



  return (
    <div className="min-h-screen flex">
      {/* Left panel – branding */}
      <div className="hidden lg:flex lg:w-5/12 bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 p-12 flex-col justify-between">
        <div className="flex items-center gap-3 text-white">
          <div className="h-11 w-11 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
            <Stethoscope className="h-6 w-6 text-white" />
          </div>
          <div>
            <span className="font-bold text-2xl tracking-tight">MedVisit Connect</span>
            <p className="text-emerald-200 text-xs mt-0.5">Saudi Arabia's Pharma Visit Platform</p>
          </div>
        </div>

        <div className="text-white space-y-8">
          <h2 className="text-4xl font-bold leading-tight">
            Connect Pharma &<br />Healthcare, Seamlessly.
          </h2>
          <p className="text-emerald-100 text-lg leading-relaxed">
            The one platform that bridges pharmaceutical companies, hospitals, doctors, and sales reps through smart scheduling.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: '500+', desc: 'Active Doctors' },
              { label: '48', desc: 'Pharma Companies' },
              { label: '12K+', desc: 'Visits Scheduled' },
              { label: '98%', desc: 'Satisfaction Rate' },
            ].map(stat => (
              <div key={stat.label} className="bg-white/10 backdrop-blur rounded-xl p-4">
                <p className="text-2xl font-bold text-white">{stat.label}</p>
                <p className="text-emerald-200 text-sm">{stat.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-emerald-300 text-sm">© 2026 MedVisit Connect. KSA Healthcare Technology.</p>
      </div>

      {/* Right panel – form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-slate-50">
        <div className="w-full max-w-lg">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="h-10 w-10 rounded-xl bg-emerald-600 flex items-center justify-center">
              <Stethoscope className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl text-emerald-700">MedVisit Connect</span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">
              {isLogin ? 'Welcome back 👋' : 'Create Account'}
            </h1>
            <p className="text-slate-500 mt-1">
              {isLogin ? 'Sign in to your MedVisit account' : 'Join the MedVisit Connect platform'}
            </p>
          </div>

          {/* Role selector */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-700 mb-3">I am a…</label>
            <div className="grid grid-cols-2 gap-3">
              {roles.map(role => (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setSelectedRole(role.id)}
                  className={`flex items-center gap-3 p-3 border-2 rounded-xl transition-all text-left ${
                    selectedRole === role.id
                      ? `${role.bg} border-current`
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className={`h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0 ${selectedRole === role.id ? role.bg : 'bg-slate-100'}`}>
                    <role.icon className={`h-5 w-5 ${selectedRole === role.id ? role.color : 'text-slate-400'}`} />
                  </div>
                  <div>
                    <p className={`text-xs font-semibold ${selectedRole === role.id ? role.color : 'text-slate-900'}`}>{role.title}</p>
                    <p className="text-[10px] text-slate-400 leading-tight">{role.subtitle}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Full Name / Company Name</label>
                <Input
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Dr. Ahmed Al-Farsi"
                  className="h-11"
                />
              </div>
            )}

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Email Address</label>
              <Input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="h-11"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-11 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 gap-2 text-base"
              disabled={!selectedRole || !email}
            >
              {isLogin ? 'Sign In' : 'Create Account'}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-4">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button
              type="button"
              onClick={() => setIsLogin(p => !p)}
              className="text-emerald-600 hover:text-emerald-700 font-semibold hover:underline"
            >
              {isLogin ? 'Register here' : 'Sign in'}
            </button>
          </p>


        </div>
      </div>
    </div>
  );
}
