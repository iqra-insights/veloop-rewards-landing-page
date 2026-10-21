import { useState } from 'react';
import {
  Download,
  RefreshCw,
  ShieldCheck,
  User,
  Check,
  Moon,
  Sun,
  Bell,
  Zap,
  ArrowUpRight,
} from 'lucide-react';
import { useStore } from './store';
import { download } from './model';
import { Modal, SectionTitle, Badge } from './ui';
export default function Settings() {
  const { state, dispatch, notify } = useStore();
  const [name, setName] = useState(state.profile.name);
  const [goal, setGoal] = useState(state.profile.goal);
  const [reset, setReset] = useState(false);
  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">MAKE THIS LITTLE CORNER YOURS</span>
          <h1>Your loop. Your way.</h1>
          <p>A few small preferences for a more personal demo experience.</p>
        </div>
        <Badge tone="neutral">
          <ShieldCheck size={13} />
          Browser-only profile
        </Badge>
      </div>
      <div className="settings-grid">
        <section className="panel">
          <SectionTitle
            title="Your demo profile"
            description="Use a sample name. No login or identity verification is involved."
          />
          <div className="profile-preview">
            <span className="avatar large">{state.profile.name[0].toUpperCase()}</span>
            <div>
              <h3>{state.profile.name}</h3>
              <span className="muted">Demo explorer · Level {Math.floor(state.xp / 250) + 1}</span>
            </div>
            <User size={23} />
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              dispatch({ type: 'profile', name, goal });
              notify('Demo profile updated');
            }}
          >
            <label className="field">
              Display name
              <input
                required
                maxLength={50}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your demo name"
              />
            </label>
            <label className="field">
              A little goal for yourself
              <textarea
                rows={3}
                maxLength={150}
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
              />
            </label>
            <button className="button primary" type="submit">
              <Check size={17} />
              Save changes
            </button>
          </form>
        </section>
        <section className="panel">
          <SectionTitle
            title="Your preferences"
            description="Changes apply immediately to this browser."
          />
          <div className="setting-row">
            <span className="tile purple">
              {state.preferences.theme === 'dark' ? <Moon size={21} /> : <Sun size={21} />}
            </span>
            <div>
              <h3>Dark appearance</h3>
              <p>A different mood for your daily loop.</p>
            </div>
            <button
              className="switch"
              role="switch"
              aria-label="Dark appearance"
              aria-checked={state.preferences.theme === 'dark'}
              onClick={() =>
                dispatch({
                  type: 'preferences',
                  value: { theme: state.preferences.theme === 'dark' ? 'light' : 'dark' },
                })
              }
            >
              <i />
            </button>
          </div>
          <div className="setting-row">
            <span className="tile peach">
              <Zap size={21} />
            </span>
            <div>
              <h3>Motion effects</h3>
              <p>Your device’s reduced-motion setting takes priority.</p>
            </div>
            <button
              className="switch"
              role="switch"
              aria-label="Motion effects"
              aria-checked={state.preferences.motion}
              onClick={() =>
                dispatch({ type: 'preferences', value: { motion: !state.preferences.motion } })
              }
            >
              <i />
            </button>
          </div>
          <div className="setting-row">
            <span className="tile green">
              <Bell size={21} />
            </span>
            <div>
              <h3>Sample email preference</h3>
              <p>Saved locally. No emails are collected or sent.</p>
            </div>
            <button
              className="switch"
              role="switch"
              aria-label="Sample email preference"
              aria-checked={state.preferences.email}
              onClick={() =>
                dispatch({ type: 'preferences', value: { email: !state.preferences.email } })
              }
            >
              <i />
            </button>
          </div>
          <div className="notice">
            <ShieldCheck size={18} />
            <span>
              Demo progress is saved in this browser. It is not a secure account or a production
              wallet.
            </span>
          </div>
        </section>
        <section className="panel">
          <SectionTitle
            title="Your demo data"
            description="Take a copy of your local sample workspace."
          />
          <button
            className="button secondary"
            onClick={() => {
              download(
                'veloop-demo-workspace.json',
                JSON.stringify(state, null, 2),
                'application/json',
              );
              notify('Demo workspace exported');
            }}
          >
            <Download size={17} />
            Export workspace JSON
          </button>
          <p className="tiny muted spaced-small">
            Includes your local profile, preferences, sample ledger, events and demo support
            requests. Keep this export private if you entered personal text.
          </p>
        </section>
        <section className="panel reset-panel">
          <SectionTitle
            title="A fresh little start"
            description="Reset progress and restore the original sample workspace."
          />
          <button className="button danger" onClick={() => setReset(true)}>
            <RefreshCw size={17} />
            Reset demo
          </button>
          <p className="tiny muted spaced-small">
            Removes local task progress, requests, preferences and the waitlist example.
          </p>
        </section>
      </div>
      {reset && (
        <Modal title="Start a fresh demo?" close={() => setReset(false)}>
          <p>
            Your current local progress will be replaced by the original sample workspace. Export it
            first if you want to keep a copy.
          </p>
          <div className="modal-actions">
            <button className="button secondary" onClick={() => setReset(false)}>
              Keep exploring
            </button>
            <button
              className="button danger"
              onClick={() => {
                try {
                  localStorage.removeItem('veloop-waitlist-demo');
                } catch {
                  /* storage unavailable */
                }
                dispatch({ type: 'reset' });
                setName('Alex');
                setGoal('Build a rewarding daily habit');
                setReset(false);
                notify('Fresh start · Demo workspace reset');
              }}
            >
              Reset demo
              <ArrowUpRight size={17} />
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
