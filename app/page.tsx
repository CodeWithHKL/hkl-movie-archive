"use client";
import React, { useState, useMemo } from 'react';
import { mockMovies, Movie, GENRES } from '@/lib/data';
import { 
  Search, ChevronUp, ChevronDown, Filter, 
  LayoutDashboard, Star, Film, ExternalLink,
  Menu, X, PlayCircle
} from 'lucide-react';

type SortConfig = { key: keyof Movie; direction: 'asc' | 'desc' } | null;

const YEAR_RANGES = ['All', '<=1989', '1990-1999', '2000-2009', '2010-2019', '2020=>'];
const RATING_RANGES = ['All', '<=5.9', '6.0-6.9', '7.0-7.9', '8.0-8.9', '9.0-10'];

export default function MovieVault() {
  const [search, setSearch] = useState('');
  const [genreFilter, setGenreFilter] = useState('All');
  const [yearRange, setYearRange] = useState('All');
  const [myRatingRange, setMyRatingRange] = useState('All');
  const [imdbRatingRange, setImdbRatingRange] = useState('All');
  const [sort, setSort] = useState<SortConfig>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [activeTab, setActiveTab] = useState('movies');

  const handleLogoClick = () => {
    setIsSpinning(true);
    window.open('https://Myportfolio.com', '_blank');
    setTimeout(() => setIsSpinning(false), 800);
  };

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
      {/* --- SIDEBAR --- */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#080808] border-r border-white/5 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center gap-3 mb-12">
            <button 
              onClick={handleLogoClick}
              className={`w-10 h-10 bg-[#ff6b00] rounded-xl flex items-center justify-center font-black text-black text-xl shadow-lg shadow-[#ff6b00]/20 transition-all duration-700 ${isSpinning ? "rotate-[360deg]" : ""}`}
            >
              H
            </button>
            <span className="text-xl font-black tracking-tighter uppercase italic">Vault_</span>
          </div>

          <nav className="space-y-2 flex-1">
            {[
              { id: 'movies', label: 'Movies', icon: <Film size={18} /> },
              { id: 'analytics', label: 'Analytics', icon: <LayoutDashboard size={18} /> }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === item.id ? 'bg-[#ff6b00] text-black shadow-lg shadow-[#ff6b00]/10' : 'text-gray-500 hover:bg-white/5 hover:text-white'}`}
              >
                {item.icon} {item.label}
              </button>
            ))}
          </nav>

          <div className="mt-auto pt-6 border-t border-white/5">
            <a href="https://Myportfolio.com" target="_blank" className="flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all group">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-white transition-colors">Portfolio</span>
              <ExternalLink size={14} className="text-gray-600 group-hover:text-[#ff6b00]" />
            </a>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 lg:ml-64 p-4 md:p-8 lg:p-12 relative overflow-x-hidden">
        {/* Decorative background glow */}
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
              Cinema <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6b00] to-orange-400">Archive</span>
            </h2>
            <div className="flex items-center gap-3">
              <div className="h-px w-12 bg-[#ff6b00]"></div>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.3em]">System Version 3.0.1</p>
            </div>
          </div>

          {/* --- FILTERS --- */}
          <div className="space-y-6 mb-10">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#ff6b00]" />
                <input 
                  className="w-full bg-[#080808] border border-white/5 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-[#ff6b00]/50 outline-none transition-all placeholder:text-gray-700 text-sm"
                  placeholder="Search title, director, or cast..."
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="flex items-center bg-[#080808] border border-white/5 rounded-2xl px-5">
                <Filter size={16} className="text-gray-500 mr-3" />
                <select 
                  className="bg-transparent py-4 outline-none text-[10px] font-black uppercase tracking-widest cursor-pointer min-w-[140px]"
                  onChange={(e) => setGenreFilter(e.target.value)}
                >
                  {GENRES.map(g => <option key={g} value={g} className="bg-[#080808]">{g} Genre</option>)}
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

          {/* --- TABLE --- */}
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
                        className="px-8 py-6 cursor-pointer hover:text-white transition-colors group"
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
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-[#ff6b00]/10 rounded-lg text-[#ff6b00] opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100">
                              <PlayCircle size={14} />
                            </div>
                            <span className="font-bold text-gray-200 text-sm">{movie.title}</span>
                          </div>
                        </td>
                        <td className="px-8 py-5 text-gray-500 font-mono text-xs">{movie.year}</td>
                        <td className="px-8 py-5">
                          <span className="text-[9px] font-black bg-white/5 border border-white/10 text-gray-400 px-3 py-1.5 rounded-full uppercase tracking-tighter">
                            {movie.genre}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-gray-400 text-sm font-light italic">{movie.director}</td>
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-1 bg-white/5 rounded-full overflow-hidden">
                              <div className="h-full bg-[#ff6b00]" style={{ width: `${movie.myRating * 10}%` }} />
                            </div>
                            <span className="font-black text-[#ff6b00] text-sm">{movie.myRating.toFixed(1)}</span>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                           <div className="flex items-center gap-2 text-gray-500 text-sm">
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
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}