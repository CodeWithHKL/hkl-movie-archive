"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ThemeToggle from './ThemeToggle';

const LINKS = [
  { href: '/', label: 'Archive' },
  { href: '/analytics', label: 'Analytics' },
  { href: '/bestpicks', label: 'Best Picks' },
];

export default function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-20 border-b border-rule bg-paper/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 py-3.5 md:px-8">
        <Link href="/" className="text-base font-semibold leading-none tracking-tight">
          HKLX
        </Link>
        <nav className="flex items-center gap-1 text-sm md:gap-2">
          {LINKS.map(l => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? 'page' : undefined}
                className={`rounded-md px-2.5 py-1.5 transition-colors ${
                  active ? 'bg-ink/10 text-ink' : 'text-ink-soft hover:text-ink'
                }`}
              >
                {l.label}
              </Link>
            );
          })}
          <div className="ml-1 md:ml-2">
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </header>
  );
}
