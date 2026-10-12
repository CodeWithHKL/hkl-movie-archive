"use client";
import React, { useState, useMemo } from 'react';
import { mockMovies } from '@/lib/data';
import {
  PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar,
  XAxis, YAxis, Tooltip, AreaChart, Area, CartesianGrid, ScatterChart, Scatter, LabelList
} from 'recharts';
import SiteHeader from '@/components/SiteHeader';
import { GENRE_COLORS } from '@/lib/theme';
import { X } from 'lucide-react';

const ACCENT = '#3291ff';
const INK = '#ededed';
const FAINT = '#737373';
const RULE = '#262626';

const tooltipStyle = {
  backgroundColor: '#0a0a0a',
  border: `1px solid ${RULE}`,
  borderRadius: 4,
  color: INK,
  fontSize: 12,
};

function Panel({ title, note, className = '', children }: { title: string; note?: string; className?: string; children: React.ReactNode }) {
  return (
    <section className={`rounded-lg border border-rule bg-surface p-6 ${className}`}>
      <h2 className="mb-6 flex items-baseline justify-between gap-4">
        <span className="text-base font-semibold tracking-tight">{title}</span>
        {note && <span className="text-xs text-ink-faint">{note}</span>}
      </h2>
      {children}
    </section>
  );
}

