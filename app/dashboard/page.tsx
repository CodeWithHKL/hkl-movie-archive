"use client";
import React, { useState, useMemo } from 'react';
import { mockMovies } from '@/lib/data';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, 
  XAxis, YAxis, Tooltip, AreaChart, Area, CartesianGrid, ScatterChart, Scatter, LabelList
} from 'recharts';
import Sidebar from '@/components/Sidebar';
import { Menu, XCircle, Filter } from 'lucide-react';

const GENRE_COLORS: Record<string, string> = {
  'Sci-Fi': '#60a5fa', 'Crime': '#f87171', 'Thriller': '#c084fc', 
  'Action': '#fb923c', 'Drama': '#34d399', 'War': '#facc15', 
  'Romance': '#f472b6', 'Horror': '#94a3b8', 'Animation': '#22d3ee', 'Comedy': '#ffffff', 'History': '#fbbf24'
};

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [selectedEra, setSelectedEra] = useState<string | null>(null);
  
  const ERA_COLORS = ['#ff6b6b', '#fb923c', '#eab308', '#22c55e', '#3b82f6'];

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

  const genreData = useMemo(() => Object.entries(
    mockMovies.reduce((acc: any, m) => { acc[m.genre] = (acc[m.genre] || 0) + 1; return acc; }, {})
  ).map(([name, value]) => ({ name, value })), []);

  const eraData = useMemo(() => [
    { name: '<1990', value: mockMovies.filter(m => m.year < 1990).length },
    { name: '1990s', value: mockMovies.filter(m => m.year >= 1990 && m.year < 2000).length },
    { name: '2000s', value: mockMovies.filter(m => m.year >= 2000 && m.year < 2010).length },
    { name: '2010s', value: mockMovies.filter(m => m.year >= 2010 && m.year < 2020).length },
    { name: '2020s+', value: mockMovies.filter(m => m.year >= 2020).length },
  ], []);

  const ratingData = useMemo(() => [...filteredMovies].sort((a,b) => a.myRating - b.myRating), [filteredMovies]);
  const scatterData = useMemo(() => filteredMovies.map(m => ({ title: m.title, myRating: m.myRating, imdb: m.imdbRating, genre: m.genre })), [filteredMovies]);

  return (
    <div className="flex min-h-screen bg-[#050505] text-white">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} activeTab="analytics" />
      
      <main className="flex-1 lg:ml-64 p-8 lg:p-12">
        <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden mb-8 p-2 bg-white/5 rounded-lg"><Menu /></button>
        
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <h2 className="text-4xl font-black uppercase tracking-tighter">
              List <span className="text-[#ff6b00]">Analytics</span>
            </h2>
            <div className="flex flex-wrap items-center gap-2 text-gray-500 text-sm">
              <Filter size={14} />
              <span>{filteredMovies.length} Movies shown</span>
              {(selectedGenre || selectedEra) && (
                <div className="flex gap-2 ml-2">
                  {selectedGenre && <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded text-[10px] font-bold uppercase">{selectedGenre}</span>}
                  {selectedEra && <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded text-[10px] font-bold uppercase">{selectedEra}</span>}
                </div>
              )}
            </div>
          </div>
          
          {(selectedGenre || selectedEra) && (
            <button 
              onClick={() => { setSelectedGenre(null); setSelectedEra(null); }}
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#ff6b00] bg-[#ff6b00]/10 px-4 py-2 rounded-full hover:bg-[#ff6b00]/20 transition-all"
            >
              <XCircle size={14} /> Reset All Filters
            </button>
          )}
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Genre Pie */}
          <div className="bg-[#080808] p-8 rounded-3xl border border-white/5">
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-8">Filter by Genre</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={genreData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}
                    onClick={(data) => setSelectedGenre(selectedGenre === data.name ? null : data.name)}
                    className="cursor-pointer outline-none"
                    // Conditional Label Logic
                    label={({ name, percent }) => {
                      if (selectedGenre && selectedGenre !== name) return null;
                      return `${name} (${(percent * 100).toFixed(0)}%)`;
                    }}
                  >
                    {genreData.map((entry, i) => (
                      <Cell 
                        key={i} fill={GENRE_COLORS[entry.name] || '#ffffff'} 
                        fillOpacity={selectedGenre ? (selectedGenre === entry.name ? 1 : 0.1) : 1}
                        stroke={selectedGenre === entry.name ? '#fff' : 'none'}
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{backgroundColor: '#000', borderRadius: '1rem', border: 'none'}} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Era Bar */}
          <div className="bg-[#080808] p-8 rounded-3xl border border-white/5">
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-8">Filter by Era</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={eraData}>
                  <XAxis dataKey="name" stroke="#555" fontSize={10} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{fill: 'transparent'}} contentStyle={{backgroundColor: '#000', borderRadius: '1rem', border: 'none'}} />
                  <Bar 
                    dataKey="value" 
                    radius={[6, 6, 0, 0]} 
                    onClick={(data) => setSelectedEra(selectedEra === data.name ? null : data.name)}
                    className="cursor-pointer"
                  >
                    {/* Conditional LabelList Logic */}
                    <LabelList 
                      dataKey="value" 
                      position="top" 
                      fill="#fff" 
                      fontSize={11} 
                      fontWeight="bold"
                      content={(props: any) => {
                        const { x, y, width, value, index } = props;
                        const entryName = eraData[index].name;
                        if (selectedEra && selectedEra !== entryName) return null;
                        return (
                          <text x={x + width / 2} y={y - 10} fill="#fff" fontSize={11} fontWeight="bold" textAnchor="middle">
                            {value}
                          </text>
                        );
                      }}
                    />
                    {eraData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={ERA_COLORS[index % ERA_COLORS.length]} 
                        fillOpacity={selectedEra ? (selectedEra === entry.name ? 1 : 0.1) : 1}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Area Chart */}
          <div className="bg-[#080808] p-8 rounded-3xl border border-white/5 lg:col-span-2">
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-8 italic">
              Displaying {selectedGenre || 'All Genres'} in {selectedEra || 'All Eras'}
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={ratingData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" vertical={false} />
                  <XAxis dataKey="title" hide />
                  <Tooltip contentStyle={{backgroundColor: '#000', borderRadius: '1rem', border: 'none'}} />
                  <Area type="monotone" dataKey="myRating" name="My Rating" stroke="#ff6b00" fill="#ff6b00" fillOpacity={0.15} strokeWidth={3} />
                  <Area type="monotone" dataKey="imdbRating" name="IMDb Rating" stroke="#ffffff" fill="#ffffff" fillOpacity={0.05} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Scatter Chart */}
          <div className="bg-[#080808] p-8 rounded-3xl border border-white/5 lg:col-span-2">
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-8">Cross-Rating Cluster</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid stroke="#1a1a1a" strokeDasharray="5 5" />
                  <XAxis type="number" dataKey="imdb" name="IMDb" domain={[0, 10]} stroke="#444" fontSize={10} />
                  <YAxis type="number" dataKey="myRating" name="My Rating" domain={[0, 10]} stroke="#444" fontSize={10} />
                  <Tooltip 
                    content={({ payload }) => {
                      if (payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-black p-4 rounded-2xl border border-white/10 text-xs shadow-2xl">
                            <p className="font-black text-white mb-2 text-sm">{data.title}</p>
                            <div className="flex justify-between gap-4">
                              <span className="text-[#ff6b00]">Me: {data.myRating}</span>
                              <span className="text-gray-400">IMDb: {data.imdb}</span>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Scatter name="Movies" data={scatterData}>
                    {scatterData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={GENRE_COLORS[entry.genre] || '#ffffff'} strokeWidth={1} stroke="#000" />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}