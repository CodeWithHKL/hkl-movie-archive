"use client";
import React, { useState, useMemo } from 'react';
import { mockMovies, Movie, GENRES } from '@/lib/data';
import { Search, ChevronUp, ChevronDown } from 'lucide-react';
import SiteHeader from '@/components/SiteHeader';
import { genreColor, ratingClass } from '@/lib/theme';

type SortConfig = { key: keyof Movie; direction: 'asc' | 'desc' } | null;

const YEAR_RANGES = ['All', '<= 1989', '1990-1999', '2000-2009', '2010-2019', '2020 =>'];
const RATING_RANGES = ['All', '<= 5.9', '6.0 - 6.9', '7.0 - 7.9', '8.0 - 8.9', '9.0 - 10'];

const COLUMNS: { label: string; key: keyof Movie; align?: string }[] = [
  { label: 'Title', key: 'title' },
  { label: 'Year', key: 'year' },
  { label: 'Genre', key: 'genre' },
  { label: 'Director', key: 'director' },
  { label: 'Mine', key: 'myRating', align: 'text-right' },
  { label: 'IMDb', key: 'imdbRating', align: 'text-right' },
];

const selectCls = "w-full cursor-pointer rounded-md border border-rule bg-surface px-3 py-2 text-sm text-ink outline-none transition-colors hover:border-ink-faint focus:border-ink-soft";
const labelCls = "text-xs text-ink-faint";

export default function MovieVault() {
  const [search, setSearch] = useState('');
  const [genreFilter, setGenreFilter] = useState('All');
  const [yearRange, setYearRange] = useState('All');
  const [myRatingRange, setMyRatingRange] = useState('All');
  const [imdbRatingRange, setImdbRatingRange] = useState('All');
  const [sort, setSort] = useState<SortConfig>({ key: 'myRating', direction: 'desc' });

  const handleSort = (key: keyof Movie) => {
    setSort(prev => ({
      key,
      direction: prev?.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const isInRange = (value: number, range: string) => {
    if (range === 'All') return true;
    if (range.startsWith('<=')) return value <= parseFloat(range.replace('<=', ''));
    if (range.endsWith('=>')) return value >= parseFloat(range.replace('=>', ''));
    const [min, max] = range.split('-').map(Number);
    return value >= min && value <= max;
  };

  const processedMovies = useMemo(() => {
    let items = mockMovies.filter(m => {
      const matchesSearch = (m.title.toLowerCase().includes(search.toLowerCase()) ||
                              m.director.toLowerCase().includes(search.toLowerCase()));
      return matchesSearch &&
             (genreFilter === 'All' || m.genre === genreFilter) &&
             isInRange(m.year, yearRange) &&
             isInRange(m.myRating, myRatingRange) &&
             isInRange(m.imdbRating, imdbRatingRange);
    });

    if (sort) {
      items.sort((a: any, b: any) => {
        const valA = a[sort.key];
        const valB = b[sort.key];

        if (valA < valB) return sort.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sort.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return items;
  }, [search, genreFilter, yearRange, myRatingRange, imdbRatingRange, sort]);

  const SortIcon = ({ col }: { col: keyof Movie }) => {
    if (sort?.key !== col) return <ChevronUp size={12} className="opacity-0 transition-opacity group-hover:opacity-40" />;
    return sort.direction === 'asc' ? <ChevronUp size={12} className="text-accent" /> : <ChevronDown size={12} className="text-accent" />;
  };

  return (
    <div className="min-h-screen bg-paper text-ink">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-5 pb-24 pt-12 md:px-8 md:pt-16">
        <div className="mb-12 max-w-2xl">
          <h1 className="text-4xl font-semibold tracking-tighter md:text-5xl">
            HKL Movie <span className="text-ink-faint">Archive</span>
          </h1>
          <p className="mt-3 text-ink-soft">
            A personal record of favourite films and series, rated and catalogued.
          </p>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-6">
          <label className="sm:col-span-2 lg:col-span-2">
            <span className={`${labelCls} mb-1.5 block`}>Search</span>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
              <input
                className="w-full rounded-md border border-rule bg-surface py-2 pl-9 pr-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-faint hover:border-ink-faint focus:border-ink-soft"
                placeholder="Title or director"
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </label>
          {[
            { label: 'Genre', options: GENRES, setter: setGenreFilter },
            { label: 'Era', options: YEAR_RANGES, setter: setYearRange },
            { label: 'My rating', options: RATING_RANGES, setter: setMyRatingRange },
            { label: 'IMDb', options: RATING_RANGES, setter: setImdbRatingRange },
          ].map(f => (
            <label key={f.label}>
              <span className={`${labelCls} mb-1.5 block`}>{f.label}</span>
              <select className={selectCls} onChange={(e) => f.setter(e.target.value)}>
                {f.options.map(opt => <option key={opt} value={opt} className="bg-surface">{opt}</option>)}
              </select>
            </label>
          ))}
        </div>

        <p className="mb-3 text-sm text-ink-faint">
          <span className="num text-ink">{processedMovies.length}</span> {processedMovies.length === 1 ? 'title' : 'titles'}
        </p>

        <div className="overflow-x-auto rounded-lg border border-rule bg-surface">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-rule text-xs text-ink-faint">
                {COLUMNS.map((col) => (
                  <th
                    key={col.key}
                    className={`px-4 py-3 font-medium ${col.align ?? ''}`}
                    aria-sort={sort?.key === col.key ? (sort.direction === 'asc' ? 'ascending' : 'descending') : undefined}
                  >
                    <button
                      onClick={() => handleSort(col.key)}
                      className={`group inline-flex items-center gap-1 whitespace-nowrap transition-colors hover:text-ink ${sort?.key === col.key ? 'text-ink' : ''}`}
                    >
                      {col.label} <SortIcon col={col.key} />
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {processedMovies.length > 0 ? (
                processedMovies.map((movie, index) => (
                  <tr key={movie.id} className="border-b border-rule last:border-0 transition-colors hover:bg-white/[0.03]">
                    <td className="max-w-[320px] px-4 py-3">
                      <div className="flex items-baseline gap-4">
                        <span className="num w-7 shrink-0 text-right text-xs text-ink-faint">{index + 1}</span>
                        <span className="truncate text-sm" title={movie.title}>{movie.title}</span>
                      </div>
                    </td>
                    <td className="num px-4 py-3 text-sm text-ink-soft">{movie.year}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-ink-soft">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-rule px-2.5 py-0.5 text-xs">
                        <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: genreColor(movie.genre) }} />
                        {movie.genre}
                      </span>
                    </td>
                    <td className="max-w-[180px] truncate px-4 py-3 text-sm text-ink-soft" title={movie.director}>{movie.director}</td>
                    <td className={`num px-4 py-3 text-right text-sm ${ratingClass(movie.myRating)}`}>{movie.myRating.toFixed(1)}</td>
                    <td className="num px-4 py-3 text-right text-sm text-ink-faint">{movie.imdbRating ? movie.imdbRating.toFixed(1) : '—'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-20 text-center text-sm text-ink-faint">Nothing matches those filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
