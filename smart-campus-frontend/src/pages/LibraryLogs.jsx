import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import { Search, CheckCircle } from 'lucide-react';
import API_BASE from '../api';

const LibraryLogs = () => {
    const [transactions, setTransactions] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchLogs = useCallback(() => {
        return axios
            .get(`${API_BASE}/api/library/transactions`)
            .then((res) => {
                setTransactions(res.data);
            })
            .catch((err) => {
                console.error('Fetch error:', err);
            });
    }, []);

    // New Function: Clear fine in database and refresh UI
    const handleClearFine = async (id) => {
        if (!window.confirm("Mark this fine as paid and clear it?")) return;
        try {
            await axios.post(`${API_BASE}/api/library/clear-fine/${id}`);
            fetchLogs(); // Refresh logs to show the fine is now 0
        } catch (err) {
            console.error("Error clearing fine:", err);
            alert("Failed to clear fine. Check if the backend route exists.");
        }
    };

    useEffect(() => {
        fetchLogs();
        const interval = setInterval(fetchLogs, 5000);
        return () => clearInterval(interval);
    }, [fetchLogs]);

    const filtered = transactions.filter(t =>
        t.user_uid?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.book_uid?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex bg-campus-bg min-h-screen text-campus-text">
            <Sidebar />
            <div className="ml-64 flex-1 p-10">
                <header className="mb-10">
                    <h1 className="text-4xl font-extrabold">Library History</h1>
                    <p className="text-campus-secondary">Search and track all book transactions</p>
                </header>

                <div className="relative mb-8 max-w-md">
                    <Search className="absolute left-4 top-3.5 text-campus-secondary" size={20} />
                    <input
                        type="text"
                        placeholder="Search student UID or book UID..."
                        className="w-full pl-12 p-3 rounded-xl bg-campus-card border border-campus-border outline-none focus:border-campus-primary"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="bg-campus-card rounded-2xl border border-campus-border overflow-hidden shadow-xl">
                    <table className="w-full text-left">
                        <thead className="bg-campus-bg text-campus-secondary text-xs uppercase font-bold">
                            <tr>
                                <th className="p-6">Book UID</th>
                                <th className="p-6">Student UID</th>
                                <th className="p-6">Issue Date</th>
                                <th className="p-6">Return Date</th>
                                <th className="p-6">Fine</th>
                                <th className="p-6 text-center">Action</th>
                                <th className="p-6">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-campus-border">
                            {filtered.length > 0 ? (
                                filtered.map((t) => (
                                    <tr key={t.id} className="hover:bg-campus-bg/50 transition border-b border-campus-border">
                                        <td className="p-6 font-bold">{t.book_uid}</td>
                                        <td className="p-6 font-medium">{t.user_uid}</td>
                                        <td className="p-6 text-sm text-campus-secondary">
                                            {new Date(t.issue_date).toLocaleString()}
                                        </td>
                                        <td className="p-6 text-sm text-campus-secondary">
                                            {t.return_date ? new Date(t.return_date).toLocaleString() : '—'}
                                        </td>
                                        <td className={`p-6 font-bold ${t.fine_amount > 0 ? 'text-red-500' : 'text-campus-secondary'}`}>
                                            {t.fine_amount > 0 ? `₹${t.fine_amount}` : '—'}
                                        </td>
                                        
                                        {/* Action Column for Clearing Fines */}
                                        <td className="p-6 text-center">
                                            {t.fine_amount > 0 ? (
                                                <button 
                                                    onClick={() => handleClearFine(t.id)}
                                                    className="flex items-center gap-1 mx-auto bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                                                >
                                                    <CheckCircle size={14} />
                                                    Clear Fine
                                                </button>
                                            ) : (
                                                <span className="text-xs text-gray-500 italic">No Dues</span>
                                            )}
                                        </td>

                                        <td className="p-6">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                t.status === 'RETURNED'
                                                    ? 'bg-green-100 text-green-600'
                                                    : 'bg-yellow-100 text-yellow-600'
                                            }`}>
                                                {t.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="p-10 text-center text-campus-secondary">
                                        No transactions found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default LibraryLogs;