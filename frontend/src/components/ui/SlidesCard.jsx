import React, { useState } from 'react'
import Card from './Card'
import { Presentation, Edit, Trash2 } from 'lucide-react';

const SlidesCard = ({ slide, onEdit, onDelete }) => {
    return (
        <Card interactive className="group flex flex-col h-full">
            {/* Thumbnail */}
            <div className={`h-28 md:h-32 w-full relative flex items-center justify-center border-b border-white/10 overflow-hidden ${!slide.thumbnailUrl ? slide.thumbnailColor : 'bg-gray-900'}`}>
                {slide.thumbnailUrl ? (
                    <img
                        src={slide.thumbnailUrl}
                        alt={slide.title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="text-gray-400 opacity-50"><Presentation size={32} /></div>
                )}

                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-sm">
                    <button onClick={() => onEdit(slide.id)} className="p-2 bg-white/90 rounded-full text-slate-700 hover:text-purple-600 hover:scale-110 transition-all shadow-lg">
                        <Edit size={16} />
                    </button>
                    <button onClick={() => onDelete(slide.id)} className="p-2 bg-white/90 rounded-full text-slate-700 hover:text-red-600 hover:scale-110 transition-all shadow-lg">
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>

            {/* Info */}
            <div className="p-3 md:p-4 flex-1 flex flex-col justify-between">
                <div>
                    <h3 className="font-medium text-white text-sm mb-1 truncate">{slide.title}</h3>
                    <p className="text-xs text-gray-400">{slide.date}</p>
                </div>
            </div>
        </Card>
    )
}

export default SlidesCard