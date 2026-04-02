import React from 'react';
import Sidebar from '../components/Sidebar';
import { BookOpen, MapPin, Users, BookMarked, Monitor } from 'lucide-react';

const Library = () => {
    // 📍 Updated to match your single-floor, two-area layout
    const zones = [
        {
            name: "Front Student Area",
            capacity: 60,
            occupied: 42,
            status: "Normal",
            description: "Active collaboration & digital zone"
        },
        {
            name: "Back Student Area",
            capacity: 40,
            occupied: 38,
            status: "Near Full",
            description: "Quiet study & research zone"
        },
    ];

    return (
        <div className="flex bg-campus-bg min-h-screen font-sans text-campus-text transition-colors duration-300">
            <Sidebar />

            <div className="ml-64 flex-1 p-8">
                {/* Header */}
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h1 className="text-4xl font-black text-campus-text flex items-center gap-3 tracking-tight">
                            <BookOpen className="text-purple-400" size={36} />
                            Smart Library
                        </h1>
                        <p className="text-campus-secondary mt-1 font-medium italic">Single Floor: Automated Utilization Tracking</p>
                    </div>
                    <div className="bg-[#0f2435] px-6 py-3 rounded-2xl border border-campus-border flex items-center gap-3 font-black text-white shadow-xl">
                        <Users size={20} className="text-purple-400"/> Total Readers: 80
                    </div>
                </div>

                {/* 📍 Grid updated to 2 columns to represent your specific areas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                    {zones.map((zone, idx) => (
                        <div key={idx} className="bg-[#0f2435] p-8 rounded-[2.5rem] border-2 border-transparent hover:border-purple-500/50 transition-all group shadow-2xl">
                            <div className="flex justify-between items-start mb-6">
                                <div className={`p-4 rounded-2xl ${zone.status === 'Near Full' ? 'bg-red-500/10 text-red-500' : 'bg-purple-500/10 text-purple-400'}`}>
                                    {idx === 0 ? <Monitor size={28} /> : <MapPin size={28} />}
                                </div>
                                <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${zone.status === 'Near Full' ? 'border-red-500/50 text-red-500' : 'border-green-500/50 text-green-500'}`}>
                                    {zone.status}
                                </span>
                            </div>

                            <h3 className="font-black text-2xl text-white mb-1 tracking-tight">{zone.name}</h3>
                            <p className="text-campus-secondary text-sm mb-6">{zone.description}</p>

                            <div className="flex items-end gap-2">
                                <span className="text-4xl font-black text-white">{zone.occupied}</span>
                                <span className="text-xl font-bold text-campus-secondary mb-1">/ {zone.capacity}</span>
                                <span className="ml-auto text-xs font-bold text-purple-400 uppercase tracking-tighter">Seats Occupied</span>
                            </div>

                            {/* Progress Bar for visual impact */}
                            <div className="w-full h-2 bg-white/5 rounded-full mt-4 overflow-hidden">
                                <div
                                    className={`h-full transition-all duration-1000 ${zone.status === 'Near Full' ? 'bg-red-500' : 'bg-purple-500'}`}
                                    style={{ width: `${(zone.occupied / zone.capacity) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Active Sessions List */}
                <div className="bg-[#0f2435] rounded-[3rem] p-8 border border-campus-border shadow-2xl">
                    <h3 className="font-black text-xl text-white mb-6 flex items-center gap-3 uppercase tracking-widest text-sm">
                        <BookMarked size={20} className="text-purple-400" /> Live Study Sessions
                    </h3>
                    <div className="space-y-4">
                        {['Ananya Sharma', 'Vikram Singh', 'Rohan Gupta'].map((name, idx) => (
                            <div key={idx} className="flex justify-between items-center p-5 bg-[#061E29] rounded-[1.5rem] border border-white/5 hover:border-purple-500/30 transition-colors group">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-black text-xl border border-purple-500/20">
                                        {name.charAt(0)}
                                    </div>
                                    <div>
                                        <span className="font-black text-white block">{name}</span>
                                        <span className="text-[10px] text-campus-secondary uppercase font-bold">Verified via BLE Beacon</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="block text-xs font-bold text-purple-400">Session Length</span>
                                    <span className="text-sm font-mono text-white bg-white/5 px-3 py-1 rounded-lg">
                                        {Math.floor(Math.random() * 3) + 1}h {Math.floor(Math.random() * 60)}m
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Library;