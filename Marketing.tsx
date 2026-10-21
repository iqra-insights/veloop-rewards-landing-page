import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  Check,
  ShieldCheck,
  Flame,
  Gift,
  Wallet,
  Users,
  Target,
  Menu,
  X,
  Play,
  Compass,
  BarChart3,
  Clock3,
  Zap,
  Mail,
} from 'lucide-react';
import { Logo, Badge, Modal, Icon } from '../components/ui';
import { tasks } from '../model';
import { useStore } from '../store';
function PublicHeader() {
  const [menu, setMenu] = useState(false);
  const [entry, setEntry] = useState(false);
  const [name, setName] = useState('');
  const { dispatch } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    setMenu(false);
  }, [location.pathname]);
  return (
    <>
      <header className="public-header">
        <div className="public-container">
          <Logo />
          <nav className={menu ? 'open' : ''} aria-label="Website navigation">
            <Link to="/features">Explore VELOOP</Link>
            <Link to="/rewards-wallet">Rewards & wallet</Link>
            <Link to="/about">Our story</Link>
            <Link to="/help">Help center</Link>
          </nav>
          <div className="public-actions">
            <button className="public-signin" onClick={() => setEntry(true)}>
              Enter demo
            </button>
            <Link className="button primary" to="/app">
              Find your loop
              <ArrowUpRight size={16} />
            </Link>
            <button
              className="icon-button public-mobile"
              aria-label={menu ? 'Close menu' : 'Open menu'}
              onClick={() => setMenu(!menu)}
              aria-expanded={menu}
            >
              {menu ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>
      {entry && (
        <Modal title="A little introduction" close={() => setEntry(false)}>
          <span className="tile peach">
            <Sparkles size={28} />
          </span>
          <p>
            Explore the full demo with a sample name. No password, account or real rewards are
            involved.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (name.trim()) dispatch({ type: 'profile', name, goal: 'Explore something new' });
              setEntry(false);
              navigate('/app');
            }}
          >
            <label className="field">
              Demo display name <span className="muted">(optional)</span>
              <input
                value={name}
                maxLength={50}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex"
                autoComplete="off"
              />
            </label>
            <p className="tiny muted">Your demo profile and activity stay in this browser.</p>
            <button className="button primary full" type="submit">
              Step into the demo
              <ArrowRight size={18} />
            </button>
          </form>
        </Modal>
      )}
    </>
  );
}
function PublicFooter() {
  return (
    <footer className="public-footer">
      <div className="public-container">
        <div className="footer-top">
          <div>
            <Logo />
            <p>
              A little curiosity.
              <br />A lot of possibility.
            </p>
            <Badge tone="neutral">In development · Interactive prototype</Badge>
          </div>
          <div>
            <h3>Find your loop</h3>
            <Link to="/features">Ways to take part</Link>
            <Link to="/rewards-wallet">Rewards & wallet</Link>
            <Link to="/app/missions">Missions & progress</Link>
            <Link to="/app/analytics">Demo analytics</Link>
          </div>
          <div>
            <h3>A little more</h3>
            <Link to="/about">Our story</Link>
            <Link to="/help">Help center</Link>
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Demo terms</Link>
          </div>
          <div>
            <h3>Keep exploring</h3>
            <a
              href="https://github.com/iqra-insights/veloop-rewards-landing-page"
              target="_blank"
              rel="noreferrer"
            >
              Original project
              <ArrowUpRight size={14} />
            </a>
            <a
              href="https://github.com/iqra-insights/veloop-rewards-analytics-blueprint"
              target="_blank"
              rel="noreferrer"
            >
              Analytics blueprint
              <ArrowUpRight size={14} />
            </a>
            <Link className="button secondary" to="/app">
              Try the demo
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} VELOOP Rewards · Demo experience</span>
          <span>All rewards and performance data are simulated.</span>
          <span>
            Made for the little everyday wins <span className="orange-text">✦</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
export function PhonePreview() {
  return (
    <div className="phone-scene" aria-label="Illustrative wallet preview with 1,250 sample VEs">
      <div className="scene-ring r1" />
      <div className="scene-ring r2" />
      <span className="scene-spark ss1">✦</span>
      <span className="scene-spark ss2">✧</span>
      <div className="preview-phone">
        <div className="phone-notch" />
        <div className="phone-top">
          <b>9:41</b>
          <span>••• ▰</span>
        </div>
        <div className="phone-app-head">
          <span>
            <small>A little more rewarding</small>
            <b>
              Hey, explorer <span>✦</span>
            </b>
          </span>
          <span className="avatar">A</span>
        </div>
        <div className="preview-balance">
          <span>YOUR LITTLE WINS, ADDING UP</span>
          <h3>
            1,250 <small>VEs</small>
          </h3>
          <div>
            <span>
              <i />
              Sample balance
            </span>
            <ArrowUpRight size={20} />
          </div>
        </div>
        <div className="phone-stats">
          <div>
            <Flame size={19} />
            <b>5 days</b>
            <small>Sample streak</small>
          </div>
          <div>
            <Zap size={19} />
            <b>640 XP</b>
            <small>Little by little</small>
          </div>
        </div>
        <div className="phone-section-head">
          <b>Your next little win</b>
          <ArrowRight size={15} />
        </div>
        <div className="phone-task">
          <span className="tile purple">
            <Compass size={20} />
          </span>
          <div>
            <b>Discover something new</b>
            <small>3 min · Just a little curiosity</small>
          </div>
          <span>+150</span>
        </div>
        <div className="phone-task">
          <span className="tile green">
            <Gift size={20} />
          </span>
          <div>
            <b>Your daily moment</b>
            <small>Show up. Keep growing.</small>
          </div>
          <span>+50</span>
        </div>
        <div className="phone-nav">
          <span>
            <Compass size={19} />
            Explore
          </span>
          <span>
            <Wallet size={19} />
            Wallet
          </span>
          <span>
            <Users size={19} />
            Circle
          </span>
          <span>
            <Target size={19} />
            Progress
          </span>
        </div>
        <p className="phone-sample">ILLUSTRATIVE INTERFACE · NO REAL REWARDS</p>
      </div>
      <div className="phone-floating float-reward">
        <span className="tile green">
          <Check size={22} />
        </span>
        <span>
          A little win for you
          <b>
            Reward credited <span>+150 VEs</span>
          </b>
        </span>
      </div>
      <div className="phone-floating float-streak">
        <Flame size={27} />
        <div>
          <b>Keep your spark alive</b>
          <small>A little consistency. A lot of momentum.</small>
        </div>
      </div>
      <div className="scene-small-coin">v</div>
    </div>
  );
}
function Waitlist() {
  const { notify } = useStore();
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  return (
    <section className="waitlist-section" id="waitlist">
      <div className="public-container">
        <div>
          <Badge tone="glass">
            <Sparkles size={12} />
            THE NEXT CHAPTER IS COMING
          </Badge>
          <h2>
            Be a little early.
            <br />
            <em>See what comes next.</em>
          </h2>
          <p>The product is in development. Explore a local-only waitlist example.</p>
        </div>
        <div className="waitlist-form-wrap">
          {saved ? (
            <div className="waitlist-success" role="status">
              <Check size={32} />
              <h3>Your example signup is saved locally.</h3>
              <p>You are not subscribed. No email or launch notification will be sent.</p>
              <button className="button white" onClick={() => setSaved(false)}>
                Try again
                <ArrowRight size={17} />
              </button>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!consent) return;
                try {
                  localStorage.setItem(
                    'veloop-waitlist-demo',
                    JSON.stringify({ email, at: new Date().toISOString(), consent: true }),
                  );
                  setSaved(true);
                  setError('');
                  setEmail('');
                  notify('Local-only waitlist example saved · No subscription created');
                } catch {
                  setError(
                    'Your browser cannot save this example. Please allow local storage or try the demo workspace.',
                  );
                }
              }}
            >
              <label htmlFor="waitlist-email">Your email · demo only</label>
              <div className="waitlist-input">
                <input
                  id="waitlist-email"
                  type="email"
                  required
                  maxLength={254}
                  autoComplete="off"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button className="button white" type="submit">
                  Try signup
                  <ArrowUpRight size={18} />
                </button>
              </div>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  required
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                />
                I agree to save this signup example in this browser only.
              </label>
              <p>
                No subscription is created. Use a sample email.{' '}
                <Link to="/privacy">Read demo privacy</Link>
              </p>
              {error && <p role="alert">{error}</p>}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
export function Landing() {
  return (
    <div className="public-site">
      <PublicHeader />
      <main id="main-content">
        <section className="landing-hero">
          <div className="public-container hero-grid">
            <div className="landing-copy">
              <Badge tone="soft">
                <span className="status-dot" />A LITTLE EVERY DAY. A LOT OVER TIME.
              </Badge>
              <h1>
                Make your everyday
                <br />a little more
                <br />
                <em>rewarding.</em>
                <span className="hero-asterisk">✳</span>
              </h1>
              <p>
                Follow your curiosity. Find your next small win.
                <br />
                Turn everyday moments into progress you can see.
              </p>
              <div className="landing-ctas">
                <Link className="button primary large-button" to="/app">
                  Find your loop
                  <ArrowUpRight size={20} />
                </Link>
                <a
                  className="watch-link"
                  href="#how-it-works"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <span>
                    <Play size={15} fill="currentColor" />
                  </span>
                  See how it works
                </a>
              </div>
              <div className="hero-assurances">
                <span>
                  <Check size={15} />
                  Free interactive demo
                </span>
                <span>
                  <ShieldCheck size={15} />
                  No real payouts
                </span>
              </div>
              <div className="launch-note">
                <span>On the horizon</span>
                <Badge tone="neutral">iOS · Coming soon</Badge>
                <Badge tone="neutral">Android · Coming soon</Badge>
              </div>
            </div>
            <PhonePreview />
          </div>
        </section>
        <section className="principles-strip">
          <div className="public-container">
            {[
              { icon: Compass, t: 'A little discovery', d: 'Something for every kind of day.' },
              { icon: Flame, t: 'A little consistency', d: 'Build habits. Find your rhythm.' },
              { icon: Wallet, t: 'A little clarity', d: 'Every reward has a clear status.' },
              { icon: Users, t: 'A little connection', d: 'Better with your people.' },
            ].map((p) => (
              <div key={p.t}>
                <p.icon size={26} strokeWidth={1.5} />
                <span>
                  <h3>{p.t}</h3>
                  <p>{p.d}</p>
                </span>
              </div>
            ))}
          </div>
        </section>
        <section className="public-section" id="possibilities">
          <div className="public-container">
            <div className="public-section-title">
              <span className="eyebrow">YOUR DAY. YOUR KIND OF REWARDING.</span>
              <h2>
                Find what feels <em>like you.</em>
              </h2>
              <p>A few minutes. A fresh perspective. A little something to look forward to.</p>
            </div>
            <div className="public-feature-grid">
              {[
                {
                  icon: 'Compass',
                  title: 'Follow your curiosity',
                  description:
                    'Discover sample activities, share opinions and explore something outside your everyday.',
                  color: 'peach',
                  path: '/app/earn',
                  tag: 'EXPLORE & EARN',
                },
                {
                  icon: 'Flame',
                  title: 'Find your daily rhythm',
                  description:
                    'Keep your spark alive with daily check-ins, streaks and small moments of progress.',
                  color: 'purple',
                  path: '/app',
                  tag: 'HABITS & PROGRESS',
                },
                {
                  icon: 'Users',
                  title: 'Bring your people',
                  description:
                    'Explore referrals, grow your circle and see how a little connection can go a long way.',
                  color: 'green',
                  path: '/app/referrals',
                  tag: 'BETTER TOGETHER',
                },
              ].map((f) => (
                <Link className={'public-feature ' + f.color} to={f.path} key={f.title}>
                  <div className="feature-illustration">
                    <Icon name={f.icon} size={67} />
                    <i>✦</i>
                    <span>+</span>
                  </div>
                  <span className="eyebrow">{f.tag}</span>
                  <h3>{f.title}</h3>
                  <p>{f.description}</p>
                  <span className="feature-arrow">
                    <ArrowUpRight size={23} />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
        <section className="how-section public-section" id="how-it-works">
          <div className="public-container">
            <div className="public-section-title">
              <span className="eyebrow">NO BIG LEAP REQUIRED</span>
              <h2>
                A little start. <em>A lovely loop.</em>
              </h2>
              <p>Three simple steps to explore the idea.</p>
            </div>
            <div className="how-grid">
              {[
                {
                  title: 'Step into your loop',
                  text: 'Open the demo workspace. Find your feet, explore the dashboard and make it yours.',
                  icon: Compass,
                },
                {
                  title: 'Make a little moment',
                  text: 'Try a task, check in for the day or unlock a mission. Your sample progress adds up.',
                  icon: Sparkles,
                },
                {
                  title: 'See your small wins',
                  text: 'Follow each reward in your wallet, explore analytics and try a virtual redemption.',
                  icon: Wallet,
                },
              ].map((s, i) => (
                <div key={s.title}>
                  <div className="how-top">
                    <span>0{i + 1}</span>
                    <s.icon size={28} strokeWidth={1.4} />
                  </div>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </div>
              ))}
            </div>
            <div className="center">
              <Link className="button primary" to="/app">
                Let’s find your loop
                <ArrowUpRight size={18} />
              </Link>
            </div>
          </div>
        </section>
        <section className="public-section">
          <div className="public-container clarity-grid">
            <div className="clarity-visual">
              <div className="clarity-card">
                <span className="eyebrow">A LITTLE TRANSPARENCY</span>
                <h3>
                  Every reward.
                  <br />A clear next step.
                </h3>
                {[
                  { label: 'Task completed', status: 'Checked', icon: Check, color: 'green' },
                  {
                    label: 'Reward verification',
                    status: 'Pending',
                    icon: Clock3,
                    color: 'yellow',
                  },
                  { label: 'Wallet credit', status: 'Credited', icon: Wallet, color: 'peach' },
                ].map((r) => (
                  <div key={r.label}>
                    <span className={'tile ' + r.color}>
                      <r.icon size={19} />
                    </span>
                    <b>{r.label}</b>
                    <Badge tone={r.color}>{r.status}</Badge>
                  </div>
                ))}
                <small>Illustrative lifecycle · Not real transactions</small>
              </div>
              <span className="clarity-spark">✦</span>
            </div>
            <div>
              <span className="eyebrow">LESS GUESSWORK. MORE CLARITY.</span>
              <h2>
                Your progress.
                <br />
                <em>Clearly in view.</em>
              </h2>
              <p>
                Good rewards start with trust. Know what’s pending, what’s credited and what
                happened next.
              </p>
              <ul className="check-list">
                <li>
                  <Check size={19} />A status for every reward
                </li>
                <li>
                  <Check size={19} />A history you can follow
                </li>
                <li>
                  <Check size={19} />
                  Demo data labelled, always
                </li>
              </ul>
              <Link className="text-link" to="/rewards-wallet">
                A closer look at the wallet
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>
        <section className="public-section public-faq">
          <div className="public-container">
            <div className="public-section-title">
              <span className="eyebrow">A FEW THINGS YOU MIGHT BE WONDERING</span>
              <h2>
                A little more <em>clarity.</em>
              </h2>
            </div>
            <div className="landing-faq">
              {[
                {
                  q: 'Is VELOOP Rewards available now?',
                  a: 'The product is in development. This website is an interactive prototype that demonstrates planned experiences with simulated rewards and data.',
                },
                {
                  q: 'Can I earn or withdraw real money here?',
                  a: 'No. All VEs and XP in this prototype are virtual. No real rewards, payments or withdrawals are processed.',
                },
                {
                  q: 'Is the waitlist connected?',
                  a: 'The form below is a local-only example. It does not subscribe you, send an email or notify you at launch.',
                },
                {
                  q: 'What happens to my demo progress?',
                  a: 'Your sample profile, preferences and activity are saved only in this browser. You can export or reset them in Settings.',
                },
              ].map((f) => (
                <details key={f.q}>
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
            <Link className="text-link" to="/help">
              Visit the help center
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </section>
        <Waitlist />
      </main>
      <PublicFooter />
    </div>
  );
}
export function PublicPage({
  kind,
}: {
  kind: 'features' | 'wallet' | 'about' | 'help' | 'privacy' | 'terms';
}) {
  const content = {
    features: {
      eyebrow: 'FIND YOUR KIND OF EVERYDAY',
      title: 'A little something for everyone.',
      description: 'A closer look at the activities, habits and connections in the VELOOP demo.',
    },
    wallet: {
      eyebrow: 'TRANSPARENT BY DESIGN',
      title: 'Every little win, accounted for.',
      description: 'A clear reward history, useful statuses and a sample redemption flow.',
    },
    about: {
      eyebrow: 'OUR LITTLE START',
      title: 'Everyday moments. More possibility.',
      description:
        'An exploration of a rewards platform built around curiosity, consistency and clarity.',
    },
    help: {
      eyebrow: 'A LITTLE GUIDANCE',
      title: 'Good questions. Clear answers.',
      description: 'Understand the demo, explore its features and find the next step.',
    },
    privacy: {
      eyebrow: 'DEMO PRIVACY NOTICE',
      title: 'A little clarity about your data.',
      description:
        'This notice describes this prototype only. It is not the production VELOOP privacy policy.',
    },
    terms: {
      eyebrow: 'DEMO EXPERIENCE TERMS',
      title: 'Know what you’re exploring.',
      description:
        'This prototype demonstrates planned product flows with virtual points and simulated data.',
    },
  }[kind];
  return (
    <div className="public-site">
      <PublicHeader />
      <main>
        <section className="public-page-hero">
          <div className="public-container">
            <Badge tone="soft">{content.eyebrow}</Badge>
            <h1>{content.title}</h1>
            <p>{content.description}</p>
            <Link className="button primary" to={kind === 'help' ? '/app/help' : '/app'}>
              {kind === 'help' ? 'Search the demo help center' : 'Explore the interactive demo'}
              <ArrowUpRight size={18} />
            </Link>
          </div>
        </section>
        <section className="public-section">
          <div className="public-container">
            {kind === 'features' ? (
              <>
                <div className="public-section-title">
                  <h2>
                    More ways to find <em>your loop.</em>
                  </h2>
                </div>
                <div className="task-grid">
                  {tasks.map((t) => (
                    <article className="panel" key={t.id}>
                      <span className={'tile ' + t.color}>
                        <Icon name={t.icon} size={25} />
                      </span>
                      <h3 className="spaced-small">{t.title}</h3>
                      <p>{t.description}</p>
                      <Link className="text-link" to="/app/earn">
                        Explore sample activity
                        <ArrowRight size={16} />
                      </Link>
                    </article>
                  ))}
                </div>
                <div className="two-col spaced">
                  {[
                    {
                      title: 'Lucky spin',
                      icon: Gift,
                      path: '/app/spin',
                      text: 'One free daily spin. Virtual points. A small surprise.',
                    },
                    {
                      title: 'Missions & milestones',
                      icon: Target,
                      path: '/app/missions',
                      text: 'Build XP, collect badges and unlock sample milestone rewards.',
                    },
                    {
                      title: 'Your circle',
                      icon: Users,
                      path: '/app/referrals',
                      text: 'Explore the planned referral flow with fictional activations.',
                    },
                    {
                      title: 'Progress analytics',
                      icon: BarChart3,
                      path: '/app/analytics',
                      text: 'A dashboard calculated from your local sample activity.',
                    },
                  ].map((f) => (
                    <Link className="panel feature-link" key={f.title} to={f.path}>
                      <f.icon size={25} />
                      <span>
                        <h3>{f.title}</h3>
                        <p>{f.text}</p>
                      </span>
                      <ArrowUpRight size={20} />
                    </Link>
                  ))}
                </div>
              </>
            ) : kind === 'wallet' ? (
              <>
                <div className="clarity-grid">
                  <PhonePreview />
                  <div>
                    <h2>
                      See where every
                      <br />
                      <em>reward stands.</em>
                    </h2>
                    <ul className="wallet-explanations">
                      {[
                        {
                          s: 'Pending',
                          c: 'yellow',
                          t: 'Awaiting confirmation. Not included in available balance.',
                        },
                        { s: 'Credited', c: 'green', t: 'Added to the available virtual balance.' },
                        {
                          s: 'Under review',
                          c: 'purple',
                          t: 'A demo redemption reserves points while it is open.',
                        },
                        {
                          s: 'Cancelled',
                          c: 'neutral',
                          t: 'The demo request is closed and reserved points released.',
                        },
                      ].map((r) => (
                        <li key={r.s}>
                          <Badge tone={r.c}>{r.s}</Badge>
                          <p>{r.t}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="four-col spaced">
                  {[
                    { u: 'VEs', d: 'Virtual reward points in this demo.' },
                    { u: 'XP', d: 'Progress towards levels and badges.' },
                    { u: 'Gems', d: 'Planned unit. No value or conversion assigned.' },
                    { u: 'Tokens', d: 'Planned unit. No value or conversion assigned.' },
                  ].map((u) => (
                    <div className="panel" key={u.u}>
                      <h3>{u.u}</h3>
                      <p>{u.d}</p>
                    </div>
                  ))}
                </div>
              </>
            ) : kind === 'about' ? (
              <>
                <div className="public-section-title">
                  <h2>
                    A little curiosity.
                    <br />
                    <em>A thoughtful foundation.</em>
                  </h2>
                  <p>
                    This React experience builds on Iqra Siddiqui’s VELOOP landing page and product
                    analytics blueprint. Product functionality and data remain illustrative.
                  </p>
                </div>
                <div className="three-col">
                  {[
                    {
                      icon: ShieldCheck,
                      t: 'Honest by design',
                      d: 'No invented adoption numbers, testimonials or earning promises.',
                    },
                    {
                      icon: Compass,
                      t: 'Clear by default',
                      d: 'Visible reward states, local-only storage and labelled sample data.',
                    },
                    {
                      icon: BarChart3,
                      t: 'Measurable from the start',
                      d: 'Events and KPI definitions connect the experience to its analytics.',
                    },
                  ].map((c) => (
                    <article className="panel" key={c.t}>
                      <c.icon size={30} />
                      <h3 className="spaced-small">{c.t}</h3>
                      <p>{c.d}</p>
                    </article>
                  ))}
                </div>
                <div className="notice spaced">
                  <Sparkles size={20} />
                  <span>
                    React, TypeScript and Vite power this frontend. Authentication, partner
                    verification, payment processing and production analytics require backend
                    integrations.
                  </span>
                </div>
              </>
            ) : kind === 'help' ? (
              <div className="three-col">
                {[
                  {
                    t: 'Understand your wallet',
                    d: 'Learn about statuses, demo redemptions and sample points.',
                    icon: Wallet,
                    path: '/app/wallet',
                  },
                  {
                    t: 'Find your next activity',
                    d: 'Explore tasks, daily check-ins and missions.',
                    icon: Compass,
                    path: '/app/earn',
                  },
                  {
                    t: 'Get a little guidance',
                    d: 'Search answers and practice a local support request.',
                    icon: Mail,
                    path: '/app/help',
                  },
                ].map((f) => (
                  <Link className="panel" to={f.path} key={f.t}>
                    <f.icon size={30} />
                    <h3 className="spaced-small">{f.t}</h3>
                    <p>{f.d}</p>
                    <span className="text-link">
                      Explore
                      <ArrowUpRight size={17} />
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="prose panel">
                {(kind === 'privacy'
                  ? [
                      {
                        t: 'What this demo stores',
                        d: 'The site uses localStorage to keep a demo display name, goal, appearance preferences, virtual transactions, task progress, referral simulations, sample support requests, and event names with timestamps. The optional waitlist example stores the email you enter only after you select its local-storage consent checkbox.',
                      },
                      {
                        t: 'Where your data goes',
                        d: 'No application backend, analytics provider, advertising service or email service is connected. App data stays in this browser. Your hosting provider may independently receive routine web-request information such as IP address and user agent. Following external links opens the linked service.',
                      },
                      {
                        t: 'Your choices',
                        d: 'Use a fictional name and email. Export a copy or reset the workspace from Settings. Reset also removes the local waitlist entry. Browser settings can clear the site’s stored data. Data is not synchronized between devices.',
                      },
                      {
                        t: 'Before production launch',
                        d: 'A real deployment collecting user data must supply an official privacy notice, retention policy and appropriate consent and access controls. This prototype does not establish those production practices.',
                      },
                    ]
                  : [
                      {
                        t: 'An illustrative experience',
                        d: 'This is a frontend prototype. All VEs, XP, referrals, rankings and transaction histories are simulated. No actual user account is authenticated, and no partner activity is submitted.',
                      },
                      {
                        t: 'Virtual points only',
                        d: 'Demo VEs have no cash value and cannot be exchanged for money, products or services. A demo redemption changes local sample state only. Spin outcomes are free simulated rewards with no real prize.',
                      },
                      {
                        t: 'No launch or performance promises',
                        d: 'Features, conversion rules, reward eligibility and release timing are unannounced. This prototype does not guarantee earnings or launch availability. Other explorers on the leaderboard are fictional.',
                      },
                      {
                        t: 'Local storage and limitations',
                        d: 'Demo state can be lost or changed through browser storage. It is not a secure ledger, synchronized account or fraud-resistant rewards system. Formal product terms must be provided before a production launch.',
                      },
                    ]
                ).map((s) => (
                  <section key={s.t}>
                    <h2>{s.t}</h2>
                    <p>{s.d}</p>
                  </section>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <PublicFooter />
    </div>
  );
}
