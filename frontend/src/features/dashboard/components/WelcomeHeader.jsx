import React from 'react';

export const WelcomeHeader = ({ userName }) => (
    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-800">Hello, {userName}! 👋</h1>
            <p className="text-slate-500 text-sm mt-1">Ready to create an impressive presentation today?</p>
        </div>
    </div>
);