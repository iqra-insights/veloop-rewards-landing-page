import { useEffect, useRef, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  ArrowRight,
  Check,
  X,
  Gift,
  Compass,
  ClipboardList,
  Play,
  MousePointer2,
  Wallet,
  Users,
  Flame,
  Target,
  Sparkles,
  ShieldCheck,
  Zap,
  Trophy,
  Gem,
  CircleHelp,
  type LucideIcon,
} from 'lucide-react';
import { number, tasks, type Task } from '../model';
import { useStore } from '../store';
const icons: Record<string, LucideIcon> = {
  Gift,
  Compass,
  ClipboardList,
  Play,
  MousePointer2,
  Wallet,
  Users,
  Flame,
  Target,
  Sparkles,
  ShieldCheck,
  Zap,
  Trophy,
  Gem,
  CircleHelp,
};
export function Icon({
  name,
  size = 22,
  ...props
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const C = icons[name] || Gift;
  return <C size={size} strokeWidth={1.7} {...props} />;
}
export function Logo({ small = false }: { small?: boolean }) {
  return (
    <Link className={'logo ' + (small ? 'small' : '')} to="/" aria-label="VELOOP Rewards home">
      <span className="brandmark">
        <span />
      </span>
      <span>
        veloop<span className="logo-dot">.</span>
        <small>REWARDS</small>
      </span>
    </Link>
  );
}
export function Badge({ children, tone = 'orange' }: { children: ReactNode; tone?: string }) {
  return <span className={'badge ' + tone}>{children}</span>;
}
export function Modal({
  title,
  children,
  close,
  wide = false,
}: {
  title: string;
  children: ReactNode;
  close: () => void;
  wide?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const el = ref.current;
    const before = document.activeElement;
    el?.showModal();
    return () => {
      el?.close();
      if (before instanceof HTMLElement) before.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className={wide ? 'modal wide' : 'modal'}
      aria-labelledby="modal-title"
      onCancel={close}
      onClick={(e) => {
        if (e.target === ref.current) close();
      }}
    >
      <div className="modal-content">
        <div className="modal-head">
          <h2 id="modal-title">{title}</h2>
          <button className="icon-button" onClick={close} aria-label="Close dialog">
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </dialog>
  );
}
export function SectionTitle({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="section-title">
      <div>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {action}
    </div>
  );
}
export function Empty({ title, description }: { title: string; description: string }) {
  return (
    <div className="empty">
      <Compass size={32} />
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}
export function TaskCard({ task, onOpen }: { task: Task; onOpen: (t: Task) => void }) {
  const { state } = useStore();
  const done = state.completed.includes(task.id);
  return (
    <article className="task-card">
      <div className="task-card-top">
        <span className={'tile ' + task.color}>
          <Icon name={task.icon} size={25} />
        </span>
        {done ? (
          <Badge tone="green">
            <Check size={12} /> Completed
          </Badge>
        ) : task.tag ? (
          <Badge tone={task.tag === 'Recommended' ? 'purple' : 'neutral'}>{task.tag}</Badge>
        ) : (
          <span className="muted tiny">{task.category}</span>
        )}
      </div>
      <h3>{task.title}</h3>
      <p>{task.description}</p>
      <div className="task-meta">
        <span>
          <span className="coin small">v</span> <b>{task.reward} VEs</b>
        </span>
        <span>
          {task.minutes} min · +{task.xp} XP
        </span>
      </div>
      <button className={'button ' + (done ? 'subtle' : 'secondary')} onClick={() => onOpen(task)}>
        {done ? 'View completion' : 'Explore task'}
        <ArrowUpRight size={17} />
      </button>
    </article>
  );
}
export function TaskDialog({ task, close }: { task: Task; close: () => void }) {
  const { state, dispatch, notify } = useStore();
  const done = state.completed.includes(task.id);
  return (
    <Modal title={task.title} close={close}>
      <div className={'task-dialog-icon tile ' + task.color}>
        <Icon name={task.icon} size={32} />
      </div>
      <p>{task.description}</p>
      <div className="info-strip">
        <span>
          <b>{task.reward} VEs</b> sample reward
        </span>
        <span>
          <b>+{task.xp} XP</b> progress
        </span>
      </div>
      <h3>How this demo works</h3>
      <ol className="steps-list">
        {task.steps.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ol>
      {!done && (
        <label className="field">
          What would you like to explore?
          <select defaultValue="Everyday habits">
            <option>Everyday habits</option>
            <option>New experiences</option>
            <option>Rewards and progress</option>
          </select>
        </label>
      )}
      <div className="notice">
        <ShieldCheck size={18} />
        <span>
          This activity is simulated. No partner task, survey, advertisement or payment is
          submitted.
        </span>
      </div>
      <button
        disabled={done}
        className="button primary full"
        onClick={() => {
          dispatch({ type: 'task', id: task.id, at: new Date().toISOString() });
          notify(`Task completed · +${task.reward} sample VEs`);
          close();
        }}
      >
        {done ? (
          <>
            <Check size={17} />
            Already completed
          </>
        ) : (
          <>
            Complete demo task
            <ArrowRight size={17} />
          </>
        )}
      </button>
    </Modal>
  );
}
export function TaskExplorer({ limit, search = '' }: { limit?: number; search?: string }) {
  const list = tasks.filter((t) =>
    `${t.title} ${t.description} ${t.category}`.toLowerCase().includes(search.toLowerCase()),
  );
  return <span>{number(limit ? Math.min(limit, list.length) : list.length)} activities</span>;
}
