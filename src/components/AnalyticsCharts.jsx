import React, { useMemo, useState } from 'react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip as RechartsTooltip, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import { formatCurrency, getCategoryColor } from '../utils/formatters';
import { getCategoryLabel } from '../utils/i18n';
import { PieChart as PieIcon, BarChart2 } from 'lucide-react';

// Custom Pie Chart Tooltip — defined outside component to avoid re-mount on every render
const CustomPieTooltip = ({ active, payload, currency, t }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900 text-white p-3 rounded-xl border border-slate-700 shadow-xl text-xs font-medium">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.color }} />
          <span className="font-bold">{data.name}</span>
        </div>
        <div className="text-slate-300">
          {t('amount')}: <span className="font-bold text-white">{formatCurrency(data.value, currency)}</span>
        </div>
        <div className="text-slate-400 text-[11px]">
          {t('share')}: <span className="font-bold text-emerald-400">{data.percentage}%</span>
        </div>
      </div>
    );
  }
  return null;
};

// Custom Bar Chart Tooltip — defined outside component to avoid re-mount on every render
const CustomBarTooltip = ({ active, payload, label, currency, t }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white p-3 rounded-xl border border-slate-700 shadow-xl text-xs font-medium space-y-1">
        <div className="font-bold text-slate-300 pb-1 border-b border-slate-800">
          {label}
        </div>
        {payload.map((entry, idx) => (
          <div key={idx} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5" style={{ color: entry.color }}>
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              {entry.name}:
            </span>
            <span className="font-bold text-white">
              {formatCurrency(entry.value, currency)}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const AnalyticsCharts = ({ transactions, currency, selectedMonth, language, t }) => {
  const [chartType, setChartType] = useState('bar'); // 'bar' | 'pie'

  // Calculate Expense Breakdown by Category for Donut/Pie Chart
  const expenseByCategoryData = useMemo(() => {
    const map = {};
    let totalExp = 0;

    transactions
      .filter(tx => {
        if (tx.type !== 'expense') return false;
        if (selectedMonth && selectedMonth !== 'all') {
          return tx.date && tx.date.startsWith(selectedMonth);
        }
        return true;
      })
      .forEach(tx => {
        const amt = Number(tx.amount) || 0;
        map[tx.category] = (map[tx.category] || 0) + amt;
        totalExp += amt;
      });

    return Object.entries(map)
      .map(([rawName, value]) => ({
        rawName,
        name: getCategoryLabel(rawName, language),
        value,
        color: getCategoryColor(rawName),
        percentage: totalExp > 0 ? ((value / totalExp) * 100).toFixed(1) : '0'
      }))
      .sort((a, b) => b.value - a.value);
  }, [transactions, selectedMonth, language]);

  // Calculate Monthly Trends (Income vs Expense)
  const monthlyTrendData = useMemo(() => {
    const monthsMap = {};

    transactions.forEach(tx => {
      if (!tx.date || tx.date.length < 7) return;
      const monthKey = tx.date.substring(0, 7); // YYYY-MM
      
      if (!monthsMap[monthKey]) {
        monthsMap[monthKey] = { monthKey, income: 0, expense: 0 };
      }

      const amt = Number(tx.amount) || 0;
      if (tx.type === 'income') {
        monthsMap[monthKey].income += amt;
      } else if (tx.type === 'expense') {
        monthsMap[monthKey].expense += amt;
      }
    });

    // Convert map to sorted array (chronological order)
    return Object.values(monthsMap)
      .sort((a, b) => a.monthKey.localeCompare(b.monthKey))
      .map(item => {
        const [yr, mo] = item.monthKey.split('-');
        const dateObj = new Date(parseInt(yr), parseInt(mo) - 1, 1);
        const label = dateObj.toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', { month: 'short', year: '2-digit' });
        return {
          ...item,
          label
        };
      });
  }, [transactions, language]);

  // (Tooltip components moved above component to prevent re-mount on every render)

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800/80 mb-8">
      {/* Header & Chart Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-indigo-500" />
            {t('financialAnalytics')}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t('analyticsSubtitle')}
          </p>
        </div>

        {/* View Toggle (Monthly Trend vs Category Breakdown) */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl">
          <button
            onClick={() => setChartType('bar')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              chartType === 'bar'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            {t('incomeVsExpense')}
          </button>
          <button
            onClick={() => setChartType('pie')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              chartType === 'pie'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <PieIcon className="w-3.5 h-3.5" />
            {t('expensesByCategory')}
          </button>
        </div>
      </div>

      {/* Chart View Content */}
      <div className="w-full">
        {chartType === 'bar' ? (
          monthlyTrendData.length > 0 ? (
            <div className="h-56 sm:h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 11 }}
                    stroke="#94a3b8"
                  />
                  <YAxis
                    tick={{ fontSize: 10 }}
                    stroke="#94a3b8"
                    tickFormatter={(val) => val >= 1000 ? `${val / 1000}k` : val}
                  />
                  <RechartsTooltip content={<CustomBarTooltip currency={currency} t={t} />} />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Bar dataKey="income" name={t('income')} fill="#10B981" radius={[6, 6, 0, 0]} maxBarSize={40} />
                  <Bar dataKey="expense" name={t('expense')} fill="#EF4444" radius={[6, 6, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-56 sm:h-72 flex flex-col items-center justify-center text-slate-400 text-xs">
              {t('noTrendData')}
            </div>
          )
        ) : (
          expenseByCategoryData.length > 0 ? (
            /* On mobile: stacked column (auto height). On sm+: 2-col grid with fixed height */
            <div className="flex flex-col sm:grid sm:grid-cols-2 sm:h-72 gap-4 items-start sm:items-center">
              {/* Pie/Donut SVG */}
              <div className="h-52 sm:h-full w-full relative shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expenseByCategoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={85}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {expenseByCategoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip content={<CustomPieTooltip currency={currency} t={t} />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Category Breakdown Table / Badges */}
              <div className="space-y-2 overflow-y-auto max-h-52 sm:max-h-72 pr-2 w-full">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  {t('expenseCategoryDistribution')}
                </h4>
                {expenseByCategoryData.map(item => (
                  <div key={item.rawName} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-slate-900 dark:text-slate-100">
                        {formatCurrency(item.value, currency)}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                        {item.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-56 sm:h-72 flex flex-col items-center justify-center text-slate-400 text-xs">
              {t('noExpenseData')}
            </div>
          )
        )}
      </div>
    </div>
  );
};
