import React, { useMemo, useState } from 'react';
import { formatCurrency } from '../utils/formatters';
import { getCategoryLabel } from '../utils/i18n';
import { CURRENCIES } from '../types/finance';
import { 
  Wallet, 
  PiggyBank, 
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Edit3,
  Check,
  X
} from 'lucide-react';

export const BalanceSummary = ({
  transactions,
  startingBalance,
  setStartingBalance,
  currency,
  selectedMonth,
  setSelectedMonth,
  onAddTransaction,
  language,
  t
}) => {
  const [isEditingBalance, setIsEditingBalance] = useState(false);
  const [balanceInput, setBalanceInput] = useState(startingBalance.toString());

  const [isEditingIncome, setIsEditingIncome] = useState(false);
  const [incomeInput, setIncomeInput] = useState('');

  const currencySymbol = CURRENCIES.find(c => c.code === currency)?.symbol || '$';

  // Available months list for month selector
  const availableMonths = useMemo(() => {
    const monthsSet = new Set();
    transactions.forEach(tItem => {
      if (tItem.date && tItem.date.length >= 7) {
        monthsSet.add(tItem.date.substring(0, 7));
      }
    });
    return Array.from(monthsSet).sort().reverse();
  }, [transactions]);

  // Filter transactions based on selectedMonth ('all' or 'YYYY-MM')
  const filteredTransactions = useMemo(() => {
    if (!selectedMonth || selectedMonth === 'all') return transactions;
    return transactions.filter(tItem => tItem.date && tItem.date.startsWith(selectedMonth));
  }, [transactions, selectedMonth]);

  // Overall totals
  const totals = useMemo(() => {
    let income = 0;
    let expense = 0;

    filteredTransactions.forEach(tItem => {
      const amt = Number(tItem.amount) || 0;
      if (tItem.type === 'income') {
        income += amt;
      } else if (tItem.type === 'expense') {
        expense += amt;
      }
    });

    const netBalance = startingBalance + income - expense;
    const savingsRate = income > 0 ? Math.max(0, Math.round(((income - expense) / income) * 100)) : 0;

    return { income, expense, balance: netBalance, savingsRate };
  }, [filteredTransactions, startingBalance]);

  // Top expense category
  const topExpenseCategory = useMemo(() => {
    const categoryMap = {};
    filteredTransactions
      .filter(tItem => tItem.type === 'expense')
      .forEach(tItem => {
        categoryMap[tItem.category] = (categoryMap[tItem.category] || 0) + (Number(tItem.amount) || 0);
      });
    
    let topCat = 'None';
    let maxAmt = 0;
    Object.entries(categoryMap).forEach(([cat, amt]) => {
      if (amt > maxAmt) {
        maxAmt = amt;
        topCat = cat;
      }
    });
    return { name: topCat, amount: maxAmt };
  }, [filteredTransactions]);

  const handleSaveStartingBalance = (e) => {
    e.preventDefault();
    const val = parseFloat(balanceInput);
    if (!isNaN(val)) {
      setStartingBalance(val);
    }
    setIsEditingBalance(false);
  };

  const handleSaveIncomeAdjustment = (e) => {
    e.preventDefault();
    const val = parseFloat(incomeInput);
    if (!isNaN(val) && val > 0) {
      onAddTransaction({
        id: `tx-${Date.now()}`,
        type: 'income',
        amount: val,
        category: 'Salary',
        date: new Date().toISOString().split('T')[0],
        notes: language === 'id' ? 'Pemasukan Dasar' : 'Baseline Income'
      });
    }
    setIncomeInput('');
    setIsEditingIncome(false);
  };

  return (
    <section className="mb-8">
      {/* Timeframe Selector & Header Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
            {t('dashboardTitle')}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t('dashboardSubtitle')}
          </p>
        </div>

        {/* Month Selector Filter */}
        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <Calendar className="w-4 h-4 text-emerald-500" />
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">{t('period')}</span>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="bg-transparent text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="all">{t('allTime')}</option>
            {availableMonths.map(m => {
              const [yr, mo] = m.split('-');
              const dateObj = new Date(parseInt(yr), parseInt(mo) - 1, 1);
              const label = dateObj.toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', { month: 'short', year: 'numeric' });
              return (
                <option key={m} value={m}>
                  {label}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {/* Main Grid: Prominent Total Balance Card + Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
        
        {/* Card 1: Prominent Total Balance (Featured & Editable) */}
        <div className={`relative overflow-hidden rounded-2xl p-6 transition-all duration-300 ${
          totals.balance >= 0 
            ? 'bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white shadow-xl shadow-emerald-700/20' 
            : 'bg-gradient-to-br from-rose-600 via-rose-700 to-red-800 text-white shadow-xl shadow-rose-700/20'
        }`}>
          <div className="absolute -right-8 -bottom-8 w-36 h-36 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-white/80 flex items-center gap-1.5">
              <Wallet className="w-4 h-4" />
              {t('netBalance')}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setBalanceInput(startingBalance.toString());
                  setIsEditingBalance(!isEditingBalance);
                }}
                className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-all flex items-center gap-1"
                title={t('editStartingBalance')}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span className="text-[10px] hidden sm:inline">{t('startingBalance')}</span>
              </button>
              <span className={`px-2.5 py-1 text-xs font-semibold rounded-full backdrop-blur-md ${
                totals.balance >= 0 ? 'bg-white/20 text-white' : 'bg-black/20 text-white'
              }`}>
                {totals.balance >= 0 ? t('surplus') : t('deficit')}
              </span>
            </div>
          </div>

          {!isEditingBalance ? (
            <div className="mb-4">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
                {formatCurrency(totals.balance, currency)}
              </h3>
              <p className="text-xs text-white/70 mt-1 font-medium">
                {startingBalance !== 0 
                  ? `${t('startingBalance')}: ${formatCurrency(startingBalance, currency)}`
                  : (selectedMonth === 'all' ? t('overallBalanceDesc') : t('periodBalanceDesc'))
                }
              </p>
            </div>
          ) : (
            <form onSubmit={handleSaveStartingBalance} className="mb-4 space-y-2 bg-black/30 p-3 rounded-xl backdrop-blur-md">
              <label className="block text-[11px] font-semibold text-white/90">
                {t('editStartingBalance')} ({currencySymbol})
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.01"
                  value={balanceInput}
                  onChange={(e) => setBalanceInput(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white text-slate-900 rounded-lg text-sm font-bold focus:outline-none"
                  placeholder="0.00"
                  autoFocus
                />
                <button
                  type="submit"
                  className="p-2 bg-emerald-500 hover:bg-emerald-400 text-white rounded-lg font-bold"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingBalance(false)}
                  className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-lg font-bold"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* Savings Rate Bar Gauge */}
          <div className="pt-3 border-t border-white/20">
            <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
              <span className="flex items-center gap-1">
                <PiggyBank className="w-3.5 h-3.5" /> {t('savingsRate')}
              </span>
              <span className="font-bold">{totals.savingsRate}%</span>
            </div>
            <div className="w-full bg-black/20 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-500" 
                style={{ width: `${Math.min(100, Math.max(0, totals.savingsRate))}%` }}
              />
            </div>
          </div>
        </div>

        {/* Card 2: Total Income (Featured & Editable) */}
        <div className="glass-panel rounded-2xl p-6 flex flex-col justify-between border-l-4 border-l-emerald-500 hover:shadow-md transition-shadow relative">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {t('totalIncome')}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setIsEditingIncome(!isEditingIncome)}
                  className="p-1 text-slate-400 hover:text-emerald-500 transition-colors"
                  title={t('editIncome')}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </div>

            {!isEditingIncome ? (
              <>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight">
                  {formatCurrency(totals.income, currency)}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {t('incomeEarningsDesc')}
                </p>
              </>
            ) : (
              <form onSubmit={handleSaveIncomeAdjustment} className="my-2 space-y-2 bg-emerald-50 dark:bg-emerald-950/60 p-3 rounded-xl border border-emerald-200 dark:border-emerald-800">
                <label className="block text-[11px] font-semibold text-emerald-800 dark:text-emerald-200">
                  {t('editIncome')} ({currencySymbol})
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.01"
                    value={incomeInput}
                    onChange={(e) => setIncomeInput(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-emerald-300 rounded-lg text-sm font-bold focus:outline-none"
                    placeholder="0.00"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingIncome(false)}
                    className="p-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-bold"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
            <span>{t('incomeTxCount')}</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {filteredTransactions.filter(tItem => tItem.type === 'income').length}
            </span>
          </div>
        </div>

        {/* Card 3: Total Expenses */}
        <div className="glass-panel rounded-2xl p-6 flex flex-col justify-between border-l-4 border-l-rose-500 hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {t('totalExpenses')}
              </span>
              <div className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                <ArrowDownRight className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-rose-600 dark:text-rose-400 tracking-tight">
              {formatCurrency(totals.expense, currency)}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {t('expenseSpendingDesc')}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
            <span>{t('highestExpense')}</span>
            <span className="font-bold text-rose-600 dark:text-rose-400 truncate max-w-[80px] sm:max-w-[120px] text-right">
              {getCategoryLabel(topExpenseCategory.name, language)} ({formatCurrency(topExpenseCategory.amount, currency)})
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};
