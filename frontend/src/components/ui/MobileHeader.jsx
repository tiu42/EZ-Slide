import React from 'react';
import { Menu } from 'lucide-react';

export const MobileHeader = ({ onOpenSidebar }) => (
    <div className="lg:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
            <button onClick={onOpenSidebar} className="text-slate-600"><Menu size={24} /></button>
            <span className="font-bold text-lg text-slate-800">EzSlide</span>
        </div>
        <div className="w-8 h-8 bg-slate-200 rounded-full overflow-hidden">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Avatar" />
        </div>
    </div>
);