import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const checkServerHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/health`);
      setHealthData(response.data);
    } catch (err) {
      setError(err.message || 'Failed to connect to backend server');
      setHealthData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkServerHealth();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Top Navigation / Brand */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xl shadow-md shadow-emerald-200">
              $
            </div>
            <div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">SpendWise</span>
              <span className="hidden sm:inline-block ml-2 text-xs font-medium px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">
                Phase 1 Complete
              </span>
            </div>
          </div>
          <div className="text-sm font-medium text-slate-500">
            Personal Expense Tracker
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow w-full">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-8 text-white shadow-lg mb-8">
          <div className="max-w-2xl">
            <span className="inline-block py-1 px-3 rounded-full bg-emerald-500/30 text-emerald-100 text-xs font-semibold tracking-wide uppercase mb-3">
              MERN Stack Architecture
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              SpendWise — Ready for Development
            </h1>
            <p className="mt-3 text-emerald-100 text-base sm:text-lg">
              Phase 1 setup has been verified. The React + Vite frontend and Node.js + Express backend are structured, configured, and ready for expense tracking features in upcoming phases.
            </p>
          </div>
        </div>

        {/* Backend Health Check Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-100 gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Backend API Health Status</h2>
              <p className="text-sm text-slate-500">Live test communicating with <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">{API_URL}/health</code></p>
            </div>
            <button
              onClick={checkServerHealth}
              disabled={loading}
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors shadow-sm disabled:opacity-50"
            >
              {loading ? 'Checking...' : 'Recheck Status'}
            </button>
          </div>

          <div className="mt-4">
            {loading && (
              <div className="flex items-center space-x-2 text-slate-500 py-3">
                <div className="w-3 h-3 bg-slate-400 rounded-full animate-ping"></div>
                <span className="text-sm">Connecting to backend server...</span>
              </div>
            )}

            {!loading && healthData && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 text-emerald-800 font-semibold mb-2">
                  <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></span>
                  <span>Server Online & Responding (HTTP 200 OK)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-emerald-900 mt-2">
                  <div><span className="font-medium">Status:</span> {healthData.status}</div>
                  <div><span className="font-medium">Message:</span> {healthData.message}</div>
                  <div><span className="font-medium">Timestamp:</span> {new Date(healthData.timestamp).toLocaleTimeString()}</div>
                </div>
              </div>
            )}

            {!loading && error && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 text-amber-800 font-semibold mb-1">
                  <span className="w-2.5 h-2.5 bg-amber-500 rounded-full"></span>
                  <span>Backend Not Reachable</span>
                </div>
                <p className="text-xs text-amber-700">
                  {error}. Make sure the Express server is running on port 5000 (<code className="bg-amber-100 px-1 rounded">npm run server</code>).
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Planned Features & Architecture Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Tech Stack Box */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center space-x-2">
              <span>Installed Technology Stack</span>
            </h3>
            <ul className="space-y-3 text-sm text-slate-600">
              <li className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="font-medium text-slate-700">Frontend Core</span>
                <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded text-xs">React 18 + Vite</span>
              </li>
              <li className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="font-medium text-slate-700">Styling</span>
                <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded text-xs">Tailwind CSS</span>
              </li>
              <li className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="font-medium text-slate-700">Routing & HTTP</span>
                <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded text-xs">React Router + Axios</span>
              </li>
              <li className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="font-medium text-slate-700">Analytics & Charts</span>
                <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded text-xs">Recharts</span>
              </li>
              <li className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="font-medium text-slate-700">Backend Server</span>
                <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded text-xs">Node.js + Express</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="font-medium text-slate-700">Database Engine</span>
                <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded text-xs">MongoDB + Mongoose</span>
              </li>
            </ul>
          </div>

          {/* Upcoming Features Checklist */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-800 mb-4">
              Project Features Checklist
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-600">
              {[
                '1. Create an expense',
                '2. View all expenses',
                '3. Edit an existing expense',
                '4. Delete an expense',
                '5. Categorize expenses',
                '6. Filter by category & date',
                '7. Search by description',
                '8. Display total spending',
                '9. Visualize with charts',
                '10. Responsive UI',
              ].map((feature, idx) => (
                <div key={idx} className="flex items-center space-x-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-slate-400 italic">
              Features will be built phase-by-phase in clean, beginner-friendly increments.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-slate-500">
          SpendWise — Personal Expense Tracker • MERN Stack Development
        </div>
      </footer>
    </div>
  );
}

export default App;
