import { useEffect, useState } from 'react';
import { NavLink, Outlet, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Compass,
  Wallet,
  Target,
  Users,
  BarChart3,
  Trophy,
  Gift,
  CircleHelp,
  Settings,
  ArrowUpRight,
  Bell,
  Search,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  Check,
  ExternalLink,
  LogOut,
  Zap,
} from 'lucide-react';
import { Logo, Modal } from './ui';
import { useStore } from './store';
import { number } from './model';
const nav = [
  { label: 'Overview', path: '/app', icon: LayoutDashboard },
  { label: 'Explore & earn', path: '/app/earn', icon: Compass },
  { label: 'My wallet', path: '/app/wallet', icon: Wallet },
  { label: 'Reward session', path: '/app/session', icon: Zap },
  { label: 'Missions', path: '/app/missions', icon: Target },
  { label: 'Lucky spin', path: '/app/spin', icon: Gift },
  { label: 'Referrals', path: '/app/referrals', icon: Users },
  { label: 'Leaderboard', path: '/app/leaderboard', icon: Trophy },
  { label: 'Analytics', path: '/app/analytics', icon: BarChart3 },
];
export default function Layout() {
  const { state, dispatch, storageError } = useStore();
  const [mobile, setMobile] = useState(false);
  const [notifications, setNotifications] = useState(false);
  const [profile, setProfile] = useState(false);
  const [query, setQuery] = useState('');
  const location = useLocation();
  useEffect(() => {
    setMobile(false);
    setProfile(false);
    setQuery('');
    window.scrollTo(0, 0);
  }, [location.pathname]);
  const results = nav.filter((n) => n.label.toLowerCase().includes(query.toLowerCase()));
  const level = Math.floor(state.xp / 250) + 1;
  return (
    <div className="app-shell">
      <a className="skip" href="#main-content">
        Skip to content
      </a>
      {mobile && (
        <button
          className="sidebar-backdrop"
          aria-label="Close navigation"
          onClick={() => setMobile(false)}
        />
      )}
      <aside className={'sidebar ' + (mobile ? 'open' : '')}>
        <div className="sidebar-brand">
          <Logo />
          <button
            className="icon-button mobile-close"
            aria-label="Close navigation"
            onClick={() => setMobile(false)}
          >
            <X size={20} />
          </button>
        </div>
        <div className="workspace-label">YOUR DAILY LOOP</div>
        <nav aria-label="Member navigation">
          {nav.map((n) => (
            <NavLink
              key={n.path}
              to={n.path}
              end={n.path === '/app'}
              className={({ isActive }) => 'nav-item ' + (isActive ? 'active' : '')}
            >
              <n.icon size={19} strokeWidth={1.7} />
              <span>{n.label}</span>
              {n.label === 'Explore & earn' && <span className="nav-count">6</span>}
              {n.label === 'Lucky spin' && <span className="nav-dot" />}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="level-card">
            <div className="flex between">
              <span className="mini-gem">
                <Sparkles size={17} />
              </span>
              <span>Level {level}</span>
              <span className="tiny">{number(state.xp)} XP</span>
            </div>
            <div className="progress">
              <i style={{ width: `${((state.xp % 250) / 250) * 100}%` }} />
            </div>
            <p>{250 - (state.xp % 250)} XP to your next level</p>
            <Link to="/app/missions">
              Keep growing <ArrowUpRight size={15} />
            </Link>
          </div>
          <NavLink to="/app/help" className="nav-item">
            <CircleHelp size={19} />
            Help & support
          </NavLink>
          <NavLink to="/app/settings" className="nav-item">
            <Settings size={19} />
            Settings
          </NavLink>
          <div className="sidebar-note">
            <span className="status-dot" /> Interactive demo <span>v1.0</span>
          </div>
        </div>
      </aside>
      <div className="app-body">
        <header className="topbar">
          <button
            className="icon-button mobile-toggle"
            onClick={() => setMobile(true)}
            aria-label="Open navigation"
          >
            <Menu size={23} />
          </button>
          <div className="search-wrap">
            <Search size={18} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search pages"
              placeholder="Search your next opportunity…"
            />
            <kbd>/</kbd>
            {query && (
              <div className="search-results">
                {results.length ? (
                  results.map((n) => (
                    <Link key={n.path} to={n.path} onClick={() => setQuery('')}>
                      <n.icon size={16} />
                      {n.label}
                      <ArrowUpRight size={15} />
                    </Link>
                  ))
                ) : (
                  <p>No pages found. Try “wallet” or “earn”.</p>
                )}
              </div>
            )}
          </div>
          <div className="topbar-actions">
            <Link to="/" className="website-link">
              Visit website <ExternalLink size={14} />
            </Link>
            <span className="top-divider" />
            <button
              className="icon-button notification-button"
              aria-label="Notifications"
              onClick={() => setNotifications(true)}
            >
              <Bell size={20} />
              {!state.notificationsRead && <i />}
            </button>
            <div className="profile-menu-wrap">
              <button
                className="profile-button"
                onClick={() => setProfile(!profile)}
                aria-expanded={profile}
              >
                <span className="avatar">{state.profile.name.slice(0, 1).toUpperCase()}</span>
                <span>
                  {state.profile.name}
                  <small>Demo explorer</small>
                </span>
                <ChevronDown size={14} />
              </button>
              {profile && (
                <div className="profile-menu">
                  <Link to="/app/settings">
                    <Settings size={16} />
                    Profile & preferences
                  </Link>
                  <Link to="/">
                    <LogOut size={16} />
                    Leave demo
                  </Link>
                </div>
              )}
            </div>
          </div>
        </header>
        <div className="demo-bar">
          <Sparkles size={13} />
          <span>Demo workspace · Sample data, virtual rewards, no real payouts.</span>
          <Link to="/app/help">
            Learn more <ArrowUpRight size={12} />
          </Link>
        </div>
        {storageError && (
          <div role="alert" className="error-banner">
            Browser storage is unavailable. Changes will last only for this session.
          </div>
        )}
        <main id="main-content" className="app-main">
          <Outlet />
        </main>
        <footer className="app-footer">
          <span>© {new Date().getFullYear()} VELOOP Rewards · Interactive prototype</span>
          <div>
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Demo terms</Link>
            <Link to="/app/help">Need a hand?</Link>
          </div>
        </footer>
      </div>
      {notifications && (
        <Modal title="Your updates" close={() => setNotifications(false)}>
          <div className="notification">
            <span className="tile peach">
              <Gift size={22} />
            </span>
            <div>
              <h3>Your daily moment is waiting</h3>
              <p>Check in on the overview to collect 50 sample VEs.</p>
            </div>
          </div>
          <div className="notification">
            <span className="tile purple">
              <Sparkles size={22} />
            </span>
            <div>
              <h3>A little progress adds up</h3>
              <p>Complete tasks to unlock mission milestones.</p>
            </div>
          </div>
          <div className="notification">
            <span className="tile green">
              <Check size={22} />
            </span>
            <div>
              <h3>You're in a demo workspace</h3>
              <p>Everything stays in this browser. No real account or payments are created.</p>
            </div>
          </div>
          <button
            className="button primary full"
            onClick={() => {
              dispatch({ type: 'read' });
              setNotifications(false);
            }}
          >
            Mark updates as read
          </button>
        </Modal>
      )}
    </div>
  );
}
