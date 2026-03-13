import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Calendar, Clock, Plus, Trash2, Video, Phone, MessageSquare, User, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../store';
import { toast } from 'sonner';
import { AvailabilitySlot, VisitType } from '../../types';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const TYPES: { id: VisitType; label: string; icon: any }[] = [
  { id: 'in-person', label: 'In Person', icon: User },
  { id: 'video', label: 'Video Call', icon: Video },
  { id: 'call', label: 'Voice Call', icon: Phone },
  { id: 'text', label: 'Text Chat', icon: MessageSquare },
];

export function Schedule() {
  const { user: currentUser } = useAuth();
  const { slots, addSlot, deleteSlot } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    day: 'Monday',
    start: '09:00',
    end: '10:00',
    type: 'in-person' as VisitType,
    duration: 30
  });

  const mySlots = slots.filter(s => s.doctorId === currentUser?.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newSlot: AvailabilitySlot = {
      id: Math.random().toString(36).substr(2, 9),
      doctorId: currentUser?.id || '',
      day: formData.day,
      start: formData.start,
      end: formData.end,
      type: formData.type,
      duration: formData.duration
    };
    addSlot(newSlot);
    setIsModalOpen(false);
    toast.success('Availability slot added');
  };

  const groupedSlots = DAYS.reduce((acc, day) => {
    acc[day] = mySlots.filter(s => s.day === day).sort((a, b) => a.start.localeCompare(b.start));
    return acc;
  }, {} as Record<string, AvailabilitySlot[]>);

  const totalHours = mySlots.reduce((acc, s) => {
    const start = parseInt(s.start.split(':')[0]) + parseInt(s.start.split(':')[1]) / 60;
    const end = parseInt(s.end.split(':')[0]) + parseInt(s.end.split(':')[1]) / 60;
    return acc + (end - start);
  }, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">My Availability</h2>
          <p className="text-sm text-slate-500 mt-1">Set the weekly slots when you are available for medical visits.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2 bg-emerald-600 hover:bg-emerald-700">
          <Plus className="h-4 w-4" /> Add Time Slot
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-emerald-50 border-emerald-100">
          <CardContent className="pt-6">
            <p className="text-2xl font-bold text-emerald-700">{mySlots.length}</p>
            <p className="text-xs font-medium text-emerald-600 uppercase tracking-wider">Active Slots</p>
          </CardContent>
        </Card>
        <Card className="bg-blue-50 border-blue-100">
          <CardContent className="pt-6">
            <p className="text-2xl font-bold text-blue-700">{Object.values(groupedSlots).filter(s => s.length > 0).length}</p>
            <p className="text-xs font-medium text-blue-600 uppercase tracking-wider">Days Available</p>
          </CardContent>
        </Card>
        <Card className="bg-purple-50 border-purple-100">
          <CardContent className="pt-6">
            <p className="text-2xl font-bold text-purple-700">{totalHours.toFixed(1)}</p>
            <p className="text-xs font-medium text-purple-600 uppercase tracking-wider">Weekly Hours</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        {DAYS.map((day) => (
          <div key={day} className="space-y-3">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">{day.slice(0, 3)}</h3>
            <div className="space-y-2">
              {groupedSlots[day]?.length === 0 ? (
                <div className="h-20 border-2 border-dashed border-slate-100 rounded-xl flex items-center justify-center">
                  <span className="text-[10px] text-slate-300 font-bold uppercase">No Slots</span>
                </div>
              ) : (
                groupedSlots[day].map((slot) => {
                  const TypeIcon = TYPES.find(t => t.id === slot.type)?.icon || User;
                  return (
                    <Card key={slot.id} className="group hover:border-emerald-200 transition-all">
                      <div className="p-3 relative">
                        <button 
                          onClick={() => deleteSlot(slot.id)}
                          className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-red-50 text-red-500 border border-red-100 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-red-500 hover:text-white"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                        <div className="flex items-center gap-2 mb-1">
                          <TypeIcon className="h-3 w-3 text-emerald-600" />
                          <span className="text-[10px] font-bold text-slate-400 uppercase">{slot.type}</span>
                        </div>
                        <p className="text-sm font-bold text-slate-900">{slot.start} - {slot.end}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">{slot.duration}m duration</p>
                      </div>
                    </Card>
                  );
                })
              )}
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <Card className="w-full max-w-md shadow-2xl">
            <CardHeader>
              <CardTitle>Add Availability Slot</CardTitle>
              <CardDescription>Select the day and time you are available for visits.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Day of the Week</label>
                  <select 
                    className="w-full h-10 px-3 rounded-md border border-slate-200 bg-white text-sm"
                    value={formData.day}
                    onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                  >
                    {DAYS.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Start Time</label>
                    <Input 
                      type="time" 
                      value={formData.start} 
                      onChange={(e) => setFormData({ ...formData, start: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">End Time</label>
                    <Input 
                      type="time" 
                      value={formData.end} 
                      onChange={(e) => setFormData({ ...formData, end: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-3 pt-2">
                  <label className="text-sm font-medium text-slate-700">Visit Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {TYPES.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, type: t.id })}
                        className={`flex items-center gap-2 p-2.5 rounded-lg border text-sm font-medium transition-all ${
                          formData.type === t.id ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <t.icon className="h-4 w-4" />
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
              <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-100">
                <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">Save Slot</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
