import React from 'react';
import Sidebar from '../components/Sidebar';
import { Coffee, Users, Clock, Flame, Utensils } from 'lucide-react';

const Canteen = () => {
    const activeStudents = [
        { name: "Rahul Verma", time: "10:15 AM", zone: "Snack Counter" },
        { name: "Priya Singh", time: "10:20 AM", zone: "Seating Area B" },
        { name: "Amit Patel", time: "10:28 AM", zone: "Beverage Station" },
        { name: "Sneha Reddy", time: "10:30 AM", zone: "Main Checkout" },
    ];

    return (
        <div className="flex bg-campus-bg min-h-screen font-sans text-campus-text transition-colors duration-300">
            <Sidebar />

            <div className="ml-64 flex-1 p-8">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold text-campus-text flex items-center gap-3">
                            <Coffee className="text-orange-500" size={32} />
                            Smart Canteen
                        </h1>
                        <p className="text-campus-secondary mt-1">Live Crowd Density & Wait Time Analytics</p>
                    </div>
                    <div className="bg-orange-500/10 text-orange-500 px-4 py-2 rounded-xl font-bold border border-orange-500/20 flex items-center gap-2">
                        <Flame size={18} /> Peak Hours
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-campus-card p-6 rounded-2xl shadow-sm border border-campus-border flex items-center gap-4">
                        <div className="bg-orange-100 p-4 rounded-xl text-orange-600"><Users size={28} /></div>
                        <div>
                            <p className="text-sm text-campus-secondary font-bold uppercase">Current Crowd</p>
                            <h2 className="text-3xl font-extrabold text-campus-text">142</h2>
                        </div>
                    </div>
                    <div className="bg-campus-card p-6 rounded-2xl shadow-sm border border-campus-border flex items-center gap-4">
                        <div className="bg-blue-100 p-4 rounded-xl text-blue-600"><Clock size={28} /></div>
                        <div>
                            <p className="text-sm text-campus-secondary font-bold uppercase">Est. Wait Time</p>
                            <h2 className="text-3xl font-extrabold text-campus-text">12 Min</h2>
                        </div>
                    </div>
                    <div className="bg-campus-card p-6 rounded-2xl shadow-sm border border-campus-border">
                        <p className="text-sm text-campus-secondary font-bold uppercase mb-2">Capacity Status</p>
                        <div className="flex justify-between text-sm font-bold mb-1">
                            <span className="text-orange-500">85% Full</span>
                            <span className="text-campus-text">142 / 160</span>
                        </div>
                        <div className="w-full bg-campus-bg rounded-full h-3 border border-campus-border overflow-hidden">
                            <div className="bg-orange-500 h-3 rounded-full" style={{ width: '85%' }}></div>
                        </div>
                    </div>
                </div>

                <div className="bg-campus-card rounded-3xl p-6 shadow-sm border border-campus-border">
                    <h3 className="font-bold text-lg text-campus-text mb-4 flex items-center gap-2">
                        <Utensils size={20} className="text-campus-primary" /> Recent Check-ins
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {activeStudents.map((student, idx) => (
                            <div key={idx} className="flex justify-between items-center p-4 bg-campus-bg rounded-xl border border-campus-border">
                                <div className="font-bold text-campus-text">{student.name}</div>
                                <div className="text-right">
                                    <span className="text-xs text-campus-secondary block">{student.time}</span>
                                    <span className="text-xs font-bold text-orange-500">{student.zone}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Canteen;