export default function Dashboard() {
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [selectedEra, setSelectedEra] = useState<string | null>(null);

  const isInEra = (year: number, era: string) => {
    if (era === '<1990') return year < 1990;
    if (era === '1990s') return year >= 1990 && year < 2000;
    if (era === '2000s') return year >= 2000 && year < 2010;
    if (era === '2010s') return year >= 2010 && year < 2020;
    if (era === '2020s+') return year >= 2020;
    return true;
  };

  const filteredMovies = useMemo(() => {
    return mockMovies.filter(m => {
      const matchGenre = selectedGenre ? m.genre === selectedGenre : true;
      const matchEra = selectedEra ? isInEra(m.year, selectedEra) : true;
      return matchGenre && matchEra;
    });
  }, [selectedGenre, selectedEra]);

  const genreData = useMemo(() => {
    const source = selectedEra
      ? mockMovies.filter(m => isInEra(m.year, selectedEra))
      : mockMovies;

    const counts = source.reduce((acc: Record<string, number>, m) => {
      acc[m.genre] = (acc[m.genre] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [selectedEra]);

  const eraData = useMemo(() => {
    const source = selectedGenre
      ? mockMovies.filter(m => m.genre === selectedGenre)
      : mockMovies;

    return [
      { name: '<1990', value: source.filter(m => m.year < 1990).length },
      { name: '1990s', value: source.filter(m => m.year >= 1990 && m.year < 2000).length },
      { name: '2000s', value: source.filter(m => m.year >= 2000 && m.year < 2010).length },
      { name: '2010s', value: source.filter(m => m.year >= 2010 && m.year < 2020).length },
      { name: '2020s+', value: source.filter(m => m.year >= 2020).length },
    ];
  }, [selectedGenre]);

  const ratingData = useMemo(() => [...filteredMovies].sort((a,b) => a.myRating - b.myRating), [filteredMovies]);
  const scatterData = useMemo(() => filteredMovies.map(m => ({ title: m.title, myRating: m.myRating, imdb: m.imdbRating, genre: m.genre })), [filteredMovies]);

  return (
    <div className="min-h-screen bg-paper text-ink">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-5 pb-24 pt-12 md:px-8 md:pt-16">
        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-4xl font-semibold tracking-tighter md:text-5xl">
              The <span className="text-ink-faint">Numbers</span>
            </h1>
            <p className="mt-3 text-ink-soft">
              <span className="num text-ink">{filteredMovies.length}</span> titles in view. Click a slice or bar to filter.
            </p>
          </div>

          {(selectedGenre || selectedEra) && (
            <button
              onClick={() => { setSelectedGenre(null); setSelectedEra(null); }}
              className="inline-flex items-center gap-1.5 self-start rounded-md border border-rule px-3 py-1.5 text-xs text-ink-soft transition-colors hover:border-ink-faint hover:text-ink md:self-auto"
            >
              <X size={12} /> Clear {selectedGenre && selectedEra ? 'both filters' : 'filter'}
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Panel title="Genres" note={selectedEra ? `in ${selectedEra}` : undefined}>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={genreData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={52} outerRadius={88} paddingAngle={1} stroke="#000000" strokeWidth={2}
                    onClick={(data: any) => {
                      const name = data?.name;
                      if (name) setSelectedGenre(selectedGenre === name ? null : name);
                    }}
                    className="cursor-pointer outline-none"
                    label={(props: any) => {
                      const { name, percent, x, y, textAnchor } = props;
                      if (selectedGenre && selectedGenre !== name) return null;
                      return (
                        <text x={x} y={y} textAnchor={textAnchor} fill={INK} fontSize={11}>
                          {`${name ?? 'Unknown'} ${((percent ?? 0) * 100).toFixed(0)}%`}
                        </text>
                      );
                    }}
                    labelLine={false}
                  >
                    {genreData.map((entry, i) => (
                      <Cell
                        key={i} fill={GENRE_COLORS[entry.name] || '#8c8a82'}
                        fillOpacity={selectedGenre ? (selectedGenre === entry.name ? 1 : 0.15) : 1}
                      />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} itemStyle={{ color: INK }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Panel>

          <Panel title="Eras" note={selectedGenre ? `for ${selectedGenre}` : undefined}>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={eraData} margin={{ top: 24 }}>
                  <XAxis dataKey="name" stroke={FAINT} fontSize={11} axisLine={{ stroke: RULE }} tickLine={false} />
                  <Tooltip cursor={{ fill: 'transparent' }} contentStyle={tooltipStyle} itemStyle={{ color: INK }} />
                  <Bar
                    dataKey="value"
                    radius={[2, 2, 0, 0]}
                    onClick={(data: any) => {
                      const name = data?.name;
                      if (name) setSelectedEra(selectedEra === name ? null : name);
                    }}
                    className="cursor-pointer"
                  >
                    <LabelList
                      dataKey="value"
                      position="top"
                      content={(props: any) => {
                        const { x, y, width, value, index } = props;
                        const entryName = eraData[index]?.name;
                        if (selectedEra && selectedEra !== entryName) return null;
                        if (!value || value === 0) return null;
                        return (
                          <text x={x + width / 2} y={y - 8} fill={INK} fontSize={11} textAnchor="middle">
                            {value}
                          </text>
                        );
                      }}
                    />
                    {eraData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={ACCENT}
                        fillOpacity={selectedEra ? (selectedEra === entry.name ? 1 : 0.2) : 0.85}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>

          <Panel
            className="lg:col-span-2"
            title="Ratings, low to high"
            note={`${selectedGenre || 'All genres'} · ${selectedEra || 'All eras'}`}
          >
            <div className="mb-3 flex gap-5 text-xs text-ink-soft">
              <span className="inline-flex items-center gap-2"><span className="h-0.5 w-4 bg-accent" /> Mine</span>
              <span className="inline-flex items-center gap-2"><span className="h-0.5 w-4 bg-ink-faint" /> IMDb</span>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={ratingData}>
                  <CartesianGrid stroke={RULE} vertical={false} />
                  <XAxis dataKey="title" hide />
                  <YAxis domain={[0, 10]} stroke={FAINT} fontSize={11} axisLine={false} tickLine={false} width={28} />
                  <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: INK }} />
                  <Area type="monotone" dataKey="imdbRating" name="IMDb" stroke={FAINT} fill={FAINT} fillOpacity={0.08} strokeWidth={1.5} />
                  <Area type="monotone" dataKey="myRating" name="Mine" stroke={ACCENT} fill={ACCENT} fillOpacity={0.12} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Panel>

          <Panel className="lg:col-span-2" title="Mine versus IMDb">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 10, right: 20, bottom: 30, left: 10 }}>
                  <CartesianGrid stroke={RULE} />
                  <XAxis
                    type="number" dataKey="imdb" name="IMDb" domain={[0, 10]} stroke={FAINT} fontSize={11} tickLine={false}
                    label={{ value: 'IMDb', position: 'bottom', fill: FAINT, fontSize: 11, dy: 6 }}
                  />
                  <YAxis
                    type="number" dataKey="myRating" name="Mine" domain={[0, 10]} stroke={FAINT} fontSize={11} tickLine={false}
                    label={{ value: 'Mine', angle: -90, position: 'insideLeft', fill: FAINT, fontSize: 11 }}
                  />
                  <Tooltip
                    cursor={{ stroke: RULE }}
                    content={({ payload }) => {
                      if (payload && payload.length > 0) {
                        const data = payload[0].payload;
                        return (
                          <div className="rounded-md border border-rule bg-surface px-3 py-2 text-xs">
                            <p className="mb-1 text-sm text-ink">{data?.title}</p>
                            <p className="num text-ink-soft">Mine {data?.myRating} · IMDb {data?.imdb}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Scatter name="Movies" data={scatterData}>
                    {scatterData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={GENRE_COLORS[entry.genre] || '#8c8a82'} fillOpacity={0.9} stroke="#000000" strokeWidth={1} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </div>
      </main>
    </div>
  );
}
