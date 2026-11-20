import test, { describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  getExpenseMonthKey,
  formatMonthYear,
  getLastNMonths,
  CATEGORIES,
} from '../../client/src/utils/constants.js';

// Sample test dataset
const mockExpenses = [
  {
    _id: '1',
    amount: 250.0,
    category: 'Food',
    description: 'Grocery supermarket haul',
    date: '2026-11-15T10:00:00.000Z',
    paymentMethod: 'Card',
  },
  {
    _id: '2',
    amount: 150.0,
    category: 'Food',
    description: 'Cafe coffee and snacks',
    date: '2026-11-18T14:30:00.000Z',
    paymentMethod: 'UPI',
  },
  {
    _id: '3',
    amount: 1200.0,
    category: 'Travel',
    description: 'Flight booking to Mumbai',
    date: '2026-10-05T08:00:00.000Z',
    paymentMethod: 'Card',
  },
  {
    _id: '4',
    amount: 600.0,
    category: 'Bills',
    description: 'Monthly broadband internet',
    date: '2026-10-25T11:00:00.000Z',
    paymentMethod: 'UPI',
  },
  {
    _id: '5',
    amount: 80.0,
    category: 'Entertainment',
    description: 'Movie ticket screening',
    date: '2026-09-12T18:00:00.000Z',
    paymentMethod: 'Cash',
  },
];

// Helper to simulate the exact client-side filter and sort pipeline
const applyFiltersAndSort = (expenses, options = {}) => {
  const {
    searchQuery = '',
    selectedCategory = 'all',
    selectedPaymentMethod = 'all',
    startDate = '',
    endDate = '',
    sortBy = 'newest',
  } = options;

  return expenses
    .filter((expense) => {
      // 1. Search (case-insensitive)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        if (!expense.description?.toLowerCase().includes(q)) return false;
      }
      // 2. Category
      if (selectedCategory !== 'all' && expense.category !== selectedCategory) {
        return false;
      }
      // 3. Payment Method
      if (selectedPaymentMethod !== 'all' && expense.paymentMethod !== selectedPaymentMethod) {
        return false;
      }
      // 4. Date range
      const expDateStr =
        typeof expense.date === 'string'
          ? expense.date.slice(0, 10)
          : new Date(expense.date).toISOString().slice(0, 10);

      if (startDate && expDateStr < startDate) return false;
      if (endDate && expDateStr > endDate) return false;

      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.date) - new Date(a.date);
      if (sortBy === 'oldest') return new Date(a.date) - new Date(b.date);
      if (sortBy === 'highest') return Number(b.amount) - Number(a.amount);
      if (sortBy === 'lowest') return Number(a.amount) - Number(b.amount);
      return 0;
    });
};

describe('1. Dataset Aggregation & Analytics', () => {
  test('Empty expense dataset: totals, categories, and months return 0/empty', () => {
    const emptyExpenses = [];
    const totalAmount = emptyExpenses.reduce((sum, e) => sum + e.amount, 0);
    assert.equal(totalAmount, 0);
    assert.equal(emptyExpenses.length, 0);

    const filtered = applyFiltersAndSort(emptyExpenses);
    assert.deepEqual(filtered, []);
  });

  test('One expense: calculates single category and exact total', () => {
    const singleExpense = [mockExpenses[0]]; // 250 in Food
    const total = singleExpense.reduce((sum, e) => sum + e.amount, 0);
    assert.equal(total, 250);

    const monthKey = getExpenseMonthKey(singleExpense[0].date);
    assert.equal(monthKey, '2026-11');
    assert.equal(formatMonthYear(monthKey), 'Nov 2026');
  });

  test('Multiple expenses in the same category: aggregates amounts correctly', () => {
    const foodExpenses = mockExpenses.filter((e) => e.category === 'Food');
    // 250 + 150 = 400
    const foodTotal = foodExpenses.reduce((sum, e) => sum + e.amount, 0);
    assert.equal(foodTotal, 400);
    assert.equal(foodExpenses.length, 2);
  });

  test('Multiple expenses across different months: groups accurately', () => {
    const monthsMap = {};
    mockExpenses.forEach((exp) => {
      const m = getExpenseMonthKey(exp.date);
      monthsMap[m] = (monthsMap[m] || 0) + exp.amount;
    });

    assert.equal(monthsMap['2026-11'], 400); // 250 + 150
    assert.equal(monthsMap['2026-10'], 1800); // 1200 + 600
    assert.equal(monthsMap['2026-09'], 80); // 80
  });

  test('Calendar month formatting handles empty months without shifting dates', () => {
    const last6 = getLastNMonths(6);
    assert.equal(last6.length, 6);
    // Ensure chronological ordering: oldest first, latest last
    assert.ok(last6[0] < last6[5]);

    // Test safe month extraction
    assert.equal(getExpenseMonthKey('2026-01-01T00:00:00.000Z'), '2026-01');
    assert.equal(formatMonthYear('2026-01'), 'Jan 2026');
  });
});

