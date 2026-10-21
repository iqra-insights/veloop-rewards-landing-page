export type Category = 'Daily' | 'Discover' | 'Social' | 'Progress';
export type Transaction = {
  id: string;
  title: string;
  kind: 'reward' | 'withdrawal' | 'spin' | 'referral' | 'adjustment';
  amount: number;
  status: 'Credited' | 'Pending' | 'Reversed' | 'Under review' | 'Cancelled';
  at: string;
  note: string;
};
export type Task = {
  id: string;
  title: string;
  description: string;
  category: Category;
  reward: number;
  xp: number;
  icon: string;
  color: string;
  minutes: number;
  tag?: string;
  steps: string[];
};
export const tasks: Task[] = [
  {
    id: 'discover',
    title: 'Discover something new',
    description: 'Explore a fictional partner experience and share what you think.',
    category: 'Discover',
    reward: 150,
    xp: 40,
    icon: 'Compass',
    color: 'peach',
    minutes: 3,
    tag: 'Popular',
    steps: [
      'Explore the sample partner brief.',
      'Choose the feature that interests you.',
      'Submit your demo completion.',
    ],
  },
  {
    id: 'survey',
    title: 'Your opinion matters',
    description: 'A short sample survey about the way you spend your day.',
    category: 'Discover',
    reward: 200,
    xp: 60,
    icon: 'ClipboardList',
    color: 'purple',
    minutes: 5,
    tag: 'Recommended',
    steps: [
      'Read the sample survey prompt.',
      'Select your preferred activity.',
      'Submit your demo response.',
    ],
  },
  {
    id: 'video',
    title: 'Watch & discover',
    description: 'Preview a sample sponsored-content activity. No real ad is served.',
    category: 'Discover',
    reward: 75,
    xp: 20,
    icon: 'Play',
    color: 'pink',
    minutes: 2,
    steps: [
      'Review the sample content description.',
      'Acknowledge the demo activity.',
      'Submit your sample completion.',
    ],
  },
  {
    id: 'tap',
    title: 'A little tap goes a long way',
    description: 'Try a quick focus challenge and add a little momentum.',
    category: 'Daily',
    reward: 40,
    xp: 15,
    icon: 'MousePointer2',
    color: 'blue',
    minutes: 1,
    tag: 'Quick win',
    steps: [
      'Open the focus challenge.',
      'Choose one small goal for today.',
      'Complete the demo challenge.',
    ],
  },
  {
    id: 'mission',
    title: 'Explore the rewards wallet',
    description: 'Learn what pending, credited and reversed really mean.',
    category: 'Progress',
    reward: 100,
    xp: 35,
    icon: 'Wallet',
    color: 'green',
    minutes: 2,
    steps: [
      'Pending rewards are not spendable.',
      'Credited rewards increase your balance.',
      'Reversals reference a previous credit.',
    ],
  },
  {
    id: 'community',
    title: 'Make a little connection',
    description: 'Explore a community prompt and share your favorite way to recharge.',
    category: 'Social',
    reward: 90,
    xp: 30,
    icon: 'Users',
    color: 'yellow',
    minutes: 3,
    steps: [
      'Read the sample community prompt.',
      'Choose your favorite activity.',
      'Finish this local-only demo task.',
    ],
  },
];
export type DemoState = {
  session?: { start: string; end: string; claimed: boolean };
  version: 1;
  profile: { name: string; goal: string };
  transactions: Transaction[];
  completed: string[];
  claims: string[];
  xp: number;
  spinDate: string | null;
  spinResult: number | null;
  redeemed: string[];
  referrals: number;
  notificationsRead: boolean;
  preferences: { email: boolean; motion: boolean; theme: 'light' | 'dark' };
  tickets: { id: string; subject: string; message: string; at: string }[];
  events: { name: string; at: string }[];
};
export function localDay(date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
export function streak(claims: string[], today = localDay()): number {
  const d = new Date(today + 'T12:00:00');
  if (!claims.includes(today)) d.setDate(d.getDate() - 1);
  let count = 0;
  while (claims.includes(localDay(d))) {
    count++;
    d.setDate(d.getDate() - 1);
  }
  return count;
}
export function initialState(): DemoState {
  const now = new Date();
  const at = (days: number) => new Date(now.getTime() - days * 86400000).toISOString();
  return {
    version: 1,
    profile: { name: 'Alex', goal: 'Build a rewarding daily habit' },
    transactions: [
      {
        id: 'seed-1',
        title: 'Welcome to the loop',
        kind: 'reward',
        amount: 500,
        status: 'Credited',
        at: at(6),
        note: 'Illustrative welcome credit. No cash value.',
      },
      {
        id: 'seed-2',
        title: 'Discovery mission',
        kind: 'reward',
        amount: 350,
        status: 'Credited',
        at: at(4),
        note: 'Fictional completed mission.',
      },
      {
        id: 'seed-3',
        title: 'Referral milestone',
        kind: 'referral',
        amount: 250,
        status: 'Credited',
        at: at(2),
        note: 'Fictional referral activity.',
      },
      {
        id: 'seed-4',
        title: 'Daily rewards',
        kind: 'reward',
        amount: 150,
        status: 'Credited',
        at: at(1),
        note: 'Illustrative earlier daily rewards.',
      },
      {
        id: 'seed-5',
        title: 'Partner activity',
        kind: 'reward',
        amount: 120,
        status: 'Pending',
        at: at(0),
        note: 'Awaiting fictional partner confirmation. Not part of available balance.',
      },
    ],
    completed: [],
    claims: [],
    xp: 640,
    spinDate: null,
    spinResult: null,
    redeemed: [],
    referrals: 1,
    notificationsRead: false,
    preferences: { email: false, motion: true, theme: 'light' },
    tickets: [],
    events: [],
  };
}
export function balance(s: DemoState): number {
  return s.transactions.reduce(
    (sum, t) => sum + (t.status === 'Credited' || t.status === 'Under review' ? t.amount : 0),
    0,
  );
}
export function earned(s: DemoState): number {
  return s.transactions
    .filter((t) => t.status === 'Credited' && t.amount > 0)
    .reduce((a, t) => a + t.amount, 0);
}
export function pending(s: DemoState): number {
  return s.transactions.filter((t) => t.status === 'Pending').reduce((a, t) => a + t.amount, 0);
}
export const milestones = [
  {
    id: 'first',
    title: 'First steps',
    description: 'Complete your first task',
    target: 1,
    reward: 50,
  },
  {
    id: 'explorer',
    title: 'Curious explorer',
    description: 'Complete 3 different tasks',
    target: 3,
    reward: 150,
  },
  { id: 'all', title: 'Full circle', description: 'Complete all 6 tasks', target: 6, reward: 300 },
];
export type Action =
  | { type: 'task'; id: string; at: string }
  | { type: 'claim'; day: string; at: string }
  | { type: 'spin'; day: string; prize: number; at: string }
  | { type: 'withdraw'; amount: number; at: string }
  | { type: 'cancel'; id: string }
  | { type: 'milestone'; id: string; at: string }
  | { type: 'referral'; at: string }
  | { type: 'profile'; name: string; goal: string }
  | { type: 'preferences'; value: Partial<DemoState['preferences']> }
  | { type: 'read' }
  | { type: 'ticket'; subject: string; message: string; at: string }
  | { type: 'reset' }
  | { type: 'session-start'; at: string }
  | { type: 'session-claim'; at: string };
export function reducer(s: DemoState, a: Action): DemoState {
  const credit = (
    title: string,
    amount: number,
    kind: Transaction['kind'],
    at: string,
    note: string,
  ): Transaction => ({
    id: `${kind}-${at}-${s.transactions.length}`,
    title,
    amount,
    kind,
    at,
    status: 'Credited',
    note,
  });
  const record = (next: DemoState, name: string, at: string): DemoState => ({
    ...next,
    events: [{ name, at }, ...s.events].slice(0, 200),
  });
  switch (a.type) {
    case 'task': {
      const t = tasks.find((t) => t.id === a.id);
      if (!t || s.completed.includes(t.id)) return s;
      return record(
        {
          ...s,
          completed: [...s.completed, t.id],
          xp: s.xp + t.xp,
          transactions: [
            credit(
              t.title,
              t.reward,
              'reward',
              a.at,
              'Local demo task completion. No real partner verification.',
            ),
            ...s.transactions,
          ],
        },
        'task_completed',
        a.at,
      );
    }
    case 'claim':
      if (s.claims.includes(a.day)) return s;
      return record(
        {
          ...s,
          claims: [...s.claims, a.day],
          xp: s.xp + 25,
          transactions: [
            credit(
              'Daily check-in',
              50,
              'reward',
              a.at,
              'One sample check-in per local calendar day.',
            ),
            ...s.transactions,
          ],
        },
        'daily_reward_claimed',
        a.at,
      );
    case 'spin':
      if (s.spinDate === a.day || ![25, 50, 75, 100, 150, 200].includes(a.prize)) return s;
      return record(
        {
          ...s,
          spinDate: a.day,
          spinResult: a.prize,
          xp: s.xp + 10,
          transactions: [
            credit(
              'Lucky spin',
              a.prize,
              'spin',
              a.at,
              'Random demo points, no real prize or cash value.',
            ),
            ...s.transactions,
          ],
        },
        'spin_completed',
        a.at,
      );
    case 'withdraw':
      if (!Number.isSafeInteger(a.amount) || a.amount < 100 || a.amount > balance(s)) return s;
      return record(
        {
          ...s,
          transactions: [
            {
              id: `withdraw-${a.at}-${s.transactions.length}`,
              title: 'Demo redemption',
              kind: 'withdrawal',
              amount: -a.amount,
              status: 'Under review',
              at: a.at,
              note: 'Simulated request; points reserved locally. No payment is sent.',
            },
            ...s.transactions,
          ],
        },
        'withdrawal_requested',
        a.at,
      );
    case 'cancel':
      return {
        ...s,
        transactions: s.transactions.map((t) =>
          t.id === a.id && t.kind === 'withdrawal' && t.status === 'Under review'
            ? {
                ...t,
                status: 'Cancelled',
                note: 'Demo request cancelled. Reserved points released.',
              }
            : t,
        ),
      };
    case 'milestone': {
      const m = milestones.find((m) => m.id === a.id);
      if (!m || s.completed.length < m.target || s.redeemed.includes(m.id)) return s;
      return record(
        {
          ...s,
          redeemed: [...s.redeemed, m.id],
          transactions: [
            credit(m.title, m.reward, 'reward', a.at, 'Sample mission milestone.'),
            ...s.transactions,
          ],
        },
        'milestone_claimed',
        a.at,
      );
    }
    case 'referral':
      if (s.referrals >= 4) return s;
      return record(
        {
          ...s,
          referrals: s.referrals + 1,
          transactions: [
            credit(
              'Demo referral activated',
              250,
              'referral',
              a.at,
              'A simulated activation, not a real invitation or referral.',
            ),
            ...s.transactions,
          ],
        },
        'referral_activated',
        a.at,
      );
    case 'profile':
      return {
        ...s,
        profile: {
          name: a.name.trim().slice(0, 50) || 'Explorer',
          goal: a.goal.trim().slice(0, 150),
        },
      };
    case 'preferences':
      return { ...s, preferences: { ...s.preferences, ...a.value } };
    case 'read':
      return { ...s, notificationsRead: true };
    case 'ticket':
      if (!a.subject.trim() || !a.message.trim()) return s;
      return {
        ...s,
        tickets: [
          {
            id: `VLP-${s.tickets.length + 1001}`,
            subject: a.subject.slice(0, 100),
            message: a.message.slice(0, 2000),
            at: a.at,
          },
          ...s.tickets,
        ],
      };
    case 'session-start': {
      if (
        s.session &&
        (!s.session.claimed || localDay(new Date(s.session.start)) === localDay(new Date(a.at)))
      )
        return s;
      return record(
        {
          ...s,
          session: {
            start: a.at,
            end: new Date(Date.parse(a.at) + 60000).toISOString(),
            claimed: false,
          },
        },
        'session_started',
        a.at,
      );
    }
    case 'session-claim': {
      if (!s.session || s.session.claimed || Date.parse(a.at) < Date.parse(s.session.end)) return s;
      return record(
        {
          ...s,
          session: { ...s.session, claimed: true },
          xp: s.xp + 40,
          transactions: [
            credit(
              'Reward session',
              125,
              'reward',
              a.at,
              'Completed a 60-second simulated session. No cryptocurrency mining or real earnings.',
            ),
            ...s.transactions,
          ],
        },
        'session_reward_claimed',
        a.at,
      );
    }
    case 'reset':
      return initialState();
  }
}
export const STORAGE_KEY = 'veloop-demo-v1';
export function parseState(raw: string | null): DemoState {
  if (!raw) return initialState();
  try {
    const s: unknown = JSON.parse(raw);
    if (!s || typeof s !== 'object') return initialState();
    const v = s as DemoState;
    if (
      v.version !== 1 ||
      !v.profile ||
      typeof v.profile.name !== 'string' ||
      typeof v.profile.goal !== 'string' ||
      !Number.isSafeInteger(v.xp) ||
      v.xp < 0 ||
      !Number.isSafeInteger(v.referrals) ||
      v.referrals < 0 ||
      v.referrals > 4 ||
      typeof v.notificationsRead !== 'boolean'
    )
      return initialState();
    for (const key of ['completed', 'claims', 'redeemed'] as const)
      if (!Array.isArray(v[key]) || !v[key].every((x) => typeof x === 'string'))
        return initialState();
    if (
      !Array.isArray(v.transactions) ||
      !v.transactions.every(
        (t) =>
          t &&
          typeof t.id === 'string' &&
          typeof t.title === 'string' &&
          typeof t.note === 'string' &&
          Number.isSafeInteger(t.amount) &&
          ['reward', 'withdrawal', 'spin', 'referral', 'adjustment'].includes(t.kind) &&
          ['Credited', 'Pending', 'Reversed', 'Under review', 'Cancelled'].includes(t.status) &&
          Number.isFinite(Date.parse(t.at)),
      )
    )
      return initialState();
    if (
      !v.preferences ||
      !['light', 'dark'].includes(v.preferences.theme) ||
      typeof v.preferences.motion !== 'boolean' ||
      typeof v.preferences.email !== 'boolean' ||
      !Array.isArray(v.tickets) ||
      !v.tickets.every(
        (t) =>
          t &&
          typeof t.id === 'string' &&
          typeof t.subject === 'string' &&
          typeof t.message === 'string' &&
          Number.isFinite(Date.parse(t.at)),
      ) ||
      !Array.isArray(v.events) ||
      !v.events.every((e) => e && typeof e.name === 'string' && Number.isFinite(Date.parse(e.at)))
    )
      return initialState();
    if (
      !(v.spinDate === null || typeof v.spinDate === 'string') ||
      !(v.spinResult === null || [25, 50, 75, 100, 150, 200].includes(v.spinResult)) ||
      balance(v) < 0
    )
      return initialState();
    if (
      v.session !== undefined &&
      (!v.session ||
        !Number.isFinite(Date.parse(v.session.start)) ||
        !Number.isFinite(Date.parse(v.session.end)) ||
        typeof v.session.claimed !== 'boolean')
    )
      return initialState();
    return v;
  } catch {
    return initialState();
  }
}
export function csv(rows: (string | number)[][]): string {
  return rows
    .map((row) =>
      row
        .map((value) => {
          const str = String(value);
          return (
            '"' +
            (/^[=+@\-]/.test(str) && typeof value === 'string' ? "'" : '') +
            str.replace(/"/g, '""') +
            '"'
          );
        })
        .join(','),
    )
    .join('\r\n');
}
export function download(name: string, data: string, mime = 'text/csv;charset=utf-8'): void {
  const url = URL.createObjectURL(new Blob([data], { type: mime }));
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export const number = (n: number) => new Intl.NumberFormat('en-IN').format(n);
