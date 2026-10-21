import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import type { DemoState } from '../model';
export function activitySeries(state: DemoState, days: number) {
  const result = [];
  for (let n = days - 1; n >= 0; n--) {
    const d = new Date();
    d.setDate(d.getDate() - n);
    d.setHours(0, 0, 0, 0);
    const next = new Date(d);
    next.setDate(next.getDate() + 1);
    const tx = state.transactions.filter(
      (t) => new Date(t.at) >= d && new Date(t.at) < next && t.status === 'Credited',
    );
    result.push({
      day: d.toLocaleDateString('en', { month: 'short', day: 'numeric' }),
      earned: tx.reduce((sum, t) => sum + Math.max(0, t.amount), 0),
      activities: tx.length,
    });
  }
  return result;
}
export default function RewardChart({
  data,
  bars = false,
}: {
  data: ReturnType<typeof activitySeries>;
  bars?: boolean;
}) {
  const Chart = bars ? BarChart : AreaChart;
  return (
    <div
      className="chart"
      role="img"
      aria-label="Daily credited sample rewards chart. A table of the same values follows on the analytics page."
    >
      <ResponsiveContainer width="100%" height="100%">
        <Chart data={data} margin={{ top: 18, right: 12, left: -24, bottom: 0 }}>
          <defs>
            <linearGradient id="rewardFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fb681b" stopOpacity={0.22} />
              <stop offset="100%" stopColor="#fb681b" stopOpacity={0.01} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 5" vertical={false} stroke="var(--line)" />
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            minTickGap={28}
            tick={{ fill: 'var(--muted)', fontSize: 11 }}
            dy={10}
          />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--muted)', fontSize: 11 }} />
          <Tooltip
            contentStyle={{
              background: 'var(--surface)',
              border: '1px solid var(--line)',
              borderRadius: 12,
              color: 'var(--ink)',
            }}
            formatter={(v) => [`${v} VEs`, 'Demo rewards']}
          />
          {bars ? (
            <Bar
              dataKey="earned"
              fill="#fb681b"
              radius={[5, 5, 0, 0]}
              maxBarSize={36}
              isAnimationActive={false}
            />
          ) : (
            <Area
              type="monotone"
              dataKey="earned"
              stroke="#fb681b"
              strokeWidth={3}
              fill="url(#rewardFill)"
              dot={false}
              activeDot={{ r: 5, stroke: '#fff', strokeWidth: 3 }}
              isAnimationActive={false}
            />
          )}
        </Chart>
      </ResponsiveContainer>
    </div>
  );
}
