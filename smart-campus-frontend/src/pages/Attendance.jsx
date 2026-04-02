import { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import { Radio, Users, Activity, Download, UserPlus, X, Save } from 'lucide-react';

// ==========================================
// 1. HELPER FUNCTION (Distance Math)
// ==========================================
const estimateLocation = (rssi) => {
    if (!rssi) return "Searching...";
    if (rssi >= -60) return "Front Row (< 2m)";
    if (rssi >= -80) return "Middle Row (2m - 5m)";
    return "Back Row (> 5m)";
};

const Attendance = () => {
    // Original States
    const [liveStudents, setLiveStudents] = useState([]);
    const [isPolling, setIsPolling] = useState(true);

    // New States for Demo Features
    const [manualStudents, setManualStudents] = useState([]);
    const [kickedStudents, setKickedStudents] = useState([]);
    const [announcedStudents, setAnnouncedStudents] = useState([]);
    const [manualName, setManualName] = useState("");

    // Poll the Node.js backend every 3 seconds
    useEffect(() => {
        const fetchLiveAttendance = async () => {
            if (!isPolling) return;
            try {
                const res = await axios.get('http://localhost:5000/api/ble/live-radar');
                setLiveStudents(res.data);
            } catch (err) {
                console.error("Error fetching live data:", err);
            }
        };

        fetchLiveAttendance();
        const interval = setInterval(fetchLiveAttendance, 3000);
        return () => clearInterval(interval);
    }, [isPolling]);

    // ==========================================
    // 2. DERIVED STATE (Combine Live & Manual, Hide Kicked)
    // ==========================================
    const displayStudents = [...liveStudents, ...manualStudents].filter(
        student => !kickedStudents.includes(student.student_name)
    );

    // ==========================================
    // 3. NEW STUDENT ALERT LOGIC
    // ==========================================
    useEffect(() => {
        displayStudents.forEach(student => {
            if (!announcedStudents.includes(student.student_name)) {
                // Comment this out if it gets annoying during dev!
                // alert(`🔔 ${student.student_name} has entered the classroom!`);
                setAnnouncedStudents(prev => [...prev, student.student_name]);
            }
        });
    }, [displayStudents, announcedStudents]);

    // ==========================================
    // 4. MANUAL OVERRIDE & KICK LOGIC
    // ==========================================
    const handleManualAdd = () => {
        if (manualName.trim() === "") return;
        const newStudent = {
            student_name: manualName,
            rssi: -45, // Fake strong signal
            engagement_score: 100 // Give them a perfect score
        };
        setManualStudents(prev => [...prev, newStudent]);
        setManualName("");
    };

    const handleKick = (studentName) => {
        setKickedStudents(prev => [...prev, studentName]);
    };

    // ==========================================
    // 5. EXPORT TO CSV LOGIC
    // ==========================================
    const handleExportCSV = () => {
        if (displayStudents.length === 0) {
            alert("No students to export!");
            return;
        }
        let csvContent = "data:text/csv;charset=utf-8,Student Name,Signal (RSSI),Estimated Location,Engagement Score,Timestamp\n";

        displayStudents.forEach(student => {
            const location = estimateLocation(student.rssi);
            const time = new Date().toLocaleTimeString();
            csvContent += `"${student.student_name}","${student.rssi}","${location}","${student.engagement_score}%","${time}"\n`;
        });

        const link = document.createElement("a");
        link.href = encodeURI(csvContent);
        link.download = "Smart_Campus_Attendance_Log.csv";
        link.click();
    };

    // ==========================================
    // 6. SAVE SESSION LOGIC (REAL LOCALSTORAGE SAVE)
    // ==========================================
    const handleSaveSession = async () => {
        if (displayStudents.length === 0) {
            alert("No students to save!");
            return;
        }

        // 1. Create a dynamic log object based on right now
        const newLog = {
            id: Date.now(), // Unique ID
            className: "Room 104 - Live Session",
            date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            totalPresent: displayStudents.length,
            students: displayStudents.map(student => ({
                name: student.student_name,
                rssi: student.rssi,
                status: "Present"
            }))
        };

        // 2. Fetch any previously saved logs from the browser memory
        const existingLogs = JSON.parse(localStorage.getItem('campus_attendance_logs')) || [];

        // 3. Save the new log at the top of the list!
        localStorage.setItem('campus_attendance_logs', JSON.stringify([newLog, ...existingLogs]));

        alert("✅ Session saved! Go check the Attendance Logs page.");
    };

    return (
        <div className="flex bg-campus-bg min-h-screen font-sans text-campus-text transition-colors duration-300">
            <Sidebar />

            <div className="ml-64 flex-1 p-8">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold text-campus-text">Classroom Radar</h1>
                        <p className="text-campus-secondary">Live BLE Proximity Detection</p>
                    </div>

                    <div className="flex gap-4 items-center">

                        {/* Save Session Button */}
                        <button
                            onClick={handleSaveSession}
                            className="bg-green-600 text-white px-4 py-3 rounded-2xl shadow-sm hover:bg-green-700 transition-colors flex items-center gap-2 font-bold"
                        >
                            <Save size={20} /> Save Session
                        </button>

                        {/* Export CSV Button */}
                        <button
                            onClick={handleExportCSV}
                            className="bg-campus-primary text-white px-4 py-3 rounded-2xl shadow-sm hover:opacity-90 transition-opacity flex items-center gap-2 font-bold"
                        >
                            <Download size={20} /> Export CSV
                        </button>

                        <div className="bg-campus-card px-6 py-4 rounded-2xl shadow-sm border border-campus-border flex items-center gap-3">
                            <div className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                            </div>
                            <span className="text-sm font-bold text-campus-text">Gateway Active</span>
                        </div>

                        <div className="bg-campus-card px-8 py-4 rounded-2xl shadow-sm border border-campus-border flex items-center gap-4">
                            <div className="bg-campus-bg p-3 rounded-full text-campus-text"><Users size={24} /></div>
                            <div>
                                <p className="text-xs uppercase font-bold text-campus-secondary">Currently Present</p>
                                <p className="text-3xl font-bold text-campus-text">{displayStudents.length}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[600px]">
                    {/* THE RADAR */}
                    <div className="bg-campus-card rounded-3xl p-8 shadow-xl border border-campus-border flex flex-col items-center justify-center relative overflow-hidden">
                        <h2 className="absolute top-6 left-6 font-bold text-campus-text flex items-center gap-2">
                            <Radio size={20} className="text-campus-primary" /> Scanning Room 104...
                        </h2>

                        <div className="relative w-64 h-64 flex items-center justify-center mt-8">
                            <div className="absolute inset-0 border border-campus-primary/20 rounded-full animate-[ping_3s_linear_infinite]"></div>
                            <div className="absolute inset-4 border border-campus-primary/40 rounded-full animate-[ping_3s_linear_infinite_delay-1s]"></div>
                            <div className="absolute inset-8 border border-campus-primary/60 rounded-full animate-[ping_3s_linear_infinite_delay-2s]"></div>

                            <div className="relative bg-campus-primary p-6 rounded-full shadow-lg shadow-campus-primary/50">
                                <Radio size={48} className="text-campus-bg" />
                            </div>
                        </div>
                    </div>

                    {/* LIVE ENGAGEMENT LIST */}
                    <div className="lg:col-span-2 bg-campus-card rounded-3xl shadow-sm border border-campus-border flex flex-col overflow-hidden">

                        {/* Header with Manual Add Input */}
                        <div className="p-6 border-b border-campus-border bg-campus-bg/50 flex justify-between items-center">
                            <h3 className="font-bold flex items-center gap-2 text-campus-text">
                                <Activity size={18}/> Active Session Logs
                            </h3>

                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    placeholder="Manual Entry..."
                                    value={manualName}
                                    onChange={(e) => setManualName(e.target.value)}
                                    className="bg-campus-bg border border-campus-border text-campus-text text-sm rounded-lg px-3 py-2 outline-none focus:border-campus-primary"
                                />
                                <button
                                    onClick={handleManualAdd}
                                    className="bg-green-100 text-green-700 hover:bg-green-200 border border-green-200 px-3 py-2 rounded-lg text-sm font-bold flex items-center gap-1 transition-colors"
                                >
                                    <UserPlus size={16} /> Mark Present
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {displayStudents.length === 0 ? (
                                <div className="h-full flex items-center justify-center text-campus-secondary">
                                    No students detected in range.
                                </div>
                            ) : (
                                displayStudents.map((data, index) => (
                                    <div key={index} className="flex items-center justify-between p-4 bg-campus-bg rounded-xl border border-campus-border hover:border-campus-primary transition-all group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-campus-card border border-campus-border flex items-center justify-center text-campus-text font-bold uppercase">
                                                {data.student_name.charAt(0)}
                                            </div>
                                            <div>
                                                <span className="font-bold text-campus-text block flex items-center gap-2">
                                                    {data.student_name}
                                                    {/* Location Tag */}
                                                    <span className="text-[10px] uppercase bg-campus-primary/10 text-campus-primary px-2 py-0.5 rounded-full">
                                                        {estimateLocation(data.rssi)}
                                                    </span>
                                                </span>
                                                <span className="text-xs text-campus-secondary font-mono">Signal: {data.rssi} dBm</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-6">
                                            <div className="text-right hidden sm:block">
                                                <span className="text-xs text-campus-secondary block uppercase">Engagement</span>
                                                <span className="font-bold text-campus-primary">{data.engagement_score}%</span>
                                            </div>
                                            <span className="px-3 py-1 rounded-lg text-xs font-bold bg-green-100 text-green-700 border border-green-200">
                                                Inside Room
                                            </span>

                                            {/* Kick Button (Visible on hover) */}
                                            <button
                                                onClick={() => handleKick(data.student_name)}
                                                className="opacity-0 group-hover:opacity-100 text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all"
                                                title="Mark Absent / Kick"
                                            >
                                                <X size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Attendance;