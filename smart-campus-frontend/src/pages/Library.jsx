import React from 'react';
import Sidebar from '../components/Sidebar';
import { BookOpen, MapPin, Users, VolumeX, BookMarked } from 'lucide-react';

const Library = () => {
    const zones = [
        { name: "Ground Floor (Reading)", capacity: 100, occupied: 45, status: "Normal" },
        { name: "First Floor (Silent Zone)", capacity: 50, occupied: 48, status: "Near Full" },
        { name: "Discussion Rooms", capacity: 30, occupied: 12, status: "Available" },
    ];

    return (
        <div className="flex bg-campus-bg min-h-screen font-sans text-campus-text transition-colors duration-300">
            <Sidebar />

            <div className="ml-64 flex-1 p-8">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold text-campus-text flex items-center gap-3">
                            <BookOpen className="text-purple-500" size={32} />
                            Smart Library
                        </h1>
                        <p className="text-campus-secondary mt-1">Automated Logins & Zone Utilization</p>
                    </div>
                    <div className="bg-campus-card px-4 py-2 rounded-xl shadow-sm border border-campus-border flex items-center gap-2 font-bold text-campus-text">
                        <Users size={18} className="text-purple-500"/> Total Readers: 105
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {zones.map((zone, idx) => (
                        <div key={idx} className="bg-campus-card p-6 rounded-2xl shadow-sm border border-campus-border hover:border-purple-500 transition-colors">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-xl ${zone.status === 'Near Full' ? 'bg-red-100 text-red-600' : 'bg-purple-100 text-purple-600'}`}>
                                    {zone.name.includes('Silent') ? <VolumeX size={24} /> : <MapPin size={24} />}
                                </div>
                                <span className={`text-xs font-bold px-2 py-1 rounded-lg ${zone.status === 'Near Full' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                    {zone.status}
                                </span>
                            </div>
                            <h3 className="font-bold text-lg text-campus-text mb-1">{zone.name}</h3>
                            <p className="text-campus-secondary text-sm">
                                <strong className="text-campus-text text-xl">{zone.occupied}</strong> / {zone.capacity} Seats Used
                            </p>
                        </div>
                    ))}
                </div>

                <div className="bg-campus-card rounded-3xl p-6 shadow-sm border border-campus-border">
                    <h3 className="font-bold text-lg text-campus-text mb-4 flex items-center gap-2">
                        <BookMarked size={20} className="text-campus-primary" /> Active Study Sessions
                    </h3>
                    <div className="space-y-3">
                        {['Ananya Sharma', 'Vikram Singh', 'Rohan Gupta'].map((name, idx) => (
                            <div key={idx} className="flex justify-between items-center p-4 bg-campus-bg rounded-xl border border-campus-border">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
                                        {name.charAt(0)}
                                    </div>
                                    <span className="font-bold text-campus-text">{name}</span>
                                </div>
                                <span className="text-xs font-mono text-campus-secondary px-3 py-1 bg-campus-card rounded-lg border border-campus-border">
                                    Session Length: {Math.floor(Math.random() * 3) + 1}h {Math.floor(Math.random() * 60)}m
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Library;