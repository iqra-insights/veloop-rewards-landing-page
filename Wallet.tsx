import { useState } from 'react';
import {
  ArrowUpRight,
  ArrowDownLeft,
  Download,
  ShieldCheck,
  Wallet as WalletIcon,
  Clock3,
  Search,
  ChevronLeft,
  ChevronRight,
  Info,
  Check,
} from 'lucide-react';
import { useStore } from './store';
import { balance, earned, pending, number, download, csv, type Transaction } from './model';
import { Badge, Empty, Modal, SectionTitle } from './ui';
export default function Wallet() {
  const { state, dispatch, notify } = useStore();
  const [redeem, setRedeem] = useState(false);
  const [amount, setAmount] = useState('100');
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All statuses');
  const [page, setPage] = useState(0);
  const [detail, setDetail] = useState<Transaction | null>(null);
  const available = balance(state);
  const filtered = [...state.transactions]
    .sort((a, b) => Date.parse(b.at) - Date.parse(a.at))
    .filter(
      (t) =>
        (status === 'All statuses' || t.status === status) &&
        `${t.title} ${t.id}`.toLowerCase().includes(query.toLowerCase()),
    );
  const pageCount = Math.max(1, Math.ceil(filtered.length / 6));
  const currentPage = Math.min(page, pageCount - 1);
  const shown = filtered.slice(currentPage * 6, currentPage * 6 + 6);
  const exportData = () => {
    download(
      'veloop-demo-transactions.csv',
      csv([
        ['ID', 'Activity', 'Type', 'VEs', 'Status', 'Timestamp', 'Note'],
        ...filtered.map((t) => [t.id, t.title, t.kind, t.amount, t.status, t.at, t.note]),
      ]),
    );
    notify('Filtered demo transactions exported');
  };
  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">EVERY LITTLE WIN, ACCOUNTED FOR</span>
          <h1>Your rewards, in one place.</h1>
          <p>A clear view of what’s available, what’s pending and what comes next.</p>
        </div>
        <button className="button secondary" onClick={exportData}>
          <Download size={17} />
          Export CSV
        </button>
      </div>
      <div className="wallet-cards">
        <section className="wallet-balance">
          <div className="flex between">
            <span className="wallet-label">
              <WalletIcon size={18} />
              Available balance
            </span>
            <Badge tone="glass">DEMO WALLET</Badge>
          </div>
          <h2>
            {number(available)}
            <span>VEs</span>
          </h2>
          <p>Virtual points · No cash value</p>
          <div className="wallet-bottom">
            <button className="button white" onClick={() => setRedeem(true)}>
              Try a redemption
              <ArrowUpRight size={18} />
            </button>
            <ShieldCheck size={30} strokeWidth={1.2} />
          </div>
        </section>
        <div className="panel wallet-stat">
          <span className="tile purple">
            <Clock3 size={24} />
          </span>
          <p>Pending rewards</p>
          <h2>
            {number(pending(state))}
            <small> VEs</small>
          </h2>
          <span>Not included in available balance</span>
        </div>
        <div className="panel wallet-stat">
          <span className="tile green">
            <ArrowDownLeft size={24} />
          </span>
          <p>Total credited</p>
          <h2>
            {number(earned(state))}
            <small> VEs</small>
          </h2>
          <span>All-time sample reward credits</span>
        </div>
      </div>
      <div className="notice spaced">
        <ShieldCheck size={19} />
        <span>
          Transparent by design. Demo redemptions reserve points. Cancelling an under-review request
          releases those points. No actual money is moved.
        </span>
      </div>
      <section className="panel transactions-panel">
        <SectionTitle
          title="Your reward history"
          description="Every action has a story. Here’s yours."
        />
        <div className="toolbar">
          <div className="input-search">
            <Search size={17} />
            <input
              aria-label="Search transactions"
              placeholder="Search activity or transaction ID…"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(0);
              }}
            />
          </div>
          <select
            className="select"
            aria-label="Filter transaction status"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(0);
            }}
          >
            {['All statuses', 'Credited', 'Pending', 'Under review', 'Cancelled'].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
        {shown.length ? (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Activity</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th className="right">Amount</th>
                  <th>
                    <span className="sr-only">Details</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {shown.map((t) => (
                  <tr key={t.id}>
                    <td>
                      <div className="transaction-name">
                        <span className={'tx-icon ' + (t.amount < 0 ? 'purple' : 'peach')}>
                          {t.amount < 0 ? <ArrowUpRight size={18} /> : <ArrowDownLeft size={18} />}
                        </span>
                        <span>
                          <b>{t.title}</b>
                          <small>
                            {t.kind === 'withdrawal' ? 'Demo redemption' : 'Sample reward'}
                          </small>
                        </span>
                      </div>
                    </td>
                    <td>
                      {new Date(t.at).toLocaleDateString('en', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td>
                      <Badge
                        tone={
                          t.status === 'Credited'
                            ? 'green'
                            : t.status === 'Pending'
                              ? 'yellow'
                              : t.status === 'Cancelled'
                                ? 'neutral'
                                : 'purple'
                        }
                      >
                        {t.status}
                      </Badge>
                    </td>
                    <td className={'right amount ' + (t.amount > 0 ? 'green-text' : '')}>
                      {t.amount > 0 ? '+' : ''}
                      {number(t.amount)} <small>VEs</small>
                    </td>
                    <td>
                      <button
                        className="icon-button"
                        aria-label={`Details for ${t.title}`}
                        onClick={() => setDetail(t)}
                      >
                        <ArrowUpRight size={17} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Empty
            title="No matching transactions"
            description="Try a different search or status filter."
          />
        )}
        <div className="pagination">
          <span>
            {filtered.length} transactions · Page {currentPage + 1} of {pageCount}
          </span>
          <div>
            <button
              className="icon-button"
              disabled={!currentPage}
              aria-label="Previous transaction page"
              onClick={() => setPage(currentPage - 1)}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              className="icon-button"
              disabled={currentPage >= pageCount - 1}
              aria-label="Next transaction page"
              onClick={() => setPage(currentPage + 1)}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </section>
      {redeem && (
        <Modal
          title="Try a demo redemption"
          close={() => {
            setRedeem(false);
            setError('');
          }}
        >
          <div className="notice">
            <Info size={19} />
            <span>This is a simulation. No bank details are collected and no payment is sent.</span>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const n = Number(amount);
              if (!Number.isSafeInteger(n) || n < 100) {
                setError('Enter a whole number of at least 100 VEs.');
                return;
              }
              if (n > available) {
                setError('This exceeds your available balance.');
                return;
              }
              dispatch({ type: 'withdraw', amount: n, at: new Date().toISOString() });
              setRedeem(false);
              setError('');
              notify(`${number(n)} sample VEs reserved · Request under review`);
            }}
          >
            <label className="field">
              Amount in VEs
              <input
                type="number"
                inputMode="numeric"
                min="100"
                step="1"
                max={available}
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setError('');
                }}
                required
                aria-describedby="redemption-help"
              />
            </label>
            <p id="redemption-help" className="muted tiny">
              Available: {number(available)} VEs · Demo minimum: 100 VEs
            </p>
            <label className="field">
              Demo redemption type
              <select>
                <option>Virtual reward voucher · simulation</option>
              </select>
            </label>
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
            <button className="button primary full" type="submit">
              Create demo request
              <ArrowUpRight size={17} />
            </button>
          </form>
        </Modal>
      )}
      {detail && (
        <Modal title="Transaction details" close={() => setDetail(null)}>
          <div className="detail-amount">
            {detail.amount > 0 ? '+' : ''}
            {number(detail.amount)} <small>VEs</small>
          </div>
          <dl className="detail-list">
            <dt>Activity</dt>
            <dd>{detail.title}</dd>
            <dt>Transaction ID</dt>
            <dd className="mono">{detail.id}</dd>
            <dt>Recorded</dt>
            <dd>{new Date(detail.at).toLocaleString()}</dd>
            <dt>Status</dt>
            <dd>{detail.status}</dd>
          </dl>
          <div className="notice">
            <Info size={18} />
            <span>{detail.note}</span>
          </div>
          {detail.kind === 'withdrawal' && detail.status === 'Under review' && (
            <button
              className="button secondary full"
              onClick={() => {
                dispatch({ type: 'cancel', id: detail.id });
                setDetail(null);
                notify('Demo redemption cancelled · Reserved points released');
              }}
            >
              <Check size={17} />
              Cancel demo request
            </button>
          )}
        </Modal>
      )}
    </>
  );
}
