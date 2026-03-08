"use client";
import React, { useState } from 'react';
import { BEST_PICKS_COLLECTIONS } from '@/lib/collections';
import Sidebar from '@/components/Sidebar';
import { Menu, Star, Zap, Eye, BookOpen, Heart, Award } from 'lucide-react';

// Simple helper to give each section a unique icon and color theme
const getSectionTheme = (index: number) => {
  const themes = [
    { color: 'text-[#ff6b00]', border: 'hover:border-[#ff6b00]/50', icon: <Award className="w-5 h-5" /> },
    { color: 'text-blue-500', border: 'hover:border-blue-500/50', icon: <Zap className="w-5 h-5" /> },
    { color: 'text-purple-500', border: 'hover:border-purple-500/50', icon: <Eye className="w-5 h-5" /> },
    { color: 'text-emerald-500', border: 'hover:border-emerald-500/50', icon: <BookOpen className="w-5 h-5" /> },
    { color: 'text-red-500', border: 'hover:border-red-500/50', icon: <Heart className="w-5 h-5" /> },
    { color: 'text-amber-400', border: 'hover:border-amber-400/50', icon: <Star className="w-5 h-5" /> },
  ];
  return themes[index % themes.length];
};

export default function BestPicks() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#050505] text-white">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} activeTab="bestpicks" />
      
      <main className="flex-1 lg:ml-64 p-8 lg:p-12">
        <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden mb-8 p-2 bg-white/5 rounded-lg">
          <Menu />
        </button>
        
        <header className="mb-16 space-y-2">
          <h2 className="text-4xl font-black uppercase tracking-tighter">
            Best <span className="text-[#ff6b00]">Picks</span>
          </h2>
          <p className="text-gray-500 max-w-xl">
            Curated collections, manually selected by me.
          </p>
        </header>

        {BEST_PICKS_COLLECTIONS.map((col, idx) => {
          const theme = getSectionTheme(idx);
          const isFirst = idx === 0;

          return (
            <section key={idx} className="mb-20">
              <div className="mb-8 flex items-end justify-between border-b border-white/5 pb-4">
                <div>
                  <div className={`flex items-center gap-2 mb-1 ${theme.color}`}>
                    {theme.icon}
                    <span className="text-xs uppercase tracking-[0.2em] font-bold">Collection {idx + 1}</span>
                  </div>
                  <h3 className="text-2xl font-black uppercase italic tracking-tight">{col.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{col.description}</p>
                </div>
                <span className="text-xs text-white/20 font-mono">{col.movies.length} TITLES</span>
              </div>
              
              <div className={`grid gap-6 ${
                isFirst 
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-4" // Feature row: larger cards
                : "grid-cols-2 md:grid-cols-3 lg:grid-cols-5" // Standard row
              }`}>
                {col.movies.map(movie => (
                  <a 
                    key={movie.id} 
                    href={`https://www.google.com/search?q=${encodeURIComponent(`${movie.title} ${movie.year} movie`)}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block group"
                  >
                    <div className={`bg-[#080808] border border-white/5 rounded-2xl p-4 transition duration-500 ${theme.border} hover:scale-[1.02] hover:bg-white/[0.02]`}>
                      <div className={`aspect-[2/3] bg-white/5 rounded-lg mb-4 flex items-center justify-center font-black text-white/10 transition-colors duration-500 group-hover:text-white/20 ${isFirst ? 'text-6xl' : 'text-4xl'}`}>
                        {movie.title[0]}
                      </div>
                      <h4 className="font-bold text-sm truncate mb-1 group-hover:text-[#ff6b00] transition-colors">{movie.title}</h4>
                      <div className="flex justify-between items-center text-xs">
                        <span className={`${theme.color} font-black tracking-widest`}>{movie.myRating.toFixed(1)}</span>
                        <span className="text-gray-500 group-hover:text-gray-300 transition-colors">{movie.year}</span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </section>
          );
        })}
      </main>
    </div>
  );
}