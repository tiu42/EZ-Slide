import React from 'react'

const Card = ({ children, className = '', interactive = false, ...props }) => {
    return (
        <div className={
            `bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden shadow-lg
            ${interactive ? 'hover:shadow-2xl hover:shadow-purple-500/20 hover:border-purple-500/40 transition-all duration-300 cursor-pointer group' : ''}
            ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

export default Card