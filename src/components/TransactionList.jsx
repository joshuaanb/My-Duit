import React, { useState } from 'react';
import { CategoryIcon } from './CategoryIcon';
import { formatCurrency, formatDate } from '../utils/formatters';
import { getCategoryLabel } from '../utils/i18n';
import { 
  Edit3, 
  Trash2, 
  History, 
  Receipt 
} from 'lucide-react';

export const TransactionList = ({
  transactions,
  currency,
  onEditTransaction,
  onDeleteTransaction,
  onClearAll,
  language,
  t
}) => {
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const handleDelete = (id) => {
    onDeleteTransaction(id);
    setDeleteConfirmId(null);
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800/80">
      
      {/* Header Title & Clear All */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <History className="w-5 h-5 text-emerald-500" />
          {t('transactionHistory')}
        </h3>

        {transactions.length > 0 && (
          <button
            onClick={() => {
              if (window.confirm(t('clearAllConfirm') || 'Are you sure you want to delete all transactions?')) {
                onClearAll();
              }
            }}
            className="text-xs text-rose-500 hover:text-rose-600 font-medium hover:underline flex items-center gap-1"
          >
            {t('clearAllHistory')}
          </button>
        )}
      </div>

      {/* Transactions List */}
      {transactions.length === 0 ? (
        <div className="py-12 px-4 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Receipt className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
            {t('noTransactionsFound')}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            {t('noTxDesc')}
          </p>
        </div>
      ) : (
        <div className="space-y-2.5 max-h-[480px] sm:max-h-[600px] overflow-y-auto pr-1">
          {transactions.map((tx) => {
            const isIncome = tx.type === 'income';
            const isDeletingThis = deleteConfirmId === tx.id;

            return (
              <div
                key={tx.id}
                className={`group flex items-center justify-between p-3.5 rounded-xl border transition-all duration-200 ${
                  isIncome
                    ? 'bg-white/70 dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-800/80 hover:border-emerald-500/40'
                    : 'bg-white/70 dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-800/80 hover:border-rose-500/40'
                }`}
              >
                {/* Left side: Category Icon + Description + Date */}
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    isIncome
                      ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                      : 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
                  }`}>
                    <CategoryIcon category={tx.category} className="w-5 h-5" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h4 className="font-semibold text-xs text-slate-800 dark:text-slate-200 truncate">
                        {tx.notes || getCategoryLabel(tx.category, language)}
                      </h4>
                      <span className={`hidden sm:inline-flex px-2 py-0.5 text-[10px] font-bold rounded-full shrink-0 ${
                        isIncome
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50'
                          : 'bg-rose-50 text-rose-700 dark:bg-rose-950/80 dark:text-rose-400 border border-rose-200 dark:border-rose-800/50'
                      }`}>
                        {getCategoryLabel(tx.category, language)}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                      {formatDate(tx.date)}
                    </p>
                  </div>
                </div>

                {/* Right side: Amount + Actions */}
                <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-2">
                  
                  <div className="text-right">
                    <div className={`font-bold text-sm flex items-center justify-end gap-0.5 ${
                      isIncome 
                        ? 'text-emerald-600 dark:text-emerald-400' 
                        : 'text-rose-600 dark:text-rose-400'
                    }`}>
                      {isIncome ? '+' : '-'} {formatCurrency(tx.amount, currency)}
                    </div>
                  </div>

                  {/* Inline Delete Confirmation or Action Buttons */}
                  {isDeletingThis ? (
                    <div className="flex items-center gap-1.5 bg-rose-50 dark:bg-rose-950/80 p-1 rounded-xl border border-rose-200 dark:border-rose-800/60 animate-fadeIn">
                      <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 px-1">
                        {t('deleteConfirm')}
                      </span>
                      <button
                        onClick={() => handleDelete(tx.id)}
                        className="px-2 py-0.5 text-[10px] font-bold bg-rose-600 text-white rounded-lg hover:bg-rose-500"
                      >
                        {t('yes')}
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(null)}
                        className="px-2 py-0.5 text-[10px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg"
                      >
                        {t('no')}
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEditTransaction(tx)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        title="Edit transaction"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(tx.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors"
                        title="Delete transaction"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
