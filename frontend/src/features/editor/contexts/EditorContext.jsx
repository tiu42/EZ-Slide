import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../../contexts/AuthContext';
import { generateThumbnail } from '../utils/generateThumbnail';

const noop = () => { };
const defaultEditorContext = {
    presentation: null,
    currentSlide: null,
    currentSlideId: null,
    currentSlideIndex: -1,
    selectedElementId: null,
    clipboard: null,
    loading: true,
    saving: false,
    error: 'EditorProvider missing',
    setCurrentSlideId: noop,
    setSelectedElementId: noop,
    updateTitle: noop,
    addSlide: noop,
    deleteSlide: noop,
    updateSlide: noop,
    reorderSlides: noop,
    addElement: noop,
    updateElement: noop,
    deleteElement: noop,
    copyElement: noop,
    pasteElement: noop,
    bringToFront: noop,
    sendToBack: noop,
    bringForward: noop,
    sendBackward: noop,
};

const EditorContext = createContext(defaultEditorContext);

export const useEditor = () => {
    const context = useContext(EditorContext);
    if (!context || context === defaultEditorContext) {
        console.error('useEditor was called outside of EditorProvider. Rendering read-only fallback.');
        return defaultEditorContext;
    }
    return context;
};

// Initial state helpers
const createSlide = (id) => ({
    id: id || `slide-${Date.now()}`,
    elements: [],
    thumbnail: null,
    background: '#ffffff',
    backgroundImage: '',
    backgroundImageMeta: null,
    backgroundImageFit: 'cover'
});

