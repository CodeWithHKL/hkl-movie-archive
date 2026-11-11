"use client";
import { useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import { Monitor, Sun, Moon } from 'lucide-react';

type Theme = 'system' | 'light' | 'dark';

const OPTIONS: { value: Theme; label: string; Icon: typeof Sun }[] = [
  { value: 'system', label: 'System theme', Icon: Monitor },
  { value: 'light', label: 'Light theme', Icon: Sun },
  { value: 'dark', label: 'Dark theme', Icon: Moon },
];

const resolve = (t: Theme) =>
  t === 'system' ? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : t;

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  // Read the stored choice after mount so server and client markup match.
  useEffect(() => {
    const stored = localStorage.getItem('theme');
    setTheme(stored === 'light' || stored === 'dark' ? stored : 'system');
  }, []);

  useEffect(() => {
    if (!theme) return;
    const apply = () => { document.documentElement.dataset.theme = resolve(theme); };
    apply();
    if (theme === 'system') {
      localStorage.removeItem('theme');
      const mq = matchMedia('(prefers-color-scheme: dark)');
      mq.addEventListener('change', apply);
      return () => mq.removeEventListener('change', apply);
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Switch theme with a circular reveal expanding from the clicked button
  // (View Transitions API); falls back to an instant switch
  // only when the browser lacks the API. Reduced-motion is intentionally ignored.
  const choose = (value: Theme, button: HTMLElement) => {
    const commit = () => {
      document.documentElement.dataset.theme = resolve(value);
      flushSync(() => setTheme(value));
    };
    if (!document.startViewTransition) {
      commit();
      return;
    }
    const r = button.getBoundingClientRect();
    const x = r.left + r.width / 2;
    const y = r.top + r.height / 2;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    document
      .startViewTransition(commit)
      .ready.then(() => {
        document.documentElement.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          { duration: 600, easing: 'ease-in-out', pseudoElement: '::view-transition-new(root)' },
        );
      })
      .catch(() => {});
  };

  return (
    <div role="radiogroup" aria-label="Theme" className="flex items-center rounded-full border border-rule p-0.5">
      {OPTIONS.map(({ value, label, Icon }) => {
        const active = theme === value;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={label}
            title={label}
            onClick={(e) => choose(value, e.currentTarget)}
            className={`flex h-6 w-6 items-center justify-center rounded-full transition-colors ${
              active ? 'bg-ink/10 text-ink' : 'text-ink-faint hover:text-ink'
            }`}
          >
            <Icon size={13} />
          </button>
        );
      })}
    </div>
  );
}
