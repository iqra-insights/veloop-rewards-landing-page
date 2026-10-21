import { useState } from 'react';
import { Download, BarChart3, Info, ArrowUpRight } from 'lucide-react';
import { useStore } from '../store';
import { earned, number, csv, download, tasks } from '../model';
import RewardChart, { activitySeries } from '../components/Chart';
import { Badge, SectionTitle } from '../components/ui';
export default function Analytics() {
  const { state, notify } = useStore();
  const [period, setPeriod] = useState(7);
  const [bars, setBars] = useState(false);
  const data = activitySeries(state, period);
  const total = data.reduce((s, d) => s + d.earned, 0);
  const withdrawals = state.transactions.filter((t) => t.kind === 'withdrawal');
  const underReview = withdrawals.filter((t) => t.status === 'Under review');
  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">YOUR PROGRESS, A LITTLE CLEARER</span>
          <h1>See the story in your small wins.</h1>
          <p>Explore your demo activity. Every number comes from your local sample ledger.</p>
        </div>
        <button
          className="button secondary"
          onClick={() => {
            download(
              'veloop-demo-analytics.csv',
              csv([
                ['Date', 'Credited VEs', 'Credit entries'],
                ...data.map((d) => [d.day, d.earned, d.activities]),
              ]),
            );
            notify('Sample analytics exported');
          }}
        >
          <Download size={17} />
          Export data
        </button>
      </div>
      <div className="notice">
        <Info size={18} />
        <span>
          <b>SIMULATED DATA.</b> This is personal demo activity, not company performance. Seeded
          credits and your interactions are included. No production data is connected.
        </span>
      </div>
      <div className="stats-grid spaced">
        <div className="stat-card">
          <span className="stat-label">Credited in period</span>
          <strong>
            {number(total)}
            <small>VEs</small>
          </strong>
          <span className="stat-foot">Sum of credited positive entries</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Activity completion</span>
          <strong>
            {Math.round((state.completed.length / tasks.length) * 100)}
            <small>%</small>
          </strong>
          <span className="stat-foot">
            {state.completed.length} of {tasks.length} demo tasks
          </span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Total experience</span>
          <strong>
            {number(state.xp)}
            <small>XP</small>
          </strong>
          <span className="stat-foot">Seed XP + earned demo XP</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Requests under review</span>
          <strong>{underReview.length}</strong>
          <span className="stat-foot">
            {number(-underReview.reduce((a, t) => a + t.amount, 0))} sample VEs reserved
          </span>
        </div>
      </div>
      <section className="panel">
        <SectionTitle
          title="Your reward rhythm"
          description="Credited virtual rewards by local calendar day."
          action={
            <div className="flex">
              <div className="segmented">
                <button onClick={() => setBars(false)} className={!bars ? 'active' : ''}>
                  Area
                </button>
                <button onClick={() => setBars(true)} className={bars ? 'active' : ''}>
                  Bars
                </button>
              </div>
              <select
                className="select compact"
                aria-label="Analytics period"
                value={period}
                onChange={(e) => setPeriod(Number(e.target.value))}
              >
                <option value={7}>Last 7 days</option>
                <option value={30}>Last 30 days</option>
              </select>
            </div>
          }
        />
        <RewardChart data={data} bars={bars} />
        <details className="data-details">
          <summary>View chart data as a table</summary>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Credited VEs</th>
                  <th>Credit entries</th>
                </tr>
              </thead>
              <tbody>
                {data.map((d) => (
                  <tr key={d.day}>
                    <td>{d.day}</td>
                    <td>{number(d.earned)}</td>
                    <td>{d.activities}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      </section>
      <div className="two-col spaced">
        <section className="panel">
          <SectionTitle
            title="Where your rewards come from"
            description="All-time credited demo rewards by source."
          />
          {[
            { name: 'Activities & check-ins', kind: 'reward', color: 'orange' },
            { name: 'Referrals', kind: 'referral', color: 'purple' },
            { name: 'Lucky spin', kind: 'spin', color: 'green' },
          ].map((g) => {
            const val = state.transactions
              .filter((t) => t.kind === g.kind && t.status === 'Credited')
              .reduce((a, t) => a + t.amount, 0);
            return (
              <div className="source-row" key={g.kind}>
                <div className="flex between">
                  <span>{g.name}</span>
                  <b>{number(val)} VEs</b>
                </div>
                <div className={'progress ' + g.color}>
                  <i style={{ width: `${earned(state) ? (val / earned(state)) * 100 : 0}%` }} />
                </div>
              </div>
            );
          })}
          <div className="tiny muted">Excludes pending rewards and reserved redemptions.</div>
        </section>
        <section className="panel">
          <SectionTitle
            title="Tracking that makes sense"
            description="Local demo events, without names or email addresses."
          />
          <div className="event-list">
            {state.events.length ? (
              state.events.slice(0, 5).map((e, i) => (
                <div key={e.at + i}>
                  <span className="tile peach">
                    <BarChart3 size={17} />
                  </span>
                  <span>
                    <b>{e.name.replaceAll('_', ' ')}</b>
                    <small>{new Date(e.at).toLocaleString()}</small>
                  </span>
                  <Badge tone="green">Recorded</Badge>
                </div>
              ))
            ) : (
              <div className="empty">
                <BarChart3 size={29} />
                <p>Complete an activity to see a local event here.</p>
              </div>
            )}
          </div>
          <p className="tiny muted">
            Stored only in this browser; nothing is sent to an analytics service.
          </p>
        </section>
      </div>
      <section className="panel spaced">
        <SectionTitle title="Definitions you can trust" />
        <div className="definition-grid">
          <div>
            <Badge tone="orange">Available balance</Badge>
            <p>Credited ledger entries minus points reserved by active demo redemptions.</p>
          </div>
          <div>
            <Badge tone="purple">Task completion</Badge>
            <p>Unique completed demo tasks divided by the six available demo tasks.</p>
          </div>
          <div>
            <Badge tone="green">Credited in period</Badge>
            <p>Positive credited entries whose timestamp falls within the selected local days.</p>
          </div>
        </div>
        <a
          className="text-link"
          href="https://github.com/iqra-insights/veloop-rewards-analytics-blueprint"
          target="_blank"
          rel="noreferrer"
        >
          Explore the original analytics blueprint
          <ArrowUpRight size={16} />
        </a>
      </section>
    </>
  );
}
