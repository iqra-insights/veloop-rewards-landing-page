import test from 'node:test';
import assert from 'node:assert/strict';
import {
  initialState,
  balance,
  pending,
  reducer,
  parseState,
  csv,
  streak,
  tasks,
  type DemoState,
} from '../src/model';
const at = '2026-10-21T12:00:00Z';
test('pending sample rewards are excluded from spendable balance', () => {
  const s = initialState();
  assert.equal(balance(s), 1250);
  assert.equal(pending(s), 120);
});
test('duplicate completion cannot double credit or grant XP twice', () => {
  const s = initialState();
  const next = reducer(s, { type: 'task', id: 'survey', at });
  const twice = reducer(next, { type: 'task', id: 'survey', at });
  assert.equal(balance(next), 1450);
  assert.equal(next.xp, 700);
  assert.deepEqual(next, twice);
});
test('daily check-ins and spins cannot be claimed twice on the same day', () => {
  let s = initialState();
  s = reducer(s, { type: 'claim', day: '2026-10-21', at });
  s = reducer(s, { type: 'claim', day: '2026-10-21', at });
  s = reducer(s, { type: 'spin', day: '2026-10-21', prize: 200, at });
  s = reducer(s, { type: 'spin', day: '2026-10-21', prize: 200, at });
  assert.equal(balance(s), 1500);
  assert.equal(s.claims.length, 1);
  assert.equal(s.xp, 675);
});
test('invalid or excessive redemptions leave ledger unchanged', () => {
  const s = initialState();
  for (const amount of [-100, 0, 99, 100.5, NaN, Infinity, 2000])
    assert.deepEqual(reducer(s, { type: 'withdraw', amount, at }), s);
});
test('redemption reserves balance; cancellation releases it exactly once', () => {
  const s = reducer(initialState(), { type: 'withdraw', amount: 300, at });
  assert.equal(balance(s), 950);
  const id = s.transactions[0].id;
  const cancelled = reducer(s, { type: 'cancel', id });
  assert.equal(balance(cancelled), 1250);
  assert.equal(cancelled.transactions[0].status, 'Cancelled');
  assert.equal(balance(reducer(cancelled, { type: 'cancel', id })), 1250);
});
test('sequential redemptions cannot spend already reserved points', () => {
  let s = reducer(initialState(), { type: 'withdraw', amount: 1000, at });
  s = reducer(s, { type: 'withdraw', amount: 300, at });
  assert.equal(balance(s), 250);
  assert.equal(s.transactions.filter((t) => t.kind === 'withdrawal').length, 1);
});
test('a normal reward cannot be cancelled as if it were a redemption', () => {
  const s = initialState();
  assert.deepEqual(reducer(s, { type: 'cancel', id: 'seed-1' }), s);
});
test('milestones require progress and cannot be claimed repeatedly', () => {
  let s = initialState();
  assert.deepEqual(reducer(s, { type: 'milestone', id: 'all', at }), s);
  s = reducer(s, { type: 'task', id: tasks[0].id, at });
  const next = reducer(s, { type: 'milestone', id: 'first', at });
  assert.equal(balance(next) - balance(s), 50);
  assert.deepEqual(reducer(next, { type: 'milestone', id: 'first', at }), next);
});
test('streak tolerates today not yet checked in but breaks at a missing day', () => {
  assert.equal(streak(['2026-10-19', '2026-10-20'], '2026-10-21'), 2);
  assert.equal(streak(['2026-10-19', '2026-10-20', '2026-10-21'], '2026-10-21'), 3);
  assert.equal(streak(['2026-10-18'], '2026-10-21'), 0);
  assert.equal(streak(['2026-10-19', '2026-10-21'], '2026-10-21'), 1);
});
test('corrupt or incomplete browser storage restores a usable workspace', () => {
  for (const raw of ['null', '{}', 'not json', '[]', '{"version":1,"profile":null}'])
    assert.equal(balance(parseState(raw)), 1250);
  const good = initialState();
  assert.deepEqual(parseState(JSON.stringify(good)), good);
  const bad = { ...good, preferences: {} };
  assert.equal(balance(parseState(JSON.stringify(bad))), 1250);
});
test('malformed transaction amounts cannot poison restored balance', () => {
  const bad = initialState();
  bad.transactions[0].amount = '1250' as unknown as number;
  assert.equal(balance(parseState(JSON.stringify(bad))), 1250);
  const broken: DemoState = { ...initialState(), events: [{ name: 'x', at: 'not a date' }] };
  assert.equal(parseState(JSON.stringify(broken)).events.length, 0);
});
test('CSV export quotes fields and neutralizes string formula injection', () => {
  assert.equal(
    csv([['=HYPERLINK("x")', 'a,b', 'a\nb', -50]]),
    '"\'=HYPERLINK(""x"")","a,b","a\nb","-50"',
  );
});
test('referral simulation has a finite sample limit', () => {
  let s = initialState();
  for (let n = 0; n < 10; n++) s = reducer(s, { type: 'referral', at });
  assert.equal(s.referrals, 4);
  assert.equal(balance(s), 2000);
});
test('reset clears earned progress and requests without losing a usable seed', () => {
  let s = reducer(initialState(), { type: 'task', id: 'survey', at });
  s = reducer(s, { type: 'ticket', subject: 'Question', message: 'Sample message', at });
  s = reducer(s, { type: 'reset' });
  assert.equal(balance(s), 1250);
  assert.equal(s.completed.length, 0);
  assert.equal(s.tickets.length, 0);
});
test('a reward session requires time to elapse and can only pay once', () => {
  const s = reducer(initialState(), { type: 'session-start', at });
  assert.equal(s.session?.end, '2026-10-21T12:01:00.000Z');
  assert.deepEqual(reducer(s, { type: 'session-claim', at }), s);
  const paid = reducer(s, { type: 'session-claim', at: '2026-10-21T12:01:01Z' });
  assert.equal(balance(paid), 1375);
  assert.equal(paid.xp, 680);
  assert.deepEqual(reducer(paid, { type: 'session-claim', at: '2026-10-21T12:02:00Z' }), paid);
  assert.deepEqual(reducer(paid, { type: 'session-start', at: '2026-10-21T13:00:00Z' }), paid);
});
