import React, { useState } from 'react';
import { 
  DEFAULT_INCOME_CATEGORIES, 
  DEFAULT_EXPENSE_CATEGORIES, 
  CURRENCIES 
} from '../types/finance';
import { getCategoryLabel } from '../utils/i18n';
import { 
  PlusCircle, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Calendar, 
  FileText, 
  Tag,
  Plus
} from 'lucide-react';

export const TransactionForm = ({ onAddTransaction, currency, language, t }) => {
  const todayStr = new Date().toISOString().split('T')[0];

  const [type, setType] = useState('expense'); // 'income' | 'expense'
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(DEFAULT_EXPENSE_CATEGORIES[0]);
  const [customCategory, setCustomCategory] = useState('');
  const [isCustomCat, setIsCustomCat] = useState(false);
  const [date, setDate] = useState(todayStr);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const currencySymbol = CURRENCIES.find(c => c.code === currency)?.symbol || '$';

  // Handle switching transaction type
  const handleTypeChange = (newType) => {
    setType(newType);
    setIsCustomCat(false);
    setCustomCategory('');
    if (newType === 'income') {
      setCategory(DEFAULT_INCOME_CATEGORIES[0]);
    } else {
      setCategory(DEFAULT_EXPENSE_CATEGORIES[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError(t('validationAmountErr'));
      return;
    }

    const finalCategory = isCustomCat ? (customCategory.trim() || 'Other') : category;
    if (!finalCategory) {
      setError(t('validationCategoryErr'));
      return;
    }

    const newTx = {
      id: `tx-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      type,
      amount: parsedAmount,
      category: finalCategory,
      date: date || todayStr,
      notes: notes.trim() || `${type === 'income' ? t('income') : t('expense')}`
    };

    onAddTransaction(newTx);

    // Reset form fields
    setAmount('');
    setNotes('');
    setIsCustomCat(false);
    setCustomCategory('');
  };

  const categoryOptions = type === 'income' ? DEFAULT_INCOME_CATEGORIES : DEFAULT_EXPENSE_CATEGORIES;

  return (
    <div className="glass-panel rounded-2xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-800/80">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <PlusCircle className="w-5 h-5 text-emerald-500" />
          {t('addTransaction')}
        </h3>
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          {t('quickEntry')}
        </span>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800/60 rounded-xl text-xs font-medium text-rose-600 dark:text-rose-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Type Toggle Tabs (Income vs Expense) */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl">
          <button
            type="button"
            onClick={() => handleTypeChange('income')}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg font-bold text-xs transition-all ${
              type === 'income'
                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <ArrowUpCircle className="w-4 h-4" />
            {t('income')}
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange('expense')}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg font-bold text-xs transition-all ${
              type === 'expense'
                ? 'bg-rose-500 text-white shadow-md shadow-rose-500/25'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <ArrowDownCircle className="w-4 h-4" />
            {t('expense')}
          </button>
        </div>

        {/* Amount Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            {t('amount')} ({currencySymbol})
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
              {currencySymbol}
            </span>
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              className="w-full pl-8 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 font-semibold text-base focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Category Selector */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              {t('category')}
            </label>
            <button
              type="button"
              onClick={() => setIsCustomCat(!isCustomCat)}
              className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              {isCustomCat ? t('selectPreset') : t('customCategory')}
            </button>
          </div>

          {!isCustomCat ? (
            <div className="relative">
              <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 font-medium text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/50 cursor-pointer"
              >
                {categoryOptions.map(cat => (
                  <option key={cat} value={cat}>
                    {getCategoryLabel(cat, language)}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <input
              type="text"
              placeholder={t('customCategoryPlaceholder')}
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/50 font-medium"
            />
          )}
        </div>

        {/* Date Picker */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            {t('date')}
          </label>
          <div className="relative">
            <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 font-medium text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>
        </div>

        {/* Notes / Description */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            {t('notesDescription')}
          </label>
          <div className="relative">
            <FileText className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <textarea
              rows="2"
              placeholder={t('notesPlaceholder')}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none font-medium placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={`w-full py-3 px-4 rounded-xl font-bold text-xs text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
            type === 'income'
              ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30'
              : 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/30'
          }`}
        >
          <Plus className="w-4 h-4" />
          {type === 'income' ? t('addIncomeBtn') : t('addExpenseBtn')}
        </button>

      </form>
    </div>
  );
};
