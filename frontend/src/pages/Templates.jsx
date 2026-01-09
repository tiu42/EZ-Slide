import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import GridTemplatesView from '../features/templates/components/GridTemplatesView';
import TemplateToolbar from '../features/templates/components/TemplateToolbar';
import TemplatePreviewModal from '../features/templates/components/TemplatePreviewModal';
import { getAllTemplates, applyTemplate } from '../features/templates/api/templateApi';

const Templates = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [applying, setApplying] = useState(false);

    // Fetch templates on component mount
    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getAllTemplates();
            setTemplates(response.data || []);
        } catch (err) {
            console.error('Error fetching templates:', err);
            setError(err.response?.data?.message || 'Failed to load templates');
        } finally {
            setLoading(false);
        }
    };

    // Filter templates based on search and category
    const filteredTemplates = useMemo(() => {
        return templates.filter(template => {
            const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                template.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (template.description && template.description.toLowerCase().includes(searchQuery.toLowerCase()));
            const matchesCategory = selectedCategory === 'all' || template.category.toLowerCase() === selectedCategory.toLowerCase();
            return matchesSearch && matchesCategory;
        });
    }, [templates, searchQuery, selectedCategory]);

    const handleTemplateClick = (template) => {
        setSelectedTemplate(template);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedTemplate(null);
    };

    const handleApplyTemplate = async (template) => {
        try {
            setApplying(true);
            const defaultTitle = `${template.title} - Copy`;

            // Apply the template (creates a new presentation from the template)
            const result = await applyTemplate(template._id, defaultTitle);

            if (result.success && result.data) {
                // Open the editor with the new presentation in a new tab
                window.open(`/design/${result.data._id}`, '_blank');
            }
        } catch (err) {
            console.error('Error applying template:', err);
            alert(err.response?.data?.message || 'Failed to apply template. Please try again.');
        } finally {
            setApplying(false);
            handleCloseModal();
        }
    };

    return (
        <MainLayout>
            <div className="flex flex-1 overflow-hidden">
                <div className="flex-1 overflow-y-auto p-4 md:p-8">
                    <div className="max-w-7xl mx-auto">
                        <h1 className="text-2xl font-bold text-white mb-2">Mẫu thiết kế</h1>
                        <p className="text-gray-300 mb-6">
                            Chọn mẫu phù hợp để bắt đầu bài thuyết trình của bạn.
                        </p>

                        {/* Toolbar with Search and Filter */}
                        <TemplateToolbar
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                            selectedCategory={selectedCategory}
                            setSelectedCategory={setSelectedCategory}
                        />

                        {/* Loading State */}
                        {loading && (
                            <div className="text-center py-12">
                                <p className="text-gray-400 text-lg">Đang tải mẫu thiết kế...</p>
                            </div>
                        )}

                        {/* Error State */}
                        {error && !loading && (
                            <div className="text-center py-12">
                                <p className="text-red-400 text-lg mb-4">{error}</p>
                                <button
                                    onClick={fetchTemplates}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                                >
                                    Thử lại
                                </button>
                            </div>
                        )}

                        {/* Templates Grid */}
                        {!loading && !error && (
                            <>
                                {filteredTemplates.length > 0 ? (
                                    <GridTemplatesView
                                        templates={filteredTemplates}
                                        onTemplateClick={handleTemplateClick}
                                    />
                                ) : (
                                    <div className="text-center py-12">
                                        <p className="text-gray-400 text-lg">
                                            Không tìm thấy mẫu thiết kế phù hợp.
                                        </p>
                                    </div>
                                )}
                            </>
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
                applying={applying}
            />
        </MainLayout>
    );
};

export default Templates;

