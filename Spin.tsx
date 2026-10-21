import { useEffect, useRef, useState } from 'react';
import { Gift, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../store';
import { localDay } from '../model';
import { Badge } from '../components/ui';
const prizes = [25, 50, 75, 100, 150, 200];
export default function Spin() {
  const { state, dispatch, notify } = useStore();
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<number | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const busy = useRef(false);
  const used = state.spinDate === localDay();
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  function spin() {
    if (used || busy.current) return;
    busy.current = true;
    const values = new Uint32Array(1);
    crypto.getRandomValues(values);
    const index = values[0] % 6;
    const prize = prizes[index];
    setResult(null);
    setSpinning(true);
    setRotation(360 * 6 + 360 - (index * 60 + 30));
    timer.current = setTimeout(
      () => {
        dispatch({ type: 'spin', day: localDay(), prize, at: new Date().toISOString() });
        setResult(prize);
        setSpinning(false);
        busy.current = false;
        notify(`A little luck · +${prize} sample VEs`);
      },
      state.preferences.motion && !matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 3200
        : 50,
    );
  }
  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">A LITTLE SURPRISE FOR YOUR DAY</span>
          <h1>Give your day a little spin.</h1>
          <p>One free demo spin each local calendar day. A moment of possibility.</p>
        </div>
        <Badge tone="purple">
          <Gift size={13} />
          Just for fun
        </Badge>
      </div>
      <div className="spin-layout">
        <section className="panel spin-panel">
          <div className="spin-stars" aria-hidden="true">
            ✧ <span>✦</span> ✧
          </div>
          <div className="wheel-wrap">
            <div className="wheel-pointer" />
            <div
              className={'prize-wheel ' + (spinning ? 'spinning' : '')}
              style={{ transform: `rotate(${rotation}deg)` }}
            >
              {prizes.map((p, i) => (
                <span
                  key={p}
                  className="wheel-label"
                  style={{ transform: `rotate(${i * 60 + 30}deg)` }}
                >
                  <b>
                    {p}
                    <small>VEs</small>
                  </b>
                </span>
              ))}
            </div>
            <span className="wheel-center">
              <span className="brandmark">
                <span />
              </span>
            </span>
          </div>
          <div className="spin-result" aria-live="polite">
            {result || used ? (
              <>
                <h2>A little luck looks good on you.</h2>
                <p>
                  <b>+{result ?? state.spinResult} sample VEs</b> added to your wallet.
                </p>
              </>
            ) : (
              <>
                <h2>What will today bring?</h2>
                <p>Six possibilities. One little surprise.</p>
              </>
            )}
          </div>
          <button className="button primary spin-button" onClick={spin} disabled={spinning || used}>
            <Sparkles size={18} />
            {spinning
              ? 'A little luck is on its way…'
              : used
                ? 'Come back tomorrow'
                : 'Spin for a little surprise'}
          </button>
        </section>
        <div>
          <section className="panel">
            <span className="tile peach">
              <Gift size={26} />
            </span>
            <h2 className="spaced-small">A small surprise. A clear story.</h2>
            <p className="muted">
              This free demo spin awards between 25 and 200 virtual VEs. Each of the six segments is
              approximately equally likely.
            </p>
            <ul className="check-list">
              <li>
                <ShieldCheck size={17} />
                No payment or purchase
              </li>
              <li>
                <ShieldCheck size={17} />
                No cash or real-world prize
              </li>
              <li>
                <ShieldCheck size={17} />
                One spin per local day
              </li>
              <li>
                <ShieldCheck size={17} />
                Your result appears in your wallet
              </li>
            </ul>
            <div className="notice">
              <Sparkles size={18} />
              <span>
                All outcomes are simulated. This wheel is a frontend demonstration of a planned
                feature.
              </span>
            </div>
          </section>
          <div className="panel peach-card spaced">
            <h3>Make your own luck, too.</h3>
            <p>There are plenty of other ways to collect sample rewards.</p>
            <Link className="text-link" to="/app/earn">
              Discover an activity
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
