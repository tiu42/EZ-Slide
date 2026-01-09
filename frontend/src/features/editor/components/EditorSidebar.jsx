import React, { useState } from 'react'
import { useEditor } from '../contexts/EditorContext'
import SlideThumbnail from './SlideThumbnail'

const EditorSidebar = () => {
    const {
        presentation,
        currentSlideId,
        setCurrentSlideId,
        addSlide,
        deleteSlide,
        reorderSlides
    } = useEditor();

    const slides = presentation?.slides || [];
    const [draggedIndex, setDraggedIndex] = useState(null);
    const [dragOverIndex, setDragOverIndex] = useState(null);

    const handleDragStart = (e, index) => {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', index);
        setDraggedIndex(index);
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
        setDragOverIndex(null);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDragEnter = (e, index) => {
        e.preventDefault();
        setDragOverIndex(index);
    };

    const handleDragLeave = (e) => {
        // Only clear if we're actually leaving the slide item, not just entering a child
        if (e.currentTarget === e.target) {
            setDragOverIndex(null);
        }
    };

    const handleDrop = (e, targetIndex) => {
        e.preventDefault();
        const startIndex = parseInt(e.dataTransfer.getData('text/plain'));
        if (startIndex !== targetIndex) {
            reorderSlides(startIndex, targetIndex);
        }
        setDraggedIndex(null);
        setDragOverIndex(null);
    };

    return (
        <aside className="w-56 bg-white border-r border-gray-200 flex flex-col shrink-0 z-10">
            <div className="p-3 border-b border-gray-100">
                <button
                    onClick={addSlide}
                    className="w-full py-2 flex items-center justify-center space-x-2 border border-dashed border-slate-300 rounded-md text-slate-500 hover:text-violet-600 hover:border-violet-300 hover:bg-violet-50 transition-all text-sm font-medium"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    <span>New Slide</span>
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-slate-50/50 relative">
                {slides.map((slide, index) => {
                    const isDragging = draggedIndex === index;
                    const isDropTarget = dragOverIndex === index && draggedIndex !== index;
                    const showInsertionAbove = isDropTarget && (draggedIndex === null || draggedIndex > index);
                    const showInsertionBelow = isDropTarget && draggedIndex !== null && draggedIndex < index;

                    return (
                        <div key={slide._id} className="relative">
                            {/* Insertion indicator ABOVE */}
                            {showInsertionAbove && (
                                <div className="absolute -top-1.5 left-0 right-0 h-1 bg-violet-500 rounded-full z-20 shadow-lg shadow-violet-500/50">
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-violet-500 rounded-full"></div>
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-violet-500 rounded-full"></div>
                                </div>
                            )}

                            <div
                                draggable
                                onDragStart={(e) => handleDragStart(e, index)}
                                onDragEnd={handleDragEnd}
                                onDragOver={handleDragOver}
                                onDragEnter={(e) => handleDragEnter(e, index)}
                                onDragLeave={handleDragLeave}
                                onDrop={(e) => handleDrop(e, index)}
                                onClick={() => setCurrentSlideId(slide._id)}
                                className={`group relative flex gap-3 cursor-move transition-all ${currentSlideId === slide._id ? 'opacity-100' : 'opacity-70 hover:opacity-100'
                                    } ${isDragging ? 'opacity-40 scale-95' : ''
                                    }`}
                            >
                                <span className="text-xs font-medium text-slate-400 pt-1 w-4 text-right">{index + 1}</span>
                                <div
                                    className={`flex-1 aspect-video bg-white rounded ring-2 shadow-sm cursor-pointer overflow-hidden relative transition-all ${currentSlideId === slide._id
                                        ? 'ring-violet-500'
                                        : 'ring-transparent border border-slate-200 hover:border-violet-300'
                                        }`}
                                >
                                    <SlideThumbnail slide={slide} />

                                    {/* Drag Indicator */}
                                    {isDragging && (
                                        <div className="absolute inset-0 bg-violet-500/20 flex items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-violet-600">
                                                <path d="M8 6h.01M8 12h.01M8 18h.01M16 6h.01M16 12h.01M16 18h.01" />
                                            </svg>
                                        </div>
                                    )}

                                    {/* Delete Button */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteSlide(slide._id);
                                        }}
                                        className="absolute top-1 right-1 p-1 bg-white/90 rounded text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                        title="Delete slide"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                    </button>
                                </div>
                            </div>

                            {/* Insertion indicator BELOW */}
                            {showInsertionBelow && (
                                <div className="absolute -bottom-1.5 left-0 right-0 h-1 bg-violet-500 rounded-full z-20 shadow-lg shadow-violet-500/50">
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-violet-500 rounded-full"></div>
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-violet-500 rounded-full"></div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </aside>
    )
}


export default EditorSidebar
