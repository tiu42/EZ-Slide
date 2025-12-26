import React from 'react'
import SlidesCard from '../../../components/ui/SlidesCard'

const GridSlidesView = ({slides, onDelete, onDownload}) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 pb-8">
            {slides.map((slide) => (
                <div key={slide.id}><SlidesCard slide={slide} onDelete={onDelete} onDownload={onDownload} /></div>
            ))}
        </div>
    )
}

export default GridSlidesView