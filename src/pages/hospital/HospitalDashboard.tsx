import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Stethoscope, Calendar, Activity, Users, ArrowRight, TrendingUp } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../store';

const WEEKLY_VISITS = [
  { day: 'Sun', v: 0 }, { day: 'Mon', v: 0 }, { day: 'Tue', v: 0 },
  { day: 'Wed', v: 0 }, { day: 'Thu', v: 0 }, { day: 'Fri', v: 0 }, { day: 'Sat', v: 0 },
];

export function HospitalDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { users, visits } = useStore();

  const myDoctors = users.filter(u => u.role === 'doctor' && u.hospitalId === user?.id);
  const myDoctorIds = myDoctors.map(d => d.id);
  const myVisits = visits.filter(v => myDoctorIds.includes(v.doctorId));
  const pendingVisits = myVisits.filter(v => v.status === 'pending');

  const stats = [
    { title: 'Total Doctors', value: myDoctors.length, icon: Stethoscope, trend: 'Registered', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
    { title: "Total Visits", value: myVisits.length, icon: Calendar, trend: `${pendingVisits.length} pending`, color: 'bg-blue-50 text-blue-600 border-blue-100' },
    { title: 'Pharma Reach', value: '0', icon: Activity, trend: 'Network connect', color: 'bg-purple-50 text-purple-600 border-purple-100' },
    { title: 'Active Reps', value: Array.from(new Set(myVisits.map(v => v.repId))).length, icon: Users, trend: 'Collaborating', color: 'bg-amber-50 text-amber-600 border-amber-100' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Hospital Administration</h2>
          <p className="text-sm text-slate-500 mt-0.5">Managing connectivity for {user?.name}</p>
        </div>
        <Button className="gap-2" onClick={() => navigate('/doctors')}>
          <Stethoscope className="h-4 w-4" /> Manage Doctors
        </Button>
      </div>

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(stat => (
          <Card key={stat.title} className={`border-2 ${stat.color.split(' ').slice(-1)[0]}`}>
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center justify-between mb-3">
                <div className={`h-10 w-10 rounded-xl border flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <TrendingUp className="h-4 w-4 text-emerald-500" />
              </div>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{stat.title}</p>
              <p className="text-xs font-medium text-emerald-600 mt-1">{stat.trend}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-7">
        {/* Recent bookings */}
        <Card className="lg:col-span-4">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle>Recent Activity</CardTitle>
            <Button variant="ghost" size="sm" className="text-emerald-600 gap-1 h-auto py-1" onClick={() => navigate('/bookings')}>
              View All <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {myVisits.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <Activity className="h-10 w-10 mx-auto mb-2 opacity-20" />
                <p className="text-sm">No visit history found.</p>
              </div>
            ) : myVisits.slice(0, 4).map(v => (
              <div key={v.id} className="flex items-center justify-between p-3.5 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-700 font-bold text-sm">
                    {v.doctorName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{v.doctorName}</p>
                    <p className="text-xs text-slate-400">{v.repName} · {v.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-slate-700">{v.time}</p>
                  <Badge variant={v.status === 'confirmed' ? 'success' : 'warning'} className="text-[10px] mt-1 capitalize">{v.status}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Weekly visits chart */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Weekly Usage</CardTitle>
          </CardHeader>
          <CardContent className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={WEEKLY_VISITS} barSize={24}>
                <Tooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,.08)', fontSize: 12 }} />
                <Bar dataKey="v" name="Visits" radius={[6, 6, 0, 0]} fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Roster list */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle>Doctor Roster</CardTitle>
          <Button variant="ghost" size="sm" className="text-emerald-600 gap-1 h-auto py-1" onClick={() => navigate('/doctors')}>
            Manage <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {myDoctors.length === 0 ? (
               <p className="col-span-full py-6 text-center text-slate-400 text-sm">No doctors registered under this hospital.</p>
            ) : myDoctors.map((doc, i) => (
              <div key={doc.id} className="flex items-center gap-3 p-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white font-bold">
                  {doc.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">{doc.name}</p>
                  <p className="text-xs text-slate-500">{doc.specialty}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-emerald-600">
                    {visits.filter(v => v.doctorId === doc.id).length}
                  </p>
                  <p className="text-[10px] text-slate-400">visits</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
