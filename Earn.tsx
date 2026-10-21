import { useState } from 'react';
import { Search, SlidersHorizontal, Sparkles, Check } from 'lucide-react';
import { tasks, type Task } from '../model';
import { useStore } from '../store';
import { TaskCard, TaskDialog, Empty, Badge } from '../components/ui';
export default function Earn() {
  const { state } = useStore();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All activities');
  const [sort, setSort] = useState('recommended');
  const [available, setAvailable] = useState(false);
  const [selected, setSelected] = useState<Task | null>(null);
  const filtered = tasks
    .filter(
      (t) =>
        (category === 'All activities' || t.category === category) &&
        `${t.title} ${t.description}`.toLowerCase().includes(query.toLowerCase()) &&
        (!available || !state.completed.includes(t.id)),
    )
    .sort((a, b) =>
      sort === 'reward'
        ? b.reward - a.reward
        : sort === 'quick'
          ? a.minutes - b.minutes
          : Number(state.completed.includes(a.id)) - Number(state.completed.includes(b.id)),
    );
  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">FOLLOW YOUR CURIOSITY</span>
          <h1>Make a little more of your day.</h1>
          <p>Discover activities, try something new and collect sample rewards.</p>
        </div>
        <Badge tone="green">
          <Sparkles size={13} />6 demo activities
        </Badge>
      </div>
      <div className="earn-highlight">
        <div>
          <Sparkles size={27} />
          <span>
            <h3>Your next small win starts here</h3>
            <p>Every task includes clear steps, a sample reward and a little XP.</p>
          </span>
        </div>
        <span>
          <Check size={16} />
          No real partner tasks are submitted
        </span>
      </div>
      <div className="toolbar">
        <div className="input-search">
          <Search size={18} />
          <input
            aria-label="Search tasks"
            placeholder="Find your next activity…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <label className="inline-label">
          <SlidersHorizontal size={17} />
          <select
            className="select"
            aria-label="Sort tasks"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="recommended">Recommended first</option>
            <option value="reward">Highest reward</option>
            <option value="quick">Quickest first</option>
          </select>
        </label>
      </div>
      <div className="flex between filter-row">
        <div className="tabs" aria-label="Activity categories">
          {['All activities', 'Daily', 'Discover', 'Social', 'Progress'].map((c) => (
            <button
              key={c}
              aria-pressed={category === c}
              className={category === c ? 'active' : ''}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={available}
            onChange={(e) => setAvailable(e.target.checked)}
          />
          Available only
        </label>
      </div>
      <p className="results-count">{filtered.length} activities to explore</p>
      {filtered.length ? (
        <div className="task-grid">
          {filtered.map((t) => (
            <TaskCard key={t.id} task={t} onOpen={setSelected} />
          ))}
        </div>
      ) : (
        <Empty
          title="A fresh search might help"
          description="Try another word, category or clear the available-only filter."
        />
      )}
      <div className="notice spaced">
        <Sparkles size={20} />
        <span>
          All activities are illustrative. Each task can be completed once per demo workspace. Reset
          your demo in Settings to try again.
        </span>
      </div>
      {selected && <TaskDialog task={selected} close={() => setSelected(null)} />}
    </>
  );
}
