'use client';

import React from 'react';
import { useExpenseStore } from '../store/useExpenseStore';
import { CURRENCIES } from '../utils/currencies';

export default function CurrencySelector() {
  // 1. Destructure clearAllData from your store
  const { settings, setCurrency, clearAllData } = useExpenseStore();

  return (
    <div className="w-full space-y-10">
      <div className="text-center space-y-4">
        <h2 className="text-3xl md:text-5xl font-black text-gray-900">Settings</h2>
        <p className="text-xl text-gray-500 font-bold">Choose your preferred currency</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CURRENCIES.map((currency) => (
          <button
            key={currency.code}
            onClick={() => setCurrency(currency)}
            className={`p-6 md:p-8 rounded-[2rem] border-4 text-left transition-all ${
              settings.currency.code === currency.code
                ? 'border-green-600 bg-green-50 shadow-lg'
                : 'border-gray-100 hover:border-gray-200'
            }`}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-2xl font-black text-gray-800">{currency.name}</p>
                <p className="text-lg text-gray-500 font-bold">{currency.code}</p>
              </div>
              <span className="text-4xl font-black text-green-600">{currency.symbol}</span>
            </div>
          </button>
        ))}
      </div>

      {/* --- PASTE THE DANGER ZONE HERE --- */}
      <div className="mt-20 pt-10 border-t-8 border-red-50">
        <div className="bg-red-50/50 p-8 md:p-12 rounded-[3rem] border-4 border-red-100 text-center">
          <h3 className="text-3xl font-black text-red-600 mb-4 uppercase tracking-tighter">Danger Zone</h3>
          <p className="text-xl text-gray-600 mb-8 font-bold leading-relaxed">
            Warning: This button will delete your entire spending story forever. 
            Only use this if you want to start fresh from zero.
          </p>
          <button 
            onClick={() => {
              if(window.confirm("FINAL WARNING: Are you 100% sure you want to delete EVERY expense? This cannot be undone.")) {
                clearAllData(); // Uses the function we added to the store
                alert("All data has been cleared.");
              }
            }}
            className="w-full py-8 bg-white text-red-600 text-2xl font-black rounded-[2rem] border-4 border-red-200 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all shadow-md"
          >
            ERASE EVERYTHING
          </button>
        </div>
      </div>
      {/* --- END OF DANGER ZONE --- */}

    </div>
  );
}