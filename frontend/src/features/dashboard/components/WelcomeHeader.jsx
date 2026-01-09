import React from 'react';

export const WelcomeHeader = ({ userName }) => (
    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <div>
            <h1 className="text-xl md:text-2xl font-bold text-white">Xin chào, {userName}! 👋</h1>
            <p className="text-gray-300 text-sm mt-1">Sẵn sàng tạo bài thuyết trình ấn tượng hôm nay?</p>
        </div>
    </div>
);