import React from 'react';
import { 
  DEFAULT_INCOME_CATEGORIES, 
  DEFAULT_EXPENSE_CATEGORIES 
} from '../types/finance';
import { getCategoryLabel } from '../utils/i18n';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  SlidersHorizontal,
  X
} from 'lucide-react';

export const TransactionFilters = ({
  searchQuery,
  setSearchQuery,
  filterType,
  setFilterType,
  filterCategory,
  setFilterCategory,
  sortBy,
  setSortBy,
  resultCount,
  onClearFilters,
  language,
  t
}) => {
  // Combine all categories for category filter options
  const allCategories = Array.from(
    new Set([...DEFAULT_INCOME_CATEGORIES, ...DEFAULT_EXPENSE_CATEGORIES])
  );

  const hasActiveFilters = searchQuery || filterType !== 'all' || filterCategory !== 'all' || sortBy !== 'newest';

  return (
    <div className="glass-card rounded-2xl p-4 mb-5 border border-slate-200/80 dark:border-slate-800/80 space-y-3">
      
      {/* Top Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Controls Group */}
        <div className="flex items-center flex-wrap gap-1.5 sm:gap-2">
          
          {/* Type Filter */}
          <div className="flex items-center gap-1 bg-white dark:bg-slate-900 px-2 py-1 rounded-xl border border-slate-200 dark:border-slate-700/80 min-w-0">
            <Filter className="w-3.5 h-3.5 text-slate-400 ml-1 shrink-0" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-700 dark:text-slate-200 py-1 pr-1 focus:outline-none cursor-pointer max-w-[90px] sm:max-w-none"
            >
              <option value="all">{t('allTypes')}</option>
              <option value="income">{t('incomeOnly')}</option>
              <option value="expense">{t('expensesOnly')}</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1 bg-white dark:bg-slate-900 px-2 py-1 rounded-xl border border-slate-200 dark:border-slate-700/80 min-w-0">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 ml-1 shrink-0" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-700 dark:text-slate-200 py-1 pr-1 focus:outline-none cursor-pointer max-w-[100px] sm:max-w-[130px] truncate"
            >
              <option value="all">{t('allCategories')}</option>
              {allCategories.map(cat => (
                <option key={cat} value={cat}>
                  {getCategoryLabel(cat, language)}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By Selector */}
          <div className="flex items-center gap-1 bg-white dark:bg-slate-900 px-2 py-1 rounded-xl border border-slate-200 dark:border-slate-700/80 min-w-0">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 ml-1 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-700 dark:text-slate-200 py-1 pr-1 focus:outline-none cursor-pointer max-w-[90px] sm:max-w-none"
            >
              <option value="newest">{t('newestFirst')}</option>
              <option value="oldest">{t('oldestFirst')}</option>
              <option value="highest">{t('highestAmount')}</option>
              <option value="lowest">{t('lowestAmount')}</option>
            </select>
          </div>

        </div>
      </div>

      {/* Subheader: Results count & Reset Filters Button */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
        <span>
          {t('showing')} <strong className="text-slate-800 dark:text-slate-200">{resultCount}</strong> {t('transactionsCount')}
        </span>

        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            {t('clearFilters')}
          </button>
        )}
      </div>

    </div>
  );
};
