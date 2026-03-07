"use client";
import React from 'react';
import { Film, LayoutDashboard, ExternalLink, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  activeTab: 'movies' | 'analytics';
}

export default function Sidebar({ isOpen, setIsOpen, activeTab }: SidebarProps) {
  const router = useRouter();

  // Navigation and closing sidebar on mobile
  const handleNavigate = (path: string) => {
    router.push(path);
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Sidebar Container */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#080808] border-r border-white/5 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#ff6b00] rounded-xl flex items-center justify-center font-black text-black text-xl shadow-lg shadow-[#ff6b00]/20">
                H
              </div>
              <span className="text-xl font-black tracking-tighter uppercase italic text-white">HKLX</span>
            </div>
            {/* Mobile Close Button */}
            <button 
              onClick={() => setIsOpen(false)} 
              className="lg:hidden text-gray-500 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="space-y-2 flex-1">
            <button
              onClick={() => handleNavigate('/')}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] transition-all ${
                activeTab === 'movies' 
                  ? 'bg-[#ff6b00] text-black shadow-lg shadow-[#ff6b00]/10' 
                  : 'text-gray-500 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Film size={18} /> Movies
            </button>
            <button
              onClick={() => handleNavigate('/dashboard')}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] transition-all ${
                activeTab === 'analytics' 
                  ? 'bg-[#ff6b00] text-black shadow-lg shadow-[#ff6b00]/10' 
                  : 'text-gray-500 hover:bg-white/5 hover:text-white'
              }`}
            >
              <LayoutDashboard size={18} /> Analytics
            </button>
          </nav>

          <div className="mt-auto pt-6 border-t border-white/5">
            <a 
              href="https://hklxportfolio.vercel.app" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all group"
            >
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-white transition-colors">Portfolio</span>
              <ExternalLink size={14} className="text-gray-600 group-hover:text-[#ff6b00]" />
            </a>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile: Closes sidebar when clicking outside */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}