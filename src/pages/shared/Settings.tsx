import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../store';
import { toast } from 'sonner';
import { User, Bell, Shield, Globe, Save } from 'lucide-react';

const NOTIF_OPTIONS = [
  { key: 'email', title: 'Email Notifications', desc: 'Receive visit confirmations and reminders via email.' },
  { key: 'sms', title: 'SMS Alerts', desc: 'Get text messages for upcoming visits and cancellations.' },
  { key: 'push', title: 'Push Notifications', desc: 'Real-time alerts in your browser.' },
  { key: 'weekly', title: 'Weekly Summary', desc: 'Receive a weekly digest of visit activity.' },
];

export function Settings() {
  const { user } = useAuth();
  const { updateUser } = useStore();

  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [phone, setPhone] = useState('+966 50 123 4567');
  const [specialty, setSpecialty] = useState(user?.specialty ?? '');
  const [experience, setExperience] = useState(user?.experience ?? '');
  const [language, setLanguage] = useState('en');
  const [notifs, setNotifs] = useState<Record<string, boolean>>({
    email: true, sms: false, push: true, weekly: true,
  });
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security'>('profile');

  const handleProfileSave = () => {
    if (!name || !email) { toast.error('Name and email are required'); return; }
    if (user) updateUser(user.id, { name, email });
    toast.success('Profile updated successfully');
  };

  const handlePasswordChange = () => {
    if (!currentPw || !newPw || !confirmPw) { toast.error('Please fill all password fields'); return; }
    if (newPw !== confirmPw) { toast.error('Passwords do not match'); return; }
    if (newPw.length < 8) { toast.error('Password must be at least 8 characters'); return; }
    toast.success('Password changed successfully');
    setCurrentPw(''); setNewPw(''); setConfirmPw('');
  };

  const TABS = [
    { id: 'profile' as const, label: 'Profile', icon: User },
    { id: 'notifications' as const, label: 'Notifications', icon: Bell },
    { id: 'security' as const, label: 'Security', icon: Shield },
  ];

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Settings</h2>
        <p className="text-sm text-slate-500 mt-0.5">Manage your account preferences and security settings.</p>
      </div>

      {/* Profile avatar card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-5">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white text-2xl font-bold shadow-md">
              {user?.name.charAt(0)}
            </div>
            <div>
              <p className="font-bold text-slate-900 text-lg">{user?.name}</p>
              <p className="text-slate-500 text-sm">{user?.email}</p>
              <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 capitalize">{user?.role}</span>
            </div>
            <div className="ml-auto">
              <Button variant="outline" size="sm">Change Avatar</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === tab.id
                ? 'bg-white text-emerald-700 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Profile tab */}
      {activeTab === 'profile' && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your name, email, and contact details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Full Name / Company Name</label>
                  <Input value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Email Address</label>
                  <Input type="email" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Phone Number</label>
                  <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+966 5X XXX XXXX" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-1">
                    <Globe className="h-3.5 w-3.5" /> Language
                  </label>
                  <select
                    className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    value={language}
                    onChange={e => setLanguage(e.target.value)}
                  >
                    <option value="en">English</option>
                    <option value="ar">العربية (Arabic)</option>
                  </select>
                </div>
                {user?.role === 'doctor' && (
                  <>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-slate-700">Specialty</label>
                      <Input value={specialty} onChange={e => setSpecialty(e.target.value)} placeholder="e.g. Cardiology" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-slate-700">Years of Experience</label>
                      <Input type="number" min={0} value={experience} onChange={e => setExperience(+e.target.value)} />
                    </div>
                  </>
                )}
              </div>
              <div className="flex justify-end pt-2">
                <Button onClick={handleProfileSave} className="gap-2">
                  <Save className="h-4 w-4" /> Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Notifications tab */}
      {activeTab === 'notifications' && (
        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
            <CardDescription>Choose how you receive alerts and updates.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {NOTIF_OPTIONS.map(opt => (
              <div key={opt.key} className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                <div>
                  <p className="font-semibold text-slate-900 text-sm">{opt.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{opt.desc}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={notifs[opt.key]}
                    onChange={e => setNotifs(prev => ({ ...prev, [opt.key]: e.target.checked }))}
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>
            ))}
            <div className="flex justify-end pt-2">
              <Button className="gap-2" onClick={() => toast.success('Notification preferences saved')}>
                <Save className="h-4 w-4" /> Save Preferences
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Security tab */}
      {activeTab === 'security' && (
        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>Update your password to keep your account secure.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Current Password</label>
              <Input type="password" value={currentPw} onChange={e => setCurrentPw(e.target.value)} placeholder="••••••••" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">New Password</label>
              <Input type="password" value={newPw} onChange={e => setNewPw(e.target.value)} placeholder="Min. 8 characters" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Confirm New Password</label>
              <Input type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} placeholder="••••••••" />
            </div>
            {newPw.length > 0 && (
              <div className="space-y-1">
                <p className="text-xs text-slate-500">Password strength</p>
                <div className="h-1.5 bg-slate-100 rounded-full">
                  <div
                    className={`h-1.5 rounded-full transition-all ${newPw.length < 6 ? 'bg-red-400 w-1/4' : newPw.length < 10 ? 'bg-amber-400 w-1/2' : 'bg-emerald-500 w-full'}`}
                  />
                </div>
                <p className={`text-xs ${newPw.length < 6 ? 'text-red-500' : newPw.length < 10 ? 'text-amber-600' : 'text-emerald-600'}`}>
                  {newPw.length < 6 ? 'Weak' : newPw.length < 10 ? 'Moderate' : 'Strong'}
                </p>
              </div>
            )}
            <div className="flex justify-end pt-2">
              <Button onClick={handlePasswordChange} className="gap-2">
                <Shield className="h-4 w-4" /> Update Password
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
