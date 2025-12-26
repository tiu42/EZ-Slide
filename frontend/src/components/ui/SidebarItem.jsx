import React from 'react'
import { NavLink } from 'react-router-dom'

const SidebarItem = ({ icon: Icon, label, ...props }) => {
    return (
        <NavLink 
            className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-3 cursor-pointer rounded-lg transition-colors mb-1 ${
                    isActive 
                        ? 'bg-emerald-50 text-emerald-700 font-semibold' 
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`
            }
            {...props}
        >
            {({ isActive }) => (
                <>
                    <Icon size={20} className={isActive ? 'text-emerald-600' : 'text-slate-400'} />
                    <span>{label}</span>
                    {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                </>
            )}
        </NavLink>
    );
};

export default SidebarItem