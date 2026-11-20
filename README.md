# SpendWise — Personal Expense Tracker

A clean, beginner-friendly full-stack MERN application for personal expense tracking, built with modern JavaScript and a clear modular structure.

---

## 🌟 Technology Stack

### Frontend (`client/`)
- **React 18** — Functional components with React Hooks
- **Vite** — Fast, modern build tool and dev server
- **Tailwind CSS** — Utility-first styling framework
- **React Router (v6)** — Client-side page navigation
- **Axios** — Promise-based HTTP client for API requests
- **Recharts** — Composable charting library for expense analytics

### Backend (`server/`)
- **Node.js** — JavaScript runtime environment
- **Express.js** — Minimalist web framework
- **MongoDB & Mongoose** — Document database with Object Data Modeling
- **dotenv** — Zero-dependency environment variable manager
- **cors** — Cross-Origin Resource Sharing middleware
- **nodemon** — Development server auto-reloader

---

## 📁 Project Structure

```text
SpendWise/
├── client/                     # Frontend React + Vite application
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/              # Router page views
│   │   ├── services/           # API integration (Axios)
│   │   ├── App.jsx             # Main application component & health check
│   │   ├── index.css           # Tailwind directives & global styling
│   │   └── main.jsx            # Application entry point
│   ├── .env.example            # Client environment variable template
│   ├── .gitignore              # Client git ignore rules
│   ├── index.html              # HTML shell
│   ├── package.json            # Client dependencies and scripts
│   ├── postcss.config.js       # PostCSS config for Tailwind
│   ├── tailwind.config.js      # Tailwind CSS configuration
│   └── vite.config.js          # Vite build & server configuration
├── server/                     # Backend Express + Node application
│   ├── src/
│   │   ├── config/             # Database and server config
│   │   ├── controllers/        # Request handling and business logic
│   │   ├── models/             # Mongoose schemas and models
│   │   ├── routes/             # Express API route endpoints
│   │   └── server.js           # Server entry point & health check endpoint
│   ├── .env.example            # Server environment variable template
│   ├── .gitignore              # Server git ignore rules
│   └── package.json            # Server dependencies and scripts
├── .gitignore                  # Root git ignore rules
├── package.json                # Root package for running client & server together
└── README.md                   # Project documentation & setup instructions
```

---

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have the following installed on your machine:
- **Node.js** (v18.0.0 or higher) — check with `node -v`
- **npm** (v9.0.0 or higher) — check with `npm -v`
- **MongoDB** (Local MongoDB Community Server or MongoDB Atlas account)

---

### 2. Environment Configuration

#### Server Setup:
1. Navigate to `server/`:
   ```bash
   cd server
   ```
2. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   # On Windows PowerShell:
   Copy-Item .env.example .env
   ```
3. Default `.env` values:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGO_URI=mongodb://localhost:27017/spendwise
   CLIENT_URL=http://localhost:5173
   ```

#### Client Setup:
1. Navigate to `client/`:
   ```bash
   cd client
   ```
2. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   # On Windows PowerShell:
   Copy-Item .env.example .env
   ```
3. Default `.env` values:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

---

### 3. Dependency Installation

You can install dependencies for each part individually:

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

Or install all dependencies from the root directory:
```bash
npm run install:all
```

---

### 4. Running the Application

#### Option A: Running in separate terminals (Recommended for beginners)

**Terminal 1 — Backend Express Server:**
```bash
cd server
npm run dev
```
> Server starts at `http://localhost:5000`

**Terminal 2 — Frontend React App:**
```bash
cd client
npm run dev
```
> Client starts at `http://localhost:5173`

---

#### Option B: Running both concurrently from the root

From the root directory:
```bash
npm run dev
```
This uses `concurrently` to start both the server and the client in a single terminal.

---

## 🔍 Verification & Testing

### 1. Backend Health Check
Open your browser or run:
```bash
curl http://localhost:5000/api/health
```

Expected JSON response (HTTP 200 OK):
```json
{
  "status": "ok",
  "message": "SpendWise API is running smoothly",
  "timestamp": "2026-11-20T...",
  "environment": "development"
}
```

### 2. Frontend Verification
Open your browser at:
```
http://localhost:5173
```
You should see the SpendWise Phase 1 welcome dashboard showing:
- Verified Tailwind CSS styling
- Live status indicator communicating with the backend `/api/health` endpoint
- Full overview of planned features for upcoming phases

---

### 3. API Automated Testing
Run the backend test suite:
```bash
cd server
npm test
```
The test suite validates the Mongoose Expense schema, input validation rules, database availability guards, and API controllers.

---

## 🗺️ Roadmap & Phases

- [x] **Phase 1: Project Initialization & Foundation** (Structure, Vite, Express, Tailwind, Health Check)
- [x] **Phase 2: Database Connection & REST APIs** (Mongoose Expense model, CRUD endpoints, summary analytics, validation & API tests)
- [ ] **Phase 3: Frontend Expense Management** (Expense form, list, edit, delete UI)
- [ ] **Phase 4: Search, Filters & Analytics** (Filter by category/date, search, Recharts visualizations)
- [ ] **Phase 5: Polish & Deployment Preparation** (UI polish, responsive design, end-to-end integration)
