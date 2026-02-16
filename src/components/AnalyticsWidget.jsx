import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { CheckCircle2, ListTodo, TrendingUp, Target } from 'lucide-react';

export default function AnalyticsWidget({ analytics }) {
  const { completedToday, totalTasks, completedTasks, weeklyData } = analytics;
  const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const stats = [
    { label: 'Done Today', value: completedToday, icon: CheckCircle2, color: 'var(--success)' },
    { label: 'Total Tasks', value: totalTasks, icon: ListTodo, color: 'var(--accent)' },
    { label: 'Completed', value: completedTasks, icon: Target, color: 'var(--warning)' },
    { label: 'Progress', value: `${percentage}%`, icon: TrendingUp, color: 'var(--priority-high)' },
  ];

  return (
    <>
      <div className="analytics-grid">
        {stats.map(stat => (
          <div className="stat-card" key={stat.label}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div className="stat-label">{stat.label}</div>
                <div className="stat-value">{stat.value}</div>
              </div>
              <stat.icon size={28} style={{ color: stat.color, opacity: 0.6 }} />
            </div>
          </div>
        ))}
      </div>

      <div className="chart-card">
        <h4>Weekly Activity</h4>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 12, fill: 'var(--text-secondary)' }}
              stroke="var(--border-color)"
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 12, fill: 'var(--text-secondary)' }}
              stroke="var(--border-color)"
            />
            <Tooltip
              contentStyle={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: 12,
                fontSize: 13,
              }}
            />
            <Bar
              dataKey="completed"
              fill="url(#barGradient)"
              radius={[6, 6, 0, 0]}
              maxBarSize={36}
            />
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}
