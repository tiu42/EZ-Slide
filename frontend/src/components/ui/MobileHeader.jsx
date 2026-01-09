import React from 'react';
import { Menu } from 'lucide-react';
import Logo from './Logo';

export const MobileHeader = ({ onOpenSidebar }) => (
    <div className="lg:hidden bg-gradient-to-r from-slate-900/95 to-purple-900/95 backdrop-blur-xl border-b border-white/10 p-4 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
            <button onClick={onOpenSidebar} className="text-gray-300 hover:text-white transition-colors"><Menu size={24} /></button>
            <Logo size="sm" />
        </div>
        <div className="w-8 h-8 bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-full overflow-hidden">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Avatar" />
        </div>
    </div>
);