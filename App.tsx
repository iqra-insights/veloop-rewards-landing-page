import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Check, Sparkles } from 'lucide-react';
import Layout from './components/Layout';
import { Landing, PublicPage } from './pages/Marketing';
import { useStore } from './store';
const Overview = lazy(() => import('./pages/Overview'));
const Session = lazy(() => import('./pages/Session'));
const Earn = lazy(() => import('./pages/Earn'));
const Wallet = lazy(() => import('./pages/Wallet'));
const Missions = lazy(() => import('./pages/Missions'));
const Spin = lazy(() => import('./pages/Spin'));
const Referrals = lazy(() => import('./pages/Referrals'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Leaderboard = lazy(() => import('./pages/Leaderboard'));
const Help = lazy(() => import('./pages/Help'));
const Settings = lazy(() => import('./pages/Settings'));
function PageEffects() {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    const title = location.pathname.split('/').filter(Boolean).at(-1) || 'Welcome';
    document.title = `${title === 'app' ? 'Overview' : title.charAt(0).toUpperCase() + title.slice(1)} · VELOOP Rewards`;
  }, [location.pathname]);
  return null;
}
export default function App() {
  const { toast } = useStore();
  return (
    <>
      <PageEffects />
      <Suspense
        fallback={
          <div className="page-loader">
            <span className="brandmark">
              <span />
            </span>
            <p>Finding your loop…</p>
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/features" element={<PublicPage kind="features" />} />
          <Route path="/rewards-wallet" element={<PublicPage kind="wallet" />} />
          <Route path="/about" element={<PublicPage kind="about" />} />
          <Route path="/help" element={<PublicPage kind="help" />} />
          <Route path="/privacy" element={<PublicPage kind="privacy" />} />
          <Route path="/terms" element={<PublicPage kind="terms" />} />
          <Route path="/dashboard" element={<Navigate to="/app/analytics" replace />} />
          <Route path="/app" element={<Layout />}>
            <Route index element={<Overview />} />
            <Route path="earn" element={<Earn />} />
            <Route path="wallet" element={<Wallet />} />
            <Route path="missions" element={<Missions />} />
            <Route path="session" element={<Session />} />
            <Route path="spin" element={<Spin />} />
            <Route path="referrals" element={<Referrals />} />
            <Route path="leaderboard" element={<Leaderboard />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="help" element={<Help />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route
            path="*"
            element={
              <div className="not-found">
                <Sparkles size={42} />
                <span className="eyebrow">A LITTLE DETOUR</span>
                <h1>This page is out of the loop.</h1>
                <p>Let’s get you back to something rewarding.</p>
                <Link className="button primary" to="/">
                  <ArrowLeft size={18} />
                  Back to VELOOP
                </Link>
              </div>
            }
          />
        </Routes>
      </Suspense>
      <div className={'toast ' + (toast ? 'visible' : '')} role="status" aria-live="polite">
        {toast && (
          <>
            <span>
              <Check size={16} />
            </span>
            {toast}
          </>
        )}
      </div>
    </>
  );
}
