import React, { useState } from 'react';
import { SlideToolbar } from '../features/slides/components/SlideToolbar';
import { Calendar, Download, Trash2, Edit } from 'lucide-react';
import MainLayout from '../components/layout/MainLayout';
import GridSlidesView from '../features/slides/components/GridSlidesView';
import { usePresentations } from '../contexts/PresentationContext';

const Slides = () => {
    const [viewMode, setViewMode] = useState('grid');
    const { presentations, loading, deletePresentation } = usePresentations();

    const handleDelete = async (id) => {
        try {
            await deletePresentation(id);
        } catch (error) {
            alert('Unable to delete presentation. Please try again.');
        }
    };

    const handleDownload = (id) => {
        console.log('Download presentation:', id);
        // TODO: Implement download functionality
    };

    // Transform presentations to slides format for UI
    const slides = presentations.map((presentation, index) => ({
        id: presentation._id,
        title: presentation.title,
        date: new Date(presentation.updatedAt).toLocaleDateString('vi-VN'),
        author: 'User',
        status: 'Published',
        thumbnailColor: 'bg-orange-100'
    }));

    if (loading) {
        return (
            <MainLayout>
                <div className="flex flex-1 items-center justify-center">
                    <div className="text-center">
                        <div className="text-slate-500">Loading...</div>
                    </div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="flex flex-1 overflow-hidden">
                <div className="flex-1 overflow-y-auto p-4 md:p-8">
                    <div className="max-w-7xl mx-auto">
                        <h1 className="text-2xl font-bold text-slate-800 mb-2">My Slides</h1>
                        <p className="text-slate-500 mb-6">Manage and edit all your presentations.</p>

                        {/* Toolbar */}
                        <SlideToolbar
                            viewMode={viewMode}
                            setViewMode={setViewMode}
                        />

                        {/* Empty state */}
                        {slides.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-slate-500 text-lg mb-4">
                                    You don't have any presentations yet.
                                </p>
                            </div>
                        ) : (
                            <>
                                {/* --- VIEW MODE: GRID --- */}
                                {viewMode === 'grid' && (
                                    <GridSlidesView
                                        slides={slides}
                                        onDelete={handleDelete}
                                        onDownload={handleDownload}
                                    />
                                )}

                                {/* --- VIEW MODE: LIST --- */}
                                {viewMode === 'list' && (
                                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                        <table className="w-full text-left border-collapse">
                                            <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold">
                                                <tr>
                                                    <th className="p-4 w-12">#</th>
                                                    <th className="p-4">Slide Name</th>

                                                    <th className="p-4 hidden sm:table-cell">Date Created</th>
                                                    <th className="p-4 text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {slides.map((slide, index) => (
                                                    <tr key={slide.id} className="hover:bg-slate-50 transition-colors group">
                                                        <td className="p-4 text-slate-400">{index + 1}</td>
                                                        <td className="p-4 font-medium text-slate-800 flex items-center gap-3">
                                                            <div className={`w-10 h-8 rounded ${slide.thumbnailColor} flex-shrink-0`}></div>
                                                            {slide.title}
                                                        </td>

                                                        <td className="p-4 text-sm text-slate-500 hidden sm:table-cell flex items-center gap-2">
                                                            <Calendar size={14} /> {slide.date}
                                                        </td>
                                                        <td className="p-4 text-right">
                                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <button className="text-slate-400 hover:text-emerald-600"><Edit size={16} /></button>
                                                                <button
                                                                    onClick={() => handleDownload(slide.id)}
                                                                    className="text-slate-400 hover:text-blue-600"
                                                                >
                                                                    <Download size={16} />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDelete(slide.id)}
                                                                    className="text-slate-400 hover:text-red-600"
                                                                >
                                                                    <Trash2 size={16} />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </>
                        )}

                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default Slides;