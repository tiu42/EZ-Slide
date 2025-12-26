import React from 'react'

const Card = ({ children, className = '', interactive = false, ...props }) => {
    return (
        <div className={
            `bg-white rounded-xl border border-slate-200 overflow-hidden
            ${interactive ? 'hover:shadow-lg hover:border-emerald-300 transition-all duration-300 cursor-pointer group' : 'shadow-sm'}
            ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

export default Card