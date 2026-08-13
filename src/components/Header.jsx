import React from 'react';
import { CURRENCIES } from '../types/finance';
import { 
  Sun, 
  Moon, 
  Wallet, 
  Download, 
  RotateCcw, 
  DollarSign, 
  Trash2,
  Sparkles
} from 'lucide-react';

export const Header = ({
  currency,
  setCurrency,
  language,
  setLanguage,
  theme,
  setTheme,
  onResetDemo,
  onResetZero,
  onExportCSV,
  transactionCount,
  t
}) => {
  return (
    <header className="sticky top-0 z-30 glass-panel border-b border-slate-200/80 dark:border-slate-800/80 px-3 sm:px-4 lg:px-8 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 dark:from-white dark:via-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
                  {t('appTitle')}
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50 rounded-full">
                  Pro
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {t('appSubtitle')}
              </p>
            </div>
          </div>

          {/* Mobile Theme & Lang Toggle */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={() => setLanguage(language === 'en' ? 'id' : 'en')}
              className="px-2 py-1 text-xs font-bold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
            >
              {language === 'en' ? '🇮🇩 ID' : '🇺🇸 EN'}
            </button>
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>
          </div>
        </div>

        {/* Right Header Toolbar */}
        <div className="flex items-center flex-wrap gap-1.5 sm:gap-2 w-full sm:w-auto justify-end sm:justify-end">
          
          {/* Language Switcher Button (EN / ID) — hidden on mobile (handled above) */}
          <div className="hidden sm:flex items-center bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700/60">
            <button
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1 ${
                language === 'en'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              🇺🇸 EN
            </button>
            <button
              onClick={() => setLanguage('id')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1 ${
                language === 'id'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              🇮🇩 ID
            </button>
          </div>

          {/* Currency Selector */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700/60">
            <DollarSign className="w-3.5 h-3.5 ml-1 text-slate-500 dark:text-slate-400 shrink-0" />
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-700 dark:text-slate-200 py-1 pr-2 rounded-lg focus:outline-none cursor-pointer max-w-[90px] sm:max-w-none"
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code} className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">
                  {c.code} ({c.symbol})
                </option>
              ))}
            </select>
          </div>

          {/* Reset Figures (0) Button */}
          <button
            onClick={onResetZero}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-medium text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 rounded-xl border border-rose-200 dark:border-rose-800/60 transition-colors"
            title="Reset all expense and income figures to 0"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 shrink-0" />
            <span className="hidden sm:inline">{t('resetZero')}</span>
          </button>

          {/* Load Demo Data Button */}
          <button
            onClick={onResetDemo}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-700/60 transition-colors"
            title="Load sample demo data"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 shrink-0" />
            <span className="hidden md:inline">{t('resetDemo')}</span>
          </button>

          {/* Export CSV Button */}
          <button
            onClick={onExportCSV}
            disabled={transactionCount === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-xl border border-emerald-200 dark:border-emerald-800/60 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden sm:inline">{t('exportCSV')}</span>
          </button>

          {/* Desktop Theme Toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="hidden sm:flex p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700/60 transition-colors"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>
        </div>

      </div>
    </header>
  );
};
