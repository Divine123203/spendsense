import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Expense, Currency } from '../types/expense';

interface ExpenseState {
  expenses: Expense[];
  settings: {
    currency: Currency;
  };
  addExpense: (expense: Expense) => void;
  deleteExpense: (id: string) => void;
  clearAllData: () => void;
  setCurrency: (currency: Currency) => void;
}

export const useExpenseStore = create<ExpenseState>()(
  persist(
    (set) => ({
      expenses: [],
      settings: {
        currency: { code: 'NGN', symbol: '₦', name: 'Nigerian Naira' },
      },

      // Adds a new expense (could be a single item or a grouped list)
      addExpense: (expense) =>
        set((state) => ({ 
          expenses: [...state.expenses, expense] 
        })),

      // Removes a single entry from the timeline
      deleteExpense: (id) =>
        set((state) => ({
          expenses: state.expenses.filter((expense) => expense.id !== id),
        })),

      // Erases everything for a fresh start
      clearAllData: () => set({ expenses: [] }),

      // Updates the global currency (Naira, Dollar, etc.)
      setCurrency: (currency) =>
        set((state) => ({
          settings: { ...state.settings, currency },
        })),
    }),
    {
      name: 'spendsense-storage', // This saves the data in the browser's memory
    }
  )
);