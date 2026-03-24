import { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import { Radio, Users } from 'lucide-react';

import CreateSession from '../components/CreateSession';
import StudentTable from '../components/StudentTable';

const Attendance = () => {

    const [session, setSession] = useState(null);
    const [liveStudents, setLiveStudents] = useState([]);

    useEffect(() => {
        if (!session) return;

        const fetchLiveAttendance = async () => {
            try {
                const res = await axios.get(
                    `http://localhost:5000/api/attendance/${session.id}`
                );
                setLiveStudents(res.data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchLiveAttendance();
        const interval = setInterval(fetchLiveAttendance, 2000);

        return () => clearInterval(interval);

    }, [session]);

    // 🔴 NO SESSION SCREEN
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

                {/* HEADER */}
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold">Classroom Radar</h1>
                        <p className="text-campus-secondary">
                            {session.subject} • {session.class_name}
                        </p>
                    </div>

                    <div className="flex gap-4 items-center">

                        {/* Gateway */}
                        <div className="bg-campus-card px-6 py-4 rounded-2xl border flex items-center gap-3">
                            <span className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></span>
                            <span className="text-sm font-bold">Gateway Active</span>
                        </div>

                        {/* Count */}
                        <div className="bg-campus-card px-6 py-4 rounded-2xl border flex items-center gap-3">
                            <Users size={20} />
                            <div>
                                <p className="text-xs">Present</p>
                                <p className="text-xl font-bold">{liveStudents.length}</p>
                            </div>
                        </div>

                        {/* STOP */}
                        <button
                            onClick={async () => {
                                await axios.post('http://localhost:5000/api/session/stop');
                                setSession(null);
                            }}
                            className="bg-red-500 px-4 py-2 rounded-lg text-white"
                        >
                            Stop
                        </button>

                    </div>
                </div>

                {/* GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* RADAR */}
                    <div className="bg-campus-card rounded-3xl p-8 border flex flex-col items-center justify-center relative">

                        <h2 className="absolute top-6 left-6 font-bold flex gap-2">
                            <Radio size={18} /> Scanning...
                        </h2>

                        <div className="relative w-64 h-64 flex items-center justify-center">

                            <div className="absolute inset-0 border rounded-full opacity-30"></div>
                            <div className="absolute inset-6 border rounded-full opacity-40"></div>
                            <div className="absolute inset-12 border rounded-full opacity-50"></div>

                            <div className="bg-campus-primary p-6 rounded-full">
                                <Radio size={40} className="text-white" />
                            </div>
                        </div>
                    </div>

                    {/* TABLE */}
                    <div className="lg:col-span-2 bg-campus-card rounded-3xl border flex flex-col">
                        <StudentTable sessionId={session.id} />
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Attendance;