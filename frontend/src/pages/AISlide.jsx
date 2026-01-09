import React, { useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { Sparkles } from 'lucide-react';

const AISlide = () => {
    const [topic, setTopic] = useState('');
    const [slideCount, setSlideCount] = useState('10');
    const [language, setLanguage] = useState('vi');
    const [tone, setTone] = useState('professional');
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState('');

    const handleGenerate = () => {
        if (!topic.trim()) {
            setError('Vui lòng nhập chủ đề để tạo slide');
            return;
        }
        setIsGenerating(true);
        // TODO: Implement AI generation logic
        console.log('Generating slides...', { topic, slideCount, language, tone });
        setTimeout(() => {
            setIsGenerating(false);
        }, 2000);
    };

    return (
        <MainLayout>
            <div className="flex-1 overflow-y-auto p-4 md:p-8 flex items-center justify-center">
                <div className="w-full max-w-3xl">
                    {/* Header */}
                    <h1 className="text-3xl md:text-5xl font-bold text-center text-white mb-8 md:mb-12">
                        Tạo slide bằng AI
                    </h1>

                    {/* Main Input Card */}
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/10 mb-6">
                        <div className="flex flex-col md:flex-row gap-3 mb-6">
                            <textarea
                                placeholder="Nhập chủ đề bạn muốn tạo slide..."
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                className="flex-1 h-14 px-6 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none overflow-y-auto"
                                style={{
                                    scrollbarWidth: 'none',
                                    msOverflowStyle: 'none'
                                }}
                            />
                            <button
                                onClick={handleGenerate}
                                disabled={isGenerating}
                                className="px-8 py-4 h-14 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none whitespace-nowrap"
                            >
                                {isGenerating ? 'Đang tạo...' : 'Tạo Slide'}
                            </button>
                        </div>

                        {/* Options Row */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Slide Count */}
                            <div className="relative">
                                <select
                                    value={slideCount}
                                    onChange={(e) => setSlideCount(e.target.value)}
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                                >
                                    <option value="5" className="bg-slate-800">Số lượng slide: 5-10</option>
                                    <option value="10" className="bg-slate-800">Số lượng slide: 10-15</option>
                                    <option value="15" className="bg-slate-800">Số lượng slide: 15-20</option>
                                    <option value="20" className="bg-slate-800">Số lượng slide: 20-30</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-white">
                                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                    </svg>
                                </div>
                            </div>

                            {/* Language */}
                            <div className="relative">
                                <select
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value)}
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                                >
                                    <option value="vi" className="bg-slate-800">Ngôn ngữ: Tiếng Việt</option>
                                    <option value="en" className="bg-slate-800">Ngôn ngữ: English</option>
                                    <option value="ja" className="bg-slate-800">Ngôn ngữ: 日本語</option>
                                    <option value="ko" className="bg-slate-800">Ngôn ngữ: 한국어</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-white">
                                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                    </svg>
                                </div>
                            </div>

                            {/* Tone */}
                            <div className="relative">
                                <select
                                    value={tone}
                                    onChange={(e) => setTone(e.target.value)}
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                                >
                                    <option value="professional" className="bg-slate-800">Tone giọng: Chuyên nghiệp</option>
                                    <option value="casual" className="bg-slate-800">Tone giọng: Thân thiện</option>
                                    <option value="academic" className="bg-slate-800">Tone giọng: Học thuật</option>
                                    <option value="creative" className="bg-slate-800">Tone giọng: Sáng tạo</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-white">
                                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 flex items-center gap-3">
                            <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <p className="text-red-200 text-sm">{error}</p>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
};

export default AISlide;
