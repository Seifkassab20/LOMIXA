import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Search, MapPin, Star, Calendar, Clock, Video, Phone, MessageSquare, User, ChevronRight, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../store';
import { toast } from 'sonner';
import { User as UserType, Visit, VisitType, Notification } from '../../types';

export function BookVisit() {
  const { user } = useAuth();
  const { users, slots, addVisit, addNotification, credits, consumeCredit } = useStore();
  
  const [step, setStep] = useState(1);
  const [selectedDoctor, setSelectedDoctor] = useState<UserType | null>(null);
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [visitType, setVisitType] = useState<VisitType>('in-person');
  const [search, setSearch] = useState('');

  const companyCredits = credits[user?.companyId || ''] || 0;

  // Step 1: Find Doctor
  const doctors = users.filter(u => u.role === 'doctor');
  const filteredDoctors = doctors.filter(doc => 
    doc.name.toLowerCase().includes(search.toLowerCase()) || 
    doc.specialty?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectDoctor = (doc: UserType) => {
    setSelectedDoctor(doc);
    setStep(2);
  };

  // Step 2: Select Time
  const doctorSlots = slots.filter(s => s.doctorId === selectedDoctor?.id);
  const availableDays = Array.from(new Set(doctorSlots.map(s => s.day)));
  const slotsForDay = doctorSlots.filter(s => s.day === selectedDay);

  const handleConfirm = () => {
    if (!selectedDoctor || !selectedSlot) return;
    
    if (companyCredits <= 0) {
      toast.error('Insufficient credits. Please contact your administrator.');
      return;
    }

    const slot = doctorSlots.find(s => s.id === selectedSlot);
    if (!slot) return;

    const newVisit: Visit = {
      id: Math.random().toString(36).substr(2, 9),
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      repId: user?.id || '',
      repName: user?.name || '',
      date: selectedDay,
      time: slot.start,
      type: visitType,
      status: 'pending',
      duration: slot.duration
    };

    addVisit(newVisit);
    consumeCredit(user?.companyId || '');

    // Notify Doctor
    const docNotif: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      userId: selectedDoctor.id,
      type: 'booking',
      title: 'New Visit Request',
      message: `${user?.name} requested a visit on ${selectedDay} at ${slot.start}.`,
      time: 'Just now',
      read: false
    };
    addNotification(docNotif);

    setStep(3);
    toast.success('Visit booked successfully!');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header & Progress */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Book a Visit</h2>
          <p className="text-sm text-slate-500 mt-1">Select a doctor and schedule your product presentation.</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl">
          {[1, 2, 3].map(s => (
            <div key={s} className={`h-2 w-12 rounded-full transition-all ${step >= s ? 'bg-emerald-500' : 'bg-slate-200'}`} />
          ))}
        </div>
      </div>

      {/* Credits Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-4 text-white flex items-center justify-between shadow-lg shadow-emerald-200/50">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-emerald-100" />
          </div>
          <div>
            <p className="text-sm font-medium text-emerald-100 opacity-80">Available Credits</p>
            <p className="text-xl font-bold">{companyCredits} Credits</p>
          </div>
        </div>
        <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
          Manage Credits
        </Button>
      </div>

      {/* Step 1: Find Doctor */}
      {step === 1 && (
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
            <Input 
              placeholder="Search by name, hospital, or specialty..." 
              className="pl-12 h-12 text-lg rounded-2xl shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDoctors.length === 0 ? (
              <div className="col-span-full py-20 text-center">
                <User className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                <p className="text-slate-500">No doctors matching your search found.</p>
              </div>
            ) : filteredDoctors.map(doc => (
              <Card key={doc.id} className="cursor-pointer hover:border-emerald-500 group transition-all" onClick={() => handleSelectDoctor(doc)}>
                <CardContent className="p-5 flex gap-4">
                  <div className="h-16 w-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                    <User className="h-8 w-8" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <h3 className="font-bold text-slate-900 truncate">{doc.name}</h3>
                      <div className="flex items-center gap-1 text-xs text-amber-500 font-bold">
                        <Star className="h-3 w-3 fill-amber-500" /> 4.9
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-emerald-600 mt-0.5">{doc.specialty}</p>
                    <div className="mt-3 flex items-center gap-4">
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> KFSH Riyadh
                      </span>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {slots.filter(s => s.doctorId === doc.id).length} slots
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-emerald-500 transition-colors" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Select Time */}
      {step === 2 && selectedDoctor && (
        <Card className="shadow-xl border-t-4 border-t-emerald-500">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" className="h-8 w-8 p-0" onClick={() => setStep(1)}>
                <ChevronRight className="h-5 w-5 rotate-180" />
              </Button>
              <div>
                <CardTitle>Schedule with {selectedDoctor.name}</CardTitle>
                <CardDescription>{selectedDoctor.specialty} · King Faisal Specialist Hospital</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">1. Select Date</label>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {availableDays.length === 0 ? (
                  <p className="text-sm text-slate-500 italic">No available slots found for this doctor.</p>
                ) : availableDays.map(day => (
                  <button
                    key={day}
                    onClick={() => { setSelectedDay(day); setSelectedSlot(null); }}
                    className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all whitespace-nowrap ${
                      selectedDay === day ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            {selectedDay && (
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">2. Available Slots</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {slotsForDay.map(slot => (
                    <button
                      key={slot.id}
                      onClick={() => setSelectedSlot(slot.id)}
                      className={`p-3 rounded-xl border-2 text-sm font-bold transition-all ${
                        selectedSlot === slot.id ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-100 hover:border-slate-200'
                      }`}
                    >
                      {slot.start}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">3. Visit Type</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  { id: 'in-person', label: 'In-Person', icon: User },
                  { id: 'video', label: 'Video Call', icon: Video },
                  { id: 'call', label: 'Voice Call', icon: Phone },
                  { id: 'text', label: 'Message', icon: MessageSquare },
                ].map(type => (
                  <button
                    key={type.id}
                    onClick={() => setVisitType(type.id as VisitType)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                      visitType === type.id ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-100 hover:border-slate-200 text-slate-500'
                    }`}
                  >
                    <type.icon className="h-5 w-5" />
                    <span className="text-xs font-bold">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-600">
                <AlertCircle className="h-4 w-4" />
                <span className="text-xs font-bold">Consumes 1 Credit</span>
              </div>
              <Button onClick={handleConfirm} disabled={!selectedSlot} className="bg-emerald-600 hover:bg-emerald-700 px-8 h-12 rounded-xl text-lg font-bold">
                Confirm Booking
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Success */}
      {step === 3 && (
        <Card className="text-center py-12 shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500" />
          <CardContent className="space-y-6">
            <div className="h-24 w-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <CheckCircle2 className="h-12 w-12" />
            </div>
            <div className="space-y-1">
              <h2 className="text-3xl font-bold text-slate-900">Request Sent!</h2>
              <p className="text-slate-500">Wait for the doctor to confirm the appointment.</p>
            </div>
            
            <div className="max-w-xs mx-auto bg-slate-50 rounded-2xl p-4 text-left space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Doctor</span>
                <span className="font-bold text-slate-900">{selectedDoctor?.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Date</span>
                <span className="font-bold text-slate-900">{selectedDay}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Time</span>
                <span className="font-bold text-slate-900">{doctorSlots.find(s => s.id === selectedSlot)?.start}</span>
              </div>
            </div>

            <div className="flex gap-3 justify-center pt-4">
              <Button onClick={() => { setStep(1); setSelectedDoctor(null); }} variant="outline" className="h-12 px-8 rounded-xl font-bold">Book Another</Button>
              <Button className="h-12 px-8 rounded-xl bg-emerald-600 hover:bg-emerald-700 font-bold" onClick={() => window.location.href='/bookings'}>View My Visits</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
