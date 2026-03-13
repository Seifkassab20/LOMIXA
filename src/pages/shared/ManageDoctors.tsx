import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Search, Plus, Filter, Edit2, Trash2, Heart, Star, MapPin, UserPlus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../store';
import { toast } from 'sonner';
import { User } from '../../types';

const SPECIALTIES = ['All', 'Cardiology', 'Pediatrics', 'Neurology', 'Dermatology', 'Oncology', 'Psychiatry', 'General Medicine'];

export function ManageDoctors() {
  const { user: currentUser } = useAuth();
  const { users, addUser, updateUser, deleteUser } = useStore();
  const [search, setSearch] = useState('');
  const [specialty, setSpecialty] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<User | null>(null);

  // Form State
  const [formData, setFormData] = useState({ name: '', email: '', specialty: 'General Medicine', experience: 5 });

  // Get doctors
  const doctors = users.filter(u => u.role === 'doctor' && (currentUser?.role === 'hospital' ? u.hospitalId === currentUser?.id : true));

  const filtered = doctors.filter(doc => {
    const matchSearch = doc.name.toLowerCase().includes(search.toLowerCase()) || doc.email.toLowerCase().includes(search.toLowerCase());
    const matchSpecialty = specialty === 'All' || doc.specialty === specialty;
    return matchSearch && matchSpecialty;
  });

  const handleOpenModal = (doc: User | null = null) => {
    if (doc) {
      setEditingDoc(doc);
      setFormData({ name: doc.name, email: doc.email, specialty: doc.specialty || 'General Medicine', experience: doc.experience || 5 });
    } else {
      setEditingDoc(null);
      setFormData({ name: '', email: '', specialty: 'General Medicine', experience: 5 });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingDoc) {
      updateUser(editingDoc.id, { 
        name: formData.name, 
        email: formData.email, 
        specialty: formData.specialty, 
        experience: formData.experience 
      });
      toast.success('Doctor profile updated');
    } else {
      const newDoc: User = {
        id: Math.random().toString(36).substr(2, 9),
        name: formData.name,
        email: formData.email,
        role: 'doctor',
        hospitalId: currentUser?.role === 'hospital' ? currentUser?.id : 'h1', // Default hospital if pharma adds
        specialty: formData.specialty,
        experience: formData.experience
      };
      addUser(newDoc);
      toast.success('Doctor added to registry');
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      deleteUser(id);
      toast.success('Doctor removed from registry');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Manage Doctors</h2>
          <p className="text-sm text-slate-500 mt-1">Directory of doctors registered in the MedVisit network.</p>
        </div>
        {currentUser?.role === 'hospital' && (
          <Button onClick={() => handleOpenModal()} className="gap-2 bg-emerald-600 hover:bg-emerald-700">
            <Plus className="h-4 w-4" /> Add New Doctor
          </Button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Search by name or email..." 
            className="pl-9 h-11" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
          {SPECIALTIES.slice(0, 4).map(s => (
            <button
              key={s}
              onClick={() => setSpecialty(s)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                specialty === s ? 'bg-emerald-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-white rounded-2xl border-2 border-dashed border-slate-200">
            <UserPlus className="h-12 w-12 mx-auto mb-4 text-slate-300" />
            <p className="text-lg font-semibold text-slate-900">No Doctors Found</p>
            <p className="text-slate-500 mt-1">Try adjusting your search or filters.</p>
          </div>
        ) : filtered.map((doc) => (
          <Card key={doc.id} className="group hover:border-emerald-200 hover:shadow-lg transition-all">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div className="h-14 w-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <Heart className="h-7 w-7" />
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => handleOpenModal(doc)} className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  {currentUser?.role === 'hospital' && (
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(doc.id)} className="h-8 w-8 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
              <h3 className="text-lg font-bold text-slate-900">{doc.name}</h3>
              <p className="text-sm font-semibold text-emerald-600">{doc.specialty}</p>
              
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-slate-700">4.8</span> · {doc.experience} years experience
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <MapPin className="h-3.5 w-3.5" />
                  King Faisal Specialist Hospital
                </div>
              </div>

              <div className="mt-5 pt-5 border-t border-slate-100 flex items-center justify-between">
                <Badge variant="success" className="bg-emerald-50 text-emerald-700">Available</Badge>
                <span className="text-xs text-slate-400">Tue, Wed, Thu</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <Card className="w-full max-w-md shadow-2xl">
            <CardHeader>
              <CardTitle>{editingDoc ? 'Edit Doctor Profile' : 'Register New Doctor'}</CardTitle>
              <CardDescription>Fill in the professional details for the doctor.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Full Name</label>
                  <Input
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Dr. Ahmed Al-Farsi"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Email Address</label>
                  <Input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="doctor@hospital.com"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Specialty</label>
                    <select 
                      className="w-full h-10 px-3 rounded-md border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-emerald-500"
                      value={formData.specialty}
                      onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                    >
                      {SPECIALTIES.filter(s => s !== 'All').map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Experience (Years)</label>
                    <Input
                      type="number"
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: parseInt(e.target.value) })}
                    />
                  </div>
                </div>
              </CardContent>
              <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-100">
                <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                  {editingDoc ? 'Update Profile' : 'Register Doctor'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
