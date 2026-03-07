"use client";
import React, { useState } from 'react';
import { mockMovies } from '@/lib/data';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, 
  XAxis, YAxis, ZAxis, Tooltip, AreaChart, Area, CartesianGrid, ScatterChart, Scatter
} from 'recharts';
import Sidebar from '@/components/Sidebar';
import { Menu } from 'lucide-react';

// Shared color mapping logic
const GENRE_COLORS: Record<string, string> = {
  'Sci-Fi': '#60a5fa', // blue-400
  'Crime': '#f87171',  // red-400
  'Thriller': '#c084fc', // purple-400
  'Action': '#fb923c',  // orange-400
  'Drama': '#34d399',  // emerald-400
  'War': '#facc15',    // yellow-400
  'Romance': '#f472b6', // pink-400
  'Horror': '#94a3b8',  // slate-300
  'Animation': '#22d3ee',// cyan-400
  'History': '#fbbf24'  // amber-500
};

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const ERA_COLORS = ['#ff6b6b', '#fb923c', '#eab308', '#22c55e', '#3b82f6'];

  // 1. Genre Data (Pie)
  const genreData = Object.entries(
    mockMovies.reduce((acc: any, m) => { acc[m.genre] = (acc[m.genre] || 0) + 1; return acc; }, {})
  ).map(([name, value]) => ({ name, value }));

  // 2. Era Data (Bar)
  const eraData = [
    { name: '<90', value: mockMovies.filter(m => m.year < 1990).length },
    { name: '90s', value: mockMovies.filter(m => m.year >= 1990 && m.year < 2000).length },
    { name: '00s', value: mockMovies.filter(m => m.year >= 2000 && m.year < 2010).length },
    { name: '10s', value: mockMovies.filter(m => m.year >= 2010 && m.year < 2020).length },
    { name: '20s+', value: mockMovies.filter(m => m.year >= 2020).length },
  ];

  const ratingData = [...mockMovies].sort((a,b) => a.myRating - b.myRating);

  const scatterData = mockMovies.map(m => ({ 
    title: m.title, 
    myRating: m.myRating, 
    imdb: m.imdbRating 
  }));

  return (
    <div className="flex min-h-screen bg-[#050505] text-white">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} activeTab="analytics" />
      
      <main className="flex-1 lg:ml-64 p-8 lg:p-12">
        <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden mb-8 p-2 bg-white/5 rounded-lg"><Menu /></button>
        
        <h2 className="text-4xl font-black uppercase tracking-tighter mb-12">System <span className="text-[#ff6b00]">Analytics</span></h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Genre Distribution - Color Coded */}
          <div className="bg-[#080808] p-8 rounded-3xl border border-white/5">
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-8">Genre Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={genreData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                    {genreData.map((entry, i) => (
                      <Cell key={i} fill={GENRE_COLORS[entry.name] || '#ffffff'} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{backgroundColor: '#000', borderRadius: '1rem', border: 'none'}} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Movies by Era */}
          <div className="bg-[#080808] p-8 rounded-3xl border border-white/5">
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-8">Movies by Era</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={eraData}>
                  <XAxis dataKey="name" stroke="#555" fontSize={10} />
                  <Tooltip contentStyle={{backgroundColor: '#000', borderRadius: '1rem', border: 'none'}} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {eraData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={ERA_COLORS[index % ERA_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ... Rest of your charts (AreaChart and ScatterChart) remain the same ... */}
          <div className="bg-[#080808] p-8 rounded-3xl border border-white/5 lg:col-span-2">
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-8">Personal vs. IMDb Ratings (Trend)</h3>
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
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-8">Rating Clusters (My vs IMDb)</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                  <XAxis type="number" dataKey="imdb" name="IMDb" domain={[0, 10]} stroke="#555" fontSize={10} />
                  <YAxis type="number" dataKey="myRating" name="My Rating" domain={[0, 10]} stroke="#555" fontSize={10} />
                  <ZAxis type="category" dataKey="title" name="Title" />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{backgroundColor: '#000', borderRadius: '1rem', border: 'none'}} />
                  <Scatter name="Movies" data={scatterData}>
                    {scatterData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.myRating > entry.imdb ? '#ff6b00' : '#444'} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[10px] text-gray-600 mt-4 uppercase tracking-widest font-bold">Orange dots: You rated higher than IMDb.</p>
          </div>
        </div>
      </main>
    </div>
  );
}