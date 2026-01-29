// src/types/expense.ts

export type Mood = 'Happy' | 'Neutral' | 'Sad' | 'Stressed';

export interface Currency {
  code: string;    // e.g., "NGN", "USD", "EUR"
  symbol: string;  // e.g., "₦", "$", "€"
  name: string;    // e.g., "Nigerian Naira"
}

export interface Expense {
  id: string;
  amount: number;
  currency: string;
  category: string;
  mood: 'Happy' | 'Neutral' | 'Sad' | 'Stressed';
  notes: string;
  date: string;
  // This is the line you are likely missing:
  items?: {
    id: string;
    amount: number;
    note: string;
    mood: string;
  }[]; 
}

export interface UserSettings {
  preferredCurrency: Currency;
  name?: string;
}