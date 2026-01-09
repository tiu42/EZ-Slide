import Template from '../models/Template.js';
import Presentation from '../models/Presentation.js';
import Slide from '../models/Slide.js';

// Get all published templates (available to all authenticated users)
export const getAllTemplates = async (req, res) => {
    try {
        const templates = await Template.find({ isPublished: true })
            .populate({
                path: 'presentationId',
                populate: { path: 'slideOrder' }
            })
            .populate('creatorId', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: templates.length,
            data: templates
        });
    } catch (err) {
        console.error('Error fetching templates:', err);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// Get a single template by ID (available to all authenticated users)
export const getTemplateById = async (req, res) => {
    try {
        const { id } = req.params;

        const template = await Template.findById(id)
            .populate({
                path: 'presentationId',
                populate: { path: 'slideOrder' }
            })
            .populate('creatorId', 'name email');

        if (!template) {
            return res.status(404).json({
                success: false,
                message: "Template not found"
            });
        }

        res.status(200).json({
            success: true,
            data: template
        });
    } catch (err) {
        console.error('Error fetching template by ID:', err);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// Create a new template (admin only)
export const createTemplate = async (req, res) => {
    try {
        const { presentationId, title, description, category, tags, thumbnailUrl, isPublished } = req.body;

        // Validate required fields
        if (!presentationId) {
            return res.status(400).json({
                success: false,
                message: "Presentation ID is required"
            });
        }

        // Check if presentation exists
        const presentation = await Presentation.findById(presentationId);
        if (!presentation) {
            return res.status(404).json({
                success: false,
                message: "Presentation not found"
            });
        }

        // Create new template
        const newTemplate = new Template({
            presentationId,
            title: title || presentation.title,
            description: description || '',
            category: category || 'General',
            tags: tags || [],
            thumbnailUrl: thumbnailUrl || presentation.thumbnailUrl || '',
            isPublished: isPublished !== undefined ? isPublished : true,
            creatorId: req.user.id
        });

        await newTemplate.save();

        const savedTemplate = await Template.findById(newTemplate._id)
            .populate({
                path: 'presentationId',
                populate: { path: 'slideOrder' }
            })
            .populate('creatorId', 'name email');

        res.status(201).json({
            success: true,
            message: "Template created successfully",
            data: savedTemplate
        });
    } catch (err) {
        console.error('Error creating template:', err);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// Update a template (admin only)
export const updateTemplate = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const template = await Template.findById(id);

        if (!template) {
            return res.status(404).json({
                success: false,
                message: "Template not found"
            });
        }

        // If presentationId is being updated, validate it exists
        if (updates.presentationId && updates.presentationId !== template.presentationId.toString()) {
            const presentation = await Presentation.findById(updates.presentationId);
            if (!presentation) {
                return res.status(404).json({
                    success: false,
                    message: "Presentation not found"
                });
            }
        }

        // Update only provided fields
        const allowedUpdates = ['presentationId', 'title', 'description', 'category', 'tags', 'thumbnailUrl', 'isPublished'];
        allowedUpdates.forEach(field => {
            if (updates[field] !== undefined) {
                template[field] = updates[field];
            }
        });

        await template.save();

        const updatedTemplate = await Template.findById(id)
            .populate({
                path: 'presentationId',
                populate: { path: 'slideOrder' }
            })
            .populate('creatorId', 'name email');

        res.status(200).json({
            success: true,
            message: "Template updated successfully",
            data: updatedTemplate
        });
    } catch (err) {
        console.error('Error updating template:', err);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// Delete a template (admin only)
export const deleteTemplate = async (req, res) => {
    try {
        const { id } = req.params;

        const template = await Template.findById(id);

        if (!template) {
            return res.status(404).json({
                success: false,
                message: "Template not found"
            });
        }

        // Delete the template (do NOT delete the referenced presentation)
        await Template.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Template deleted successfully",
            data: { id }
        });
    } catch (err) {
        console.error('Error deleting template:', err);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};
// Apply a template (create a new presentation from a template)
export const applyTemplate = async (req, res) => {
    console.log(`[applyTemplate] Request received for template ID: ${req.params.id}`);
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const { title } = req.body;

        console.log('[applyTemplate] Finding template...');
        const template = await Template.findById(id).populate({
            path: 'presentationId',
            populate: { path: 'slideOrder' }
        });

        if (!template) {
            console.log('[applyTemplate] Template not found');
            return res.status(404).json({
                success: false,
                message: "Template not found"
            });
        }

        // Check availability
        if (!template.isPublished && req.user.role !== 'admin') {
            console.log('[applyTemplate] Template not published and user not admin');
            return res.status(403).json({
                success: false,
                message: "Template is not available"
            });
        }

        const originalPresentation = template.presentationId;
        if (!originalPresentation) {
            console.log('[applyTemplate] Associated presentation not found');
            return res.status(404).json({
                success: false,
                message: "Associated presentation not found"
            });
        }
        console.log(`[applyTemplate] Found original presentation: ${originalPresentation._id}`);

        // 1. Create the new presentation first (with empty slideOrder initially)
        console.log('[applyTemplate] Creating new presentation...');
        const newPresentation = new Presentation({
            userId,
            title: title || `${template.title} - Copy`,
            slideOrder: [],
            thumbnailUrl: originalPresentation.thumbnailUrl
        });

        await newPresentation.save();
        console.log(`[applyTemplate] New presentation created: ${newPresentation._id}`);

        // 2. Duplicate slides with the new presentation ID
        console.log(`[applyTemplate] Duplicating ${originalPresentation.slideOrder.length} slides...`);
        const newSlideIds = [];
        for (const slide of originalPresentation.slideOrder) {
            try {
                const newSlide = new Slide({
                    presentationId: newPresentation._id, // Set the ID immediately
                    elements: slide.elements,
                    background: slide.background,
                    backgroundImage: slide.backgroundImage,
                    backgroundImageMeta: slide.backgroundImageMeta,
                    backgroundImageFit: slide.backgroundImageFit,
                    notes: slide.notes
                });
                await newSlide.save();
                newSlideIds.push(newSlide._id);
            } catch (slideError) {
                console.error('[applyTemplate] Error creating slide:', slideError);
                throw slideError; // Re-throw to catch in main block
            }
        }
        console.log('[applyTemplate] Slides duplicated successfully');

        // 3. Update the presentation with the new slide order
        newPresentation.slideOrder = newSlideIds;
        await newPresentation.save();
        console.log('[applyTemplate] Presentation updated with slide order');

        // Skip complex population for now to isolate the error
        console.log('[applyTemplate] Sending response...');

        return res.status(201).json({
            success: true,
            message: "Template applied successfully",
            data: newPresentation
        });
    } catch (err) {
        console.error('[applyTemplate] Detailed Error:', err);
        // Clean up partial data if possible
        res.status(500).json({
            success: false,
            message: `Server logged error: ${err.message}`
        });
    }
};
