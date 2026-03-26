import { Link, useLocation } from 'react-router-dom';
// 📍 ADDED FileText icon here:
import { LayoutDashboard, Coffee, BookOpen, CalendarDays, LogOut, History, FileText } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Sidebar = () => {
    const location = useLocation();
    const { theme, changeTheme } = useTheme();

    const menu = [
        { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
        { name: 'Attendance', path: '/attendance', icon: <CalendarDays size={20} /> },
        // 📍 ADDED ATTENDANCE LOGS HERE:
        { name: 'Attendance Logs', path: '/attendance-logs', icon: <FileText size={20} /> },
        { name: 'Library', path: '/library', icon: <BookOpen size={20} /> },
        { name: 'Library Logs', path: '/library-logs', icon: <History size={20} /> },
        { name: 'Smart Canteen', path: '/canteen', icon: <Coffee size={20} /> },
    ];

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    return (
        <div className="h-screen w-64 bg-campus-card border-r border-campus-border flex flex-col fixed left-0 top-0 transition-colors duration-300">

            {/* Header */}
            <div className="p-8 flex items-center gap-3">
                <h1 className="text-2xl font-extrabold text-campus-text tracking-tight">Iden<span className="text-campus-secondary">ta</span></h1>
            </div>

            {/* Menu */}
            <nav className="flex-1 px-4 space-y-2 mt-4">
                {menu.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={`flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition-all duration-200
                ${isActive
                                ? 'bg-campus-text text-campus-bg shadow-lg'
                                : 'text-campus-secondary hover:bg-campus-bg hover:text-campus-text'
                            }`}
                        >
                            {item.icon}
                            <span>{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* THEME PICKER */}
            <div className="p-6 border-t border-campus-border">
                <p className="text-xs font-bold text-campus-secondary uppercase mb-3 tracking-wider">Theme</p>
                <div className="flex gap-4">
                    <button
                        onClick={() => changeTheme('london')}
                        className={`w-8 h-8 rounded-full bg-[#061E29] border-2 transition-transform hover:scale-110 
              ${theme === 'london' ? 'border-[#5F9598] scale-110 ring-2 ring-offset-2 ring-[#5F9598]' : 'border-transparent opacity-70 hover:opacity-100'}`}
                        title="London (Dark)"
                    />
                    <button
                        onClick={() => changeTheme('tokyo')}
                        className={`w-8 h-8 rounded-full bg-[#A8DF8E] border-2 transition-transform hover:scale-110 
              ${theme === 'tokyo' ? 'border-[#FFAAB8] scale-110 ring-2 ring-offset-2 ring-[#FFAAB8]' : 'border-transparent opacity-70 hover:opacity-100'}`}
                        title="Tokyo (Pastel)"
                    />
                    <button
                        onClick={() => changeTheme('helsinki')}
                        className={`w-8 h-8 rounded-full bg-[#3F72AF] border-2 transition-transform hover:scale-110 
              ${theme === 'helsinki' ? 'border-[#DBE2EF] scale-110 ring-2 ring-offset-2 ring-[#DBE2EF]' : 'border-transparent opacity-70 hover:opacity-100'}`}
                        title="Helsinki (Light)"
                    />
                </div>
            </div>

            {/* Logout */}
            <div className="p-4">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-4 px-4 py-3 rounded-xl font-medium text-red-400 hover:bg-red-50 hover:text-red-500 transition-all"
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;