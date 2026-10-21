import { lazy, Suspense, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  Flame,
  Wallet,
  Gift,
  Check,
  Zap,
  Sparkles,
  ChevronRight,
  Clock3,
} from 'lucide-react';
import { useStore } from './store';
import { balance, number, pending, tasks, localDay, streak, type Task } from './model';
import { Badge, SectionTitle, TaskCard, TaskDialog } from './ui';
import { activitySeries } from './Chart';
const RewardChart = lazy(() => import('./Chart'));
export default function Overview() {
  const { state, dispatch, notify } = useStore();
  const [task, setTask] = useState<Task | null>(null);
  const [period, setPeriod] = useState(7);
  const today = localDay();
  const claimed = state.claims.includes(today);
  const days = streak(state.claims);
  const series = activitySeries(state, period);
  const total = series.reduce((a, d) => a + d.earned, 0);
  const recommended = [...tasks]
    .sort((a, b) => Number(state.completed.includes(a.id)) - Number(state.completed.includes(b.id)))
    .slice(0, 3);
  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">A LITTLE EVERY DAY. A LOT OVER TIME.</div>
          <h1>
            Good things are in your loop, {state.profile.name}
            <span className="wave"> ✦</span>
          </h1>
          <p>A new day. A fresh start. A few more reasons to keep going.</p>
        </div>
        <div className="date-chip">
          <span className="status-dot" />
          {new Date().toLocaleDateString('en', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
          })}
        </div>
      </div>
      <section className="overview-hero">
        <div>
          <Badge tone="glass">
            <Sparkles size={12} /> MAKE TODAY COUNT
          </Badge>
          <h2>
            Small actions.
            <br />
            <em>More possibilities.</em>
          </h2>
          <p>
            Your next reward is a little curiosity away.
            <br />
            Find something you love and make it count.
          </p>
          <Link className="button white" to="/app/earn">
            Explore & earn
            <ArrowUpRight size={18} />
          </Link>
        </div>
        <div className="hero-art" aria-hidden="true">
          <span className="art-orbit orbit-one" />
          <span className="art-orbit orbit-two" />
          <span className="art-spark s1">✦</span>
          <span className="art-spark s2">✧</span>
          <span className="art-spark s3">+</span>
          <div className="floating-mini">
            <span className="tile green">
              <Check size={18} />
            </span>
            <span>
              A little win<b>Reward credited</b>
            </span>
          </div>
          <div className="big-coin">
            v<span>✦</span>
          </div>
          <div className="small-coin">v</div>
          <div className="floating-xp">
            <Zap size={17} fill="currentColor" /> +40 XP <span>Keep growing</span>
          </div>
        </div>
      </section>
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-icon peach">
            <Wallet size={21} />
          </span>
          <span className="stat-label">Available balance</span>
          <strong>
            {number(balance(state))}
            <small>VEs</small>
          </strong>
          <span className="stat-foot">
            <span className="green-text">Ready for your next move</span>
            <Link to="/app/wallet" aria-label="Open wallet">
              <ArrowUpRight size={16} />
            </Link>
          </span>
        </div>
        <div className="stat-card">
          <span className="stat-icon purple">
            <Clock3 size={21} />
          </span>
          <span className="stat-label">Pending rewards</span>
          <strong>
            {number(pending(state))}
            <small>VEs</small>
          </strong>
          <span className="stat-foot">Waiting for sample confirmation</span>
        </div>
        <div className="stat-card">
          <span className="stat-icon green">
            <Check size={21} />
          </span>
          <span className="stat-label">Tasks completed</span>
          <strong>
            {state.completed.length}
            <small>/ 6</small>
          </strong>
          <span className="stat-foot">Every little action matters</span>
        </div>
        <div className="stat-card">
          <span className="stat-icon yellow">
            <Flame size={21} />
          </span>
          <span className="stat-label">Current streak</span>
          <strong>
            {days}
            <small>{days === 1 ? 'day' : 'days'}</small>
          </strong>
          <span className="stat-foot">
            {claimed ? 'You showed up today. Nice work.' : 'Start your streak with a check-in'}
          </span>
        </div>
      </div>
      <div className="overview-middle">
        <section className="panel earning-panel">
          <SectionTitle
            title="Your reward rhythm"
            description="Small wins, building up over time."
            action={
              <select
                aria-label="Reward chart period"
                className="select compact"
                value={period}
                onChange={(e) => setPeriod(Number(e.target.value))}
              >
                <option value={7}>Last 7 days</option>
                <option value={30}>Last 30 days</option>
              </select>
            }
          />
          <div className="chart-total">
            {number(total)} <span>VEs credited</span>
            <Badge tone="green">Sample ledger</Badge>
          </div>
          <Suspense fallback={<div className="chart loading">Loading your reward rhythm…</div>}>
            <RewardChart data={series} />
          </Suspense>
          <div className="chart-footer">
            <span>
              <i />
              Credited rewards
            </span>
            <Link to="/app/analytics">
              View analytics <ArrowUpRight size={14} />
            </Link>
          </div>
        </section>
        <section className="panel daily-panel">
          <div className="flex between">
            <span className="tile peach">
              <Flame size={23} />
            </span>
            <Badge tone="orange">Daily check-in</Badge>
          </div>
          <h2>Keep your spark alive.</h2>
          <p>Show up for yourself. A little consistency goes a long way.</p>
          <div className="week-days">
            {Array.from({ length: 7 }, (_, i) => {
              const date = new Date();
              date.setDate(date.getDate() - 6 + i);
              const checked = state.claims.includes(localDay(date));
              return (
                <div className={checked ? 'checked' : ''} key={i} title={date.toLocaleDateString()}>
                  <span>{date.toLocaleDateString('en', { weekday: 'narrow' })}</span>
                  <b>{checked ? <Check size={15} /> : date.getDate()}</b>
                </div>
              );
            })}
          </div>
          <div className="daily-prize">
            <span className="coin">v</span>
            <b>
              50 VEs <small>+25 XP</small>
            </b>
            <Sparkles size={20} />
          </div>
          <button
            className="button primary full"
            disabled={claimed}
            onClick={() => {
              dispatch({ type: 'claim', day: today, at: new Date().toISOString() });
              notify('Daily check-in complete · +50 sample VEs');
            }}
          >
            {claimed ? (
              <>
                <Check size={17} />
                Checked in today
              </>
            ) : (
              <>
                Claim daily reward
                <ArrowRight size={17} />
              </>
            )}
          </button>
          <small className="daily-note">Once per local calendar day · Demo points</small>
        </section>
      </div>
      <section className="recommended">
        <SectionTitle
          title="A little something for you"
          description="Good opportunities. Pick your next small win."
          action={
            <Link className="text-link" to="/app/earn">
              Explore all tasks <ArrowRight size={16} />
            </Link>
          }
        />
        <div className="task-grid">
          {recommended.map((t) => (
            <TaskCard key={t.id} task={t} onOpen={setTask} />
          ))}
        </div>
      </section>
      <section className="referral-banner">
        <span className="referral-art">
          <Gift size={34} />
          <i>✦</i>
        </span>
        <div>
          <Badge tone="purple">BETTER TOGETHER</Badge>
          <h2>Good things are better shared.</h2>
          <p>Explore referrals and grow your circle, one connection at a time.</p>
        </div>
        <Link className="button secondary" to="/app/referrals">
          Invite your people
          <ChevronRight size={18} />
        </Link>
      </section>
      {task && <TaskDialog task={task} close={() => setTask(null)} />}
    </>
  );
}
