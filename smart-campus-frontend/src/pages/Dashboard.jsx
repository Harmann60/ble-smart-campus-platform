import React from 'react';
import Sidebar from '../components/Sidebar';
import { Users, Radio, Activity, TrendingUp, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const Dashboard = () => {
  // Mock data for the CSS bar chart
  const weeklyData = [
    { day: 'Mon', attendance: 85, engagement: 90 },
    { day: 'Tue', attendance: 88, engagement: 85 },
    { day: 'Wed', attendance: 92, engagement: 95 },
    { day: 'Thu', attendance: 80, engagement: 82 },
    { day: 'Fri', attendance: 95, engagement: 98 },
  ];

  // Mock data for live activity feed
  const recentActivity = [
    { time: '10:28 AM', text: 'Gateway ESP-104 went online.', type: 'system' },
    { time: '10:15 AM', text: 'Dr. Sharma exported Attendance Log (Room 104).', type: 'user' },
    { time: '09:55 AM', text: 'Unrecognized MAC address flagged in Library.', type: 'alert' },
    { time: '09:00 AM', text: 'Morning session started across 3 classrooms.', type: 'system' },
  ];

  return (
      <div className="flex bg-campus-bg min-h-screen font-sans text-campus-text transition-colors duration-300">
        <Sidebar />

        <div className="ml-64 flex-1 p-8">
          {/* HEADER */}
          <div className="flex justify-between items-end mb-8">
            <div>
              <h1 className="text-3xl font-extrabold text-campus-text">Platform Overview</h1>
              <p className="text-campus-secondary mt-1">Real-time Smart Campus Analytics</p>
            </div>
            <div className="bg-campus-primary/10 text-campus-primary px-4 py-2 rounded-xl font-bold border border-campus-primary/20">
              Spring Semester 2026
            </div>
          </div>

          {/* TOP METRIC CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Card 1 */}
            <div className="bg-campus-card p-6 rounded-2xl shadow-sm border border-campus-border hover:border-campus-primary transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-blue-100 p-3 rounded-xl text-blue-600"><Users size={24} /></div>
                <span className="text-green-500 text-sm font-bold flex items-center gap-1"><TrendingUp size={14}/> +2.4%</span>
              </div>
              <p className="text-campus-secondary text-sm font-bold uppercase">Total Students</p>
              <h2 className="text-3xl font-extrabold text-campus-text mt-1">1,240</h2>
            </div>

            {/* Card 2 */}
            <div className="bg-campus-card p-6 rounded-2xl shadow-sm border border-campus-border hover:border-campus-primary transition-all relative overflow-hidden">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-green-100 p-3 rounded-xl text-green-600"><Radio size={24} /></div>
                <div className="flex items-center gap-2">
                                <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                                </span>
                  <span className="text-xs font-bold text-green-600 uppercase">Live</span>
                </div>
              </div>
              <p className="text-campus-secondary text-sm font-bold uppercase">Active ESP32 Gateways</p>
              <h2 className="text-3xl font-extrabold text-campus-text mt-1">3 / 3</h2>
            </div>

            {/* Card 3 */}
            <div className="bg-campus-card p-6 rounded-2xl shadow-sm border border-campus-border hover:border-campus-primary transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-purple-100 p-3 rounded-xl text-purple-600"><CheckCircle size={24} /></div>
                <span className="text-campus-secondary text-sm font-bold">This Week</span>
              </div>
              <p className="text-campus-secondary text-sm font-bold uppercase">Avg. Daily Attendance</p>
              <h2 className="text-3xl font-extrabold text-campus-text mt-1">87.5%</h2>
            </div>

            {/* Card 4 */}
            <div className="bg-campus-card p-6 rounded-2xl shadow-sm border border-campus-border hover:border-campus-primary transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-orange-100 p-3 rounded-xl text-orange-600"><Activity size={24} /></div>
                <span className="text-green-500 text-sm font-bold flex items-center gap-1"><TrendingUp size={14}/> +5.1%</span>
              </div>
              <p className="text-campus-secondary text-sm font-bold uppercase">Campus Engagement Score</p>
              <h2 className="text-3xl font-extrabold text-campus-text mt-1">92.0%</h2>
            </div>
          </div>

          {/* BOTTOM SECTION: CHARTS & ACTIVITY */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* CUSTOM CSS BAR CHART (Spans 2 columns) */}
            <div className="lg:col-span-2 bg-campus-card rounded-3xl p-6 shadow-sm border border-campus-border">
              <h3 className="font-bold text-lg text-campus-text mb-6">Weekly Proximity Analytics</h3>

              <div className="flex items-end gap-4 h-64 mt-4 border-b border-campus-border pb-4 relative">
                {/* Y-Axis Guidelines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-10">
                  <div className="border-t border-campus-text w-full h-0"></div>
                  <div className="border-t border-campus-text w-full h-0"></div>
                  <div className="border-t border-campus-text w-full h-0"></div>
                  <div className="border-t border-campus-text w-full h-0"></div>
                </div>

                {/* Chart Bars */}
                {weeklyData.map((data, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center justify-end h-full group relative z-10">
                      {/* Tooltip on hover */}
                      <div className="opacity-0 group-hover:opacity-100 absolute -top-10 bg-campus-text text-campus-bg text-xs font-bold px-3 py-1 rounded-lg transition-opacity whitespace-nowrap">
                        Att: {data.attendance}% | Eng: {data.engagement}%
                      </div>

                      <div className="flex items-end gap-1 w-full justify-center h-full pb-2">
                        {/* Attendance Bar */}
                        <div
                            className="w-1/3 bg-campus-primary rounded-t-md transition-all duration-500 hover:opacity-80"
                            style={{ height: `${data.attendance}%` }}
                        ></div>
                        {/* Engagement Bar */}
                        <div
                            className="w-1/3 bg-blue-400 rounded-t-md transition-all duration-500 hover:opacity-80"
                            style={{ height: `${data.engagement}%` }}
                        ></div>
                      </div>
                      <span className="text-campus-secondary text-sm font-bold mt-2">{data.day}</span>
                    </div>
                ))}
              </div>

              <div className="flex gap-6 mt-4 justify-center">
                <div className="flex items-center gap-2 text-sm font-bold text-campus-secondary">
                  <div className="w-3 h-3 rounded-full bg-campus-primary"></div> Attendance Rate
                </div>
                <div className="flex items-center gap-2 text-sm font-bold text-campus-secondary">
                  <div className="w-3 h-3 rounded-full bg-blue-400"></div> Engagement Score
                </div>
              </div>
            </div>

            {/* LIVE ACTIVITY FEED */}
            <div className="bg-campus-card rounded-3xl p-6 shadow-sm border border-campus-border">
              <h3 className="font-bold text-lg text-campus-text mb-6 flex items-center gap-2">
                <Clock size={20} className="text-campus-primary"/> System Activity Log
              </h3>

              <div className="space-y-6">
                {recentActivity.map((log, index) => (
                    <div key={index} className="flex gap-4 relative">
                      {/* Timeline line */}
                      {index !== recentActivity.length - 1 && (
                          <div className="absolute left-[11px] top-8 bottom-[-24px] w-[2px] bg-campus-border"></div>
                      )}

                      <div className="relative z-10 bg-campus-bg rounded-full p-1 border border-campus-border h-max">
                        {log.type === 'alert' ? <AlertCircle size={14} className="text-red-500"/> :
                            log.type === 'user' ? <Users size={14} className="text-blue-500"/> :
                                <CheckCircle size={14} className="text-green-500"/>}
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-campus-text leading-tight">{log.text}</p>
                        <span className="text-xs text-campus-secondary mt-1 block">{log.time}</span>
                      </div>
                    </div>
                ))}
              </div>

              <button className="w-full mt-8 py-3 rounded-xl border border-campus-border text-campus-secondary font-bold text-sm hover:bg-campus-bg hover:text-campus-primary transition-colors">
                View All Logs
              </button>
            </div>

          </div>
        </div>
      </div>
  );
};

export default Dashboard;