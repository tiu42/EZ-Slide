import React from 'react'
import TemplateCard from './TemplateCard'

const GridTemplatesView = ({ templates, onTemplateClick }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 pb-8">
            {templates.map((template) => (
                <div key={template.id}>
                    <TemplateCard 
                        template={template} 
                        onClick={onTemplateClick} 
                    />
                </div>
            ))}
        </div>
    )
}

export default GridTemplatesView
