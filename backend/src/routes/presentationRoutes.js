import express from 'express';
import { 
  getUserPresentations, 
  getUserPresentationById, 
  savePresentations, 
  updatePresentation,
  deletePresentations,
  duplicatePresentation
} from '../controllers/presentationController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(protect);

// Get all presentations for the logged-in user
router.get('/', getUserPresentations);

// Get a specific presentation by ID
router.get('/:id', getUserPresentationById);

// Create or update a presentation (used for saving)
router.post('/', savePresentations);

// Update a presentation (partial update)
router.patch('/:id', updatePresentation);

// Delete a presentation
router.delete('/:id', deletePresentations);

// Duplicate a presentation
router.post('/:id/duplicate', duplicatePresentation);

export default router;
