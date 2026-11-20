import mongoose from 'mongoose';

export const ALLOWED_CATEGORIES = [
  'Food',
  'Travel',
  'Shopping',
  'Bills',
  'Entertainment',
  'Health',
  'Others',
];

export const ALLOWED_PAYMENT_METHODS = [
  'Cash',
  'UPI',
  'Card',
  'Other',
];

const expenseSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: [true, 'Expense amount is required'],
      min: [0.01, 'Amount must be greater than zero'],
      validate: {
        validator: function (val) {
          return typeof val === 'number' && !isNaN(val) && val > 0;
        },
        message: 'Amount must be a positive number greater than zero',
      },
    },
    category: {
      type: String,
      required: [true, 'Expense category is required'],
      enum: {
        values: ALLOWED_CATEGORIES,
        message: 'Invalid category: "{VALUE}". Allowed categories are: ' + ALLOWED_CATEGORIES.join(', '),
      },
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Expense description is required'],
      trim: true,
      minlength: [1, 'Description cannot be empty'],
      maxlength: [200, 'Description cannot exceed 200 characters'],
    },
    date: {
      type: Date,
      required: [true, 'Expense date is required'],
      validate: {
        validator: function (val) {
          return val instanceof Date && !isNaN(val.getTime());
        },
        message: 'Invalid date provided',
      },
    },
    paymentMethod: {
      type: String,
      default: 'Cash',
      enum: {
        values: ALLOWED_PAYMENT_METHODS,
        message: 'Invalid payment method: "{VALUE}". Allowed payment methods are: ' + ALLOWED_PAYMENT_METHODS.join(', '),
      },
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index on date (descending) to optimize default sorting and date-range queries
expenseSchema.index({ date: -1 });

const Expense = mongoose.model('Expense', expenseSchema);

export default Expense;
