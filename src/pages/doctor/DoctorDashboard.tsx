import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Calendar, Clock, CheckCircle2, DollarSign, ArrowRight, TrendingUp } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../store';
import { Notification } from '../../types';

const TYPE_COLORS: Record<string, string> = {
  'in-person': 'bg-emerald-100 text-emerald-700',
  'video': 'bg-blue-100 text-blue-700',
  'call': 'bg-purple-100 text-purple-700',
  'text': 'bg-amber-100 text-amber-700',
};

export function DoctorDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { visits, updateVisit, addNotification } = useStore();

  const myVisits = visits.filter(v => v.doctorId === user?.id);
  const pendingReqs = myVisits.filter(v => v.status === 'pending');
  const todayVisits = myVisits.filter(v => v.status === 'confirmed'); // Could filter by actual today's date if needed

  const handleAction = (id: string, action: 'confirmed' | 'cancelled', repId: string, repName: string) => {
    updateVisit(id, { status: action });
    
    // Add notification for the rep
    const notif: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      userId: repId,
      type: action === 'confirmed' ? 'confirmed' : 'cancelled',
      title: `Visit ${action.toUpperCase()}`,
      message: `Dr. ${user?.name} has ${action} your visit request.`,
      time: 'Just now',
      read: false
    };
    addNotification(notif);
    
    toast.success(action === 'confirmed' ? 'Visit confirmed' : 'Visit declined');
  };

  const stats = [
    { title: 'Visits Total', value: myVisits.length, icon: Calendar, color: 'bg-blue-50 text-blue-600', trend: 'Lifetime' },
    { title: 'Pending Requests', value: pendingReqs.length, icon: Clock, color: 'bg-amber-50 text-amber-600', trend: 'Needs review' },
    { title: 'Confirmed', value: todayVisits.length, icon: CheckCircle2, color: 'bg-emerald-50 text-emerald-600', trend: 'Active' },
    { title: 'Experience', value: user?.experience || '0', icon: TrendingUp, color: 'bg-purple-50 text-purple-600', trend: 'Years' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Health Dashboard</h2>
          <p className="text-sm text-slate-500 mt-0.5">Manage your medical representative visits</p>
        </div>
        <Button className="gap-2" onClick={() => navigate('/schedule')}>
          <Calendar className="h-4 w-4" /> Manage Schedule
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(stat => (
          <Card key={stat.title}>
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center justify-between mb-3">
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <TrendingUp className="h-4 w-4 text-slate-300" />
              </div>
              <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{stat.title}</p>
              <p className="text-xs font-medium text-emerald-600 mt-1">{stat.trend}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-7">
        {/* Today's schedule */}
        <Card className="lg:col-span-4">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle>Schedule Overview</CardTitle>
            <Button variant="ghost" size="sm" className="text-emerald-600 gap-1 h-auto py-1" onClick={() => navigate('/bookings')}>
              All Bookings <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {todayVisits.length === 0 ? (
              <div className="flex flex-col items-center py-10 text-slate-400">
                <Calendar className="h-10 w-10 mb-2 opacity-20" />
                <p className="text-sm">No active confirmed visits</p>
              </div>
            ) : todayVisits.map(visit => (
              <div key={visit.id} className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 text-sm font-bold">
                    {visit.time.slice(0, 5)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{visit.repName}</p>
                    <p className="text-xs text-slate-400">Representative</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full capitalize ${TYPE_COLORS[visit.type]}`}>{visit.type}</span>
                  <Badge variant="success" className="text-[10px]">Confirmed</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Pending requests */}
        <Card className="lg:col-span-3">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>Pending Requests</CardTitle>
              {pendingReqs.length > 0 && (
                <span className="h-5 w-5 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {pendingReqs.length}
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingReqs.length === 0 ? (
              <div className="flex flex-col items-center py-8 text-slate-400">
                <CheckCircle2 className="h-10 w-10 mb-2 opacity-20" />
                <p className="text-sm">All caught up!</p>
              </div>
            ) : pendingReqs.map(req => (
              <div key={req.id} className="p-3.5 border border-amber-100 bg-amber-50/50 rounded-xl">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{req.repName}</p>
                    <p className="text-xs text-slate-400">Visit Request</p>
                  </div>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full capitalize ${TYPE_COLORS[req.type]}`}>{req.type}</span>
                </div>
                <p className="text-xs text-slate-500 mb-3">
                  <Calendar className="h-3 w-3 inline mr-1" />{req.date} at {req.time}
                </p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1 text-xs h-7 text-red-600 border-red-200 hover:bg-red-50" onClick={() => handleAction(req.id, 'cancelled', req.repId, req.repName)}>
                    Decline
                  </Button>
                  <Button size="sm" className="flex-1 text-xs h-7" onClick={() => handleAction(req.id, 'confirmed', req.repId, req.repName)}>
                    Accept
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
