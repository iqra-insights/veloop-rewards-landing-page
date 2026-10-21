import { useEffect, useState, type CSSProperties } from 'react';
import { Zap, ArrowRight, Check, ShieldCheck, Clock3 } from 'lucide-react';
import { Badge, SectionTitle } from './ui';
import { useStore } from './store';
import { localDay } from './model';
export default function Session() {
  const { state, dispatch, notify } = useStore();
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(id);
  }, []);
  const session = state.session;
  const remaining = session ? Math.max(0, Math.ceil((Date.parse(session.end) - now) / 1000)) : 60;
  const doneToday = !!session?.claimed && localDay(new Date(session.start)) === localDay();
  const ready = !!session && !session.claimed && remaining === 0;
  const active = !!session && !session.claimed && remaining > 0;
  const progress = doneToday || ready ? 100 : active ? ((60 - remaining) / 60) * 100 : 0;
  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">A LITTLE MOMENT JUST FOR YOU</span>
          <h1>Slow down. Keep your loop growing.</h1>
          <p>A timed demonstration of the planned session-based reward experience.</p>
        </div>
        <Badge tone="green">
          <Clock3 size={13} />
          One demo session per local day
        </Badge>
      </div>
      <div className="two-col">
        <section className="panel session-center">
          <span className="eyebrow">YOUR LITTLE REWARD SESSION</span>
          <h2>One minute. One small moment.</h2>
          <div className="session-ring" style={{ '--progress': progress } as CSSProperties}>
            <div>
              {doneToday ? <Check size={35} /> : <Zap size={30} />}
              <strong>
                {doneToday
                  ? 'Done'
                  : `${String(Math.floor(remaining / 60)).padStart(2, '0')}:${String(remaining % 60).padStart(2, '0')}`}
              </strong>
              <span>
                {doneToday
                  ? 'You made a little time'
                  : ready
                    ? 'Your sample reward is ready'
                    : active
                      ? 'Your moment is in progress'
                      : 'Ready when you are'}
              </span>
            </div>
          </div>
          <div className="session-prize">
            <Badge tone="orange">125 sample VEs</Badge>
            <Badge tone="purple">+40 XP</Badge>
          </div>
          <p>
            {active
              ? 'You can explore other pages. The timer resumes from its saved end time when you return.'
              : doneToday
                ? 'Your session reward is in your wallet. Return tomorrow for another little moment.'
                : 'Take a moment to stretch, breathe or look away from the screen. No computation or mining runs in the background.'}
          </p>
          <button
            className="button primary full"
            disabled={active || doneToday}
            onClick={() => {
              if (ready) {
                dispatch({ type: 'session-claim', at: new Date().toISOString() });
                notify('Session complete · +125 sample VEs and 40 XP');
              } else {
                dispatch({ type: 'session-start', at: new Date().toISOString() });
                setNow(Date.now());
                notify('Your 60-second demo session has started');
              }
            }}
          >
            {doneToday ? (
              <>
                <Check size={17} />
                Session claimed today
              </>
            ) : active ? (
              <>
                <Clock3 size={17} />A little patience…
              </>
            ) : ready ? (
              <>
                Claim session reward
                <ArrowRight size={17} />
              </>
            ) : (
              <>
                Start a 60-second session
                <ArrowRight size={17} />
              </>
            )}
          </button>
        </section>
        <section className="panel">
          <SectionTitle
            title="A clear little explanation"
            description="Planned session mechanics, made tangible."
          />
          <ol className="numbered-steps">
            <li>
              <span>01</span>
              <div>
                <h3>Start your moment</h3>
                <p>The demo records a start and end time in your browser.</p>
              </div>
            </li>
            <li>
              <span>02</span>
              <div>
                <h3>Come back in a minute</h3>
                <p>The timer persists across page changes and reloads.</p>
              </div>
            </li>
            <li>
              <span>03</span>
              <div>
                <h3>Claim your small win</h3>
                <p>Collect a one-time virtual credit when the timer is complete.</p>
              </div>
            </li>
          </ol>
          <div className="notice">
            <ShieldCheck size={19} />
            <span>
              This represents the original “Mining” session concept. It does not mine
              cryptocurrency, use computing resources for rewards, or provide real earnings. Device
              time and local state are not tamper-proof; production verification belongs on the
              server.
            </span>
          </div>
        </section>
      </div>
    </>
  );
}
