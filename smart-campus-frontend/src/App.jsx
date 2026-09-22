import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import all of your stunning pages
import Dashboard from './pages/Dashboard';
import Attendance from './pages/Attendance';
import AttendanceLogs from './pages/AttendanceLogs';
import Library from './pages/Library';
import LibraryLogs from './pages/LibraryLogs';
import Canteen from './pages/Canteen';
import Login from './pages/Login';
import QuizDashboard from './pages/QuizDashboard';

function App() {
    return (
        <Router>
            <Routes>
                {/* Automatically redirect the base URL (/) to the Dashboard */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />

                <Route path="/login" element={<Login />} />

                {/* Your core platform routes */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/attendance" element={<Attendance />} />
                <Route path="/attendance-logs" element={<AttendanceLogs />} />
                <Route path="/library" element={<Library />} />
                <Route path="/library-logs" element={<LibraryLogs />} />
                <Route path="/canteen" element={<Canteen />} />

                {/* 🚀 FIXED: The Quiz now lives at /quiz */}
                <Route path="/quiz" element={<QuizDashboard />} />
            </Routes>
        </Router>
    );
}

export default App;