'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAddExpense } from '../hooks/useAddExpense';
import { useExpenseStore } from '../store/useExpenseStore';
import { v4 as uuidv4 } from 'uuid';

const moodOptions = [
  { label: 'Happy', emoji: '😊', color: 'bg-green-100', text: 'text-green-700' },
  { label: 'Neutral', emoji: '😐', color: 'bg-gray-100', text: 'text-gray-700' },
  { label: 'Sad', emoji: '😢', color: 'bg-blue-100', text: 'text-blue-700' },
  { label: 'Stressed', emoji: '😫', color: 'bg-red-100', text: 'text-red-700' },
];

export default function AddExpenseForm() {
  const { currency } = useAddExpense();
  const { addExpense } = useExpenseStore();
  
  const [currentAmount, setCurrentAmount] = useState('');
  const [currentNote, setCurrentNote] = useState('');
  const [currentMood, setCurrentMood] = useState('Neutral');
  const [pendingItems, setPendingItems] = useState<any[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);

  const pendingTotal = pendingItems.reduce((acc, item) => acc + item.amount, 0);

  const addItemToList = () => {
    if (!currentAmount || parseFloat(currentAmount) <= 0) return;
    const newItem = {
      id: uuidv4(),
      amount: parseFloat(currentAmount),
      note: currentNote || "Item " + (pendingItems.length + 1),
      mood: currentMood
    };
    setPendingItems([...pendingItems, newItem]);
    setCurrentAmount('');
    setCurrentNote('');
    setCurrentMood('Neutral');
  };

  const saveAllToStory = () => {
    if (pendingItems.length === 0) return;

    addExpense({
      id: uuidv4(),
      amount: pendingTotal,
      notes: pendingItems.length > 1 
        ? `Group Spend: ${pendingItems.length} items` 
        : pendingItems[0].note,
      mood: pendingItems[0].mood as any,
      date: new Date().toISOString(),
      currency: currency.code,
      category: 'Market/Shopping',
      // FIXED: Sending the actual list so the Timeline can show the breakdown
      items: pendingItems 
    });

    setPendingItems([]);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="w-full space-y-10 pb-10">
      
      {/* 1. RUNNING TOTAL - FIXED FOR BILLIONS */}
      <div className="bg-green-600 rounded-[3.5rem] p-8 md:p-10 text-white shadow-2xl border-b-[12px] border-green-800 overflow-hidden">
        <p className="text-xl font-black opacity-80 uppercase tracking-widest mb-2 text-center">Current List Total</p>
        <div className="flex flex-wrap justify-center items-baseline gap-2">
           <span className="text-3xl md:text-5xl font-bold">{currency.symbol}</span>
           <h3 className={`font-black text-center tracking-tighter break-all leading-tight ${
             pendingTotal > 999999999 ? 'text-5xl md:text-7xl' : 
             pendingTotal > 999999 ? 'text-6xl md:text-8xl' : 
             'text-7xl md:text-9xl'
           }`}>
             {pendingTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
           </h3>
        </div>
      </div>

      {/* 2. ITEM ENTRY BOX */}
      <div className="bg-white border-4 border-gray-100 p-8 md:p-12 rounded-[4rem] space-y-8 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <label className="text-xl font-black text-gray-400 uppercase ml-4">How Much?</label>
            <input 
              type="number"
              value={currentAmount}
              onChange={(e) => setCurrentAmount(e.target.value)}
              placeholder="0.00"
              className="w-full p-8 text-4xl md:text-5xl font-black bg-gray-50 rounded-[2.5rem] border-4 border-transparent focus:border-green-500 outline-none text-center"
            />
          </div>
          <div className="space-y-3">
            <label className="text-xl font-black text-gray-400 uppercase ml-4">What for?</label>
            <input 
              type="text"
              value={currentNote}
              onChange={(e) => setCurrentNote(e.target.value)}
              placeholder="e.g. Medicine"
              className="w-full p-8 text-2xl md:text-3xl font-bold bg-gray-50 rounded-[2.5rem] border-4 border-transparent focus:border-green-500 outline-none text-center"
            />
          </div>
        </div>

        {/* MOOD SELECTOR */}
        <div className="space-y-4">
          <p className="text-xl font-black text-gray-400 uppercase text-center">How does this item feel?</p>
          <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto">
            {moodOptions.map((m) => (
              <button
                key={m.label}
                onClick={() => setCurrentMood(m.label)}
                className={`flex flex-col items-center p-6 rounded-3xl border-4 transition-all ${
                  currentMood === m.label ? `border-gray-900 ${m.color} scale-105` : 'border-transparent bg-gray-50 opacity-40'
                }`}
              >
                <span className="text-5xl md:text-6xl">{m.emoji}</span>
              </button>
            ))}
          </div>
        </div>
        
        <button 
          onClick={addItemToList}
          className="w-full py-8 bg-green-50 text-green-600 text-3xl font-black rounded-[2.5rem] border-4 border-green-200 hover:bg-green-600 hover:text-white transition-all shadow-md active:scale-95"
        >
          + ADD ITEM TO LIST
        </button>
      </div>

      {/* 3. THE "RECEIPT" BREAKDOWN */}
      {pendingItems.length > 0 && (
        <div className="space-y-6 pt-6">
          <h4 className="text-3xl font-black text-gray-800 px-6 italic underline decoration-green-500 decoration-8 underline-offset-8">Your List Breakdown:</h4>
          <div className="space-y-4">
            {pendingItems.map((item) => (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                key={item.id} 
                className="flex justify-between items-center bg-white p-8 rounded-[2.5rem] border-4 border-gray-50"
              >
                <div className="flex items-center gap-6 overflow-hidden">
                  <span className="text-5xl shrink-0">{moodOptions.find(mo => mo.label === item.mood)?.emoji}</span>
                  <div className="min-w-0">
                    <p className="text-2xl font-black text-gray-800 truncate">{item.note}</p>
                    <p className="text-xl font-bold text-green-600 break-all">{currency.symbol}{item.amount.toLocaleString()}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setPendingItems(pendingItems.filter(i => i.id !== item.id))}
                  className="bg-red-50 p-5 rounded-full text-2xl hover:bg-red-500 hover:text-white transition-all shrink-0"
                >
                  🗑️
                </button>
              </motion.div>
            ))}
          </div>

          <button 
            onClick={saveAllToStory}
            className="w-full mt-10 py-10 bg-green-600 text-white text-3xl md:text-5xl font-black rounded-[4rem] shadow-2xl hover:bg-green-700 transition-all uppercase border-b-[15px] border-green-900"
          >
            Save Entire List
          </button>
        </div>
      )}

      {/* SUCCESS TOAST */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} 
            className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-10 py-6 rounded-[3rem] z-50 font-black text-xl shadow-2xl border-4 border-green-500 flex items-center gap-4"
          >
            <span className="text-4xl">📦</span>
            <span>LIST SAVED!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}