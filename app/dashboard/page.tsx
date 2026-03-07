"use client";
import React, { useState } from 'react';
import { mockMovies } from '@/lib/data';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, 
  XAxis, YAxis, Tooltip, AreaChart, Area, CartesianGrid, ScatterChart, Scatter, LabelList
} from 'recharts';
import Sidebar from '@/components/Sidebar';
import { Menu } from 'lucide-react';

const GENRE_COLORS: Record<string, string> = {
  'Sci-Fi': '#60a5fa', 'Crime': '#f87171', 'Thriller': '#c084fc', 
  'Action': '#fb923c', 'Drama': '#34d399', 'War': '#facc15', 
  'Romance': '#f472b6', 'Horror': '#94a3b8', 'Animation': '#22d3ee', 'History': '#fbbf24'
};

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const ERA_COLORS = ['#ff6b6b', '#fb923c', '#eab308', '#22c55e', '#3b82f6'];

  const genreData = Object.entries(
    mockMovies.reduce((acc: any, m) => { acc[m.genre] = (acc[m.genre] || 0) + 1; return acc; }, {})
  ).map(([name, value]) => ({ name, value }));

  const eraData = [
    { name: '<1990', value: mockMovies.filter(m => m.year < 1990).length },
    { name: '1990s', value: mockMovies.filter(m => m.year >= 1990 && m.year < 2000).length },
    { name: '2000s', value: mockMovies.filter(m => m.year >= 2000 && m.year < 2010).length },
    { name: '2010s', value: mockMovies.filter(m => m.year >= 2010 && m.year < 2020).length },
    { name: '2020s+', value: mockMovies.filter(m => m.year >= 2020).length },
  ];

  const ratingData = [...mockMovies].sort((a,b) => a.myRating - b.myRating);
  const scatterData = mockMovies.map(m => ({ title: m.title, myRating: m.myRating, imdb: m.imdbRating, genre: m.genre }));

  return (
    <div className="flex min-h-screen bg-[#050505] text-white">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} activeTab="analytics" />
      <main className="flex-1 lg:ml-64 p-8 lg:p-12">
        <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden mb-8 p-2 bg-white/5 rounded-lg"><Menu /></button>
        
        <div className="space-y-2 mb-12">
          <h2 className="text-4xl font-black uppercase tracking-tighter">
            List <span className="text-[#ff6b00]">Analytics</span>
          </h2>
          <p className="text-gray-500 max-w-xl">
            Set of charts that summarizes the overall data.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#080808] p-8 rounded-3xl border border-white/5">
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-8">Genre Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={genreData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, value }) => `${name}: ${value}`}>
                    {genreData.map((entry, i) => <Cell key={i} fill={GENRE_COLORS[entry.name] || '#ffffff'} />)}
                  </Pie>
                  <Tooltip contentStyle={{backgroundColor: '#000', borderRadius: '1rem', border: 'none'}} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-[#080808] p-8 rounded-3xl border border-white/5">
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-8">Movies by Era</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={eraData}>
                  <XAxis dataKey="name" stroke="#555" fontSize={10} />
                  <Tooltip cursor={{fill: '#111'}} contentStyle={{backgroundColor: '#000', borderRadius: '1rem', border: 'none'}} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    <LabelList dataKey="value" position="top" fill="#666" fontSize={10} />
                    {eraData.map((entry, index) => <Cell key={`cell-${index}`} fill={ERA_COLORS[index % ERA_COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-[#080808] p-8 rounded-3xl border border-white/5 lg:col-span-2">
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-8">Personal vs. IMDb Ratings</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={ratingData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                  <XAxis dataKey="title" hide />
                  <Tooltip contentStyle={{backgroundColor: '#000', borderRadius: '1rem', border: 'none'}} />
                  <Area type="monotone" dataKey="myRating" name="My Rating" stroke="#ff6b00" fill="#ff6b00" fillOpacity={0.2} />
                  <Area type="monotone" dataKey="imdbRating" name="IMDb Rating" stroke="#ffffff" fill="#ffffff" fillOpacity={0.05} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-[#080808] p-8 rounded-3xl border border-white/5 lg:col-span-2">
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-8">Rating Clusters</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                  <XAxis type="number" dataKey="imdb" name="IMDb" domain={[0, 10]} stroke="#555" fontSize={10} />
                  <YAxis type="number" dataKey="myRating" name="My Rating" domain={[0, 10]} stroke="#555" fontSize={10} />
                  <Tooltip 
                    cursor={{ strokeDasharray: '3 3' }} 
                    contentStyle={{backgroundColor: '#000', borderRadius: '1rem', border: '1px solid #333'}}
                    content={({ payload }) => {
                      if (payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-black p-3 rounded-xl border border-white/10 text-xs shadow-xl">
                            <p className="font-black text-white mb-1">{data.title}</p>
                            <p className="text-[#ff6b00]">My Rating: {data.myRating}</p>
                            <p className="text-gray-400">IMDb: {data.imdb}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Scatter name="Movies" data={scatterData}>
                    {scatterData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={GENRE_COLORS[entry.genre] || '#ffffff'} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-2 mt-6">
              {Object.entries(GENRE_COLORS).map(([genre, color]) => (
                <div key={genre} className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider" style={{ backgroundColor: color, color: '#000' }}>
                  {genre}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}