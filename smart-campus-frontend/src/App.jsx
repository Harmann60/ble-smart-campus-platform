import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import all of your stunning pages
import Dashboard from './pages/Dashboard';
import Attendance from './pages/Attendance';
import AttendanceLogs from './pages/AttendanceLogs';
import QuizDashboard from './pages/QuizDashboard';
import Library from './pages/Library';
import Canteen from './pages/Canteen';

function App() {
    return (
        <Router>
            <Routes>
                {/* Automatically redirect the base URL (/) to the Dashboard */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />

                {/* Your core platform routes */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/attendance" element={<Attendance />} />
                <Route path="/attendance-logs" element={<AttendanceLogs />} />
                <Route path="/library" element={<Library />} />
                <Route path="/canteen" element={<Canteen />} />

                {/* 🚀 FIXED: The Quiz now lives at /quiz */}
                <Route path="/quiz" element={<QuizDashboard />} />
            </Routes>
        </Router>
    );
}

export default App;