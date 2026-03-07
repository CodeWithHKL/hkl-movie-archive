"use client";
import React, { useState } from 'react';
import { BEST_PICKS_COLLECTIONS } from '@/lib/collections';
import Sidebar from '@/components/Sidebar';
import { Menu } from 'lucide-react';

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

        {BEST_PICKS_COLLECTIONS.map((col, idx) => (
          <section key={idx} className="mb-16">
            <div className="mb-8">
              <h3 className="text-xl font-bold">{col.title}</h3>
              <p className="text-sm text-gray-500">{col.description}</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {col.movies.map(movie => (
                <a 
                  key={movie.id} 
                  href={`https://www.google.com/search?q=${encodeURIComponent(`${movie.title} ${movie.year} movie`)}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block group"
                >
                  <div className="bg-[#080808] border border-white/5 rounded-2xl p-4 transition hover:border-[#ff6b00]/50 hover:scale-[1.02] duration-300">
                    <div className="aspect-[2/3] bg-white/5 rounded-lg mb-4 flex items-center justify-center font-black text-white/10 text-4xl">
                      {movie.title[0]}
                    </div>
                    <h4 className="font-bold text-sm truncate mb-1">{movie.title}</h4>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[#ff6b00] font-black">{movie.myRating.toFixed(1)}</span>
                      <span className="text-gray-500">{movie.year}</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}