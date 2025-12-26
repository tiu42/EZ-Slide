import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const PresentationContext = createContext();

export const usePresentations = () => {
    const context = useContext(PresentationContext);
    if (!context) {
        throw new Error('usePresentations must be used within PresentationProvider');
    }
    return context;
};

export const PresentationProvider = ({ children }) => {
    const { user } = useAuth();
    const [presentations, setPresentations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch all presentations
    const fetchPresentations = async () => {
        const token = localStorage.getItem('token');
        if (!token || !user) return;

        setLoading(true);
        setError(null);

        try {
            const res = await axios.get('/api/presentations', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPresentations(res.data?.data || []);
        } catch (err) {
            console.error('Error fetching presentations:', err);
            setError(err.response?.data?.message || 'Failed to fetch presentations');
        } finally {
            setLoading(false);
        }
    };

    // Create new presentation
    const createPresentation = async (data = {}) => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No authentication token');

        try {
            const res = await axios.post('/api/presentations', data, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            const newPresentation = res.data?.data;
            setPresentations(prev => [newPresentation, ...prev]);
            return newPresentation;
        } catch (err) {
            console.error('Error creating presentation:', err);
            throw err;
        }
    };

    // Update presentation
    const updatePresentation = async (id, updates) => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No authentication token');

        try {
            const res = await axios.patch(`/api/presentations/${id}`, updates, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            const updatedPresentation = res.data?.data;
            setPresentations(prev => 
                prev.map(p => p._id === id ? updatedPresentation : p)
            );
            return updatedPresentation;
        } catch (err) {
            console.error('Error updating presentation:', err);
            throw err;
        }
    };

    // Delete presentation
    const deletePresentation = async (id) => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No authentication token');

        try {
            await axios.delete(`/api/presentations/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            setPresentations(prev => prev.filter(p => p._id !== id));
            return true;
        } catch (err) {
            console.error('Error deleting presentation:', err);
            throw err;
        }
    };

    // Duplicate presentation
    const duplicatePresentation = async (id) => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No authentication token');

        try {
            const res = await axios.post(`/api/presentations/${id}/duplicate`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            const duplicatedPresentation = res.data?.data;
            setPresentations(prev => [duplicatedPresentation, ...prev]);
            return duplicatedPresentation;
        } catch (err) {
            console.error('Error duplicating presentation:', err);
            throw err;
        }
    };

    // Get single presentation by ID
    const getPresentationById = async (id) => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No authentication token');

        try {
            const res = await axios.get(`/api/presentations/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res.data?.data;
        } catch (err) {
            console.error('Error fetching presentation:', err);
            throw err;
        }
    };

    // Auto-fetch presentations when user logs in
    useEffect(() => {
        if (user) {
            fetchPresentations();
        } else {
            setPresentations([]);
        }
    }, [user]);

    const value = {
        presentations,
        loading,
        error,
        fetchPresentations,
        createPresentation,
        updatePresentation,
        deletePresentation,
        duplicatePresentation,
        getPresentationById
    };

    return (
        <PresentationContext.Provider value={value}>
            {children}
        </PresentationContext.Provider>
    );
};
