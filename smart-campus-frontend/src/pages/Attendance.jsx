import { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import { Radio, Users, TrendingUp, Activity } from 'lucide-react';

const Attendance = () => {
    const [liveStudents, setLiveStudents] = useState([]);
    const [isPolling, setIsPolling] = useState(true);

    // Poll the Node.js backend every 3 seconds
    useEffect(() => {
        const fetchLiveAttendance = async () => {
            if (!isPolling) return;
            try {
                // Point this to your new backend endpoint
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

    return (
        <div className="flex bg-campus-bg min-h-screen font-sans text-campus-text transition-colors duration-300">
            <Sidebar />

            <div className="ml-64 flex-1 p-8">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold text-campus-text">Classroom Radar</h1>
                        <p className="text-campus-secondary">Live BLE Proximity Detection</p>
                    </div>

                    <div className="flex gap-4">
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
                                <p className="text-3xl font-bold text-campus-text">{liveStudents.length}</p>
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
                        <div className="p-6 border-b border-campus-border bg-campus-bg/50 flex justify-between items-center">
                            <h3 className="font-bold flex items-center gap-2 text-campus-text">
                                <Activity size={18}/> Active Session Logs
                            </h3>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {liveStudents.length === 0 ? (
                                <div className="h-full flex items-center justify-center text-campus-secondary">
                                    No students detected in range.
                                </div>
                            ) : (
                                liveStudents.map((data, index) => (
                                    <div key={index} className="flex items-center justify-between p-4 bg-campus-bg rounded-xl border border-campus-border hover:border-campus-primary transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-campus-card border border-campus-border flex items-center justify-center text-campus-text font-bold uppercase">
                                                {data.student_name.charAt(0)}
                                            </div>
                                            <div>
                                                <span className="font-bold text-campus-text block">{data.student_name}</span>
                                                <span className="text-xs text-campus-secondary font-mono">Signal: {data.rssi} dBm</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className="text-right hidden sm:block">
                                                <span className="text-xs text-campus-secondary block uppercase">Engagement</span>
                                                <span className="font-bold text-campus-primary">{data.engagement_score}%</span>
                                            </div>
                                            <span className="px-3 py-1 rounded-lg text-xs font-bold bg-green-100 text-green-700 border border-green-200">
                                                Inside Room
                                            </span>
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