export const EditorProvider = ({ children }) => {
    const { id: presentationId } = useParams();
    const { user } = useAuth();

    // State
    const [presentation, setPresentation] = useState(null);
    const [currentSlideId, setCurrentSlideId] = useState(null);
    const [selectedElementId, setSelectedElementId] = useState(null);
    const [clipboard, setClipboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    // Derived state
    const currentSlideIndex = presentation?.slides?.findIndex(s => s._id === currentSlideId) ?? -1;
    const currentSlide = presentation?.slides?.[currentSlideIndex] || null;

    // Fetch presentation data
    useEffect(() => {
        const fetchPresentation = async () => {
            if (!presentationId || !user) return;

            try {
                setLoading(true);
                const token = localStorage.getItem('token');
                // Mock data for now if API fails or to test structure
                try {
                    const res = await axios.get(`/api/presentations/${presentationId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    // Map slideOrder to slides for frontend consistency
                    const presentationData = {
                        ...res.data.data,
                        slides: res.data.data.slideOrder || []
                    };
                    setPresentation(presentationData);
                    if (presentationData.slides?.length > 0) {
                        setCurrentSlideId(presentationData.slides[0]._id);
                    }
                } catch (err) {
                    // console.warn("Using mock data as API call failed", err);
                    // Fallback mock data structure
                    const mockData = {
                        _id: presentationId,
                        title: "Untitled Presentation",
                        slides: [createSlide('slide-1')]
                    };
                    setPresentation(mockData);
                    setCurrentSlideId(mockData.slides[0].id);
                }
            } catch (err) {
                console.error("Error initializing editor:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPresentation();
    }, [presentationId, user]);

    // Auto-generate presentation thumbnail from first slide
    const thumbnailTimeoutRef = useRef(null);
    const lastThumbnailSignatureRef = useRef(null);

    useEffect(() => {
        const updatePresentationThumbnail = async () => {
            if (!presentation?.slides?.[0] || !presentationId) return;

            const firstSlide = presentation.slides[0];
            const thumbnailSignature = JSON.stringify({
                elements: firstSlide.elements || [],
                background: firstSlide.background,
                backgroundImage: firstSlide.backgroundImage,
                backgroundImageFit: firstSlide.backgroundImageFit
            });

            // Skip if visual data haven't changed
            if (lastThumbnailSignatureRef.current === thumbnailSignature) {
                return;
            }

            lastThumbnailSignatureRef.current = thumbnailSignature;

            // Debounce thumbnail generation
            if (thumbnailTimeoutRef.current) {
                clearTimeout(thumbnailTimeoutRef.current);
            }

            thumbnailTimeoutRef.current = setTimeout(async () => {
                try {
                    const thumbnailDataURL = await generateThumbnail(firstSlide);

                    if (thumbnailDataURL) {
                        // Update backend only (don't update local state to avoid loop)
                        const token = localStorage.getItem('token');
                        await axios.patch(
                            `/api/presentations/${presentationId}`,
                            { thumbnailUrl: thumbnailDataURL },
                            { headers: { Authorization: `Bearer ${token}` } }
                        );
                    }
                } catch (err) {
                    console.error('Failed to generate presentation thumbnail:', err);
                }
            }, 1000); // Wait 1 second after last change
        };

        updatePresentationThumbnail();

        return () => {
            if (thumbnailTimeoutRef.current) {
                clearTimeout(thumbnailTimeoutRef.current);
            }
        };
    }, [presentation?.slides?.[0], presentationId]);

    // Actions
    const updateTitle = useCallback(async (newTitle) => {
        setPresentation(prev => ({ ...prev, title: newTitle }));
        // Simple debounce could be improved, but for now fire and forget or use a timeout
        // Better: use a ref to store timeout
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`/api/presentations/${presentationId}`, { title: newTitle }, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (err) {
            console.error("Failed to save title", err);
        }
    }, [presentationId]);

    const addSlide = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('/api/slides', { presentationId }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const newSlide = res.data.data;

            setPresentation(prev => ({
                ...prev,
                slides: [...(prev.slides || []), newSlide]
            }));
            setCurrentSlideId(newSlide._id); // Assuming backend returns _id
        } catch (err) {
            console.error("Failed to create slide", err);
        }
    }, [presentationId]);

    const deleteSlide = useCallback(async (slideId) => {
        const slideIndex = presentation?.slides.findIndex(s => s._id === slideId);
        if (slideIndex === -1) return;

        const totalSlides = presentation?.slides.length || 0;

        // If it's the only slide, just clear its elements instead of deleting
        if (totalSlides === 1) {
            try {
                const token = localStorage.getItem('token');
                await axios.patch(`/api/slides/${slideId}`, { elements: [] }, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setPresentation(prev => ({
                    ...prev,
                    slides: prev.slides.map(s => s._id === slideId ? { ...s, elements: [] } : s)
                }));
            } catch (err) {
                console.error("Failed to clear slide", err);
            }
            return;
        }

        // Multiple slides - proceed with deletion
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`/api/slides/${slideId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Determine which slide to select next
            let nextSlideId = null;
            if (currentSlideId === slideId) {
                // Try next slide first
                if (slideIndex < totalSlides - 1) {
                    nextSlideId = presentation.slides[slideIndex + 1]._id;
                }
                // Otherwise try previous slide
                else if (slideIndex > 0) {
                    nextSlideId = presentation.slides[slideIndex - 1]._id;
                }
            }

            setPresentation(prev => {
                const newSlides = prev.slides.filter(s => s._id !== slideId);
                return { ...prev, slides: newSlides };
            });

            if (nextSlideId) {
                setCurrentSlideId(nextSlideId);
            }
        } catch (err) {
            console.error("Failed to delete slide", err);
        }
    }, [currentSlideId, presentation]);

    const updateSlide = useCallback(async (slideId, updates) => {
        // Optimistic update
        setPresentation(prev => ({
            ...prev,
            slides: prev.slides.map(s => s._id === slideId ? { ...s, ...updates } : s)
        }));

        // Fire API call
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`/api/slides/${slideId}`, updates, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (err) {
            console.error("Failed to update slide", err);
            // Revert logic would go here
        }
    }, []);

    const addElement = useCallback(async (type, defaultProps = {}) => {
        if (!currentSlideId) return;

        const newElement = {
            id: `el-${Date.now()}`,
            type,
            x: 100,
            y: 100,
            rotation: 0,
            scaleX: 1,
            scaleY: 1,
            ...defaultProps
        };

        if (type === 'text') {
            newElement.text = 'Double click to edit';
            newElement.fontSize = 24;
            newElement.fontFamily = 'Arial';
            newElement.fontStyle = 'normal';
            newElement.textDecoration = '';
            newElement.fill = '#000000';
            newElement.backgroundColor = 'transparent';
            newElement.align = 'left';
            newElement.width = 300;
        } else if (type === 'rect') {
            newElement.width = 100;
            newElement.height = 100;
            newElement.fill = '#a0aec0';
        } else if (type === 'circle') {
            newElement.radiusX = 50;
            newElement.radiusY = 50;
            newElement.fill = '#a0aec0';
            newElement.stroke = '#666';
            newElement.strokeWidth = 0;
        } else if (type === 'triangle') {
            newElement.width = 100;
            newElement.height = 100;
            newElement.fill = '#a0aec0';
            newElement.stroke = '#666';
            newElement.strokeWidth = 0;
        } else if (type === 'star') {
            newElement.numPoints = 5;
            newElement.innerRadius = 30;
            newElement.outerRadius = 50;
            newElement.fill = '#a0aec0';
            newElement.stroke = '#666';
            newElement.strokeWidth = 0;
        } else if (type === 'ellipse') {
            newElement.radiusX = 60;
            newElement.radiusY = 40;
            newElement.fill = '#a0aec0';
            newElement.stroke = '#666';
            newElement.strokeWidth = 0;
        } else if (type === 'line') {
            newElement.points = [0, 0, 150, 0];
            newElement.stroke = '#000';
            newElement.strokeWidth = 3;
        } else if (type === 'arrow') {
            newElement.points = [0, 0, 150, 0];
            newElement.stroke = '#000';
            newElement.strokeWidth = 3;
            newElement.pointerLength = 15;
            newElement.pointerWidth = 15;
        } else if (type === 'image') {
            const w = defaultProps.width || 300;
            const h = defaultProps.height || 200;
            newElement.src = defaultProps.src || 'https://placehold.co/300x200';
            newElement.width = w;
            newElement.height = h;
            newElement.naturalWidth = defaultProps.naturalWidth || w;
            newElement.naturalHeight = defaultProps.naturalHeight || h;
            newElement.crop = defaultProps.crop || { x: 0, y: 0, width: w, height: h };
        }

        const currentSlide = presentation.slides.find(s => s._id === currentSlideId);
        const newElements = [...(currentSlide.elements || []), newElement];

        // Optimistic update
        setPresentation(prev => ({
            ...prev,
            slides: prev.slides.map(s => s._id === currentSlideId ? {
                ...s,
                elements: newElements
            } : s)
        }));
        setSelectedElementId(newElement.id);

        // API Call
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`/api/slides/${currentSlideId}`, { elements: newElements }, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (err) {
            console.error("Failed to add element", err);
        }
    }, [currentSlideId, presentation]);

    const updateElement = useCallback(async (elementId, attrs) => {
        if (!currentSlideId) return;

        // We need to find the slide and element to get current state for merging
        // But for performance, we rely on args.
        // Optimistic update
        let newElements;
        setPresentation(prev => {
            const slide = prev.slides.find(s => s._id === currentSlideId);
            if (!slide) return prev;

            newElements = slide.elements.map(el => el.id === elementId ? { ...el, ...attrs } : el);

            return {
                ...prev,
                slides: prev.slides.map(s => s._id === currentSlideId ? {
                    ...s,
                    elements: newElements
                } : s)
            };
        });

        // Debounce API call needed here for smooth dragging
        // For now, simple fire. In production use lodash.debounce
        try {
            // Note: This is heavy to send ALL elements. 
            // Ideally backend supports PATCH /api/slides/:id/elements/:elId
            // But our controller is simple updateSlide.
            // We use a timeout to debounce saving
            const token = localStorage.getItem('token');
            // Quick hack for debouncing:
            if (window.saveTimeout) clearTimeout(window.saveTimeout);
            window.saveTimeout = setTimeout(async () => {
                await axios.patch(`/api/slides/${currentSlideId}`, { elements: newElements }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }, 500);
        } catch (err) {
            console.error("Failed to update element", err);
        }
    }, [currentSlideId]);

    const deleteElement = useCallback((elementId) => {
        if (!currentSlideId) return;

        setPresentation(prev => ({
            ...prev,
            slides: prev.slides.map(s => s._id === currentSlideId ? {
                ...s,
                elements: s.elements.filter(el => el.id !== elementId)
            } : s)
        }));

        // Clear selection if deleted element was selected
        if (selectedElementId === elementId) {
            setSelectedElementId(null);
        }

        // Optimistic update, sync with backend
        const slide = presentation?.slides.find(s => s._id === currentSlideId);
        if (slide) {
            const newElements = slide.elements.filter(el => el.id !== elementId);
            setTimeout(async () => {
                try {
                    const token = localStorage.getItem('token');
                    await axios.patch(`/api/slides/${currentSlideId}`, { elements: newElements }, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                } catch (err) {
                    console.error("Failed to delete element", err);
                }
            }, 500);
        }
    }, [currentSlideId, selectedElementId, presentation]);

    const copyElement = useCallback((elementId) => {
        if (!currentSlideId) return;

        const slide = presentation?.slides.find(s => s._id === currentSlideId);
        const element = slide?.elements.find(el => el.id === elementId);

        if (element) {
            setClipboard({ ...element });
        }
    }, [currentSlideId, presentation]);

    const pasteElement = useCallback(() => {
        if (!clipboard || !currentSlideId) return;

        const newElement = {
            ...clipboard,
            id: `el-${Date.now()}`,
            x: clipboard.x + 20, // Offset so it's visible
            y: clipboard.y + 20,
        };

        const slide = presentation?.slides.find(s => s._id === currentSlideId);
        const newElements = [...(slide?.elements || []), newElement];

        setPresentation(prev => ({
            ...prev,
            slides: prev.slides.map(s => s._id === currentSlideId ? {
                ...s,
                elements: newElements
            } : s)
        }));

        setSelectedElementId(newElement.id);

        // Sync with backend
        setTimeout(async () => {
            try {
                const token = localStorage.getItem('token');
                await axios.patch(`/api/slides/${currentSlideId}`, { elements: newElements }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } catch (err) {
                console.error("Failed to paste element", err);
            }
        }, 500);
    }, [clipboard, currentSlideId, presentation]);

    const reorderSlides = useCallback(async (startIndex, endIndex) => {
        setPresentation(prev => {
            const newSlides = Array.from(prev.slides);
            const [reorderedItem] = newSlides.splice(startIndex, 1);
            newSlides.splice(endIndex, 0, reorderedItem);
            return { ...prev, slides: newSlides };
        });

        // Sync with backend - Update Presentation slideOrder
        try {
            const token = localStorage.getItem('token');
            // We need to get the new order of IDs
            // Since we setPresentation above, we can't easily access the new state immediately in closure.
            // But we can replicate the logic locally.
            const newSlides = Array.from(presentation.slides);
            const [reorderedItem] = newSlides.splice(startIndex, 1);
            newSlides.splice(endIndex, 0, reorderedItem);
            const slideOrder = newSlides.map(s => s._id);

            await axios.patch(`/api/presentations/${presentationId}`, { slideOrder }, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (err) {
            console.error("Failed to reorder slides", err);
        }
    }, [presentation, presentationId]);

    const bringToFront = useCallback((elementId) => {
        if (!currentSlideId) return;

        const slide = presentation?.slides.find(s => s._id === currentSlideId);
        if (!slide) return;

        const elementIndex = slide.elements.findIndex(el => el.id === elementId);
        if (elementIndex === -1 || elementIndex === slide.elements.length - 1) return;

        const newElements = [...slide.elements];
        const [element] = newElements.splice(elementIndex, 1);
        newElements.push(element);

        updateSlide(currentSlideId, { elements: newElements });
    }, [currentSlideId, presentation, updateSlide]);

    const sendToBack = useCallback((elementId) => {
        if (!currentSlideId) return;

        const slide = presentation?.slides.find(s => s._id === currentSlideId);
        if (!slide) return;

        const elementIndex = slide.elements.findIndex(el => el.id === elementId);
        if (elementIndex === -1 || elementIndex === 0) return;

        const newElements = [...slide.elements];
        const [element] = newElements.splice(elementIndex, 1);
        newElements.unshift(element);

        updateSlide(currentSlideId, { elements: newElements });
    }, [currentSlideId, presentation, updateSlide]);

    const bringForward = useCallback((elementId) => {
        if (!currentSlideId) return;

        const slide = presentation?.slides.find(s => s._id === currentSlideId);
        if (!slide) return;

        const elementIndex = slide.elements.findIndex(el => el.id === elementId);
        if (elementIndex === -1 || elementIndex === slide.elements.length - 1) return;

        const newElements = [...slide.elements];
        [newElements[elementIndex], newElements[elementIndex + 1]] =
            [newElements[elementIndex + 1], newElements[elementIndex]];

        updateSlide(currentSlideId, { elements: newElements });
    }, [currentSlideId, presentation, updateSlide]);

    const sendBackward = useCallback((elementId) => {
        if (!currentSlideId) return;

        const slide = presentation?.slides.find(s => s._id === currentSlideId);
        if (!slide) return;

        const elementIndex = slide.elements.findIndex(el => el.id === elementId);
        if (elementIndex === -1 || elementIndex === 0) return;

        const newElements = [...slide.elements];
        [newElements[elementIndex], newElements[elementIndex - 1]] =
            [newElements[elementIndex - 1], newElements[elementIndex]];

        updateSlide(currentSlideId, { elements: newElements });
    }, [currentSlideId, presentation, updateSlide]);

    const value = {
        presentation,
        currentSlide,
        currentSlideId,
        currentSlideIndex,
        selectedElementId,
        clipboard,
        loading,
        saving,
        error,
        setCurrentSlideId,
        setSelectedElementId,
        updateTitle,
        addSlide,
        deleteSlide,
        updateSlide,
        reorderSlides,
        addElement,
        updateElement,
        deleteElement,
        copyElement,
        pasteElement,
        bringToFront,
        sendToBack,
        bringForward,
        sendBackward,
    };


    return (
        <EditorContext.Provider value={value}>
            {children}
        </EditorContext.Provider>
    );
};
