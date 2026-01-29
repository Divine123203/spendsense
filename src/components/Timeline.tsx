'use client';

import React, { useState } from 'react';
import { useExpenseStore } from '../store/useExpenseStore';
import { motion, AnimatePresence } from 'framer-motion';

const moodMap: Record<string, { emoji: string }> = {
  Happy: { emoji: '😊' },
  Neutral: { emoji: '😐' },
  Sad: { emoji: '😢' },
  Stressed: { emoji: '😫' },
};

export default function Timeline() {
  const { expenses, settings, deleteExpense } = useExpenseStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  // 1. STATE FOR THE CALENDAR JUMP
  const [selectedDate, setSelectedDate] = useState<string>('');

  // 2. FILTER LOGIC
  const filteredExpenses = selectedDate 
    ? expenses.filter(e => e.date.split('T')[0] === selectedDate)
    : expenses;

  if (expenses.length === 0) {
    return <div className="text-center py-20 text-3xl font-bold text-gray-400">Your story is empty.</div>;
  }

  return (
    <div className="w-full space-y-8 pb-20 px-2">
      
      {/* HEADER & CALENDAR JUMP */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h2 className="text-4xl font-black text-gray-900 border-b-8 border-green-500 inline-block">
            Spending Story
          </h2>
          <p className="text-gray-400 font-bold mt-2">
            {selectedDate ? `Showing spends for ${new Date(selectedDate).toDateString()}` : "Showing all history"}
          </p>
        </div>

        {/* CALENDAR INPUT BOX */}
        <div className="bg-white p-4 rounded-[2rem] border-4 border-gray-100 shadow-sm flex items-center gap-4">
          <span className="text-2xl">📅</span>
          <input 
            type="date" 
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="font-black text-lg text-gray-700 outline-none cursor-pointer"
          />
          {selectedDate && (
            <button 
              onClick={() => setSelectedDate('')}
              className="text-xs font-black text-red-500 bg-red-50 px-3 py-1 rounded-full uppercase"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* THE LIST */}
      <div className="space-y-6">
        {filteredExpenses.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-[3rem] border-4 border-dashed border-gray-200">
             <p className="text-6xl mb-4">🏜️</p>
             <p className="text-2xl font-bold text-gray-400">Nothing spent on this day.</p>
          </div>
        ) : (
          [...filteredExpenses].reverse().map((item: any) => (
            <motion.div
              key={item.id}
              layout
              onClick={() => item.items?.length > 0 && setExpandedId(expandedId === item.id ? null : item.id)}
              className={`bg-white border-4 rounded-[2.5rem] p-6 shadow-xl cursor-pointer overflow-hidden transition-all ${
                expandedId === item.id ? 'border-green-500 ring-8 ring-green-50' : 'border-gray-100'
              }`}
            >
              <div className="flex justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                  <span className="text-6xl shrink-0">{moodMap[item.mood]?.emoji || '💰'}</span>
                  <div className="min-w-0">
                    <p className="text-sm font-black text-green-600 uppercase bg-green-50 px-3 py-1 rounded-full inline-block">
                      {item.category}
                    </p>
                    <p className="text-gray-400 font-bold text-xs mt-1">
                      {new Date(item.date).toLocaleDateString('en-NG', { weekday: 'short', day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                </div>

                <div className="text-right flex-1 min-w-0">
                  <p className="text-3xl md:text-5xl font-black text-gray-900 break-all leading-tight">
                    <span className="text-xl text-green-600 mr-1">{settings.currency.symbol}</span>
                    {(Number(item.amount) || 0).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* INDIVIDUAL LIST BREAKDOWN (Same logic as before) */}
              <AnimatePresence>
                {expandedId === item.id && item.items && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                    <div className="mt-6 pt-6 border-t-4 border-dashed border-gray-200 space-y-3">
                      {item.items.map((sub: any) => (
                        <div key={sub.id} className="flex justify-between items-center bg-gray-50/50 p-4 rounded-2xl border-2 border-white">
                          <div className="flex items-center gap-3">
                            <span className="text-3xl">{moodMap[sub.mood]?.emoji || '🔹'}</span>
                            <span className="text-lg font-bold text-gray-700 capitalize">{sub.note}</span>
                          </div>
                          <span className="text-xl font-black text-gray-900">
                            {settings.currency.symbol}{sub.amount.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <button 
                onClick={(e) => { e.stopPropagation(); if(confirm("Delete?")) deleteExpense(item.id); }}
                className="mt-6 w-full text-right text-red-300 font-black text-xs uppercase"
              >
                🗑️ Delete Record
              </button>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}