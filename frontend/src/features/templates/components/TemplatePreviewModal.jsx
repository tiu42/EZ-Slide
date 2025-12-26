import React from 'react'
import { X, FileText } from 'lucide-react'
import Button from '../../../components/ui/Button'

const TemplatePreviewModal = ({ template, isOpen, onClose, onApply }) => {
    if (!isOpen || !template) return null;

    return (
        <>
            {/* Backdrop */}
            <div 
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                    
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-slate-200">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800">{template.title}</h2>
                            <p className="text-sm text-slate-500 mt-1">{template.category}</p>
                        </div>
                        <button 
                            onClick={onClose}
                            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            <X size={24} className="text-slate-500" />
                        </button>
                    </div>

                    {/* Preview Content */}
                    <div className="flex-1 overflow-y-auto p-6">
                        <div className="space-y-6">
                            {/* Template Preview */}
                            <div className={`w-full aspect-video ${template.thumbnailColor} rounded-xl flex items-center justify-center border border-slate-200`}>
                                <div className="text-slate-400 opacity-30">
                                    <FileText size={80} />
                                </div>
                            </div>

                            {/* Template Details */}
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-800 mb-2">Description</h3>
                                    <p className="text-slate-600 leading-relaxed">
                                        {template.description || 'Professional template, suitable for business and academic presentations.'}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="text-sm font-semibold text-slate-700 mb-1">Category</h4>
                                        <p className="text-slate-600">{template.category}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-slate-700 mb-1">Slide Count</h4>
                                        <p className="text-slate-600">{template.slideCount || '10'} slides</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50">
                        <Button 
                            variant="secondary"
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                        <Button 
                            onClick={() => onApply(template)}
                        >
                            Apply Template
                        </Button>
                    </div>

                </div>
            </div>
        </>
    );
};

export default TemplatePreviewModal
