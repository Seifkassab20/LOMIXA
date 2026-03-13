import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Users, Stethoscope, Package, BarChart3, Calendar, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { useStore } from '../../store';
import { useAuth } from '../../context/AuthContext';

const MINI_DATA = [{ v: 0 }, { v: 0 }, { v: 0 }, { v: 0 }];

export function PharmaDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { users, visits, credits } = useStore();

  const myReps = users.filter(u => u.role === 'rep' && u.companyId === user?.id);
  const myCredits = credits[user?.id || ''] || 0;
  
  // Real stats from store
  const stats = [
    { title: 'Total Reps', value: myReps.length.toString(), icon: Users, trend: 'Updated', trendDir: 'flat', sub: 'in team', color: 'from-blue-500 to-blue-600' },
    { title: 'Active Doctors', value: users.filter(u => u.role === 'doctor').length.toString(), icon: Stethoscope, trend: 'Network', trendDir: 'up', sub: 'total verified', color: 'from-emerald-500 to-teal-600' },
    { title: 'Visit Credits', value: myCredits.toString(), icon: Package, trend: 'Available', trendDir: 'flat', sub: 'for booking', color: 'from-purple-500 to-purple-600' },
    { title: 'Visits Made', value: visits.filter(v => myReps.some(r => r.id === v.repId)).length.toString(), icon: BarChart3, trend: 'Total', trendDir: 'up', sub: 'lifetime', color: 'from-amber-500 to-orange-500' },
  ];

  const upcomingVisits = visits
    .filter(v => myReps.some(r => r.id === v.repId) && v.status === 'confirmed')
    .slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Company Overview</h2>
          <p className="text-sm text-slate-500 mt-0.5">Real-time snapshot of your pharmaceutical operations</p>
        </div>
        <Button className="gap-2" onClick={() => navigate('/bundles')}>
          <Package className="h-4 w-4" /> Buy Credits
        </Button>
      </div>

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(stat => (
          <Card key={stat.title} className="overflow-hidden">
            <div className={`bg-gradient-to-br ${stat.color} p-4`}>
              <div className="flex items-center justify-between">
                <div className="h-9 w-9 rounded-xl bg-white/20 flex items-center justify-center">
                  <stat.icon className="h-5 w-5 text-white" />
                </div>
                <div className="h-12 w-16 opacity-50">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={MINI_DATA}>
                      <Area type="monotone" dataKey="v" stroke="#fff" strokeWidth={1.5} fill="rgba(255,255,255,0.2)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <p className="text-3xl font-bold text-white mt-2">{stat.value}</p>
              <p className="text-white/70 text-xs mt-0.5">{stat.title}</p>
            </div>
            <CardContent className="py-3 px-4">
              <div className="flex items-center gap-1.5 text-xs">
                {stat.trendDir === 'up' ? <TrendingUp className="h-3.5 w-3.5 text-emerald-600" /> : stat.trendDir === 'down' ? <TrendingDown className="h-3.5 w-3.5 text-red-500" /> : null}
                <span className={`font-semibold ${stat.trendDir === 'up' ? 'text-emerald-600' : stat.trendDir === 'down' ? 'text-red-500' : 'text-slate-500'}`}>{stat.trend}</span>
                <span className="text-slate-400">{stat.sub}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick-action cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Manage Reps', icon: Users, path: '/subordinates', color: 'blue' },
          { label: 'View Doctors', icon: Stethoscope, path: '/doctors', color: 'emerald' },
          { label: 'All Bookings', icon: Calendar, path: '/bookings', color: 'purple' },
          { label: 'Analytics', icon: BarChart3, path: '/analytics', color: 'amber' },
        ].map(card => (
          <button
            key={card.label}
            onClick={() => navigate(card.path)}
            className="flex flex-col items-center justify-center gap-2 p-5 border-2 border-slate-100 rounded-xl hover:border-emerald-400 hover:bg-emerald-50 transition-all group"
          >
            <div className="h-11 w-11 rounded-xl bg-slate-100 group-hover:bg-emerald-100 flex items-center justify-center transition-colors">
              <card.icon className="h-6 w-6 text-slate-500 group-hover:text-emerald-600 transition-colors" />
            </div>
            <span className="text-sm font-semibold text-slate-700 group-hover:text-emerald-700">{card.label}</span>
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle>Upcoming Team Visits</CardTitle>
            <Button variant="ghost" size="sm" className="text-emerald-600 gap-1 h-auto py-1" onClick={() => navigate('/bookings')}>
              View All <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingVisits.length === 0 ? (
              <div className="py-8 text-center text-slate-400 bg-slate-50/50 rounded-xl">
                <Calendar className="h-8 w-8 mx-auto mb-2 opacity-20" />
                <p className="text-xs">No upcoming visits confirmed yet.</p>
              </div>
            ) : upcomingVisits.map(visit => (
              <div key={visit.id} className="flex items-center justify-between p-3.5 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 flex-shrink-0">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{visit.doctorName}</p>
                    <p className="text-xs text-slate-400">Rep: {visit.repName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-slate-700">{visit.date} · {visit.time}</p>
                  <Badge variant="success" className="text-[10px] mt-1 capitalize">{visit.status}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle>My Representatives</CardTitle>
            <Button variant="ghost" size="sm" className="text-emerald-600 gap-1 h-auto py-1" onClick={() => navigate('/subordinates')}>
              Manage <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {myReps.length === 0 ? (
              <div className="py-8 text-center text-slate-400">
                <Users className="h-8 w-8 mx-auto mb-2 opacity-20" />
                <p className="text-xs">No reps added yet.</p>
              </div>
            ) : myReps.slice(0, 5).map((rep, idx) => (
              <div key={rep.id} className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs">
                  {rep.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">{rep.name}</p>
                  <p className="text-xs text-slate-400">{rep.email}</p>
                </div>
                <div className="text-sm font-bold text-emerald-600">Active</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
