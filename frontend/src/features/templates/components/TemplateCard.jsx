import React from 'react'
import Card from '../../../components/ui/Card'
import { FileText } from 'lucide-react';

const TemplateCard = ({ template, onClick }) => {
    return (
        <Card 
            interactive 
            className="group flex flex-col h-full cursor-pointer"
            onClick={() => onClick(template)}
        >
            {/* Thumbnail */}
            <div className={`h-28 md:h-32 w-full ${template.thumbnailColor} relative flex items-center justify-center border-b border-slate-100`}>
                <div className="text-slate-400 opacity-50">
                    <FileText size={32} />
                </div>
            </div>

            {/* Info */}
            <div className="p-3 md:p-4 flex-1 flex flex-col justify-between">
                <div>
                    <h3 className="font-medium text-slate-800 text-sm mb-1 truncate">
                        {template.title}
                    </h3>
                    <p className="text-xs text-slate-400">{template.category}</p>
                </div>
            </div>
        </Card>
    )
}

export default TemplateCard
