import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from './ui/card';
import type { Shift } from '../App';

interface ShiftVisualizationProps {
  shifts: Shift[];
}

export function ShiftVisualization({ shifts }: ShiftVisualizationProps) {
  // Group shifts by date and calculate total hours per day
  const shiftsByDate = shifts.reduce((acc, shift) => {
    const date = new Date(shift.start).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
    });
    
    const start = new Date(shift.start);
    const end = new Date(shift.end);
    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    
    if (!acc[date]) {
      acc[date] = 0;
    }
    acc[date] += hours;
    
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(shiftsByDate)
    .map(([date, hours]) => ({
      date,
      hours: Number(hours.toFixed(2)),
    }))
    .sort((a, b) => {
      const [dayA, monthA] = a.date.split('.');
      const [dayB, monthB] = b.date.split('.');
      return new Date(2025, parseInt(monthA) - 1, parseInt(dayA)).getTime() - 
             new Date(2025, parseInt(monthB) - 1, parseInt(dayB)).getTime();
    })
    .slice(-7); // Show last 7 days

  if (chartData.length === 0) {
    return null;
  }

  return (
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
  );
}
