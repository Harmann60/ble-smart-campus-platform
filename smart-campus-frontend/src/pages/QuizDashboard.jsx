import { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import { Trophy, Target, Users, Award, BarChart3 } from 'lucide-react';

const API_BASE = 'http://localhost:5000';

const QuizDashboard = () => {
    const [analytics, setAnalytics] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await axios.get(`${API_BASE}/api/quiz/analytics`);
                setAnalytics(res.data);
            } catch (err) {
                console.error('Failed to fetch quiz analytics', err);
                setError('Failed to load quiz analytics. Is the backend running?');
            }
        };

        fetchAnalytics();
    }, []);

    return (
        <div className="flex bg-campus-bg min-h-screen font-sans text-campus-text transition-colors duration-300">
            <Sidebar />

            <div className="ml-64 flex-1 p-8">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold text-campus-text flex items-center gap-3">
                            <Trophy className="text-yellow-500" size={32} />
                            Live Quiz Analytics
                        </h1>
                        <p className="text-campus-secondary mt-1">Real-time performance insights from today's session</p>
                    </div>
                </div>

                {error ? (
                    <div className="bg-red-500/10 text-red-500 border border-red-500/20 p-6 rounded-2xl font-bold">
                        {error}
                    </div>
                ) : !analytics ? (
                    <div className="bg-campus-card border border-campus-border p-6 rounded-2xl text-campus-secondary font-bold">
                        Loading quiz analytics...
                    </div>
                ) : (
                    <>
                        <div className="bg-campus-card p-6 rounded-2xl shadow-sm border border-campus-border mb-8">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="bg-yellow-500/10 p-3 rounded-xl text-yellow-500"><BarChart3 size={24} /></div>
                                <div>
                                    <p className="text-campus-secondary text-sm font-bold uppercase">Quiz Title</p>
                                    <h2 className="text-xl font-extrabold text-campus-text">{analytics.quizTitle}</h2>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-campus-bg border border-campus-border p-6 rounded-2xl">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Users size={20} className="text-blue-500" />
                                        <p className="text-campus-secondary text-sm font-bold uppercase">Class Average</p>
                                    </div>
                                    <h3 className="text-3xl font-extrabold text-campus-text">{analytics.classAverage}%</h3>
                                </div>

                                <div className="bg-campus-bg border border-campus-border p-6 rounded-2xl">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Target size={20} className="text-green-500" />
                                        <p className="text-campus-secondary text-sm font-bold uppercase">Participants</p>
                                    </div>
                                    <h3 className="text-3xl font-extrabold text-campus-text">{analytics.totalParticipants}</h3>
                                </div>

                                <div className="bg-campus-bg border border-campus-border p-6 rounded-2xl">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Award size={20} className="text-purple-500" />
                                        <p className="text-campus-secondary text-sm font-bold uppercase">Top Performers</p>
                                    </div>
                                    <h3 className="text-xl font-extrabold text-campus-text">{analytics.topPerformers.join(', ')}</h3>
                                </div>
                            </div>
                        </div>

                        <div className="bg-campus-card p-6 rounded-2xl shadow-sm border border-campus-border">
                            <h3 className="font-bold text-lg text-campus-text mb-4">Hardest Question</h3>
                            <p className="text-campus-text text-sm mb-2">{analytics.hardestQuestion}</p>

                            <div className="flex justify-between items-center mb-2">
                                <span className="text-campus-secondary text-sm font-bold">Class Accuracy</span>
                                <span className="text-red-500 text-sm font-extrabold">{analytics.accuracyOnHardest}%</span>
                            </div>
                            <div className="w-full bg-campus-bg rounded-full h-3 border border-campus-border overflow-hidden">
                                <div className="bg-red-500 h-3 rounded-full" style={{ width: `${analytics.accuracyOnHardest}%` }}></div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default QuizDashboard;