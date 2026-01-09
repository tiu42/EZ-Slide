
/**
 * Parses the Slide model data for rendering.
 * @param {Object} slide - The Slide model object (from backend).
 * @returns {Array} - Array of shape objects ready for Konva rendering.
 */
export const parseSlide = (slide) => {
    if (!slide) return [];

    // Default empty if no canvasData
    if (!slide.canvasData) return [];

    try {
        const parsedData = JSON.parse(slide.canvasData);
        // Ensure it's an array or the expected structure
        // If the saved data is the whole Stage export, we might need to extract the children of the Layer.
        // For simplicity, let's assume canvasData is saved as an array of Shapes.

        if (Array.isArray(parsedData)) {
            return parsedData;
        }

        // Handle Konva Stage JSON export format
        if (parsedData.className === 'Stage' && parsedData.children) {
            // Find the first Layer
            const layer = parsedData.children.find(c => c.className === 'Layer');
            if (layer && layer.children) {
                return layer.children;
            }
        }

        return [];

    } catch (e) {
        console.error("Failed to parse slide canvasData:", e);
        return [];
    }
};
