import Presentation from '../models/Presentation.js'
import Slide from '../models/Slide.js'

// Get all presentations for a user
export const getUserPresentations = async (req, res) => {
    try {
        const userId = req.user.id; // From auth middleware
        
        const presentations = await Presentation.find({ userId })
            .populate('slideOrder')
            .sort({ updatedAt: -1 }); // Sort by most recently updated
        
        res.status(200).json({
            success: true,
            count: presentations.length,
            data: presentations
        });
    } catch (err) {
        console.error('Error fetching presentations', err);
        res.status(500).json({ 
            success: false,
            message: "Server error" 
        });
    }
}

// Get a single presentation by ID
export const getUserPresentationById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const presentation = await Presentation.findOne({ 
            _id: id, 
            userId 
        }).populate('slideOrder');

        if (!presentation) {
            return res.status(404).json({ 
                success: false,
                message: "Presentation not found" 
            });
        }

        res.status(200).json({
            success: true,
            data: presentation
        });
    } catch (err) {
        console.error('Error fetching presentation by ID', err);
        res.status(500).json({ 
            success: false,
            message: "Server error" 
        });
    }
}

// Create or update a presentation
export const savePresentations = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id, title, slideOrder, thumbnailUrl } = req.body || {};

        if (id) {
            // Update existing presentation
            const presentation = await Presentation.findOne({ _id: id, userId });

            if (!presentation) {
                return res.status(404).json({ 
                    success: false,
                    message: "Presentation not found" 
                });
            }

            // Update fields
            if (title !== undefined) presentation.title = title;
            if (slideOrder !== undefined) presentation.slideOrder = slideOrder;
            if (thumbnailUrl !== undefined) presentation.thumbnailUrl = thumbnailUrl;

            await presentation.save();

            const updatedPresentation = await Presentation.findById(id).populate('slideOrder');

            res.status(200).json({
                success: true,
                message: "Presentation updated successfully",
                data: updatedPresentation
            });
        } else {
            // Create new presentation
            const newPresentation = new Presentation({
                userId,
                title: title || 'Untitled Presentation',
                slideOrder: slideOrder || [],
                thumbnailUrl: thumbnailUrl || ''
            });

            await newPresentation.save();

            const savedPresentation = await Presentation.findById(newPresentation._id).populate('slideOrder');

            res.status(201).json({
                success: true,
                message: "Presentation created successfully",
                data: savedPresentation
            });
        }
    } catch (err) {
        console.error('Error saving presentation', err);
        res.status(500).json({ 
            success: false,
            message: "Server error" 
        });
    }
}

// Update presentation (PATCH)
export const updatePresentation = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const updates = req.body;

        const presentation = await Presentation.findOne({ _id: id, userId });

        if (!presentation) {
            return res.status(404).json({ 
                success: false,
                message: "Presentation not found" 
            });
        }

        // Update only provided fields
        Object.keys(updates).forEach(key => {
            if (updates[key] !== undefined && key !== '_id' && key !== 'userId') {
                presentation[key] = updates[key];
            }
        });

        await presentation.save();

        const updatedPresentation = await Presentation.findById(id).populate('slideOrder');

        res.status(200).json({
            success: true,
            message: "Presentation updated successfully",
            data: updatedPresentation
        });
    } catch (err) {
        console.error('Error updating presentation', err);
        res.status(500).json({ 
            success: false,
            message: "Server error" 
        });
    }
}

// Delete a presentation
export const deletePresentations = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const presentation = await Presentation.findOne({ _id: id, userId });

        if (!presentation) {
            return res.status(404).json({ 
                success: false,
                message: "Presentation not found" 
            });
        }

        // Optional: Delete associated slides
        if (presentation.slideOrder && presentation.slideOrder.length > 0) {
            await Slide.deleteMany({ _id: { $in: presentation.slideOrder } });
        }

        await Presentation.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Presentation deleted successfully",
            data: { id }
        });
    } catch (err) {
        console.error('Error deleting presentation', err);
        res.status(500).json({ 
            success: false,
            message: "Server error" 
        });
    }
}

// Duplicate a presentation
export const duplicatePresentation = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const originalPresentation = await Presentation.findOne({ 
            _id: id, 
            userId 
        }).populate('slideOrder');

        if (!originalPresentation) {
            return res.status(404).json({ 
                success: false,
                message: "Presentation not found" 
            });
        }

        // Duplicate slides
        const newSlideIds = [];
        for (const slide of originalPresentation.slideOrder) {
            const newSlide = new Slide({
                presentationId: null, // Will be set after creating presentation
                elements: slide.elements,
                backgroundStyle: slide.backgroundStyle
            });
            await newSlide.save();
            newSlideIds.push(newSlide._id);
        }

        // Create new presentation
        const newPresentation = new Presentation({
            userId,
            title: `${originalPresentation.title} (Copy)`,
            slideOrder: newSlideIds,
            thumbnailUrl: originalPresentation.thumbnailUrl
        });

        await newPresentation.save();

        // Update slides with new presentation ID
        await Slide.updateMany(
            { _id: { $in: newSlideIds } },
            { presentationId: newPresentation._id }
        );

        const duplicatedPresentation = await Presentation.findById(newPresentation._id).populate('slideOrder');

        res.status(201).json({
            success: true,
            message: "Presentation duplicated successfully",
            data: duplicatedPresentation
        });
    } catch (err) {
        console.error('Error duplicating presentation', err);
        res.status(500).json({ 
            success: false,
            message: "Server error" 
        });
    }
}