import express from 'express';
import {
    getAllTemplates,
    getTemplateById,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    applyTemplate
} from '../controllers/templateController.js';
import { protect } from '../middleware/auth.js';
import { adminOnly } from '../middleware/adminAuth.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(protect);

// Get all published templates (available to all authenticated users)
router.get('/', getAllTemplates);

// Get a specific template by ID (available to all authenticated users)
router.get('/:id', getTemplateById);

// Apply a template (available to all authenticated users)
router.post('/:id/apply', applyTemplate);

// Create a new template (admin only)
router.post('/', adminOnly, createTemplate);

// Update a template (admin only)
router.patch('/:id', adminOnly, updateTemplate);

// Delete a template (admin only)
router.delete('/:id', adminOnly, deleteTemplate);

export default router;
