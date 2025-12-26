import React from 'react';
import { Plus, Wand2, LayoutDashboard } from 'lucide-react';
import Card from '../../../components/ui/Card';
import { useNavigate } from 'react-router-dom';

export const QuickActions = ({ onCreateNew, onAiGenerate }) => {
    const navigate = useNavigate();


    return (
        <section className="mb-10">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Get Started</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                {/* New Slide */}
                <Card interactive onClick={onCreateNew} className="flex flex-col items-center justify-center p-6 h-40 md:h-48 border-dashed border-2 border-slate-300 hover:border-emerald-500 hover:bg-emerald-50/10 group">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-3 md:mb-4 group-hover:scale-110 transition-transform">
                        <Plus size={24} />
                    </div>
                    <h3 className="font-semibold text-slate-700 text-sm md:text-base">Create New Slide</h3>
                </Card>

                {/* AI Slide */}
                <Card interactive onClick={onAiGenerate} className="flex flex-col items-center justify-center p-6 h-40 md:h-48 relative overflow-hidden ring-1 ring-indigo-100 hover:ring-indigo-300">
                    <div className="absolute top-3 right-3">
                        <span className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider shadow-sm">AI Beta</span>
                    </div>
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-3 md:mb-4">
                        <Wand2 size={24} />
                    </div>
                    <h3 className="font-semibold text-slate-700 text-sm md:text-base">Create with AI</h3>
                    <p className="text-xs text-slate-500 mt-1 md:mt-2 text-center px-2">Enter your idea, get slides instantly.</p>
                </Card>

                {/* Templates */}
                <Card interactive onClick={() => { navigate('/templates') }} className="flex flex-col items-center justify-center p-6 h-40 md:h-48 md:col-span-2 xl:col-span-1">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-3 md:mb-4">
                        <LayoutDashboard size={24} />
                    </div>
                    <h3 className="font-semibold text-slate-700 text-sm md:text-base">Choose Template</h3>
                </Card>
            </div>
        </section>
    );
};