import Slide from '../models/Slide.js';
import Presentation from '../models/Presentation.js';

// Create a new slide
export const createSlide = async (req, res) => {
    try {
        const { presentationId } = req.body;

        // Confirm presentation exists and belongs to user
        const presentation = await Presentation.findOne({
            _id: presentationId,
            userId: req.user.id
        });

        if (!presentation) {
            return res.status(404).json({
                success: false,
                message: "Presentation not found"
            });
        }

        const newSlide = new Slide({
            presentationId,
            elements: [],
            background: '#ffffff'
        });

        await newSlide.save();

        // Add to presentation order
        presentation.slideOrder.push(newSlide._id);
        await presentation.save();

        res.status(201).json({
            success: true,
            data: newSlide
        });

    } catch (err) {
        console.error("Error creating slide:", err);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// Update a slide
export const updateSlide = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // We verify the slide belongs to a presentation owned by the user
        // This requires a join or two-step check. 
        // For efficiency, we can just check if the slide exists, 
        // then check its presentation's owner.

        const slide = await Slide.findById(id);
        if (!slide) {
            return res.status(404).json({
                success: false,
                message: "Slide not found"
            });
        }

        const presentation = await Presentation.findOne({
            _id: slide.presentationId,
            userId: req.user.id
        });

        if (!presentation) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to update this slide"
            });
        }

        // Apply updates
        Object.keys(updates).forEach(key => {
            if (key !== '_id' && key !== 'presentationId' && key !== 'createdAt' && key !== 'updatedAt') {
                slide[key] = updates[key];
            }
        });

        await slide.save();

        res.status(200).json({
            success: true,
            data: slide
        });

    } catch (err) {
        console.error("Error updating slide:", err);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// Delete a slide
export const deleteSlide = async (req, res) => {
    try {
        const { id } = req.params;

        const slide = await Slide.findById(id);
        if (!slide) {
            return res.status(404).json({
                success: false,
                message: "Slide not found"
            });
        }

        const presentation = await Presentation.findOne({
            _id: slide.presentationId,
            userId: req.user.id
        });

        if (!presentation) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to delete this slide"
            });
        }

        await Slide.findByIdAndDelete(id);

        // Remove from presentation slideOrder
        presentation.slideOrder = presentation.slideOrder.filter(
            slideId => slideId.toString() !== id
        );
        await presentation.save();

        res.status(200).json({
            success: true,
            message: "Slide deleted"
        });

    } catch (err) {
        console.error("Error deleting slide:", err);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};
