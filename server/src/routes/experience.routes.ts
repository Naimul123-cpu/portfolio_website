import express from 'express';
import { getAllExperience, createExperience, updateExperience, deleteExperience, reorderExperience } from '../controllers/experience.controller';
import { protect, adminOnly } from '../middleware/auth.middleware';
import upload from '../middleware/upload.middleware';

const router = express.Router();

router.get('/', getAllExperience);
router.post('/', protect, adminOnly, upload.single('logo'), createExperience);
router.put('/:id', protect, adminOnly, upload.single('logo'), updateExperience);
router.delete('/:id', protect, adminOnly, deleteExperience);
router.patch('/reorder', protect, adminOnly, reorderExperience);

export default router;
