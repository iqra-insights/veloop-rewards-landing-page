import { useState } from 'react';
import { Users, Copy, Check, Gift, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { useStore } from '../store';
import { number } from '../model';
import { Badge, SectionTitle, Modal } from '../components/ui';
export default function Referrals() {
  const { state, dispatch, notify } = useStore();
  const [manual, setManual] = useState(false);
  const [simulate, setSimulate] = useState(false);
  const code = 'VELOOP-DEMO';
  const link =
    import.meta.env.MODE === 'standalone'
      ? window.location.href.split('#')[0] + '#/?ref=' + code
      : new URL('/?ref=' + code, window.location.origin).href;
  async function copy() {
    try {
      await navigator.clipboard.writeText(link);
      notify('Demo referral link copied');
    } catch {
      setManual(true);
    }
  }
  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">BETTER WITH YOUR PEOPLE</span>
          <h1>Bring your circle into the loop.</h1>
          <p>Good discoveries are even better when you share them.</p>
        </div>
        <Badge tone="purple">
          <Users size={13} />
          Demo referral program
        </Badge>
      </div>
      <section className="referral-hero">
        <div>
          <Badge tone="purple">A LITTLE INVITE. A NEW POSSIBILITY.</Badge>
          <h2>
            More connections.
            <br />
            <em>More little wins.</em>
          </h2>
          <p>
            Try the planned referral journey. A sample activation
            <br />
            adds 250 virtual VEs to your demo wallet.
          </p>
          <button className="button primary" onClick={copy}>
            <Copy size={17} />
            Copy demo invite link
          </button>
        </div>
        <div className="people-art" aria-hidden="true">
          <span>A</span>
          <span>K</span>
          <span>You</span>
          <span>M</span>
          <span>J</span>
          <div className="people-center">
            <Users size={50} strokeWidth={1.2} />
          </div>
          <i>✦</i>
        </div>
      </section>
      <div className="stats-grid three">
        <div className="stat-card">
          <span className="stat-label">Sample activations</span>
          <strong>
            {state.referrals}
            <small>friends</small>
          </strong>
          <span className="stat-foot">Fictional demo activity</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Referral credits</span>
          <strong>
            {number(
              state.transactions
                .filter((t) => t.kind === 'referral' && t.status === 'Credited')
                .reduce((a, t) => a + t.amount, 0),
            )}
            <small>VEs</small>
          </strong>
          <span className="stat-foot">Included in your sample wallet</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Sample reward per activation</span>
          <strong>
            250<small>VEs</small>
          </strong>
          <span className="stat-foot">Illustrative only · Final rules unannounced</span>
        </div>
      </div>
      <div className="two-col">
        <section className="panel">
          <SectionTitle
            title="Your demo invitation"
            description="Copy a link to this prototype. No referral attribution is recorded."
          />
          <label className="field">
            Demo referral code
            <div className="copy-field">
              <input readOnly value={code} />
              <button className="icon-button" aria-label="Copy referral link" onClick={copy}>
                <Copy size={19} />
              </button>
            </div>
          </label>
          <div className="notice">
            <ShieldCheck size={18} />
            <span>
              A real referral requires server-side attribution and verified qualifying activity.
              This prototype only simulates that journey.
            </span>
          </div>
          <button
            className="button secondary full"
            disabled={state.referrals >= 4}
            onClick={() => setSimulate(true)}
          >
            <Sparkles size={17} />
            {state.referrals >= 4
              ? 'All sample activations explored'
              : 'Simulate a friend’s activation'}
          </button>
        </section>
        <section className="panel">
          <SectionTitle title="How the planned loop works" />
          <ol className="numbered-steps">
            <li>
              <span>01</span>
              <div>
                <h3>Share your invitation</h3>
                <p>Let a friend discover VELOOP.</p>
              </div>
            </li>
            <li>
              <span>02</span>
              <div>
                <h3>They join and take part</h3>
                <p>Registration alone is not a qualifying activation.</p>
              </div>
            </li>
            <li>
              <span>03</span>
              <div>
                <h3>Qualifying activity is verified</h3>
                <p>Rewards follow the published program rules.</p>
              </div>
            </li>
          </ol>
        </section>
      </div>
      <section className="panel spaced">
        <SectionTitle title="Your sample circle" />
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Demo explorer</th>
                <th>Activation</th>
                <th className="right">Sample reward</th>
              </tr>
            </thead>
            <tbody>
              {['Jamie', 'Morgan', 'Casey', 'Taylor'].slice(0, state.referrals).map((n) => (
                <tr key={n}>
                  <td>
                    <div className="transaction-name">
                      <span className="avatar purple">{n[0]}</span>
                      <b>
                        {n} <small className="muted">· fictional</small>
                      </b>
                    </div>
                  </td>
                  <td>
                    <Badge tone="green">
                      <Check size={12} />
                      Active
                    </Badge>
                  </td>
                  <td className="right green-text">+250 VEs</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      {manual && (
        <Modal title="Copy your demo link" close={() => setManual(false)}>
          <p>Your browser could not access the clipboard. Select and copy this link.</p>
          <input
            className="copy-input"
            readOnly
            value={link}
            onFocus={(e) => e.target.select()}
            aria-label="Demo referral link"
          />
        </Modal>
      )}
      {simulate && (
        <Modal title="Try a sample activation" close={() => setSimulate(false)}>
          <span className="tile purple">
            <Gift size={28} />
          </span>
          <p>
            This adds one fictional active friend and 250 virtual VEs. No person is invited or
            contacted.
          </p>
          <button
            className="button primary full"
            onClick={() => {
              dispatch({ type: 'referral', at: new Date().toISOString() });
              notify('Sample friend activated · +250 demo VEs');
              setSimulate(false);
            }}
          >
            Simulate activation
            <ArrowRight size={17} />
          </button>
        </Modal>
      )}
    </>
  );
}
