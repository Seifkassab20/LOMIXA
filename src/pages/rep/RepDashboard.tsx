import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Calendar, Clock, CheckCircle2, Package, ArrowRight, TrendingUp, MapPin } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../store';

const MINI_TREND = [{ v: 0 }, { v: 0 }, { v: 0 }, { v: 0 }];

const TYPE_COLORS: Record<string, string> = {
  'in-person': 'bg-emerald-100 text-emerald-700',
  'video': 'bg-blue-100 text-blue-700',
  'call': 'bg-purple-100 text-purple-700',
  'text': 'bg-amber-100 text-amber-700',
};

export function RepDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { visits, credits, notifications } = useStore();

  const myVisits = visits.filter(v => v.repId === user?.id);
  const pendingCount = myVisits.filter(v => v.status === 'pending').length;
  const completedCount = myVisits.filter(v => v.status === 'completed').length;
  const myCredits = credits[user?.companyId || ''] || 0;
  
  const upcomingVisits = myVisits
    .filter(v => v.status === 'confirmed')
    .slice(0, 3);

  const recentNotifications = notifications
    .filter(n => n.userId === user?.id)
    .slice(0, 4);

  const stats = [
    { title: 'Total Bookings', value: myVisits.length.toString(), icon: Calendar, color: 'from-blue-500 to-blue-600', trend: 'Total requested', mini: true },
    { title: 'Pending Approval', value: pendingCount.toString(), icon: Clock, color: 'from-amber-500 to-orange-500', trend: 'Waiting for doctors', mini: false },
    { title: 'Completed Visits', value: completedCount.toString(), icon: CheckCircle2, color: 'from-emerald-500 to-teal-600', trend: 'Successful presentations', mini: false },
    { title: 'Team Credits', value: myCredits.toString(), icon: Package, color: 'from-purple-500 to-purple-700', trend: 'Available to use', mini: false },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Representative Portal</h2>
          <p className="text-sm text-slate-500 mt-0.5">Manage your medical outreach and presentation schedule</p>
        </div>
        <Button className="gap-2" onClick={() => navigate('/book')}>
          <Calendar className="h-4 w-4" /> Book New Visit
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(stat => (
          <Card key={stat.title} className="overflow-hidden">
            <div className={`bg-gradient-to-br ${stat.color} p-4`}>
              <div className="flex items-center justify-between">
                <div className="h-9 w-9 rounded-xl bg-white/20 flex items-center justify-center">
                  <stat.icon className="h-5 w-5 text-white" />
                </div>
                {stat.mini && (
                  <div className="h-10 w-16 opacity-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={MINI_TREND}>
                        <Line type="monotone" dataKey="v" stroke="#fff" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
              <p className="text-3xl font-bold text-white mt-2">{stat.value}</p>
              <p className="text-white/70 text-xs mt-0.5">{stat.title}</p>
            </div>
            <CardContent className="py-3 px-4">
              <p className="text-xs text-slate-500 font-medium">{stat.trend}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-7">
        {/* Upcoming visits */}
        <Card className="lg:col-span-4">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle>Upcoming Confirmed Visits</CardTitle>
            <Button variant="ghost" size="sm" className="text-emerald-600 gap-1 h-auto py-1" onClick={() => navigate('/bookings')}>
              All My Visits <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingVisits.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <Calendar className="h-10 w-10 mx-auto mb-3 opacity-20" />
                <p className="text-sm">No confirmed visits scheduled yet.</p>
                <Button variant="outline" size="sm" className="mt-4" onClick={() => navigate('/book')}>Schedule Now</Button>
              </div>
            ) : upcomingVisits.map(visit => (
              <div key={visit.id} className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700 font-bold text-lg">
                    {visit.doctorName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{visit.doctorName}</p>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="h-2.5 w-2.5" /> Hospital Contact
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-slate-700">{visit.date} · {visit.time}</p>
                  <div className="flex items-center justify-end gap-1.5 mt-1">
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full capitalize ${TYPE_COLORS[visit.type]}`}>{visit.type}</span>
                    <Badge variant="success" className="text-[10px]">Confirmed</Badge>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent activity */}
        <Card className="lg:col-span-3">
          <CardHeader className="pb-3">
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentNotifications.length === 0 ? (
              <p className="text-center py-10 text-slate-400 text-xs">No recent activity logs.</p>
            ) : recentNotifications.map((act, i) => (
              <div key={i} className="flex items-start gap-3 p-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                <Badge variant={act.type === 'confirmed' ? 'success' : 'outline'} className="h-6 w-6 rounded-full p-0 flex items-center justify-center flex-shrink-0">
                  {act.type === 'confirmed' ? '✓' : '!'}
                </Badge>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">{act.title}</p>
                  <p className="text-[10px] text-slate-400 line-clamp-2">{act.message}</p>
                  <p className="text-[10px] text-slate-300 mt-1">{act.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
