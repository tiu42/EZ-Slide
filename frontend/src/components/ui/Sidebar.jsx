import React from 'react';
import { LayoutDashboard, Presentation, Wand2, Layout, Settings, X, LogOutIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SidebarItem from './SidebarItem'
import Logo from './Logo';
import { useAuth } from '../../contexts/AuthContext';

export const Sidebar = ({ isOpen, onClose }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/', { replace: true });
    };
    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/50 z-30 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar Content */}
            <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-slate-900/95 to-purple-900/95 backdrop-blur-xl border-r border-white/10 flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                {/* Header */}
                <div className="h-16 flex items-center justify-between px-6 border-b border-white/10">
                    <Logo size="md" />
                    <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    <SidebarItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
                    <SidebarItem to="/slides" icon={Presentation} label="Bài thuyết trình" />
                    <SidebarItem to="/templates" icon={Layout} label="Mẫu thiết kế" />
                    <SidebarItem to="/ai-slide" icon={Wand2} label="AI Slide" />
                </nav>

                {/* Footer (User) */}
                <div className="p-4 border-t border-white/10">
                    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-red-500/10 cursor-pointer transition-colors group" onClick={handleLogout}>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">{user.name}</p>
                            <p className="text-xs text-gray-400 truncate group-hover:text-red-400 transition-colors">Đăng xuất</p>
                        </div>
                        <LogOutIcon size={16} className="text-gray-400 group-hover:text-red-400 transition-colors" />
                    </div>
                </div>
            </aside>
        </>
    );
};