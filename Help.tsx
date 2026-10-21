import { useState } from 'react';
import {
  Search,
  Mail,
  ShieldCheck,
  ArrowRight,
  MessageCircle,
  Check,
  CircleHelp,
} from 'lucide-react';
import { Badge, Empty, SectionTitle } from './ui';
import { useStore } from './store';
const faqs = [
  {
    category: 'Getting started',
    q: 'Is this a live rewards platform?',
    a: 'This is an interactive React prototype. All rewards, transactions, referrals and other people shown are simulated. There is no production account, partner integration or payout service.',
  },
  {
    category: 'Getting started',
    q: 'Where does my progress go?',
    a: 'Your demo progress is stored in localStorage in this browser. It is not synchronized between browsers or devices. Private browsing or clearing browser data may remove it. Use Settings to export a copy or reset it.',
  },
  {
    category: 'Rewards',
    q: 'How do I collect demo VEs?',
    a: 'Complete each sample activity once, claim a daily check-in, try one spin per local calendar day, or unlock mission milestones. Your sample wallet and XP update as you explore.',
  },
  {
    category: 'Rewards',
    q: 'Why is my reward pending?',
    a: 'The initial sample partner reward illustrates a verification delay. Pending points are excluded from your available balance. There is no live partner callback in this prototype.',
  },
  {
    category: 'Wallet',
    q: 'Can I withdraw real money?',
    a: 'No. VEs have no cash value in this prototype. A demo redemption reserves points locally and appears as Under review. You can cancel it from transaction details to release the points.',
  },
  {
    category: 'Wallet',
    q: 'What are VEs, XP, Gems and Tokens?',
    a: 'VEs are the virtual reward unit used in this demo; XP measures progress. Gems and Tokens are planned product units and are not assigned exchange values or balances here. Final rules have not been announced.',
  },
  {
    category: 'Wallet',
    q: 'What is the demo redemption minimum?',
    a: 'This prototype uses an illustrative minimum of 100 whole VEs. It is a demo rule, not an announced VELOOP withdrawal policy.',
  },
  {
    category: 'Referrals',
    q: 'Does copying a link send an invitation?',
    a: 'No. Copying places a prototype link on your clipboard. The Simulate activation button adds a fictional friend and a local sample credit. Real attribution requires a backend and verified qualifying activity.',
  },
  {
    category: 'Privacy',
    q: 'Does this demo send analytics or personal data?',
    a: 'No analytics service is connected. Local events contain only an event name and timestamp. Profile preferences, demo tickets and the optional waitlist example remain in your browser.',
  },
  {
    category: 'Privacy',
    q: 'Is the waitlist connected?',
    a: 'No. The waitlist saves a local-only signup example after you explicitly select its consent checkbox. It does not subscribe you or send launch notifications.',
  },
  {
    category: 'Getting started',
    q: 'How do streaks and spins reset?',
    a: 'Daily actions use your device’s local calendar date. The streak counts consecutive checked-in days including today, or ending yesterday if you have not checked in yet. Spin rewards are limited to one per local day.',
  },
  {
    category: 'Privacy',
    q: 'How do I delete the demo data?',
    a: 'Open Settings and choose Reset demo. This resets the sample workspace and removes the local waitlist entry. You can also clear this site’s data in your browser settings.',
  },
];
export default function Help() {
  const { state, dispatch, notify } = useStore();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All topics');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const filtered = faqs.filter(
    (f) =>
      (category === 'All topics' || f.category === category) &&
      `${f.q} ${f.a}`.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">A LITTLE HELP GOES A LONG WAY</span>
          <h1>Let’s make things a little clearer.</h1>
          <p>Find an answer, understand a feature or explore a sample support request.</p>
        </div>
        <Badge tone="green">
          <CircleHelp size={13} />
          Here to help
        </Badge>
      </div>
      <div className="help-search">
        <MessageCircle size={32} />
        <h2>What’s on your mind?</h2>
        <div className="input-search">
          <Search size={20} />
          <input
            aria-label="Search help"
            placeholder="Try “withdrawal”, “privacy” or “streak”…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>
      <div className="tabs spaced" aria-label="Help topics">
        {['All topics', 'Getting started', 'Rewards', 'Wallet', 'Referrals', 'Privacy'].map((c) => (
          <button
            key={c}
            aria-pressed={category === c}
            onClick={() => setCategory(c)}
            className={category === c ? 'active' : ''}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="help-layout">
        <section className="panel faq-list">
          {filtered.length ? (
            filtered.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))
          ) : (
            <Empty
              title="Let’s try another question"
              description="No answers match that search. Try a broader word."
            />
          )}
        </section>
        <section className="panel support-card">
          <span className="tile purple">
            <Mail size={23} />
          </span>
          <SectionTitle
            title="Practice a support request"
            description="A local-only example. It is not sent to a support team."
          />
          <form
            onSubmit={(e) => {
              e.preventDefault();
              dispatch({ type: 'ticket', subject, message, at: new Date().toISOString() });
              setSubject('');
              setMessage('');
              notify('Demo request saved in this browser · Not sent');
            }}
          >
            <label className="field">
              Subject
              <input
                required
                maxLength={100}
                placeholder="What can we clear up?"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </label>
            <label className="field">
              Your question
              <textarea
                required
                minLength={10}
                maxLength={2000}
                rows={4}
                placeholder="Describe a sample issue. Avoid personal or payment details."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </label>
            <button className="button primary full" type="submit">
              Save demo request
              <ArrowRight size={17} />
            </button>
          </form>
          <p className="tiny muted">
            <ShieldCheck size={13} />
            Stored on this device only.
          </p>
        </section>
      </div>
      {state.tickets.length > 0 && (
        <section className="panel spaced">
          <SectionTitle title="Your local demo requests" />
          {state.tickets.map((t) => (
            <details className="ticket" key={t.id}>
              <summary>
                <span>
                  {t.id} · {t.subject}
                </span>
                <Badge tone="neutral">
                  <Check size={12} />
                  Local only
                </Badge>
              </summary>
              <p>{t.message}</p>
              <small>{new Date(t.at).toLocaleString()}</small>
            </details>
          ))}
        </section>
      )}
    </>
  );
}
