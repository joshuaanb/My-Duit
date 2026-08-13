import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Header } from './components/Header';
import { BalanceSummary } from './components/BalanceSummary';
import { TransactionForm } from './components/TransactionForm';
import { AnalyticsCharts } from './components/AnalyticsCharts';
import { TransactionFilters } from './components/TransactionFilters';
import { TransactionList } from './components/TransactionList';
import { EditTransactionModal } from './components/EditTransactionModal';
import { translations } from './utils/i18n';
import { 
  loadTransactions, 
  saveTransactions, 
  resetToDemoData, 
  clearAllData,
  loadStartingBalance,
  saveStartingBalance,
  loadCurrency, 
  saveCurrency, 
  loadTheme, 
  saveTheme,
  loadLanguage,
  saveLanguage,
  exportToCSV 
} from './utils/storage';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export function App() {
  const [transactions, setTransactions] = useState([]);
  const [startingBalance, setStartingBalanceState] = useState(0);
  const [currency, setCurrencyState] = useState('USD');
  const [language, setLanguageState] = useState('en');
  const [theme, setThemeState] = useState('dark');
  const [selectedMonth, setSelectedMonth] = useState('all');

  // Filter & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all' | 'income' | 'expense'
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'oldest' | 'highest' | 'lowest'

  // Edit Modal State
  const [editingTx, setEditingTx] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Toast notification state
  const [toast, setToast] = useState(null);

  // Refs that always mirror the latest state — used by the beforeunload flush
  const transactionsRef = useRef([]);
  const startingBalanceRef = useRef(0);
  transactionsRef.current = transactions;
  startingBalanceRef.current = startingBalance;

  // Translation helper function
  const t = (key) => {
    const dict = translations[language] || translations.en;
    return dict[key] || translations.en[key] || key;
  };

  // Show Toast Helper
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // On mount: Load initial state from LocalStorage
  useEffect(() => {
    const loadedTx = loadTransactions();
    setTransactions(loadedTx);

    const loadedBal = loadStartingBalance();
    setStartingBalanceState(loadedBal);

    const savedCurr = loadCurrency();
    setCurrencyState(savedCurr);

    const savedLang = loadLanguage();
    setLanguageState(savedLang);

    const savedTh = loadTheme();
    setThemeState(savedTh);
    if (savedTh === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Safety-net: flush latest data to localStorage before the page unloads
  // (covers hard refresh, tab close, browser exit, etc.)
  useEffect(() => {
    const handleBeforeUnload = () => {
      saveTransactions(transactionsRef.current);
      saveStartingBalance(startingBalanceRef.current);
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // Sync starting balance changes
  const handleSetStartingBalance = (newBalance) => {
    setStartingBalanceState(newBalance);
    saveStartingBalance(newBalance);
    showToast(t('startingBalanceSaved'));
  };

  // Sync theme changes with DOM document element
  const handleSetTheme = (newTheme) => {
    setThemeState(newTheme);
    saveTheme(newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Sync currency changes
  const handleSetCurrency = (newCurrency) => {
    setCurrencyState(newCurrency);
    saveCurrency(newCurrency);
    showToast(`${t('currencyChanged')} ${newCurrency}`);
  };

  // Sync language changes
  const handleSetLanguage = (newLang) => {
    setLanguageState(newLang);
    saveLanguage(newLang);
    if (newLang === 'id' && currency === 'USD') {
      setCurrencyState('IDR');
      saveCurrency('IDR');
    }
    showToast(newLang === 'id' ? 'Bahasa diubah ke Bahasa Indonesia' : 'Language set to English');
  };

  // Add Transaction
  const handleAddTransaction = (newTx) => {
    const updated = [newTx, ...transactions];
    setTransactions(updated);
    saveTransactions(updated);
    showToast(newTx.type === 'income' ? t('incomeAdded') : t('expenseAdded'));
  };

  // Save Edit Transaction
  const handleSaveEdit = (editedTx) => {
    const updated = transactions.map(tx => tx.id === editedTx.id ? editedTx : tx);
    setTransactions(updated);
    saveTransactions(updated);
    showToast(t('txUpdated'));
  };

  // Delete Transaction
  const handleDeleteTransaction = (id) => {
    const updated = transactions.filter(tx => tx.id !== id);
    setTransactions(updated);
    saveTransactions(updated);
    showToast(t('txRemoved'), 'info');
  };

  // Reset to Demo Data
  const handleResetDemo = () => {
    const demo = resetToDemoData();
    setTransactions(demo);
    setStartingBalanceState(0);
    showToast(t('demoRestored'));
  };

  // Reset all figures to 0
  const handleResetZero = () => {
    const empty = clearAllData();
    setTransactions(empty);
    setStartingBalanceState(0);
    showToast(t('historyCleared'), 'info');
  };

  // Filter & Sort Logic
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter(tItem => {
        // Search query filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const noteMatch = (tItem.notes || '').toLowerCase().includes(q);
          const catMatch = (tItem.category || '').toLowerCase().includes(q);
          if (!noteMatch && !catMatch) return false;
        }

        // Type filter
        if (filterType !== 'all' && tItem.type !== filterType) {
          return false;
        }

        // Category filter
        if (filterCategory !== 'all' && tItem.category !== filterCategory) {
          return false;
        }

        // Month filter
        if (selectedMonth && selectedMonth !== 'all') {
          if (!tItem.date || !tItem.date.startsWith(selectedMonth)) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.date) - new Date(a.date);
        }
        if (sortBy === 'oldest') {
          return new Date(a.date) - new Date(b.date);
        }
        if (sortBy === 'highest') {
          return b.amount - a.amount;
        }
        if (sortBy === 'lowest') {
          return a.amount - b.amount;
        }
        return 0;
      });
  }, [transactions, searchQuery, filterType, filterCategory, selectedMonth, sortBy]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-3 bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-800 text-xs font-semibold animate-bounce">
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 text-amber-400" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Navigation Header */}
      <Header
        currency={currency}
        setCurrency={handleSetCurrency}
        language={language}
        setLanguage={handleSetLanguage}
        theme={theme}
        setTheme={handleSetTheme}
        onResetDemo={handleResetDemo}
        onResetZero={handleResetZero}
        onExportCSV={() => exportToCSV(transactions)}
        transactionCount={transactions.length}
        t={t}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-8">
        
        {/* Prominent Balance & Financial Overview */}
        <BalanceSummary
          transactions={transactions}
          startingBalance={startingBalance}
          setStartingBalance={handleSetStartingBalance}
          currency={currency}
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          onAddTransaction={handleAddTransaction}
          language={language}
          t={t}
        />

        {/* Analytics Charts Section */}
        <AnalyticsCharts
          transactions={transactions}
          currency={currency}
          selectedMonth={selectedMonth}
          language={language}
          t={t}
        />

        {/* 2-Column Main Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Transaction Input Form (5 cols on lg) */}
          <div className="lg:col-span-5 sticky top-20">
            <TransactionForm
              onAddTransaction={handleAddTransaction}
              currency={currency}
              language={language}
              t={t}
            />
          </div>

          {/* Right Column: Filters + History List (7 cols on lg) */}
          <div className="lg:col-span-7 space-y-4">
            
            <TransactionFilters
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filterType={filterType}
              setFilterType={setFilterType}
              filterCategory={filterCategory}
              setFilterCategory={setFilterCategory}
              sortBy={sortBy}
              setSortBy={setSortBy}
              resultCount={filteredTransactions.length}
              onClearFilters={() => {
                setSearchQuery('');
                setFilterType('all');
                setFilterCategory('all');
                setSortBy('newest');
              }}
              language={language}
              t={t}
            />

            <TransactionList
              transactions={filteredTransactions}
              currency={currency}
              onEditTransaction={(tx) => {
                setEditingTx(tx);
                setIsEditOpen(true);
              }}
              onDeleteTransaction={handleDeleteTransaction}
              onClearAll={handleResetZero}
              language={language}
              t={t}
            />

          </div>

        </div>

      </main>

      {/* Edit Modal */}
      <EditTransactionModal
        transaction={editingTx}
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setEditingTx(null);
        }}
        onSave={handleSaveEdit}
        currency={currency}
        language={language}
        t={t}
      />

      {/* Footer */}
      <footer className="mt-12 py-6 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
        <p>© 2026 FinanceFlow | Personal Finance Tracker. {language === 'id' ? 'Semua data tersimpan secara aman di peramban Anda.' : 'All data is saved securely in your browser\'s local storage.'}</p>
      </footer>

    </div>
  );
}

export default App;
