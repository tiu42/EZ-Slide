import React, { useState } from 'react';
import { SlideToolbar } from '../features/slides/components/SlideToolbar';
import { Calendar, Trash2, Edit } from 'lucide-react';
import MainLayout from '../components/layout/MainLayout';
import GridSlidesView from '../features/slides/components/GridSlidesView';
import CreatePresentationModal from '../features/dashboard/components/CreatePresentationModal';
import { usePresentations } from '../contexts/PresentationContext';

const Slides = () => {
    const [viewMode, setViewMode] = useState('grid');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { presentations, loading, deletePresentation, createPresentation } = usePresentations();

    const handleDelete = async (id) => {
        try {
            await deletePresentation(id);
        } catch (error) {
            alert('Unable to delete presentation. Please try again.');
        }
    };

    const handleCreateNew = () => {
        setIsCreateModalOpen(true);
    };

    const handleCreateSubmit = async (title) => {
        const newWindow = window.open('', '_blank');
        if (newWindow) {
            newWindow.document.write("Đang tải...");
        }

        try {
            const newPresentation = await createPresentation({ title });

            setIsCreateModalOpen(false);

            if (newWindow) {
                newWindow.location.href = `/design/${newPresentation._id}`
            } else {
                window.location.href = `/design/${newPresentation._id}`
            }
        } catch (error) {
            console.error("Failed to create presentation:", error);
            if (newWindow) newWindow.close();
            alert("Failed to create presentation");
        }
    };

    const handleEdit = (id) => {
        window.open(`/design/${id}`, '_blank');
    }

    // Transform presentations to slides format for UI
    const filteredPresentations = presentations.filter(presentation =>
        presentation.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const slides = filteredPresentations.map((presentation, index) => ({
        id: presentation._id,
        title: presentation.title,
        date: new Date(presentation.updatedAt).toLocaleDateString('vi-VN'),
        author: 'User',
        status: 'Published',
        thumbnailUrl: presentation.thumbnailUrl,
        thumbnailColor: 'bg-orange-600/40'
    }));

    if (loading) {
        return (
            <MainLayout>
                <div className="flex flex-1 items-center justify-center">
                    <div className="text-center">
                        <div className="text-gray-300">Đang tải...</div>
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
                        <h1 className="text-2xl font-bold text-white mb-2">Bài thuyết trình của tôi</h1>
                        <p className="text-gray-300 mb-6">Quản lý và chỉnh sửa tất cả các bài thuyết trình của bạn.</p>

                        {/* Toolbar */}
                        <SlideToolbar
                            viewMode={viewMode}
                            setViewMode={setViewMode}
                            onCreateNew={handleCreateNew}
                            searchQuery={searchQuery}
                            onSearchChange={setSearchQuery}
                        />

                        {/* Empty state */}
                        {slides.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-gray-400 text-lg mb-4">
                                    Bạn chưa có bài thuyết trình nào.
                                </p>
                            </div>
                        ) : (
                            <>
                                {/* --- VIEW MODE: GRID --- */}
                                {viewMode === 'grid' && (
                                    <GridSlidesView
                                        slides={slides}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                    />
                                )}

                                {/* --- VIEW MODE: LIST --- */}
                                {viewMode === 'list' && (
                                    <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-xl border border-white/20 shadow-2xl overflow-hidden">
                                        <table className="w-full text-left border-collapse">
                                            <thead className="bg-white/5 border-b border-white/10 text-xs uppercase text-gray-400 font-semibold">
                                                <tr>
                                                    <th className="p-4 w-12">#</th>
                                                    <th className="p-4">Tên slide</th>
                                                    <th className="p-4 hidden sm:table-cell">Ngày tạo</th>
                                                    <th className="p-4 text-right">Hành động</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5">
                                                {slides.map((slide, index) => (
                                                    <tr key={slide.id} className="hover:bg-white/5 transition-colors group">
                                                        <td className="p-4 text-gray-400">{index + 1}</td>
                                                        <td className="p-4 font-medium text-white flex items-center gap-3">
                                                            <div className={`w-10 h-8 rounded flex-shrink-0 overflow-hidden ${!slide.thumbnailUrl ? slide.thumbnailColor : 'bg-gray-900'}`}>
                                                                {slide.thumbnailUrl && (
                                                                    <img src={slide.thumbnailUrl} alt={slide.title} className="w-full h-full object-cover" />
                                                                )}
                                                            </div>
                                                            {slide.title}
                                                        </td>

                                                        <td className="p-4 text-sm text-gray-400 hidden sm:table-cell flex items-center gap-2">
                                                            <Calendar size={14} /> {slide.date}
                                                        </td>
                                                        <td className="p-4 text-right">
                                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <button onClick={() => handleEdit(slide.id)} className="text-gray-400 hover:text-purple-400"><Edit size={16} /></button>
                                                                <button
                                                                    onClick={() => handleDelete(slide.id)}
                                                                    className="text-gray-400 hover:text-red-400"
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

                        <CreatePresentationModal
                            isOpen={isCreateModalOpen}
                            onClose={() => setIsCreateModalOpen(false)}
                            onSubmit={handleCreateSubmit}
                            isLoading={loading}
                        />

                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default Slides;