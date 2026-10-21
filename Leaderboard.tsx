import { useState } from 'react';
import { Trophy, Medal, Sparkles } from 'lucide-react';
import { useStore } from './store';
import { Badge } from './ui';
import { number } from './model';
export default function Leaderboard() {
  const { state } = useStore();
  const [view, setView] = useState('All explorers');
  const people = [
    { name: 'Jordan', xp: 1760 },
    { name: 'Sam', xp: 1480 },
    { name: 'Riley', xp: 1320 },
    { name: 'Taylor', xp: 1010 },
    { name: 'Casey', xp: 780 },
    { name: state.profile.name, xp: state.xp, you: true },
    { name: 'Morgan', xp: 420 },
    { name: 'Jamie', xp: 310 },
  ].sort((a, b) => b.xp - a.xp);
  const rank = people.findIndex((p) => p.you) + 1;
  const podium = [people[1], people[0], people[2]];
  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">A LITTLE FRIENDLY MOMENTUM</span>
          <h1>Celebrate every kind of progress.</h1>
          <p>A fictional leaderboard. Your demo XP updates your position.</p>
        </div>
        <Badge tone="purple">
          <Sparkles size={13} />
          All other explorers are fictional
        </Badge>
      </div>
      <section className="podium-section">
        <span className="eyebrow">THE SAMPLE EXPLORER CIRCLE</span>
        <h2>Small actions. Standout energy.</h2>
        <div className="podium">
          {podium.map((p, i) => (
            <div className={'podium-place p' + [2, 1, 3][i]} key={p.name}>
              <span className="podium-crown">
                {i === 1 ? <Trophy size={28} /> : <Medal size={23} />}
              </span>
              <span className="podium-avatar">{p.name[0]}</span>
              <h3>
                {p.name}
                {p.you ? ' (you)' : ''}
              </h3>
              <span>{number(p.xp)} XP</span>
              <b>0{[2, 1, 3][i]}</b>
            </div>
          ))}
        </div>
      </section>
      <div className="panel">
        <div className="section-title">
          <div>
            <h2>Your explorer circle</h2>
            <p>Ranked by all-time sample XP.</p>
          </div>
          <div className="segmented">
            {['All explorers', 'Your position'].map((v) => (
              <button key={v} className={view === v ? 'active' : ''} onClick={() => setView(v)}>
                {v}
              </button>
            ))}
          </div>
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Explorer</th>
                <th>Level</th>
                <th className="right">Experience</th>
              </tr>
            </thead>
            <tbody>
              {people
                .map((p, i) => ({ ...p, rank: i + 1 }))
                .filter((p) => view === 'All explorers' || p.you)
                .map((p) => (
                  <tr key={p.rank} className={p.you ? 'your-row' : ''}>
                    <td>
                      <b>#{p.rank}</b>
                    </td>
                    <td>
                      <div className="transaction-name">
                        <span className={'avatar ' + (p.you ? 'orange' : 'purple')}>
                          {p.name[0]}
                        </span>
                        <b>{p.name}</b>
                        {p.you ? (
                          <Badge tone="orange">You</Badge>
                        ) : (
                          <span className="tiny muted">Fictional</span>
                        )}
                      </div>
                    </td>
                    <td>Level {Math.floor(p.xp / 250) + 1}</td>
                    <td className="right">
                      <b>{number(p.xp)} XP</b>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="notice spaced">
        <Trophy size={20} />
        <span>
          You’re currently #{rank} in this sample circle. Rankings are illustrative and do not
          represent VELOOP users or production performance.
        </span>
      </div>
    </>
  );
}
