import React from 'react'
import Card from './Card'
import { Presentation, Edit, Download, Trash2 } from 'lucide-react';

const SlidesCard = ({slide,onDelete,onDownload}) => {
    return (
        <Card interactive className="group flex flex-col h-full">
            {/* Thumbnail */}
            <div className={`h-28 md:h-32 w-full ${slide.thumbnailColor} relative flex items-center justify-center border-b border-slate-100`}>
                <div className="text-slate-400 opacity-50"><Presentation size={32} /></div>

                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[1px]">
                    <button className="p-2 bg-white rounded-full text-slate-700 hover:text-emerald-600 hover:scale-110 transition-all shadow-sm">
                        <Edit size={16} />
                    </button>
                    <button onClick={() => onDownload(slide.id)} className="p-2 bg-white rounded-full text-slate-700 hover:text-blue-600 hover:scale-110 transition-all shadow-sm">
                        <Download size={16} />
                    </button>
                    <button onClick={() => onDelete(slide.id)} className="p-2 bg-white rounded-full text-slate-700 hover:text-red-600 hover:scale-110 transition-all shadow-sm">
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>

            {/* Info */}
            <div className="p-3 md:p-4 flex-1 flex flex-col justify-between">
                <div>
                    <h3 className="font-medium text-slate-800 text-sm mb-1 truncate">{slide.title}</h3>
                    <p className="text-xs text-slate-400">{slide.date}</p>
                </div>
            </div>
        </Card>
    )
}

export default SlidesCard