import test, { describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import Expense, { ALLOWED_CATEGORIES, ALLOWED_PAYMENT_METHODS } from '../src/models/expenseModel.js';
import { validateExpense, validateExpenseId } from '../src/middleware/validate.js';
import { checkDbConnection } from '../src/middleware/dbCheck.js';
import { notFound, errorHandler } from '../src/middleware/errorHandler.js';
import {
  getExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
  getExpenseSummary,
} from '../src/controllers/expenseController.js';

// Helper to create mock Express request and response objects
const createMockReqRes = (options = {}) => {
  const req = {
    method: options.method || 'GET',
    params: options.params || {},
    query: options.query || {},
    body: options.body || {},
    originalUrl: options.originalUrl || '/api/expenses',
    ...options.req,
  };

  const res = {
    statusCode: 200,
    jsonData: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.jsonData = data;
      return this;
    },
  };

  return { req, res };
};

describe('1. Mongoose Expense Schema & Validations', () => {
  test('Rejects expense with missing required fields', () => {
    const expense = new Expense({});
    const error = expense.validateSync();
    assert.ok(error, 'Validation error should be generated');
    assert.ok(error.errors.amount, 'amount should be required');
    assert.ok(error.errors.category, 'category should be required');
    assert.ok(error.errors.description, 'description should be required');
    assert.ok(error.errors.date, 'date should be required');
  });

  test('Rejects non-positive amounts (0 and negative)', () => {
    const zeroExpense = new Expense({
      amount: 0,
      category: 'Food',
      description: 'Coffee',
      date: new Date(),
    });
    assert.ok(zeroExpense.validateSync().errors.amount);

    const negExpense = new Expense({
      amount: -15.5,
      category: 'Food',
      description: 'Snack',
      date: new Date(),
    });
    assert.ok(negExpense.validateSync().errors.amount);
  });

  test('Accepts valid positive amount and defaults paymentMethod to "Cash"', () => {
    const validExpense = new Expense({
      amount: 49.99,
      category: 'Food',
      description: 'Groceries',
      date: new Date('2026-11-20'),
    });
    const err = validExpense.validateSync();
    assert.equal(err, undefined);
    assert.equal(validExpense.paymentMethod, 'Cash');
  });

  test('Enforces allowed category enum', () => {
    const invalidCat = new Expense({
      amount: 100,
      category: 'Cryptocurrency',
      description: 'Tokens',
      date: new Date(),
    });
    assert.ok(invalidCat.validateSync().errors.category);

    ALLOWED_CATEGORIES.forEach((cat) => {
      const exp = new Expense({
        amount: 25,
        category: cat,
        description: `Expense for ${cat}`,
        date: new Date(),
      });
      assert.equal(exp.validateSync(), undefined, `Category "${cat}" should be accepted`);
    });
  });

  test('Enforces allowed paymentMethod enum', () => {
    const invalidPM = new Expense({
      amount: 50,
      category: 'Shopping',
      description: 'Shoes',
      date: new Date(),
      paymentMethod: 'Bitcoins',
    });
    assert.ok(invalidPM.validateSync().errors.paymentMethod);

    ALLOWED_PAYMENT_METHODS.forEach((pm) => {
      const exp = new Expense({
        amount: 50,
        category: 'Shopping',
        description: `Item paid via ${pm}`,
        date: new Date(),
        paymentMethod: pm,
      });
      assert.equal(exp.validateSync(), undefined, `Payment method "${pm}" should be accepted`);
    });
  });

  test('Trims description whitespace automatically', () => {
    const exp = new Expense({
      amount: 30,
      category: 'Health',
      description: '   Vitamins and supplements   ',
      date: new Date(),
    });
    assert.equal(exp.description, 'Vitamins and supplements');
  });
});

