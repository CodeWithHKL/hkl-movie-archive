"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowUpRight } from 'lucide-react';

const LINKS = [
  { href: '/', label: 'Archive' },
  { href: '/dashboard', label: 'Analytics' },
  { href: '/bestpicks', label: 'Best Picks' },
];

export default function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="border-b border-rule">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 py-5 md:px-8">
        <Link href="/" className="font-serif text-2xl leading-none tracking-tight">
          HKL<span className="text-accent">.</span>
        </Link>
        <nav className="flex items-center gap-5 text-sm md:gap-8">
          {LINKS.map(l => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? 'page' : undefined}
                className={`border-b pb-0.5 transition-colors ${
                  active ? 'border-accent text-ink' : 'border-transparent text-ink-soft hover:text-ink'
                }`}
              >
                {l.label}
              </Link>
            );
          })}
          <a
            href="https://hklxportfolio.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-1 text-ink-faint transition-colors hover:text-ink sm:flex"
          >
            Portfolio <ArrowUpRight size={14} />
          </a>
        </nav>
      </div>
    </header>
  );
}
