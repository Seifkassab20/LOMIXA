import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Search, Calendar, Clock, User, Video, Phone, MessageSquare, CheckCircle2, XCircle, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../store';
import { toast } from 'sonner';
import { VisitStatus, VisitType, Notification } from '../../types';

type StatusFilter = 'all' | VisitStatus;

const TABS: { id: StatusFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'pending', label: 'Pending' },
  { id: 'confirmed', label: 'Confirmed' },
  { id: 'completed', label: 'Completed' },
  { id: 'cancelled', label: 'Cancelled' },
];

const TYPE_ICONS: Record<VisitType, React.ElementType> = {
  'in-person': User,
  'video': Video,
  'call': Phone,
  'text': MessageSquare,
};

function StatusBadge({ status }: { status: VisitStatus }) {
  if (status === 'pending') return <Badge variant="warning">Pending</Badge>;
  if (status === 'confirmed') return <Badge variant="success">Confirmed</Badge>;
  if (status === 'completed') return <Badge variant="secondary">Completed</Badge>;
  return <Badge variant="destructive">Cancelled</Badge>;
}

const TYPE_COLORS: Record<VisitType, string> = {
  'in-person': 'bg-emerald-50 text-emerald-700',
  'video': 'bg-blue-50 text-blue-700',
  'call': 'bg-purple-50 text-purple-700',
  'text': 'bg-amber-50 text-amber-700',
};

export function AllBookings() {
  const { user } = useAuth();
  const { visits, updateVisit, addNotification } = useStore();
  const [filter, setFilter] = useState<StatusFilter>('all');
  const [search, setSearch] = useState('');

  const isDoctor = user?.role === 'doctor';
  const isRep = user?.role === 'rep';
  const isPharma = user?.role === 'pharma';
  const isHospital = user?.role === 'hospital';

  // Filter based on role
  const myVisits = visits.filter(v => {
    if (isDoctor) return v.doctorId === user?.id;
    if (isRep) return v.repId === user?.id;
    if (isPharma) return true; // Could filter by rep list if repo-pharma mapping is stronger
    if (isHospital) return true; // Could filter by doctor list
    return true;
  });

  const filtered = myVisits.filter(b => {
    const matchStatus = filter === 'all' || b.status === filter;
    const matchSearch = search === '' ||
      b.doctorName.toLowerCase().includes(search.toLowerCase()) ||
      b.repName.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const counts: Record<string, number> = {
    all: myVisits.length,
    pending: myVisits.filter(b => b.status === 'pending').length,
    confirmed: myVisits.filter(b => b.status === 'confirmed').length,
    completed: myVisits.filter(b => b.status === 'completed').length,
    cancelled: myVisits.filter(b => b.status === 'cancelled').length,
  };

  const handleAction = (id: string, action: 'confirmed' | 'cancelled', targetUserId: string, targetName: string) => {
    updateVisit(id, { status: action });
    
    // Add notification for the rep/doctor
    const notif: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      userId: targetUserId,
      type: action === 'confirmed' ? 'confirmed' : 'cancelled',
      title: `Visit ${action.toUpperCase()}`,
      message: `${user?.name} has ${action} your visit request.`,
      time: 'Just now',
      read: false
    };
    addNotification(notif);
    
    toast.success(action === 'confirmed' ? 'Visit confirmed successfully' : 'Visit cancelled');
  };

  const pageTitle = isDoctor ? 'My Bookings' : user?.role === 'rep' ? 'My Visits' : 'All Bookings';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">{pageTitle}</h2>
          <p className="text-sm text-slate-500 mt-0.5">{myVisits.length} total visits · {counts.pending} pending review</p>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Pending', count: counts.pending, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Confirmed', count: counts.confirmed, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Completed', count: counts.completed, color: 'text-slate-600', bg: 'bg-slate-50' },
          { label: 'Cancelled', count: counts.cancelled, color: 'text-red-600', bg: 'bg-red-50' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-xl p-3 border border-slate-100`}>
            <p className={`text-2xl font-bold ${s.color}`}>{s.count}</p>
            <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-3 border-b border-slate-100">
          <div className="flex flex-col gap-3">
            {/* Filter tabs */}
            <div className="flex gap-1 bg-slate-100 p-1 rounded-lg w-fit flex-wrap">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id as StatusFilter)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md capitalize transition-colors flex items-center gap-1.5 ${
                    filter === tab.id
                      ? 'bg-white text-emerald-700 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                  {counts[tab.id] > 0 && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                      filter === tab.id ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'
                    }`}>{counts[tab.id]}</span>
                  )}
                </button>
              ))}
            </div>
            {/* Search */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input placeholder="Search by name..." className="pl-9 h-9" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-50">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center py-16 text-slate-400">
                <Calendar className="h-12 w-12 mb-3 opacity-20" />
                <p className="font-medium">No bookings found</p>
                <p className="text-sm mt-1">Try adjusting your filters or search terms</p>
              </div>
            ) : filtered.map(booking => {
              const TypeIcon = TYPE_ICONS[booking.type];
              return (
                <div key={booking.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 hover:bg-slate-50/80 transition-colors">
                  {/* Icon */}
                  <div className={`h-11 w-11 rounded-xl flex items-center justify-center flex-shrink-0 ${TYPE_COLORS[booking.type]}`}>
                    <TypeIcon className="h-5 w-5" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-slate-900">{booking.doctorName}</p>
                      <span className="text-xs text-slate-400">·</span>
                      <span className="text-xs text-slate-500">Medical Professional</span>
                    </div>
                    <p className="text-sm text-slate-500 mt-0.5">
                      Rep: {booking.repName}
                    </p>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> {booking.date}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {booking.time}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${TYPE_COLORS[booking.type]}`}>
                        {booking.type}
                      </span>
                    </div>
                  </div>

                  {/* Status + actions */}
                  <div className="flex items-center gap-2 self-start sm:self-center">
                    <StatusBadge status={booking.status} />
                    {isDoctor && booking.status === 'pending' && (
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline" className="h-8 text-red-600 border-red-200 hover:bg-red-50 gap-1" onClick={() => handleAction(booking.id, 'cancelled', booking.repId, booking.repName)}>
                          <XCircle className="h-3.5 w-3.5" /> Reject
                        </Button>
                        <Button size="sm" className="h-8 gap-1" onClick={() => handleAction(booking.id, 'confirmed', booking.repId, booking.repName)}>
                          <CheckCircle2 className="h-3.5 w-3.5" /> Accept
                        </Button>
                      </div>
                    )}
                    {isRep && booking.status === 'confirmed' && (
                      <Button size="sm" variant="outline" className="h-8 text-red-600 border-red-200 hover:bg-red-50" onClick={() => handleAction(booking.id, 'cancelled', booking.doctorId, booking.doctorName)}>
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
