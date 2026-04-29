import express from 'express';
import { getAllExperience, createExperience, updateExperience, deleteExperience, reorderExperience, uploadWorkSamples, deleteWorkSample } from '../controllers/experience.controller';
import { protect, adminOnly } from '../middleware/auth.middleware';
import upload from '../middleware/upload.middleware';

const router = express.Router();

router.get('/', getAllExperience);
router.post('/', protect, adminOnly, upload.single('logo'), createExperience);
router.put('/:id', protect, adminOnly, upload.single('logo'), updateExperience);
router.delete('/:id', protect, adminOnly, deleteExperience);
router.patch('/reorder', protect, adminOnly, reorderExperience);
router.post('/:id/work-samples', protect, adminOnly, upload.array('samples'), uploadWorkSamples);
router.delete('/:id/work-samples/:sampleId', protect, adminOnly, deleteWorkSample);

export default router;
