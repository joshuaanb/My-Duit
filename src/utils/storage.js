import { INITIAL_DEMO_TRANSACTIONS } from '../types/finance';

const STORAGE_KEY = 'finance_tracker_transactions_v1';
const CURRENCY_KEY = 'finance_tracker_currency_v1';
const THEME_KEY = 'finance_tracker_theme_v1';
const LANGUAGE_KEY = 'finance_tracker_lang_v1';
const STARTING_BALANCE_KEY = 'finance_tracker_starting_bal_v1';

/**
 * Load transactions from localStorage or initialize empty
 */
export const loadTransactions = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to load transactions from localStorage:', err);
  }
  // Default to demo transactions on first visit
  saveTransactions(INITIAL_DEMO_TRANSACTIONS);
  return INITIAL_DEMO_TRANSACTIONS;
};

/**
 * Save transactions to localStorage
 */
export const saveTransactions = (transactions) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  } catch (err) {
    console.error('Failed to save transactions to localStorage:', err);
  }
};

/**
 * Reset transactions to demo dataset
 */
export const resetToDemoData = () => {
  saveTransactions(INITIAL_DEMO_TRANSACTIONS);
  saveStartingBalance(0);
  return INITIAL_DEMO_TRANSACTIONS;
};

/**
 * Clear all transaction data to 0
 */
export const clearAllData = () => {
  saveTransactions([]);
  saveStartingBalance(0);
  return [];
};

/**
 * Starting Balance persistence
 */
export const loadStartingBalance = () => {
  try {
    const val = localStorage.getItem(STARTING_BALANCE_KEY);
    return val ? parseFloat(val) || 0 : 0;
  } catch (err) {
    return 0;
  }
};

export const saveStartingBalance = (amount) => {
  try {
    localStorage.setItem(STARTING_BALANCE_KEY, amount.toString());
  } catch (err) {
    console.error('Failed to save starting balance:', err);
  }
};

/**
 * Currency persistence
 */
export const loadCurrency = () => {
  return localStorage.getItem(CURRENCY_KEY) || 'USD';
};

export const saveCurrency = (currency) => {
  localStorage.setItem(CURRENCY_KEY, currency);
};

/**
 * Theme persistence
 */
export const loadTheme = () => {
  return localStorage.getItem(THEME_KEY) || 'dark';
};

export const saveTheme = (theme) => {
  localStorage.setItem(THEME_KEY, theme);
};

/**
 * Language persistence
 */
export const loadLanguage = () => {
  return localStorage.getItem(LANGUAGE_KEY) || 'en';
};

export const saveLanguage = (lang) => {
  localStorage.setItem(LANGUAGE_KEY, lang);
};

/**
 * Export transactions to CSV format
 */
export const exportToCSV = (transactions) => {
  if (!transactions || transactions.length === 0) return;

  const headers = ['ID', 'Type', 'Amount', 'Category', 'Date', 'Notes'];
  const rows = transactions.map(t => [
    t.id,
    t.type,
    t.amount,
    `"${(t.category || '').replace(/"/g, '""')}"`,
    t.date,
    `"${(t.notes || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `finance_transactions_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
