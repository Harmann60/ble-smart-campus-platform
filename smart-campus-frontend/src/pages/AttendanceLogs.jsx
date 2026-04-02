import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { Calendar, Clock, Users, ChevronRight, X, FileText } from 'lucide-react';

const AttendanceLogs = () => {
    const [logs, setLogs] = useState([]);
    const [selectedLog, setSelectedLog] = useState(null); // Controls the popup modal

    // Load data from LocalStorage + Mock Data for the demo
    useEffect(() => {
        const mockDatabaseLogs = [
            {
                id: 1,
                className: "Room 104 - Computer Networks",
                date: "02 April 2026", // Updated date to match your demo timeline!
                time: "10:00 AM - 11:00 AM",
                totalPresent: 42,
                students: [
                    { name: "Jalaj Maheshwari", rssi: "-55", status: "Present" },
                    { name: "Harman Jassal", rssi: "-62", status: "Present" },
                    { name: "Gauri", rssi: "-48", status: "Present" }
                ]
            },
            {
                id: 2,
                className: "Room 201 - IoT & Embedded Systems",
                date: "01 April 2026",
                time: "02:00 PM - 04:00 PM",
                totalPresent: 38,
                students: [
                    { name: "Jalaj Maheshwari", rssi: "-50", status: "Present" },
                    { name: "Harman Jassal", rssi: "-59", status: "Present" }
                ]
            }
        ];

        // 📍 Read the REAL data that we saved from the radar
        const savedData = localStorage.getItem('campus_attendance_logs');
        const savedLogs = savedData ? JSON.parse(savedData) : [];

        if (savedLogs.length > 0) {
            // If we have real saves, show them FIRST, then show the mock data
            setLogs([...savedLogs, ...mockDatabaseLogs]);
        } else {
            // Otherwise, just show the mock data
            setLogs(mockDatabaseLogs);
        }
    }, []);

    return (
        <div className="flex bg-campus-bg min-h-screen font-sans text-campus-text transition-colors duration-300 relative">
            <Sidebar />

            <div className="ml-64 flex-1 p-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold text-campus-text flex items-center gap-3">
                        <FileText className="text-campus-primary" size={32} />
                        Attendance Logs
                    </h1>
                    <p className="text-campus-secondary mt-1">View and manage past classroom sessions.</p>
                </div>

                {/* THE TILES GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {logs.map((log) => (
                        <div
                            key={log.id}
                            onClick={() => setSelectedLog(log)}
                            className="bg-campus-card p-6 rounded-2xl shadow-sm border border-campus-border hover:border-campus-primary hover:shadow-md transition-all cursor-pointer group"
                        >
                            <h3 className="font-bold text-lg mb-4 text-campus-text group-hover:text-campus-primary transition-colors">
                                {log.className}
                            </h3>

                            <div className="space-y-2 text-sm text-campus-secondary mb-6">
                                <div className="flex items-center gap-2"><Calendar size={16}/> {log.date}</div>
                                <div className="flex items-center gap-2"><Clock size={16}/> {log.time}</div>
                                <div className="flex items-center gap-2"><Users size={16}/> {log.totalPresent} Students Present</div>
                            </div>

                            <div className="flex justify-between items-center text-sm font-bold text-campus-primary border-t border-campus-border pt-4">
                                View Full Roster <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform"/>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* THE MODAL POPUP (Shows when a tile is clicked) */}
            {selectedLog && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-campus-card w-full max-w-2xl rounded-3xl shadow-2xl border border-campus-border overflow-hidden animate-in fade-in zoom-in duration-200">

                        {/* Modal Header */}
                        <div className="bg-campus-bg p-6 border-b border-campus-border flex justify-between items-start">
                            <div>
                                <h2 className="text-2xl font-bold text-campus-text">{selectedLog.className}</h2>
                                <p className="text-campus-secondary flex gap-4 mt-2 text-sm">
                                    <span>📅 {selectedLog.date}</span>
                                    <span>⏰ {selectedLog.time}</span>
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedLog(null)}
                                className="p-2 hover:bg-red-100 hover:text-red-600 rounded-full transition-colors text-campus-secondary"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Modal Student List */}
                        <div className="p-6 max-h-[60vh] overflow-y-auto bg-campus-card">
                            <h3 className="font-bold mb-4 text-campus-text flex items-center gap-2">
                                <Users size={18} /> Roster ({selectedLog.totalPresent} Present)
                            </h3>

                            <div className="space-y-3">
                                {selectedLog.students.map((student, idx) => (
                                    <div key={idx} className="flex justify-between items-center p-3 bg-campus-bg border border-campus-border rounded-xl">
                                        <div className="font-semibold text-campus-text">{student.name}</div>
                                        <div className="flex gap-4 items-center">
                                            <span className="text-xs text-campus-secondary font-mono">Signal: {student.rssi} dBm</span>
                                            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-lg border border-green-200">
                                                {student.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};

export default AttendanceLogs;