describe('2. Validation & Security Middleware', () => {
  test('validateExpenseId: rejects malformed ObjectId with 400 Bad Request', () => {
    const { req, res } = createMockReqRes({ params: { id: 'invalid-id-123' } });
    let nextCalled = false;

    validateExpenseId(req, res, () => {
      nextCalled = true;
    });

    assert.equal(nextCalled, false);
    assert.equal(res.statusCode, 400);
    assert.equal(res.jsonData.success, false);
    assert.equal(res.jsonData.error, 'Invalid ID Format');
  });

  test('validateExpenseId: passes valid 24-character hex ObjectId', () => {
    const validId = new mongoose.Types.ObjectId().toString();
    const { req, res } = createMockReqRes({ params: { id: validId } });
    let nextCalled = false;

    validateExpenseId(req, res, () => {
      nextCalled = true;
    });

    assert.equal(nextCalled, true);
    assert.equal(res.statusCode, 200);
  });

  test('validateExpense: rejects missing required fields on POST', () => {
    const { req, res } = createMockReqRes({
      method: 'POST',
      body: { amount: -5, category: 'InvalidCat' },
    });
    let nextCalled = false;

    validateExpense(req, res, () => {
      nextCalled = true;
    });

    assert.equal(nextCalled, false);
    assert.equal(res.statusCode, 400);
    assert.equal(res.jsonData.success, false);
    assert.ok(res.jsonData.errors.length >= 3);
  });

  test('validateExpense: passes valid expense creation payload on POST', () => {
    const { req, res } = createMockReqRes({
      method: 'POST',
      body: {
        amount: 85.5,
        category: 'Food',
        description: 'Team Lunch',
        date: '2026-11-20',
        paymentMethod: 'UPI',
      },
    });
    let nextCalled = false;

    validateExpense(req, res, () => {
      nextCalled = true;
    });

    assert.equal(nextCalled, true);
    assert.equal(res.statusCode, 200);
  });

  test('validateExpense: rejects empty body on PUT update', () => {
    const { req, res } = createMockReqRes({
      method: 'PUT',
      body: {},
    });
    let nextCalled = false;

    validateExpense(req, res, () => {
      nextCalled = true;
    });

    assert.equal(nextCalled, false);
    assert.equal(res.statusCode, 400);
    assert.equal(res.jsonData.error, 'Validation Error');
  });

  test('validateExpense: passes valid partial update on PUT', () => {
    const { req, res } = createMockReqRes({
      method: 'PUT',
      body: { amount: 120.0 },
    });
    let nextCalled = false;

    validateExpense(req, res, () => {
      nextCalled = true;
    });

    assert.equal(nextCalled, true);
    assert.equal(res.statusCode, 200);
  });

  test('checkDbConnection: rejects with 503 Service Unavailable when DB is disconnected', () => {
    // Current readyState is 0 (disconnected)
    const { req, res } = createMockReqRes();
    let nextCalled = false;

    checkDbConnection(req, res, () => {
      nextCalled = true;
    });

    if (mongoose.connection.readyState !== 1) {
      assert.equal(nextCalled, false);
      assert.equal(res.statusCode, 503);
      assert.equal(res.jsonData.success, false);
      assert.equal(res.jsonData.error, 'Database Unavailable');
    }
  });

  test('notFound middleware: returns 404 with method and path', () => {
    const { req, res } = createMockReqRes({ method: 'GET', originalUrl: '/api/unknown' });
    notFound(req, res, () => {});
    assert.equal(res.statusCode, 404);
    assert.equal(res.jsonData.success, false);
    assert.ok(res.jsonData.message.includes('/api/unknown'));
  });

  test('errorHandler middleware: formats generic errors with 500 status', () => {
    const { req, res } = createMockReqRes();
    const testError = new Error('Database connection failed');
    errorHandler(testError, req, res, () => {});
    assert.equal(res.statusCode, 500);
    assert.equal(res.jsonData.success, false);
    assert.equal(res.jsonData.message, 'Database connection failed');
  });
});

