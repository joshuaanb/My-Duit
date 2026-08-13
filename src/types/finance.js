export const DEFAULT_INCOME_CATEGORIES = [
  'Salary',
  'Bonus',
  'Investment',
  'Other'
];

export const DEFAULT_EXPENSE_CATEGORIES = [
  'Food',
  'Transportation',
  'Shopping',
  'Bills',
  'Entertainment',
  'Health',
  'Other'
];

export const CATEGORY_COLORS = {
  // Income
  Salary: '#10B981', // Emerald
  Bonus: '#3B82F6', // Blue
  Investment: '#8B5CF6', // Purple
  
  // Expense
  Food: '#F59E0B', // Amber
  Transportation: '#06B6D4', // Cyan
  Shopping: '#EC4899', // Pink
  Bills: '#EF4444', // Red
  Entertainment: '#6366F1', // Indigo
  Health: '#14B8A6', // Teal
  
  // Generic
  Other: '#64748B' // Slate
};

export const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar ($)' },
  { code: 'EUR', symbol: '€', name: 'Euro (€)' },
  { code: 'GBP', symbol: '£', name: 'British Pound (£)' },
  { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah (Rp)' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen (¥)' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee (₹)' },
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar ($)' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar ($)' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar ($)' }
];

// Helper to get current YYYY-MM formatted string
const getMonthOffsetStr = (monthOffset = 0, day = 15) => {
  const d = new Date();
  d.setMonth(d.getMonth() + monthOffset);
  d.setDate(day);
  return d.toISOString().split('T')[0];
};

export const INITIAL_DEMO_TRANSACTIONS = [
  {
    id: 'tx-1',
    type: 'income',
    amount: 4500.00,
    category: 'Salary',
    date: getMonthOffsetStr(0, 1),
    notes: 'Monthly Software Engineering Salary'
  },
  {
    id: 'tx-2',
    type: 'expense',
    amount: 125.50,
    category: 'Food',
    date: getMonthOffsetStr(0, 3),
    notes: 'Weekly grocery store shopping at Whole Foods'
  },
  {
    id: 'tx-3',
    type: 'expense',
    amount: 45.00,
    category: 'Transportation',
    date: getMonthOffsetStr(0, 5),
    notes: 'Gas station refill'
  },
  {
    id: 'tx-4',
    type: 'income',
    amount: 350.00,
    category: 'Investment',
    date: getMonthOffsetStr(0, 8),
    notes: 'Quarterly stock dividend payout'
  },
  {
    id: 'tx-5',
    type: 'expense',
    amount: 120.00,
    category: 'Bills',
    date: getMonthOffsetStr(0, 10),
    notes: 'Electricity & High-speed Fiber Internet bill'
  },
  {
    id: 'tx-6',
    type: 'expense',
    amount: 85.00,
    category: 'Entertainment',
    date: getMonthOffsetStr(0, 12),
    notes: 'Concert tickets & weekend movie night'
  },
  {
    id: 'tx-7',
    type: 'expense',
    amount: 210.00,
    category: 'Shopping',
    date: getMonthOffsetStr(0, 14),
    notes: 'New running shoes & workout clothes'
  },
  {
    id: 'tx-8',
    type: 'income',
    amount: 750.00,
    category: 'Bonus',
    date: getMonthOffsetStr(0, 15),
    notes: 'Performance bonus payout'
  },
  {
    id: 'tx-9',
    type: 'expense',
    amount: 65.00,
    category: 'Health',
    date: getMonthOffsetStr(0, 18),
    notes: 'Pharmacy & monthly gym membership'
  },
  // Previous month demo data for trend charts
  {
    id: 'tx-10',
    type: 'income',
    amount: 4500.00,
    category: 'Salary',
    date: getMonthOffsetStr(-1, 1),
    notes: 'Monthly Salary (Prev Month)'
  },
  {
    id: 'tx-11',
    type: 'expense',
    amount: 480.00,
    category: 'Food',
    date: getMonthOffsetStr(-1, 10),
    notes: 'Monthly dining out & groceries'
  },
  {
    id: 'tx-12',
    type: 'expense',
    amount: 350.00,
    category: 'Bills',
    date: getMonthOffsetStr(-1, 15),
    notes: 'Rent contribution & utilities'
  },
  {
    id: 'tx-13',
    type: 'expense',
    amount: 190.00,
    category: 'Shopping',
    date: getMonthOffsetStr(-1, 20),
    notes: 'Home essentials'
  },
  {
    id: 'tx-14',
    type: 'income',
    amount: 4200.00,
    category: 'Salary',
    date: getMonthOffsetStr(-2, 1),
    notes: 'Monthly Salary (2 Months Ago)'
  },
  {
    id: 'tx-15',
    type: 'expense',
    amount: 520.00,
    category: 'Food',
    date: getMonthOffsetStr(-2, 12),
    notes: 'Groceries'
  },
  {
    id: 'tx-16',
    type: 'expense',
    amount: 230.00,
    category: 'Transportation',
    date: getMonthOffsetStr(-2, 18),
    notes: 'Train pass & taxi rides'
  }
];
