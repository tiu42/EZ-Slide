import express from 'express';
import { createSlide, updateSlide, deleteSlide } from '../controllers/slideController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.post('/', createSlide);
router.patch('/:id', updateSlide);
router.delete('/:id', deleteSlide);

export default router;
