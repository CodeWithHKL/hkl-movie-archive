"use client";
import React, { useState, useMemo } from 'react';
import { mockMovies, Movie, GENRES } from '@/lib/data';
import { 
  Search, ChevronUp, ChevronDown, Filter, 
  Star, PlayCircle, Menu, X
} from 'lucide-react';
import Sidebar from '@/components/Sidebar';

type SortConfig = { key: keyof Movie; direction: 'asc' | 'desc' } | null;

const YEAR_RANGES = ['All', '<= 1989', '1990-1999', '2000-2009', '2010-2019', '2020 =>'];
const RATING_RANGES = ['All', '<= 5.9', '6.0 - 6.9', '7.0 - 7.9', '8.0 - 8.9', '9.0 - 10'];

// Genre Color Mapping
const getGenreColor = (genre: string) => {
  const colors: Record<string, string> = {
    'Sci-Fi': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    'Crime': 'bg-red-500/10 text-red-400 border-red-500/20',
    'Thriller': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    'Action': 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    'Drama': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    'War': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    'Romance': 'bg-pink-500/10 text-pink-400 border-pink-500/20',
    'Horror': 'bg-slate-500/10 text-slate-300 border-slate-500/20',
    'Animation': 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    'History': 'bg-amber-700/10 text-amber-500 border-amber-700/20'
  };
  return colors[genre] || 'bg-white/5 text-gray-400 border-white/10';
};

