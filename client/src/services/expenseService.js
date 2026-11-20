import api from './api.js';

export const expenseService = {
  /**
   * Fetch all expenses with optional sorting
   * @param {string} sort - 'newest' | 'oldest' | 'desc' | 'asc'
   */
  async getExpenses(sort = 'desc') {
    const response = await api.get('/expenses', {
      params: { sort },
    });
    return response.data;
  },

  /**
   * Fetch expense summary statistics
   */
  async getSummary() {
    const response = await api.get('/expenses/summary');
    return response.data;
  },

  /**
   * Fetch a single expense by ID
   * @param {string} id
   */
  async getExpenseById(id) {
    const response = await api.get(`/expenses/${id}`);
    return response.data;
  },

  /**
   * Create a new expense
   * @param {object} expenseData - { amount, category, description, date, paymentMethod }
   */
  async createExpense(expenseData) {
    const response = await api.post('/expenses', expenseData);
    return response.data;
  },

  /**
   * Update an existing expense
   * @param {string} id
   * @param {object} updateData - Partial or full fields
   */
  async updateExpense(id, updateData) {
    const response = await api.put(`/expenses/${id}`, updateData);
    return response.data;
  },

  /**
   * Delete an expense by ID
   * @param {string} id
   */
  async deleteExpense(id) {
    const response = await api.delete(`/expenses/${id}`);
    return response.data;
  },

  /**
   * Check system and database health
   */
  async checkHealth() {
    const response = await api.get('/health');
    return response.data;
  },
};

export default expenseService;
