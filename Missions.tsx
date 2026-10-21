import { Link } from 'react-router-dom';
import { Target, Trophy, Check, ArrowRight, Lock, Flame, Sparkles } from 'lucide-react';
import { useStore } from './store';
import { milestones, streak } from './model';
import { Badge, SectionTitle } from './ui';
export default function Missions() {
  const { state, dispatch, notify } = useStore();
  const level = Math.floor(state.xp / 250) + 1;
  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">A LITTLE PURPOSE. A LITTLE PROGRESS.</span>
          <h1>Make progress your reward.</h1>
          <p>Turn small actions into milestones worth celebrating.</p>
        </div>
        <Badge tone="purple">
          <Trophy size={13} />
          Level {level} explorer
        </Badge>
      </div>
      <section className="mission-hero">
        <span className="mission-medal">
          <Trophy size={58} strokeWidth={1.2} />
        </span>
        <div>
          <span className="eyebrow">YOUR JOURNEY SO FAR</span>
          <h2>Look how far a little can go.</h2>
          <p>
            {state.xp} XP collected · {state.completed.length} activities completed
          </p>
          <div className="progress">
            <i style={{ width: `${((state.xp % 250) / 250) * 100}%` }} />
          </div>
          <small>
            {250 - (state.xp % 250)} XP until level {level + 1}
          </small>
        </div>
        <Link className="button secondary" to="/app/earn">
          Keep exploring
          <ArrowRight size={17} />
        </Link>
      </section>
      <SectionTitle
        title="Your next milestones"
        description="Complete activities, then claim each milestone reward once."
      />
      <div className="task-grid">
        {milestones.map((m) => {
          const redeemed = state.redeemed.includes(m.id),
            ready = state.completed.length >= m.target;
          return (
            <article className="panel milestone" key={m.id}>
              <div className="flex between">
                <span className={'tile ' + (redeemed ? 'green' : 'purple')}>
                  {redeemed ? <Check size={24} /> : <Target size={24} />}
                </span>
                <Badge tone={redeemed ? 'green' : ready ? 'orange' : 'neutral'}>
                  {redeemed ? 'Claimed' : ready ? 'Ready to claim' : 'In progress'}
                </Badge>
              </div>
              <h2>{m.title}</h2>
              <p>{m.description}</p>
              <div className="progress">
                <i
                  style={{ width: `${Math.min(100, (state.completed.length / m.target) * 100)}%` }}
                />
              </div>
              <div className="flex between tiny">
                <span>
                  {Math.min(state.completed.length, m.target)} / {m.target} activities
                </span>
                <b>{m.reward} VEs</b>
              </div>
              <button
                className={'button full ' + (ready ? 'primary' : 'secondary')}
                disabled={!ready || redeemed}
                onClick={() => {
                  dispatch({ type: 'milestone', id: m.id, at: new Date().toISOString() });
                  notify(`Milestone unlocked · +${m.reward} sample VEs`);
                }}
              >
                {redeemed ? (
                  <>
                    <Check size={17} />
                    Reward claimed
                  </>
                ) : ready ? (
                  <>
                    Claim milestone
                    <ArrowRight size={17} />
                  </>
                ) : (
                  <>
                    <Lock size={15} />
                    Keep exploring
                  </>
                )}
              </button>
            </article>
          );
        })}
      </div>
      <section className="panel spaced">
        <SectionTitle
          title="Your badge collection"
          description="Little reminders of the things you’ve made happen."
        />
        <div className="badge-collection">
          {[
            {
              name: 'First spark',
              icon: Sparkles,
              unlocked: state.completed.length > 0,
              hint: 'Complete one activity',
            },
            {
              name: 'Habit builder',
              icon: Flame,
              unlocked: streak(state.claims) >= 3,
              hint: 'Check in 3 days in a row',
            },
            {
              name: 'Curious mind',
              icon: Target,
              unlocked: state.completed.length >= 3,
              hint: 'Complete 3 activities',
            },
            {
              name: 'Full circle',
              icon: Trophy,
              unlocked: state.completed.length === 6,
              hint: 'Complete all activities',
            },
          ].map((b) => (
            <div className={b.unlocked ? 'unlocked' : ''} key={b.name}>
              <span>
                <b.icon size={32} strokeWidth={1.4} />
              </span>
              <h3>{b.name}</h3>
              <p>{b.unlocked ? 'Unlocked' : b.hint}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
