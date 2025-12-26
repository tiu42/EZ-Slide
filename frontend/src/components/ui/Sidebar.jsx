import React from 'react';
import { LayoutDashboard, Presentation, Wand2, FolderOpen, Settings, X, LogOutIcon } from 'lucide-react';
import SidebarItem from './SidebarItem'
import { useAuth } from '../../contexts/AuthContext'; 

export const Sidebar = ({ isOpen, onClose }) => {
    const { user, logout } = useAuth();
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
            <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                {/* Header */}
                <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100">
                    <div className="flex items-center">
                        <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white mr-2">
                            <LayoutDashboard size={20} />
                        </div>
                        <span className="text-xl font-bold text-slate-800 tracking-tight">EzSlide</span>
                    </div>
                    <button onClick={onClose} className="lg:hidden text-slate-500 hover:text-slate-800">
                        <X size={24} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    <SidebarItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
                    <SidebarItem to="/slides" icon={Presentation} label="My Slides" />
                    <SidebarItem to="/templates" icon={Wand2} label="Templates" />
                    <SidebarItem to="/assets" icon={FolderOpen} label="Assets" />
                </nav>

                {/* Footer (User) */}
                <div className="p-4 border-t border-slate-100">
                    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-red-50 cursor-pointer transition-colors" onClick={logout}>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900 truncate">{user.name}</p>
                            <p className="text-xs text-slate-500 truncate">Logout</p>
                        </div>
                        <LogOutIcon size={16} className="text-slate-400" />
                    </div>
                </div>
            </aside>
        </>
    );
};