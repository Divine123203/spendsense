'use client';

import React, { useState } from 'react';
import { useExpenseStore } from '../store/useExpenseStore';
import { motion, AnimatePresence } from 'framer-motion';

// 1. Define the Types to stop the "item: any" errors
interface SubItem {
  id: string;
  note: string;
  amount: number;
  mood?: string;
}

interface Expense {
  id: string;
  category: string;
  amount: number;
  date: string;
  mood: string;
  items?: SubItem[];
}

const moodMap: Record<string, { emoji: string }> = {
  Happy: { emoji: '😊' },
  Neutral: { emoji: '😐' },
  Sad: { emoji: '😢' },
  Stressed: { emoji: '😫' },
};

export default function Timeline() {
  // 2. Ensure your store provides these 3 things
  const { expenses, settings, deleteExpense } = useExpenseStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');

  // 3. Filter logic with proper date handling
  const filteredExpenses = selectedDate 
    ? expenses.filter((e: Expense) => e.date.split('T')[0] === selectedDate)
    : expenses;

  if (expenses.length === 0) {
    return <div className="text-center py-20 text-3xl font-bold text-gray-400">Your story is empty.</div>;
  }

  return (
    <div className="w-full space-y-8 pb-20 px-2">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h2 className="text-4xl font-black text-gray-900 border-b-8 border-green-500 inline-block">
            Spending Story
          </h2>
          <p className="text-gray-400 font-bold mt-2">
            {selectedDate ? `Showing ${new Date(selectedDate).toDateString()}` : "Showing all history"}
          </p>
        </div>

        {/* CALENDAR INPUT - Fixed for Dark Mode Visibility */}
        <div className="bg-white p-4 rounded-[2rem] border-4 border-gray-100 shadow-sm flex items-center gap-4">
          <span className="text-2xl">📅</span>
          <input 
            type="date" 
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="font-black text-lg text-gray-700 bg-white outline-none cursor-pointer"
          />
          {selectedDate && (
            <button 
              onClick={() => setSelectedDate('')}
              className="text-xs font-black text-red-500 bg-red-50 px-3 py-1 rounded-full"
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
             <p className="text-2xl font-bold text-gray-400">Nothing here.</p>
          </div>
        ) : (
          [...filteredExpenses].reverse().map((item: Expense) => (
            <motion.div
              key={item.id}
              layout
              onClick={() => item.items && item.items.length > 0 && setExpandedId(expandedId === item.id ? null : item.id)}
              className={`bg-white border-4 rounded-[2.5rem] p-4 md:p-6 shadow-xl cursor-pointer overflow-hidden transition-all ${
                expandedId === item.id ? 'border-green-500 ring-4 ring-green-50' : 'border-gray-100'
              }`}
            >
              <div className="flex justify-between items-center gap-2">
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-4xl md:text-6xl">{moodMap[item.mood]?.emoji || '💰'}</span>
                  <div className="min-w-0">
                    <p className="text-[10px] md:text-sm font-black text-green-600 uppercase bg-green-50 px-2 py-0.5 rounded-full inline-block">
                      {item.category}
                    </p>
                    <p className="text-gray-400 font-bold text-[10px] mt-1">
                      {new Date(item.date).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                </div>
                </div>

               <div className="text-right flex-1 min-w-0">
  <p className="text-xl md:text-4xl font-black text-gray-900 leading-tight flex flex-wrap justify-end items-baseline">
    <span className="text-xs md:text-lg text-green-600 mr-0.5">
      {settings?.currency?.symbol || '$'}
    </span>
    {/* Removed truncate so the full number shows */}
    <span className="whitespace-nowrap">
      {Number(item.amount).toLocaleString()}
    </span>
  </p>
</div>

              <AnimatePresence>
                {expandedId === item.id && item.items && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                    <div className="mt-6 pt-6 border-t-4 border-dashed border-gray-100 space-y-3">
                      {item.items.map((sub: SubItem) => (
                        <div key={sub.id} className="flex justify-between items-center bg-gray-50/50 p-4 rounded-2xl">
                          <span className="font-bold text-gray-700">{sub.note}</span>
                          <span className="font-black text-gray-900">
                            {settings?.currency?.symbol || '$'}{sub.amount.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <button 
                onClick={(e) => { e.stopPropagation(); if(confirm("Delete?")) deleteExpense(item.id); }}
                className="mt-4 w-full text-right text-red-200 hover:text-red-500 font-black text-[10px] uppercase transition-colors"
              >
                🗑️ Delete
              </button>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}