import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Search, Plus, UserPlus, Mail, MapPin, MoreHorizontal, Edit2, Trash2, Filter } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../store';
import { toast } from 'sonner';
import { User } from '../../types';

export function Subordinates() {
  const { user: currentUser } = useAuth();
  const { users, addUser, updateUser, deleteUser, visits } = useStore();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRep, setEditingRep] = useState<User | null>(null);

  // Form State
  const [formData, setFormData] = useState({ name: '', email: '', region: 'Riyadh' });

  // Get reps for this company
  const reps = users.filter(u => u.role === 'rep' && u.companyId === currentUser?.id);

  const filteredReps = reps.filter(rep =>
    rep.name.toLowerCase().includes(search.toLowerCase()) ||
    rep.email.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: reps.length,
    active: reps.length, // Simplified for now
    totalVisits: visits.filter(v => reps.some(r => r.id === v.repId)).length,
    avgConversion: '12%' // Mocked for now as we don't have conversion tracking yet
  };

  const handleOpenModal = (rep: User | null = null) => {
    if (rep) {
      setEditingRep(rep);
      setFormData({ name: rep.name, email: rep.email, region: 'Riyadh' });
    } else {
      setEditingRep(null);
      setFormData({ name: '', email: '', region: 'Riyadh' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingRep) {
      updateUser(editingRep.id, { name: formData.name, email: formData.email });
      toast.success('Representative updated successfully');
    } else {
      const newRep: User = {
        id: Math.random().toString(36).substr(2, 9),
        name: formData.name,
        email: formData.email,
        role: 'rep',
        companyId: currentUser?.id
      };
      addUser(newRep);
      toast.success('Representative added successfully');
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this representative?')) {
      deleteUser(id);
      toast.success('Representative deleted');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Sales Representatives</h2>
          <p className="text-sm text-slate-500 mt-1">Manage your team of medical representatives and track their performance.</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="gap-2 bg-emerald-600 hover:bg-emerald-700">
          <Plus className="h-4 w-4" /> Add Representative
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Reps', value: stats.total, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Active', value: stats.active, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Total Visits', value: stats.totalVisits, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Avg. Conversion', value: stats.avgConversion, color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="pt-6">
              <p className="text-3xl font-bold text-slate-900">{s.value}</p>
              <p className="text-sm font-medium text-slate-500 mt-1">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
          <CardTitle>Team Directory</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search reps..."
                className="pl-9 w-64 h-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button variant="outline" size="sm" className="h-9 gap-2">
              <Filter className="h-4 w-4" /> Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Region</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Visits</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Status</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredReps.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                      <UserPlus className="h-12 w-12 mx-auto mb-3 opacity-20" />
                      <p className="font-medium">No representatives found</p>
                      <p className="text-sm mt-1">Start by adding your first team member</p>
                    </td>
                  </tr>
                ) : (
                  filteredReps.map((rep) => (
                    <tr key={rep.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold">
                            {rep.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{rep.name}</p>
                            <p className="text-xs text-slate-500">{rep.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-sm text-slate-600">
                          <MapPin className="h-3.5 w-3.5 text-slate-400" />
                          Riyadh
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-sm font-semibold text-slate-700">
                          {visits.filter(v => v.repId === rep.id).length}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Badge variant="success" className="bg-emerald-50 text-emerald-700 border-emerald-100">Active</Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => handleOpenModal(rep)} className="h-8 w-8 text-slate-400 hover:text-emerald-600">
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(rep.id)} className="h-8 w-8 text-slate-400 hover:text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <Card className="w-full max-w-md shadow-2xl">
            <CardHeader>
              <CardTitle>{editingRep ? 'Edit Representative' : 'Add Representative'}</CardTitle>
              <CardDescription>Fill in the details to {editingRep ? 'update' : 'onboard'} a team member.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Full Name</label>
                  <Input
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Abdullah Al-Harbi"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Email Address</label>
                  <Input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@saudipharma.com"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Region</label>
                  <select className="w-full h-10 px-3 rounded-md border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-emerald-500">
                    <option>Riyadh</option>
                    <option>Jeddah</option>
                    <option>Dammam</option>
                    <option>Mecca</option>
                    <option>Medina</option>
                  </select>
                </div>
              </CardContent>
              <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-100">
                <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                  {editingRep ? 'Update Rep' : 'Add Representative'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