describe('2. Search, Filtering, and Sorting Pipeline', () => {
  test('Search by description is case-insensitive', () => {
    const resultsLower = applyFiltersAndSort(mockExpenses, { searchQuery: 'supermarket' });
    assert.equal(resultsLower.length, 1);
    assert.equal(resultsLower[0]._id, '1');

    const resultsUpper = applyFiltersAndSort(mockExpenses, { searchQuery: 'SUPERMARKET' });
    assert.equal(resultsUpper.length, 1);
    assert.equal(resultsUpper[0]._id, '1');

    const resultsPartial = applyFiltersAndSort(mockExpenses, { searchQuery: 'FLIGHT' });
    assert.equal(resultsPartial.length, 1);
    assert.equal(resultsPartial[0]._id, '3');
  });

  test('Search with no matching results returns empty array', () => {
    const results = applyFiltersAndSort(mockExpenses, { searchQuery: 'NonexistentSearchTerm12345' });
    assert.equal(results.length, 0);
  });

  test('Category filter isolates selected category', () => {
    const foodOnly = applyFiltersAndSort(mockExpenses, { selectedCategory: 'Food' });
    assert.equal(foodOnly.length, 2);
    assert.ok(foodOnly.every((e) => e.category === 'Food'));

    const travelOnly = applyFiltersAndSort(mockExpenses, { selectedCategory: 'Travel' });
    assert.equal(travelOnly.length, 1);
    assert.equal(travelOnly[0].category, 'Travel');
  });

  test('Payment method filter isolates payment type', () => {
    const cardOnly = applyFiltersAndSort(mockExpenses, { selectedPaymentMethod: 'Card' });
    assert.equal(cardOnly.length, 2); // 250 Food + 1200 Travel
    assert.ok(cardOnly.every((e) => e.paymentMethod === 'Card'));

    const cashOnly = applyFiltersAndSort(mockExpenses, { selectedPaymentMethod: 'Cash' });
    assert.equal(cashOnly.length, 1);
    assert.equal(cashOnly[0].paymentMethod, 'Cash');
  });

  test('Date range filter bounds transactions correctly', () => {
    // Range October 1st to October 31st
    const octoberOnly = applyFiltersAndSort(mockExpenses, {
      startDate: '2026-10-01',
      endDate: '2026-10-31',
    });
    assert.equal(octoberOnly.length, 2); // 1200 + 600
    assert.ok(octoberOnly.every((e) => e.date.startsWith('2026-10')));
  });

  test('Combining all filters together (Category + Payment Method + Date Range + Search)', () => {
    const combined = applyFiltersAndSort(mockExpenses, {
      searchQuery: 'flight',
      selectedCategory: 'Travel',
      selectedPaymentMethod: 'Card',
      startDate: '2026-10-01',
      endDate: '2026-10-31',
    });
    assert.equal(combined.length, 1);
    assert.equal(combined[0]._id, '3');

    // Mismatched payment method should yield 0 results
    const combinedMismatch = applyFiltersAndSort(mockExpenses, {
      searchQuery: 'flight',
      selectedCategory: 'Travel',
      selectedPaymentMethod: 'Cash', // Mismatch: was paid by Card
    });
    assert.equal(combinedMismatch.length, 0);
  });

  test('Sorting by amount: highest first and lowest first', () => {
    const highestFirst = applyFiltersAndSort(mockExpenses, { sortBy: 'highest' });
    assert.equal(highestFirst[0].amount, 1200.0); // Flight
    assert.equal(highestFirst[highestFirst.length - 1].amount, 80.0); // Movie

    const lowestFirst = applyFiltersAndSort(mockExpenses, { sortBy: 'lowest' });
    assert.equal(lowestFirst[0].amount, 80.0); // Movie
    assert.equal(lowestFirst[lowestFirst.length - 1].amount, 1200.0); // Flight
  });

  test('Sorting by date: newest first and oldest first', () => {
    const newestFirst = applyFiltersAndSort(mockExpenses, { sortBy: 'newest' });
    assert.equal(newestFirst[0]._id, '2'); // 2026-11-18
    assert.equal(newestFirst[newestFirst.length - 1]._id, '5'); // 2026-09-12

    const oldestFirst = applyFiltersAndSort(mockExpenses, { sortBy: 'oldest' });
    assert.equal(oldestFirst[0]._id, '5'); // 2026-09-12
    assert.equal(oldestFirst[oldestFirst.length - 1]._id, '2'); // 2026-11-18
  });
});

describe('3. Dashboard State Reactivity Simulation', () => {
  test('Simulates state update after adding an expense', () => {
    let state = [...mockExpenses];
    const newExpense = {
      _id: '6',
      amount: 300.0,
      category: 'Shopping',
      description: 'New shoes',
      date: '2026-11-20T12:00:00.000Z',
      paymentMethod: 'UPI',
    };

    // Prepend new expense
    state = [newExpense, ...state];
    assert.equal(state.length, 6);
    assert.equal(state[0]._id, '6');
    const newTotal = state.reduce((s, e) => s + e.amount, 0);
    assert.equal(newTotal, 2280 + 300); // 2580
  });

  test('Simulates state update after editing an expense', () => {
    let state = [...mockExpenses];
    // Update expense '1' from 250 to 500
    state = state.map((e) => (e._id === '1' ? { ...e, amount: 500.0 } : e));
    const updated = state.find((e) => e._id === '1');
    assert.equal(updated.amount, 500.0);
    const newTotal = state.reduce((s, e) => s + e.amount, 0);
    assert.equal(newTotal, 2280 + 250); // 2530
  });

  test('Simulates state update after deleting an expense', () => {
    let state = [...mockExpenses];
    // Remove expense '3' (1200)
    state = state.filter((e) => e._id !== '3');
    assert.equal(state.length, 4);
    assert.equal(state.find((e) => e._id === '3'), undefined);
    const newTotal = state.reduce((s, e) => s + e.amount, 0);
    assert.equal(newTotal, 2280 - 1200); // 1080
  });
});