describe('3. Database Integration Tests (CRUD & Analytics)', () => {
  let isDbConnected = false;
  let testExpenseId = null;

  before(async () => {
    const testUri = process.env.TEST_MONGO_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/spendwise_test';
    try {
      if (mongoose.connection.readyState !== 1) {
        await mongoose.connect(testUri, { serverSelectionTimeoutMS: 2000 });
      }
      isDbConnected = mongoose.connection.readyState === 1;
      if (isDbConnected) {
        await Expense.deleteMany({});
      }
    } catch {
      isDbConnected = false;
    }
  });

  after(async () => {
    if (isDbConnected) {
      await Expense.deleteMany({});
      await mongoose.disconnect();
    }
  });

  test('Empty database response: GET /api/expenses returns empty array', async (t) => {
    if (!isDbConnected) {
      t.skip('Skipped: MongoDB is not running locally on 127.0.0.1:27017');
      return;
    }

    const { req, res } = createMockReqRes();
    await getExpenses(req, res, () => {});
    assert.equal(res.statusCode, 200);
    assert.equal(res.jsonData.success, true);
    assert.equal(res.jsonData.count, 0);
    assert.deepEqual(res.jsonData.data, []);
  });

  test('Summary on empty database: returns 0 total and empty arrays', async (t) => {
    if (!isDbConnected) {
      t.skip('Skipped: MongoDB is not running locally on 127.0.0.1:27017');
      return;
    }

    const { req, res } = createMockReqRes();
    await getExpenseSummary(req, res, () => {});
    assert.equal(res.statusCode, 200);
    assert.equal(res.jsonData.data.totalAmount, 0);
    assert.equal(res.jsonData.data.totalExpenses, 0);
    assert.deepEqual(res.jsonData.data.categoryTotals, []);
    assert.deepEqual(res.jsonData.data.monthlyTotals, []);
  });

  test('Create expense: POST creates valid expense and returns 201', async (t) => {
    if (!isDbConnected) {
      t.skip('Skipped: MongoDB is not running locally on 127.0.0.1:27017');
      return;
    }

    const { req, res } = createMockReqRes({
      method: 'POST',
      body: {
        amount: 150.5,
        category: 'Food',
        description: 'Grocery shopping',
        date: '2026-11-20',
        paymentMethod: 'Card',
      },
    });

    await createExpense(req, res, () => {});
    assert.equal(res.statusCode, 201);
    assert.equal(res.jsonData.success, true);
    assert.ok(res.jsonData.data._id);
    assert.equal(res.jsonData.data.amount, 150.5);
    testExpenseId = res.jsonData.data._id.toString();
  });

  test('Retrieve expenses: GET returns array with created expense', async (t) => {
    if (!isDbConnected) {
      t.skip('Skipped: MongoDB is not running locally on 127.0.0.1:27017');
      return;
    }

    const { req, res } = createMockReqRes();
    await getExpenses(req, res, () => {});
    assert.equal(res.statusCode, 200);
    assert.equal(res.jsonData.count, 1);
    assert.equal(res.jsonData.data[0]._id.toString(), testExpenseId);
  });

  test('Retrieve single expense: GET /:id returns single expense document', async (t) => {
    if (!isDbConnected) {
      t.skip('Skipped: MongoDB is not running locally on 127.0.0.1:27017');
      return;
    }

    const { req, res } = createMockReqRes({ params: { id: testExpenseId } });
    await getExpenseById(req, res, () => {});
    assert.equal(res.statusCode, 200);
    assert.equal(res.jsonData.data.description, 'Grocery shopping');
  });

  test('Update expense: PUT /:id modifies document and returns 200', async (t) => {
    if (!isDbConnected) {
      t.skip('Skipped: MongoDB is not running locally on 127.0.0.1:27017');
      return;
    }

    const { req, res } = createMockReqRes({
      method: 'PUT',
      params: { id: testExpenseId },
      body: { amount: 180.0, description: 'Updated Groceries' },
    });

    await updateExpense(req, res, () => {});
    assert.equal(res.statusCode, 200);
    assert.equal(res.jsonData.data.amount, 180.0);
    assert.equal(res.jsonData.data.description, 'Updated Groceries');
  });

  test('Summary calculations: aggregate calculations return accurate numbers', async (t) => {
    if (!isDbConnected) {
      t.skip('Skipped: MongoDB is not running locally on 127.0.0.1:27017');
      return;
    }

    // Insert second expense: 50 in Travel
    await Expense.create({
      amount: 50.0,
      category: 'Travel',
      description: 'Metro pass',
      date: new Date('2026-10-10'),
      paymentMethod: 'UPI',
    });

    const { req, res } = createMockReqRes();
    await getExpenseSummary(req, res, () => {});
    assert.equal(res.statusCode, 200);
    // 180 + 50 = 230
    assert.equal(res.jsonData.data.totalAmount, 230);
    assert.equal(res.jsonData.data.totalExpenses, 2);
    assert.ok(res.jsonData.data.categoryTotals.some((c) => c.category === 'Food' && c.total === 180));
    assert.ok(res.jsonData.data.categoryTotals.some((c) => c.category === 'Travel' && c.total === 50));
  });

  test('Nonexistent expense: returns 404 for valid ObjectId not in database', async (t) => {
    if (!isDbConnected) {
      t.skip('Skipped: MongoDB is not running locally on 127.0.0.1:27017');
      return;
    }

    const nonExistentId = new mongoose.Types.ObjectId().toString();
    const { req, res } = createMockReqRes({ params: { id: nonExistentId } });
    await getExpenseById(req, res, () => {});
    assert.equal(res.statusCode, 404);
    assert.equal(res.jsonData.error, 'Not Found');
  });

  test('Delete expense: DELETE removes document and returns confirmation', async (t) => {
    if (!isDbConnected) {
      t.skip('Skipped: MongoDB is not running locally on 127.0.0.1:27017');
      return;
    }

    const { req, res } = createMockReqRes({ params: { id: testExpenseId } });
    await deleteExpense(req, res, () => {});
    assert.equal(res.statusCode, 200);
    assert.equal(res.jsonData.success, true);

    // Verify it is gone
    const verifyReqRes = createMockReqRes({ params: { id: testExpenseId } });
    await getExpenseById(verifyReqRes.req, verifyReqRes.res, () => {});
    assert.equal(verifyReqRes.res.statusCode, 404);
  });
});
