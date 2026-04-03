import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import { Calendar, Clock, Users, ChevronRight, X, FileText } from 'lucide-react';

const API_BASE = 'http://localhost:5000';

const formatDate = (value) => {
    if (!value) {
        return '-';
    }

    return new Date(value).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });
};

const formatTimeRange = (start, end) => {
    if (!start) {
        return '-';
    }

    const startText = new Date(start).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
    });

    if (!end) {
        return `${startText} - Ongoing`;
    }

    const endText = new Date(end).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
    });

    return `${startText} - ${endText}`;
};

const AttendanceLogs = () => {
    const [logs, setLogs] = useState([]);
    const [selectedLog, setSelectedLog] = useState(null);
    const [selectionMode, setSelectionMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const res = await axios.get(`${API_BASE}/api/attendance/logs`);
                setLogs(Array.isArray(res.data?.data) ? res.data.data : []);
            } catch (error) {
                console.error('Failed to fetch attendance logs', error.response?.data || error.message);
                setLogs([]);
            }
        };

        fetchLogs();
    }, []);

    const toggleSelectLog = (logId) => {
        setSelectedIds((prev) =>
            prev.includes(logId)
                ? prev.filter((id) => id !== logId)
                : [...prev, logId]
        );
    };

    const handleToggleSelectionMode = () => {
        setSelectionMode((prev) => !prev);
        setSelectedIds([]);
    };

    const handleSelectAll = () => {
        if (selectedIds.length === logs.length) {
            setSelectedIds([]);
            return;
        }

        setSelectedIds(logs.map((log) => log.id));
    };

    const handleDeleteSelected = async () => {
        if (selectedIds.length === 0) {
            return;
        }

        const confirmed = window.confirm(`Delete ${selectedIds.length} selected log(s)?`);
        if (!confirmed) {
            return;
        }

        try {
            await axios.delete(`${API_BASE}/api/attendance/logs`, {
                data: {
                    session_ids: selectedIds
                }
            });

            setLogs((prev) => prev.filter((log) => !selectedIds.includes(log.id)));
            if (selectedLog && selectedIds.includes(selectedLog.id)) {
                setSelectedLog(null);
            }
            setSelectedIds([]);
            setSelectionMode(false);
        } catch (error) {
            console.error('Failed to delete attendance logs', error.response?.data || error.message);
        }
    };

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
                    <div className="mt-4 flex gap-2 flex-wrap">
                        <button
                            onClick={handleToggleSelectionMode}
                            className="bg-campus-primary text-campus-text px-4 py-2 rounded-xl text-sm font-semibold"
                        >
                            {selectionMode ? 'Cancel' : 'Select'}
                        </button>
                        {selectionMode ? (
                            <button
                                onClick={handleSelectAll}
                                className="bg-campus-card border border-campus-border text-campus-text px-4 py-2 rounded-xl text-sm font-semibold"
                            >
                                {selectedIds.length === logs.length ? 'Unselect All' : 'Select All'}
                            </button>
                        ) : null}
                        {selectionMode ? (
                            <button
                                onClick={handleDeleteSelected}
                                disabled={selectedIds.length === 0}
                                className="bg-red-500 text-white px-4 py-2 rounded-xl text-sm font-semibold disabled:opacity-60"
                            >
                                Delete Selected ({selectedIds.length})
                            </button>
                        ) : null}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {logs.map((log) => (
                        <div
                            key={log.id}
                            onClick={() => {
                                if (selectionMode) {
                                    toggleSelectLog(log.id);
                                    return;
                                }

                                setSelectedLog(log);
                            }}
                            className={`bg-campus-card p-6 rounded-2xl shadow-sm border transition-all cursor-pointer group ${
                                selectedIds.includes(log.id)
                                    ? 'border-red-400 ring-2 ring-red-300'
                                    : 'border-campus-border hover:border-campus-primary hover:shadow-md'
                            }`}
                        >
                            {selectionMode ? (
                                <div className="mb-3 flex items-center gap-2 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.includes(log.id)}
                                        onChange={() => toggleSelectLog(log.id)}
                                        onClick={(event) => event.stopPropagation()}
                                        className="accent-campus-primary"
                                    />
                                    <span>{selectedIds.includes(log.id) ? 'Selected' : 'Select this log'}</span>
                                </div>
                            ) : null}
                            <h3 className="font-bold text-lg mb-4 text-campus-text group-hover:text-campus-primary transition-colors">
                                {log.className}
                            </h3>

                            <div className="space-y-2 text-sm text-campus-secondary mb-6">
                                <div className="flex items-center gap-2"><Calendar size={16} /> {formatDate(log.start_time)}</div>
                                <div className="flex items-center gap-2"><Clock size={16} /> {formatTimeRange(log.start_time, log.end_time)}</div>
                                <div className="flex items-center gap-2"><Users size={16} /> {log.totalPresent} Students Present</div>
                            </div>

                            <div className="flex justify-between items-center text-sm font-bold text-campus-primary border-t border-campus-border pt-4">
                                View Full Roster <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {selectedLog && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-campus-card w-full max-w-2xl rounded-3xl shadow-2xl border border-campus-border overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="bg-campus-bg p-6 border-b border-campus-border flex justify-between items-start">
                            <div>
                                <h2 className="text-2xl font-bold text-campus-text">{selectedLog.className}</h2>
                                <p className="text-campus-secondary flex gap-4 mt-2 text-sm">
                                    <span>📅 {formatDate(selectedLog.start_time)}</span>
                                    <span>⏰ {formatTimeRange(selectedLog.start_time, selectedLog.end_time)}</span>
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedLog(null)}
                                className="p-2 hover:bg-red-100 hover:text-red-600 rounded-full transition-colors text-campus-secondary"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6 max-h-[60vh] overflow-y-auto bg-campus-card">
                            <h3 className="font-bold mb-4 text-campus-text flex items-center gap-2">
                                <Users size={18} /> Roster ({selectedLog.totalPresent} Present)
                            </h3>

                            <div className="space-y-3">
                                {(selectedLog.students || []).map((student) => (
                                    <div key={student.student_id} className="flex justify-between items-center p-3 bg-campus-bg border border-campus-border rounded-xl">
                                        <div>
                                            <div className="font-semibold text-campus-text">{student.name}</div>
                                            <div className="text-xs text-campus-secondary">PRN: {student.prn}</div>
                                        </div>
                                        <div className="flex gap-4 items-center">
                                            <span className="text-xs text-campus-secondary">{student.comment || 'No comment'}</span>
                                            <span className={`px-3 py-1 text-xs font-bold rounded-lg border ${
                                                student.status === 'present'
                                                    ? 'bg-green-100 text-green-700 border-green-200'
                                                    : student.status === 'late'
                                                        ? 'bg-yellow-100 text-yellow-700 border-yellow-200'
                                                        : 'bg-red-100 text-red-700 border-red-200'
                                            }`}>
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
