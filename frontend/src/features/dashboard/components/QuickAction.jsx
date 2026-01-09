import React from 'react';
import { Plus, Wand2, Layout } from 'lucide-react';
import Card from '../../../components/ui/Card';
import { useNavigate } from 'react-router-dom';
import CreateSlideCard from './CreateSlideCard';

export const QuickActions = ({ onCreateClick, onAiGenerate }) => {
    const navigate = useNavigate();

    return (
        <section className="mb-10">
            <h2 className="text-lg font-semibold text-white mb-4">Bắt đầu</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                {/* New Slide */}
                <CreateSlideCard onClick={onCreateClick} />

                {/* Templates */}
                <Card interactive onClick={() => { navigate('/templates') }} className="flex flex-col items-center justify-center p-6 h-40 md:h-48 md:col-span-2 xl:col-span-1 bg-gradient-to-br from-teal-500/10 to-cyan-500/10 backdrop-blur-sm ring-1 ring-teal-500/30 hover:ring-teal-500/60">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-teal-500 to-cyan-500 text-white rounded-full flex items-center justify-center mb-3 md:mb-4">
                        <Layout size={24} />
                    </div>
                    <h3 className="font-semibold text-white text-sm md:text-base">Chọn mẫu thiết kế</h3>
                </Card>

                {/* AI Slide */}
                <Card interactive onClick={onAiGenerate} className="flex flex-col items-center justify-center p-6 h-40 md:h-48 relative overflow-hidden ring-1 ring-purple-500/30 hover:ring-purple-500/60 bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm">
                    <div className="absolute top-3 right-3">
                        <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider shadow-sm">AI Beta</span>
                    </div>
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center mb-3 md:mb-4">
                        <Wand2 size={24} />
                    </div>
                    <h3 className="font-semibold text-white text-sm md:text-base">Tạo với AI</h3>
                    <p className="text-xs text-gray-300 mt-1 md:mt-2 text-center px-2">Nhập ý tưởng, nhận slide ngay lập tức.</p>
                </Card>
            </div>
        </section>
    );
};