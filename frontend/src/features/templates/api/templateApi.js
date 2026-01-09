import axios from 'axios';

const API_BASE_URL = '/api/templates';

// Get authentication token from localStorage
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

// Get all published templates
export const getAllTemplates = async () => {
    const response = await axios.get(API_BASE_URL, getAuthHeaders());
    return response.data;
};

// Get a single template by ID
export const getTemplateById = async (id) => {
    const response = await axios.get(`${API_BASE_URL}/${id}`, getAuthHeaders());
    return response.data;
};

// Create a new template (admin only)
export const createTemplate = async (data) => {
    const response = await axios.post(API_BASE_URL, data, getAuthHeaders());
    return response.data;
};

// Update a template (admin only)
export const updateTemplate = async (id, data) => {
    const response = await axios.patch(`${API_BASE_URL}/${id}`, data, getAuthHeaders());
    return response.data;
};

// Delete a template (admin only)
export const deleteTemplate = async (id) => {
    const response = await axios.delete(`${API_BASE_URL}/${id}`, getAuthHeaders());
    return response.data;
};

// Apply template - create a new presentation from a template
export const applyTemplate = async (templateId, newPresentationTitle) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/${templateId}/apply`,
            { title: newPresentationTitle },
            getAuthHeaders()
        );
        return response.data;
    } catch (error) {
        console.error('Error applying template:', error);
        throw error;
    }
};
