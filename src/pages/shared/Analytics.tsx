import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { useAuth } from '../../context/AuthContext';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, Legend, RadarChart,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
} from 'recharts';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

const monthlyData = [
  { name: 'Oct', visits: 320, conversion: 18, doctors: 45 },
  { name: 'Nov', visits: 380, conversion: 21, doctors: 52 },
  { name: 'Dec', visits: 290, conversion: 16, doctors: 39 },
  { name: 'Jan', visits: 420, conversion: 24, doctors: 58 },
  { name: 'Feb', visits: 380, conversion: 20, doctors: 55 },
  { name: 'Mar', visits: 560, conversion: 28, doctors: 72 },
];

const regionData = [
  { name: 'Riyadh', value: 420 },
  { name: 'Jeddah', value: 310 },
  { name: 'Dammam', value: 210 },
  { name: 'Mecca', value: 160 },
  { name: 'Medina', value: 95 },
  { name: 'Khobar', value: 75 },
];

const repPerformance = [
  { name: 'Khalid', visits: 45, conversion: 22, target: 50 },
  { name: 'Noura', visits: 38, conversion: 19, target: 40 },
  { name: 'Faisal', visits: 32, conversion: 15, target: 35 },
  { name: 'Sara', visits: 28, conversion: 13, target: 30 },
  { name: 'Omar', visits: 24, conversion: 11, target: 30 },
];

const visitTypeData = [
  { name: 'In-Person', value: 48 },
  { name: 'Video', value: 28 },
  { name: 'Phone', value: 14 },
  { name: 'Text', value: 10 },
];

const doctorEngagement = [
  { subject: 'Cardiology', A: 85 },
  { subject: 'Pediatrics', A: 70 },
  { subject: 'Neurology', A: 65 },
  { subject: 'Oncology', A: 55 },
  { subject: 'Orthopedics', A: 45 },
  { subject: 'Dermatology', A: 40 },
];

const weeklyActivity = [
  { day: 'Sun', visits: 12 },
  { day: 'Mon', visits: 45 },
  { day: 'Tue', visits: 38 },
  { day: 'Wed', visits: 52 },
  { day: 'Thu', visits: 41 },
  { day: 'Fri', visits: 8 },
  { day: 'Sat', visits: 5 },
];

const CustomTooltipStyle = {
  borderRadius: '10px',
  border: 'none',
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  fontSize: '12px',
};

function StatCard({ title, value, trend, trendVal, color }: {
  title: string; value: string; trend: 'up' | 'down' | 'flat'; trendVal: string; color?: string;
}) {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? 'text-emerald-600' : trend === 'down' ? 'text-red-500' : 'text-slate-400';
  return (
    <Card>
      <CardContent className="pt-6">
        <p className="text-sm text-slate-500 font-medium">{title}</p>
        <p className={`text-3xl font-bold mt-1 ${color ?? 'text-slate-900'}`}>{value}</p>
        <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${trendColor}`}>
          <TrendIcon className="h-3.5 w-3.5" />
          <span>{trendVal}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export function Analytics() {
  const { user } = useAuth();
  const [period, setPeriod] = useState<'week' | 'month' | 'quarter'>('month');

  const isHospital = user?.role === 'hospital';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Analytics Dashboard</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            {isHospital ? 'Hospital visit and doctor engagement statistics' : 'Company-wide performance metrics'}
          </p>
        </div>
        <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
          {(['week', 'month', 'quarter'] as const).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold capitalize transition-colors ${
                period === p ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {p === 'week' ? 'This Week' : p === 'month' ? 'This Month' : 'This Quarter'}
            </button>
          ))}
        </div>
      </div>

      {/* KPI row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Visits" value="560" trend="up" trendVal="+12% vs last period" color="text-emerald-600" />
        <StatCard title="Conversion Rate" value="28%" trend="up" trendVal="+4.2% vs last period" />
        <StatCard title="Doctors Engaged" value="72" trend="up" trendVal="+8 new this period" />
        <StatCard title="Avg Visit Duration" value="24 min" trend="flat" trendVal="No change" />
      </div>

      {/* Monthly visits + Conversion */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Visit Volume</CardTitle>
            <CardDescription>Total visits completed per month</CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="visitGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip contentStyle={CustomTooltipStyle} />
                <Area type="monotone" dataKey="visits" stroke="#10b981" strokeWidth={2.5} fill="url(#visitGrad)" dot={{ r: 4, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Conversion Rate Trend</CardTitle>
            <CardDescription>Percentage of visits converted to presentations</CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} unit="%" />
                <Tooltip contentStyle={CustomTooltipStyle} formatter={(v: number) => [`${v}%`, 'Conversion']} />
                <Line type="monotone" dataKey="conversion" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 4, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Region + Visit Types */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Regional Distribution</CardTitle>
            <CardDescription>Visits by city / region in KSA</CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionData} layout="vertical" margin={{ left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} width={60} />
                <Tooltip contentStyle={CustomTooltipStyle} />
                <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                  {regionData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Visit Type Breakdown</CardTitle>
            <CardDescription>Types of visits conducted this period</CardDescription>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={visitTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {visitTypeData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={CustomTooltipStyle} formatter={(v: number) => [`${v}%`, 'Share']} />
                <Legend iconType="circle" iconSize={8} formatter={(val) => <span className="text-xs text-slate-600">{val}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Rep performance + Doctor engagement */}
      <div className="grid gap-4 md:grid-cols-2">
        {!isHospital && (
          <Card>
            <CardHeader>
              <CardTitle>Rep Performance</CardTitle>
              <CardDescription>Visits vs. monthly target</CardDescription>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={repPerformance} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <Tooltip contentStyle={CustomTooltipStyle} />
                  <Legend iconType="circle" iconSize={8} />
                  <Bar name="Actual Visits" dataKey="visits" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar name="Target" dataKey="target" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        <Card className={isHospital ? 'md:col-span-2' : ''}>
          <CardHeader>
            <CardTitle>Doctor Specialty Engagement</CardTitle>
            <CardDescription>How often each specialty is visited</CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={doctorEngagement} cx="50%" cy="50%" outerRadius={80}>
                <PolarGrid stroke="#f1f5f9" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} axisLine={false} tick={false} />
                <Radar name="Engagement" dataKey="A" stroke="#10b981" fill="#10b981" fillOpacity={0.15} strokeWidth={2} />
                <Tooltip contentStyle={CustomTooltipStyle} formatter={(v: number) => [`${v}%`, 'Engagement']} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Weekly activity */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Visit Activity</CardTitle>
          <CardDescription>Day-by-day breakdown of visit distribution</CardDescription>
        </CardHeader>
        <CardContent className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyActivity}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <Tooltip contentStyle={CustomTooltipStyle} />
              <Bar dataKey="visits" radius={[6, 6, 0, 0]}>
                {weeklyActivity.map((entry, i) => (
                  <Cell key={i} fill={entry.day === 'Fri' || entry.day === 'Sat' ? '#e2e8f0' : '#10b981'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
