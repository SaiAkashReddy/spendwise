# SpendWise — Personal Expense Tracker

SpendWise is a clean, modern, beginner-friendly full-stack MERN (MongoDB, Express.js, React, Node.js) application designed to help individuals effortlessly track, categorize, and analyze their personal daily spending.

Built with a modular architecture, clean code conventions, responsive Tailwind CSS styling, and live Recharts data visualizations, SpendWise serves as an exemplary educational template and practical personal finance tool.

---

## 📑 Table of Contents

- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Project Folder Structure](#-project-folder-structure)
- [Prerequisites](#-prerequisites)
- [Step-by-Step Installation](#-step-by-step-installation)
- [MongoDB Configuration](#-mongodb-configuration)
- [Environment Variables](#-environment-variables)
- [Starting the Application](#-starting-the-application)
- [REST API Reference](#-rest-api-reference)
- [Automated Testing Suite](#-automated-testing-suite)
- [UI Screenshots & Layout Preview](#-ui-screenshots--layout-preview)
- [Known Limitations & Future Improvements](#-known-limitations--future-improvements)
- [License](#-license)

---

## ✨ Features

1. **Expense Creation & Management (Full CRUD)**
   - Add expenses with amount, category, description, date, and payment method.
   - Edit existing expenses with prepopulated forms in accessible modal dialogs.
   - Delete expenses with a two-step confirmation dialog to prevent accidental data loss.
2. **Category Organization**
   - Categorize expenses into 7 core groups: `Food`, `Travel`, `Shopping`, `Bills`, `Entertainment`, `Health`, and `Others`.
   - Distinct icons and color-coded badges for rapid visual recognition.
3. **Flexible Payment Methods**
   - Support for `Cash`, `UPI`, `Card`, and `Other` transaction modes.
4. **Interactive Dashboard Analytics**
   - Real-time summary metric cards: **Total Spend**, **This Month's Spend**, **Total Transaction Count**, and **Top Spending Category**.
   - Currency display formatted in Indian Rupee (**INR ₹**) with Indian numbering conventions (`en-IN`).
5. **Data Visualizations (Recharts)**
   - **Category Expense Donut Chart**: Visual breakdown of expenses by category with interactive tooltips and category legends.
   - **Monthly Spending Bar Chart**: Chronological monthly spending bars across the calendar year, handling zero-spend months smoothly.
6. **Live Multi-Criteria Filtering & Search**
   - **Case-insensitive Search**: Instant description filter across all records.
   - **Combined Filters**: Seamlessly combine category, date range (`From` and `To`), and payment method filters.
   - **4-Way Sorting**: Sort expenses by Newest First, Oldest First, Highest Amount, or Lowest Amount.
7. **Modern Minimalist SaaS UI & UX**
   - Clean light theme with soft slate backgrounds and emerald accent colors.
   - Smooth slide-in toast notifications for user actions (create, edit, delete, errors).
   - Shimmer skeleton loaders and subtle spinners for loading states.
   - Fully responsive design: desktop sidebar navigation and collapsible mobile header menu.
   - Resilient database guard: server automatically returns `503 Service Unavailable` with clear warnings if MongoDB is unreachable instead of hanging or crashing.

---

## 🛠 Technology Stack

### Frontend (`client/`)
- **React 18**: Functional components with hooks (`useState`, `useEffect`, `useMemo`, `useCallback`, `useContext`).
- **Vite**: Ultra-fast next-generation frontend build tool and development server.
- **Tailwind CSS (v3)**: Utility-first CSS framework for modern, responsive layouts.
- **React Router (v6)**: Declarative client-side routing (`Dashboard` and `All Expenses` pages).
- **Axios**: Centralized HTTP client configured with base URL and response interceptors.
- **Recharts**: Responsive SVG charting library for interactive donut and bar charts.
- **Lucide React**: Clean, lightweight icons for categories, navigation, and actions.

### Backend (`server/`)
- **Node.js**: Asynchronous event-driven JavaScript runtime.
- **Express.js**: Fast, minimalist web framework for building RESTful APIs.
- **MongoDB & Mongoose**: NoSQL document database with schema validation and query optimization.
- **CORS**: Configurable cross-origin resource sharing middleware.
- **dotenv**: Environment variable management.
- **Node Native Test Runner**: Native subtest runner (`node --test`) for fast, zero-dependency unit and integration testing.

---

## 📁 Project Folder Structure

```text
SpendWise/
├── client/                           # Frontend React + Vite application
│   ├── public/                       # Static public assets
│   ├── src/
│   │   ├── components/               # Reusable modular UI components
│   │   │   ├── CategoryDonutChart.jsx# Donut chart for category distribution
│   │   │   ├── CategoryIcon.jsx      # Dynamic Lucide icon mapper for categories
│   │   │   ├── ConfirmDialog.jsx     # Accessible confirmation modal for deletions
│   │   │   ├── EmptyState.jsx        # Empty placeholder state illustration
│   │   │   ├── ErrorMessage.jsx      # Friendly error display with retry trigger
│   │   │   ├── ExpenseCard.jsx       # Card view for mobile transaction items
│   │   │   ├── ExpenseForm.jsx       # Form for adding and updating expenses
│   │   │   ├── ExpenseList.jsx       # Wrapper orchestrating table/card views
│   │   │   ├── ExpenseModal.jsx      # Modal dialog container with focus trap
│   │   │   ├── ExpenseTable.jsx      # Clean tabular view for desktop screens
│   │   │   ├── LoadingSpinner.jsx    # Animated spinner for async states
│   │   │   ├── MonthlyBarChart.jsx   # Bar chart showing monthly spending trends
│   │   │   ├── Navbar.jsx            # Top navigation bar with status indicator
│   │   │   ├── Sidebar.jsx           # Desktop navigation sidebar
│   │   │   ├── SkeletonLoader.jsx    # Modern shimmer skeleton for loading cards
│   │   │   └── Toast.jsx             # Floating notification toast component
│   │   ├── context/
│   │   │   └── ExpenseContext.jsx    # Centralized state management for expenses
│   │   ├── pages/
│   │   │   ├── AllExpenses.jsx       # Expenses view with search, filter, and sort
│   │   │   └── Dashboard.jsx         # Analytics overview with charts & summaries
│   │   ├── services/
│   │   │   ├── api.js                # Centralized Axios client instance
│   │   │   └── expenseService.js     # Expense API service layer
│   │   ├── utils/
│   │   │   └── constants.js          # Categories, payment methods & formatting helpers
│   │   ├── App.jsx                   # Root application router and shell layout
│   │   ├── index.css                 # Tailwind directives & custom animations
│   │   └── main.jsx                  # React DOM client entry point
│   ├── .env.example                  # Client environment variables template
│   ├── .gitignore                    # Git ignore rules for client
│   ├── index.html                    # HTML document root
│   ├── package.json                  # Client dependencies & scripts
│   ├── postcss.config.js             # PostCSS plugin configuration
│   ├── tailwind.config.js            # Tailwind theme and plugin setup
│   └── vite.config.js                # Vite development server and build config
├── server/                           # Backend Express + Node application
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                 # MongoDB connection and status handler
│   │   ├── controllers/
│   │   │   └── expenseController.js  # CRUD and analytics business logic
│   │   ├── middleware/
│   │   │   ├── errorHandler.js       # Centralized 404 and 500 error handlers
│   │   │   └── validateExpense.js    # Payload validation & DB connection check
│   │   ├── models/
│   │   │   └── Expense.js            # Mongoose Schema & model validation rules
│   │   ├── routes/
│   │   │   └── expenseRoutes.js      # Express router matching endpoints to handlers
│   │   └── server.js                 # Express app initialization & server startup
│   ├── tests/
│   │   ├── api.test.js               # Mongoose schema, middleware & CRUD integration tests
│   │   ├── audit.test.js             # Phase 6 17-scenario comprehensive audit test suite
│   │   └── phase4.test.js            # Analytics, filters, and multi-criteria sort tests
│   ├── .env.example                  # Server environment variables template
│   ├── .gitignore                    # Git ignore rules for server
│   └── package.json                  # Server dependencies & scripts
├── docs/
│   └── screenshots/                  # Screenshot placeholder directory
├── .gitignore                        # Root git ignore rules
├── API_DOCUMENTATION.md              # In-depth REST API specifications
├── package.json                      # Monorepo runner scripts (concurrently)
└── README.md                         # Project documentation and guide
```

---

## 📋 Prerequisites

Before installing SpendWise, make sure you have the following installed on your operating system:

1. **Node.js**: Version **v18.0.0** or higher (LTS recommended).
   - Check version: `node -v`
2. **npm**: Version **v9.0.0** or higher.
   - Check version: `npm -v`
3. **MongoDB**:
   - **Local Database**: MongoDB Community Server installed and running locally on port `27017`.
   - **Or Cloud Database**: A free MongoDB Atlas cluster.

---

## 📦 Step-by-Step Installation

### 1. Clone the Repository
```bash
git clone https://github.com/akashreddy11019-creator/spendwise.git
cd spendwise
```

### 2. Install All Dependencies

You can install all dependencies for both `server` and `client` in one command from the project root:
```bash
npm run install:all
```

Alternatively, install them individually:
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

---

## 🍃 MongoDB Configuration

SpendWise stores all transactions in a MongoDB collection. You can connect to either a local MongoDB daemon or MongoDB Atlas.

### Option A: Local MongoDB (Recommended for Offline Development)
1. Ensure your MongoDB service is running:
   - **Windows**: Start the MongoDB service via `services.msc` or execute:
     ```cmd
     net start MongoDB
     ```
   - **macOS (Homebrew)**:
     ```bash
     brew services start mongodb-community
     ```
   - **Linux (systemd)**:
     ```bash
     sudo systemctl start mongod
     ```
2. Your default local URI will be:
   ```text
   mongodb://localhost:27017/spendwise
   ```

### Option B: MongoDB Atlas (Cloud Database)
1. Sign in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a free shared cluster (M0).
3. Under **Database Access**, create a user with read and write privileges.
4. Under **Network Access**, add `0.0.0.0/0` (allow access from anywhere) or your current IP address.
5. Under **Clusters > Connect > Drivers**, copy the connection string. Replace `<username>` and `<password>` with your credentials:
   ```text
   mongodb+srv://<username>:<password>@cluster0.mongodb.net/spendwise?retryWrites=true&w=majority
   ```

> **Safety Notice:** If MongoDB is offline, the backend's `checkDbConnection` middleware prevents silent timeouts by immediately returning `HTTP 503 Service Unavailable` with the message *"Database service is temporarily unavailable"*.

---

## ⚙️ Environment Variables

Create `.env` configuration files in both `server/` and `client/` by copying the provided `.env.example` templates.

### Backend Configuration (`server/.env`)

```bash
# In Windows PowerShell:
Copy-Item server/.env.example server/.env

# In Bash / macOS / Linux:
cp server/.env.example server/.env
```

| Variable | Required | Default | Description |
| :--- | :---: | :--- | :--- |
| `PORT` | Optional | `5000` | Port on which the Express server listens. |
| `NODE_ENV` | Optional | `development` | Runtime environment (`development` or `production`). |
| `MONGO_URI` | **Yes** | `mongodb://localhost:27017/spendwise` | MongoDB connection URI (local or Atlas). |
| `CLIENT_URL` | Optional | `http://localhost:5173` | Allowed frontend origin for CORS requests. |

### Frontend Configuration (`client/.env`)

```bash
# In Windows PowerShell:
Copy-Item client/.env.example client/.env

# In Bash / macOS / Linux:
cp client/.env.example client/.env
```

| Variable | Required | Default | Description |
| :--- | :---: | :--- | :--- |
| `VITE_API_URL` | **Yes** | `http://localhost:5000/api` | Base URL used by Axios to query backend REST APIs. |

---

## 🚀 Starting the Application

You can start the backend and frontend separately (recommended for beginners) or together using a single root command.

### Method 1: Separate Terminals (Recommended)

#### Terminal 1 — Backend Express Server:
```bash
cd server
npm run dev
```
- Server starts at: **`http://localhost:5000`**
- Uses `nodemon` to automatically restart whenever backend files change.

#### Terminal 2 — Frontend React App:
```bash
cd client
npm run dev
```
- Vite dev server starts at: **`http://localhost:5173`**
- Features Hot Module Replacement (HMR) for instant UI updates.

---

### Method 2: Single Terminal (Root Concurrently)

From the project root:
```bash
npm run dev
```
This script uses `concurrently` to spawn both the Express server and Vite development server side by side in the same terminal.

---

## 📡 REST API Reference

All API routes are prefixed with `/api`. For comprehensive schemas and request bodies, see [API_DOCUMENTATION.md](file:///d:/Desktop/Akash/API_DOCUMENTATION.md).

| Method | Endpoint | Description | Status Codes |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Check backend server and MongoDB connection status. | `200` |
| `GET` | `/api/expenses/summary` | Retrieve total spending, count, category totals & monthly totals. | `200`, `503` |
| `GET` | `/api/expenses` | Retrieve all expenses (sorted newest first by default). | `200`, `503` |
| `GET` | `/api/expenses/:id` | Fetch a single expense by its 24-character hexadecimal ObjectId. | `200`, `400`, `404`, `503` |
| `POST` | `/api/expenses` | Create a new expense record with validated input fields. | `201`, `400`, `503` |
| `PUT` | `/api/expenses/:id` | Update an existing expense record by ID. | `200`, `400`, `404`, `503` |
| `DELETE` | `/api/expenses/:id` | Permanently delete an expense record by ID. | `200`, `400`, `404`, `503` |

### Allowed Categories:
`Food`, `Travel`, `Shopping`, `Bills`, `Entertainment`, `Health`, `Others`

### Allowed Payment Methods:
`Cash`, `UPI`, `Card`, `Other`

---

## 🧪 Automated Testing Suite

SpendWise includes an automated test suite executed with Node's native test runner (`node --test`).

To run the backend tests:
```bash
cd server
npm test
```

### What the Tests Verify:
1. **Mongoose Schema & Validations (`api.test.js`)**: Required fields, positive amount checks, category/payment method enum enforcement, whitespace trimming.
2. **Validation Middleware (`api.test.js`)**: Hexadecimal ObjectId format checking, rejection of empty update payloads, database disconnection guard (`503`).
3. **Analytics & Aggregations (`phase4.test.js`)**: Grouping by category and month, calendar date timezone boundaries, zero-expense robustness.
4. **Search, Filter & Sort Pipelines (`phase4.test.js`)**: Combined multi-criteria filters (category + date + payment method), case-insensitive search, 4-way sorting.
5. **Phase 6 Audit Test Suite (`audit.test.js`)**: 17 end-to-end verification scenarios ensuring data persistence, reactive updates, and error handling.

To verify the frontend production build:
```bash
cd client
npm run build
```

---

## 🖼 UI Screenshots & Layout Preview

Screenshots of SpendWise in action:

| View | Screenshot Location | Preview / Description |
| :--- | :--- | :--- |
| **Dashboard Analytics** | `docs/screenshots/dashboard.png` | Displays 4 summary metric cards, Recharts Donut & Monthly Bar charts, quick action button, and recent expenses. |
| **All Expenses View** | `docs/screenshots/expenses.png` | Comprehensive table/card view with live search, combined filters (Category, Payment Method, Date Range), and sorting. |
| **Add / Edit Expense Modal** | `docs/screenshots/modal.png` | Accessible modal form with real-time validation, field constraints, and loading states. |
| **Delete Confirmation** | `docs/screenshots/delete-confirm.png` | Safe confirmation dialog with red warning state before destructive deletion. |

*(To add your own screenshots, place `.png` files in the `docs/screenshots/` directory matching the names above).*

---

## ⚠️ Known Limitations & Future Improvements

SpendWise is deliberately architected as a clean, beginner-friendly application without unnecessary enterprise overhead. The following features are intentional omissions that can be explored in future extensions:

1. **User Authentication**: Currently operates as a single-user system. Multi-user support with JWT authentication, user registration, and tenant-isolated collections can be added.
2. **Pagination for Massive Datasets**: All transactions are fetched in a single request. While optimal for personal use (< 5,000 transactions), cursor-based or offset pagination can be introduced for large enterprise datasets.
3. **Automated Recurring Expenses**: Expenses must be entered manually; a background scheduler for automatic recurring subscription tracking could be integrated.
4. **Multi-Currency Selection**: Currency is standardized to Indian Rupee (INR ₹); multi-currency conversion using an exchange rate API can be added for international usage.
5. **Data Export**: Future improvements could include one-click export to CSV or PDF financial statements.

---

## 📄 License

This project is open-source and available under the [MIT License](file:///d:/Desktop/Akash/LICENSE). Feel free to use, modify, and learn from it!
