import React from 'react'
import Card from '../../../components/ui/Card'
import { FileText } from 'lucide-react';

const TemplateCard = ({ template, onClick }) => {
    // Calculate slide count from populated presentation
    const slideCount = template.presentationId?.slideOrder?.length || 0;

    // Use thumbnailUrl from template or presentation
    const thumbnailUrl = template.thumbnailUrl || template.presentationId?.thumbnailUrl || '';

    return (
        <Card
            interactive
            className="group flex flex-col h-full cursor-pointer"
            onClick={() => onClick(template)}
        >
            {/* Thumbnail */}
            <div className="h-28 md:h-32 w-full bg-gradient-to-br from-blue-600/40 to-purple-600/40 relative flex items-center justify-center border-b border-white/10">
                {thumbnailUrl ? (
                    <img
                        src={thumbnailUrl}
                        alt={template.title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="text-gray-400 opacity-50">
                        <FileText size={32} />
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="p-3 md:p-4 flex-1 flex flex-col justify-between">
                <div>
                    <h3 className="font-medium text-white text-sm mb-1 truncate">
                        {template.title}
                    </h3>
                    <p className="text-xs text-gray-400">{template.category}</p>
                    {slideCount > 0 && (
                        <p className="text-xs text-gray-500 mt-1">{slideCount} slides</p>
                    )}
                </div>
            </div>
        </Card>
    )
}

export default TemplateCard

