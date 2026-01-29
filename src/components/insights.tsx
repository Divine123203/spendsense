'use client';

import React, { useState, useEffect } from 'react';
import { useExpenseStore } from '../store/useExpenseStore';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const MOOD_COLORS: Record<string, string> = {
  Happy: '#22c55e',    // Green
  Neutral: '#94a3b8',  // Gray
  Sad: '#3b82f6',      // Blue
  Stressed: '#ef4444', // Red
};

const tips = [
  "Elders often find that reviewing the 'Story Timeline' on Sunday evenings helps plan a more peaceful week ahead.",
  "Check your 'Stressed' spends from last week. Is there a pattern you can break today?",
  "A small savings today is a giant cushion for tomorrow's comfort.",
  "Reviewing your spending story with a cup of tea makes the numbers feel less like math and more like memories.",
  "Notice which category brings you the most 'Happy' emojis. Maybe that's where your true value lies.",
  "Financial peace isn't about having a lot; it's about knowing exactly where 'a lot' is going.",
  "Before a big spend, check your timeline. Does this purchase align with the story you want to tell?",
  "The best time to plan your budget was yesterday; the second best time is right now."
];

export default function Insights() {
  const { expenses } = useExpenseStore();
  const [currentTip, setCurrentTip] = useState("");

  // 1. Pick a random tip when the component loads
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * tips.length);
    setCurrentTip(tips[randomIndex]);
  }, []);

  // 2. Group expenses by mood for the chart
  const data = Object.keys(MOOD_COLORS).map(mood => ({
    name: mood,
    value: expenses.filter(e => e.mood === mood).length
  })).filter(item => item.value > 0);

  if (expenses.length === 0) {
    return (
      <div className="text-center p-20 text-2xl font-bold text-gray-400">
        Add some expenses to see your patterns!
      </div>
    );
  }

  return (
    <div className="w-full space-y-12">
      <h2 className="text-4xl md:text-5xl font-black text-gray-900 border-b-8 border-green-500 inline-block">
        Spending Reflection
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        {/* THE CHART SECTION */}
        <div className="h-[400px] md:h-[500px] bg-white rounded-[3rem] p-6 shadow-inner border-4 border-gray-50">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={140}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={MOOD_COLORS[entry.name]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '20px', border: 'none', fontWeight: 'bold' }} 
              />
              <Legend iconSize={20} wrapperStyle={{ fontSize: '18px', fontWeight: 'bold', paddingTop: '20px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* THE NARRATIVE & DYNAMIC TIPS */}
        <div className="space-y-6">
          {/* Stats Summary Card */}
          <div className="p-8 bg-green-50 rounded-[2.5rem] border-4 border-green-200">
            <h3 className="text-2xl font-black text-green-800 mb-2">The Good News</h3>
            <p className="text-xl text-green-700 leading-relaxed">
              You’ve logged <strong>{expenses.length}</strong> spends. 
              {expenses.filter(e => e.mood === 'Happy').length > 0 
                ? " It’s great to see you're finding joy in some of your purchases!"
                : " Keep tracking to see your happiness trends grow."}
            </p>
          </div>

          {/* DYNAMIC TIP CARD - Changes every time you view Insights */}
          <div className="p-8 bg-blue-50 rounded-[2.5rem] border-l-[12px] border-blue-400 shadow-sm">
            <div className="flex items-start gap-4">
              <span className="text-5xl">💡</span>
              <div>
                <h3 className="text-2xl font-black text-blue-900 uppercase tracking-tighter">Tip for You</h3>
                <p className="text-xl text-blue-800 font-medium italic mt-2 leading-relaxed">
                  "{currentTip}"
                </p>
              </div>
            </div>
          </div>
          
          {/* Mood Balance Note */}
          <div className="p-6 bg-gray-50 rounded-[2rem] border-2 border-gray-200">
            <p className="text-gray-500 font-bold italic text-center">
              "Your spending is a mirror. What story is it telling today?"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}