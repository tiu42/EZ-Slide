import React, { useState, useMemo } from 'react';
import MainLayout from '../components/layout/MainLayout';
import GridTemplatesView from '../features/templates/components/GridTemplatesView';
import TemplateToolbar from '../features/templates/components/TemplateToolbar';
import TemplatePreviewModal from '../features/templates/components/TemplatePreviewModal';

const Templates = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Mock Data - Templates
    const templates = [
        { 
            id: 1, 
            title: 'Business Presentation', 
            category: 'Business',
            categoryValue: 'business',
            thumbnailColor: 'bg-blue-100',
            description: 'Professional template for business presentations, project reports and plans.',
            slideCount: 12
        },
        { 
            id: 2, 
            title: 'Academic Education', 
            category: 'Education',
            categoryValue: 'education',
            thumbnailColor: 'bg-emerald-100',
            description: 'Optimized template for teaching, lectures and scientific research presentations.',
            slideCount: 15
        },
        { 
            id: 3, 
            title: 'Creative Design', 
            category: 'Creative',
            categoryValue: 'creative',
            thumbnailColor: 'bg-purple-100',
            description: 'Creative template with unique design, perfect for portfolio and showcase.',
            slideCount: 10
        },
        { 
            id: 4, 
            title: 'Marketing & Advertising', 
            category: 'Marketing',
            categoryValue: 'marketing',
            thumbnailColor: 'bg-orange-100',
            description: 'Eye-catching template with vibrant colors, perfect for marketing campaigns.',
            slideCount: 14
        },
        { 
            id: 5, 
            title: 'Technology & Startup', 
            category: 'Technology',
            categoryValue: 'technology',
            thumbnailColor: 'bg-indigo-100',
            description: 'Modern template for startup pitch and tech product demo.',
            slideCount: 16
        },
        { 
            id: 6, 
            title: 'Project Report', 
            category: 'Business',
            categoryValue: 'business',
            thumbnailColor: 'bg-cyan-100',
            description: 'Standard template for progress reports and project results.',
            slideCount: 11
        },
        { 
            id: 7, 
            title: 'Online Course', 
            category: 'Education',
            categoryValue: 'education',
            thumbnailColor: 'bg-teal-100',
            description: 'Friendly template for online courses and webinars.',
            slideCount: 18
        },
        { 
            id: 8, 
            title: 'Creative Portfolio', 
            category: 'Creative',
            categoryValue: 'creative',
            thumbnailColor: 'bg-pink-100',
            description: 'Artistic template to showcase creative works.',
            slideCount: 20
        },
    ];

    // Filter templates based on search and category
    const filteredTemplates = useMemo(() => {
        return templates.filter(template => {
            const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                template.category.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === 'all' || template.categoryValue === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [searchQuery, selectedCategory]);

    const handleTemplateClick = (template) => {
        setSelectedTemplate(template);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedTemplate(null);
    };

    const handleApplyTemplate = (template) => {
        console.log('Applying template:', template);
        // TODO: Implement template application logic
        // This would create a new presentation based on the selected template
        alert(`Template applied: ${template.title}`);
        handleCloseModal();
    };

    return (
        <MainLayout>
            <div className="flex flex-1 overflow-hidden">
                <div className="flex-1 overflow-y-auto p-4 md:p-8">
                    <div className="max-w-7xl mx-auto">
                        <h1 className="text-2xl font-bold text-slate-800 mb-2">Templates</h1>
                        <p className="text-slate-500 mb-6">
                            Choose the right template to start your presentation.
                        </p>

                        {/* Toolbar with Search and Filter */}
                        <TemplateToolbar
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                            selectedCategory={selectedCategory}
                            setSelectedCategory={setSelectedCategory}
                        />

                        {/* Templates Grid */}
                        {filteredTemplates.length > 0 ? (
                            <GridTemplatesView 
                                templates={filteredTemplates} 
                                onTemplateClick={handleTemplateClick}
                            />
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-slate-500 text-lg">
                                    No matching templates found.
                                </p>
                            </div>
                        )}

                    </div>
                </div>
            </div>

            {/* Template Preview Modal */}
            <TemplatePreviewModal
                template={selectedTemplate}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onApply={handleApplyTemplate}
            />
        </MainLayout>
    );
};

export default Templates;
