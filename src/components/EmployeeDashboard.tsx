import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card } from './ui/card';
import { Clock, Calendar, TrendingUp, Activity } from 'lucide-react';
import type { Shift, Employee } from '../App';

interface EmployeeDashboardProps {
  employee: Employee;
  shifts: Shift[];
}

export function EmployeeDashboard({ employee, shifts }: EmployeeDashboardProps) {
  // Calculate KPIs
  const totalHours = shifts.reduce((sum, shift) => {
    const start = new Date(shift.start);
    const end = new Date(shift.end);
    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    return sum + hours;
  }, 0);

  const numberOfShifts = shifts.length;
  const averageShiftDuration = numberOfShifts > 0 ? totalHours / numberOfShifts : 0;
  
  // Calculate weekly utilization (assume 40h full-time week)
  const fullTimeHours = 40;
  const utilizationPercentage = Math.min((totalHours / fullTimeHours) * 100, 100);

  // Prepare data for bar chart (hours per day)
  const dailyHours = new Map<string, number>();
  shifts.forEach(shift => {
    const date = new Date(shift.start).toLocaleDateString('de-DE', { 
      weekday: 'short',
      day: '2-digit',
      month: '2-digit'
    });
    const start = new Date(shift.start);
    const end = new Date(shift.end);
    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    dailyHours.set(date, (dailyHours.get(date) || 0) + hours);
  });

  const chartData = Array.from(dailyHours.entries())
    .map(([date, hours]) => ({ date, hours: parseFloat(hours.toFixed(1)) }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // Prepare data for pie chart (utilization)
  const pieData = [
    { name: 'Gearbeitete Stunden', value: parseFloat(totalHours.toFixed(1)), color: '#00B1A9' },
    { name: 'Verfügbare Stunden', value: parseFloat(Math.max(0, fullTimeHours - totalHours).toFixed(1)), color: '#E5E5E5' },
  ];

  // Count shift types (based on start time)
  const shiftTypes = { morning: 0, afternoon: 0, night: 0 };
  shifts.forEach(shift => {
    const hour = new Date(shift.start).getHours();
    if (hour >= 6 && hour < 14) shiftTypes.morning++;
    else if (hour >= 14 && hour < 22) shiftTypes.afternoon++;
    else shiftTypes.night++;
  });

  const shiftTypeData = [
    { name: 'Frühdienst', value: shiftTypes.morning, color: '#FFB547' },
    { name: 'Spätdienst', value: shiftTypes.afternoon, color: '#00B1A9' },
    { name: 'Nachtdienst', value: shiftTypes.night, color: '#01547E' },
  ].filter(item => item.value > 0);

  // Weekly calendar view
  const getWeekDays = () => {
    const today = new Date();
    const monday = new Date(today);
    monday.setDate(today.getDate() - today.getDay() + 1);
    
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(monday);
      day.setDate(monday.getDate() + i);
      return day;
    });
  };

  const weekDays = getWeekDays();
  
  const getShiftsForDay = (day: Date) => {
    const dayStr = day.toISOString().split('T')[0];
    return shifts.filter(shift => shift.start.startsWith(dayStr));
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-brand-accent/10 dark:bg-brand-accent/20 flex items-center justify-center">
              <Clock className="w-5 h-5 text-brand-accent" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Gesamtstunden</p>
              <p className="text-2xl text-neutral-900 dark:text-neutral-50">{totalHours.toFixed(1)}h</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-brand-primary/10 dark:bg-brand-primary/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-brand-primary dark:text-brand-accent" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Auslastung</p>
              <p className="text-2xl text-neutral-900 dark:text-neutral-50">{utilizationPercentage.toFixed(0)}%</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 dark:bg-amber-500/20 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-amber-600 dark:text-amber-500" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Anzahl Schichten</p>
              <p className="text-2xl text-neutral-900 dark:text-neutral-50">{numberOfShifts}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 dark:bg-purple-500/20 flex items-center justify-center">
              <Activity className="w-5 h-5 text-purple-600 dark:text-purple-500" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Ø Schichtdauer</p>
              <p className="text-2xl text-neutral-900 dark:text-neutral-50">{averageShiftDuration.toFixed(1)}h</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Utilization Pie Chart */}
        <Card className="p-6">
          <h2 className="text-neutral-900 dark:text-neutral-50 mb-4 text-[20px]">
            Wochenauslastung
          </h2>
          <div className="h-64" role="img" aria-label="Kuchendiagramm zeigt Wochenauslastung">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ value }) => `${value}h`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--background)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => [`${value} Stunden`]}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  iconType="circle"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              {totalHours.toFixed(1)} von {fullTimeHours} Stunden ({utilizationPercentage.toFixed(0)}%)
            </p>
          </div>
        </Card>

        {/* Shift Types Distribution */}
        {shiftTypeData.length > 0 && (
          <Card className="p-6">
            <h2 className="text-neutral-900 dark:text-neutral-50 mb-4 font-normal">
              Schichtverteilung
            </h2>
            <div className="h-64" role="img" aria-label="Kuchendiagramm zeigt Verteilung der Schichttypen">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={shiftTypeData}
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ value }) => value}
                  >
                    {shiftTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--background)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => [`${value} Schichten`]}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    iconType="circle"
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        )}
      </div>

      {/* Bar Chart - Hours per Day */}
      {chartData.length > 0 && (
        <Card className="p-6">
          <h2 className="text-neutral-900 dark:text-neutral-50 mb-4">
            Stunden pro Tag
          </h2>
          <div className="h-64" role="img" aria-label="Balkendiagramm zeigt Arbeitsstunden pro Tag">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-neutral-200 dark:stroke-neutral-800" />
                <XAxis 
                  dataKey="date" 
                  className="text-neutral-600 dark:text-neutral-400"
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  className="text-neutral-600 dark:text-neutral-400"
                  tick={{ fontSize: 12 }}
                  label={{ value: 'Stunden', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--background)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: 'var(--foreground)' }}
                  formatter={(value: number) => [`${value} Stunden`, 'Arbeitszeit']}
                />
                <Bar 
                  dataKey="hours" 
                  fill="#00B1A9" 
                  radius={[4, 4, 0, 0]}
                  aria-label="Arbeitsstunden"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {/* Weekly Calendar View */}
      <Card className="p-6">
        <h2 className="text-neutral-900 dark:text-neutral-50 mb-4">
          Wochenplan
        </h2>
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day, index) => {
            const dayShifts = getShiftsForDay(day);
            const isToday = day.toDateString() === new Date().toDateString();
            
            return (
              <div 
                key={index}
                className={`border rounded-lg p-3 min-h-[120px] ${
                  isToday 
                    ? 'border-brand-accent bg-brand-accent/5 dark:bg-brand-accent/10' 
                    : 'border-neutral-200 dark:border-neutral-700'
                }`}
              >
                <div className="text-center mb-2">
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {day.toLocaleDateString('de-DE', { weekday: 'short' })}
                  </p>
                  <p className={`${
                    isToday 
                      ? 'text-brand-primary dark:text-brand-accent' 
                      : 'text-neutral-900 dark:text-neutral-50'
                  }`}>
                    {day.getDate()}
                  </p>
                </div>
                <div className="space-y-1">
                  {dayShifts.map(shift => {
                    const start = new Date(shift.start);
                    const end = new Date(shift.end);
                    const hours = ((end.getTime() - start.getTime()) / (1000 * 60 * 60)).toFixed(1);
                    const startHour = start.getHours();
                    
                    let shiftColor = 'bg-brand-accent/20 text-brand-accent';
                    if (startHour >= 6 && startHour < 14) {
                      shiftColor = 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400';
                    } else if (startHour >= 14 && startHour < 22) {
                      shiftColor = 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400';
                    } else {
                      shiftColor = 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
                    }
                    
                    return (
                      <div 
                        key={shift.id}
                        className={`text-xs p-2 rounded ${shiftColor}`}
                      >
                        <div>{start.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}</div>
                        <div className="opacity-75">{hours}h</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
