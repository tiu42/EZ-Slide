import React, { useState, useEffect } from 'react'
import { X, FileText, Tag, ChevronLeft, ChevronRight } from 'lucide-react'
import Button from '../../../components/ui/Button'

const TemplatePreviewModal = ({ template, isOpen, onClose, onApply, applying }) => {
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

    // Reset index when modal opens or template changes
    useEffect(() => {
        if (isOpen) {
            setCurrentSlideIndex(0);
        }
    }, [isOpen, template]);

    if (!isOpen || !template) return null;

    const slideCount = template.presentationId?.slideOrder?.length || 0;
    const thumbnailUrl = template.thumbnailUrl || template.presentationId?.thumbnailUrl || '';

    const nextSlide = () => {
        if (template.slidePreviews && currentSlideIndex < template.slidePreviews.length - 1) {
            setCurrentSlideIndex(prev => prev + 1);
        }
    };

    const prevSlide = () => {
        if (currentSlideIndex > 0) {
            setCurrentSlideIndex(prev => prev - 1);
        }
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="bg-[#1e1e2d] border border-white/10 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">

                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-white/10">
                        <div>
                            <h2 className="text-2xl font-bold text-white">{template.title}</h2>
                            <p className="text-sm text-gray-400 mt-1">{template.category}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <X size={24} className="text-gray-400 hover:text-white" />
                        </button>
                    </div>

                    {/* Preview Content */}
                    <div className="flex-1 overflow-y-auto p-6">
                        <div className="space-y-6">
                            {/* Template Preview Slider */}
                            <div className="w-full aspect-video bg-[#0f0f1a] rounded-xl flex items-center justify-center border border-white/10 overflow-hidden relative group">
                                {template.slidePreviews && template.slidePreviews.length > 0 ? (
                                    <>
                                        <div className="w-full h-full relative">
                                            <img
                                                src={template.slidePreviews[currentSlideIndex]}
                                                alt={`Slide ${currentSlideIndex + 1}`}
                                                className="w-full h-full object-contain transition-opacity duration-300"
                                            />
                                            
                                            {/* Navigation Overlay */}
                                            <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                                                    className="p-2 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm transition-all transform hover:scale-110 disabled:opacity-30 disabled:hover:scale-100"
                                                    disabled={currentSlideIndex === 0}
                                                >
                                                    <ChevronLeft size={24} />
                                                </button>
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                                                    className="p-2 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm transition-all transform hover:scale-110 disabled:opacity-30 disabled:hover:scale-100"
                                                    disabled={currentSlideIndex === (template.slidePreviews?.length || 0) - 1}
                                                >
                                                    <ChevronRight size={24} />
                                                </button>
                                            </div>

                                            {/* Slide Counter/Indicators */}
                                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                                {template.slidePreviews.map((_, idx) => (
                                                    <button
                                                        key={idx}
                                                        onClick={(e) => { e.stopPropagation(); setCurrentSlideIndex(idx); }}
                                                        className={`w-2 h-2 rounded-full transition-all ${
                                                            idx === currentSlideIndex 
                                                                ? 'bg-white w-4' 
                                                                : 'bg-white/40 hover:bg-white/60'
                                                        }`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                ) : thumbnailUrl ? (
                                    <img
                                        src={thumbnailUrl}
                                        alt={template.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="text-white/20">
                                        <FileText size={80} />
                                    </div>
                                )}
                            </div>

                            {/* Template Details */}
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-2">Description</h3>
                                    <p className="text-gray-300 leading-relaxed">
                                        {template.description || 'Professional template, suitable for business and academic presentations.'}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-400 mb-1">Category</h4>
                                        <p className="text-gray-200">{template.category}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-400 mb-1">Slide Count</h4>
                                        <p className="text-gray-200">{slideCount} slides</p>
                                    </div>
                                </div>

                                {/* Tags */}
                                {template.tags && template.tags.length > 0 && (
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-400 mb-2 flex items-center gap-1">
                                            <Tag size={16} />
                                            Tags
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {template.tags.map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className="px-3 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full text-xs font-medium"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-end gap-3 p-6 border-t border-white/10 bg-white/5">
                        <Button
                            variant="ghost"
                            onClick={onClose}
                            disabled={applying}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={() => onApply(template)}
                            disabled={applying}
                        >
                            {applying ? 'Applying...' : 'Apply Template'}
                        </Button>
                    </div>

                </div>
            </div>
        </>
    );
};

export default TemplatePreviewModal

