import React from 'react'
import { NavLink } from 'react-router-dom'

const SidebarItem = ({ icon: Icon, label, ...props }) => {
    return (
        <NavLink
            className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 cursor-pointer rounded-lg transition-all duration-200 mb-1 ${isActive
                    ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white font-semibold border border-purple-500/30'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`
            }
            {...props}
        >
            {({ isActive }) => (
                <>
                    <Icon size={20} className={isActive ? 'text-purple-400' : 'text-gray-400'} />
                    <span>{label}</span>
                    {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-400" />}
                </>
            )}
        </NavLink>
    );
};

export default SidebarItem