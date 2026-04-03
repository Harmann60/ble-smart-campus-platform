import { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import { Radio, Users, Activity, Save } from 'lucide-react';
import CreateSession from '../components/CreateSession';

const API_BASE = 'http://localhost:5000';

const statusStyles = {
    present: 'bg-green-100/80 border-green-200',
    late: 'bg-yellow-100/80 border-yellow-200',
    absent: 'bg-red-100/80 border-red-200'
};

const statusBadgeStyles = {
    present: 'bg-green-600 text-white',
    late: 'bg-yellow-500 text-white',
    absent: 'bg-red-500 text-white'
};

const normalizeRoster = (rows) =>
    rows.map((row) => ({
        student_id: row.student_id,
        prn: row.prn,
        name: row.name,
        status: row.status || 'absent',
        comment: row.comment || '',
        manual_override: row.manual_override || false
    }));

const isDetectedForRow = (row, liveStudent) => {
    const liveIdRaw = String(liveStudent?.student_id ?? '').trim();
    if (!liveIdRaw) {
        return false;
    }

    const rowStudentId = String(row.student_id ?? '').trim();
    const rowPrn = String(row.prn ?? '').trim();

    if (liveIdRaw === rowStudentId || liveIdRaw === rowPrn) {
        return true;
    }

    const liveIdNum = Number.parseInt(liveIdRaw, 10);
    const rowStudentIdNum = Number.parseInt(rowStudentId, 10);
    if (!Number.isNaN(liveIdNum) && !Number.isNaN(rowStudentIdNum) && liveIdNum === rowStudentIdNum) {
        return true;
    }

    return rowPrn.endsWith(liveIdRaw);
};

const buildAttendancePayload = (rows) =>
    rows.map((row) => ({
        student_id: row.student_id,
        status: row.status,
        comment: row.comment
    }));

const Attendance = () => {
    const [session, setSession] = useState(null);
    const [attendanceRows, setAttendanceRows] = useState([]);
    const [liveStudents, setLiveStudents] = useState([]);
    const [isSaving, setIsSaving] = useState(false);
    const [isSavingSession, setIsSavingSession] = useState(false);
    const [saveMessage, setSaveMessage] = useState('');

    useEffect(() => {
        if (!session) {
            return undefined;
        }

        const fetchRoster = async () => {
            try {
                const res = await axios.get(
                    `${API_BASE}/api/attendance/session/${session.id}/students`
                );
                setAttendanceRows(normalizeRoster(res.data));
            } catch (error) {
                console.error('Failed to fetch roster', error);
            }
        };

        fetchRoster();
        return undefined;
    }, [session]);

    useEffect(() => {
        if (!session) {
            return undefined;
        }

        setLiveStudents([]);

        const fetchLiveStudents = async () => {
            try {
                const [attendanceRes, bleRes] = await Promise.allSettled([
                    axios.get(`${API_BASE}/api/attendance/live`),
                    axios.get(`${API_BASE}/api/ble/live-radar`)
                ]);

                const attendanceData =
                    attendanceRes.status === 'fulfilled' && Array.isArray(attendanceRes.value?.data?.data)
                        ? attendanceRes.value.data.data
                        : [];

                const bleData =
                    bleRes.status === 'fulfilled' && Array.isArray(bleRes.value?.data)
                        ? bleRes.value.data
                        : [];

                const mergedById = new Map();
                [...attendanceData, ...bleData].forEach((student) => {
                    const key = String(student?.student_id ?? '').trim();
                    if (key) {
                        mergedById.set(key, student);
                    }
                });

                setLiveStudents(Array.from(mergedById.values()));
            } catch (error) {
                console.error('Failed to fetch live students', error);
            }
        };

        fetchLiveStudents();
        const intervalId = setInterval(fetchLiveStudents, 2000);
        return () => clearInterval(intervalId);
    }, [session]);

    useEffect(() => {
        setAttendanceRows((prevRows) =>
            prevRows.map((row) => {
                if (row.manual_override) {
                    return row;
                }

                const detected = liveStudents.some((student) => isDetectedForRow(row, student));
                return {
                    ...row,
                    status: detected ? 'present' : 'absent'
                };
            })
        );
    }, [liveStudents]);

    const updateRow = (studentId, updates) => {
        setAttendanceRows((prevRows) =>
            prevRows.map((row) =>
                row.student_id === studentId ? { ...row, ...updates } : row
            )
        );
    };

    const handleStatusChange = (studentId, status) => {
        updateRow(studentId, {
            status,
            manual_override: true
        });
    };

    const handleCommentChange = (studentId, comment) => {
        updateRow(studentId, { comment });
    };

    const markAll = (status) => {
        setAttendanceRows((prevRows) =>
            prevRows.map((row) => ({
                ...row,
                status,
                manual_override: true
            }))
        );
    };

    const handleSaveAttendance = async () => {
        if (!session) {
            return;
        }

        try {
            setIsSaving(true);
            setSaveMessage('');

            await axios.post(`${API_BASE}/api/attendance/save`, {
                session_id: session.id,
                attendance: buildAttendancePayload(attendanceRows)
            });

            setSaveMessage('Attendance saved successfully.');
        } catch (error) {
            console.error('Failed to save attendance', error);
            setSaveMessage('Failed to save attendance.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleSaveSession = async () => {
        if (!session) {
            return;
        }

        try {
            setIsSavingSession(true);
            setSaveMessage('');

            await axios.post(`${API_BASE}/api/attendance/logs`, {
                session_id: session.id,
                subject: session.subject,
                batch: session.batch,
                division: session.division,
                attendance: buildAttendancePayload(attendanceRows)
            });

            setSaveMessage('Session saved successfully.');
        } catch (error) {
            console.error('Failed to save session', error);
            setSaveMessage('Failed to save session.');
        } finally {
            setIsSavingSession(false);
        }
    };

    const handleExportCsv = () => {
        if (!session || attendanceRows.length === 0) {
            setSaveMessage('No attendance data to export.');
            return;
        }

        const headers = ['PRN', 'Name', 'Status', 'Comment'];
        const rows = attendanceRows.map((row) => [
            `"${String(row.prn ?? '').replace(/"/g, '""')}"`,
            `"${String(row.name ?? '').replace(/"/g, '""')}"`,
            `"${String(row.status ?? '').replace(/"/g, '""')}"`,
            `"${String(row.comment ?? '').replace(/"/g, '""')}"`
        ]);

        const csv = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        const safeSubject = String(session.subject || 'session').replace(/\s+/g, '_');
        const safeDivision = String(session.division || 'division').replace(/\s+/g, '_');
        link.href = url;
        link.download = `attendance_${safeSubject}_${safeDivision}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        setSaveMessage('CSV exported successfully.');
    };

    const presentCount = attendanceRows.filter((row) => row.status === 'present').length;
    const lateCount = attendanceRows.filter((row) => row.status === 'late').length;
    const absentCount = attendanceRows.filter((row) => row.status === 'absent').length;

    if (!session) {
        return (
            <div className="flex bg-campus-bg min-h-screen">
                <Sidebar />
                <div className="ml-64 p-8 w-full flex justify-center">
                    <CreateSession onSessionStart={setSession} />
                </div>
            </div>
        );
    }

    return (
        <div className="flex bg-campus-bg min-h-screen text-campus-text">
            <Sidebar />

            <div className="ml-64 flex-1 p-8">
                <div className="flex justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">Classroom Radar</h1>
                        <p>{session.subject} • {session.division}</p>
                    </div>

                    <div className="flex gap-4 items-center">
                        <div className="bg-campus-card px-4 py-2 rounded-xl">
                            Gateway Active
                        </div>

                        <div className="bg-campus-card px-4 py-2 rounded-xl">
                            Present: {presentCount}
                        </div>

                        <button
                            onClick={async () => {
                                await axios.post(`${API_BASE}/api/session/stop`);
                                setSession(null);
                                setAttendanceRows([]);
                                setLiveStudents([]);
                                setSaveMessage('');
                            }}
                            className="bg-red-500 px-4 py-2 rounded-xl text-white"
                        >
                            Stop
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-6 items-start">
                    <div className="bg-campus-card p-6 rounded-2xl flex flex-col gap-4 h-fit">
                        <div className="flex items-center justify-center">
                            <Radio size={60} />
                        </div>
                        <div className="grid grid-cols-1 gap-3 text-sm">
                            <div className="bg-campus-bg rounded-xl px-4 py-3">
                                <div className="text-campus-secondary">Present</div>
                                <div className="text-2xl font-bold">{presentCount}</div>
                            </div>
                            <div className="bg-campus-bg rounded-xl px-4 py-3">
                                <div className="text-campus-secondary">Late</div>
                                <div className="text-2xl font-bold">{lateCount}</div>
                            </div>
                            <div className="bg-campus-bg rounded-xl px-4 py-3">
                                <div className="text-campus-secondary">Absent</div>
                                <div className="text-2xl font-bold">{absentCount}</div>
                            </div>
                            <div className="bg-campus-bg rounded-xl px-4 py-3">
                                <div className="text-campus-secondary">Live NFC Detections</div>
                                <div className="text-2xl font-bold">{liveStudents.length}</div>
                            </div>
                        </div>
                    </div>

                    <div className="col-span-2 bg-campus-card p-6 rounded-2xl">
                        <div className="flex justify-between items-start mb-4 gap-4">
                            <div>
                                <h2 className="font-bold flex gap-2 items-center">
                                    <Activity size={18} /> Students
                                </h2>
                                <p className="text-sm text-campus-secondary mt-1">
                                    NFC detections mark students as present automatically unless you manually override them.
                                </p>
                            </div>

                            <div className="flex gap-2 flex-wrap justify-end">
                                <button
                                    onClick={() => markAll('present')}
                                    className="bg-green-600 px-4 py-2 rounded-xl text-white text-sm font-semibold"
                                >
                                    Mark all Present
                                </button>
                                <button
                                    onClick={() => markAll('absent')}
                                    className="bg-red-500 px-4 py-2 rounded-xl text-white text-sm font-semibold"
                                >
                                    Mark all Absent
                                </button>
                                <button
                                    onClick={handleExportCsv}
                                    className="bg-slate-700 px-4 py-2 rounded-xl text-white text-sm font-semibold"
                                >
                                    Export CSV
                                </button>
                                <button
                                    onClick={handleSaveSession}
                                    disabled={isSavingSession}
                                    className="bg-indigo-600 px-4 py-2 rounded-xl text-white text-sm font-semibold disabled:opacity-60"
                                >
                                    {isSavingSession ? 'Saving Session...' : 'Save Session'}
                                </button>
                                <button
                                    onClick={handleSaveAttendance}
                                    disabled={isSaving}
                                    className="bg-campus-primary px-4 py-2 rounded-xl text-white text-sm font-semibold flex items-center gap-2 disabled:opacity-60"
                                >
                                    <Save size={16} />
                                    {isSaving ? 'Saving...' : 'Save Attendance'}
                                </button>
                            </div>
                        </div>

                        {saveMessage ? (
                            <div className="mb-4 text-sm text-campus-secondary">{saveMessage}</div>
                        ) : null}

                        {attendanceRows.length === 0 ? (
                            <div className="bg-campus-bg rounded-xl p-6 text-campus-secondary flex items-center gap-2">
                                <Users size={18} />
                                No students found for this class.
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full border-separate border-spacing-y-2">
                                    <thead>
                                        <tr className="text-left text-sm text-campus-secondary">
                                            <th className="px-4 py-2">PRN</th>
                                            <th className="px-4 py-2">Name</th>
                                            <th className="px-4 py-2">Attendance Status</th>
                                            <th className="px-4 py-2">Comment</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {attendanceRows.map((row) => (
                                            <tr
                                                key={row.student_id}
                                                className={`${statusStyles[row.status]} border`}
                                            >
                                                <td className="px-4 py-4 font-semibold rounded-l-xl">
                                                    {row.prn}
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="font-semibold">{row.name}</div>
                                                    <span className={`inline-flex mt-2 px-2 py-1 rounded-full text-xs font-semibold capitalize ${statusBadgeStyles[row.status]}`}>
                                                        {row.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="flex gap-4 flex-wrap">
                                                        {['present', 'late', 'absent'].map((status) => (
                                                            <label
                                                                key={`${row.student_id}-${status}`}
                                                                className="flex items-center gap-2 text-sm cursor-pointer"
                                                            >
                                                                <input
                                                                    type="radio"
                                                                    name={`attendance-${row.student_id}`}
                                                                    checked={row.status === status}
                                                                    onChange={() => handleStatusChange(row.student_id, status)}
                                                                    className="accent-campus-primary"
                                                                />
                                                                <span className="capitalize">{status}</span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 rounded-r-xl">
                                                    <input
                                                        type="text"
                                                        value={row.comment}
                                                        onChange={(event) => handleCommentChange(row.student_id, event.target.value)}
                                                        placeholder="Add comment"
                                                        className="w-full border border-campus-border bg-white/80 px-3 py-2 rounded-lg text-sm outline-none focus:border-campus-primary"
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Attendance;
