import { useState } from 'react';
import { useExpenseStore } from '../store/useExpenseStore';
import { v4 as uuidv4 } from 'uuid';
import { Mood } from '../types/expense';
import { EXPENSE_CATEGORIES } from '../utils/categories';

export const useAddExpense = () => {
  const { addExpense, settings } = useExpenseStore();
  
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0].label);
  const [mood, setMood] = useState<Mood>('Neutral');
  const [notes, setNotes] = useState(''); // This is for the description

  const handleSave = () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert("Please enter a valid amount");
      return false;
    }

    addExpense({
      id: uuidv4(),
      amount: parseFloat(amount),
      currency: settings.currency.code,
      category,
      mood,
      notes,
      date: new Date().toISOString(),
    });

    // Reset the form after saving
    setAmount('');
    setNotes('');
    setMood('Neutral');
    
    return true; // Return success
  };

  // Ensure these names match EXACTLY what you are destructuring in the Form
  return { 
    amount, 
    setAmount, 
    category, 
    setCategory, 
    mood, 
    setMood, 
    notes, 
    setNotes, 
    handleSave, 
    currency: settings.currency 
  };
};