export default function MovieVault() {
  const [search, setSearch] = useState('');
  const [genreFilter, setGenreFilter] = useState('All');
  const [yearRange, setYearRange] = useState('All');
  const [myRatingRange, setMyRatingRange] = useState('All');
  const [imdbRatingRange, setImdbRatingRange] = useState('All');
  const [sort, setSort] = useState<SortConfig>({ key: 'title', direction: 'asc' });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
      items.sort((a, b) => {
        if (a[sort.key] < b[sort.key]) return sort.direction === 'asc' ? -1 : 1;
        if (a[sort.key] > b[sort.key]) return sort.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return items;
  }, [search, genreFilter, yearRange, myRatingRange, imdbRatingRange, sort]);

  const SortIcon = ({ col }: { col: keyof Movie }) => {
    if (sort?.key !== col) return <ChevronUp size={12} className="opacity-20" />;
    return sort.direction === 'asc' ? <ChevronUp size={12} className="text-[#ff6b00]" /> : <ChevronDown size={12} className="text-[#ff6b00]" />;
  };

  return (
    <div className="flex min-h-screen bg-[#050505] text-white font-sans selection:bg-[#ff6b00]">
      
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} activeTab="movies" />

      <main className="flex-1 lg:ml-64 p-4 md:p-8 lg:p-12 relative overflow-x-hidden">
        <div className="fixed top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#ff6b00]/5 blur-[120px] rounded-full pointer-events-none" />

        <header className="flex justify-between items-center mb-12 lg:hidden">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-[#ff6b00] rounded-lg flex items-center justify-center font-black text-black text-sm">H</div>
             <span className="font-black uppercase tracking-tighter italic">Vault_</span>
          </div>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 bg-white/5 rounded-lg">
            {isSidebarOpen ? <X /> : <Menu />}
          </button>
        </header>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="mb-12">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-4 leading-none">
              Hkl <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6b00] to-orange-400">Archive</span>
            </h2>
            <div className="flex items-center gap-3">
              <div className="h-px w-12 bg-[#ff6b00]"></div>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.3em]">My Favourite Movies & Series</p>
            </div>
          </div>

          <div className="space-y-6 mb-10">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#ff6b00]" />
                <input 
                  className="w-full bg-[#080808] border border-white/5 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-[#ff6b00]/50 outline-none transition-all placeholder:text-gray-700 text-sm"
                  placeholder="Search title or director..."
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="flex items-center bg-[#080808] border border-white/5 rounded-2xl px-5">
                <Filter size={16} className="text-gray-500 mr-3" />
                <select 
                  className="bg-transparent py-4 outline-none text-[10px] font-black uppercase tracking-widest cursor-pointer min-w-[140px]"
                  onChange={(e) => setGenreFilter(e.target.value)}
                >
                  {GENRES.map(g => <option key={g} value={g} className="bg-[#080808]">{g}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: 'Release Era', options: YEAR_RANGES, setter: setYearRange },
                { label: 'Personal Rating', options: RATING_RANGES, setter: setMyRatingRange },
                { label: 'Global IMDb', options: RATING_RANGES, setter: setImdbRatingRange },
              ].map((filter, idx) => (
                <div key={idx} className="bg-[#080808] border border-white/5 rounded-2xl p-4 flex flex-col gap-2 group hover:border-[#ff6b00]/30 transition-all">
                  <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 group-hover:text-[#ff6b00] transition-colors">
                    {filter.label}
                  </label>
                  <select 
                    className="bg-transparent text-sm font-medium outline-none cursor-pointer"
                    onChange={(e) => filter.setter(e.target.value)}
                  >
                    {filter.options.map(opt => <option key={opt} value={opt} className="bg-[#080808]">{opt}</option>)}
                  </select>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-end mb-4 px-2">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
              Showing <span className="text-[#ff6b00]">{processedMovies.length}</span> {processedMovies.length === 1 ? 'Movie' : 'Movies'}
            </p>
          </div>

          <div className="bg-[#080808] border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-white/[0.02] text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black border-b border-white/5">
                  <tr>
                    {[
                      { label: 'Movie Title', key: 'title' },
                      { label: 'Year', key: 'year' },
                      { label: 'Category', key: 'genre' },
                      { label: 'Director', key: 'director' },
                      { label: 'My Rate', key: 'myRating' },
                      { label: 'IMDb', key: 'imdbRating' }
                    ].map((col) => (
                      <th 
                        key={col.key}
                        onClick={() => handleSort(col.key as keyof Movie)}
                        className="px-8 py-6 cursor-pointer hover:text-white transition-colors group whitespace-nowrap"
                      >
                        <div className="flex items-center gap-2">
                          {col.label} <SortIcon col={col.key as keyof Movie} />
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.03]">
                  {processedMovies.length > 0 ? (
                    processedMovies.map(movie => (
                      <tr key={movie.id} className="hover:bg-white/[0.01] transition-all group">
                        <td className="px-8 py-5 max-w-[240px]">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-[#ff6b00]/10 rounded-lg text-[#ff6b00] opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100">
                              <PlayCircle size={14} />
                            </div>
                            <span className="font-bold text-gray-200 text-sm truncate block" title={movie.title}>
                              {movie.title}
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-5 text-gray-500 font-mono text-xs max-w-[80px] truncate" title={String(movie.year)}>
                          {movie.year}
                        </td>
                        <td className="px-8 py-5 min-w-[120px]">
                          <span className={`text-[9px] font-black border px-3 py-1.5 rounded-full uppercase tracking-tighter inline-block ${getGenreColor(movie.genre)}`}>
                            {movie.genre}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-gray-400 text-sm font-light italic max-w-[150px] truncate" title={movie.director}>
                          {movie.director}
                        </td>
                        <td className="px-8 py-5 max-w-[100px]">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-1 bg-white/5 rounded-full overflow-hidden">
                              <div className="h-full bg-[#ff6b00]" style={{ width: `${movie.myRating * 10}%` }} />
                            </div>
                            <span className="font-black text-[#ff6b00] text-sm truncate">{movie.myRating.toFixed(1)}</span>
                          </div>
                        </td>
                        <td className="px-8 py-5 max-w-[80px]">
                           <div className="flex items-center gap-2 text-gray-500 text-sm truncate" title={movie.imdbRating.toFixed(1)}>
                             <Star size={12} className="text-yellow-500/40 fill-yellow-500/10" />
                             {movie.imdbRating.toFixed(1)}
                           </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-8 py-20 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <Search size={40} className="text-white/5" />
                          <p className="text-gray-500 text-xs font-black uppercase tracking-[0.3em]">No Data Matching Parameters</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}