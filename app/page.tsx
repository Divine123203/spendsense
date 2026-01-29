'use client';

import { useState } from 'react';
import CurrencySelector from '../src/components/CurrencySelector';
import AddExpenseForm from '../src/components/AddExpenseForm';
import Timeline from '../src/components/Timeline';
import Insights from '../src/components/insights'; // New Import

export default function Home() {
  // Added 'insights' to the view type
  const [view, setView] = useState<'add' | 'timeline' | 'insights' | 'settings'>('add');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans">
      
      {/* SIDEBAR - Desktop Only */}
      <aside className="hidden md:flex w-72 bg-white border-r flex-col p-8 sticky top-0 h-screen">
        <h1 className="text-3xl font-black text-green-600 mb-12 tracking-tighter">SPENDSENSE</h1>
        <nav className="space-y-3">
          {[
            { id: 'add', label: '+ Add Expense', icon: '' },
            { id: 'timeline', label: '📋 Story Timeline', icon: '' },
            { id: 'insights', label: '📊 My Patterns', icon: '' },
            { id: 'settings', label: '⚙️ Settings', icon: '' },
          ].map((item) => (
            <button 
              key={item.id}
              onClick={() => setView(item.id as any)} 
              className={`w-full text-left p-5 rounded-2xl transition-all text-lg ${
                view === item.id 
                ? 'bg-green-600 text-white font-black shadow-xl shadow-green-200' 
                : 'text-gray-500 hover:bg-gray-100 font-bold'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* MOBILE HEADER - Mobile Only */}
      <header className="md:hidden p-6 bg-white border-b flex justify-between items-center sticky top-0 z-20">
        <h1 className="text-2xl font-black text-green-600 tracking-tighter">SPENDSENSE</h1>
        <span className="text-[10px] font-black bg-green-100 text-green-700 px-3 py-1 rounded-full uppercase">Elder-Safe</span>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-4 md:p-12 lg:p-16 w-full mb-24 md:mb-0">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 p-8 md:p-16 min-h-[70vh]">
            {view === 'add' && <AddExpenseForm />}
            {view === 'timeline' && <Timeline />}
            {view === 'insights' && <Insights />}
            {view === 'settings' && <CurrencySelector />}
          </div>
        </div>
      </main>

      {/* MOBILE NAVIGATION - Fixed Bottom */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t flex justify-around p-4 pb-8 shadow-[0_-10px_30px_-5px_rgba(0,0,0,0.1)] z-30">
        <button onClick={() => setView('add')} className={`flex flex-col items-center gap-1 ${view === 'add' ? 'text-green-600' : 'text-gray-400'}`}>
          <span className="text-2xl">➕</span>
          <span className="text-[10px] font-black uppercase">Add</span>
        </button>
        <button onClick={() => setView('timeline')} className={`flex flex-col items-center gap-1 ${view === 'timeline' ? 'text-green-600' : 'text-gray-400'}`}>
          <span className="text-2xl">📖</span>
          <span className="text-[10px] font-black uppercase">Story</span>
        </button>
        <button onClick={() => setView('insights')} className={`flex flex-col items-center gap-1 ${view === 'insights' ? 'text-green-600' : 'text-gray-400'}`}>
          <span className="text-2xl">📊</span>
          <span className="text-[10px] font-black uppercase">Insights</span>
        </button>
        <button onClick={() => setView('settings')} className={`flex flex-col items-center gap-1 ${view === 'settings' ? 'text-green-600' : 'text-gray-400'}`}>
          <span className="text-2xl">⚙️</span>
          <span className="text-[10px] font-black uppercase">Settings</span>
        </button>
      </nav>
    </div>
  );
}